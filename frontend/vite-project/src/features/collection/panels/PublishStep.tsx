import React from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { useCloudSync } from '../hooks/useCloudSync';
import { Button } from '../../../components/ui/Button/Button';
import { GuardianLoginView } from '../../guardian-form/components/GuardianLoginView';

import * as s from './PublishStep.css'
import * as layout from '../../../styles/layout.css'; // ★お道具箱を追加

export const PublishStep: React.FC = () => {
  // --- ロジック部分は一切変更なし ---
  const { db, setSchoolSettings } = useAppStore();
  const { schoolSettings, workspaceId, secretKey } = db;
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

  const publicUrl = workspaceId && secretKey ? `${window.location.origin}/p/${workspaceId}#${secretKey}` : null;

  const previewError = !schoolSettings.isOpened 
    ? "現在、回答の受付を停止しています。\n希望される方は、担任までご連絡ください。" 
    : "";

  return (
    <div className={layout.basePanelCard}>
      
      {/* 1. 固定領域：ヘッダー（タイトルとステータスバッジを左右に配置） */}
      <div className={layout.panelHeader} style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className={layout.panelTitle}>2. Webフォームのプレビューと公開</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '8px', lineHeight: '1.5' }}>
             保護者に見える画面を確認し、Web公開設定を行います。
          </p>
        </div>
        
        {/* ステータスバッジ */}
        <div style={{ marginTop: '4px' }}>
          {workspaceId ? (
            <span style={{ color: '#059669', fontWeight: 'bold', backgroundColor: '#d1fae5', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem' }}>
              ✓ 公開中（同期済み）
            </span>
          ) : (
            <span style={{ color: '#64748b', fontWeight: 'bold', backgroundColor: '#f1f5f9', padding: '8px 16px', borderRadius: '20px', fontSize: '0.85rem' }}>
              準備中（未同期）
            </span>
          )}
        </div>
      </div>
      
      {/* 2. スクロール領域：設定とプレビュー */}
      <div className={layout.panelScrollArea} style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
        <div className={s.layoutContainer}>
          
          {/* 上段：編集とプレビュー */}
          <div className={s.topSection}>
            {/* 左カラム: メッセージ編集 */}
            <div className={s.editColumn}>
              <label className={s.sectionLabel}>Web画面の案内文</label>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
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

          {/* 下段：コントロールパネル */}
          <div className={s.bottomSection}>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 8px 0', color: '#1e293b' }}>公開設定・同期</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>設定を変更したら、必ず「同期」ボタンを押して反映させてください。</p>
            </div>

            <div className={s.controlGrid}>
              <div className={s.controlGroup}>
                {/* 公開URL */}
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '8px', color: '#334155' }}>保護者用公開URL</p>
                  {publicUrl ? (
                    <div className={s.urlBox}>{publicUrl}</div>
                  ) : (
                    <div className={s.urlBox} style={{ color: '#94a3b8' }}>（同期後に発行されます）</div>
                  )}
                </div>

                {/* 公開スイッチ */}
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '8px', color: '#334155' }}>回答の受付</p>
                  <div className={s.switchContainer}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}>
                      <input 
                        type="checkbox" 
                        className={s.checkbox} 
                        checked={schoolSettings.isOpened ?? true} 
                        onChange={toggleOpened} 
                      />
                      <span className={s.checkboxLabel} style={{ color: schoolSettings.isOpened ? '#059669' : '#64748b' }}>
                        {schoolSettings.isOpened ? '受付中 (Open)' : '停止中 (Closed)'}
                      </span>
                    </label>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>※OFFにすると保護者はログインできません</span>
                  </div>              
                </div>
              </div>

              <div className={s.controlGroup} style={{ justifyContent: 'flex-end' }}>
                {/* 同期ボタン（少しボタンを大きく見せるために padding を追加） */}
                <Button variant="primary" onClick={handleSync} disabled={loading} style={{ padding: '16px' }}>
                  {loading ? '処理中...' : workspaceId ? '設定を更新して同期' : 'クラウドへ同期して公開'}
                </Button>

                {workspaceId && (
                  <Button variant="outline" onClick={handlePull} disabled={loading} style={{ padding: '16px' }}>
                    最新の回答を取り込む
                  </Button>
                )}              
                {syncError && <p className={s.errorText}>エラー: {syncError}</p>}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};