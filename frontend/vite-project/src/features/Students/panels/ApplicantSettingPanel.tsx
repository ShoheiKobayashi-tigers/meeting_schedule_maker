import React, { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { useProcessedApplicants } from '../../../hooks/useProcessedApplicants';
import ApplicantForm from '../components/parts/ApplicantForm';
import ApplicantDetail from '../components/parts/ApplicantDetail';
import { ImportStudentModal } from '../components/modals/ImportStudentModal';
import Button from '../../../components/ui/Button/Button';
import * as s from './ApplicantSettingPanel.css';

interface Props {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

type PanelMode = 'list' | 'add' | 'edit' | 'detail';

const ApplicantSettingPanel: React.FC<Props> = ({ selectedId, onSelect }) => {
  // useProcessedApplicants を使用して加工済みデータを取得
  const processedApplicants = useProcessedApplicants();
  const { setImportStudentModalOpen, openConfirmationModal, deleteApplicant } = useAppStore();

  const [mode, setMode] = useState<PanelMode>('list');

  const selectedApplicant = processedApplicants.find(a => a.id === selectedId) || null;

  const handleBack = () => {
    setMode('list');
    onSelect(null);
  };

  const handleDelete = (id: string, name: string) => {
    openConfirmationModal({
      title: '生徒の削除',
      message: `${name} さんの情報を削除してもよろしいですか？`,
      onConfirm: () => {
        deleteApplicant(id);
        handleBack();
      },
      confirmText: '削除',
      cancelText: 'キャンセル'
    });
  };

  // モードに応じたレンダリング
  if (mode === 'add' || mode === 'edit') {
    return (
      <div className={s.container}>
        <h3 className={s.title}>{mode === 'add' ? '生徒の追加' : '生徒の編集'}</h3>
        <ApplicantForm 
          initialData={mode === 'edit' ? selectedApplicant : null}
          onSuccess={handleBack}
          onCancel={handleBack}
        />
      </div>
    );
  }

  if (mode === 'detail' && selectedApplicant) {

    return (
      <div className={s.container}>
        <div className={s.listHeader}>
          <h3 className={s.title}>生徒詳細</h3>
          <Button variant="cancel" onClick={handleBack}>戻る</Button>
        </div>
        <ApplicantDetail 
          applicant={selectedApplicant}
          assignmentText={selectedApplicant.assignmentText}
          onEdit={() => setMode('edit')}
          onDelete={() => handleDelete(selectedApplicant.id!, `${selectedApplicant.family_name} ${selectedApplicant.first_name}`)}
        />
      </div>
    );
  }

  // 一覧画面
  return (
    <div className={s.container}>
      <div className={s.listHeader}>
        <h3 className={s.title}>生徒一覧</h3>
        <div className={s.actionButtonGroup}>
          <Button variant='edit' onClick={() => { setImportStudentModalOpen(true); }}>児童一括登録</Button>
          <Button variant="add" onClick={() => { onSelect(null); setMode('add'); }}>新規追加</Button>
        </div>
      </div>
      <div className={s.scrollArea}>
        {processedApplicants.map((student) => {
          const isSelected = student.id === selectedId;
          const fullName = `${student.family_name} ${student.first_name}`;
          return (
            <div 
              key={student.id} 
              className={`${s.listRow} ${isSelected ? s.listRow : ''}`} 
              onClick={() => { onSelect(student.id!); setMode('detail'); }}
            >
              <div className={s.studentInfo}>
                <div className={s.studentName}>
                  <span className={s.studentId}>{student.student_id}.</span> {fullName}
                  {student.currentAssignment && <span className={s.assignmentBadge}>割当済み</span>}
                </div>
                <div className={s.assignmentDetail}>{student.assignmentText}</div>
              </div>
              <div className={s.actionButtonGroup} onClick={(e) => e.stopPropagation()}>
                <Button variant="edit" onClick={() => { onSelect(student.id!); setMode('edit'); }}>編集</Button>
                <Button 
                    variant="delete" 
                    onClick={() => { handleDelete(student.id!, `${student.family_name} ${student.first_name}`)}}
                  >
                    削除
                  </Button>
              </div>
            </div>
          );
        })}
      </div>
      <ImportStudentModal />
    </div>
  );
};

export default ApplicantSettingPanel;