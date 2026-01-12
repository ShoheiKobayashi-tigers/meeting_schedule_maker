import React from 'react';
import * as s from './ScheduleSlot.css';
import { Sibling } from '../../../../types/Students';

interface ScheduleSlotProps {
  applicantId: string | null | undefined;
  applicantName: string;
  isBlocked: boolean;
  isSelected: boolean;
  isDragging: boolean;
  assignedSiblings: Sibling[];
  hasError: boolean;
  status?: string;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
  onDragEnter: (e: React.DragEvent) => void;
}

export const ScheduleSlot: React.FC<ScheduleSlotProps> = ({
  applicantId, applicantName, isBlocked, isSelected, isDragging,
  assignedSiblings, hasError, onDragStart, onDragEnd, onDrop, onClick, onDragEnter
}) => {
  const status = isBlocked ? 'blocked' : isSelected ? 'selected' : 'normal';

  return (
    <td
      className={s.slotCell({ status })}
      onClick={onClick}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={onDragEnter}
      onDrop={!isBlocked ? onDrop : undefined}
    >
      {applicantId ? (
        <div
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          className={s.applicantBadge({ 
            type: isDragging ? 'dragging' : (hasError ? 'error' : 'normal') 
          })}
        >
          {applicantName}
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: '#a0aec0', fontSize: '0.75rem', fontWeight: 'bold' }}>
          {isSelected ? '選択中' : (!isBlocked ? '空き' : '不可')}
        </div>
      )}

      {hasError && <span className={s.errorBadge}>要解除</span>}

      {assignedSiblings.map((sibling, i) => (
        <span key={sibling.id || i} className={s.siblingText}>
          {sibling.first_name} {sibling.last_name}
        </span>
      ))}
    </td>
  );
};