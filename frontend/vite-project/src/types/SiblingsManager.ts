// src/types/SiblingsManager.ts

import {type Applicant, type Sibling, applicantInputSchema, siblingInputSchema} from '../types/Students';

/**
 * useSiblingsManager の戻り値の型
 */
export interface SiblingsManagerResult {
    siblings: Sibling[];
    
    // CRUD関数
    addSibling: (newSiblingData: Omit<Sibling, 'id'>) => void; // IDを自動生成するため Omit を使用
    deleteSibling: (siblingId: string) => void;
    updateSibling: (updatedSiblingData: Sibling) => void;

    // ユーティリティ関数
    /**
     * 指定された生徒の family_id に基づいて兄弟リストを取得する。
     */
    getSiblingsForStudent: (student: Applicant | null) => Sibling[];

    /**
     * 指定されたスロットキーに割り当てられた兄弟を「クラス / 名前」形式の文字列リストで返す。
     */
    getAssignedSiblingsList: (slotKey: string) => string[];
    
    // ... その他 useSiblingsManager が公開するプロパティがあれば追記
    [key: string]: any; 
}