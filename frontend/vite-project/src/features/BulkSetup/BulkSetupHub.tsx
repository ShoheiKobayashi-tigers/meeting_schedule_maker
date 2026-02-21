// features/BulkSetup/BulkSetupHub.tsx
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { DocumentStep } from './components/steps/DocumentStep'; // 新規作成 (旧2+4)
import { PublishStep } from './components/steps/PublishStep';   // 新規作成 (旧3+5)
import * as s from './BulkSetupHub.css';

// ステップ定義をシンプルに再編
type BulkStep = 'document' | 'publish';

const BULK_STEPS = [
  { 
    id: 'document' as BulkStep, 
    label: '1. 希望日程調査のお便りの作成', 
    description: '配布するお便りの設定とダウンロードを行います。' 
  },
  { 
    id: 'publish' as BulkStep, 
    label: '2. 保護者フォーム公開設定', 
    description: '保護者画面のプレビューとクラウド同期、公開切替を行います。' 
  },
];

export const BulkSetupHub: React.FC = () => {
  const isBulkSetupOpen = useAppStore((state) => state.ui.isBulkSetupOpen);
  const setBulkSetupOpen = useAppStore((state) => state.setBulkSetupOpen);
  
  const [activeStep, setActiveStep] = useState<BulkStep>('document');

  const handleNext = () => {
    if (activeStep === 'document') setActiveStep('publish');
    // publish の次は完了なので特に遷移なし（閉じるなど）
  };

  if (!isBulkSetupOpen) return null;

  return (
    <div className={s.overlay}>
      <header className={s.header}>
        <div className={s.headerLeft}>
          <h2 className={s.title}>保護者フォーム・お便り設定</h2>
        </div>
        <button className={s.closeButton} onClick={() => setBulkSetupOpen(false)}>
          ✕ 閉じてメイン画面に戻る
        </button>
      </header>
      
      <div className={s.container}>
        <aside className={s.sidebar}>
          <nav>
            <ul className={s.stepList}>
              {BULK_STEPS.map((step) => (
                <li 
                  key={step.id}
                  // アクティブなステップに特別なスタイルを当てる
                  className={activeStep === step.id ? s.stepItemActive : s.stepItem}
                  onClick={() => setActiveStep(step.id)}
                >
                  <div className={s.stepLabel}>{step.label}</div>
                  <div className={s.stepDescription}>{step.description}</div>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        
        <main className={s.content}>
          <div className={s.contentInner}>
            {activeStep === 'document' && <DocumentStep onNext={handleNext} />}
            {activeStep === 'publish' && <PublishStep />}
          </div>
        </main>
      </div>
    </div>
  );
};