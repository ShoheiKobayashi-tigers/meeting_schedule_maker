// src/features/Schedule/ScheduleSetting.tsx
import React from 'react';
import { SlotSettingPanel } from './panels/SlotSettingPanel';
import { ScheduleSettingPanel } from './panels/ScheduleSettingPanel';
import * as s from './ScheduleSetting.css';

export const ScheduleSetting: React.FC = () => {
  return (
    <div className={s.container}>
      {/* 左パネル：スロット設定（グリッド） */}
      <div className={s.leftPanel}>
        <SlotSettingPanel />
      </div>

      {/* 右パネル：スケジュール設定（行・列追加） */}
      <div className={s.rightPanel}>
        <ScheduleSettingPanel />
      </div>
    </div>
  );
};