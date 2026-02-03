import React, { useMemo } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { useDnD } from '../hooks/useDnD';
import { useClickAssignment } from '../hooks/useClickAssignment';
import { useProcessedApplicants } from '../../../hooks/useProcessedApplicants';
import { ApplicantItem } from '../parts/ApplicantItem/ApplicantItem';
import { getApplicantById } from '../../../utils/applicantUtils';
import * as s from './ApplicantListPanel.css';

const ApplicantListPanel: React.FC = () => {
    // === Storeからデータ(db)と状態(ui)を取得 ===
    const db = useAppStore((state) => state.db);
    const ui = useAppStore((state) => state.ui);
    
    const { scheduleData } = db;
    const { selectedSlot, selectedApplicantId, draggingApplicantId, draggingSlotIndex } = ui;

    // === カスタムフックの呼び出し ===
    const { handleDragStart, handleDragEnd, handleDragOver, handleDrop } = useDnD();
    const { handleApplicantClick, handleClickDeleteButton } = useClickAssignment();
    
    // === UI状態の計算 ===
    const activeSlot = selectedSlot || draggingSlotIndex;
    
    // === 表示用データの加工 (processedApplicants) ===
    const applicants = useProcessedApplicants();
    // どの児童がどこに割り当てられているかを計算し、表示フラグを立てる

    // 未割り当ての児童のみを抽出
    const displayedApplicants = useMemo(() => {
        return applicants.filter(app => !app.currentAssignment);
    }, [applicants]);

    // 現在選択中のスロットに誰か割り当てられているか確認（解除ボタン表示用）
    const applicantOnSelectedSlot = selectedSlot 
        ? scheduleData.assignments[selectedSlot.rowIndex][selectedSlot.colIndex] 
        : null;

    // ガイドメッセージの取得
    const getGuideMessage = () => {
        if (selectedSlot) return '面談枠が選択されています。リストの児童をクリックして割り当ててください。';
        if (selectedApplicantId) {
            const applicant = getApplicantById(selectedApplicantId, applicants);
            const name = applicant ? `${applicant.family_name} ${applicant.first_name}` : '';
            return `面談枠をクリックして「${name}」さんを割り当ててください。`;
        }
        return '面談枠からここにドロップすると割り当て解除されます';
    };

    return (
        <div
            className={s.container}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'applicant-list', null)}
        >
            <h2 className={s.title}>未割り当ての児童（生徒）リスト</h2>
            
            <p className={s.guideMessage}>
                {getGuideMessage()}
            </p>

            <div className={s.scrollArea}>
                {displayedApplicants.map((applicant) => {
                    // 1. IDがない場合は表示対象外とする（型ガード）
                    if (!applicant.id) return null;
                    return(
                        <ApplicantItem
                            key={applicant.id}
                            applicant={applicant}
                            isAvailable={applicant.isAvailable}
                            // 自身が選択されている、またはスロット選択中で配置可能な場合にアクティブ表示
                            isActive={selectedApplicantId === applicant.id || (!!activeSlot && applicant.isAvailable)}
                            isDragging={draggingApplicantId === applicant.id}
                            
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onDrop={(e, droppedOnId) => {
                                e.stopPropagation();
                                // 児童の上にドロップした場合もリストへのドロップとして扱う（または置換ロジック）
                                handleDrop(e, 'applicant-list', droppedOnId);
                            }}
                            onClick={() => handleApplicantClick(applicant.id!)}
                        />
                    );
                })}
            
                {/* 全員割り当て済みの場合のメッセージ */}
                {displayedApplicants.length === 0 && (
                    <p className={s.emptyState}>
                        全ての児童が割り当てられました！
                    </p>
                )}
            </div>
            {/* 選択中のスロットに誰かがいる場合のみ「解除ボタン」を表示 */}
            {applicantOnSelectedSlot && (
                <div className={s.actionArea}>
                    <button className={s.deleteButton} onClick={handleClickDeleteButton}>
                        選択中の枠の割り当てを解除
                    </button>
                </div>
            )}
        </div>
    );
};

export default ApplicantListPanel;