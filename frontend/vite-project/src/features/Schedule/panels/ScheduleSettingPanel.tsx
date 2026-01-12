import React, { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import * as s from './ScheduleSettingPanel.css';
import { generateTimeSlots } from '../../../utils/timeUtils';

const DURATION_OPTIONS: number[] = [];
for (let i = 5; i <= 60; i += 5) {
  DURATION_OPTIONS.push(i);
}

const ScheduleSettingPanel: React.FC = () => {
  const { scheduleData } = useAppStore((state) => state.db);
  const { interviewDuration } = useAppStore((state) => state.ui);
  const actions = useAppStore((state) => state); // Action類をまとめて取得

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('09:00');


  const TIME_OPTIONS = generateTimeSlots(interviewDuration);

  const handleAddRow = () => {
  // 1. 追加を試みる
    const isAdded = actions.handleAddRowFromTime(selectedStartTime);

    // 2. 追加に成功した時だけ、プルダウンを次に進める
    if (isAdded) {
      const currentIndex = TIME_OPTIONS.indexOf(selectedStartTime);
      if (currentIndex !== -1 && currentIndex < TIME_OPTIONS.length - 1) {
        setSelectedStartTime(TIME_OPTIONS[currentIndex + 1]);
      }
    } else {
      // 追加に失敗（重複）した場合は、何もしない 
      // = selectedStartTime はそのまま保持される
      console.log("重複しているため、プルダウンは維持されました");
    }
  };

  return (
    <div className={s.panelContainer}>
      <h1 className={s.mainTitle}>面談枠の設定</h1>
      <p className={s.description}>面談時間、時間帯（縦軸）、日付（横軸）を設定します。</p>

      {/* --- 面談時間設定 --- */}
      <section className={s.section}>
        <h2 className={s.sectionTitle}>面談時間（分）</h2>
        <div className={s.inputRow}>
          <span className={s.label}>面談時間:</span>
          <select 
            className={s.select}
            value={interviewDuration}
            onChange={(e) => actions.setInterviewDuration(Number(e.target.value))}
          >
            {DURATION_OPTIONS.map(d => <option key={d} value={d}>{d} 分</option>)}
          </select>
        </div>
      </section>

      {/* --- 日付設定 --- */}
      <section className={s.section}>
        <h2 className={s.sectionTitle}>日付 (横軸) の追加と管理</h2>
        <div className={s.inputRow}>
          <input 
            type="date" 
            className={s.input} 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
          />
          <button 
            className={s.addButton}
            onClick={() => selectedDate && actions.handleAddColFromPicker(selectedDate)}
          >
            + 選択した日付を追加
          </button>
        </div>
        <div className={s.listArea}>
          {scheduleData.cols.map((col, idx) => (
            <div key={col} className={s.listItem}>
              <span className={s.listIndex}>{idx + 1}.</span>
              <span className={s.listText}>{col}</span>
              <button className={s.deleteButton} onClick={() => actions.handleDeleteCol(idx)}>削除 &times;</button>
            </div>
          ))}
        </div>
      </section>

      {/* --- 時間設定 --- */}
      <section className={s.section}>
        <h2 className={s.sectionTitle}>時間帯 (縦軸) の追加と管理</h2>
        <div className={s.inputRow}>
          <select 
            className={s.select}
            value={selectedStartTime}
            onChange={(e) => setSelectedStartTime(e.target.value)}
          >
            {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button 
            className={s.addButton}
            onClick={() => handleAddRow()}
          >
            + 時間帯 ({interviewDuration}分間) を追加
          </button>
        </div>
        <div className={s.listArea}>
          {scheduleData.rows.map((row, idx) => (
            <div key={row + idx} className={s.listItem}>
              <span className={s.listIndex}>{idx + 1}.</span>
              <span className={s.listText}>{row}</span>
              <button className={s.deleteButton} onClick={() => actions.handleDeleteRow(idx)}>削除 &times;</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ScheduleSettingPanel;