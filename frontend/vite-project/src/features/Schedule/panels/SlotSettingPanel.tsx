import React from 'react';
import { useAppStore } from '../../../store/useAppStore';
import ToggleSwitch from '../../../components/ui/ToggleSwitch/ToggleSwitch';
import * as s from './SlotSettingPanel.css';

const SlotSettingPanel: React.FC = () => {
    const { scheduleData } = useAppStore((state) => state.db);
    const { toggleSlotBlock } = useAppStore();

    return (
        <div className={s.panelContainer}>
            <h3 className={s.panelTitle}>面談枠の公開設定</h3>
            <div className={s.scrollWrapper}>
                <table className={s.gridTable}>
                    <thead>
                        <tr>
                            <th className={s.stickyHeader}>時刻</th>
                            {scheduleData.cols.map(col => (
                                <th key={col} className={s.stickyHeader}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {scheduleData.rows.map((row, rowIndex) => (
                            <tr key={row}>
                                <td className={s.timeCell}>{row}</td>
                                {scheduleData.cols.map((col, colIndex) => {
                                    const status = scheduleData.availability[rowIndex][colIndex];
                                    const isBlocked = status === 'admin_blocked';

                                    return (
                                        <td key={col} className={s.slotCell}>
                                            <div className={s.toggleWrapper}>
                                                <ToggleSwitch 
                                                    isChecked={!isBlocked} // Blockでない = 公開中(checked)
                                                    onChange={() => toggleSlotBlock({rowIndex, colIndex})} 
                                                />
                                                <span className={isBlocked ? s.statusTextOff : s.statusTextOn}>
                                                    {isBlocked ? '停止' : '公開'}
                                                </span>
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SlotSettingPanel;