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
        
        <div style={{ display: 'grid', gap: '16px', maxWidth: '800px', marginTop: '16px' }}>
          <label>イベント名<br/>
            <input 
              type="text" 
              value={schoolSettings.eventName || ''} 
              onChange={(e) => handleChange('eventName', e.target.value)}
              style={{ width: '100%' }}
            />
          </label>
          <label>お便り配布予定日（※お便りには和暦で表示されます）<br/>
            <input 
              type="date" 
              value={schoolSettings.distributionDate || ''} 
              onChange={(e) => handleChange('distributionDate', e.target.value)}
              style={{ width: '100%' }}
            />
          </label>
          
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
              placeholder="山田　太郎" 
              style={{ width: '100%' }}
            />
          </label>
          <label>学級名<br/>
            <input 
              type="text" 
              value={schoolSettings.className || ''} 
              onChange={(e) => handleChange('className', e.target.value)}
              placeholder='〇年〇組'
              style={{ width: '100%' }}
            />
          </label>
          <label>担任名<br/>
            <input 
              type="text" 
              value={schoolSettings.senderName || ''} 
              onChange={(e) => handleChange('senderName', e.target.value)}
              placeholder="鈴木　花子" 
              style={{ width: '100%' }}
            />
          </label>
          <label>提出期限日（※お便りには和暦で表示されます）<br/>
            <input 
              type="date"
              value={schoolSettings.limitDate || ''} 
              onChange={(e) => handleChange('limitDate', e.target.value)}
              style={{ width: '100%' }}
            />
          </label>
          <label>お便り本文<br/>
            <textarea 
              rows={10}
              value={schoolSettings.letterMessage || ''} 
              onChange={(e) => handleChange('letterMessage', e.target.value)}
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