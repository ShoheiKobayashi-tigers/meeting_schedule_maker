import { useState, useCallback, useMemo } from 'react';
import { Sibling } from '../types/Sibling';
import { Applicant } from '../types/Applicant';
import { SiblingsManagerResult } from '../types/SiblingsManager';

const useSiblingManager = (initialSiblings: Sibling[]): SiblingsManagerResult => {
    // 兄弟リストを管理
    const [siblings, setSiblings] = useState<Sibling[]>(initialSiblings);

    // 兄弟を追加 (IDは自動生成)
    const addSibling = useCallback((newSiblingData: Omit<Sibling, 'id'>) => {
        const newSibling: Sibling = { 
            ...newSiblingData,
            id: `sib-${Date.now()}`, 
        };
        setSiblings(prevSiblings => [...prevSiblings, newSibling]);
    }, []);

    // 兄弟を削除
    const deleteSibling = useCallback((siblingId: string) => {
        setSiblings(prevSiblings => prevSiblings.filter(s => s.id !== siblingId));
    }, []);

    // 兄弟を更新
    const updateSibling = useCallback((updatedSiblingData: Sibling) => {
        setSiblings(prevSiblings => prevSiblings.map(s =>
            s.id === updatedSiblingData.id ? { ...s, ...updatedSiblingData } : s
        ));
    }, []);

    // 兄弟の割り当て情報をSlotKeyで検索可能なMapとして生成
    const siblingAssignmentsMap = useMemo(() => {
        const map: Record<string, Sibling[]> = {};
        siblings.forEach(sibling => {
            if (sibling.assigned_slot) {
                if (!map[sibling.assigned_slot]) {
                    map[sibling.assigned_slot] = [];
                }
                map[sibling.assigned_slot].push(sibling);
            }
        });
        return map;
    }, [siblings]);

    // 「クラス / 名前」形式の文字列リストを生成
    const getAssignedSiblingsList = useCallback((slotKey: string): string[] => {
        const assignedSiblings = siblingAssignmentsMap[slotKey];

        if (!assignedSiblings || assignedSiblings.length === 0) {
            return [];
        }

        return assignedSiblings.map(sibling => {
            const className = sibling.class || 'クラス未設定';
            return `${className} / ${sibling.name}`;
        });
    }, [siblingAssignmentsMap]);

    // 指定された生徒の family_id に基づいて兄弟リストを取得
    const getSiblingsForStudent = useCallback((student: Applicant | null): Sibling[] => {
        if (!student || !student.family_id) return [];

        return siblings.filter(
            (member) => member.family_id === student.family_id
        );
    }, [siblings]);

    return {
        siblings,
        addSibling,
        deleteSibling,
        updateSibling,
        getSiblingsForStudent,
        getAssignedSiblingsList,
    };
};

export default useSiblingManager;