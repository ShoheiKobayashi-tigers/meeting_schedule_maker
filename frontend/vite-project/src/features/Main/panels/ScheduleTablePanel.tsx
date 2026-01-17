import React, { useMemo } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { type Sibling } from '../../../types/Students';
import { useDnD } from '../hooks/useDnD';
import { useClickAssignment } from '../hooks/useClickAssignment';
import { ScheduleSlot } from '../parts/ScheduleSlot/ScheduleSlot';
import { getApplicantById } from '../../../utils/applicantUtils';
import * as s from './ScheduleTablePanel.css';

const ScheduleTablePanel: React.FC = () => {
  // === Storeからデータ(db)と状態(ui)を取得 ===
  const db = useAppStore((state) => state.db);
  const ui = useAppStore((state) => state.ui);
  
  const { scheduleData, applicants, siblings } = db;
  const { draggingApplicantId } = ui;

  // === カスタムフックの呼び出し ===
  const { 
    handleDragStart, 
    handleDragEnd, 
    handleDragEnter, 
    handleDrop 
  } = useDnD();
  
  const { handleSlotClick } = useClickAssignment();

  // === ヘルパー関数 ===
  // 児童名を取得するロジック
  const getApplicantName = (id: string) => {
    const applicant = getApplicantById(id, applicants);
    return applicant ? `${applicant.first_name} ${applicant.last_name}` : '';
  };

  if (scheduleData.rows.length === 0 || scheduleData.cols.length === 0) {
    return <div className={s.container}>枠が設定されていません。</div>;
  }

  const siblingMap = useMemo(() => {
  const map: Record<string, Sibling[]> = {};
  siblings.forEach(s => {
    if (s.assigned_slot) {
      if (!map[s.assigned_slot]) map[s.assigned_slot] = [];
      map[s.assigned_slot].push(s);
    }
  });
  return map;
}, [siblings]);

  return (
    <div className={s.container}>
      <h1 className={s.title}>スケジュールボード</h1>
      
      <div className={s.tableWrapper}>
        <table className={s.table}>
          <thead>
            <tr>
              <th className={s.timeCell}>時間帯</th>
              {scheduleData.cols.map((col, i) => (
                <th key={i} className={s.headerCell}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scheduleData.rows.map((rowHeader, rowIndex) => (
              <tr key={rowIndex}>
                <td className={s.timeCell}>{rowHeader}</td>
                {scheduleData.cols.map((colHeader, colIndex) => {
                  const cellId = `slot-${rowIndex}-${colIndex}`;
                  const applicantId = scheduleData.assignments[rowIndex][colIndex];
                  const status = scheduleData.availability[rowIndex][colIndex];
                                    
                  // スロット情報の取得
                  const assignedSiblings = siblingMap[`${colHeader} ${rowHeader}`] || [];

                  return (
                    <ScheduleSlot
                      key={colIndex}
                      applicantId={applicantId}
                      applicantName={applicantId ? getApplicantName(applicantId) : ''}
                      isDragging={draggingApplicantId === applicantId && !!applicantId}
                      assignedSiblings={assignedSiblings}
                      // 状態に基づいた色分けや表示制御
                      status={status} 
                      hasError={!!(applicantId && status === 'admin_block')}
                      onClick={() => handleSlotClick({ rowIndex, colIndex })}
                      onDragStart={(e) => {
                        if (applicantId) handleDragStart(e, applicantId, cellId);
                      }}
                      onDragEnd={handleDragEnd}
                      onDragEnter={(e) => handleDragEnter(e, cellId)}
                      onDrop={(e) => handleDrop(e, cellId, null)}
                    />
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

export default ScheduleTablePanel;