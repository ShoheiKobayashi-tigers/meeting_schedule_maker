// src/features/Students/components/parts/ApplicantForm.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppStore } from '../../../../store/useAppStore';
import { type Applicant, applicantInputSchema } from '../../../../types/Students';
import { Button } from '../../../../components/ui/Button/Button';
import { FamilySettingsArea } from './FamilySettingsArea';
import { UpsertStudentAssignmentModal } from '../modals/UpsertStudentAssignmentModal';
import * as s from './ApplicantForm.css';

interface Props {
  initialData?: Applicant | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ApplicantForm: React.FC<Props> = ({ initialData, onSuccess, onCancel }) => {
  const saveApplicant = useAppStore((state) => state.saveApplicant);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getSafeDefaultValues = (data?: Applicant | null): Applicant => ({
    id: data?.id,
    family_name: data?.family_name ?? '',
    first_name: data?.first_name ?? '',
    student_id: data?.student_id ?? '',
    preferred_dates: data?.preferred_dates ?? [],
    family_id: data?.family_id,
    is_fixed: false,
    is_last_slot: false,
    needs_gap_after: false,
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
  const currentFamilyId = watch('family_id');


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
          <input {...register('family_name')} className={s.input} placeholder="例: 佐藤" />
          {errors.family_name && <span className={s.error}>{errors.family_name.message}</span>}
        </div>
        <div className={s.field}>
          <label className={s.label}>名</label>
          <input {...register('first_name')} className={s.input} placeholder="例: 太郎" />
          {errors.first_name && <span className={s.error}>{errors.first_name.message}</span>}          
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
      <FamilySettingsArea 
        currentFamilyId={currentFamilyId}
        currentStudentId={initialData?.id}
        onLinkChange={(newId) => setValue('family_id', newId, { shouldDirty: true })}
      />        
      
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