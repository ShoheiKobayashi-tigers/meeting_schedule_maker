import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppStore } from '../../../../store/useAppStore';
import {  
    studentFormSchema, 
    type StudentFormValues, 
    type Applicant 
} from '../../../../types/Students';

import * as s from './UpsertStudentModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  applicantId: string | null; // nullなら新規、IDがあれば編集
  allScheduleSlots: string[]; // 希望日程の選択肢用
}

const UpsertStudentModal: React.FC<Props> = ({ 
    isOpen, 
    onClose, 
    applicantId, 
    allScheduleSlots 
}) => {
    const { applicants, saveApplicant, saveStudentWithSibling } = useAppStore();
    
    const isEditMode = !!applicantId;

  // React Hook Form の初期化
const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
} = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema) as any,
    defaultValues: {
        has_sibling: false,
        preferred_dates: [],
        first_name: '',
        last_name: '',
        student_id: '',
        sibling_data: undefined,
    } as StudentFormValues, // 型の不整合を解消
});

  // 編集モード時の初期値セット
  useEffect(() => {
    if (isOpen) {
      if (applicantId) {
        const target = applicants.find((a) => a.id === applicantId);
        if (target) {
          reset({
            id: target.id,
            first_name: target.first_name,
            last_name: target.last_name,
            student_id: target.student_id,
            preferred_dates: target.preferred_dates || [],
            family_id: target.family_id,
            has_sibling: false, // 編集時は既存兄弟の追加UIは出さない
          });
        }
      } else {
        // 新規時はリセット
        reset({
          first_name: '',
          last_name: '',
          student_id: '',
          preferred_dates: [],
          has_sibling: false,
        });
      }
    }
  }, [isOpen, applicantId, applicants, reset]);

  const hasSibling = watch('has_sibling');

  const onSubmit = async (values: StudentFormValues) => {
    try {
      if (values.id) {
        // 編集保存
        await saveApplicant({
            id: values.id,
            first_name: values.first_name,
            last_name: values.last_name,
            student_id: values.student_id,
            preferred_dates: values.preferred_dates,
            family_id: values.family_id,
        } as Applicant);
      } else {
            // 新規保存（兄弟情報を含む）
            await saveStudentWithSibling(values);
        }
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
      alert('保存に失敗しました。');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.content} onClick={(e) => e.stopPropagation()}>
        {/* ヘッダー */}
        <div className={s.header}>
          <h2 className={s.title}>
            {isEditMode ? '生徒情報の編集' : '新規生徒の追加'}
          </h2>
          <button className={s.closeButton} onClick={onClose}>&times;</button>
        </div>

        <div className={s.scrollArea}>
          <form id="student-form" onSubmit={handleSubmit(onSubmit)}>
            
            {/* 基本情報セクション */}
            <h3 className={s.sectionTitle}>基本情報</h3>
            
            <div className={s.field}>
              <label className={s.label}>氏名 <span className={s.required}>*</span></label>
              <input 
                {...register('first_name')} 
                className={s.input} 
                placeholder="例：佐藤 太郎"
              />
              {errors.first_name && <p className={s.errorText}>{errors.first_name.message}</p>}
              <label className={s.label}>氏名 <span className={s.required}>*</span></label>
              <input 
                {...register('last_name')} 
                className={s.input} 
                placeholder="例：佐藤 太郎"
              />
              {errors.last_name && <p className={s.errorText}>{errors.last_name.message}</p>}
            </div>

            <div className={s.field}>
              <label className={s.label}>学籍番号 / 出席番号 <span className={s.required}>*</span></label>
              <input 
                {...register('student_id')} 
                className={s.input} 
                placeholder="半角数字"
              />
              {errors.student_id && <p className={s.errorText}>{errors.student_id.message}</p>}
            </div>

            {/* 希望日程セクション */}
            <h3 className={s.sectionTitle}>希望日程（複数選択可）</h3>
            <div className={s.dateGrid}>
              {allScheduleSlots.map((slot) => (
                <label key={slot} className={s.checkboxLabel}>
                  <input
                    type="checkbox"
                    value={slot}
                    {...register('preferred_dates')}
                    className={s.checkbox}
                  />
                  {slot}
                </label>
              ))}
            </div>

            {/* 兄弟情報セクション（新規時のみ） */}
            {!isEditMode && (
              <>
                <h3 className={s.sectionTitle}>兄弟の情報</h3>
                <div className={s.radioGroup}>
                  <label className={s.radioLabel}>
                    <input type="radio" {...register('has_sibling')} value="true" onChange={() => reset({ ...watch(), has_sibling: true })} checked={hasSibling === true} />
                    いる
                  </label>
                  <label className={s.radioLabel}>
                    <input type="radio" {...register('has_sibling')} value="false" onChange={() => reset({ ...watch(), has_sibling: false })} checked={hasSibling === false} />
                    いない
                  </label>
                </div>

                {hasSibling && (
                  <div className={s.siblingBox}>
                    <div className={s.field}>
                      <label className={s.label}>兄弟の氏名 <span className={s.required}>*</span></label>
                      <input 
                        {...register('sibling_data.first_name')} 
                        className={s.input} 
                      />
                      {errors.sibling_data?.first_name && <p className={s.errorText}>{errors.sibling_data.first_name.message}</p>}
                      <label className={s.label}>兄弟の氏名 <span className={s.required}>*</span></label>
                      <input 
                        {...register('sibling_data.last_name')} 
                        className={s.input} 
                      />
                      {errors.sibling_data?.last_name && <p className={s.errorText}>{errors.sibling_data.last_name.message}</p>}
                      
                    </div>
                    <div className={s.row}>
                      <div className={s.field}>
                        <label className={s.label}>学年</label>
                        <input type="number" {...register('sibling_data.grade')} className={s.input} />
                        {errors.sibling_data?.grade && <p className={s.errorText}>{errors.sibling_data.grade.message}</p>}
                      </div>
                      <div className={s.field}>
                        <label className={s.label}>組</label>
                        <input {...register('sibling_data.class')} className={s.input} />
                        {errors.sibling_data?.class && <p className={s.errorText}>{errors.sibling_data.class.message}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </form>
        </div>

        {/* フッターアクション */}
        <div className={s.footer}>
          <button type="button" className={s.cancelButton} onClick={onClose}>
            キャンセル
          </button>
          <button 
            type="submit" 
            form="student-form" 
            className={isEditMode ? s.updateButton : s.saveButton}
          >
            {isEditMode ? '更新する' : '登録する'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpsertStudentModal;