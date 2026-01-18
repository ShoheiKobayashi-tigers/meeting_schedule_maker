import React from 'react';
import { type Applicant } from '../../../../types/Students';
import Button from '../../../../components/ui/Button/Button';
import * as s from './ApplicantDetail.css';

interface Props {
  applicant: Applicant;
  assignmentText: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ApplicantDetail: React.FC<Props> = ({ applicant, assignmentText, onEdit, onDelete }) => {
  return (
    <div className={s.container}>
      <section className={s.infoSection}>
        <label className={s.label}>氏名</label>
        <div className={s.nameValue}>
          {applicant.first_name} {applicant.last_name}
        </div>
      </section>

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