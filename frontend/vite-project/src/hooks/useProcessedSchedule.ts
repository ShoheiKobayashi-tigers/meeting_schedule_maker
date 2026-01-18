// useProcessedSchedule.ts
import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { sortDateCols, sortTimeRows } from '../utils/sortUtils';

// 補助：YYYY-MM-DD を MM/DD (曜) に変換する
export const formatDisplayDate = (dateStr: string): string => {
  if (!dateStr || !dateStr.includes('-')) return dateStr;
  const date = new Date(dateStr);
  const yy = String(date.getFullYear()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const day = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
  return `${yy}/${mm}/${dd} (${day})`;
};

export const useProcessedSchedule = () => {
  const { scheduleData } = useAppStore((state) => state.db);

  const sortedCols = useMemo(() => sortDateCols(scheduleData.cols), [scheduleData.cols]);
  const sortedRows = useMemo(() => sortTimeRows(scheduleData.rows), [scheduleData.rows]);

  const grid = useMemo(() => {
    return sortedRows.map((rowLabel) => {
      const rowIndex = scheduleData.rows.indexOf(rowLabel);
      return {
        rowIndex,
        rowLabel,
        cells: sortedCols.map((colLabel) => {
          const colIndex = scheduleData.cols.indexOf(colLabel);
          return {
            rowIndex,
            colIndex,
            rowLabel,
            colLabel, // DBの値 (YYYY-MM-DD)
            displayColLabel: formatDisplayDate(colLabel), // 表示用のラベル
            assignment: scheduleData.assignments[rowIndex][colIndex],
            status: scheduleData.availability[rowIndex][colIndex],
          };
        }),
      };
    });
  }, [sortedCols, sortedRows, scheduleData]);

  return { sortedCols, sortedRows, grid };
};