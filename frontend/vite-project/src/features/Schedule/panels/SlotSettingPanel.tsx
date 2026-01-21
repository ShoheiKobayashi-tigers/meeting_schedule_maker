import React from 'react';
import ToggleSwitch from '../../../components/ui/ToggleSwitch/ToggleSwitch';
import { useSlotSettings } from '../hooks/useSlotSettings';
import { useProcessedSchedule } from '../../../hooks/useProcessedSchedule';
import ScheduleBaseTable from '../../../components/ui/ScheduleBaseTable/ScheduleBaseTable';
import * as s from './SlotSettingPanel.css';

const SlotSettingPanel: React.FC = () => {
  const { handleToggleBlock } = useSlotSettings();
  const { grid } = useProcessedSchedule();

  return (
    <div className={s.panelContainer}>
      <h3 className={s.panelTitle}>面談枠の公開設定</h3>
      <ScheduleBaseTable 
        grid={grid}
        timeHeaderLabel="時刻" // ここを「時刻」に変えることで既存表示を維持
        renderCell={(cell) => {
          const isBlocked = cell.status === 'admin_block';
          return (
            <div className={s.toggleWrapper}>
              <ToggleSwitch 
                isChecked={!isBlocked} 
                onChange={() => handleToggleBlock(cell.rowIndex, cell.colIndex)} 
              />
              <span className={isBlocked ? s.statusTextOff : s.statusTextOn}>
                {isBlocked ? '不可' : '面談可'}
              </span>
            </div>
          );
        }}
      />
    </div>
  );
};

export default SlotSettingPanel;