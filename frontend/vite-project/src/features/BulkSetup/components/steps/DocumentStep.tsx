// features/BulkSetup/components/steps/DocumentStep.tsx
import React from 'react';
import { useAppStore } from '../../../../store/useAppStore';
import { generateHandoutDocx } from '../../../../utils/docxUtils';
import * as s from './DocumentStep.css';

export const DocumentStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { schoolSettings, applicants, workspaceId } = useAppStore(state => state.db);
  const setSchoolSettings = useAppStore(state => state.setSchoolSettings);

  const handleChange = (field: keyof typeof schoolSettings, value: string) => {
    setSchoolSettings({ ...schoolSettings, [field]: value });
  };

  const handleDownload = async () => {
    // 旧HandoutStepのロジック: workspaceIdがない場合はnullを渡す等の制御はdocxUtils側で処理される想定
    await generateHandoutDocx(applicants, schoolSettings, workspaceId || '');
  };

  return (
    <div className={s.container}>
      <header className={s.header}>
        <h2 className={s.title}>1. 配布用案内状の設定と作成</h2>
        <p className={s.description}>
          保護者に配布する案内状（Word形式）の内容を設定し、ダウンロードします。<br/>
          ここで入力した内容は、自動的に案内状に反映されます。
        </p>
      </header>
      
      {/* 設定フォームエリア: 旧TemplateStepの項目とプレースホルダーを完全再現 */}
      <div className={s.formGrid}>
          <label className={s.label}>
            イベント名
            <input 
              type="text" 
              className={s.input}
              value={schoolSettings.eventName || ''} 
              onChange={(e) => handleChange('eventName', e.target.value)} 
              // placeholderなし（元のTemplateStepにも無かったため）
            />
          </label>
          <label className={s.label}>
            学校名
            <input 
              type="text" 
              className={s.input}
              value={schoolSettings.schoolName || ''} 
              onChange={(e) => handleChange('schoolName', e.target.value)} 
              placeholder="〇〇小学校"
            />
          </label>
          <label className={s.label}>
            校長名
            <input 
              type="text" 
              className={s.input}
              value={schoolSettings.principalName || ''} 
              onChange={(e) => handleChange('principalName', e.target.value)} 
              placeholder="山田　太郎"
            />
          </label>
          <label className={s.label}>
            学級名
            <input 
              type="text" 
              className={s.input}
              value={schoolSettings.className || ''} 
              onChange={(e) => handleChange('className', e.target.value)} 
              placeholder="〇年〇組"
            />
          </label>
          <label className={s.label}>
            担任名
            <input 
              type="text" 
              className={s.input}
              value={schoolSettings.senderName || ''} 
              onChange={(e) => handleChange('senderName', e.target.value)} 
              placeholder="鈴木　花子"
            />
          </label>
          <label className={s.label}>
            お便り配布予定日 <span style={{fontSize:'12px', fontWeight:'normal'}}>※お便りには和暦で表示されます</span>
            <input 
              type="date" 
              className={s.input}
              value={schoolSettings.distributionDate || ''} 
              onChange={(e) => handleChange('distributionDate', e.target.value)} 
            />
          </label>
          <label className={s.label}>
            提出期限日 <span style={{fontSize:'12px', fontWeight:'normal'}}>※お便りには和暦で表示されます</span>
            <input 
              type="date" 
              className={s.input}
              value={schoolSettings.limitDate || ''} 
              onChange={(e) => handleChange('limitDate', e.target.value)} 
            />
          </label>
          <label className={s.label}>
            お便り本文
            <textarea 
              rows={10} // 旧TemplateStepに合わせて10行
              className={s.textarea}
              value={schoolSettings.letterMessage || ''} 
              onChange={(e) => handleChange('letterMessage', e.target.value)} 
            />
          </label>
      </div>

      {/* ダウンロードエリア: 旧HandoutStepのUI要素を再現 */}
      <div className={s.downloadArea}>
        <div className={s.statusBadge}>準備完了</div>
        <div className={s.downloadIcon}>📄</div>
        
        <button onClick={handleDownload} className={s.downloadButton}>
          案内を一括生成してダウンロード (.docx)
        </button>
        
        <p style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
          ※ 生成には数秒〜数十秒かかる場合があります
        </p>
      </div>

      <div className={s.nextButtonWrapper}>
        <button onClick={onNext} className={s.nextButton}>
          保存して次へ（Web公開設定）
        </button>
      </div>
    </div>
  );
};