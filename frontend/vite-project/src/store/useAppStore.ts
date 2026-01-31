import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { type Applicant, type Sibling, type StudentFormValues, applicantInputSchema, siblingInputSchema, studentFormSchema } from '../types/Students';
import { ScheduleData, SlotIndex } from '../types/ScheduleManager';
import { ConfirmationModalState } from '../types/Modal';
import { 
    assignApplicantToSlot, 
    deleteAssignmentFromSlot 
} from '../utils/assignmentUtils'; // 既存のutilsを利用
import { calculateTimeRange } from '../utils/timeUtils';
import { getInitialAvailability } from '../utils/availabilityUtils';

// 初期データ定義 (変更なしのため省略可能ですが、文脈維持のため記載)
// ... (INITIAL_APPLICANTS, INITIAL_SIBLINGS, INITIAL_SCHEDULE は以前と同じ)
const INITIAL_APPLICANTS: Applicant[] = [
    {
        id: 'app-1',
        first_name: '佐藤',
        last_name: '太郎',
        student_id: '1',
        preferred_dates: ['2025-12-01 09:15 - 09:30', '2025-11-30 14:00 - 14:15'],
        family_id: '1'
    },
    // 山田花子さんは兄弟なし
    {
        id: 'app-2',
        first_name: '山田',        
        last_name: '花子',
        student_id: '2',
        preferred_dates: ['2025-12-01 09:00 - 09:15', '2025-12-01 14:00 - 14:15'],
        family_id: '2'
    },
    {
        id: 'app-3',
        first_name: '田中',
        last_name: '一郎',
        student_id: '3',
        preferred_dates: ['2025-12-01 09:00 - 09:15', '2025-11-30 09:00 - 09:15'],
        family_id: '3'
    },
    // 鈴木美咲さんは希望日程なし
    {
        id: 'app-4',
        first_name: '鈴木',
        last_name: '美咲',
        student_id: '4',
        preferred_dates: [],
        family_id: '4'
    }, 
    {
        id: 'app-5',
        first_name: '王',
        last_name: '貞治',
        student_id: '5',
        preferred_dates: ['2025-12-01 09:15 - 09:30', '2025-11-30 14:00 - 14:15', '2025-11-30 09:15 - 09:30', '2025-11-30 09:00 - 09:15', '2025-12-01 09:00 - 09:15', '2025-12-01 14:00 - 14:15'],
        family_id: '5'
    },    
];

const INITIAL_SIBLINGS: Sibling[] = [
    {
      id: 'sib-1',
      first_name: '佐藤',
      last_name: '次郎',
      grade: '5',
      class: '2',
      family_id: '1',
      assigned_slot: "2025-12-01 09:00 - 09:15",
    },
    {
      id: 'sib-2',
      first_name: '鈴木',
      last_name: 'ひとみ',
      grade: '6',
      class: '2',
      family_id: '4',
      assigned_slot: "2025-12-01 09:00 - 09:15",
    },
    {
      id:'sib-3',
      first_name: '佐藤',
      last_name:'輝明',
      grade: '1',
      class: '2',
      family_id: '1',
      assigned_slot: "2025-11-30 09:00 - 09:15",
    } 
];
const INITIAL_SCHEDULE: ScheduleData = { 
    rows: ["09:00 - 09:15", "09:15 - 09:30", "14:00 - 14:15"], 
    cols: ["2025-11-30", "2025-12-01"],
    assignments: [[null, null], [null, null], [null, null]],
    availability: [['normal', 'normal'], ['normal', 'normal'], ['normal', 'normal']]
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
    interviewDuration: number;
    selectedSlot: SlotIndex | null;
    selectedApplicantId: string | null;
    draggingApplicantId: string | null;
    draggingSlotIndex: SlotIndex | null;
    confirmationModal: ConfirmationModalState;
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
    setInterviewDuration: (duration: number) => void;    
    handleAddColFromPicker: (dateString: string) => void;
    handleAddRowFromTime: (startTime: string) => boolean; 
    handleDeleteCol: (index: number) => void;
    handleDeleteRow: (index: number) => void;
    // その他
    resetAvailability: () => void;
    resetAll: () => void;
    getFamilyIdByApplicantId: (id: string) => string | undefined;
    openConfirmationModal: (config: Omit<ConfirmationModalState, 'isOpen'>) => void;
    closeConfirmationModal: () => void;

    restorePreviousData: () => void;
}

// --- Store実装 ---

