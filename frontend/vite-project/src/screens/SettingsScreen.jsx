// SettingsScreen.jsx
import React from 'react';
import SlotSettingsPanel from './panels/SlotSettingsPanel.jsx';
import ScheduleSettingsPanel from './panels/ScheduleSettingsPanel.jsx';

const SettingsScreen = ({ manager }) => {
    return (
        <div style={manager.styles.fullScreenLayout}>
            {/* 左側: スロット設定パネル（時間帯設定） */}
            <div style={manager.styles.leftPanel}>
                <ScheduleSettingsPanel manager={manager} />
            </div>

            {/* 右側: スケジュール全体設定（日付範囲など、その他の設定） */}
            <div style={manager.styles.rightPanel}>
                <SlotSettingsPanel manager={manager} />
            </div>
        </div>
    );
};

export default SettingsScreen;