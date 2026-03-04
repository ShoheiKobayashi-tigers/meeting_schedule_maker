// features/Schedule/hooks/useSlotSettings.ts
import { useAppStore } from '../../../store/useAppStore';

export const useSlotSettings = () => {
  const { scheduleData } = useAppStore((state) => state.db);
  const { 
    toggleSlotBlock, 
    deleteAssignmentFromSlot, 
    openConfirmationModal 
  } = useAppStore();

  const handleToggleBlock = (rowIndex: number, colIndex: number) => {
    const currentStatus = scheduleData.availability[rowIndex][colIndex];
    const isCurrentlyBlocked = currentStatus === 'admin_block';
    const assignedApplicantId = scheduleData.assignments[rowIndex][colIndex];

    // 「公開中」から「非公開（ブロック）」へ変更、かつ児童が割り当てられている場合
    if (!isCurrentlyBlocked && assignedApplicantId) {
      openConfirmationModal({
        title: '割当解除の確認',
        message: 'この枠には既に児童が割り当てられています。面談不可に設定すると、現在の割り当ては削除されます。よろしいですか？',
        confirmText: '解除して面談不可にする',
        cancelText: '戻る',
        onConfirm: () => {
          deleteAssignmentFromSlot({ rowIndex, colIndex });
          toggleSlotBlock({ rowIndex, colIndex });
        }
      });
      return;
    }

    // それ以外（児童がいない、または「可」に戻す）は即時実行
    toggleSlotBlock({ rowIndex, colIndex });
  };

  return {
    handleToggleBlock
  };
};