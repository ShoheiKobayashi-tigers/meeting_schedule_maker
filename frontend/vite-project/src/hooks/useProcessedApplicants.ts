// src/hooks/useProcessedApplicants.ts
import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { isPreferred } from '../utils/availabilityUtils';
import { getCurrentAssignment } from '../utils/applicantUtils';
import { formatDisplayDate } from './useProcessedSchedule'; // フォーマット関数を再利用

export const useProcessedApplicants = () => {
  const { applicants, scheduleData } = useAppStore((state) => state.db);
  const { selectedSlot, draggingSlotIndex } = useAppStore((state) => state.ui);

  return useMemo(() => {
    const activeSlotIndex = selectedSlot ?? draggingSlotIndex;
    const activeSlotName = activeSlotIndex
        ? `${scheduleData.cols[activeSlotIndex.colIndex]} ${scheduleData.rows[activeSlotIndex.rowIndex]}`
        : null;    

    return applicants.map((applicant) => {
      const assignment = getCurrentAssignment(applicant.id!, scheduleData);
      
      // --- ここで表示用テキストを組み立てる（ロジックの集約） ---
      let assignmentText = '未定';
      if (assignment) {
        // インデックスではなく、assignment.date/time という「値」を直接使う
        const datePart = formatDisplayDate(assignment.date);
        assignmentText = `${datePart} ${assignment.time}`;
      }

      return {
        ...applicant,
        currentAssignment: assignment, // rowIndex, colIndex, time, date を含む
        assignmentText,                // これを ApplicantDetail に渡す
        isAvailable: activeSlotName ? isPreferred(applicant, activeSlotName) : true,
      };
    });
  }, [applicants, scheduleData, selectedSlot, draggingSlotIndex]);
};