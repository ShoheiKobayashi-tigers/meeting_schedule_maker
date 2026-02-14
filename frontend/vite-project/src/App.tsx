import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// Store をインポート
import { useAppStore, VIEWS } from './store/useAppStore'; 

// コンポーネントのインポート
import ConfirmationModal from './components/modals/ConfirmationModal';
import StudentDetailsModal from './components/modals/StudentDetailsModal';
import UpsertStudentModal from './features/Students/components/modals/UpsertStudentModal';
import Main from './features/Main/Main';
import { GuardianPortal } from './features/ParentForm/GuardianPortal/GuardianPortal';
import ScheduleSetting from './features/Schedule/ScheduleSetting';
import StudentSetting from './features/Students/StudentSetting';
import { StartScreen } from './features/StartScreen/StartScreen';
import Navigation from './components/Navigation';
import { BulkSetupHub } from './features/BulkSetup/BulkSetupHub';
import { ImportStudentModal } from './features/Students/components/modals/ImportStudentModal';

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: '#f7fafc',
};

const contentAreaStyle: React.CSSProperties = {
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

const TeacherRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isSessionActive = useAppStore((state) => state.isSessionActive);

  // まだ「始める」を押していなければ、スタート画面を表示
  if (!isSessionActive) {
    return <StartScreen />;
  }

  // 押していれば、本来の画面（AdminLayoutなど）を表示
  return <>{children}</>;
};

const AdminLayout: React.FC = () => {
    // 1. Store から最新のデータを取得
    const db = useAppStore(state => state.db);
    const ui = useAppStore(state => state.ui);
    
    
    const { currentView } = ui;

    // 2. マネージャーの初期化
    // ※今後、マネージャー内のロジックも Store アクションへ順次移行することを推奨します

    // 3. ビューのレンダリング
    const renderCurrentView = () => {
        switch (currentView) {
            case VIEWS.SCHEDULE:
                return <Main />; // Main 内で独自の Hook (useDnD等) を使うため manager 渡しを削減
            case VIEWS.SETTINGS:
                return <ScheduleSetting />;
            case VIEWS.STUDENTS:
                return <StudentSetting/>;
            default:
                return <Main />;
        }
    };

    return (
        <div style={containerStyle}>
            {/* Navigation は内部で currentView を参照するため Props 不要 */}
            <Navigation/>

            <div style={contentAreaStyle}>
                {renderCurrentView()}
            </div>
            <BulkSetupHub />
            <ConfirmationModal />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <Routes>
            {/* 1. 保護者用ルート: /p/NanoID */}
            <Route path="/p/:workspaceId" element={<GuardianPortal />} />

            {/* 2. 先生用（管理）ルート: それ以外すべて */}
            <Route path="/*" element={<TeacherRoute><AdminLayout /></TeacherRoute>} />
        </Routes>
    );
};

export default App;