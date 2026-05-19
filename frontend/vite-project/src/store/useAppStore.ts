// src/store/useAppStore.ts
import { create } from "zustand";
import { createJSONStorage, persist, devtools } from "zustand/middleware";
import { secureStorage } from '../utils/secureStorage';
import { nanoid } from "nanoid";
import {
  type Applicant,
  type Sibling,
  type StudentFormValues,
  applicantInputSchema,
  siblingInputSchema,
  studentFormSchema,
} from "../types/Students";
import { SchoolSettings, DEFAULT_SCHOOL_SETTINGS } from "../types/BulkConfig";
import { ScheduleData, SlotIndex } from "../types/ScheduleManager";
import {
  ConfirmationModalState,
  ImportStudentModalState,
} from "../types/Modal";
import {
  assignApplicantToSlot,
  deleteAssignmentFromSlot,
} from "../utils/assignmentUtils";
import { generateShortToken } from "../utils/tokenUtils";
import { calculateTimeRange } from "../utils/timeUtils";
import { getInitialAvailability } from "../utils/availabilityUtils";
import { AutoAssignmentResult } from "../utils/autoAssignment";
import { DEMO_APPLICANTS, DEMO_SCHEDULE, DEMO_SIBLINGS } from "../utils/demoData";

// 初期データ定義 (変更なしのため省略可能ですが、文脈維持のため記載)
// ... (INITIAL_APPLICANTS, INITIAL_SIBLINGS, INITIAL_SCHEDULE は以前と同じ)

// 新しく始める（リセット）用の完全にクリーンなデータ
const BLANK_APPLICANTS: Applicant[] = [];
const BLANK_SIBLINGS: Sibling[] = [];
const BLANK_SCHEDULE: ScheduleData = {
  rows: [],         // 行（時間枠）はゼロ
  cols: [],         // 列（日付）はゼロ
  assignments: [],  // 割り当てデータもゼロ
  availability: [], // 枠の有効/無効データもゼロ
};

export type AppStepId = 'step1' | 'step2' | 'step3' | 'step4' | 'step5';
export type Step3Mode = 'form' | 'manual' | null;

// --- 型定義 ---
export interface AutoAssignmentConfig {
  sibling_slot_gap: number;
}
const DEFAULT_AUTO_ASSIGNMENT_CONFIG: AutoAssignmentConfig = {
  sibling_slot_gap: 2, // 初期値（前後2枠まで許可）
};

interface DbState {
  applicants: Applicant[];
  siblings: Sibling[];
  scheduleData: ScheduleData;
  schoolSettings: SchoolSettings;
  workspaceId?: string;
  secretKey?: string; // ★追加: 真の暗号化キー
  step3Mode: Step3Mode;
  autoAssignmentConfig: AutoAssignmentConfig;
}

interface UiState {
  hasEntered: boolean;
  interviewDuration: number;
  selectedSlot: SlotIndex | null;
  selectedApplicantId: string | null;
  draggingApplicantId: string | null;
  draggingSlotIndex: SlotIndex | null;
  confirmationModal: ConfirmationModalState;
  importStudentModal: ImportStudentModalState;
  isBulkSetupOpen: boolean;
  isAllocationConfigOpen: boolean;
  autoAssignConfirmModal: {
    isOpen: boolean;
    result: AutoAssignmentResult | null;
  };
  isTermsModalOpen: boolean;
  isPrivacyModalOpen: boolean;
  isReleaseNotesModalOpen: boolean;
  isStartupAdModalOpen: boolean;
}

interface AppState {
  // === Group 1: 永続化データ (DB) ===
  db: DbState;

  // === Group 2: 一時的なUI状態 (UI) ===
  ui: UiState;

  // === Actions (操作) ===
  // UI操作
  setHasEntered: (val: boolean) => void;
  resetEnteredState: () => void;
  setStep3Mode: (mode: Step3Mode) => void;
  setSelectedSlot: (slot: SlotIndex | null) => void;
  setSelectedApplicantId: (id: string | null) => void;
  setDraggingApplicantId: (id: string | null) => void;
  setDraggingSlotIndex: (index: SlotIndex | null) => void;

  //デモデータ送信
  loadDemoData: () => void;

