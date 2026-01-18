import React from 'react';
import ToggleSwitch from '../../../components/ui/ToggleSwitch/ToggleSwitch';
import { useSlotSettings } from '../hooks/useSlotSettings';
import { useProcessedSchedule } from '../../../hooks/useProcessedSchedule';
import * as s from './SlotSettingPanel.css';

const SlotSettingPanel: React.FC = () => {
  const { handleToggleBlock } = useSlotSettings();
  const { grid } = useProcessedSchedule();

  return (
    <div className={s.panelContainer}>
      <h3 className={s.panelTitle}>面談枠の公開設定</h3>
      <div className={s.scrollWrapper}>
        <table className={s.gridTable}>
          <thead>
            <tr>
              <th className={s.stickyHeader}>時刻</th>
              {grid[0]?.cells.map((cell) => (
                <th key={cell.colLabel} className={s.stickyHeader}>
                  {cell.displayColLabel} {/* 01/01 (木) と表示される */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row) => (
              <tr key={row.rowLabel}>
                <td className={s.timeCell}>{row.rowLabel}</td>
                {row.cells.map((cell) => {
                  const isBlocked = cell.status === 'admin_block';
                  return (
                    <td key={cell.displayColLabel} className={s.slotCell}>
                      <div className={s.toggleWrapper}>
                        <ToggleSwitch 
                          isChecked={!isBlocked} 
                          onChange={() => handleToggleBlock(cell.rowIndex, cell.colIndex)} 
                        />
                        <span className={isBlocked ? s.statusTextOff : s.statusTextOn}>
                          {isBlocked ? '不可' : '面談可'}
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