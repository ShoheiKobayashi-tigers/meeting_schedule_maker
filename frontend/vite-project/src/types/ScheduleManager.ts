// src/types/ScheduleManager.ts

import React from 'react';
import {type Applicant} from '../types/Students';
import { 
    ConfirmationModalState, 
    StudentDetailsModalState, 
    UpsertStudentModalState 
} from './Modal';

// I. useScheduleManager 内部データ構造の型
// ----------------------------------------------------

/**
 * スケジュールマトリックスの座標を表す型
 */
export interface SlotIndex {
    rowIndex: number;
    colIndex: number;
}

/**
 * useScheduleManager の scheduleData ステートの型
 */
export interface ScheduleData {
    rows: string[];
    cols: string[];
    assignments: (string | null)[][]; //assingmentsにはapplicantIdのみが入る
    availability: string[][]; // 例: 'available', 'admin_block', 'unAvailable', 'settable', etc.
}

/**
 * useManagerStyles が返すスタイルオブジェクトの型
 */
export interface ManagerStyles {
    container: React.CSSProperties;
    contentArea: React.CSSProperties;
    [key: string]: any; 
}

/**
 * getAssignmentDetails の戻り値の型
 */
export interface AssignmentDetails {
    date: string;
    time: string;
}

// II. useScheduleManager の戻り値の型
// ----------------------------------------------------

/**
 * useScheduleManager が外部に公開するすべての状態と関数の集合
 */
export interface ScheduleManagerResult {
    // === データ/状態 ===
    scheduleData: ScheduleData;
    applicants: Applicant[];
    processedApplicants: (Applicant & { currentAssignment: SlotIndex | null; isAvailable: boolean; })[];

    modalState: ConfirmationModalState;
    studentDetailsModalState: StudentDetailsModalState;
    upsertStudentModalState: UpsertStudentModalState; 

    interviewDuration: number;
    DURATION_OPTIONS: number[];
    selectedDate: string;
    selectedStartTime: string;
    TIME_OPTIONS: string[];

    draggingApplicantId: string | null;
    isAddButtonActive: boolean;
    selectedSlot: SlotIndex | null;
    selectedApplicantId: string | null;
    hoveredCellId: string | null;
    draggingSlotIndex: SlotIndex | null;

    allScheduleSlots: string[];
    unBlockedSlots: string[];

    // === 関数/アクション ===
    setConfirmModalState: React.Dispatch<React.SetStateAction<ConfirmationModalState>>;
    setInterviewDuration: React.Dispatch<React.SetStateAction<number>>;
    setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
    setSelectedStartTime: React.Dispatch<React.SetStateAction<string>>;
    setIsAddButtonActive: React.Dispatch<React.SetStateAction<boolean>>;
    
    // モーダル操作
    openStudentDetailsModal: (student: Applicant) => void;
    closeStudentDetailsModal: () => void;
    openAddStudentModal: () => void;
    openEditStudentModal: (student: Applicant) => void; 
    closeUpsertStudentModal: () => void;
    
    // データ操作
    confirmDeleteStudent: (student: Applicant) => void;
    
    // スケジュール操作
    handleAddRow: () => void;
    handleDeleteRow: (rowIndex: number) => void;
    handleAddColFromPicker: () => void;
    handleDeleteCol: (colIndex: number) => void;
    toggleSlotAvailability: (slot: SlotIndex) => void;
    
    // UI/D&D操作
    handleSlotClick: (currentSlot: SlotIndex) => void;
    handleApplicantClick: (applicantId: string) => void;
    handleClickDeleteButton: () => void;
    handleDragStart: (e: React.DragEvent, applicantId: string, sourceCellId?: string | null) => void;
    handleDragEnd: () => void;
    handleDragOver: (e: React.DragEvent) => void;
    handleDragEnter: (e: React.DragEvent, cellId: string) => void;
    handleDragLeave: () => void;
    handleDrop: (e: React.DragEvent, targetId: string) => void;

    // ユーティリティ
    getApplicantName: (applicantId: string) => string;
    getAssignmentDetails: (applicantId: string | undefined) => AssignmentDetails | null;

    // スタイル
    styles: ManagerStyles;
    getSlotStyle: (isAddButtonActive: string, hoveredCellId: boolean, selectedSlot: boolean | null) => React.CSSProperties; 
}