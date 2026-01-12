import { useCallback } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { 
    calculateSlotAvailabilityById,
    calculateSlotAvailabilityByIndex
} from '../../../utils/availabilityUtils';
import { SlotIndex } from '../../../types/ScheduleManager';

export const useClickAssignment = () => {
    // Data & UI States
    const { applicants, scheduleData } = useAppStore((state) => state.db);
    const { selectedSlot, selectedApplicantId } = useAppStore((state) => state.ui);

    // Actions
    const { 
        setScheduleData,
        setSelectedSlot,
        setSelectedApplicantId,
        assignApplicant,
        deleteAssignmentFromSlot,
        resetAvailability
    } = useAppStore();

    // ハイライト状態をクリアする共通処理
    const clearHighlights = useCallback(() => {
        resetAvailability;
        setSelectedSlot(null);
        setSelectedApplicantId(null);
    }, [scheduleData, setScheduleData, setSelectedSlot, setSelectedApplicantId]);

    // --- 児童をクリックしたとき ---
    const handleApplicantClick = useCallback((applicantId: string) => {
        // すでにスロットが選択されている場合 -> そのスロットにこの児童を割り当てて終了
        if (selectedSlot) {
            assignApplicant(applicantId, selectedSlot);
            clearHighlights();
            return;
        }

        // スロット未選択の場合 -> 児童を選択/解除
        const isAlreadySelected = selectedApplicantId === applicantId;
        const newId = isAlreadySelected ? null : applicantId;
        
        setSelectedApplicantId(newId);

        if (newId) {
            const newAvailability = calculateSlotAvailabilityById(newId, applicants, scheduleData);
            setScheduleData({ ...scheduleData, availability: newAvailability });
        } else {
            clearHighlights();
        }
    }, [selectedSlot, selectedApplicantId, applicants, scheduleData, assignApplicant, clearHighlights, setSelectedApplicantId, setScheduleData]);

    // --- 面談スロットをクリックしたとき ---
    const handleSlotClick = useCallback((clickedSlot: SlotIndex) => {
        const { rowIndex, colIndex } = clickedSlot;
        const status = scheduleData.availability[rowIndex][colIndex];
        const isSameSlot = selectedSlot?.rowIndex === rowIndex && selectedSlot?.colIndex === colIndex;

        // 1. 選択解除条件
        if (isSameSlot || status === 'admin_block' || status === 'unAvailable') {
            clearHighlights();
            return;
        }

        // 2. 児童が選択されている状態でのクリック -> 割り当て実行
        if (selectedApplicantId) {
            assignApplicant(selectedApplicantId, clickedSlot);
            clearHighlights();
            return;
        }

        // 3. 何も選択されていない状態でのクリック -> スロットを選択
        if (!selectedSlot) {
            setSelectedSlot(clickedSlot);
            const newAvailability = calculateSlotAvailabilityByIndex(clickedSlot, applicants, scheduleData);
            setScheduleData({ ...scheduleData, availability: newAvailability });
            return;
        }

        // 4. 他のスロットが選択されている状態でのクリック -> 移動/交換
        // Storeの assignApplicant 内で「元の場所を消す」ロジックがあるため、これでOK
        const selectedApplicantIdInSlot = scheduleData.assignments[selectedSlot.rowIndex][selectedSlot.colIndex];
        if (selectedApplicantIdInSlot) {
            assignApplicant(selectedApplicantIdInSlot, clickedSlot);
        }
        clearHighlights();

    }, [selectedSlot, selectedApplicantId, scheduleData, applicants, assignApplicant, clearHighlights, setSelectedSlot, setScheduleData]);

    // --- 割り当て解除ボタン ---
    const handleClickDeleteButton = useCallback(() => {
        if (selectedSlot) {
            deleteAssignmentFromSlot(selectedSlot);
            clearHighlights();
        }
    }, [selectedSlot, deleteAssignmentFromSlot, clearHighlights]);

    return {
        handleApplicantClick,
        handleSlotClick,
        handleClickDeleteButton
    };
};