// features/BulkSetup/BulkSetupHub.tsx
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ImportStep } from './components/steps/ImportStep';
import { TemplateStep } from './components/steps/TemplateStep';
import { PreviewStep } from './components/steps/PreviewStep';
import { HandoutStep } from './components/steps/HandoutStep';
import { SyncStep } from './components/steps/SyncStep';
import { BULK_STEPS, BulkStep } from './types';
import * as s from './BulkSetupHub.css';
  
export const BulkSetupHub: React.FC = () => {
  const isBulkSetupOpen = useAppStore((state) => state.isBulkSetupOpen);
  const setBulkSetupOpen = useAppStore((state) => state.setBulkSetupOpen);
  
  // 現在のステップを管理
  const [activeStep, setActiveStep] = useState<BulkStep>('import');

  const handleNext = () => {
    if (activeStep === 'import') setActiveStep('template');
    else if (activeStep === 'template') setActiveStep('preview');
    else if (activeStep === 'preview') setActiveStep('handout');
    else if (activeStep === 'sync') setActiveStep('sync');
  };

  const StepComponents: Record<BulkStep, React.ReactElement> = {
    import: <ImportStep onNext={handleNext} />,
    template: <TemplateStep onNext={handleNext} />,
    preview: <PreviewStep onNext={handleNext} />,
    handout: <HandoutStep onNext={handleNext} />,
    sync: <SyncStep />,
  };


  if (!isBulkSetupOpen) return null;

  return (
    <div className={s.overlay}>
      <header className={s.header}>
        <div className={s.headerLeft}>
          <h2 className={s.title}>一括設定・連携センター</h2>
        </div>
        <button className={s.closeButton} onClick={() => setBulkSetupOpen(false)}>
          ✕ 閉じて名簿に戻る
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
            {StepComponents[activeStep]}
          </div>
        </main>
      </div>
    </div>
  );
};