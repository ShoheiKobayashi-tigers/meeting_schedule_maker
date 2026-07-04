// frontend/vite-project/functions/api/[[route]].js
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/cloudflare-pages';
import { Pool } from '@neondatabase/serverless';

// '/api' から始まるURLをすべてこのアプリで処理する
const app = new Hono().basePath('/api');

// CORS設定（Cloudflare Pages上では同じドメインになるため基本的に全許可でOK）
app.use('/*', cors());

// =========================================================================
// ⏰ Neonコールドスタート対策：全APIの実行前にDBを1回叩き起こすミドルウェア
// =========================================================================
app.use('/*', async (c, next) => {
  // 環境変数がない場合や、特定の静的ファイル・GETリクエスト等を除外したい場合はここで制御可能
  if (c.env && c.env.DATABASE_URL) {
    const start = Date.now();
    try {
      // 既存のPoolインスタンスを利用して、超軽量なクエリでコネクションを確立
      const wakeupPool = new Pool({ connectionString: c.env.DATABASE_URL });
      await wakeupPool.query('SELECT 1');
      
      // ログに起床にかかった時間を記録（デバッグ用）
      console.log(`[Neon Wakeup] Database is awake. (Time: ${Date.now() - start}ms)`);
    } catch (err) {
      // 万が一ここでエラーが起きても、本番のAPI処理側でリトライできるようにログ出力のみに留める
      console.error('[Neon Wakeup Error] Failed to nudge database:', err.message);
    }
  }
  
  // 次の実際のAPI（/sync や /verify など）へ処理をパスする
  await next();
});

/**
 * 1. 同期 (Sync) API
 */
app.post('/workspaces/sync', async (c) => {
  const body = await c.req.json();
  const { workspaceId, rows, cols, availability, tokens, className, limitDate, message, isOpened, applicants, eventName } = body;
  
  // Cloudflareの環境変数は `c.env` から取得します
  const pool = new Pool({ connectionString: c.env.DATABASE_URL });
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const safeLimitDate = limitDate ? limitDate : null;

    await client.query(
      `INSERT INTO form_settings (
         workspace_id, rows, cols, availability, tokens, class_name, limit_date, message, is_opened, event_name, updated_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
       ON CONFLICT (workspace_id) DO UPDATE 
       SET 
         rows = EXCLUDED.rows, cols = EXCLUDED.cols, availability = EXCLUDED.availability, tokens = EXCLUDED.tokens, class_name = EXCLUDED.class_name,
         limit_date = EXCLUDED.limit_date, message = EXCLUDED.message, is_opened = EXCLUDED.is_opened,
         event_name = EXCLUDED.event_name, updated_at = NOW()`,
      [
        workspaceId,
        JSON.stringify(rows || []),
        JSON.stringify(cols || []),
        JSON.stringify(availability || []),
        JSON.stringify(tokens || []),
        className || null, // ★ undefinedの場合は null に変換
        safeLimitDate,
        message || null,   // ★ undefinedの場合は null に変換
        isOpened ?? true,
        eventName || null  // ★ undefinedの場合は null に変換
      ]
    );

    for (const app of applicants) {
      await client.query(
        `INSERT INTO guardian_responses (id, workspace_id, token, updated_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (id) DO UPDATE
         SET token = EXCLUDED.token, updated_at = NOW()`,
        [app.id, workspaceId, app.token]
      );
    }

    await client.query('COMMIT');
    return c.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    // 🌟 エラーコードを追加 (同期失敗)
    return c.json({ code: 'SYNC_FAILED', error: err.message }, 500);
  } finally {
    client.release();
  }
});

/**
 * 2. ログイン / 検証 (Verify) API
 */
