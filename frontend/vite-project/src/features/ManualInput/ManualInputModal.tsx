import React, { useState, useEffect, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useProcessedSchedule } from '../../hooks/useProcessedSchedule';
import { ScheduleBaseTable, GridCell } from '../../components/ui/ScheduleBaseTable/ScheduleBaseTable';
import { Button } from '../../components/ui/Button/Button';
import * as s from './ManualInputModal.css';

interface Props {
  applicantId: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export const ManualInputModal: React.FC<Props> = ({ 
  applicantId, onClose, onNext, onPrev, hasNext, hasPrev 
}) => {
  const { applicants } = useAppStore(state => state.db);
  const { saveApplicant } = useAppStore();
  const { grid } = useProcessedSchedule();
  
  const applicant = applicants.find(a => a.id === applicantId);

  // 爆速UIのためのローカルステート
  const [tempSelected, setTempSelected] = useState<string[]>([]);

  // 1. 児童が切り替わった瞬間に、その子のデータをローカルステートにセット
  useEffect(() => {
    const currentApplicant = applicants.find(a => a.id === applicantId);
    if (currentApplicant) {
      setTempSelected(currentApplicant.preferred_dates || []);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicantId]); 

  // 2. 「未保存の変更があるか？」を判定
  const hasUnsavedChanges = useMemo(() => {
    if (!applicant) return false;
    const original = applicant.preferred_dates || [];
    if (original.length !== tempSelected.length) return true;
    return tempSelected.some(s => !original.includes(s));
  }, [applicant, tempSelected]);

  // 3. 離脱防止（タブ閉じ・リロード時のポップアップ）
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ''; // これでブラウザ標準の警告が出ます
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  if (!applicant) return null;

  // セルクリック時はローカルステートだけを超高速で更新
  const handleCellClick = (cell: GridCell) => {
    const value = `${cell.colLabel} ${cell.rowLabel}`;
    setTempSelected(prev => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  // 変更があった場合のみ、Storeへ保存する関数
  const saveCurrent = () => {
    if (hasUnsavedChanges) {
      saveApplicant({
        ...applicant,
        preferred_dates: tempSelected
      });
    }
  };

  // ページ移動・閉じるボタンのハンドラ（保存してから移動する）
  const handleNext = () => { saveCurrent(); onNext(); };
  const handlePrev = () => { saveCurrent(); onPrev(); };
  const handleClose = () => { saveCurrent(); onClose(); };

  return (
    <div className={s.overlay}>
       <div className={s.container}>
         
         <div className={s.header}>
           <div className={s.headerLeft}>
             <h2 className={s.title}>
               <span className={s.studentIdBadge}>{applicant.student_id}</span> 
               {applicant.family_name} {applicant.first_name}
             </h2>
             <p className={s.subTitle}>
               プリントを見ながら、希望する枠（〇）をクリックしてください。
               <span className={s.realtimeText}>※次の児童へ移動、または閉じる時に保存されます</span>
             </p>
           </div>
           <div>
             <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0ea5e9' }}>
               選択中: {tempSelected.length} 枠
             </span>
           </div>
         </div>
         
         <div className={s.tableContainer}>
          <ScheduleBaseTable
            grid={grid}
            renderCell={(cell) => {
              const value = `${cell.colLabel} ${cell.rowLabel}`;
              const isSelected = tempSelected.includes(value);
              return (
                <div 
                  className={`${s.cell} ${isSelected ? s.selectedCell : ''}`}
                  onClick={() => handleCellClick(cell)}
                >
                  {isSelected && <span className={s.checkIcon}>〇</span>}
                </div>
              );
            }}
          />
         </div>

         {/* フッター： 左(前へ)・中央(閉じる)・右(次へ) */}
         <div className={s.footer}>
           <Button variant="primary" onClick={handlePrev} disabled={!hasPrev}>
             ◀ 前の児童
           </Button>
           
           <Button variant="outline" onClick={handleClose}>
             一覧に戻る
           </Button>
           
           <Button variant="primary" onClick={handleNext} disabled={!hasNext}>
             次の児童 ▶
           </Button>
         </div>
         
       </div>
    </div>
  );
}