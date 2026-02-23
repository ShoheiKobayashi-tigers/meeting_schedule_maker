// src/features/Students/components/parts/SiblingForm.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form'; // Controllerを追加
import { zodResolver } from '@hookform/resolvers/zod';
import { type Sibling, siblingInputSchema } from '../../../../types/Students';
import { Button } from '../../../../components/ui/Button/Button';
import * as s from './SiblingForm.css';
import { SelectField } from '../../../../components/ui/SelectField/SelectField';
import { UpsertStudentAssignmentModal } from '../modals/UpsertStudentAssignmentModal';
import { useAppStore } from '../../../../store/useAppStore';

interface Props {
  initialData?: Sibling | null;
  onSubmit: (data: Sibling) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export const SiblingForm: React.FC<Props> = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = '保存する'
}) => {
  const { applicants } = useAppStore((state) => state.db);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue, 
    watch,
    control, // Controller用
    formState: { errors, isSubmitting }
  } = useForm<Sibling>({
    resolver: zodResolver(siblingInputSchema),
    defaultValues: initialData || {
      family_name: '',
      first_name: '',
      grade: '',
      class: '',
      family_id: '',
    }
  });

  const assignedSlot = watch('assigned_slot');

  // initialDataが変わった時にフォームをリセット（編集モード対応）
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // SelectField用のオプション作成
  // UI上は「生徒名」を表示し、valueにはその生徒の「family_id」を入れる
  const familyOptions = useMemo(() => {
    return applicants
      .filter(app => app.family_id) // family_idを持つ生徒のみ
      .map(app => ({
        value: app.family_id!,
        label: `${app.family_name} ${app.first_name}`
      }));
  }, [applicants]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
      <div className={s.fieldGroup}>
        <div className={s.field}>
          <label className={s.label}>姓</label>
          <input {...register('family_name')} className={s.input} /> {/* CSSクラスは適宜 */}
          {errors.family_name && <span className={s.error}>{errors.family_name.message}</span>}
        </div>
        <div className={s.field}>
          <label className={s.label}>名</label>
          <input {...register('first_name')} className={s.input} />
          {errors.first_name && <span className={s.error}>{errors.first_name.message}</span>}
        </div>
      </div>

      <div className={s.fieldGroup}> {/* 2列グリッドを有効活用 */}
        <div className={s.field}>
          <label className={s.label}>学年</label>
          <input {...register('grade')} placeholder="例: 1" className={s.input} />
          {errors.grade && <span className={s.error}>{errors.grade.message}</span>}
        </div>
        <div className={s.field}>
          <label className={s.label}>組</label>
          <input {...register('class')} placeholder="例: 2" className={s.input} />
          {errors.class && <span className={s.error}>{errors.class.message}</span>}
        </div>
      </div>

      <div className={s.field}>
        <label className={s.label}>紐付けする児童・生徒</label>
        <Controller
          name="family_id"
          control={control}
          render={({ field }) => (
            <SelectField
              options={familyOptions}
              value={field.value!}
              onChange={field.onChange}
              placeholder="選択してください"
            />
          )}
        />
        {errors.family_id && <span className={s.error}>{errors.family_id.message}</span>}
      </div>
      <div className={s.field}>
        <label className={s.label}>割当枠 (単一選択)</label>
        <div style={{ marginBottom: '8px' }}>
          {assignedSlot ? (
            <span style={{ fontWeight: 'bold', color: '#a0aec0' }}>{assignedSlot}</span>
          ) : (
            <span style={{ fontSize: '0.85rem', color: '#a0aec0' }}>未選択</span>
          )}
        </div>
        <Button type="button" variant="edit" onClick={() => setIsModalOpen(true)}>
          割当枠を選択する
        </Button>
      </div>

      <UpsertStudentAssignmentModal
        isOpen={isModalOpen}
        title="割当枠の選択"
        isMultiple={false}
        initialSelected={assignedSlot ? [assignedSlot] : []}
        onClose={() => setIsModalOpen(false)}
        onConfirm={(slots) => setValue('assigned_slot', slots[0])}
      />

      <div className={s.buttonGroup}>
        <Button variant="cancel" onClick={onCancel} type="button">キャンセル</Button>
        <Button variant="confirm" type="submit" disabled={isSubmitting}>{submitLabel}</Button>
      </div>
    </form>
  );
};