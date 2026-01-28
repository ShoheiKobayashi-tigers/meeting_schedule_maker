// src/features/Students/components/parts/ApplicantForm.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppStore } from '../../../../store/useAppStore';
import { type Applicant, applicantInputSchema } from '../../../../types/Students';
import Button from '../../../../components/ui/Button/Button';
import UpsertStudentAssignmentModal from '../modals/UpsertStudentAssignmentModal';
import * as s from './ApplicantForm.css';

interface Props {
  initialData?: Applicant | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ApplicantForm: React.FC<Props> = ({ initialData, onSuccess, onCancel }) => {
  const saveApplicant = useAppStore((state) => state.saveApplicant);
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const getSafeDefaultValues = (data?: Applicant | null): Applicant => ({
    id: data?.id,
    first_name: data?.first_name ?? '',
    last_name: data?.last_name ?? '',
    student_id: data?.student_id ?? '',
    preferred_dates: data?.preferred_dates ?? [],
    family_id: data?.family_id,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<Applicant>({ // ここを変更
    resolver: zodResolver(applicantInputSchema),
    defaultValues: getSafeDefaultValues(initialData)
  });

  const preferredDates = watch('preferred_dates') || [];

  // 初期データがある場合（編集モード）にフォームをリセット
  useEffect(() => {
    if (initialData) {
      reset(getSafeDefaultValues(initialData));
    }
  }, [initialData, reset]);  
  
  const onSubmit = (data: Applicant) => {
    // Point 3: Storeのアクションへ渡す際はApplicant型として渡す
    saveApplicant(data);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
      <div className={s.fieldGroup}>
        <div className={s.field}>
          <label className={s.label}>姓</label>
          <input {...register('first_name')} className={s.input} placeholder="例: 佐藤" />
          {errors.first_name && <span className={s.error}>{errors.first_name.message}</span>}
        </div>
        <div className={s.field}>
          <label className={s.label}>名</label>
          <input {...register('last_name')} className={s.input} placeholder="例: 太郎" />
          {errors.last_name && <span className={s.error}>{errors.last_name.message}</span>}          
        </div>
      </div>

      <div className={s.field}>
        <label className={s.label}>学籍番号</label>
        <input {...register('student_id')} className={s.input} placeholder="例: 1001" />
        {errors.student_id && <span className={s.error}>{errors.student_id.message}</span>}
      </div>
      <div className={s.field}>
        <label className={s.label}>希望日程 ({preferredDates.length}件選択中)</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
          {preferredDates.length > 0 ? (
            preferredDates.map(d => (
              <span key={d} style={{ fontSize: '0.75rem', background: '#edf2f7', padding: '2px 8px', borderRadius: '4px' }}>
                {d}
              </span>
            ))
          ) : (
            <span style={{ fontSize: '0.85rem', color: '#a0aec0' }}>日程が選択されていません</span>
          )}
        </div>
        <Button type="button" variant="edit" onClick={() => setIsModalOpen(true)}>
          希望日程を選択する
        </Button>
      </div>

      {/* モーダル */}
      <UpsertStudentAssignmentModal
        isOpen={isModalOpen}
        title="希望日程の選択"
        isMultiple={true}
        initialSelected={preferredDates}
        onClose={() => setIsModalOpen(false)}
        onConfirm={(dates) => setValue('preferred_dates', dates)}
      />
      <div className={s.buttonGroup}>
        <Button variant="cancel" onClick={onCancel} type="button">キャンセル</Button>
        <Button variant="confirm" type="submit" disabled={isSubmitting}>
          {initialData ? '更新する' : '登録する'}
        </Button>
      </div>
    </form>
  );
};

export default ApplicantForm;