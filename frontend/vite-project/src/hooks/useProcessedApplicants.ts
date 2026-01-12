// src/hooks/useProcessedApplicants.ts
import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { isPreferred } from '../utils/availabilityUtils';
import { getCurrentAssignment } from '../utils/applicantUtils';


export const useProcessedApplicants = () => {
  const { applicants, scheduleData } = useAppStore((state) => state.db);
  const { selectedSlot, draggingSlotIndex } = useAppStore((state) => state.ui);

  const processedApplicants = useMemo(() => {
    const activeSlotIndex = selectedSlot ??  draggingSlotIndex;
    const activeSlotName = activeSlotIndex
        ? `${scheduleData.cols[activeSlotIndex.colIndex]} ${scheduleData.rows[activeSlotIndex.rowIndex]}`
        : null;    
    return applicants.map((applicant) => {
      // 1. 現在の割り当て場所を特定
      const currentAssignment = getCurrentAssignment(applicant.id!, scheduleData);
      // 2. 配置可能かどうかの判定
      const isAvailable = activeSlotName? isPreferred(applicant, activeSlotName): true;

      return {
        ...applicant,
        currentAssignment,
        isAvailable,
      };
    });
  }, [applicants, scheduleData.assignments, selectedSlot, draggingSlotIndex]);

  return processedApplicants;
};