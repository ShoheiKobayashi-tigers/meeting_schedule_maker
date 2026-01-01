// src/types/Modal.ts
import { Applicant } from './Applicant'; // Applicant 型に依存

/**
 * 確認モーダルの状態 (ConfirmationModal)
 */
export interface ConfirmationModalState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void; // 実行する確定アクション
    confirmText: string | null;
    cancelText: string | null;
}

/**
 * 生徒詳細モーダルの状態 (StudentDetailsModal)
 */
export interface StudentDetailsModalState {
    isOpen: boolean;
    student: Applicant | null; // 詳細表示する生徒データ。表示されていない場合は null
}

/**
 * 生徒登録/編集モーダルの状態 (UpsertStudentModal)
 */
export interface UpsertStudentModalState {
    isOpen: boolean;
    student: Applicant | null; // 編集対象の生徒データ。新規作成時は null
    mode: 'add' | 'edit';
}