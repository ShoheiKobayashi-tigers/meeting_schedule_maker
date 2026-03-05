// features/BulkSetup/hooks/useCloudSync.ts
import { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { nanoid } from 'nanoid';
import { encryptForCloud, decryptFromCloud } from '../../../utils/secureStorage'; 

export const useCloudSync = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {db, setWorkspaceId, setSecretKey, bulkSaveApplicants} = useAppStore();

  const sync = async () => {
    // IDがなければ新規発行
    const wsId = db.workspaceId || nanoid(10);
    const secKey = db.secretKey || nanoid(12); // ★追加: 真の鍵を取得または発行
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
          
          // ★変更: workspaceIdではなく「secKey」を南京錠の鍵にして暗号化
          rows: encryptForCloud(scheduleData.rows, secKey),
          cols: encryptForCloud(scheduleData.cols, secKey),
          availability: encryptForCloud(scheduleData.availability, secKey),
          eventName: encryptForCloud(schoolSettings.eventName || "個人面談", secKey),
          className: encryptForCloud(schoolSettings.className || "", secKey),
          message: encryptForCloud(schoolSettings.formMessage || "", secKey),
          
          tokens: tokens,
          limitDate: schoolSettings.limitDate || null, 
          isOpened: schoolSettings.isOpened ?? true,
          applicants: anonymousApplicants
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server Error: ${errText}`);
      }

      console.log("✅ Sync success!");
      
      // まだ発行していなければ保存
      if (!db.workspaceId) setWorkspaceId(wsId);
      if (!db.secretKey) setSecretKey(secKey);

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
    const secKey = db.secretKey;
    if (!wsId || !secKey) return { success: false, error: "クラウド設定がありません" };

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
          let dates = [];
          if (typeof match.preferred_dates === 'string') {
             // ★変更: 取得した希望日程を「secKey」で復号
             dates = decryptFromCloud(match.preferred_dates, secKey) || [];
          } else if (Array.isArray(match.preferred_dates)) {
             dates = match.preferred_dates;
          }
          return { ...app, preferred_dates: dates };
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