app.post('/workspaces/:id/verify', async (c) => {
  const { token } = await c.req.json();
  const workspaceId = c.req.param('id');
  const pool = new Pool({ connectionString: c.env.DATABASE_URL });

  try {
    const settingsRes = await pool.query('SELECT * FROM form_settings WHERE workspace_id = $1', [workspaceId]);
    const responseRes = await pool.query('SELECT * FROM guardian_responses WHERE workspace_id = $1 AND token = $2', [workspaceId, token]);

    if (settingsRes.rows.length === 0) return c.json({ code: 'WORKSPACE_NOT_FOUND', error: 'フォームが見つかりません' }, 404);
    if (responseRes.rows.length === 0) return c.json({ code: 'AUTH_CODE_INVALID', error: '無効な認証コードです' }, 401);

    const setting = settingsRes.rows[0];
    const response = responseRes.rows[0];

    if (setting.is_opened === false) return c.json({ code: 'FORM_CLOSED', error: '現在、回答の受付を停止しています' }, 403);

    return c.json({
      token: response.token,
      preferred_dates: response.preferred_dates || [],
      // ★ availability: setting.availability を追加
      schedule: { rows: setting.rows, cols: setting.cols, availability: setting.availability },
      settings: { className: setting.class_name, limitDate: setting.limit_date, message: setting.message, isOpened: setting.is_opened }
    });
  } catch (err) {
    return c.json({ code: 'UNKNOWN_ERROR', error: err.message }, 500);
  }
});

/**
 * 3. 回答送信 (Submission) API
 */
app.post('/workspaces/:id/submissions', async (c) => {
  const { token, preferred_dates } = await c.req.json();
  const workspaceId = c.req.param('id');
  const pool = new Pool({ connectionString: c.env.DATABASE_URL });

  try {
    const result = await pool.query(
      `UPDATE guardian_responses SET preferred_dates = $1, updated_at = NOW() WHERE workspace_id = $2 AND token = $3`,
      [JSON.stringify(preferred_dates), workspaceId, token]
    );
    if (result.rowCount === 0) return c.json({ code: 'SUBMISSION_TARGET_NOT_FOUND', error: '更新対象が見つかりません' }, 400);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ code: 'UNKNOWN_ERROR', error: err.message }, 500);
  }
});

/**
 * 管理画面用・回答データ取得API
 */
app.get('/workspaces/:id/responses', async (c) => {
  const workspaceId = c.req.param('id');
  const pool = new Pool({ connectionString: c.env.DATABASE_URL });
  
  try {
    const result = await pool.query('SELECT token, preferred_dates FROM guardian_responses WHERE workspace_id = $1', [workspaceId]);
    return c.json(result.rows);
  } catch (err) {
    return c.json({code: 'FETCH_RESPONSES_FAILED', error: err.message }, 500);
  }
});

/**
 * 4. 公開設定取得 (Public Info) API
 */
app.get('/workspaces/:id/public', async (c) => {
  const workspaceId = c.req.param('id');
  const pool = new Pool({ connectionString: c.env.DATABASE_URL });

  try {
    const result = await pool.query('SELECT class_name, message, is_opened, limit_date, event_name FROM form_settings WHERE workspace_id = $1', [workspaceId]);
    if (result.rows.length === 0) return c.json({ code: 'WORKSPACE_NOT_FOUND', error: 'フォームが見つかりません' }, 404);
    return c.json(result.rows[0]);
  } catch (err) {
    return c.json({code: 'UNKNOWN_ERROR', error: err.message }, 500);
  }
});

// =========================================================================
// 🔒 API ①: ワンタイムパスワードの仮チェック (Step 1 用)
// =========================================================================
app.post('/workspaces/restore/verify-otp', async (c) => {
  const { otp } = await c.req.json();

  if (!otp) {
    return c.json({ error: 'ワンタイムパスワードを入力してください' }, 400);
  }

  // 既存のAPIと同様にPoolから接続を作成
  const pool = new Pool({ connectionString: c.env.DATABASE_URL });

  try {
    // $1 プレースホルダーを使用したクエリに修正
    const result = await pool.query(
      `SELECT workspace_id 
       FROM public.form_settings 
       WHERE otp = $1 
         AND otp_generated_at >= NOW() - INTERVAL '7 days'
       LIMIT 1`,
      [otp]
    );

    if (result.rows.length === 0) {
      return c.json({ code: 'RESTORE_OTP_INVALID', error: '無効なワンタイムパスワードか、有効期限が切れています。' }, 400);
    }

    return c.json({ success: true, message: 'OTP verification successful' });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return c.json({ code: 'UNKNOWN_ERROR', error: 'サーバー内部でエラーが発生しました' }, 500);
  }
});

