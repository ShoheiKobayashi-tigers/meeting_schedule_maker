// features/BulkSetup/components/steps/PreviewStep.tsx
import React from 'react';
import { useAppStore } from '../../../../store/useAppStore';
import * as s from './PreviewStep.css';
import * as common from './ImportStep.css';
import { getNengo } from '../../../../utils/timeUtils';

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
                {/* GuardianPortalの見た目を簡易再現 */}
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <small style={{ color: '#666' }}>{schoolSettings.schoolName}</small>
                  <h3 style={{ margin: '10px 0' }}>{getNengo(schoolSettings.distributionDate)}{schoolSettings.eventName}希望調査</h3>
                  <div style={{ 
                    backgroundColor: '#f8f9fa', padding: '15px', 
                    borderRadius: '8px', fontSize: '13px', textAlign: 'left', lineHeight: '1.6' 
                  }}>
                    {schoolSettings.formMessage || "（ここに案内文が表示されます）"}
                  </div>
                  <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '10px', borderRadius: '4px' }}>
                    <div style={{ color: '#ccc', fontSize: '20px' }}>認証コード入力欄</div>
                  </div>
                  <button disabled style={{ 
                    width: '100%', marginTop: '15px', padding: '10px', 
                    backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' 
                  }}>次へ進む</button>
                </div>
              </div>
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