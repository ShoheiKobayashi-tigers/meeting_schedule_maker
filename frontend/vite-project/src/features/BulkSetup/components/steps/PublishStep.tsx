// features/BulkSetup/components/steps/PublishStep.tsx
import React from 'react';
import { useAppStore } from '../../../../store/useAppStore';
import { useCloudSync } from '../../hooks/useCloudSync';
import { GuardianLoginView } from '../../../ParentForm/components/GuardianLoginView';
import * as s from './PublishStep.css';

export const PublishStep: React.FC = () => {
  const { db, setSchoolSettings } = useAppStore();
  const { schoolSettings, workspaceId } = db;
  const { sync, pullResponses, loading, error: syncError } = useCloudSync();

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSchoolSettings({ ...schoolSettings, formMessage: e.target.value });
  };

  const toggleOpened = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchoolSettings({ ...schoolSettings, isOpened: e.target.checked });
  };

  const handleSync = async () => {
    const result = await sync();
    if (result.success) {
      // 旧SyncStepの分岐ロジックを維持
      alert(workspaceId ? "データを更新しました。" : "クラウドとの同期が完了しました！");
    } else {
      alert("同期失敗: " + result.error);
    }
  };

  const handlePull = async () => {
    const result = await pullResponses();
    if (result.success) alert("最新の回答を取得しました！");
    else alert("取得失敗: " + result.error);
  };

  const publicUrl = workspaceId ? `${window.location.origin}/p/${workspaceId}` : null;

  // プレビュー用にエラーメッセージを生成（停止中表示）
  const previewError = !schoolSettings.isOpened 
    ? "現在、回答の受付を停止しています。\n希望される方は、担任までご連絡ください。" 
    : "";

  return (
    <div className={s.container}>
      <header className={s.header}>
        <div>
          <h2 className={s.title}>2. Webフォームのプレビューと公開</h2>
          <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
             保護者に見える画面を確認し、Web公開設定を行います。
          </p>
        </div>
        
        {/* 旧SyncStepのステータス表示エリアを上部に配置 */}
        <div className={s.statusSection}>
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
      </header>
      
      <div className={s.layoutContainer}>
        
        {/* 上段：編集とプレビュー */}
        <div className={s.topSection}>
        {/* 左カラム: メッセージ編集 (旧PreviewStep) */}
        <div className={s.editColumn}>
          <label className={s.sectionLabel}>Web画面の案内文</label>
            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
              ※ここで編集した内容は、下の「設定を更新して同期」ボタンを押すと反映されます。
            </p>
          <textarea 
            className={s.messageTextarea}
            value={schoolSettings.formMessage || ""}
            onChange={handleMessageChange}
            placeholder="日頃より本校の教育活動への..."
          />
        </div>

          {/* 右：プレビュー */}
          <div className={s.previewColumn}>
            <div className={s.phoneFrame}>
              <div className={s.phoneScreen}>
                <GuardianLoginView
                  hasInfo={true}
                  eventName={schoolSettings.eventName || ''}
                  classNameStr={schoolSettings.className || ''}
                  message={schoolSettings.formMessage || ''}
                  inputToken="" 
                  onTokenChange={() => {}} 
                  onNext={() => {}}        
                  loading={false}
                  error={previewError}
                  isPreview={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 右カラム: コントロールパネル (旧SyncStep) */}
        <div className={s.bottomSection}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#1e293b' }}>公開設定・同期</h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>設定を変更したら、必ず「同期」ボタンを押して反映させてください。</p>
          </div>

          <div className={s.controlGrid}>
            <div className={s.controlGroup}>
              {/* 公開URL */}
              <div>
                <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#334155' }}>保護者用公開URL</p>
                {publicUrl ? (
                  <div className={s.urlBox}>{publicUrl}</div>
                ) : (
                  <div className={s.urlBox} style={{ color: '#999' }}>（同期後に発行されます）</div>
                )}
              </div>

              {/* 公開スイッチ */}
              <div>
                <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#334155' }}>回答の受付</p>
                <div className={s.switchContainer}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}>
                    <input 
                      type="checkbox" 
                      className={s.checkbox} 
                      checked={schoolSettings.isOpened ?? true} 
                      onChange={toggleOpened} 
                    />
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: schoolSettings.isOpened ? '#059669' : '#64748b' }}>
                      {schoolSettings.isOpened ? '受付中 (Open)' : '停止中 (Closed)'}
                    </span>
                  </label>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>※OFFにすると保護者はログインできません</span>
                </div>
              </div>
            </div>

            <div className={s.controlGroup} style={{ justifyContent: 'flex-end' }}>
              {/* 同期ボタン */}
              <button onClick={handleSync} disabled={loading} className={s.syncButton}>
                {loading ? '処理中...' : workspaceId ? '設定を更新して同期' : 'クラウドへ同期して公開'}
              </button>

              {/* 取り込みボタン */}
              {workspaceId && (
                <button onClick={handlePull} disabled={loading} className={s.pullButton}>
                  最新の回答を取り込む
                </button>
              )}
              
              {syncError && <p className={s.errorText}>エラー: {syncError}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};