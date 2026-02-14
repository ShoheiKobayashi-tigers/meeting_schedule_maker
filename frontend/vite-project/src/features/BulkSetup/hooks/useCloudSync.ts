// features/BulkSetup/hooks/useCloudSync.ts
import { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { nanoid } from 'nanoid';

export const useCloudSync = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Storeから最新の状態を取得
  const {db, setWorkspaceId, bulkSaveApplicants} = useAppStore();

  const sync = async () => {
    // IDがなければ新規発行
    const wsId = db.workspaceId || nanoid(10);
    setLoading(true);
    setError(null);

    // 1. 設定データの準備
    const { schoolSettings, applicants, scheduleData } = db;
    
    // 2. トークン一覧の抽出（設定テーブル用）
    const tokens = applicants.map(a => a.token);

    // 3. 回答テーブル初期化用データ
    // ★重要: 個人情報(名前など)は削除し、IDとTokenのみ送信する
    const anonymousApplicants = applicants.map(a => ({
      id: a.id,
      token: a.token
    }));

    try {
      console.log("📤 Syncing to cloud...", { wsId, count: anonymousApplicants.length });

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/workspaces/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: wsId,
          
          // スケジュール枠定義
          rows: scheduleData.rows,
          cols: scheduleData.cols,
          
          // 設定データ
          tokens: tokens,
          eventName: schoolSettings.eventName || "個人面談",
          className: schoolSettings.className || "",
          limitDate: schoolSettings.limitDate || null, // TIMESTAMP用 (空文字ならnull)
          message: schoolSettings.formMessage || "",
          isOpened: schoolSettings.isOpened ?? true,   // 公開フラグ
          
          // 回答枠初期化用リスト
          applicants: anonymousApplicants
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server Error: ${errText}`);
      }

      console.log("✅ Sync success!");
      
      // StoreのworkspaceIdを更新（新規発行時）
      if (!db.workspaceId) {
        setWorkspaceId(wsId);
      }
      
      return { success: true, workspaceId: wsId };

    } catch (err: any) {
      console.error("Sync failed:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const pullResponses = async () => {
    const wsId = db.workspaceId;
    if (!wsId) return { success: false, error: "ワークスペースIDがありません" };

    setLoading(true);
    setError(null);

    try {
      console.log("📥 Fetching responses...");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/workspaces/${wsId}/responses`);
      
      if (!response.ok) throw new Error('回答データの取得に失敗しました');

      const responses: { token: string, preferred_dates: string[] }[] = await response.json();

      // 手元の名簿(applicants)とマージ
      const updatedApplicants = db.applicants.map(app => {
        // 同じトークンを持つ回答データを検索
        const match = responses.find(r => r.token === app.token);
        if (match) {
          // DBの回答で上書き (preferred_dates は文字列配列)
          return { ...app, preferred_dates: match.preferred_dates || [] };
        }
        return app;
      });

      // Storeを一括更新
      bulkSaveApplicants(updatedApplicants);
      console.log(`✅ Updated ${updatedApplicants.length} applicants with latest responses.`);
      
      return { success: true, count: responses.length };

    } catch (err: any) {
      console.error(err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { sync, pullResponses, loading, error };
};