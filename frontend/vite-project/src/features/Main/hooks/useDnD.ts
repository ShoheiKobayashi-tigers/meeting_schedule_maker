import { useCallback, useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { parseSlotId } from '../../../utils/slotUtils';
import { 
    calculateSlotAvailabilityById,
    calculateSlotAvailabilityByIndex
} from '../../../utils/availabilityUtils';

export const useDnD = () => {
    // Data & UI States
    const { applicants, scheduleData } = useAppStore((state) => state.db);
    const { draggingApplicantId } = useAppStore((state) => state.ui);

    // Actions
    const { 
        setScheduleData,
        setSelectedSlot,
        setSelectedApplicantId,
        setDraggingApplicantId,
        setDraggingSlotIndex,
        assignApplicant,
        deleteAssignmentFromSlot,
        resetAvailability
    } = useAppStore();

    const [hoveredCellId, setHoveredCellId] = useState<string | null>(null);

    // --- ドラッグ開始 ---
    const handleDragStart = useCallback((e: React.DragEvent, applicantId: string, sourceCellId: string | null = null) => {
        const sourceId = sourceCellId || 'applicant-list';
        e.dataTransfer.setData('applicantId', applicantId);
        e.dataTransfer.setData('sourceCellId', sourceId);
        e.dataTransfer.effectAllowed = "move";
        
        setDraggingApplicantId(applicantId);
        
        const slotIndex = sourceId !== 'applicant-list' ? parseSlotId(sourceId) : null;
        setDraggingSlotIndex(slotIndex);

        // 選択状態をクリア
        setSelectedSlot(null);
        setSelectedApplicantId(null);

        // 配置可能エリアのハイライト計算
        const newAvailability = (slotIndex === null)
            ? calculateSlotAvailabilityById(applicantId, applicants, scheduleData)
            : calculateSlotAvailabilityByIndex(slotIndex, applicants, scheduleData);
            
        setScheduleData({ ...scheduleData, availability: newAvailability });
    }, [scheduleData, applicants, setDraggingApplicantId, setDraggingSlotIndex, setSelectedSlot, setSelectedApplicantId, setScheduleData]);

    // --- ドラッグ終了（リセット） ---
    const handleDragEnd = useCallback(() => {
        resetAvailability();        
        setDraggingApplicantId(null);
        setDraggingSlotIndex(null);
        setHoveredCellId(null);
    }, [scheduleData, setScheduleData, setDraggingApplicantId, setDraggingSlotIndex]);

    // --- ドラッグ中/通過のイベント ---
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }, []);

    const handleDragEnter = useCallback((e: React.DragEvent, cellId: string) => {
        e.preventDefault();
        setHoveredCellId(cellId);
    }, []);

    const handleDragLeave = useCallback(() => {
        setHoveredCellId(null);
    }, []);

    // --- ドロップ実行 ---
    const handleDrop = useCallback((e: React.DragEvent, targetId: string, droppedOnApplicantId: string | null) => {
        e.preventDefault();
        setHoveredCellId(null);

        //ドラッグ中のApplicant
        const applicantId = e.dataTransfer.getData('applicantId');
        //ドラッグ元のソースID(applicant-list, slot)
        const sourceCellId = e.dataTransfer.getData('sourceCellId');

        if (!applicantId || targetId === sourceCellId) return;

        //ドラッグ元のスロットID　ドラッグ元がapplicant-listの場合はnullで返ってくる
        const sourceSlot = parseSlotId(sourceCellId);

        // A. リスト（解除エリア）へのドロップ
        if (targetId === 'applicant-list') {
            if (sourceSlot) {
                if (droppedOnApplicantId) {
                    // 1. 【入れ替え】特定の児童(かつisAvailable)の上にドロップされた場合
                    // 元の枠に、リストにいた児童を上書き割り当て
                    assignApplicant(droppedOnApplicantId, sourceSlot);
                } else {
                    // 2. 【解除】児童以外のリストエリアにドロップされた場合
                    deleteAssignmentFromSlot(sourceSlot);
                }
            }
        }
        // B. 面談スロットへのドロップ
        else {
            //ドロップ先のスロットID
            const targetSlot = parseSlotId(targetId);
            //万が一、parseしてnullが返ってきたときのため、ブロックを組む
            if (targetSlot) {
                const targetStatus = scheduleData.availability[targetSlot.rowIndex][targetSlot.colIndex];
                const targetApplicant = scheduleData.assignments[targetSlot.rowIndex][targetSlot.colIndex];

                // 配置不可（ブロック中など）な場所は無視
                if (targetStatus === 'admin_block' || targetStatus === 'unAvailable') return;
                switch(targetStatus){
                    case 'switchable':
                        assignApplicant(applicantId, targetSlot);
                        assignApplicant(targetApplicant!, sourceSlot!);
                        break;
                    case 'movableToOther':
                    case 'settable':
                        assignApplicant(applicantId, targetSlot);
                        break;
                }
            }
        }

        // 共通：ハイライト解除とドラッグ状態リセット
        handleDragEnd();
    }, [scheduleData.availability, deleteAssignmentFromSlot, assignApplicant, handleDragEnd]);

    return {
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDragEnter,
        handleDragLeave,
        handleDrop,
        hoveredCellId,
        draggingApplicantId
    };
};