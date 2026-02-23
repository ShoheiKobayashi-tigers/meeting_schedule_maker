// src/App.tsx
import React from 'react';
import { useAppStore } from './store/useAppStore';
import { Navigation } from './components/Navigation';
import { SettingMenu } from './components/ui/SettingMenu/SettingMenu';
import { StudentSetting } from './features/Students/StudentSetting';
import { ScheduleSetting } from './features/Schedule/ScheduleSetting';
import { ScheduleScreen } from './features/Main/Main';
import { StartScreen } from './features/StartScreen/StartScreen';
import { GuardianPortal } from './features/ParentForm/GuardianPortal/GuardianPortal';
import { ConfirmationModal } from './components/modals/ConfirmationModal';
import { AutoAssignConfirmModal } from './components/modals/AutoAssignConfirmModal';
import { BulkSetupHub } from './features/BulkSetup/BulkSetupHub';
import { AllocationConfigPage } from './features/AllocationConfig/AllocationConfigPage';

// ★ 追加: ResultStep をインポート
import { ResultStep } from './features/BulkSetup/components/steps/ResultStep';

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
};

export const App: React.FC = () => {
    // 1. URLパスによる保護者用画面の判定
    const path = window.location.pathname;
    if (path.startsWith('/p/')) {
        return <GuardianPortal />;
    }

    // 2. 先生用画面のステート取得
    const workspaceId = useAppStore((state) => state.db.workspaceId);
    const activeStep = useAppStore((state) => state.ui.activeStep);

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
                {activeStep === 'step1' && <StudentSetting />}
                {activeStep === 'step2' && <ScheduleSetting />}
                
                {activeStep === 'step3' && (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                        <h2>Step 3 は現在開発中です</h2>
                        <p>現状は、画面右上の設定メニュー(⚙️)から「保護者フォーム・お便り設定」をご利用ください。</p>
                    </div>
                )}
                
                {activeStep === 'step4' && <ScheduleScreen />}
                
                {/* ★ 修正: ResultStep をそのままマウント */}
                {activeStep === 'step5' && <ResultStep />}
            </main>

            {/* モーダル群（既存のまま） */}
            <BulkSetupHub />
            <AllocationConfigPage />
            <ConfirmationModal />
            <AutoAssignConfirmModal/>
        </div>
    );
};