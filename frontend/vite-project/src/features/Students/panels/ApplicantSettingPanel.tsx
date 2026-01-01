import React from 'react';
import { useAppStore } from '../../../store/useAppStore';
import * as s from '../StudentSetting.css';

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const ApplicantSettingPanel: React.FC<Props> = ({ selectedId, onSelect }) => {
  const { applicants, scheduleData } = useAppStore((state) => state.db);

  return (
    <>
      <div className={s.listHeader}>
        <h2 style={{ fontSize: '1.2rem' }}>生徒一覧</h2>
        <button style={{ padding: '4px 8px' }}>+ 新規</button>
      </div>
      <div style={{ overflowY: 'auto' }}>
        {applicants.map((student) => (
          <div
            key={student.id}
            className={`${s.studentRow} ${selectedId === student.id ? s.selectedRow : ''}`}
            onClick={() => onSelect(student.id!)}
          >
            <div style={{ fontWeight: 'bold' }}>{student.first_name} {student.last_name}</div>
            <div style={{ fontSize: '0.85rem', color: '#718096' }}>
              学籍番号: {student.student_id}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ApplicantSettingPanel;