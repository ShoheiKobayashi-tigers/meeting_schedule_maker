import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../../../store/useAppStore';
import { type Applicant } from '../../../../types/Students';
import Button from '../../../../components/ui/Button/Button';
import * as s from './ApplicantForm.css';

interface Props {
  initialData?: Applicant;
  onSuccess: () => void;
  onCancel: () => void;
}

const ApplicantForm: React.FC<Props> = ({ initialData, onSuccess, onCancel }) => {
  const saveApplicant = useAppStore((state) => state.saveApplicant);
  
  const [formData, setFormData] = useState<Partial<Applicant>>({
    first_name: '',
    last_name: '',
    student_id: '',
    preferred_dates: [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // バリデーション済みのActionを呼び出し
    saveApplicant(formData as Applicant);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className={s.form}>
      <div className={s.fieldGroup}>
        <div className={s.field}>
          <label className={s.label}>姓</label>
          <input 
            type="text" 
            className={s.input}
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            required
          />
        </div>
        <div className={s.field}>
          <label className={s.label}>名</label>
          <input 
            type="text" 
            className={s.input}
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            required
          />
        </div>
      </div>

      <div className={s.field}>
        <label className={s.label}>学籍番号</label>
        <input 
          type="text" 
          className={s.input}
          value={formData.student_id}
          onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
          required
        />
      </div>

      <div className={s.buttonGroup}>
        <Button variant="cancel" onClick={onCancel} type="button">
          キャンセル
        </Button>
        <Button variant="confirm" type="submit">
          {initialData ? '更新する' : '登録する'}
        </Button>
      </div>
    </form>
  );
};

export default ApplicantForm;