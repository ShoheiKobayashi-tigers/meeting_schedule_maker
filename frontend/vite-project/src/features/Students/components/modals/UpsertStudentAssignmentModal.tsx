// src/features/Students/components/modals/UpsertStudentAssignmentModal.tsx
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../../../store/useAppStore';
import { useProcessedSchedule } from '../../../../hooks/useProcessedSchedule';
import { ScheduleBaseTable, GridCell } from '../../../../components/ui/ScheduleBaseTable/ScheduleBaseTable';
import { Button } from '../../../../components/ui/Button/Button';
import * as s from './UpsertStudentAssignmentModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialSelected: string[]; // すでに選択されている [日付 時間] の配列
  onConfirm: (selected: string[]) => void;
  isMultiple: boolean; // Applicantはtrue, Siblingはfalse
  title: string;
}

export const UpsertStudentAssignmentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialSelected,
  onConfirm,
  isMultiple,
  title
}) => {
  const { grid } = useProcessedSchedule();
  const [tempSelected, setTempSelected] = useState<string[]>(initialSelected);

  if (!isOpen) return null;

  const handleCellClick = (cell: GridCell) => {
    const value = `${cell.colLabel} ${cell.rowLabel}`;
    
    if (isMultiple) {
      setTempSelected(prev => 
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      );
    } else {
      // 単一選択（Sibling用）
      setTempSelected([value]);
    }
  };

  const handleSaveClick = () => {
    // 1. 直接親の callback を実行（ConfirmationModal は挟まない）
    onConfirm(tempSelected);
    // 2. このモーダルだけを閉じる
    onClose();
  };

  return (
    <div className={s.overlay}>
      <div className={s.container}>
        <div className={s.header}>
          <h2 className={s.title}>{title}</h2>
          <p className={s.subTitle}>{isMultiple ? '複数選択可' : '1つ選択'}</p>
        </div>
        <div className={s.tableContainer}>
          <ScheduleBaseTable
            grid={grid}
            renderCell={(cell) => {
              const value = `${cell.colLabel} ${cell.rowLabel}`;
              const isSelected = tempSelected.includes(value);
              return (
                <div 
                  className={`${s.cell} ${isSelected ? s.selectedCell : ''}`}
                  onClick={() => handleCellClick(cell)}
                >
                  {isSelected && <span className={s.checkIcon}>✓</span>}
                </div>
              );
            }}
          />
        </div>
        <div className={s.footer}>
          <Button variant="cancel" onClick={onClose}>戻る</Button>
          <Button variant="confirm" onClick={handleSaveClick}>設定する</Button>
        </div>
      </div>
    </div>
  );
};