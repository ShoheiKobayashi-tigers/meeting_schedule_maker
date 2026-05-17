/**
 * src/utils/assignmentUtils.js
 * * スケジュールデータの割り当て (assignments) を不変的に更新するためのユーティリティ
 */

import { SlotIndex, ScheduleData } from "../types/ScheduleManager";

// 1. 指定されたスロットに児童（生徒）を割り当てる関数
export const assignApplicantToSlot = (
    slot: SlotIndex,
    assignments: (string | null)[][],
    applicantId: string
) => {
    // 既存の assignments をシャローコピーして新しい二次元配列を作成 (不変性の確保)
    const newAssignments = assignments.map(row => [...row]);

    // 新しい割り当てをターゲットのスロットに設定
    newAssignments[slot.rowIndex][slot.colIndex] = applicantId;

    // 更新された assignments 配列のみを返す
    return newAssignments;
};

// 2. 指定されたスロットの割り当てを解除する関数
export const deleteAssignmentFromSlot = (
    slot: SlotIndex,
    assignments: (string | null)[][]
) => {
    // 既存の assignments をシャローコピーして新しい二次元配列を作成 (不変性の確保)
    const newAssignments = assignments.map(row => [...row]);

    // ターゲットのスロットを null にして割り当てを解除
    newAssignments[slot.rowIndex][slot.colIndex] = null;

    // 更新された assignments 配列のみを返す
    return newAssignments;
};

export const createApplicantAssignmentMap = (scheduleData: ScheduleData) => {
  const map = new Map<string, { date: string; time: string }>();
  const { rows, cols, assignments } = scheduleData;

  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < cols.length; c++) {
      const applicantId = assignments[r][c];
      if (applicantId) {
        map.set(applicantId, { date: cols[c], time: rows[r] });
      }
    }
  }
  return map;
};