import React, { useState } from 'react';
// カスタムフックをインポート
import useScheduleManager from './hooks/useScheduleManager.js';

// 共通コンポーネントをインポート
import ConfirmationModal from './components/modals/ConfirmationModal.jsx';
import StudentDetailsModal from './components/modals/StudentDetailsModal.jsx';
import UpsertStudentModal from './components/modals/UpsertStudentModal.jsx';

// 画面コンポーネントをインポート
import StudentSettingsPanel from './screens/panels/StudentSettingsPanel.jsx';
import ScheduleSettingsPanel from './screens/panels/ScheduleSettingsPanel.jsx';
import ScheduleTablePanel from './screens/panels/ScheduleTablePanel.jsx';
import SlotSettingsPanel from './screens/panels/SlotSettingsPanel.jsx';
import ApplicantListPanel from './screens/panels/ApplicantListPanel.jsx';

import ScheduleScreen from './screens/ScheduleScreen.jsx';
import SettingsScreen from './screens/SettingsScreen.jsx';
import StudentSettingsScreen from './screens/StudentSettingsScreen.jsx';

import Navigation from './components/Navigation.jsx';

// 初期データはここで定義するか、別途ファイルに分離することも可能
const initialApplicants = [
    {
        id: 'app-1',
        name: '佐藤 太郎',
        student_id: '1201',
        preferred_dates: ['12/01 (月) 09:15 - 09:30', '11/30 (日) 14:00 - 14:15'],
        family_id: '1'
    },
    // 山田花子さんは兄弟なし
    {
        id: 'app-2',
        name: '山田 花子',
        student_id: '1202',
        preferred_dates: ['12/01 (月) 13:00 - 13:15', '11/30 (日) 11:00 - 11:15'],
        family_id: '2'
    },
    {
        id: 'app-3',
        name: '田中 一郎',
        student_id: '1203',
        preferred_dates: ['12/01 (月) 09:00 - 09:15', '11/30 (日) 09:00 - 09:15'],
        family_id: '3'
    },
    // 鈴木美咲さんは希望日程なし
    {
        id: 'app-4',
        name: '鈴木 美咲',
        student_id: '1204',
        preferred_dates: [],
        family_id: '4'
    },
];

const initialSiblings = [
    {
      id: 'sib-1',
      name: '佐藤　次郎',
      family_id: '1',
    },
    {
      id: 'sib-2',
      name: '鈴木　ひとみ',
      family_id: '4',
    },
    {
      id:'sib-3',
      name:'佐藤　輝明',
      family_id: '1',
    }
];

const VIEWS = {
    SCHEDULE: 'schedule',
    SETTINGS: 'settings',
    STUDENTS: 'students',
};

const App = () => {
    const manager = useScheduleManager(initialApplicants);
const [currentView, setCurrentView] = useState(VIEWS.SCHEDULE);

    // 現在のビューに応じてレンダリングするメインコンポーネントを決定
    const renderCurrentView = () => {
        switch (currentView) {
            case VIEWS.SCHEDULE:
                return <ScheduleScreen manager={manager} />;
            case VIEWS.SETTINGS:
                return <SettingsScreen manager={manager} />;
            case VIEWS.STUDENTS:
                return <StudentSettingsScreen manager={manager}  />;
            default:
                return <ScheduleScreen manager={manager} />;
        }
    };

    return (
        <div style={manager.styles.container}>
            {/* 1. 画面切り替えナビゲーションボタンをここに配置 */}
           <Navigation
                       currentView={currentView}
                       onViewChange={setCurrentView} // setCurrentView をそのまま渡す
                       styles={manager.styles}       // スタイルオブジェクトを渡す
                   />
            {/* 2. メインの画面表示領域 */}
            <div style={manager.styles.contentArea}>
                {renderCurrentView()}
            </div>

            {/* モーダル */}
            <ConfirmationModal
                isOpen={manager.modalState.isOpen}
                title={manager.modalState.title}
                message={manager.modalState.message}
                onConfirm={manager.modalState.onConfirm}
                onCancel={() => manager.setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
            />
            <StudentDetailsModal
                isOpen={manager.studentDetailsModalState.isOpen}
                student={manager.studentDetailsModalState.student}
                onClose={manager.closeStudentDetailsModal}
                assignmentDetails={manager.getAssignmentDetails(manager.studentDetailsModalState.student?.id)}
//                 siblingDetails={manager.getSiblingAssignmentDetails(manager.studentDetailsModalState.student)}
            />
            <UpsertStudentModal
                isOpen={manager.upsertStudentModalState.isOpen}
                student={manager.upsertStudentModalState.student}
                allApplicants={manager.applicants}
                allScheduleSlots={manager.allScheduleSlots}
                onSave={manager.handleSaveStudent}
                onClose={manager.closeUpsertStudentModal}
            />
        </div>
    );
};

export default App;