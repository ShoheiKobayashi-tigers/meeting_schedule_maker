import React, { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import * as s from './ScheduleSettingPanel.css';

const ScheduleSettingPanel: React.FC = () => {
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  // 実際には Store に addRow, addCol などのアクションを追加する必要があります

  return (
    <div className={s.panelContainer}>
      <h3 className={s.panelTitle}>スケジュールの枠組み設定</h3>

      <section className={s.settingSection}>
        <label className={s.label}>日付の追加 (列)</label>
        <div className={s.inputGroup}>
          <input type="text" placeholder="例: 12/02 (火)" className={s.input} />
          <button className={s.addButton}>追加</button>
        </div>
      </section>

      <section className={s.settingSection}>
        <label className={s.label}>時間枠の追加 (行)</label>
        <div className={s.inputGroup}>
          <input type="text" placeholder="例: 10:00" className={s.input} />
          <button className={s.addButton}>追加</button>
        </div>
      </section>
    </div>
  );
};

export default ScheduleSettingPanel;