// src/components/Navigation.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import * as s from './Navigation.css';

// 🌟 URLから "/app" を抜き、相対パス（/step...）で定義し直す
const STEPS = [
  { id: 'step1', label: '1. 名簿の準備', sub: [{ id: '1-1', label: '1-1. 児童リストの登録', path: '/step1/students' }, { id: '1-2', label: '1-2. 兄弟姉妹の設定', path: '/step1/siblings' }] },
  { id: 'step2', label: '2. 面談枠の作成', sub: [{ id: '2-1', label: '2-1. 実施日時の設定', path: '/step2/datetime' }, { id: '2-2', label: '2-2. 枠の調整・ブロック', path: '/step2/slots' }] },
  { id: 'step3', label: '3. 希望日程の回収', sub: [] }, 
  { id: 'step4', label: '4. スケジュール割当', sub: [{ id: '4-1', label: '4-1. 自動割り当て', path: '/step4/config' }, { id: '4-2', label: '4-2. 手動微調整', path: '/step4/board' }] },
  { id: 'step5', label: '5. 確定と結果出力', sub: [{ id: '5-1', label: '5-1. 結果お知らせ出力', path: '/step5/result' }] },
] as const;

export const Navigation: React.FC = () => {
  // 🌟 React Router の機能を使って「現在地」と「移動手段」を取得
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // 🌟 現在のURLがデモモードかどうかを判定し、ベースとなるパスを決定する
  const basePath = path.startsWith('/demo') ? '/demo' : '/app';

  // 判定用にベースパスを取り除いた「相対パス」を作る（例: "/step1/students"）
  const relativePath = path.replace(basePath, '');

  const { step3Mode } = useAppStore(state => state.db);
  const setStep3Mode = useAppStore(state => state.setStep3Mode);

  // 🌟 URLの相対パスを見て、今どの親タブがアクティブかを判定
  let activeStep = 'step1';
  if (relativePath.startsWith('/step2')) activeStep = 'step2';
  else if (relativePath.startsWith('/step3')) activeStep = 'step3';
  else if (relativePath.startsWith('/step4')) activeStep = 'step4';
  else if (relativePath.startsWith('/step5')) activeStep = 'step5';

  // 🌟 URLの相対パスを見て、今どの子タブがアクティブかを判定
  let activeSubStep = '';
  if (relativePath === '/step1/students') activeSubStep = '1-1';
  if (relativePath === '/step1/siblings') activeSubStep = '1-2';
  if (relativePath === '/step2/datetime') activeSubStep = '2-1';
  if (relativePath === '/step2/slots') activeSubStep = '2-2';
  if (relativePath === '/step3/manual') activeSubStep = '3A-1';
  if (relativePath === '/step3/form/document') activeSubStep = '3B-1';
  if (relativePath === '/step3/form/publish') activeSubStep = '3B-2';
  if (relativePath === '/step3/form/manual') activeSubStep = '3B-3';
  if (relativePath === '/step4/config') activeSubStep = '4-1';
  if (relativePath === '/step4/board') activeSubStep = '4-2';
  if (relativePath === '/step5/result') activeSubStep = '5-1';

  // 親タブをクリックした時の処理（🌟 basePath を先頭にくっつける）
  const handleStepClick = (stepId: string) => {
    if (stepId === 'step1') navigate(`${basePath}/step1/students`);
    if (stepId === 'step2') navigate(`${basePath}/step2/datetime`);
    if (stepId === 'step3') {
       if (step3Mode === 'manual') navigate(`${basePath}/step3/manual`);
       else if (step3Mode === 'form') navigate(`${basePath}/step3/form/document`);
       else navigate(`${basePath}/step3`); 
    }
    if (stepId === 'step4') navigate(`${basePath}/step4/config`);
    if (stepId === 'step5') navigate(`${basePath}/step5/result`);
  };

  // 現在のステップに応じた子タブのリストを取得する
  const getActiveSubSteps = () => {
    if (activeStep === 'step3') {
      if (step3Mode === 'manual') return [{ id: '3A-1', label: '3A-1. 希望日程の手入力', path: '/step3/manual' }];
      if (step3Mode === 'form') return [
        { id: '3B-1', label: '3B-1. お便り作成・印刷', path: '/step3/form/document' },
        { id: '3B-2', label: '3B-2. フォーム公開・同期', path: '/step3/form/publish' },
        { id: '3B-3', label: '3B-3. 回収状況確認・手入力', path: '/step3/form/manual' }
      ];
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
            onClick={() => handleStepClick(step.id)}
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
              // 🌟 子タブのクリック時も basePath を先頭にくっつける
              onClick={() => navigate(`${basePath}${sub.path}`)} 
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
              navigate(`${basePath}/step3`); // 🌟 ここも修正
            }}
          >
            🔄 回収方法を変更する
          </button>
        )}
      </div>
    </nav>
  );
};