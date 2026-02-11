// features/BulkSetup/components/steps/TemplateStep.tsx
import React from 'react';
import * as s from './ImportStep.css';
import { useAppStore } from '../../../../store/useAppStore'; // 追加

export const TemplateStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  // Store から設定と更新関数を取得
  const { schoolSettings } = useAppStore(state => state.db);
  const setSchoolSettings = useAppStore(state => state.setSchoolSettings);

  // 入力変更時のハンドラー
  const handleChange = (field: keyof typeof schoolSettings, value: string) => {
    setSchoolSettings({ ...schoolSettings, [field]: value });
  };

  return (
    <div className={s.container}>
      <section className={s.section}>
        <h4 className={s.sectionTitle}>2. お便りの共通項目を設定</h4>
        <p className={s.description}>配付する案内に記載する情報を入力してください。</p>
        
        <div style={{ display: 'grid', gap: '16px', maxWidth: '400px', marginTop: '16px' }}>
          <label>学校名<br/>
            <input 
              type="text" 
              value={schoolSettings.schoolName || ''} 
              onChange={(e) => handleChange('schoolName', e.target.value)}
              placeholder="〇〇小学校" 
              style={{ width: '100%' }}
            />
          </label>
          <label>校長名<br/>
            <input 
              type="text" 
              value={schoolSettings.principalName || ''} 
              onChange={(e) => handleChange('principalName', e.target.value)}
              placeholder="校長 氏名" 
              style={{ width: '100%' }}
            />
          </label>
          <label>担任名<br/>
            <input 
              type="text" 
              value={schoolSettings.senderName || ''} 
              onChange={(e) => handleChange('senderName', e.target.value)}
              placeholder="第1学年1組 担任" 
              style={{ width: '100%' }}
            />
          </label>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'right' }}>
          <button onClick={onNext} style={{ backgroundColor: '#0070f3', color: 'white' }}>
            保存して Step 3 へ
          </button>
        </div>
      </section>
    </div>
  );
};