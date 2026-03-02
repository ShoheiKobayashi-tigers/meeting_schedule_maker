// src/features/Schedule/panels/SlotSettingPanel.tsx
import React from 'react';
import { ToggleSwitch } from '../../../components/ui/ToggleSwitch/ToggleSwitch';
import { useSlotSettings } from '../hooks/useSlotSettings';
import { useProcessedSchedule } from '../../../hooks/useProcessedSchedule';
import { ScheduleBaseTable } from '../../../components/ui/ScheduleBaseTable/ScheduleBaseTable';
import * as s from './SlotSettingPanel.css';
import * as layout from '../../../styles/layout.css';

export const SlotSettingPanel: React.FC = () => {
  const { handleToggleBlock } = useSlotSettings();
  const { grid } = useProcessedSchedule();

  return (
    <div className={layout.basePanelCard}>
      
      {/* 1. 固定領域：ヘッダー */}
      <div className={layout.panelHeader}>
        <h3 className={layout.panelTitle}>面談枠の公開設定</h3>
      </div>

      {/* 2. スクロール領域：テーブル */}
      {/* ※ ScheduleBaseTable が内部で100%広がるように flex を足しています */}
      <div className={layout.panelScrollArea}>
        <ScheduleBaseTable 
          grid={grid}
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
      
    </div>
  );
};