import React, { useMemo } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { useProcessedSchedule } from '../../../hooks/useProcessedSchedule';
import { type Sibling } from '../../../types/Students';
import { useDnD } from '../hooks/useDnD';
import { useClickAssignment } from '../hooks/useClickAssignment';
import { ScheduleSlot } from '../parts/ScheduleSlot/ScheduleSlot';
import { getApplicantById } from '../../../utils/applicantUtils';
import ScheduleBaseTable from '../../../components/ui/ScheduleBaseTable/ScheduleBaseTable';
import * as s from './ScheduleTablePanel.css';

const ScheduleTablePanel: React.FC = () => {
  // === Storeからデータ(db)と状態(ui)を取得 ===
  const { db, ui } = useAppStore();
  
  const { grid } = useProcessedSchedule();

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
  if (db.scheduleData.rows.length === 0 || db.scheduleData.cols.length === 0) {
    return <div className={s.container}>枠が設定されていません。</div>;
  }

  // 兄弟情報をマップ化（表示用のラベルをキーにする）
  const siblingMap = useMemo(() => {
  const map: Record<string, Sibling[]> = {};
    db.siblings.forEach(s => {
    if (s.assigned_slot) {
      if (!map[s.assigned_slot]) map[s.assigned_slot] = [];
      map[s.assigned_slot].push(s);
    }
  });
  return map;
  }, [db.siblings]);

  return (
    <div className={s.container}>
      <h1 className={s.title}>スケジュールボード</h1>      
      <ScheduleBaseTable 
        grid={grid}
        renderCell={(cell, cellId) => {
          const assignedSiblings = siblingMap[`${cell.colLabel} ${cell.rowLabel}`] || [];
          const applicant = cell.assignment ? getApplicantById(cell.assignment, db.applicants) : undefined;

          return (
            <ScheduleSlot
              applicantId={cell.assignment}
              applicantName={applicant ? `${applicant.family_name} ${applicant.first_name}` : ''}
              isDragging={ui.draggingApplicantId === cell.assignment && !!cell.assignment}
              assignedSiblings={assignedSiblings}
              // useProcessedSchedule の string 型を ScheduleSlot の期待する型へ安全にキャスト
              status={cell.status as any} 
              hasError={!!(cell.assignment && cell.status === 'admin_block')}
              onClick={() => handleSlotClick({ rowIndex: cell.rowIndex, colIndex: cell.colIndex })}
              onDragStart={(e) => cell.assignment && handleDragStart(e, cell.assignment, cellId)}
              onDragEnd={handleDragEnd}
              onDragEnter={(e) => handleDragEnter(e, cellId)}
              // useDnD.ts の定義に合わせて 3引数 (e, targetId, droppedOnId) で渡す
              onDrop={(e) => handleDrop(e, cellId, null)}
            />
          );
        }}
      />
    </div>
  );
};

export default ScheduleTablePanel;