// =========================================================================
// 🔒 API ②: トークン完全一致検証 ＆ データ返却 ＆ OTP即時失効 (Step 2 用)
// =========================================================================
app.post('/workspaces/restore/execute', async (c) => {
  const { workspace_id, otp, excelTokens } = await c.req.json();

  if (!workspace_id || !otp || !excelTokens || !Array.isArray(excelTokens)) {
    return c.json({ error: '不完全なリクエストパラメータです' }, 400);
  }

  const pool = new Pool({ connectionString: c.env.DATABASE_URL });
  const client = await pool.connect();

  try {
    // 既存の /workspaces/sync と同じスタイルで明示的にトランザクションを開始
    await client.query('BEGIN');

    // 1. 該当するワークスペースから、OTPが有効（1週間以内）な設定データを取得
    const settingsResult = await client.query(
      `SELECT * 
       FROM public.form_settings 
       WHERE workspace_id = $1 
         AND otp = $2
         AND otp_generated_at >= NOW() - INTERVAL '7 days'`,
      [workspace_id, otp]
    );

    if (settingsResult.rows.length === 0) {
      throw new Error('RESTORE_OTP_INVALID');
    }

    const formSettings = settingsResult.rows[0];

    // 2. 【核心】エクセルからパースしたトークンと、DBのtokensの完全一致検証
    const dbTokens = typeof formSettings.tokens === 'string' 
      ? JSON.parse(formSettings.tokens) 
      : formSettings.tokens;

    if (!Array.isArray(dbTokens) || dbTokens.length !== excelTokens.length) {
      throw new Error('RESTORE_TOKENS_MISMATCH');
    }

    // 配列の要素がすべて一致しているか検証（順不同）
    const isMatch = excelTokens.every(t => dbTokens.includes(t)) && dbTokens.every(t => excelTokens.includes(t));
    if (!isMatch) {
      throw new Error('RESTORE_TOKENS_MISMATCH');
    }

    // 3. 検証をすべてクリアしたため、同一トランザクション内でOTPを即座にNULL（失効）にする！
    await client.query(
      `UPDATE public.form_settings 
       SET otp = NULL, otp_generated_at = NULL 
       WHERE workspace_id = $1`,
      [workspace_id]
    );

    // 4. 同期されていた保護者の回答データをすべて抽出
    const guardianResponses = await client.query(
      `SELECT token, preferred_dates 
       FROM public.guardian_responses 
       WHERE workspace_id = $1`,
      [workspace_id]
    );

    // トランザクションを確定（コミット）
    await client.query('COMMIT');

    // 復元モーダルに返すペイロードを返却
    return c.json({
      formSettings: {
        rows: formSettings.rows,
        cols: formSettings.cols,
        availability: formSettings.availability,
        event_name: formSettings.event_name,
        class_name: formSettings.class_name,
        message: formSettings.message,
        limit_date: formSettings.limit_date,
        is_opened: formSettings.is_opened
      },
      guardianResponses: guardianResponses.rows
    });

  } catch (error) {
    // 例外発生時は確実にロールアップ（OTPもNULLに戻らず無傷のまま残る）
    await client.query('ROLLBACK');
    console.error('Restore Execute Error:', error);
    
    if (error.message === 'RESTORE_OTP_INVALID' || error.message === 'RESTORE_TOKENS_MISMATCH') {
      return c.json({ code: error.message }, 400);
    }
    
    return c.json({ code: 'UNKNOWN_ERROR', error: 'サーバー内部でエラーが発生しました' }, 500);
  } finally {
    // 接続をプールに返却
    client.release();
  }
});

// Cloudflare Pages 用にラップしてエクスポート
export const onRequest = handle(app);