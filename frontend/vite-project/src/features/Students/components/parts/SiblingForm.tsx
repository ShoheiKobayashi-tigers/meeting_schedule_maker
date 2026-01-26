// src/features/Students/components/parts/SiblingForm.tsx
import React, { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form'; // Controllerを追加
import { zodResolver } from '@hookform/resolvers/zod';
import { type Sibling, siblingInputSchema } from '../../../../types/Students';
import Button from '../../../../components/ui/Button/Button';
import * as s from './SiblingForm.css';
import { SelectField } from '../../../../components/ui/SelectField/SelectField';
import { useAppStore } from '../../../../store/useAppStore';

interface Props {
  initialData?: Sibling | null;
  onSubmit: (data: Sibling) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const SiblingForm: React.FC<Props> = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = '保存する'
}) => {
  const { applicants } = useAppStore((state) => state.db);

  const {
    register,
    handleSubmit,
    reset,
    control, // Controller用
    formState: { errors, isSubmitting }
  } = useForm<Sibling>({
    resolver: zodResolver(siblingInputSchema),
    defaultValues: initialData || {
      first_name: '',
      last_name: '',
      grade: '',
      class: '',
      family_id: '',
    }
  });

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
        label: `${app.first_name} ${app.last_name}`
      }));
  }, [applicants]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
      <div className={s.fieldGroup}>
        <div className={s.field}>
          <label className={s.label}>姓</label>
          <input {...register('first_name')} className={s.input} /> {/* CSSクラスは適宜 */}
          {errors.first_name && <span className={s.error}>{errors.first_name.message}</span>}
        </div>
        <div className={s.field}>
          <label className={s.label}>名</label>
          <input {...register('last_name')} className={s.input} />
          {errors.last_name && <span className={s.error}>{errors.last_name.message}</span>}
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

      <div className={s.buttonGroup}>
        <Button variant="cancel" onClick={onCancel} type="button">キャンセル</Button>
        <Button variant="confirm" type="submit" disabled={isSubmitting}>{submitLabel}</Button>
      </div>
    </form>
  );
};

export default SiblingForm;