export const useAppStore = create<AppState>()(
  devtools(
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
                interviewDuration: 15,
                selectedSlot: null,
                selectedApplicantId: null,
                draggingApplicantId: null,
                draggingSlotIndex: null,
                confirmationModal: {
                    isOpen: false,
                    title: '',
                    message: '',
                    onConfirm: () => {},
                    confirmText: 'OK',
                    cancelText: 'キャンセル',
                },                
            },

            // --- Actions ---
            setInterviewDuration: (duration: number) => 
                set((state) => ({ ui: { ...state.ui, interviewDuration: duration } })),

            // 日付の追加 (Pickerからの値を 12/02 (火) 形式に変換するロジックを想定)
            handleAddColFromPicker: (dateString: string) => set((state) => {
                if (!dateString) return state;
                
                // dateString は "2026-01-01" のまま重複チェック
                if (state.db.scheduleData.cols.includes(dateString)) return state;

                const currentData = state.db.scheduleData;
                return {
                    db: {
                        ...state.db,
                        scheduleData: {
                            ...currentData,
                            cols: [...currentData.cols, dateString], // YYYY-MM-DD で保存
                            availability: currentData.availability.map(row => [...row, 'normal']),
                            assignments: currentData.assignments.map(row => [...row, null]),
                        }
                    }
                };
            }),
            // 2. 時間の追加（行）
            handleAddRowFromTime: (startTime) => {
                let success = false;
                set((state) => {
                    const duration = state.ui.interviewDuration;
                    const timeRange = calculateTimeRange(startTime, duration);
                    if (state.db.scheduleData.rows.includes(timeRange)){
                        success = false;
                        return state;
                    } 

                    const currentData = state.db.scheduleData;
                    const colCount = currentData.cols.length;

                    success = true;
                    return {
                        db: {
                            ...state.db,
                            scheduleData: {
                                ...currentData,
                                rows: [...currentData.rows, timeRange], // 必要ならここで .sort()
                                availability: [...currentData.availability, Array(colCount).fill('normal')],
                                assignments: [...currentData.assignments, Array(colCount).fill(null)],
                            }
                        }
                    };
                })
                return success;
            },

            handleDeleteCol: (index: number) => set((state) => {
                const { cols, availability, assignments } = state.db.scheduleData;
                return {
                db: {
                    ...state.db,
                    scheduleData: {
                    ...state.db.scheduleData,
                    cols: cols.filter((_, i) => i !== index),
                    availability: availability.map(row => row.filter((_, i) => i !== index)),
                    assignments: assignments.map(row => row.filter((_, i) => i !== index)),
                    }
                }
                };
            }),

            handleDeleteRow: (index: number) => set((state) => {
                const { rows, availability, assignments } = state.db.scheduleData;
                return {
                db: {
                    ...state.db,
                    scheduleData: {
                    ...state.db.scheduleData,
                    rows: rows.filter((_, i) => i !== index),
                    availability: availability.filter((_, i) => i !== index),
                    assignments: assignments.filter((_, i) => i !== index),
                    }
                }
                };
            }),
            
            restorePreviousData: () => {
                const saved = localStorage.getItem('student-app-storage');
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved);
                        if (parsed.state && parsed.state.db) {
                            // stateを受け取って db だけを更新するように修正
                            set((state) => ({
                                ...state,
                                db: parsed.state.db
                            }));
                            alert("前回のデータを復元しました。");
                        }
                    } catch (e) {
                        console.error("復元に失敗しました", e);
                    }
                } else {
                    alert("保存されたデータが見つかりません。");
                }
            },
            
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
                    const id = validated.id || `app-${crypto.randomUUID()}`;
                    const family_id = data.family_id || `fam-${crypto.randomUUID()}`;
                    const newApplicant = { 
                        ...validated, 
                        id, 
                        family_id 
                    };                    
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
                    const id = validated.id || `sib-${crypto.randomUUID()}`;
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
                const cleanedAssignments = assignments.map(row => 
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

                newAvailability[rowIndex][colIndex] = currentStatus === 'admin_block' ? 'normal' : 'admin_block';

                return {
                    db: {
                        ...state.db,
                        scheduleData: { ...state.db.scheduleData, availability: newAvailability }
                    }
                };
            }),
            
            resetAvailability: () => set((state) => ({
                db: {
                    ...state.db,
                    scheduleData: {
                        ...state.db.scheduleData,
                        // assignments はそのままに、availability だけを初期化
                        availability: getInitialAvailability(state.db.scheduleData)
                    }
                }
            })),

            resetAll: () => set({ 
                db: { applicants: INITIAL_APPLICANTS, siblings: INITIAL_SIBLINGS, scheduleData: INITIAL_SCHEDULE },
                ui: { 
                    currentView: VIEWS.SCHEDULE,
                    interviewDuration: 15,
                    selectedSlot: null,
                    selectedApplicantId: null,
                    draggingApplicantId: null,
                    draggingSlotIndex: null,
                    confirmationModal: {
                        isOpen: false, title: '', 
                        message: '', onConfirm: () => {}, 
                        confirmText: null, cancelText: null 
                    }
                }
            }),

            // 汎用確認モーダルを開くアクション
            openConfirmationModal: (config: Omit<ConfirmationModalState, 'isOpen'>) => {
                set((state) => ({
                    ui: {
                        ...state.ui,
                        confirmationModal: {
                            ...state.ui.confirmationModal,
                            ...config,
                            isOpen: true,
                        }
                    }
                }));
            },

            closeConfirmationModal: () => {
                set((state) => ({
                    ui: {
                        ...state.ui,
                        confirmationModal: { ...state.ui.confirmationModal, isOpen: false }
                    }
                }));
            },
        }),
        { 
            name: 'student-app-storage',
            // 重要: dbオブジェクトのみを永続化し、uiオブジェクトは保存しない
            partialize: (state) => ({ db: state.db }),
            skipHydration: true,
        }
    )
  )
);