// src/components/Navigation.tsx
import React from 'react';
import { useAppStore, AppStepId } from '../store/useAppStore';
import * as s from './Navigation.css';

const STEPS = [
  { id: 'step1', label: '1. 名簿の準備', sub: [{ id: '1-1', label: '1-1. 児童リストの登録' }, { id: '1-2', label: '1-2. 兄弟姉妹の設定' }] },
  { id: 'step2', label: '2. 面談枠の作成', sub: [{ id: '2-1', label: '2-1. 実施日時の設定' }, { id: '2-2', label: '2-2. 枠の調整・ブロック' }] },
  { id: 'step3', label: '3. 希望日程の回収', sub: [] }, // 動的に生成
  { id: 'step4', label: '4. スケジュール割当', sub: [{ id: '4-1', label: '4-1. 自動割り当て' }, { id: '4-2', label: '4-2. 手動微調整' }] },
  { id: 'step5', label: '5. 確定と結果出力', sub: [{ id: '5-1', label: '5-1. 結果お知らせ出力' }] },
] as const;

export const Navigation: React.FC = () => {
  const { activeStep, activeSubStep, step3Mode } = useAppStore(state => state.ui);
  const { setActiveStep, setActiveSubStep, setStep3Mode } = useAppStore(state => state);

  // 親タブをクリックした時の処理
  const handleStepClick = (stepId: AppStepId) => {
    setActiveStep(stepId);
    if (stepId === 'step1') setActiveSubStep('1-1');
    if (stepId === 'step2') setActiveSubStep('2-1');
    if (stepId === 'step3') {
       if (step3Mode === 'form') setActiveSubStep('3A-1');
       else if (step3Mode === 'manual') setActiveSubStep('3B-1');
       else setActiveSubStep(''); 
    }
    if (stepId === 'step4') setActiveSubStep('4-1');
    if (stepId === 'step5') setActiveSubStep('5-1');
  };

  // 現在のステップに応じた子タブのリストを取得する
  const getActiveSubSteps = () => {
    if (activeStep === 'step3') {
      if (step3Mode === 'form') return [{ id: '3A-1', label: '3A-1. お便り作成・印刷' }, { id: '3A-2', label: '3A-2. フォーム公開・同期' }];
      if (step3Mode === 'manual') return [{ id: '3B-1', label: '3B-1. 希望日程の手入力' }];
      return [];
    }
    return STEPS.find(s => s.id === activeStep)?.sub || [];
  };

  const currentSubSteps = getActiveSubSteps();

  return (
    <nav className={s.navContainer}>
      {/* 親タブ (Tier 1) */}
      <ul className={s.parentTabList}>
        {STEPS.map(step => (
          <li
            key={step.id}
            className={activeStep === step.id ? s.parentTabActive : s.parentTab}
            onClick={() => handleStepClick(step.id as AppStepId)}
          >
            <span>{step.label}</span>
          </li>
        ))}
      </ul>

      {/* 子タブ (Tier 2) */}
      <div className={s.childTabContainer}>
        <ul className={s.childTabList}>
          {currentSubSteps.map(sub => (
            <li
              key={sub.id}
              className={activeSubStep === sub.id ? s.childTabActive : s.childTab}
              onClick={() => setActiveSubStep(sub.id)}
            >
              {sub.label}
            </li>
          ))}
        </ul>

        {/* Step 3 かつ モード選択済みの場合のみ、右端に変更ボタンを表示 */}
        {activeStep === 'step3' && step3Mode !== null && (
          <button
            className={s.modeSwitchBtn}
            onClick={() => {
              setStep3Mode(null);
              setActiveSubStep('');
            }}
          >
            🔄 回収方法を変更する
          </button>
        )}
      </div>
    </nav>
  );
};