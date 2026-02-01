// features/BulkSetup/BulkSetupHub.tsx
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { BULK_STEPS, BulkStep } from './types';
import * as s from './BulkSetupHub.css';

// 後で各ステップの中身を別ファイルに切り出します
const StepContent: React.FC<{ step: BulkStep }> = ({ step }) => {
  switch (step) {
    case 'import': return <div>Excelドロップエリア（実装予定）</div>;
    case 'template': return <div>お便りテンプレート編集（実装予定）</div>;
    case 'handout': return <div>docx一括生成・ダウンロード（実装予定）</div>;
    case 'sync': return <div>クラウドDB同期（実装予定）</div>;
    default: return null;
  }
};

export const BulkSetupHub: React.FC = () => {
  const isBulkSetupOpen = useAppStore((state) => state.isBulkSetupOpen);
  const setBulkSetupOpen = useAppStore((state) => state.setBulkSetupOpen);
  
  // 現在のステップを管理
  const [activeStep, setActiveStep] = useState<BulkStep>('import');

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
             {/* 現在のステップに応じたコンテンツを表示 */}
            <StepContent step={activeStep} />
          </div>
        </main>
      </div>
    </div>
  );
};