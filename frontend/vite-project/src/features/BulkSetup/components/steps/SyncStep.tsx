// features/BulkSetup/components/steps/SyncStep.tsx
import React from 'react';
import { useAppStore } from '../../../../store/useAppStore';
import { useCloudSync } from '../../hooks/useCloudSync';
import * as s from './SyncStep.css'; // ★ImportStep.css から変更

export const SyncStep: React.FC = () => {
  // Storeから設定と更新関数を取得
  const { db, setSchoolSettings } = useAppStore();
  const { workspaceId, schoolSettings } = db;
  const { isOpened } = schoolSettings;
  
  const { sync, pullResponses, loading, error } = useCloudSync();

  const handleSync = async () => {
    const result = await sync();
    if (result.success) {
      alert(workspaceId ? "データを更新しました。" : "クラウドとの同期が完了しました！");
    } else {
      alert("同期失敗: " + result.error);
    }
  };

  // 受信（回答取り込み）
  const handlePull = async () => {
    const result = await pullResponses();
    if (result.success) {
      alert("最新の回答を取得し、名簿を更新しました！");
    } else {
      alert("取得失敗: " + result.error);
    }
  };

  // ★追加: 公開フラグの切り替え処理
  const toggleOpened = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchoolSettings({
      ...schoolSettings,
      isOpened: e.target.checked
    });
  };

  const publicUrl = workspaceId ? `${window.location.origin}/p/${workspaceId}` : null;

  return (
    <div className={s.container}>
      <section className={s.section}>
        <h4 className={s.sectionTitle}>4. クラウド同期と回答待機</h4>
        
        <div className={s.previewCard}>
          {/* ステータス表示 */}
          <div style={{ marginBottom: '24px' }}>
            {workspaceId ? (
              <span style={{ color: '#28a745', fontWeight: 'bold', backgroundColor: '#e6fffa', padding: '8px 16px', borderRadius: '20px' }}>
                ✓ 公開中（同期済み）
              </span>
            ) : (
              <span style={{ color: '#666', fontWeight: 'bold', backgroundColor: '#eee', padding: '8px 16px', borderRadius: '20px' }}>
                準備中（未同期）
              </span>
            )}
          </div>

          {/* URL表示 */}
          {publicUrl && (
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '14px', marginBottom: '8px' }}>保護者用公開URL:</p>
              <code style={{ display: 'block', padding: '12px', background: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px', wordBreak: 'break-all' }}>
                {publicUrl}
              </code>
            </div>
          )}

          {/* ★追加: 公開設定スイッチ */}
          <div className={s.settingItem}>
            <label className={s.label}>
              <input 
                type="checkbox" 
                className={s.checkbox}
                checked={isOpened ?? true} 
                onChange={toggleOpened}
              />
              回答の受付状況:
            </label>
            
            <span 
              className={s.statusText}
              style={{ 
                backgroundColor: isOpened ? '#d1fae5' : '#f1f5f9',
                color: isOpened ? '#059669' : '#64748b'
              }}
            >
              {isOpened ? '受付中 (Open)' : '停止中 (Closed)'}
            </span>
          </div>

          {/* ボタンエリア */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <button 
              onClick={handleSync} 
              disabled={loading}
              style={{ 
                padding: '12px 24px', 
                backgroundColor: '#0070f3', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: 'pointer',
                fontWeight: 'bold',
                width: '100%',
                maxWidth: '320px',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 6px rgba(0,112,243,0.2)'
              }}
            >
              {loading ? '処理中...' : workspaceId ? '設定を更新して同期' : 'クラウドと同期して公開'}
            </button>

                      {/* 2. 受信ボタン（公開後のみ表示） */}
            {workspaceId && (
              <button 
                onClick={handlePull} 
                disabled={loading}
                style={{ 
                  padding: '12px 24px', 
                  backgroundColor: '#fff', 
                  color: '#0070f3', 
                  border: '2px solid #0070f3', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  width: '100%',
                  maxWidth: '320px',
                  opacity: loading ? 0.7 : 1
                }}
              >
                最新の回答を取り込む
              </button>
            )}
          </div>

          {error && <p style={{ color: '#e53e3e', fontSize: '12px', marginTop: '12px' }}>{error}</p>}
        </div>
      </section>
    </div>
  );
};