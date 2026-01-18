import React from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { useProcessedSchedule } from '../../../hooks/useProcessedSchedule';
import { useScheduleSettings } from '../hooks/useScheduleSettings';
import { generateTimeSlots } from '../../../utils/timeUtils';
import * as s from './ScheduleSettingPanel.css';

const DURATION_OPTIONS = [5, 10, 15, 20, 25, 30, 45, 60];

const ScheduleSettingPanel: React.FC = () => {
  const interviewDuration = useAppStore((state) => state.ui.interviewDuration);
  
  const {
    selectedDate, setSelectedDate,
    selectedStartTime, setSelectedStartTime,
    onAddDate, handleAddRow,
    confirmDeleteCol, confirmDeleteRow,
    setInterviewDuration
  } = useScheduleSettings();

  const { sortedRows, sortedCols } = useProcessedSchedule();

  const TIME_OPTIONS = generateTimeSlots(interviewDuration);

  const onAddRowClick = () => {
    const isAdded = handleAddRow(selectedStartTime);
    if (isAdded) {
      const nextIdx = TIME_OPTIONS.indexOf(selectedStartTime) + 1;
      if (nextIdx < TIME_OPTIONS.length) setSelectedStartTime(TIME_OPTIONS[nextIdx]);
    }
  };

  return (
    <div className={s.panelContainer}>
      <header>
        <h1 className={s.mainTitle}>構成設定</h1>
        <p className={s.description}>面談の基本時間と、テーブルの軸（日付・時刻）を管理します。</p>
      </header>

      {/* 面談時間 */}
      <section className={s.section}>
        <h2 className={s.sectionTitle}>面談時間</h2>
        <div className={s.controlRow}>
          <select 
            className={s.select}
            value={interviewDuration}
            onChange={(e) => setInterviewDuration(Number(e.target.value))}
          >
            {DURATION_OPTIONS.map(d => <option key={d} value={d}>{d} 分</option>)}
          </select>
          <span style={{color: '#718096', fontSize: '0.9rem'}}>※変更すると時間帯の選択肢が更新されます</span>
        </div>
      </section>

      {/* 日付設定 */}
      <section className={s.section}>
        <h2 className={s.sectionTitle}>日付の管理 (横軸)</h2>
        <div className={s.controlRow}>
          <input type="date" className={s.input} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <button className={s.addButton} onClick={onAddDate} disabled={!selectedDate}>追加</button>
        </div>
        <div className={s.listContainer}>
          {sortedCols.map((col, idx) => (
            <div key={col} className={s.listItem}>
              <span className={s.listText}>{idx + 1}. {col}</span>
              <button className={s.deleteButton} onClick={() => confirmDeleteCol(idx)}>削除</button>
            </div>
          ))}
        </div>
      </section>

      {/* 時間設定 */}
      <section className={s.section}>
        <h2 className={s.sectionTitle}>時間帯の管理 (縦軸)</h2>
        <div className={s.controlRow}>
          <select className={s.select} value={selectedStartTime} onChange={(e) => setSelectedStartTime(e.target.value)}>
            {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button className={s.addButton} onClick={onAddRowClick}>＋ {interviewDuration}分枠を追加</button>
        </div>
        <div className={s.listContainer}>
          {sortedRows.map((row, idx) => (
            <div key={row + idx} className={s.listItem}>
              <span className={s.listText}>{idx + 1}. {row}</span>
              <button className={s.deleteButton} onClick={() => confirmDeleteRow(idx)}>削除</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ScheduleSettingPanel;