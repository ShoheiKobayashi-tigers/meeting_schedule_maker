import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import Button from '../ui/Button/Button';
import * as s from './AutoAssignConfirmModal.css';

export const AutoAssignConfirmModal: React.FC = () => {
  const { isOpen, result } = useAppStore((state) => state.autoAssignConfirmModal);
  const setOpen = useAppStore((state) => state.setAutoAssignConfirmModalOpen);
  const setAllocationConfigOpen = useAppStore((state) => state.setAllocationConfigOpen);
  const applyResult = useAppStore((state) => state.applyAutoAssignmentResult);

  if (!isOpen || !result) return null;

  const handleApply = () => {
    applyResult(result);
    setOpen(false, null);
  };

  const handleOpenConfig = () => {
    setOpen(false, null);
    setAllocationConfigOpen(true);
  };

  // 全員（成功した人＋失敗した人）の数
  const successCount = result.assignments.flat().filter(Boolean).length;
  const totalCount = successCount + result.unassigned.length;

  return (
    <div className={s.overlay}>
      <div className={s.modal}>
        <h2 className={s.title}>自動割り当てシミュレーション結果</h2>
        
        <div className={s.summaryBox}>
          <div className={s.summaryText}>
            <span className={s.highlight}>{totalCount}</span>人中 
            <span className={s.highlight}>{successCount}</span>人の割り当てに成功しました！
          </div>
          {result.success ? (
            <p className={s.successMessage}>🎉 全員の希望日程と条件を満たす完璧な割り当てが見つかりました。</p>
          ) : (
            <p className={s.warningMessage}>⚠️ 条件が厳しいため、{result.unassigned.length}名が未割り当てとなりました。</p>
          )}
        </div>

        {!result.success && (
          <div className={s.unassignedList}>
            <div className={s.unassignedTitle}>未割り当ての児童（手動調整または設定の見直しが必要）</div>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#431407' }}>
              {result.unassigned.map(app => (
                <li key={app.id}>{app.family_name} {app.first_name}</li>
              ))}
            </ul>
          </div>
        )}

        <div className={s.actions}>
          <Button variant="cancel" onClick={() => setOpen(false, null)}>キャンセル</Button>
          {!result.success && (
            <Button variant="edit" onClick={handleOpenConfig}>詳細設定を見直す</Button>
          )}
          <Button variant="confirm" onClick={handleApply}>この結果を適用する</Button>
        </div>
      </div>
    </div>
  );
};