import React, { useMemo } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { useDnD } from '../hooks/useDnD';
import { useClickAssignment } from '../hooks/useClickAssignment';
import { ApplicantItem } from '../parts/ApplicantItem/ApplicantItem';
import { getApplicantById } from '../../../utils/applicantUtils';
import * as s from './ApplicantListPanel.css';

const ApplicantListPanel: React.FC = () => {
    // === Storeからデータ(db)と状態(ui)を取得 ===
    const db = useAppStore((state) => state.db);
    const ui = useAppStore((state) => state.ui);
    
    const { scheduleData, applicants } = db;
    const { selectedSlot, selectedApplicantId, draggingApplicantId, draggingSlotIndex } = ui;

    // === カスタムフックの呼び出し ===
    const { handleDragStart, handleDragEnd, handleDragOver, handleDrop } = useDnD();
    const { handleApplicantClick, handleClickDeleteButton } = useClickAssignment();

    // === 表示用データの加工 (processedApplicants) ===
    // どの児童がどこに割り当てられているかを計算し、表示フラグを立てる
    const processedApplicants = useMemo(() => {
        return applicants.map(app => {
            // 現在の割り当て場所を特定
            let currentAssignment = undefined;
            scheduleData.assignments.forEach((row, rIdx) => {
                row.forEach((cell, cIdx) => {
                    if (cell === app.id) {
                        currentAssignment = { rowIndex: rIdx, colIndex: cIdx };
                    }
                });
            });

            // 配置可能かどうかの判定 (ドラッグ中や選択中のスロットがある場合)
            // ここでは簡易的に true としていますが、必要に応じて preferred_dates などの判定を入れます
            const isAvailable = !!(selectedSlot || draggingSlotIndex);

            return {
                ...app,
                currentAssignment,
                isAvailable
            };
        });
    }, [applicants, scheduleData.assignments, selectedSlot, draggingSlotIndex]);

    // 未割り当ての児童のみを抽出
    const displayedApplicants = useMemo(() => {
        return processedApplicants.filter(app => !app.currentAssignment);
    }, [processedApplicants]);

    // === UI状態の計算 ===
    const activeSlot = selectedSlot || draggingSlotIndex;
    
    // 現在選択中のスロットに誰か割り当てられているか確認（解除ボタン表示用）
    const applicantOnSelectedSlot = selectedSlot 
        ? scheduleData.assignments[selectedSlot.rowIndex][selectedSlot.colIndex] 
        : null;

    // ガイドメッセージの取得
    const getGuideMessage = () => {
        if (selectedSlot) return '面談枠が選択されています。リストの児童をクリックして割り当ててください。';
        if (selectedApplicantId) {
            const applicant = getApplicantById(selectedApplicantId, applicants);
            const name = applicant ? `${applicant.last_name} ${applicant.first_name}` : '';
            return `面談枠をクリックして「${name}」さんを割り当ててください。`;
        }
        return '面談枠からここにドロップすると割り当て解除されます';
    };

    return (
        <div
            className={s.container}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'applicant-list')}
        >
            <h2 className={s.title}>未割り当ての児童（生徒）リスト</h2>
            
            <p className={s.guideMessage}>
                {getGuideMessage()}
            </p>

            <div className={s.scrollArea}>
                {/* 選択中のスロットに誰かがいる場合のみ「解除ボタン」を表示 */}
                {applicantOnSelectedSlot && (
                    <div className={s.actionArea}>
                        <button className={s.deleteButton} onClick={handleClickDeleteButton}>
                            選択中の枠の割り当てを解除
                        </button>
                    </div>
                )}

                {displayedApplicants.map((applicant) => {
                    // 1. IDがない場合は表示対象外とする（型ガード）
                    if (!applicant.id) return null;
                    <ApplicantItem
                        key={applicant.id}
                        applicant={applicant}
                        isAvailable={applicant.isAvailable}
                        // 自身が選択されている、またはスロット選択中で配置可能な場合にアクティブ表示
                        isActive={selectedApplicantId === applicant.id || (!!activeSlot && applicant.isAvailable)}
                        isDragging={draggingApplicantId === applicant.id}
                        
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDrop={(e) => {
                            e.stopPropagation();
                            // 児童の上にドロップした場合もリストへのドロップとして扱う（または置換ロジック）
                            handleDrop(e, 'applicant-list');
                        }}
                        onClick={() => handleApplicantClick(applicant.id!)}
                    />
                })}
            
                {/* 全員割り当て済みの場合のメッセージ */}
                {displayedApplicants.length === 0 && (
                    <p className={s.emptyState}>
                        全ての児童が割り当てられました！
                    </p>
                )}
            </div>
        </div>
    );
};

export default ApplicantListPanel;