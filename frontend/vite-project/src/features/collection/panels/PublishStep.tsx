// src/features/collection/panels/PublishStep.tsx
import React from "react";
import { useAppStore } from "../../../store/useAppStore";
import { useCloudSync } from "../hooks/useCloudSync";
import { Button } from "../../../components/ui/Button/Button";
import { GuardianLoginView } from "../../guardian-form/components/GuardianLoginView";

import * as s from "./PublishStep.css";
import * as layout from "../../../styles/layout.css";

export const PublishStep: React.FC = () => {
  // --- ロジック部分は一切変更なし ---
  const { db, setSchoolSettings } = useAppStore();
  const { schoolSettings, workspaceId, secretKey } = db;
  const { sync, loading, error: syncError } = useCloudSync();

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSchoolSettings({ ...schoolSettings, formMessage: e.target.value });
  };

  const toggleOpened = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchoolSettings({ ...schoolSettings, isOpened: e.target.checked });
  };

  const handleSync = async () => {
    const result = await sync();
    if (result.success) {
      alert(
        workspaceId
          ? "データを更新しました。"
          : "クラウドとの同期が完了しました！",
      );
    } else {
      alert("同期失敗: " + result.error);
    }
  };

  const publicUrl =
    workspaceId && secretKey
      ? `${window.location.origin}/p/${workspaceId}#${secretKey}`
      : null;

  const previewError = !schoolSettings.isOpened
    ? "現在、回答の受付を停止しています。\n希望される方は、担任までご連絡ください。"
    : "";

  return (
    <div className={layout.basePanelCard}>
      
      {/* 1. 固定領域：ヘッダー */}
      {/* ※ layout.panelHeader は元々 space-between を持っているのでそのまま使用 */}
      <div className={layout.panelHeader} style={{padding: '20px 24px 5px'}}>
        <div className={s.editColumn}> {/* flexDirection: 'column' の代用 */}
          <h2 className={layout.panelTitle}>
            2. Webフォームのプレビューと公開
          </h2>
          <p className={s.headerDescription}>
            保護者に見える画面を確認し、Web公開設定を行います。
          </p>
        </div>

        {/* ステータスバッジ */}
        <div className={s.headerBadgeWrapper}>
          {workspaceId ? (
            <span className={s.badgePublished}>✓ 公開中（同期済み）</span>
          ) : (
            <span className={s.badgePending}>準備中（未同期）</span>
          )}
        </div>
      </div>

      {/* 2. スクロール領域：設定とプレビュー */}
      {/* ※ layout.panelScrollArea は元々 padding: 24px を持っているのでそのまま使用 */}
      <div className={layout.panelScrollArea}>
        <div className={s.layoutContainer}>
          {/* 上段：編集とプレビュー */}
          <div className={s.topSection}>
            {/* 左カラム: メッセージ編集 */}
            <div className={s.editColumn}>
              <label className={s.sectionLabel}>Web画面の案内文</label>
              <p className={s.headerDescription} style={{ margin: 0 }}>
                ※ここで編集した内容は、下の「設定を更新して同期」ボタンを押すと反映されます。
              </p>
              <textarea
                className={s.messageTextarea}
                value={schoolSettings.formMessage || ""}
                onChange={handleMessageChange}
                placeholder="日頃より本校の教育活動への..."
              />
              <div className={s.bottomSection}>
                <div>
                  <h3 className={s.sectionLabel}>公開設定・同期</h3>
                  <p className={s.headerDescription} style={{ margin: 0 }}>
                    設定を変更したら、必ず「同期」ボタンを押して反映させてください。
                  </p>
                </div>

                <div className={s.controlGrid}>
                  <div className={s.controlGroup}>
                    {/* 公開URL */}
                    <div>
                      <p className={s.sectionLabel}>保護者用公開URL</p>
                      {publicUrl ? (
                        <div className={s.urlBox}>{publicUrl}</div>
                      ) : (
                        <div className={s.urlBox} style={{ color: "#94a3b8" }}>
                          （同期後に発行されます）
                        </div>
                      )}
                    </div>

                    {/* 公開スイッチ */}
                    <div>
                      <p className={s.sectionLabel}>回答の受付</p>
                      <div className={s.switchContainer}>
                        <label className={s.checkboxLabel} style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                          <input
                            type="checkbox"
                            className={s.checkbox}
                            checked={schoolSettings.isOpened ?? true}
                            onChange={toggleOpened}
                          />
                          <span style={{ color: schoolSettings.isOpened ? "#059669" : "#64748b" }}>
                            {schoolSettings.isOpened ? "受付中 (Open)" : "停止中 (Closed)"}
                          </span>
                        </label>
                        <span className={s.headerDescription} style={{ fontSize: "12px", margin: 0 }}>
                          ※OFFにすると保護者はログインできません
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 同期ボタンエリア */}
                  <div className={s.controlGroup} style={{ justifyContent: "flex-end" }}>
                    <Button
                      variant="primary"
                      onClick={handleSync}
                      disabled={loading}
                    >
                      {loading
                        ? "処理中..."
                        : workspaceId
                          ? "設定を更新して同期"
                          : "クラウドへ同期して公開"}
                    </Button>
                    {syncError && (
                      <p className={s.errorText}>エラー: {syncError}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 右：プレビュー */}
            <div className={s.previewColumn}>
              <div className={s.phoneFrame}>
                <div className={s.phoneScreen}>
                  <GuardianLoginView
                    hasInfo={true}
                    eventName={schoolSettings.eventName || ""}
                    classNameStr={schoolSettings.className || ""}
                    message={schoolSettings.formMessage || ""}
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
        </div>
      </div>
    </div>
  );
};