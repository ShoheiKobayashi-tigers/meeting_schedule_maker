// src/hooks/useSiblingManager.js

import { useState, useCallback ,useMemo } from 'react';

const useSiblingManager = (initialSiblings) => {
    // 1. 兄弟リストをuseStateで管理
    const [siblings, setSiblings] = useState(initialSiblings);

    // 2. 兄弟を追加するCRUD関数 (例: Create)
    const addSibling = useCallback((newSiblingData) => {
        // ID生成ロジックなどを適用
        const newSibling = { id: Date.now().toString(), ...newSiblingData };
        setSiblings(prevSiblings => [...prevSiblings, newSibling]);
    }, []);

    // 3. 兄弟を削除するCRUD関数 (例: Delete)
    const deleteSibling = useCallback((siblingId) => {
        setSiblings(prevSiblings => prevSiblings.filter(s => s.id !== siblingId));
    }, []);

    const updateSibling = useCallback((updatedSiblingData) => {
        setSiblings(prevSiblings => prevSiblings.map(s =>
            s.id === updatedSiblingData.id ? { ...s, ...updatedSiblingData } : s
        ));
    }, []);

    // 兄弟の割り当て情報をSlotKeyで検索可能なMapとして生成
    const siblingAssignmentsMap = useMemo(() => {
        const map = {};
        siblings.forEach(sibling => {
            // assigned_slot（面談枠の文字列）をキーとして使用
            if (sibling.assigned_slot) {
                if (!map[sibling.assigned_slot]) {
                    map[sibling.assigned_slot] = [];
                }
                map[sibling.assigned_slot].push(sibling);
            }
        });
        return map;
    }, [siblings]); // 兄弟リストが更新されたときのみ再計算される

    // ユーザーの要望に応じた文字列リスト生成関数を定義
    const getAssignedSiblingsList = useCallback((slotKey) => {
        // 1. Mapから該当スロットに割り当てられた兄弟のリストを取得（O(1)アクセス）
        const assignedSiblings = siblingAssignmentsMap[slotKey];

        if (!assignedSiblings || assignedSiblings.length === 0) {
            return [];
        }

        // 2. 「クラス / 名前」形式の文字列リストを生成
        return assignedSiblings.map(sibling => {
            const className = sibling.class || 'クラス未設定';
            return `${className} / ${sibling.name}`;
        });
    }, [siblingAssignmentsMap]);

    const getSiblingsForStudent = useCallback((student) => {
            if (!student || !student.family_id) return [];

            // 1. 兄弟の検索対象を siblings のみに絞る
            const familySiblings = siblings.filter(
                (member) => member.family_id === student.family_id
            );

            // 2. 各兄弟に対して詳細情報を付加して整形
            return familySiblings.map(sibling => {
                // 前提に基づき、割り当ては常に null
                const assignment = null;

                return {
                    id: sibling.id,
                    name: sibling.name,
                    class: sibling.class,
                    assigned_slot: sibling.assigned_slot,
                };
            });
    }, [siblings]);

    // 💡 4. CRUD関数と状態を公開
    return {
        siblings,
        getSiblingsForStudent,
        addSibling,
        deleteSibling,
        updateSibling,
        getAssignedSiblingsList,
        // ... (getSiblingById などの関数)
    };
};

export default useSiblingManager;