  // データ操作 (Core)
  setScheduleData: (data: ScheduleData) => void;
  saveApplicant: (data: Applicant) => void;
  saveSibling: (data: Sibling) => void;
  saveStudentWithSibling: (values: StudentFormValues) => void;
  deleteApplicant: (id: string) => void;
  deleteSibling: (id: string) => void;
  assignApplicant: (applicantId: string, slot: SlotIndex) => void;
  deleteAssignmentFromSlot: (slot: SlotIndex) => void;
  bulkSaveApplicants: (newApplicants: Applicant[]) => void;
  importApplicants: (
    newStudentsData: Omit<
      Applicant,
      "id" | "token" | "preferred_dates" | "siblings" | "family_id"
    >[],
  ) => void;

  // スケジュール操作
  toggleSlotBlock: (slot: SlotIndex) => void;
  setInterviewDuration: (duration: number) => void;
  handleAddColFromPicker: (dateString: string) => void;
  handleAddRowFromTime: (startTime: string) => boolean;
  handleDeleteCol: (dateString: string) => void;
  handleDeleteRow: (timeString: string) => void;  // その他
  resetAvailability: () => void;
  resetAll: () => void;
  getFamilyIdByApplicantId: (id: string) => string | undefined;

  //モーダルオープン
  openConfirmationModal: (
    config: Omit<ConfirmationModalState, "isOpen">,
  ) => void;
  closeConfirmationModal: () => void;
  setImportStudentModalOpen: (isOpen: boolean) => void;
  setAutoAssignConfirmModalOpen: (
    isOpen: boolean,
    result?: AutoAssignmentResult | null,
  ) => void;
  setTermsModalOpen: (isOpen: boolean) => void;
  setPrivacyModalOpen: (isOpen: boolean) => void;
  setReleaseNotesModalOpen: (isOpen: boolean) => void;
  setStartupAdModalOpen: (isOpen: boolean) => void;

  //応用設定画面
  setBulkSetupOpen: (isOpen: boolean) => void;
  setAllocationConfigOpen: (isOpen: boolean) => void;

  //自動割当で、最終的に許可された日程をzustandに登録
  applyAutoAssignmentResult: (result: AutoAssignmentResult) => void;
  
  //応用設定画面の内容を反映
  setAutoAssignmentConfig: (config: AutoAssignmentConfig) => void;
  setSchoolSettings: (settings: SchoolSettings) => void;
  setWorkspaceId: (id: string) => void;
  setSecretKey: (key: string) => void; // ★追加
  // restorePreviousData: () => void;

  //リリース前に削除
  clearAllAssignments: () => void;
}

