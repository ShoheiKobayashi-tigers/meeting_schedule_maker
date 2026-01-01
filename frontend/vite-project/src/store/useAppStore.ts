import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Applicant, type Sibling, type StudentFormValues, applicantInputSchema, siblingInputSchema, studentFormSchema } from '../types/Students';
import { ScheduleData, SlotIndex } from '../types/ScheduleManager';
import { 
    assignApplicantToSlot, 
    deleteAssignmentFromSlot 
} from '../utils/assignmentUtils'; // 既存のutilsを利用

// 初期データ定義 (変更なしのため省略可能ですが、文脈維持のため記載)
// ... (INITIAL_APPLICANTS, INITIAL_SIBLINGS, INITIAL_SCHEDULE は以前と同じ)
const INITIAL_APPLICANTS: Applicant[] = [ /* ...以前のデータ... */ ];
const INITIAL_SIBLINGS: Sibling[] = [ /* ...以前のデータ... */ ];
const INITIAL_SCHEDULE: ScheduleData = { 
    rows: ["09:00", "09:15", "14:00"], 
    cols: ["11/30 (日)", "12/01 (月)"],
    assignments: [[null, null], [null, null], [null, null]],
    availability: [['available', 'available'], ['available', 'available'], ['available', 'available']]
};

export const VIEWS = {
    SCHEDULE: 'schedule',
    SETTINGS: 'settings',
    STUDENTS: 'students',
} as const;

export type ViewValues = (typeof VIEWS)[keyof typeof VIEWS];

// --- 型定義 ---

interface DbState {
    applicants: Applicant[];
    siblings: Sibling[];
    scheduleData: ScheduleData;
}

interface UiState {
    currentView: ViewValues;
    selectedSlot: SlotIndex | null;
    selectedApplicantId: string | null;
    draggingApplicantId: string | null;
    draggingSlotIndex: SlotIndex | null;
}

interface AppState {
    // === Group 1: 永続化データ (DB) ===
    db: DbState;

    // === Group 2: 一時的なUI状態 (UI) ===
    ui: UiState;

    // === Actions (操作) ===
    // UI操作
    setCurrentView: (view: ViewValues) => void;
    setSelectedSlot: (slot: SlotIndex | null) => void;
    setSelectedApplicantId: (id: string | null) => void;
    setDraggingApplicantId: (id: string | null) => void;
    setDraggingSlotIndex: (index: SlotIndex | null) => void;

    // データ操作 (Core)
    setScheduleData: (data: ScheduleData) => void;
    saveApplicant: (data: Applicant) => void;
    saveSibling: (data: Sibling) => void;
    saveStudentWithSibling: (values: StudentFormValues) => void;
    deleteApplicant: (id: string) => void;
    deleteSibling: (id: string) => void;
    assignApplicant: (applicantId: string, slot: SlotIndex) => void;
    deleteAssignmentFromSlot: (slot: SlotIndex) => void;
    
    // スケジュール操作
    toggleSlotBlock: (slot: SlotIndex) => void;
    addRow: (time: string) => void;
    addCol: (date: string) => void;
    
    // その他
    resetAll: () => void;
    getFamilyIdByApplicantId: (id: string) => string | undefined;
}

