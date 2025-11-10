// ScheduleScreen.jsx
import React from 'react';
import StudentSettingsPanel from './panels/StudentSettingsPanel.jsx';

const StudentSettingsScreen = ({ manager }) => {
    // manager.styles.fullScreenLayout のような、画面全体に広がるスタイルを使用
    return (
        <div style={manager.styles.fullScreenLayout}>
            <div style={manager.styles.leftPanel}>
                <StudentSettingsPanel manager={manager} />
            </div>

            <div style={manager.styles.rightPanel}>
            </div>
        </div>
    );
};

export default StudentSettingsScreen;