// --- Store実装 ---

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // 1. 初期データ (DB)
        db: {
          applicants: DEMO_APPLICANTS,
          siblings: DEMO_SIBLINGS,
          scheduleData: DEMO_SCHEDULE,
          schoolSettings: DEFAULT_SCHOOL_SETTINGS,
          workspaceId: nanoid(),
          secretKey: nanoid(12), // ★追加: 初期化時に12桁のランダムキーを生成
          step3Mode: null,      
          autoAssignmentConfig: DEFAULT_AUTO_ASSIGNMENT_CONFIG,
        },

        setSchoolSettings: (settings) =>
          set((state) => ({
            db: { ...state.db, schoolSettings: settings },
          })),
        setWorkspaceId: (id) =>
          set((state) => ({
            db: { ...state.db, workspaceId: id },
          })),
        setSecretKey: (key) => set((state) => ({ db: { ...state.db, secretKey: key } })),
        setStep3Mode: (mode) => set((state) => ({ db: { ...state.db, step3Mode: mode } })),         // ★追加
        setAutoAssignmentConfig: (config) =>
          set((state) => ({
            db: { ...state.db, autoAssignmentConfig: config },
          })),

        // 2. 初期状態 (UI)
        ui: {
          hasEntered: false,
          interviewDuration: 15,
          selectedSlot: null,
          selectedApplicantId: null,
          draggingApplicantId: null,
          draggingSlotIndex: null,
          confirmationModal: {
            isOpen: false,
            title: "",
            message: "",
            onConfirm: () => {},
            confirmText: "OK",
            cancelText: "キャンセル",
          },
          importStudentModal: { isOpen: false },
          isBulkSetupOpen: false,
          isAllocationConfigOpen: false,
          autoAssignConfirmModal: { isOpen: false, result: null },
          isTermsModalOpen: false,
          isPrivacyModalOpen: false,
          isReleaseNotesModalOpen: false,
          isStartupAdModalOpen: false
        },
        
        setHasEntered: (val: boolean) => set((state) => ({
          ui: { ...state.ui, hasEntered: val }
        })),
        
        resetEnteredState: () => set((state) => ({ ui: { ...state.ui, hasEntered: false } })),

        // --- Actions ---
        loadDemoData: () =>
          set({
            db: {
              workspaceId: nanoid(),
              secretKey: nanoid(12),
              applicants: DEMO_APPLICANTS,
              siblings: DEMO_SIBLINGS,
              scheduleData: DEMO_SCHEDULE,
              schoolSettings: DEFAULT_SCHOOL_SETTINGS,
              step3Mode: null,
              autoAssignmentConfig: DEFAULT_AUTO_ASSIGNMENT_CONFIG,
            },
            ui: {
              // ... uiの初期値はresetAllと同じでOK ...
              hasEntered: false,
              interviewDuration: 15,
              selectedSlot: null,
              selectedApplicantId: null,
              draggingApplicantId: null,
              draggingSlotIndex: null,
              confirmationModal: { isOpen: false, title: "", message: "", onConfirm: () => {}, confirmText: null, cancelText: null },
              importStudentModal: { isOpen: false },
              isBulkSetupOpen: false,
              isAllocationConfigOpen: false,
              autoAssignConfirmModal: { isOpen: false, result: null },
              isTermsModalOpen: false,
              isPrivacyModalOpen: false,
              isReleaseNotesModalOpen: false,
              isStartupAdModalOpen: false,
            },
          }),

        setInterviewDuration: (duration: number) =>
          set((state) => ({
            ui: { ...state.ui, interviewDuration: duration },
          })),

        // 日付の追加 (Pickerからの値を 12/02 (火) 形式に変換するロジックを想定)
        handleAddColFromPicker: (dateString: string) =>
          set((state) => {
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
                  availability: currentData.availability.map((row) => [
                    ...row,
                    "normal",
                  ]),
                  assignments: currentData.assignments.map((row) => [
                    ...row,
                    null,
                  ]),
                },
              },
            };
          }),
        // 2. 時間の追加（行）
        handleAddRowFromTime: (startTime) => {
          let success = false;
          set((state) => {
            const duration = state.ui.interviewDuration;
            const timeRange = calculateTimeRange(startTime, duration);
            if (state.db.scheduleData.rows.includes(timeRange)) {
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
                  availability: [
                    ...currentData.availability,
                    Array(colCount).fill("normal"),
                  ],
                  assignments: [
                    ...currentData.assignments,
                    Array(colCount).fill(null),
                  ],
                },
              },
            };
          });
          return success;
        },

        handleDeleteCol: (targetCol: string) =>
          set((state) => {
            const { cols, availability, assignments } = state.db.scheduleData;
            // ★ 受け取った値から、元データ内の本当のインデックスを探す
            const index = cols.indexOf(targetCol);
            if (index === -1) return state;

            return {
              db: {
                ...state.db,
                scheduleData: {
                  ...state.db.scheduleData,
                  cols: cols.filter((_, i) => i !== index),
                  availability: availability.map((row) =>
                    row.filter((_, i) => i !== index),
                  ),
                  assignments: assignments.map((row) =>
                    row.filter((_, i) => i !== index),
                  ),
                },
              },
            };
          }),

        handleDeleteRow: (targetRow: string) =>
          set((state) => {
            const { rows, availability, assignments } = state.db.scheduleData;
            // ★ 受け取った値から、元データ内の本当のインデックスを探す
            const index = rows.indexOf(targetRow);
            if (index === -1) return state;

            return {
              db: {
                ...state.db,
                scheduleData: {
                  ...state.db.scheduleData,
                  rows: rows.filter((_, i) => i !== index),
                  availability: availability.filter((_, i) => i !== index),
                  assignments: assignments.filter((_, i) => i !== index),
                },
              },
            };
          }),

        // restorePreviousData: () => {
        //   const saved = localStorage.getItem("student-app-storage");
        //   if (saved) {
        //     try {
        //       const parsed = JSON.parse(saved);
        //       if (parsed.state && parsed.state.db) {
        //         // stateを受け取って db だけを更新するように修正
        //         set((state) => ({
        //           ...state,
        //           db: parsed.state.db,
        //         }));
        //         alert("前回のデータを復元しました。");
        //       }
        //     } catch (e) {
        //       console.error("復元に失敗しました", e);
        //     }
        //   } else {
        //     alert("保存されたデータが見つかりません。");
        //   }
        // },

        // UI Setters (ネストした ui オブジェクトを更新)
        setSelectedSlot: (slot) =>
          set((state) => ({ ui: { ...state.ui, selectedSlot: slot } })),
        setSelectedApplicantId: (id) =>
          set((state) => ({ ui: { ...state.ui, selectedApplicantId: id } })),
        setDraggingApplicantId: (id) =>
          set((state) => ({ ui: { ...state.ui, draggingApplicantId: id } })),
        setDraggingSlotIndex: (index) =>
          set((state) => ({ ui: { ...state.ui, draggingSlotIndex: index } })),

        // Data Setters (ネストした db オブジェクトを更新)
        setScheduleData: (data) =>
          set((state) => ({ db: { ...state.db, scheduleData: data } })),

        saveApplicant: (data) => {
          const validated = applicantInputSchema.parse(data);
          set((state) => {
            const isUpdate = !!validated.id;
            const id = validated.id || `app-${crypto.randomUUID()}`;
            const family_id = data.family_id || `fam-${crypto.randomUUID()}`;
            const newApplicant = {
              ...validated,
              id,
              family_id,
              token: validated.token || generateShortToken(6),
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
              family_name: validated.family_name,
              first_name: validated.first_name,
              student_id: validated.student_id,
              family_id: sharedFamilyId,
              preferred_dates: validated.preferred_dates,
              is_fixed: validated.is_fixed,
              is_last_slot: validated.is_last_slot,
              needs_gap_after: validated.needs_gap_after,
            };

            let updatedSiblings = [...state.db.siblings];
            if (validated.has_sibling && validated.sibling_data) {
              const newSibling: Sibling = {
                id: `sib-${Date.now() + 1}`,
                family_name: validated.sibling_data.family_name,
                first_name: validated.sibling_data.first_name,
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
              },
            };
          });
        },

        deleteApplicant: (id) =>
          set((state) => ({
            db: {
              ...state.db,
              applicants: state.db.applicants.filter((a) => a.id !== id),
            },
          })),

        deleteSibling: (id) =>
          set((state) => ({
            db: {
              ...state.db,
              siblings: state.db.siblings.filter((s) => s.id !== id),
            },
          })),

        getFamilyIdByApplicantId: (id) => {
          return get().db.applicants.find((a) => a.id === id)?.family_id;
        },

        /**
         * 一括保存用のロジック
         */
        bulkSaveApplicants: (newApplicantsData) => {
          set((state) => {
            // 現在のリストをコピー
            const currentApplicants = [...state.db.applicants];

            newApplicantsData.forEach((input) => {
              // インポートデータも念のためZustand保存前にバリデーション
              const validated = applicantInputSchema.parse(input);

              // 出席番号(student_id)をキーに既存重複をチェック
              const existingIndex = currentApplicants.findIndex(
                (a) => a.student_id === validated.student_id,
              );

              const studentToSave: Applicant = {
                ...validated,
                id: validated.id || `app-${crypto.randomUUID()}`,
                family_id: validated.family_id || `fam-${crypto.randomUUID()}`,
                token: validated.token || generateShortToken(6),
              };

              if (existingIndex !== -1) {
                // 重複があれば上書き（必要に応じて既存の希望日を維持するロジックに変更可能）
                currentApplicants[existingIndex] = studentToSave;
              } else {
                // 新規なら追加
                currentApplicants.push(studentToSave);
              }
            });

            return { db: { ...state.db, applicants: currentApplicants } };
          });
        },

        importApplicants: (newStudentsData) =>
          set((state) => {
            const currentApplicants = state.db.applicants;

            const mergedApplicants = newStudentsData.map((input) => {
              // 既存リストから「出席番号」と「氏名」が完全一致する人を探す
              const existing = currentApplicants.find(
                (a) =>
                  a.student_id === input.student_id &&
                  a.family_name === input.family_name &&
                  a.first_name === input.first_name,
              );

              if (existing) {
                // 【重要】一致する人がいたら、IDとトークン、既存の予約情報などを引き継ぐ
                return {
                  ...input, // 新しい入力データ（修正があるかもしれないのでベースにする）
                  id: existing.id, // ID維持（これが変わると予約が切れる）
                  token: existing.token, // トークン維持（これが変わるとログインできなくなる）
                  preferred_dates: existing.preferred_dates, // 予約データ維持
                  family_id: existing.family_id, // 家族ID維持
                } as Applicant;
              } else {
                // 一致しない（完全な新規生徒）なら、新しくIDとトークンを発行
                return {
                  ...input,
                  id: nanoid(),
                  token: generateShortToken(), // 新規発行
                  preferred_dates: [],
                  siblings: [],
                  family_id: nanoid(),
                } as Applicant;
              }
            });

            return {
              db: {
                ...state.db,
                applicants: mergedApplicants,
              },
            };
          }),

        // --- スケジュール関連 ---
        // --- 割り当て実行アクション ---
        assignApplicant: (applicantId, slot) =>
          set((state) => {
            const { assignments } = state.db.scheduleData;

            // 1. もしその児童が既にどこかに割り当てられていたら、古い場所を消す（移動対応）
            const cleanedAssignments = assignments.map((row) =>
              row.map((cell) => (cell === applicantId ? null : cell)),
            );

            // 2. 新しいスロットに割り当てる
            const newAssignments = assignApplicantToSlot(
              slot,
              cleanedAssignments,
              applicantId,
            );

            return {
              db: {
                ...state.db,
                scheduleData: {
                  ...state.db.scheduleData,
                  assignments: newAssignments,
                },
              },
            };
          }),

        // --- 割り当て解除アクション ---
        deleteAssignmentFromSlot: (slot) =>
          set((state) => {
            const { assignments } = state.db.scheduleData;
            const newAssignments = deleteAssignmentFromSlot(slot, assignments);

            return {
              db: {
                ...state.db,
                scheduleData: {
                  ...state.db.scheduleData,
                  assignments: newAssignments,
                },
              },
            };
          }),
        toggleSlotBlock: (slot) =>
          set((state) => {
            const { rowIndex, colIndex } = slot;
            const newAvailability = state.db.scheduleData.availability.map(
              (row) => [...row],
            );
            const currentStatus = newAvailability[rowIndex][colIndex];

            newAvailability[rowIndex][colIndex] =
              currentStatus === "admin_block" ? "normal" : "admin_block";

            return {
              db: {
                ...state.db,
                scheduleData: {
                  ...state.db.scheduleData,
                  availability: newAvailability,
                },
              },
            };
          }),

        resetAvailability: () =>
          set((state) => ({
            db: {
              ...state.db,
              scheduleData: {
                ...state.db.scheduleData,
                // assignments はそのままに、availability だけを初期化
                availability: getInitialAvailability(state.db.scheduleData),
              },
            },
          })),

        // ★追加 1: モーダルの開閉状態とシミュレーション結果を保持するState
        autoAssignConfirmModal: { isOpen: false, result: null },

        setAutoAssignConfirmModalOpen: (isOpen, result = null) =>
          set((state) => ({
            ui: { ...state.ui, autoAssignConfirmModal: { isOpen, result } },
          })),
        
        setTermsModalOpen: (isOpen) =>
          set((state) => ({ ui: { ...state.ui, isTermsModalOpen: isOpen } })),
        setPrivacyModalOpen: (isOpen) =>
          set((state) => ({ ui: { ...state.ui, isPrivacyModalOpen: isOpen } })),
        setReleaseNotesModalOpen: (isOpen) =>
          set((state) => ({ ui: { ...state.ui, isReleaseNotesModalOpen: isOpen } })),
        setStartupAdModalOpen: (isOpen) =>
          set((state) => ({ ui: { ...state.ui, isStartupAdModalOpen: isOpen } })),

        applyAutoAssignmentResult: (result) =>
          set((state) => ({
            db: {
              ...state.db,
              scheduleData: {
                ...state.db.scheduleData,
                assignments: result.assignments,
                availability: result.availability,
              },
            },
          })),

        resetAll: () =>
          set({
            db: {
              workspaceId: nanoid(),
              secretKey: nanoid(12), // ★追加
              applicants: BLANK_APPLICANTS,
              siblings: BLANK_SIBLINGS,
              scheduleData: BLANK_SCHEDULE,
              schoolSettings: DEFAULT_SCHOOL_SETTINGS,
              step3Mode: null,
              autoAssignmentConfig: DEFAULT_AUTO_ASSIGNMENT_CONFIG,
            },
            ui: {
              hasEntered: false,
              interviewDuration: 15,
              selectedSlot: null,
              selectedApplicantId: null,
              draggingApplicantId: null,
              draggingSlotIndex: null,
              confirmationModal: {
                isOpen: false,
                title: "",
                message: "",
                onConfirm: () => {},
                confirmText: null,
                cancelText: null,
              },
              importStudentModal: { isOpen: false },
              isBulkSetupOpen: false,
              isAllocationConfigOpen: false,
              autoAssignConfirmModal: { isOpen: false, result: null },
              isTermsModalOpen: false,
              isPrivacyModalOpen: false,
              isReleaseNotesModalOpen: false,
              isStartupAdModalOpen: false,
            },
          }),

        // 汎用確認モーダルを開くアクション
        openConfirmationModal: (
          config: Omit<ConfirmationModalState, "isOpen">,
        ) => {
          set((state) => ({
            ui: {
              ...state.ui,
              confirmationModal: {
                ...state.ui.confirmationModal,
                ...config,
                isOpen: true,
              },
            },
          }));
        },

        closeConfirmationModal: () => {
          set((state) => ({
            ui: {
              ...state.ui,
              confirmationModal: {
                ...state.ui.confirmationModal,
                isOpen: false,
              },
            },
          }));
        },

        setImportStudentModalOpen: (isOpen) =>
          set((state) => ({
            ui: {
              ...state.ui,
              importStudentModal: {
                ...state.ui.importStudentModal,
                isOpen: isOpen,
              },
            },
          })),

        setBulkSetupOpen: (isOpen) =>
          set((state) => ({ ui: { ...state.ui, isBulkSetupOpen: isOpen } })),

        setAllocationConfigOpen: (isOpen) =>
          set((state) => ({
            ui: { ...state.ui, isAllocationConfigOpen: isOpen },
          })),

        clearAllAssignments: () =>
          set((state) => {
            const { assignments } = state.db.scheduleData;
            // assignmentsの2次元配列をすべて null で埋め尽くす
            const clearedAssignments = assignments.map((row) =>
              row.map(() => null),
            );

            return {
              db: {
                ...state.db,
                scheduleData: {
                  ...state.db.scheduleData,
                  assignments: clearedAssignments,
                },
              },
            };
          }),
      }),
      {
        name: "student-app-storage",
        storage: createJSONStorage(() => secureStorage),
        // 重要: dbオブジェクトのみを永続化し、uiオブジェクトは保存しない
        partialize: (state) => ({ db: state.db }),
        skipHydration: true,
        merge: (persistedState: unknown, currentState: AppState): AppState => {
          // 型の安全なチェック
          const ps = persistedState as { db?: Partial<typeof currentState.db> } | undefined;
          
          // 保存データがない場合は、現在の状態（初期値）をそのまま返す
          if (!ps || !ps.db) return currentState;

          // 保存データとデフォルト値をディープマージ（合体）する
          return {
            ...currentState,
            db: {
              ...currentState.db,
              ...ps.db,
              
              // 1. スケジュールデータ（availabilityが消えるのを防ぐ）
              scheduleData: {
                ...currentState.db.scheduleData,
                ...(ps.db.scheduleData || {}),
              },
              
              // 2. 学校設定（お便りが白紙になるのを防ぐ）
              schoolSettings: {
                ...currentState.db.schoolSettings,
                ...(ps.db.schoolSettings || {}),
              },
              
              // 3. 自動割当設定（エラー防止）
              autoAssignmentConfig: {
                ...currentState.db.autoAssignmentConfig,
                ...(ps.db.autoAssignmentConfig || {}),
              }
            },
          };
        },
      },
    ),
    { enabled: process.env.NODE_ENV !== 'production' }
  ),
);