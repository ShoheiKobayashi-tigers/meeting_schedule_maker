import { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';

export const useScheduleSettings = () => {
  const { scheduleData } = useAppStore((state) => state.db);
  const { 
    handleAddColFromPicker, 
    handleDeleteCol, 
    handleAddRowFromTime, 
    handleDeleteRow,
    setInterviewDuration,
    openConfirmationModal
  } = useAppStore();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('09:00');

  // 日付の削除（割当がある場合は警告）
  const confirmDeleteCol = (targetCol: string) => {
    // ★追加: 元データ内での本当のインデックスを取得
    const actualIndex = scheduleData.cols.indexOf(targetCol);
    if (actualIndex === -1) return; // 見つからなければ何もしない

    // 本当のインデックスを使って割り当ての有無をチェック
    const hasAssignment = scheduleData.assignments.some(row => row[actualIndex] !== null);

    if (hasAssignment) {
      openConfirmationModal({
        title: '日付削除の確認',
        message: `${targetCol} には既に児童が割り当てられています。削除すると割当データも消去されますが、よろしいですか？`,
        onConfirm: () => handleDeleteCol(targetCol), // ★文字列を渡す
        confirmText: 'OK',
        cancelText: 'キャンセル'
      });
    } else {
      handleDeleteCol(targetCol); // ★文字列を渡す
    }
  };

  // 時間帯の削除（割当がある場合は警告）
  const confirmDeleteRow = (targetRow: string) => {
    // ★追加: 元データ内での本当のインデックスを取得
    const actualIndex = scheduleData.rows.indexOf(targetRow);
    if (actualIndex === -1) return; // 見つからなければ何もしない

    // 本当のインデックスを使って割り当ての有無をチェック
    const hasAssignment = scheduleData.assignments[actualIndex].some(slot => slot !== null);

    if (hasAssignment) {
      openConfirmationModal({
        title: '時間帯削除の確認',
        message: `${targetRow} には既に児童が割り当てられています。削除すると割当データも消去されますが、よろしいですか？`,
        onConfirm: () => handleDeleteRow(targetRow), // ★文字列を渡す
        confirmText: 'OK',
        cancelText: 'キャンセル'
      });
    } else {
      handleDeleteRow(targetRow); // ★文字列を渡す
    }
  };

  const onAddDate = () => {
    if (!selectedDate) return;
    handleAddColFromPicker(selectedDate);
    setSelectedDate(''); // 追加後にリセット
  };

  return {
    selectedDate,
    setSelectedDate,
    selectedStartTime,
    setSelectedStartTime,
    onAddDate,
    handleAddRow: handleAddRowFromTime,
    confirmDeleteCol,
    confirmDeleteRow,
    setInterviewDuration
  };
};