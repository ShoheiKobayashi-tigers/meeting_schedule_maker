import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { sortDateCols, sortTimeRows } from '../utils/sortUtils';

export const useProcessedSchedule = () => {
  const { scheduleData } = useAppStore((state) => state.db);

  // 1. 表示用にソートされたヘッダーを作成
  const sortedCols = useMemo(() => sortDateCols(scheduleData.cols), [scheduleData.cols]);
  const sortedRows = useMemo(() => sortTimeRows(scheduleData.rows), [scheduleData.rows]);

  // 2. ソートされた順序に基づいた「グリッド情報」を構築
  const grid = useMemo(() => {
    return sortedRows.map((rowLabel) => {
      const rowIndex = scheduleData.rows.indexOf(rowLabel);
      
      const cells = sortedCols.map((colLabel) => {
        const colIndex = scheduleData.cols.indexOf(colLabel);
        
        return {
          rowIndex,    // Store側の行インデックス
          colIndex,    // Store側の列インデックス
          rowLabel,    // "09:00 - 09:15"
          colLabel,    // "12/04 (木)"
          assignment: scheduleData.assignments[rowIndex][colIndex],
          status: scheduleData.availability[rowIndex][colIndex],
        };
      });

      return {
        rowIndex,
        rowLabel,
        cells
      };
    });
  }, [sortedCols, sortedRows, scheduleData]);

  return {
    sortedCols,
    sortedRows,
    grid,
    // 元のインデックスを引き出すためのヘルパー
    getOriginalColIdx: (label: string) => scheduleData.cols.indexOf(label),
    getOriginalRowIdx: (label: string) => scheduleData.rows.indexOf(label),
  };
};