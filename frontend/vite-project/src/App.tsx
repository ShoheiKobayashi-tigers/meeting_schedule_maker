// src/App.tsx
import React from 'react';
import { useAppStore } from './store/useAppStore';
import { Navigation } from './components/Navigation';
import { SettingMenu } from './components/ui/SettingMenu/SettingMenu';
import { StartScreen } from './features/StartScreen/StartScreen';
import { GuardianPortal } from './features/ParentForm/GuardianPortal/GuardianPortal';

// === Step 1 用パネル ===
import { ApplicantSettingPanel } from './features/Students/panels/ApplicantSettingPanel';
import { SiblingSettingPanel } from './features/Students/panels/SiblingSettingPanel';

// === Step 2 用パネル ===
import { ScheduleSettingPanel } from './features/Schedule/panels/ScheduleSettingPanel';
import { SlotSettingPanel } from './features/Schedule/panels/SlotSettingPanel';

// === Step 3 用パネル ===
import { DocumentStep } from './features/BulkSetup/components/steps/DocumentStep';
import { PublishStep } from './features/BulkSetup/components/steps/PublishStep';
import { ModeSelectModal } from './components/modals/ModeSelectModal';

// === Step 4 用パネル ===
import { AllocationConfigPage } from './features/AllocationConfig/AllocationConfigPage';
import { ScheduleScreen } from './features/Main/Main';

// === Step 5 用パネル ===
import { ResultStep } from './features/BulkSetup/components/steps/ResultStep';

// === UIパーツとモーダル群 ===
import { ConfirmationModal } from './components/modals/ConfirmationModal';
import { AutoAssignConfirmModal } from './components/modals/AutoAssignConfirmModal';
import { BulkSetupHub } from './features/BulkSetup/BulkSetupHub';
// (旧StudentSetting内にあったモーダルをAppに移動)
import { ImportStudentModal } from './features/Students/components/modals/ImportStudentModal';

// --- 安全なレイアウトスタイル ---
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column', 
  height: '100vh',
  backgroundColor: '#f8fafc',
};

const topBarStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 24px',
  height: '48px',
  backgroundColor: '#ffffff',
};

const appTitleStyle: React.CSSProperties = {
  fontWeight: 'bold', 
  fontSize: '1.2rem', 
  color: '#0ea5e9',
  margin: 0,
};

const scrollAreaStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column', // パネルが高さ一杯に広がるように追加
};

export const App: React.FC = () => {
    // 1. URLパスによる保護者用画面の判定
    const path = window.location.pathname;
    if (path.startsWith('/p/')) {
        return <GuardianPortal />;
    }

    // 2. 先生用画面のステート取得
    const workspaceId = useAppStore((state) => state.db.workspaceId);
    const { activeStep, activeSubStep, step3Mode } = useAppStore((state) => state.ui);
    const setActiveSubStep = useAppStore((state) => state.setActiveSubStep);

    if (!workspaceId) {
        return <StartScreen />;
    }

    // 3. 先生用メインレイアウト
    return (
        <div style={containerStyle}>
            {/* 一番上のバー（タイトルと設定） */}
            <header style={topBarStyle}>
                <h1 style={appTitleStyle}>面談スケジュールメーカー</h1>
                <SettingMenu />
            </header>

            {/* 2段構えのナビゲーション */}
            <Navigation />

            {/* メイン表示領域（フェーズ1では既存コンポーネントをそのまま描画） */}
            <main style={scrollAreaStyle}>
                
                {/* =========================================
                    Step 1: 名簿の準備
                ========================================= */}
                {activeStep === 'step1' && activeSubStep === '1-1' && (
                    <ApplicantSettingPanel />
                )}
                {activeStep === 'step1' && activeSubStep === '1-2' && (
                    <SiblingSettingPanel />
                )}

                {/* =========================================
                    Step 2: 面談枠の作成
                ========================================= */}
                {activeStep === 'step2' && activeSubStep === '2-1' && (
                    <ScheduleSettingPanel />
                )}
                {activeStep === 'step2' && activeSubStep === '2-2' && (
                    <SlotSettingPanel />
                )}
                
                {/* =========================================
                    Step 3: 希望日程の回収
                ========================================= */}
                {activeStep === 'step3' && (
                    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        
                        {/* モード未選択時: 背景に3A-1を置き、上にModalを被せる */}
                        {step3Mode === null && (
                            <>
                                {/* 背景としてダミー表示（ぼかし効果） */}
                                <div style={{ filter: 'blur(3px)', opacity: 0.5, pointerEvents: 'none', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <DocumentStep onNext={() => {}} />
                                </div>
                                <ModeSelectModal />
                            </>
                        )}

                        {/* モードA: フォーム */}
                        {step3Mode === 'form' && activeSubStep === '3A-1' && (
                            <DocumentStep onNext={() => setActiveSubStep('3A-2')} />
                        )}
                        {step3Mode === 'form' && activeSubStep === '3A-2' && (
                            <PublishStep />
                        )}

                        {/* モードB: 手入力 (これから作る画面のプレースホルダー) */}
                        {step3Mode === 'manual' && activeSubStep === '3B-1' && (
                            <div style={{ padding: '24px' }}>
                                <h2>⌨️ 3B-1. 希望日程の手入力</h2>
                                <p>（ここに爆速手入力UIを作っていきます！）</p>
                            </div>
                        )}
                    </div>
                )}

                {/* =========================================
                    Step 4: スケジュール割当
                ========================================= */}
                {activeStep === 'step4' && activeSubStep === '4-1' && (
                    <AllocationConfigPage />
                )}
                {activeStep === 'step4' && activeSubStep === '4-2' && (
                    <ScheduleScreen />
                )}
                
                {/* =========================================
                    Step 5: 確定と結果出力
                ========================================= */}
                {activeStep === 'step5' && activeSubStep === '5-1' && (
                    <ResultStep />
                )}
                
            </main>

            {/* モーダル群 (旧StudentSetting内にあったものもここに集約) */}
            <ImportStudentModal />
            <BulkSetupHub />
            <ConfirmationModal />
            <AutoAssignConfirmModal/>
        </div>
    );
};