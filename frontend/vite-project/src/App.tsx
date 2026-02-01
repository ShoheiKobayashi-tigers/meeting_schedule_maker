import React from 'react';
// Store をインポート
import { useAppStore, VIEWS } from './store/useAppStore'; 

// コンポーネントのインポート
import ConfirmationModal from './components/modals/ConfirmationModal';
import StudentDetailsModal from './components/modals/StudentDetailsModal';
import UpsertStudentModal from './features/Students/components/modals/UpsertStudentModal';
import Main from './features/Main/Main';
import ScheduleSetting from './features/Schedule/ScheduleSetting';
import StudentSetting from './features/Students/StudentSetting';
import Navigation from './components/Navigation';
import { BulkSetupHub } from './features/BulkSetup/BulkSetupHub';

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

const App: React.FC = () => {
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
            {/* --- モーダル群 --- */}
            
            {/* 生徒詳細モーダル
            <StudentDetailsModal
                isOpen={manager.studentDetailsModalState.isOpen}
                student={manager.studentDetailsModalState.student}
                onClose={manager.closeStudentDetailsModal}
                assignmentDetails={manager.getAssignmentDetails(manager.studentDetailsModalState.student?.id)}
                siblingDetails={siblingsManager.getSiblingsForStudent(manager.studentDetailsModalState.student)}
            />
 */}
            {/* 生徒追加・編集モーダル */}
            {/* <UpsertStudentModal
                isOpen={manager.upsertStudentModalState.isOpen}
                applicantId={manager.upsertStudentModalState.student?.id ?? null}
                allScheduleSlots={manager.allScheduleSlots}
                onClose={manager.closeUpsertStudentModal}
            /> */}
        </div>
    );
};

export default App;