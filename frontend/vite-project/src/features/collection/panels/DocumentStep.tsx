// src/features/collection/panels/DocumentStep.tsx
import React from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { useExportApplicants } from '../../../hooks/useExportApplicants'
import { generateHandoutDocx } from '../../../utils/docxUtils';
import { Button } from '../../../components/ui/Button/Button'; 

import * as s from './DocumentStep.css';
import * as layout from '../../../styles/layout.css'; 

export const DocumentStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { schoolSettings, applicants, workspaceId, secretKey } = useAppStore(state => state.db);
  const setSchoolSettings = useAppStore(state => state.setSchoolSettings);

  const handleChange = (field: keyof typeof schoolSettings, value: string) => {
    setSchoolSettings({ ...schoolSettings, [field]: value });
  };

  const handleDownload = async () => {
    await generateHandoutDocx(applicants, schoolSettings, workspaceId || '', secretKey || '');
  };

  const {exportApplicants} = useExportApplicants();

  return (
    <div className={layout.basePanelCard}>
      
      {/* 1. 固定領域：ヘッダー */}
      <div className={layout.panelHeader} style={{ padding: '20px 24px 5px',flexDirection: 'column', alignItems: 'flex-start' }}>
        <h2 className={layout.panelTitle}>1. 配布用案内状の設定と作成</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '8px', lineHeight: '1.5' }}>
          保護者に配布する案内状（Word形式）の内容を設定し、ダウンロードします。<br/>
          ここで入力した内容は、自動的に案内状に反映されます。
        </p>
      </div>
      
      {/* 2. スクロール領域：設定フォームとダウンロード */}
      {/* フォーム部分の padding は css側で担保するので、ここでは 0 にして横幅いっぱいにします */}
      <div className={layout.panelScrollArea} style={{ padding: 0 }}>
        
        {/* 設定フォームエリア */}
        <div className={s.formGrid}>
            <label className={s.label}>
              イベント名
              <input 
                type="text" 
                className={s.input}
                value={schoolSettings.eventName || ''} 
                onChange={(e) => handleChange('eventName', e.target.value)} 
              />
            </label>

            {/* 2段目：学校名・校長名（横並び） */}
            <div className={s.inputRow}>
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
            </div>

            {/* 3段目：学級名・担任名（横並び） */}
            <div className={s.inputRow}>
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
            </div>

            {/* 4段目：日付関連（横並び） */}
            <div className={s.inputRow}>
              <label className={s.label}>
                <span>お便り配布予定日 <span style={{fontSize:'12px', fontWeight:'normal', color: '#64748b'}}>※和暦で表示されます</span></span>
                <input 
                  type="date" 
                  className={s.input}
                  value={schoolSettings.distributionDate || ''} 
                  onChange={(e) => handleChange('distributionDate', e.target.value)} 
                />
              </label>
              <label className={s.label}>
                <span>提出期限日 <span style={{fontSize:'12px', fontWeight:'normal', color: '#64748b'}}>※和暦で表示されます</span></span>
                <input 
                  type="date" 
                  className={s.input}
                  value={schoolSettings.limitDate || ''} 
                  onChange={(e) => handleChange('limitDate', e.target.value)} 
                />
              </label>
            </div>

            {/* 5段目：お便り本文（フル幅） */}
            <label className={s.label}>
              お便り本文
              <textarea 
                rows={10}
                className={s.textarea}
                value={schoolSettings.letterMessage || ''} 
                onChange={(e) => handleChange('letterMessage', e.target.value)} 
              />
            </label>
        </div>

        {/* ダウンロードエリア */}
        <div className={s.downloadArea}>
          <div className={s.statusBadge}>準備完了</div>
          <div className={s.downloadIcon}>📄</div>
          
          <Button variant="primary" onClick={handleDownload} style={{ maxWidth: '400px', width: '100%' }}>
            案内を一括生成してダウンロード (.docx)
          </Button>
          <Button variant="secondary" onClick={exportApplicants} style={{ maxWidth: '400px', width: '100%', border:'0.5px solid #e2e2e2'}}>
            児童一覧をダウンロード (.xlsx)
          </Button>
          
          <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
            ※ 生成には数秒〜数十秒かかる場合があります
          </p>
        </div>
        
      </div>

      {/* 3. 固定領域：フッター（次へボタン） */}
      <div className={s.footer}>
        <Button variant="outline" onClick={onNext}>
          保存して次へ（Web公開設定）
        </Button>
      </div>

    </div>
  );
};