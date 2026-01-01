import React from 'react';
import ToggleSwitch from '../../../../components/ui/ToggleSwitch/ToggleSwitch';
import * as s from './SlotItem.css';

interface SlotItemProps {
    colHeader: string;
    rowHeader: string;
    isAvailable: boolean;
    assignmentSlot: string | null;
    getApplicantName: (id: string) => string;
    onToggle: () => void;
}

// React.memo を使うことで、1つのスイッチを切り替えた時に
// 全部の行が再レンダリングされるのを防げるため、パフォーマンスも向上します
export const SlotItem: React.FC<SlotItemProps> = React.memo(({
    colHeader,
    rowHeader,
    isAvailable,
    assignmentSlot,
    getApplicantName,
    onToggle
}) => {
    return (
        <div className={s.slotRow({ available: isAvailable })}>
            <div className={s.textContent}>
                <div className={s.headerText}>{colHeader}</div>
                <div className={s.subText}>{rowHeader}</div>
                {assignmentSlot && (
                    <div className={s.assignmentText}>
                        (割当済: {getApplicantName(assignmentSlot)})
                    </div>
                )}
            </div>

            <span className={s.statusLabel({ available: isAvailable })}>
                {isAvailable ? '可' : '不可'}
            </span>

            <ToggleSwitch
                isChecked={isAvailable}
                onChange={onToggle}
            />
        </div>
    );
});