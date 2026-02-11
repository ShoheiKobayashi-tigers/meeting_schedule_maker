// features/BulkSetup/components/steps/HandoutStep.tsx
import React from 'react';
import { useAppStore } from '../../../../store/useAppStore';
import { generateHandoutDocx } from '../../../../utils/docxUtils';
import * as s from './HandoutStep.css';
import * as common from './ImportStep.css';

export const HandoutStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { applicants, schoolSettings, workspaceId } = useAppStore(state => state.db);
  const handleDownload = async () => {
    // workspaceId がない場合は null などを渡し、docxUtils 側で「URL未発行」と表示させる
    await generateHandoutDocx(applicants, schoolSettings, workspaceId || '');
  };
  return (
    <div className={common.container}>
      <section className={common.section}>
        <h4 className={common.sectionTitle}>3. 配布用ドキュメントの一括生成</h4>
        <p className={common.description}>
          生徒一人ひとりの認証コードが入った案内（docx）を作成します。
        </p>

        <div className={s.printHero}>
          <div className={s.statusBadge}>準備完了</div>
          <span className={s.icon}>📄</span>
          <button className={s.downloadBtn} onClick={handleDownload}>
            案内を一括生成してダウンロード (.docx)
          </button>
          <p style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
            ※ 生成には数秒〜数十秒かかる場合があります
          </p>
        </div>

        <div style={{ textAlign: 'right', marginTop: '24px' }}>
          <button 
            onClick={onNext} 
            style={{ backgroundColor: '#0070f3', color: 'white', borderColor: '#0070f3' }}
          >
            次へ進む
          </button>
        </div>
      </section>
    </div>
  );
};