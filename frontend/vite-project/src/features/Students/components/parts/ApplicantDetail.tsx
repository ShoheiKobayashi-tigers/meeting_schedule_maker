import React from 'react';
import { type Applicant } from '../../../../types/Students';
import { useProcessedSchedule } from '../../../../hooks/useProcessedSchedule';
import ScheduleBaseTable from '../../../../components/ui/ScheduleBaseTable/ScheduleBaseTable';
import Button from '../../../../components/ui/Button/Button';
import * as s from './ApplicantDetail.css';

interface Props {
  applicant: Applicant;
  assignmentText: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ApplicantDetail: React.FC<Props> = ({ applicant, assignmentText, onEdit, onDelete }) => {
  const { grid } = useProcessedSchedule();
  const preferredDates = applicant.preferred_dates || [];

  return (
    <div className={s.container}>
      <section className={s.infoSection}>
        <label className={s.label}>氏名</label>
        <div className={s.nameValue}>
          {applicant.first_name} {applicant.last_name}
        </div>
      </section>

      {/* 希望日程をテーブルで表示 */}
      <section className={s.infoSection}>
        <label className={s.label}>出席番号</label>
        <div className={s.value}>{applicant.student_id}</div>
      </section>

      <section className={s.assignmentBox}>
        <label className={s.label}>現在の面談予約</label>
        <div className={s.assignmentValue}>
          {assignmentText}
        </div>
      </section>
      <section className={s.infoSection}>
        <label className={s.label}>希望日程</label>
        <ScheduleBaseTable
          grid={grid}
          renderCell={(cell) => {
            const value = `${cell.colLabel} ${cell.rowLabel}`;
            const isSelected = preferredDates.includes(value);
            return (
              <div className={`${s.miniCell} ${isSelected ? s.selectedMiniCell : ''}`}>
                {isSelected && '✓'}
              </div>
            );
          }}
        />
      </section>

      <div className={s.buttonGroup}>
        <Button variant="edit" onClick={onEdit} style={{ flex: 1 }}>
          編集する
        </Button>
      </div>

      <div className={s.deleteSection}>
        <Button variant="delete" onClick={onDelete}>
          生徒情報を削除
        </Button>
      </div>
    </div>
  );
};

export default ApplicantDetail;