// ScheduleScreen.jsx
import React from 'react';
import ScheduleTablePanel from './panels/ScheduleTablePanel.jsx';
import ApplicantListPanel from './panels/ApplicantListPanel.jsx';

const ScheduleScreen = ({ manager }) => {
    // manager.styles.fullScreenLayout のような、画面全体に広がるスタイルを使用
    return (
        <div style={manager.styles.fullScreenLayout}>
            {/* 左側: スケジュール表のパネル */}
            <div style={manager.styles.leftPanel}>
                <ScheduleTablePanel manager={manager} />
            </div>

            {/* 右側: 未アサインの応募者リストのパネル */}
            <div style={manager.styles.rightPanel}>
                <ApplicantListPanel manager={manager} />
            </div>
        </div>
    );
};

export default ScheduleScreen;