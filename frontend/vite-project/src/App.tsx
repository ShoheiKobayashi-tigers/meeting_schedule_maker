// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import { ManualInputPanel } from './features/ManualInput/ManualInputPanel';

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

import * as layout from './styles/layout.css'

// ----------------------------------------------------
// 新設: 先生用のメイン画面を独立したコンポーネントにする
// ----------------------------------------------------
const TeacherApp: React.FC = () => {
    const workspaceId = useAppStore((state) => state.db.workspaceId);
    const { activeStep, activeSubStep, step3Mode } = useAppStore((state) => state.ui);
    const setActiveSubStep = useAppStore((state) => state.setActiveSubStep);

    if (!workspaceId) {
        return <StartScreen />;
    }

    // 3. 先生用メインレイアウト
    return (
        <div className={layout.appContainer}>
            {/* 一番上のバー（タイトルと設定） */}
            <header className={layout.appHeader}>
                <h1 className={layout.appTitle}>面談スケジュールメーカー</h1>
                <SettingMenu />
            </header>

            {/* 2段構えのナビゲーション */}
            <Navigation />

            {/* メイン表示領域（フェーズ1では既存コンポーネントをそのまま描画） */}
            <main className={layout.appMainArea}>
                
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
                    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column',height: '100%', overflow: 'hidden' }}>
                        
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

                        {/* モードA: 手入力 (これから作る画面のプレースホルダー) */}
                        {step3Mode === 'manual' && activeSubStep === '3A-1' && (
                            <ManualInputPanel />
                        )}
                        {/* モードB: フォーム */}
                        {step3Mode === 'form' && activeSubStep === '3B-1' && (
                            <DocumentStep onNext={() => setActiveSubStep('3B-2')} />
                        )}
                        {step3Mode === 'form' && activeSubStep === '3B-2' && (
                            <PublishStep />
                        )}
                        {step3Mode === 'form' && activeSubStep === '3B-3' && (
                            <ManualInputPanel />
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

// ----------------------------------------------------
// アプリの根幹: URLに応じて表示する画面を切り替える
// ----------------------------------------------------
export const App: React.FC = () => {
    return (
        <Routes>
            {/* "/p/〇〇" のURLにアクセスした場合は保護者画面を表示 */}
            <Route path="/p/:workspaceId" element={<GuardianPortal />} />
            
            {/* それ以外のURL ("/" など) にアクセスした場合は先生画面を表示 */}
            <Route path="/*" element={<TeacherApp />} />
        </Routes>
    );
};