import React, { useMemo } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { useProcessedSchedule } from '../../../hooks/useProcessedSchedule';
import { type Sibling } from '../../../types/Students';
import { useDnD } from '../hooks/useDnD';
import { useClickAssignment } from '../hooks/useClickAssignment';
import { ScheduleSlot } from '../parts/ScheduleSlot/ScheduleSlot';
import { getApplicantById } from '../../../utils/applicantUtils';
import { simulateAutoAssignment } from '../../../utils/autoAssignment';
import ScheduleBaseTable from '../../../components/ui/ScheduleBaseTable/ScheduleBaseTable';
import Button from '../../../components/ui/Button/Button';
import * as s from './ScheduleTablePanel.css';

const ScheduleTablePanel: React.FC = () => {
  // === Storeからデータ(db)と状態(ui)を取得 ===
  const { applicants, scheduleData, siblings } = useAppStore((state) => state.db);
  const { draggingApplicantId } = useAppStore((state) => state.ui);
  const { setAutoAssignConfirmModalOpen } = useAppStore((state) => state);
  
  const { grid } = useProcessedSchedule();

  // === カスタムフックの呼び出し ===
  const { 
    handleDragStart, 
    handleDragEnd, 
    handleDragEnter, 
    handleDrop 
  } = useDnD();
  
  const { handleSlotClick } = useClickAssignment();

  // ★クリックハンドラーを追加
  const handleAutoAssignClick = () => {
    // 兄弟間の許容間隔（とりあえず2で固定。後でStoreのschoolSettingsと繋ぐ予定）
    const siblingGap = 2; 

    // 裏側でシミュレーションを実行！（画面はまだ変わらない）
    const result = simulateAutoAssignment(applicants, siblings, scheduleData, siblingGap);

    // 計算が終わったらモーダルを開いて結果を渡す
    setAutoAssignConfirmModalOpen(true, result);
  };

  // === ヘルパー関数 ===
  // 児童名を取得するロジック
  if (scheduleData.rows.length === 0 || scheduleData.cols.length === 0) {
    return <div className={s.container}>枠が設定されていません。</div>;
  }

  // 兄弟情報をマップ化（表示用のラベルをキーにする）
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        {/* titleクラスのマージンが邪魔をしてズレるのを防ぐため、margin: 0 を上書きしています */}
        <h1 className={s.title} style={{ margin: 0 }}>
          スケジュールボード
        </h1> 
        
        <Button variant="edit" onClick={handleAutoAssignClick}>
          ✨ 自動割り当てを実行
        </Button>

      </div>
      <ScheduleBaseTable 
        grid={grid}
        renderCell={(cell, cellId) => {
          const assignedSiblings = siblingMap[`${cell.colLabel} ${cell.rowLabel}`] || [];
          const applicant = cell.assignment ? getApplicantById(cell.assignment, applicants) : undefined;

          return (
            <ScheduleSlot
              applicantId={cell.assignment}
              applicantName={applicant ? `${applicant.family_name} ${applicant.first_name}` : ''}
              isDragging={draggingApplicantId === cell.assignment && !!cell.assignment}
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