import React, { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { useProcessedApplicants } from '../../../hooks/useProcessedApplicants';
import ApplicantForm from '../components/parts/ApplicantForm';
import ApplicantDetail from '../components/parts/ApplicantDetail';
import Button from '../../../components/ui/Button/Button';
import * as s from './ApplicantSettingPanel.css';

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

type PanelMode = 'list' | 'add' | 'edit'| 'detail';

const ApplicantSettingPanel: React.FC<Props> = ({ selectedId, onSelect }) => {
  // useProcessedApplicants を使用して加工済みデータを取得
  const processedApplicants = useProcessedApplicants();
  const { openConfirmationModal, deleteApplicant } = useAppStore();

  const [mode, setMode] = useState<PanelMode>('list');

  // 編集対象のデータ取得
  const selectedApplicant = processedApplicants.find(a => a.id === selectedId);

  const handleEditStart = (id: string) => {
    onSelect(id);
    setMode('edit');
  };

  const handleDetailStart = (id: string) => {
    onSelect(id);
    setMode('detail');
  };

  const handleBack = () => {
    setMode('list');
    onSelect(''); // 編集が終わったら選択を解除
  };

  const handleDelete = (id: string, name: string) => {
    openConfirmationModal({
      title: '生徒の削除',
      message: `${name} さんの情報を削除してもよろしいですか？`,
      onConfirm: () => {
        deleteApplicant(id);
        if (selectedId === id) onSelect('');
      },
      confirmText: '削除',
      cancelText: 'キャンセル'
    });
  };

  // フォーム画面（追加・編集）
  if (mode === 'add' || (mode === 'edit' && selectedApplicant)) {
    return (
      <div className={s.container}>
        <div className={s.listHeader}>
          <h2 className={s.title}>
            {mode === 'add' ? '生徒の新規登録' : '生徒情報の編集'}
          </h2>
        </div>
        <div className={s.scrollArea}>
          <ApplicantForm 
            initialData={mode === 'edit' ? selectedApplicant : undefined} 
            onSuccess={handleBack}
            onCancel={handleBack}
          />
        </div>
      </div>
    );
  }

  if (mode === 'detail' && selectedApplicant) {

    return (
      <div className={s.container}>
        <div className={s.listHeader}>
          <h2 className={s.title}>生徒詳細</h2>
          <Button variant="cancel" onClick={handleBack}>一覧へ戻る</Button>
        </div>
        <div className={s.scrollArea}>
          <ApplicantDetail 
            applicant={selectedApplicant} 
            assignmentText={selectedApplicant.assignmentText}
            onEdit={() => setMode('edit')}
            onDelete={() => handleDelete(selectedApplicant.id!, `${selectedApplicant.last_name} ${selectedApplicant.first_name}`)}
          />
        </div>
      </div>
    );
  }

  // 一覧画面
  return (
    <div className={s.container}>
      <div className={s.listHeader}>
        <h2 className={s.title}>生徒一覧</h2>
        <Button variant="add" onClick={() => setMode('add')}>
          + 新規登録
        </Button>
      </div>
      <div className={s.scrollArea}>
        {processedApplicants.map((student) => {
          const fullName = `${student.first_name} ${student.last_name}`;
          return (
            <div key={student.id} className={s.listRow} onClick={() => handleDetailStart(student.id!)}>
              <div key={student.id}>
                <div className={s.studentName}>
                  <span className={s.studentId}>{student.student_id}.　</span>                  
                  {fullName}
                  {/* 割当済みの場合にバッジを表示 */}
                  {student.currentAssignment && (
                    <span className={s.assignmentBadge}>
                      割当済み
                    </span>
                  )}
                </div>
                {/* 割当情報の詳細表示 */}
                {
                  <div className={s.assignmentDetail}>
                    {student.assignmentText}
                  </div>
                }
              </div>
              <div className={s.actionButtonGroup}>
                <Button 
                  variant="edit" 
                  onClick={() => handleEditStart(student.id!)}
                  style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                >
                  編集
                </Button>
                <Button 
                  variant="delete" 
                  onClick={() => handleDelete(student.id!, fullName)}
                  style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                >
                  削除
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicantSettingPanel;