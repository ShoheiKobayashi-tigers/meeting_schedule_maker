// src/components/Navigation.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import * as s from './Navigation.css';

// URLのパス（行き先）を追加した新しいSTEPS定義
const STEPS = [
  { id: 'step1', label: '1. 名簿の準備', sub: [{ id: '1-1', label: '1-1. 児童リストの登録', path: '/app/step1/students' }, { id: '1-2', label: '1-2. 兄弟姉妹の設定', path: '/app/step1/siblings' }] },
  { id: 'step2', label: '2. 面談枠の作成', sub: [{ id: '2-1', label: '2-1. 実施日時の設定', path: '/app/step2/datetime' }, { id: '2-2', label: '2-2. 枠の調整・ブロック', path: '/app/step2/slots' }] },
  { id: 'step3', label: '3. 希望日程の回収', sub: [] }, // 動的に生成
  { id: 'step4', label: '4. スケジュール割当', sub: [{ id: '4-1', label: '4-1. 自動割り当て', path: '/app/step4/config' }, { id: '4-2', label: '4-2. 手動微調整', path: '/app/step4/board' }] },
  { id: 'step5', label: '5. 確定と結果出力', sub: [{ id: '5-1', label: '5-1. 結果お知らせ出力', path: '/app/step5/result' }] },
] as const;

export const Navigation: React.FC = () => {
  // 🌟 React Router の機能を使って「現在地」と「移動手段」を取得
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // step3のモード（手入力かフォームか）は引き続きZustandで管理する
  const { step3Mode } = useAppStore(state => state.db);
  const setStep3Mode = useAppStore(state => state.setStep3Mode);

  // 🌟 Zustandの代わりに「URL」を見て、今どの親タブがアクティブかを判定する
  let activeStep = 'step1';
  if (path.includes('/app/step2')) activeStep = 'step2';
  else if (path.includes('/app/step3')) activeStep = 'step3';
  else if (path.includes('/app/step4')) activeStep = 'step4';
  else if (path.includes('/app/step5')) activeStep = 'step5';

  // 「URL」を見て、今どの子タブがアクティブかを判定する
  let activeSubStep = '';
  if (path === '/app/step1/students') activeSubStep = '1-1';
  if (path === '/app/step1/siblings') activeSubStep = '1-2';
  if (path === '/app/step2/datetime') activeSubStep = '2-1';
  if (path === '/app/step2/slots') activeSubStep = '2-2';
  if (path === '/app/step3/manual') activeSubStep = '3A-1'; // 3B-3も同じ画面を使い回す
  if (path === '/app/step3/form/document') activeSubStep = '3B-1';
  if (path === '/app/step3/form/publish') activeSubStep = '3B-2';
  if (path === '/app/step3/form/manual') activeSubStep = '3B-3';
  if (path === '/app/step4/config') activeSubStep = '4-1';
  if (path === '/app/step4/board') activeSubStep = '4-2';
  if (path === '/app/step5/result') activeSubStep = '5-1';

  // 親タブをクリックした時の処理（ZustandではなくURLを移動させる）
  const handleStepClick = (stepId: string) => {
    if (stepId === 'step1') navigate('/app/step1/students');
    if (stepId === 'step2') navigate('/app/step2/datetime');
    if (stepId === 'step3') {
       if (step3Mode === 'manual') navigate('/app/step3/manual');
       else if (step3Mode === 'form') navigate('/app/step3/form/document');
       else navigate('/app/step3'); // モード選択画面へ
    }
    if (stepId === 'step4') navigate('/app/step4/config');
    if (stepId === 'step5') navigate('/app/step5/result');
  };

  // 現在のステップに応じた子タブのリストを取得する
  const getActiveSubSteps = () => {
    if (activeStep === 'step3') {
      if (step3Mode === 'manual') return [{ id: '3A-1', label: '3A-1. 希望日程の手入力', path: '/app/step3/manual' }];
      if (step3Mode === 'form') return [
        { id: '3B-1', label: '3B-1. お便り作成・印刷', path: '/app/step3/form/document' },
        { id: '3B-2', label: '3B-2. フォーム公開・同期', path: '/app/step3/form/publish' },
        { id: '3B-3', label: '3B-3. 回収状況確認・手入力', path: '/app/step3/form/manual' }
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
              onClick={() => navigate(sub.path)} // クリックでURLを移動
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
              navigate('/app/step3'); // モード選択のURLへ戻る
            }}
          >
            🔄 回収方法を変更する
          </button>
        )}
      </div>
    </nav>
  );
};