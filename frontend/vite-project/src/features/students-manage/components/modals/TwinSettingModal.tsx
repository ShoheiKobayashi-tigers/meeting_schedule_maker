// features/Students/components/modals/TwinSettingModal.tsx
import React, { useMemo, useState } from 'react';
import { useAppStore } from '../../../../store/useAppStore';
import { Button } from '../../../../components/ui/Button/Button';
import { nanoid } from 'nanoid';
import * as s from './TwinSettingModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentStudentId?: string; // 自分自身を除外するために必要
  onLink: (familyId: string) => void; // フォームにIDを返すコールバック
}

export const TwinSettingModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  currentStudentId, 
  onLink 
}) => {
  const applicants = useAppStore((state) => state.db.applicants);
  const saveApplicant = useAppStore((state) => state.saveApplicant);
  const [selectedTargetId, setSelectedTargetId] = useState<string | undefined>(undefined);

  // 自分以外の生徒リストを作成（検索機能を追加する場合はここでフィルタリング）
  const candidates = useMemo(() => {
    return applicants.filter(a => a.id !== currentStudentId);
  }, [applicants, currentStudentId]);

  const handleConfirm = () => {
    if (!selectedTargetId) return;
    
    const targetStudent = applicants.find(a => a.id === selectedTargetId);
    if (!targetStudent) return;

    // 1. 相手が既に family_id を持っているか確認
    let familyIdToUse = targetStudent.family_id;

    // 2. 持っていなければ新規生成して、相手側に保存する
    if (!familyIdToUse) {
      familyIdToUse = `fam-${nanoid(8)}`;
      // 相手の情報を更新 (family_id を付与)
      saveApplicant({ 
        ...targetStudent, 
        family_id: familyIdToUse 
      });
    }

    // 3. 親フォームへ family_id を返して閉じる
    // (自分自身の更新は親フォームの onSubmit で行われるため、ここではIDを返すだけ)
    onLink(familyIdToUse);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={s.overlay}>
      <div className={s.container}>
        <div className={s.header}>
          <h3 className={s.title}>双子・きょうだい設定</h3>
          <p className={s.description}>
            同じクラスに在籍する双子・きょうだいを選択してください。<br/>
            設定すると同じ「家族ID」が割り当てられ、クラス分けで考慮されます。
          </p>
        </div>

        <div className={s.listContainer}>
          {candidates.length > 0 ? (
            candidates.map(student => (
              <label 
                key={student.id} 
                className={`${s.listItem} ${selectedTargetId === student.id ? s.selectedItem : ''}`}
              >
                <input 
                  type="radio" 
                  name="twin_target" 
                  value={student.id} 
                  checked={selectedTargetId === student.id}
                  onChange={() => setSelectedTargetId(student.id)}
                  className={s.radioInput}
                />
                <div className={s.studentInfo}>
                  <span className={s.studentName}>
                    {student.family_name} {student.first_name}
                  </span>
                  <span className={s.studentId}>
                    学籍番号: {student.student_id}
                  </span>
                </div>
              </label>
            ))
          ) : (
            <div className={s.emptyMessage}>
              他の生徒が登録されていません。
            </div>
          )}
        </div>

        <div className={s.footer}>
          <Button variant="outline" onClick={onClose}>キャンセル</Button>
          <Button 
            variant="primary" 
            onClick={handleConfirm} 
            disabled={!selectedTargetId}
          >
            紐付ける
          </Button>
        </div>
      </div>
    </div>
  );
};