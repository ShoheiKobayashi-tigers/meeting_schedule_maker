// src/features/students-manage/hooks/useExportApplicants.ts
import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { exportApplicantsTokensToExcel } from '../utils/excelUtils';

export const useExportApplicants = () => {
  // Zustandから最新の児童リストを取得
  const { applicants, siblings } = useAppStore((state) => state.db);

  const exportApplicants = useCallback(() => {
    if (applicants.length === 0) {
      alert('出力する児童データがありません。');
      return;
    }
    // Utilsに投げるだけ
    exportApplicantsTokensToExcel(applicants, siblings);
  }, [applicants, siblings]);

  return { exportApplicants };
};