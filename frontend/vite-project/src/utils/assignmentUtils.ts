/**
 * src/utils/assignmentUtils.js
 * * スケジュールデータの割り当て (assignments) を不変的に更新するためのユーティリティ
 */

// 1. 指定されたスロットに児童（生徒）を割り当てる関数
export const assignApplicantToSlot = (
    slot,
    assignments,
    applicantId
) => {
    // 既存の assignments をシャローコピーして新しい二次元配列を作成 (不変性の確保)
    const newAssignments = assignments.map(row => [...row]);

    // 割り当てオブジェクトを作成
    const assignmentObject = {
        applicantId: applicantId,
        type: 'neutral'
    };

    // 新しい割り当てをターゲットのスロットに設定
    newAssignments[slot.rowIndex][slot.colIndex] = assignmentObject;

    // 更新された assignments 配列のみを返す
    return newAssignments;
};

// 2. 指定されたスロットの割り当てを解除する関数
export const deleteAssignmentFromSlot = (
    slot,
    assignments
) => {
    // 既存の assignments をシャローコピーして新しい二次元配列を作成 (不変性の確保)
    const newAssignments = assignments.map(row => [...row]);

    // ターゲットのスロットを null にして割り当てを解除
    newAssignments[slot.rowIndex][slot.colIndex] = null;

    // 更新された assignments 配列のみを返す
    return newAssignments;
};