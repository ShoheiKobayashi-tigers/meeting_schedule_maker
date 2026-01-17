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
  const confirmDeleteCol = (index: number) => {
    const dateLabel = scheduleData.cols[index];
    const hasAssignment = scheduleData.assignments.some(row => row[index] !== null);

    if (hasAssignment) {
      openConfirmationModal({
        title: '日付削除の確認',
        message: `${dateLabel} には既に児童が割り当てられています。削除すると割当データも消去されますが、よろしいですか？`,
        onConfirm: () => handleDeleteCol(index),
        confirmText: 'OK',
        cancelText: 'キャンセル'
      });
    } else {
      handleDeleteCol(index);
    }
  };

  // 時間帯の削除（割当がある場合は警告）
  const confirmDeleteRow = (index: number) => {
    const timeLabel = scheduleData.rows[index];
    const hasAssignment = scheduleData.assignments[index].some(slot => slot !== null);

    if (hasAssignment) {
      openConfirmationModal({
        title: '時間帯削除の確認',
        message: `${timeLabel} には既に児童が割り当てられています。削除すると割当データも消去されますが、よろしいですか？`,
        onConfirm: () => handleDeleteRow(index),
        confirmText: 'OK',
        cancelText: 'キャンセル'
      });
    } else {
      handleDeleteRow(index);
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