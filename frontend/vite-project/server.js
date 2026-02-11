/* eslint-env node */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import cors from 'cors';

const app = express();

// CORS設定（フロントエンドからのアクセス許可）
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // 必要に応じて制限
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // クラウドDB接続用
});

/**
 * 1. 同期 (Sync) API
 * - 管理画面の設定を保存し、回答用テーブルの枠を初期化します。
 */
app.post('/workspaces/sync', async (req, res) => {
  const { 
    workspaceId, rows, cols, tokens, 
    className, limitDate, message, isOpened, 
    applicants 
  } = req.body;
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // 空文字が来た場合に NULL に変換（TIMESTAMP型エラー防止）
    const safeLimitDate = limitDate ? limitDate : null;

    // A. フォーム設定の保存 (Upsert)
    await client.query(
      `INSERT INTO form_settings (
         workspace_id, rows, cols, tokens, class_name, limit_date, message, is_opened, updated_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       ON CONFLICT (workspace_id) DO UPDATE 
       SET 
         rows = EXCLUDED.rows,
         cols = EXCLUDED.cols,
         tokens = EXCLUDED.tokens,
         class_name = EXCLUDED.class_name,
         limit_date = EXCLUDED.limit_date,
         message = EXCLUDED.message,
         is_opened = EXCLUDED.is_opened,
         updated_at = NOW()`,
      [
        workspaceId,
        JSON.stringify(rows),
        JSON.stringify(cols),
        JSON.stringify(tokens),
        className,
        safeLimitDate,
        message,
        isOpened ?? true // デフォルトtrue
      ]
    );

    // B. 保護者回答テーブルの初期化 (Upsert)
    // 名前などの個人情報は持たず、IDとTokenのみ登録
    for (const app of applicants) {
      await client.query(
        `INSERT INTO guardian_responses (id, workspace_id, token, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (id) DO UPDATE
         SET token = EXCLUDED.token, updated_at = NOW()
         -- preferred_dates は更新しない（保護者の回答を維持）`,
        [app.id, workspaceId, app.token]
      );
    }

    await client.query('COMMIT');
    console.log(`✅ Synced workspace: ${workspaceId}`);
    res.json({ success: true });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Sync Error:', err);
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

/**
 * 2. ログイン / 検証 (Verify) API
 * - トークンから設定と回答状況を取得します。
 */
app.post('/workspaces/:id/verify', async (req, res) => {
  const { token } = req.body;
  const { id: workspaceId } = req.params;

  try {
    // 設定を取得
    const settingsRes = await pool.query(
      'SELECT * FROM form_settings WHERE workspace_id = $1', 
      [workspaceId]
    );
    
    // 回答データを取得
    const responseRes = await pool.query(
      'SELECT * FROM guardian_responses WHERE workspace_id = $1 AND token = $2', 
      [workspaceId, token]
    );

    if (settingsRes.rows.length === 0) {
      return res.status(404).json({ error: 'フォームが見つかりません' });
    }
    if (responseRes.rows.length === 0) {
      return res.status(401).json({ error: '無効な認証コードです' });
    }

    const setting = settingsRes.rows[0];
    const response = responseRes.rows[0];

    // 公開停止チェック（isOpened = false なら拒否）
    if (setting.is_opened === false) {
       return res.status(403).json({ error: '現在、回答の受付を停止しています' });
    }

    // クライアントへ返すデータ
    res.json({
      token: response.token,
      preferred_dates: response.preferred_dates || [],
      
      // スケジュール設定
      schedule: { 
        rows: setting.rows, 
        cols: setting.cols 
      },
      
      // 表示用設定
      settings: {
        className: setting.class_name,
        limitDate: setting.limit_date, // TIMESTAMP文字列として返却
        message: setting.message,
        isOpened: setting.is_opened
      }
    });

  } catch (err) {
    console.error('Verify Error:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * 3. 回答送信 (Submission) API
 */
app.post('/workspaces/:id/submissions', async (req, res) => {
  const { token, preferred_dates } = req.body;
  const { id: workspaceId } = req.params;

  try {
    const result = await pool.query(
      `UPDATE guardian_responses 
       SET preferred_dates = $1, updated_at = NOW() 
       WHERE workspace_id = $2 AND token = $3`,
      [JSON.stringify(preferred_dates), workspaceId, token]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ error: '更新対象が見つかりません' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Submission Error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));


// --- 追加: 管理画面用・回答データ取得API ---
app.get('/workspaces/:id/responses', async (req, res) => {
  const { id } = req.params;
  try {
    // トークンと回答内容だけを取得（個人情報はDBにないのでトークンで紐付ける）
    const result = await pool.query(
      'SELECT token, preferred_dates FROM guardian_responses WHERE workspace_id = $1', 
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch Responses Error:', err);
    res.status(500).json({ error: err.message });
  }
});
// ------------------------------------------