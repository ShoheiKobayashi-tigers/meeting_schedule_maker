// features/BulkSetup/components/steps/PreviewStep.tsx
import React from 'react';
import { useAppStore } from '../../../../store/useAppStore';
import * as s from './PreviewStep.css';
import * as common from './ImportStep.css';
import { GuardianLoginView } from '../../../ParentForm/components/GuardianLoginView';

export const PreviewStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { schoolSettings } = useAppStore(state => state.db);
  const setSchoolSettings = useAppStore(state => state.setSchoolSettings);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSchoolSettings({ ...schoolSettings, formMessage: e.target.value });
  };

  return (
    <div className={common.container}>
      <section className={common.section}>
        <h4 className={common.sectionTitle}>3. 保護者用フォームのプレビューと調整</h4>
        <p className={common.description}>保護者に表示されるメッセージの編集と、画面の確認ができます。</p>

        <div className={s.splitLayout}>
          {/* 左側：編集エリア */}
          <div className={s.editArea}>
            <label className={s.label}>
              案内文
              <textarea 
                className={s.textarea}
                value={schoolSettings.formMessage || ""}
                onChange={handleMessageChange}
                placeholder="日頃より本校の教育活動への..."
              />
            </label>
          </div>

          {/* 右側：スマホプレビュー */}
          <div className={s.previewArea}>
            <div className={s.phoneFrame}>
              <div className={s.phoneScreen}>
                <GuardianLoginView
                  hasInfo={true} // プレビューなので常に表示
                  eventName={schoolSettings.eventName}
                  classNameStr={schoolSettings.className}
                  message={schoolSettings.formMessage}
                  
                  // プレビュー用のダミーデータ/状態
                  inputToken="" 
                  onTokenChange={() => {}} // 何もしない
                  onNext={() => {}}        // 何もしない
                  loading={false}
                  error="" // 必要であればエラー表示のテスト用テキストを入れる
                  
                  isPreview={true} // プレビューモード（余白削除、入力不可など）
                />              </div>
            </div>
            <p style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '8px' }}>
              ※実際の画面イメージ
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: '32px' }}>
          <button onClick={onNext} style={{ backgroundColor: '#0070f3', color: 'white' }}>
            この内容で Step 4 (配布物作成) へ
          </button>
        </div>
      </section>
    </div>
  );
};