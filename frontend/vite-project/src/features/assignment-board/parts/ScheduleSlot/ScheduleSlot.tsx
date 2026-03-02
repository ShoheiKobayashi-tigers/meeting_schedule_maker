import React from 'react';
import * as s from './ScheduleSlot.css';
import { Sibling } from '../../../../types/Students';

interface ScheduleSlotProps {
  applicantId: string | null | undefined;
  applicantName: string;
  isDragging: boolean;
  assignedSiblings: Sibling[];
  hasError: boolean;
  status: string;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
  onDragEnter: (e: React.DragEvent) => void;
}

export const ScheduleSlot: React.FC<ScheduleSlotProps> = React.memo(({
  applicantId, applicantName, isDragging, assignedSiblings, hasError, status, 
  onDragStart, onDragEnd, onDrop, onClick, onDragEnter
}) => {

  return (
    <div
      className={s.slotCell({ status: status as any })}
      onClick={onClick}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={onDragEnter}
      onDrop={(status !== 'admin_block' && status !== 'unAvailable') ? onDrop : undefined}
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
          {status === 'selected' ? '選択中' : (status === 'admin_block' ? '不可' :'空き')}
        </div>
      )}

      {hasError && <span className={s.errorBadge}>要解除</span>}

      {assignedSiblings.map((sibling, i) => (
        <span key={sibling.id || i} className={s.siblingText}>
          {sibling.family_name} {sibling.first_name}
        </span>
      ))}
    </div>
  );
});