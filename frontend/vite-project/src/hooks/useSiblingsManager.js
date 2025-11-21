// src/hooks/useSiblingManager.js

import { useState, useCallback } from 'react';

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
                    assignment: assignment,
                    preferred_dates: [],
                };
            });
    }, [siblings]);

    // 💡 4. CRUD関数と状態を公開
    return {
        siblings,
        getSiblingsForStudent,
        addSibling,
        deleteSibling,
        // ... (updateSibling, getSiblingById などの関数)
    };
};

export default useSiblingManager;