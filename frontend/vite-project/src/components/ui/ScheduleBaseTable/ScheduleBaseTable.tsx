// src/components/ui/ScheduleBaseTable/ScheduleBaseTable.tsx
import React, { ReactNode } from 'react';
import * as s from './ScheduleBaseTable.css';

// useProcessedSchedule.ts の戻り値の型と100%一致させています
export interface GridCell {
  rowIndex: number;
  colIndex: number;
  rowLabel: string;
  colLabel: string;
  displayColLabel: string;
  assignment: string | null;
  status: string;
}

export interface GridRow {
  rowIndex: number;
  rowLabel: string;
  cells: GridCell[];
}

interface ScheduleBaseTableProps {
  grid: GridRow[];
  timeHeaderLabel?: string;
  // Panel側でD&D用IDを作成できるよう cellId を渡します
  renderCell: (cell: GridCell, cellId: string) => ReactNode;
}

export const ScheduleBaseTable: React.FC<ScheduleBaseTableProps> = ({ 
  grid, 
  timeHeaderLabel = "時間帯 ＼ 日付",
  renderCell 
}) => {
  if (!grid || grid.length === 0) return null;

  return (
    <div className={s.tableWrapper}>
      <table className={s.table}>
        <thead>
          <tr>
            <th className={s.cornerCell}>{timeHeaderLabel}</th>
            {grid[0].cells.map((cell) => (
              <th key={cell.colLabel} className={s.headerCell}>
                {cell.displayColLabel}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((row) => (
            <tr key={row.rowLabel}>
              <td className={s.timeCell}>{row.rowLabel}</td>
              {row.cells.map((cellData) => {
                const cellId = `slot-${cellData.rowIndex}-${cellData.colIndex}`;
                return (
                  <td key={cellData.colLabel} className={s.cell}>
                    {renderCell(cellData, cellId)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};