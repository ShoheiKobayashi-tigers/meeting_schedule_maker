import React from 'react';
import * as s from './ApplicantItem.css';
import { type Applicant } from '../../../../types/Students';

interface ApplicantItemProps {
  applicant: Applicant; // any を Applicant に変更
  isActive: boolean;
  isAvailable: boolean;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent, applicantId: string) => void;
  onClick: () => void;
}

export const ApplicantItem: React.FC<ApplicantItemProps> = React.memo(({
  applicant, isActive, isAvailable, isDragging, onDragStart, onDragEnd, onDrop, onClick
}) => {
  // 状態の判定
  let status: 'normal' | 'active' | 'notAllowed' | 'isDragging' = 'normal';
  if (isDragging) status = 'isDragging';
  else if (isActive) status = 'active';
  else if (!isAvailable) status = 'notAllowed';

  // 名前を連結（データ構造に合わせる）
  const fullName = `${applicant.family_name} ${applicant.first_name}`.trim();

  // ドラッグ開始のハンドラー（IDの存在を保証する）
  const handleDragStart = (e: React.DragEvent) => {
    if (applicant.id) {
      // applicant.id が string であることが確定した状態で呼び出す
      onDragStart(e, applicant.id);
    }
  };
  const handleDropLocal = (e: React.DragEvent) => {
    e.stopPropagation();
    // もし配置不可(isAvailable: false)の児童の上にドロップされたら何もしない
    if (!isAvailable) return;

    // ドロップ先の児童IDをセットして親の onDrop を呼ぶ
    if (applicant.id) {
      onDrop(e, applicant.id);
    }
  };

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart} // 直接渡さず、ラップした関数を使う
      onDragEnd={onDragEnd}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onDrop={handleDropLocal}
      onClick={onClick}
      className={s.item({ status })}
    >
      {fullName}
    </div>
  );
});