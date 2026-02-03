import React from 'react';
import * as s from './ImportStep.css'; // スタイルを再利用
import Button from '../../../../components/ui/Button/Button';

export const TemplateStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  return (
    <div className={s.container}>
      <section className={s.section}>
        <h4 className={s.sectionTitle}>2. お便りの共通項目を設定</h4>
        <p className={s.description}>配付する案内に記載する情報を入力してください。</p>
        
        <div style={{ display: 'grid', gap: '16px', maxWidth: '400px', marginTop: '16px' }}>
          <label>学校名<br/><input type="text" placeholder="〇〇小学校" style={{ width: '100%' }}/></label>
          <label>校長名<br/><input type="text" placeholder="校長 氏名" style={{ width: '100%' }}/></label>
          <label>担任名<br/><input type="text" placeholder="第1学年1組 担任" style={{ width: '100%' }}/></label>
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