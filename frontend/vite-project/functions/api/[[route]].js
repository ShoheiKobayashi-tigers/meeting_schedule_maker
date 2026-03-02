// frontend/vite-project/functions/api/[[route]].js
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { handle } from 'hono/cloudflare-pages';
import { Pool } from '@neondatabase/serverless';

// '/api' から始まるURLをすべてこのアプリで処理する
const app = new Hono().basePath('/api');

// CORS設定（Cloudflare Pages上では同じドメインになるため基本的に全許可でOK）
app.use('/*', cors());

/**
 * 1. 同期 (Sync) API
 */
app.post('/workspaces/sync', async (c) => {
  const body = await c.req.json();
  const { workspaceId, rows, cols, tokens, className, limitDate, message, isOpened, applicants, eventName } = body;
  
  // Cloudflareの環境変数は `c.env` から取得します
  const pool = new Pool({ connectionString: c.env.DATABASE_URL });
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const safeLimitDate = limitDate ? limitDate : null;

    await client.query(
      `INSERT INTO form_settings (
         workspace_id, rows, cols, tokens, class_name, limit_date, message, is_opened, event_name, updated_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
       ON CONFLICT (workspace_id) DO UPDATE 
       SET 
         rows = EXCLUDED.rows, cols = EXCLUDED.cols, tokens = EXCLUDED.tokens, class_name = EXCLUDED.class_name,
         limit_date = EXCLUDED.limit_date, message = EXCLUDED.message, is_opened = EXCLUDED.is_opened,
         event_name = EXCLUDED.event_name, updated_at = NOW()`,
      [workspaceId, JSON.stringify(rows), JSON.stringify(cols), JSON.stringify(tokens), className, safeLimitDate, message, isOpened ?? true, eventName]
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
    return c.json({ error: err.message }, 500);
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

    if (settingsRes.rows.length === 0) return c.json({ error: 'フォームが見つかりません' }, 404);
    if (responseRes.rows.length === 0) return c.json({ error: '無効な認証コードです' }, 401);

    const setting = settingsRes.rows[0];
    const response = responseRes.rows[0];

    if (setting.is_opened === false) return c.json({ error: '現在、回答の受付を停止しています' }, 403);

    return c.json({
      token: response.token,
      preferred_dates: response.preferred_dates || [],
      schedule: { rows: setting.rows, cols: setting.cols },
      settings: { className: setting.class_name, limitDate: setting.limit_date, message: setting.message, isOpened: setting.is_opened }
    });
  } catch (err) {
    return c.json({ error: err.message }, 500);
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
    if (result.rowCount === 0) return c.json({ error: '更新対象が見つかりません' }, 400);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: err.message }, 500);
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
    return c.json({ error: err.message }, 500);
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
    if (result.rows.length === 0) return c.json({ error: 'フォームが見つかりません' }, 404);
    return c.json(result.rows[0]);
  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// Cloudflare Pages 用にラップしてエクスポート
export const onRequest = handle(app);