// --- Store実装 ---

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // 1. 初期データ (DB)
            db: {
                applicants: INITIAL_APPLICANTS,
                siblings: INITIAL_SIBLINGS,
                scheduleData: INITIAL_SCHEDULE,
            },

            // 2. 初期状態 (UI)
            ui: {
                currentView: VIEWS.SCHEDULE,
                selectedSlot: null,
                selectedApplicantId: null,
                draggingApplicantId: null,
                draggingSlotIndex: null,
            },

            // --- Actions ---

            // UI Setters (ネストした ui オブジェクトを更新)
            setCurrentView: (view) => set((state) => ({ ui: { ...state.ui, currentView: view } })),
            setSelectedSlot: (slot) => set((state) => ({ ui: { ...state.ui, selectedSlot: slot } })),
            setSelectedApplicantId: (id) => set((state) => ({ ui: { ...state.ui, selectedApplicantId: id } })),
            setDraggingApplicantId: (id) => set((state) => ({ ui: { ...state.ui, draggingApplicantId: id } })),
            setDraggingSlotIndex: (index) => set((state) => ({ ui: { ...state.ui, draggingSlotIndex: index } })),

            // Data Setters (ネストした db オブジェクトを更新)
            setScheduleData: (data) => set((state) => ({ db: { ...state.db, scheduleData: data } })),

            saveApplicant: (data) => {
                const validated = applicantInputSchema.parse(data);
                set((state) => {
                    const isUpdate = !!validated.id;
                    const id = validated.id || `app-${Date.now()}`;
                    const newApplicant = { ...validated, id };
                    
                    const newApplicants = isUpdate
                        ? state.db.applicants.map((a) => (a.id === id ? newApplicant : a))
                        : [...state.db.applicants, newApplicant];

                    return { db: { ...state.db, applicants: newApplicants } };
                });
            },

            saveSibling: (data) => {
                const validated = siblingInputSchema.parse(data);
                set((state) => {
                    const isUpdate = !!validated.id;
                    const id = validated.id || `sib-${Date.now()}`;
                    const newSibling = { ...validated, id };

                    const newSiblings = isUpdate
                        ? state.db.siblings.map((s) => (s.id === id ? newSibling : s))
                        : [...state.db.siblings, newSibling];

                    return { db: { ...state.db, siblings: newSiblings } };
                });
            },

            saveStudentWithSibling: (values) => {
                const validated = studentFormSchema.parse(values);
                const sharedFamilyId = `fam-${Date.now()}`;
                const studentId = `app-${Date.now()}`;

                set((state) => {
                    const newApplicant: Applicant = {
                        id: studentId,
                        first_name: validated.first_name,
                        last_name: validated.last_name,
                        student_id: validated.student_id,
                        family_id: sharedFamilyId,
                        preferred_dates: validated.preferred_dates,
                    };

                    let updatedSiblings = [...state.db.siblings];
                    if (validated.has_sibling && validated.sibling_data) {
                        const newSibling: Sibling = {
                            id: `sib-${Date.now() + 1}`,
                            first_name: validated.sibling_data.first_name,
                            last_name: validated.sibling_data.last_name,
                            grade: validated.sibling_data.grade,
                            class: validated.sibling_data.class,
                            family_id: sharedFamilyId,
                            assigned_slot: validated.sibling_data.assigned_slot,
                        };
                        updatedSiblings.push(newSibling);
                    }

                    return {
                        db: {
                            ...state.db,
                            applicants: [...state.db.applicants, newApplicant],
                            siblings: updatedSiblings,
                        }
                    };
                });
            },

            deleteApplicant: (id) => set((state) => ({
                db: { ...state.db, applicants: state.db.applicants.filter((a) => a.id !== id) }
            })),

            deleteSibling: (id) => set((state) => ({
                db: { ...state.db, siblings: state.db.siblings.filter((s) => s.id !== id) }
            })),

            getFamilyIdByApplicantId: (id) => {
                return get().db.applicants.find((a) => a.id === id)?.family_id;
            },

            // --- スケジュール関連 ---
            // --- 割り当て実行アクション ---
            assignApplicant: (applicantId, slot) => set((state) => {
                const { assignments } = state.db.scheduleData;
                
                // 1. もしその児童が既にどこかに割り当てられていたら、古い場所を消す（移動対応）
                let cleanedAssignments = assignments.map(row => 
                    row.map(cell => cell === applicantId ? null : cell)
                );

                // 2. 新しいスロットに割り当てる
                const newAssignments = assignApplicantToSlot(slot, cleanedAssignments, applicantId);

                return {
                    db: {
                        ...state.db,
                        scheduleData: {
                            ...state.db.scheduleData,
                            assignments: newAssignments
                        }
                    }
                };
            }),

            // --- 割り当て解除アクション ---
            deleteAssignmentFromSlot: (slot) => set((state) => {
                const { assignments } = state.db.scheduleData;
                const newAssignments = deleteAssignmentFromSlot(slot, assignments);

                return {
                    db: {
                        ...state.db,
                        scheduleData: {
                            ...state.db.scheduleData,
                            assignments: newAssignments
                        }
                    }
                };
            }),
            toggleSlotBlock: (slot) => set((state) => {
                const { rowIndex, colIndex } = slot;
                const newAvailability = state.db.scheduleData.availability.map(row => [...row]);
                const currentStatus = newAvailability[rowIndex][colIndex];
                
                newAvailability[rowIndex][colIndex] = 
                    currentStatus === 'admin_blocked' ? 'available' : 'admin_blocked';

                return {
                    db: {
                        ...state.db,
                        scheduleData: { ...state.db.scheduleData, availability: newAvailability }
                    }
                };
            }),

            addRow: (time) => set((state) => {
                const currentData = state.db.scheduleData;
                const newRows = [...currentData.rows, time];
                const colCount = currentData.cols.length;
                return {
                    db: {
                        ...state.db,
                        scheduleData: {
                            ...currentData,
                            rows: newRows,
                            availability: [...currentData.availability, Array(colCount).fill('available')],
                            assignments: [...currentData.assignments, Array(colCount).fill(null)],
                        }
                    }
                };
            }),

            addCol: (date) => set((state) => {
                const currentData = state.db.scheduleData;
                const newCols = [...currentData.cols, date];
                return {
                    db: {
                        ...state.db,
                        scheduleData: {
                            ...currentData,
                            cols: newCols,
                            availability: currentData.availability.map(row => [...row, 'available']),
                            assignments: currentData.assignments.map(row => [...row, null]),
                        }
                    }
                };
            }),

            resetAll: () => set({ 
                db: { applicants: INITIAL_APPLICANTS, siblings: INITIAL_SIBLINGS, scheduleData: INITIAL_SCHEDULE },
                ui: { currentView: VIEWS.SCHEDULE, selectedSlot: null, selectedApplicantId: null, draggingApplicantId: null, draggingSlotIndex: null }
            }),
        }),
        { 
            name: 'student-app-storage',
            // 重要: dbオブジェクトのみを永続化し、uiオブジェクトは保存しない
            partialize: (state) => ({ db: state.db }),
        }
    )
);