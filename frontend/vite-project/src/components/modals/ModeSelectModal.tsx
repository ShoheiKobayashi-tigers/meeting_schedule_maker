import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import * as s from './ModeSelectModal.css';

export const ModeSelectModal: React.FC = () => {
  const { setStep3Mode, setActiveSubStep } = useAppStore();

  const handleSelect = (mode: 'form' | 'manual') => {
    setStep3Mode(mode);
    if (mode === 'manual') {
      setActiveSubStep('3A-1');
    } else {
      setActiveSubStep('3B-1');
    }
  };

  return (
    <div className={s.overlay}>
      <div className={s.container}>
        <h2 className={s.title}>希望日程の回収方法</h2>
        <p className={s.description}>
          保護者からの面談希望日時の回収方法を選択してください。<br/>
          ※この設定は後から右上の「🔄 回収方法を変更する」ボタンで変更可能です。
        </p>

        <div className={s.cardContainer}>
          {/* モードA：手入力 */}
          <div className={s.card} onClick={() => handleSelect('manual')}>
            <div className={s.cardIcon}>⌨️</div>
            <div className={s.cardTitle}>プリントで回収・手入力</div>
            <div className={s.cardText}>
              従来通り紙のプリントを配布・回収し、先生が画面を見ながら手作業で希望日程をシステムに入力します。
            </div>
          </div>

          {/* モードB：保護者フォーム */}
          <div className={s.card} onClick={() => handleSelect('form')}>
            <div className={s.cardIcon}>📱</div>
            <div className={s.cardTitle}>保護者フォームで回収</div>
            <div className={s.cardText}>
              専用のWEBフォームURLを発行し、保護者のスマホから直接希望を入力してもらいます。
              ペーパーレスで自動集計されます。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};