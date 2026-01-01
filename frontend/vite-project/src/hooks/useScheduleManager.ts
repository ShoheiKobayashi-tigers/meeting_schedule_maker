import { useState, useMemo, useCallback } from 'react';
import { calculateTimeRange, getNextStartTime } from '../utils/timeUtils';
import { sortTimeRows, sortDateCols } from '../utils/sortUtils';
import { parseSlotId, createSlotId } from '../utils/slotUtils';
import { assignApplicantToSlot, deleteAssignmentFromSlot } from '../utils/assignmentUtils';
import { calculateSlotAvailabilityById, calculateSlotAvailabilityByIndex, getInitialAvailability, isPreferred } from '../utils/availabilityUtils';
import { getCurrentAssignment, getApplicantById } from '../utils/applicantUtils';
import { useManagerStyles } from '../styles/managerStyles';
import { Applicant, ApplicantWithStatus, ApplicantFormValues } from '../types/Applicant';
import { StudentDetailsModalState, UpsertStudentModalState, ConfirmationModalState } from '../types/Modal';
import { number } from 'zod';
import { ScheduleData, SlotIndex } from '../types/ScheduleManager';

const useScheduleManager = (initialApplicants: Applicant[]) => {
    const [applicants, setApplicants] = useState<Applicant[]>(initialApplicants);
    const [interviewDuration, setInterviewDuration] = useState<number>(15);
    const DURATION_OPTIONS = [5, 10, 15, 20, 30, 45, 60];

    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
    const [selectedStartTime, setSelectedStartTime] = useState<string>('09:00');

    const [draggingApplicantId, setDraggingApplicantId] = useState<string | null>(null);
    const [draggingSlotIndex, setDraggingSlotIndex] = useState<SlotIndex | null>(null);
    const [isAddButtonActive, setIsAddButtonActive] = useState<boolean>(false);
    const [hoveredCellId, setHoveredCellId] = useState<string | null>(null);

    const [selectedSlot, setSelectedSlot] = useState<SlotIndex | null>(null);
    const { styles, getSlotStyle } = useManagerStyles({
            isAddButtonActive,
            hoveredCellId,
            selectedSlot,
        });

    // クリックで選択された児童のIDを保持する状態
    const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);

    // 確認モーダル
    const [confirmModalState, setConfirmModalState] = useState<ConfirmationModalState>({
        isOpen: false, title: '', message: '', onConfirm: () => {}, confirmText: null, cancelText: null
    });

    // 児童（生徒）詳細モーダルの状態
    const [studentDetailsModalState, setStudentDetailsModalState] = useState<StudentDetailsModalState>({
        isOpen: false,
        student: null, // 表示対象の児童（生徒）オブジェクト
    });

    // 児童（生徒）追加/編集モーダルの状態
    const [upsertStudentModalState, setUpsertStudentModalState] = 
        useState<UpsertStudentModalState>(
            {
                isOpen: false,
                // プロパティ名を student に修正（Modal.tsの定義に合わせる）
                student: null, 
                mode: 'add',
            }
        );
    // ------------------------------------------
    const TIME_OPTIONS = useMemo<string[]>(() => {
        const times = [];
        for (let h = 9; h <= 17; h++) {
            for (let m = 0; m < 60; m += interviewDuration) {
                if (h === 17 && m > 0) continue;
                times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
            }
        }
        return times;
    }, [interviewDuration]);

    const [scheduleData, setScheduleData] = useState<ScheduleData>(() => {
        const initialRows = sortTimeRows([calculateTimeRange('09:00', 15), calculateTimeRange('09:15', 15), calculateTimeRange('14:00', 15)]);
        const initialCols = sortDateCols(['12/01 (月)', '11/30 (日)']);

        const initialAssignments = Array(initialRows.length).fill(null).map(() => Array(initialCols.length).fill(null));
        initialAssignments[0][1] = 'app-2';

        const initialAvailability = Array(initialRows.length).fill('available').map(() => Array(initialCols.length).fill('available'));

        return {
            rows: initialRows,
            cols: initialCols,
            assignments: initialAssignments,
            availability: initialAvailability,
        };
    });

    // 全面談面談枠のリストを生成
    const allScheduleSlots = useMemo<string[]>(() => {
        const slots = [];
        // スケジュールボードと同じソート順で日時を結合
        const sortedCols = sortDateCols(scheduleData.cols);
        const sortedRows = sortTimeRows(scheduleData.rows);

        for (const date of sortedCols) {
            for (const time of sortedRows) {
                slots.push(`${date} ${time}`);
            }
        }
        return slots;
    }, [scheduleData.cols, scheduleData.rows]);

    const unBlockedSlots = useMemo<string[]>(() => {
        const slots = [];
        const sortedCols = sortDateCols(scheduleData.cols);
        const sortedRows = sortTimeRows(scheduleData.rows);

        // 二重ループでマトリックスを走査
        for (let colIndex = 0; colIndex < sortedCols.length; colIndex++) {
            const date = sortedCols[colIndex];

            for (let rowIndex = 0; rowIndex < sortedRows.length; rowIndex++) {
                const time = sortedRows[rowIndex];

                // 該当セルの availability 状態を取得
                const availabilityStatus = scheduleData.availability[rowIndex][colIndex];

                // availabilityStatus が 'admin_block' でない場合のみリストに追加
                // (利用可能状態、または他の利用不可理由だがadmin_blockではない状態も含む)
                if (availabilityStatus !== 'admin_block') {
                    slots.push(`${date} ${time}`);
                }
            }
        }
        return slots;
    }, [scheduleData.cols, scheduleData.rows, scheduleData.availability]);

    const processedApplicants = useMemo((): ApplicantWithStatus[] => {
        // 選択スロットの処理
        const activeSlotIndex = selectedSlot ??  draggingSlotIndex;

        // ドラッグ元のスロット処理
        const activeSlotName = activeSlotIndex
            ? `${scheduleData.cols[activeSlotIndex.colIndex]} ${scheduleData.rows[activeSlotIndex.rowIndex]}`
            : null;


        // 【判定処理】applicants 配列をループし、Setで高速チェック
        return applicants.map(applicant => {
            const currentAssignment = getCurrentAssignment(applicant.id, scheduleData);

            // 動的フラグA: 選択スロットを希望しているか？
            const isAvailable: boolean = activeSlotName
                ? isPreferred(applicant, activeSlotName)
                : true;

            return {
                ...applicant,
                currentAssignment: currentAssignment,
                isAvailable: isAvailable
            };
        });
    }, [applicants, scheduleData.assignments, scheduleData.cols, scheduleData.rows, selectedSlot, draggingSlotIndex, hoveredCellId]);

    // --- 児童（生徒）詳細モーダル関連関数 (変更なし) ---
    const openStudentDetailsModal = useCallback((student: Applicant) => {
        setStudentDetailsModalState({
            isOpen: true,
            student: student,
        });
    }, []);

    const closeStudentDetailsModal = useCallback(() => {
        setStudentDetailsModalState({
            isOpen: false,
            student: null,
        });
    }, []);
    // ------------------------------------------

    //  児童（生徒）追加/編集モーダル関連関数
    const openAddStudentModal = useCallback(() => {
        setUpsertStudentModalState({ 
            isOpen: true, 
            student: null, // null の代入ももちろん OK
            mode: 'add' 
        });
    }, []);
    // 既存の児童（生徒）を編集するためのモーダルを開く
    const openEditStudentModal = useCallback((student: Applicant) => {
        setUpsertStudentModalState({ 
            isOpen: true, 
            student: student, // Applicant | null の Union 型が許容されるようになる
            mode: 'edit'      // stateが mode プロパティを持つため、呼び出し時にも mode を含める必要があります
        });
    }, []);

    const closeUpsertStudentModal = useCallback(() => {
        setUpsertStudentModalState({
            isOpen: false,
            student: null,
            mode: 'add',
        });
    }, []);

    // 引数の型をインターフェースに合わせて ApplicantFormValues に変更
    const handleSaveStudent = useCallback((studentData: ApplicantFormValues): Applicant => {
        
        // 1. Applicant 型に必要なプロパティのみを抽出・整形
        const saveData: Applicant = {
            ...studentData, // 既存のプロパティをコピー
            id: studentData.id, 
            name: studentData.name.trim(),
            // Applicant型は student_id: string なので、nullではなく空文字にするか型定義を修正する
            student_id: studentData.student_id?.trim() || "", 
            preferred_dates: studentData.preferred_dates || [],
            family_id: studentData.family_id || "",
        };

        if (saveData.id) {
            // 編集ロジック
            setApplicants(prev => prev.map(s => s.id === saveData.id ? saveData : s));
            return saveData;
        } else {
            // 新規追加ロジック
            const newId = `app-${Date.now()}`;
            const newFamilyId = saveData.family_id || newId.replace('app-', 'fam-');
            const newStudent: Applicant = {
                ...saveData,
                id: newId,
                // student_id が未入力の場合は新規IDを割り当てる
                student_id: saveData.student_id || `NEW-${applicants.length + 1}`,
                family_id: newFamilyId,
            };
            setApplicants(prev => [...prev, newStudent]);
            return newStudent;
        }
    }, [applicants]);

    // --- 児童（生徒）情報の削除処理 (変更なし) ---
    const handleDeleteStudent = useCallback((studentId: string) => {
        // 児童（生徒）リストから削除
        setApplicants(prev => prev.filter(s => s.id !== studentId));

        // スケジュールからも削除（割り当て解除）
        setScheduleData(prevData => {
            const newAssignments = prevData.assignments.map(row =>
                row.map(slot => (slot && slot === studentId) ? null : slot)
            );
            return { ...prevData, assignments: newAssignments };
        });
        setConfirmModalState({ isOpen: false, title: '', message: '', onConfirm: () => {}, confirmText: null, cancelText: null });
    }, []);

    const confirmDeleteStudent = useCallback((student: Applicant) => {
        const isAssigned: boolean = getCurrentAssignment(student.id, scheduleData) !== undefined;

        setConfirmModalState({
            isOpen: true,
            title: '児童（生徒）の削除確認',
            message: isAssigned
                ? `「${student.name}」さんは現在スケジュールに割り当てられています。データ削除を実行すると、割り当ても自動で削除されます。`
                : `「${student.name}」さんをデータから削除しますか？`,
            onConfirm: () => handleDeleteStudent(student.id), 
            confirmText: '削除',
            cancelText: 'キャンセル'
        });
    }, [scheduleData.assignments, handleDeleteStudent]);
    
    /*
    ---------------------------------------------------------------
    行・列の追加削除ブロック
    ---------------------------------------------------------------
    */
    // --- I. 内部アクション (直接Stateを操作するプライベート関数) ---
    /**
     * 行の削除を実際に実行する
     */
    const performRowDeletion = useCallback((rowIndex: number) => {
        setScheduleData(prevData => {
            const newOriginalRows = prevData.rows.filter((_, i) => i !== rowIndex);
            const newAssignments = prevData.assignments.filter((_, i) => i !== rowIndex);
            const newAvailability = prevData.availability.filter((_, i) => i !== rowIndex);

            const sortedNewRows = sortTimeRows(newOriginalRows);
            const nextStart = getNextStartTime(sortedNewRows, '09:00');
            setSelectedStartTime(nextStart);

            return {
                ...prevData,
                rows: sortedNewRows,
                assignments: newAssignments,
                availability: newAvailability,
            };
        });
        setConfirmModalState(prev => ({ ...prev, isOpen: false }));
    }, [setSelectedStartTime]);

    /**
     * 列の削除を実際に実行する
     */
    const performColDeletion = useCallback((colIndex: number) => {
        setScheduleData(prevData => {
            const newOriginalCols = prevData.cols.filter((_, i) => i !== colIndex);
            
            // 各行の中から、該当インデックスの列要素を削除
            const newAssignments = prevData.assignments.map(row =>
                row.filter((_, i) => i !== colIndex)
            );
            const newAvailability = prevData.availability.map(row =>
                row.filter((_, i) => i !== colIndex)
            );

            const sortedNewCols = sortDateCols(newOriginalCols);

            return {
                ...prevData,
                cols: sortedNewCols,
                assignments: newAssignments,
                availability: newAvailability,
            };
        });
        setConfirmModalState(prev => ({ ...prev, isOpen: false }));
    }, []);


    // --- II. マトリックス再構築ヘルパー (行/列の追加・ソート用) ---

    const reconstructAssignments = useCallback((
        oldRows: string[], 
        newRows: string[], 
        oldAssignments: (string | null)[][], 
        oldAvailability: string[][], 
        oldCols: string[]
    ) => {
        const newAssignments = Array(newRows.length).fill(null).map(() => Array(oldCols.length).fill(null));
        const newAvailability = Array(newRows.length).fill(null).map(() => Array(oldCols.length).fill('available'));

        newRows.forEach((rowHeader, newRowIndex) => {
            const rowStartTime = rowHeader.split(' - ')[0];
            const oldIndex = oldRows.findIndex(r => r.startsWith(rowStartTime + ' -'));

            oldCols.forEach((_, newColIndex) => {
                if (oldIndex !== -1) {
                    newAssignments[newRowIndex][newColIndex] = oldAssignments[oldIndex][newColIndex];
                    newAvailability[newRowIndex][newColIndex] = oldAvailability[oldIndex][newColIndex];
                }
            });
        });
        return { newAssignments, newAvailability };
    }, []);

    const reconstructCols = useCallback((
        oldCols: string[], 
        newCols: string[], 
        oldRows: string[], 
        oldAssignments: (string | null)[][], 
        oldAvailability: string[][]
    ) => {
        const newAssignments = oldRows.map(() => Array(newCols.length).fill(null));
        const newAvailability = oldRows.map(() => Array(newCols.length).fill('available'));

        oldRows.forEach((_, rowIndex) => {
            newCols.forEach((colHeader, newColIndex) => {
                const oldIndex = oldCols.findIndex(c => c === colHeader);
                if (oldIndex !== -1) {
                    newAssignments[rowIndex][newColIndex] = oldAssignments[rowIndex][oldIndex];
                    newAvailability[rowIndex][newColIndex] = oldAvailability[rowIndex][oldIndex];
                }
            });
        });
        return { newAssignments, newAvailability };
    }, []);


    // --- III. スケジュール操作 (外部公開アクション) ---

    const handleDeleteRow = useCallback((rowIndex: number) => {
        const assignedCount = scheduleData.assignments[rowIndex].filter(id => id !== null).length;

        if (assignedCount > 0) {
            setConfirmModalState({
                isOpen: true,
                title: '行の削除確認',
                message: `${assignedCount}名がこの時間帯（${scheduleData.rows[rowIndex]}）にすでに配置されています。削除を実行すると、これらの割り当ては解除されます。`,
                onConfirm: () => performRowDeletion(rowIndex),
                confirmText: '強制削除',
                cancelText: 'キャンセル',
            });
        } else {
            performRowDeletion(rowIndex);
        }
    }, [scheduleData.assignments, scheduleData.rows, performRowDeletion]);

    const handleDeleteCol = useCallback((colIndex: number) => {
        const assignedCount = scheduleData.assignments.reduce((count, row) => count + (row[colIndex] !== null ? 1 : 0), 0);

        if (assignedCount > 0) {
            setConfirmModalState({
                isOpen: true,
                title: '列の削除確認',
                message: `${assignedCount}名がこの日付（${scheduleData.cols[colIndex]}）にすでに配置されています。削除を実行すると、これらの割り当ては解除されます。`,
                onConfirm: () => performColDeletion(colIndex),
                confirmText: '強制削除',
                cancelText: 'キャンセル',
            });
        } else {
            performColDeletion(colIndex);
        }
    }, [scheduleData.assignments, scheduleData.cols, performColDeletion]);

    const handleAddRow = useCallback(() => {
        const newRowHeader = calculateTimeRange(selectedStartTime, interviewDuration);
        const newRowStartTime = newRowHeader.split(' - ')[0];

        if (scheduleData.rows.some(row => row.startsWith(newRowStartTime + ' -'))) return;

        setScheduleData(prevData => {
            const newOriginalRows = [...prevData.rows, newRowHeader];
            const sortedNewRows = sortTimeRows(newOriginalRows);

            const { newAssignments, newAvailability } = reconstructAssignments(
                prevData.rows, sortedNewRows, prevData.assignments, prevData.availability, prevData.cols
            );

            const nextStart = newRowHeader.split(' - ')[1];
            setSelectedStartTime(nextStart);

            return {
                ...prevData,
                rows: sortedNewRows,
                assignments: newAssignments,
                availability: newAvailability,
            };
        });
    }, [selectedStartTime, interviewDuration, scheduleData.rows, reconstructAssignments]);

    const handleAddColFromPicker = useCallback(() => {
        if (!selectedDate) return;
        const dateObj = new Date(selectedDate);
        if (isNaN(dateObj.getTime())) return;

        const weekday = ['日', '月', '火', '水', '木', '金', '土'][dateObj.getDay()];
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const newHeader = `${month}/${day} (${weekday})`;

        if (scheduleData.cols.includes(newHeader)) return;

        setScheduleData(prevData => {
            const newOriginalCols = [...prevData.cols, newHeader];
            const sortedNewCols = sortDateCols(newOriginalCols);

            const { newAssignments, newAvailability } = reconstructCols(
                prevData.cols, sortedNewCols, prevData.rows, prevData.assignments, prevData.availability
            );

            return {
                ...prevData,
                cols: sortedNewCols,
                assignments: newAssignments,
                availability: newAvailability,
            };
        });
    }, [selectedDate, scheduleData.cols, scheduleData.rows, reconstructCols]);
    //-----------------------------------------------------------------------------

    // --- 利用可否設定処理 ---
    const performUnassignAndToggle = useCallback((slot: SlotIndex) => {
        const {rowIndex, colIndex} = slot;
        setScheduleData(prevData => {
            const newAssignments = prevData.assignments.map(row => [...row]);
            const newAvailability = prevData.availability.map((row, rIdx) =>
                rIdx === rowIndex
                    ? row.map((val, cIdx) => (cIdx === colIndex ? 'admin_block' : val))
                    : row
            );

            newAssignments[rowIndex][colIndex] = null;

            return { ...prevData, assignments: newAssignments, availability: newAvailability };
        });
        setConfirmModalState({ isOpen: false, title: '', message: '', onConfirm: () => {}, confirmText: null, cancelText: null });
    }, []);

    const toggleSlotAvailability = useCallback((slot:SlotIndex) => {
        const { rowIndex, colIndex } = slot;
        const isCurrentlyAvailable = scheduleData.availability[rowIndex][colIndex] !== 'admin_block';
        const assignedApplicantId = scheduleData.assignments[rowIndex][colIndex];
        const targetTime = scheduleData.rows[rowIndex];
        const targetDate = scheduleData.cols[colIndex];

        if (isCurrentlyAvailable && assignedApplicantId) {
            const applicant = getApplicantById(assignedApplicantId, applicants);
            const applicantName = applicant?.name ?? '不明な応募者';
            setConfirmModalState({
                isOpen: true,
                title: '割り当ての強制解除確認',
                message: `この面談枠（${targetDate} ${targetTime}）には「${applicantName}」さんが割り当てられています。利用不可に設定すると、この割り当ては強制的に解除され、児童（生徒）リストに戻ります。実行しますか？`,
                onConfirm: () => performUnassignAndToggle(slot),
                confirmText: '強制解除して不可にする',
                cancelText: 'キャンセル (可のまま)',
            });
            return;
        }
        setScheduleData(prevData => {
            const newAvailability = prevData.availability.map((row, rIdx) =>
                rIdx === rowIndex
                    ? row.map((val, cIdx) => {
                        if (cIdx === colIndex) {
                            // 現在の状態が 'available' なら 'admin_block' に、それ以外なら 'available' に戻す
                            return val === 'available' ? 'admin_block' : 'available';
                        }
                        return val;
                    })
                    : row
            );
            return { ...prevData, availability: newAvailability, selectedSlot: null, selectedApplicantId: null };
        });
    }, [scheduleData, performUnassignAndToggle]);

    // クリック割り当て処理
    const handleSlotClick = useCallback((currentSlot: SlotIndex) => {
        const {rowIndex, colIndex} = currentSlot;
        const currentAvailability = scheduleData.availability[currentSlot.rowIndex][currentSlot.colIndex];
        // 今クリックしたslot自身が既に選択されているかを判定
        const isCurrentSlotSelected = selectedSlot && selectedSlot.rowIndex === rowIndex && selectedSlot.colIndex === colIndex;

        // 自分自身か利用不可面談枠をクリックしたとき、今までの選択は解除される
        if (isCurrentSlotSelected || currentAvailability === 'admin_block' || currentAvailability === 'unAvailable') {
            setSelectedSlot(null);
            setSelectedApplicantId(null);
            const resetAvailability = getInitialAvailability(scheduleData);
            setScheduleData(prevData => ({ ...prevData, availability: resetAvailability }));
            return;
        }

        // if(selectedApplicantId && selectedSlot)も異常系の認識　予期せぬエラーが発生しました。みたいな

        if(!selectedApplicantId && !selectedSlot){
            setSelectedSlot(currentSlot);
            //ここでavailabilityUtils.js処理を実行
            const newAvailability = calculateSlotAvailabilityByIndex(currentSlot, applicants, scheduleData);
            setScheduleData(prevData => ({
                ...prevData,
                availability: newAvailability
            }));
            return;
        }

        //以下、割当ロジック
        const selectedAssignment = selectedSlot? scheduleData.assignments[selectedSlot.rowIndex][selectedSlot.colIndex] : null;
        const currentAssignment = currentSlot? scheduleData.assignments[currentSlot.rowIndex][currentSlot.colIndex] : null;
        setScheduleData(prevData => {
            let newAssignments = prevData.assignments;

            // ----------------------------------------------------
            // 1. 新規割り当て/上書き (児童を選択している状態)
            // ----------------------------------------------------
            if (selectedApplicantId) {
                if (currentAvailability === 'settable' || currentAvailability === 'switchable') {
                    // 'settable' または 'switchable' (上書き) の場合、新規割り当てを実行
                    newAssignments = assignApplicantToSlot(currentSlot, newAssignments, selectedApplicantId);
                }
            }

            // ----------------------------------------------------
            // 2. スロット操作 (selectedSlotを選択している状態)
            // ----------------------------------------------------
            else if (selectedSlot) {
                // ここで、selectedApplicantIdがnullなので、交換/移動のロジックが実行される
                switch(currentAvailability){
                    // ★ availabilityUtils.jsの返り値に合わせて 'switchableSlots' ではなく 'switchable' を使用
                    case 'switchable':
                        // 交換 (両方から両方へ割り当て)
                        newAssignments = assignApplicantToSlot(selectedSlot, newAssignments, currentAssignment);
                        newAssignments = assignApplicantToSlot(currentSlot, newAssignments, selectedAssignment);
                        break;

                    case 'movableToOther':
                        // selectedSlot → currentSlot へ移動
                        newAssignments = assignApplicantToSlot(currentSlot, newAssignments, selectedAssignment);
                        newAssignments = deleteAssignmentFromSlot(selectedSlot, newAssignments);
                        break;

                    case 'movableFromOther':
                        // currentSlot → selectedSlot へ移動
                        newAssignments = assignApplicantToSlot(selectedSlot, newAssignments, currentAssignment);
                        newAssignments = deleteAssignmentFromSlot(currentSlot, newAssignments);
                        break;

                    default:
                        // その他の状態は変更なし
                        break;
                }
            }
            // ----------------------------------------------------
            const resetAvailability = getInitialAvailability(prevData); // availabilityをリセット
            return{
                ...prevData,
                assignments: newAssignments,
                availability: resetAvailability,
            }
        });
        setSelectedApplicantId(null);
        setSelectedSlot(null);
    }, [selectedSlot, selectedApplicantId, scheduleData, applicants]);

    const handleApplicantClick = useCallback((applicantId: string) => {
        if (!selectedSlot) {
            setSelectedApplicantId(prevId => {
                // prevId と applicantId が同じなら null (解除)、異なるなら applicantId (選択)
                const newId = prevId === applicantId ? null : applicantId;
                // newId が null でない場合のみ、後続メソッドを実行する
                if (newId !== null) {
                    //ここでavailabilityUtils.js処理を実行
                    const newAvailability = calculateSlotAvailabilityById(newId, applicants, scheduleData);
                    setScheduleData(prevData => ({
                        ...prevData,
                        availability: newAvailability
                    }));
                }else {
                    // 【解除時】 availabilityをリセットする処理
                    const resetAvailability = getInitialAvailability(scheduleData);
                    setScheduleData(prevData => ({
                        ...prevData,
                        availability: resetAvailability
                    }));
                }
                return newId;
            });
            return;
        }

        setScheduleData(prevData => {
            const targetApplicant = processedApplicants.find(
                                           applicant => applicant.id === applicantId
                                       );

            if(targetApplicant && !targetApplicant.isAvailable){
                const resetAvailability = getInitialAvailability(prevData);
                return {
                    ...prevData,
                    availability: resetAvailability
                };
            }
            const newAssignments = assignApplicantToSlot(selectedSlot, prevData.assignments, applicantId);
            const resetAvailability = getInitialAvailability(prevData);
            return {
                ...prevData,
                assignments: newAssignments,
                availability: resetAvailability
            };
        });
        setSelectedApplicantId(null);
        setSelectedSlot(null); // 割り当て完了後、選択解除
    }, [selectedSlot, scheduleData, applicants, processedApplicants]);

    const handleClickDeleteButton = useCallback(() => {
        // selectedSlot が null の場合は何もしない（ボタン表示側で制御されるはずだが念のため）
        if (!selectedSlot) {
            return;
        }

        setScheduleData(prevData => {
            // assignmentUtils.js の deleteAssignmentFromSlot を使用
            const newAssignments = deleteAssignmentFromSlot(selectedSlot, prevData.assignments);

            // availabilityをリセット
            const resetAvailability = getInitialAvailability(prevData);

            return {
                ...prevData,
                assignments: newAssignments,
                availability: resetAvailability
            };
        });

        // 割り当て解除後、選択状態をリセット
        setSelectedApplicantId(null);
        setSelectedSlot(null);

    }, [selectedSlot, scheduleData]);

    // --- D&D ロジック ---
    const handleDragStart = useCallback((e: React.DragEvent, applicantId: string, sourceCellId: string | null = null) => {
        //sourceIdはドラッグされた児童がもともといた場所を示す文字列
        const sourceId = sourceCellId || 'applicant-list'; //どちらかnullじゃないほうを登録
        e.dataTransfer.setData('applicantId', applicantId);
        e.dataTransfer.setData('sourceCellId', sourceId);
        e.dataTransfer.effectAllowed = "move";
        setDraggingApplicantId(applicantId);

        let slotIndex: SlotIndex | null = null;
        if(sourceId !== 'applicant-list'){
            slotIndex = parseSlotId(sourceId)
        }
        setDraggingSlotIndex(slotIndex);

        setSelectedSlot(null); // D&D開始時、クリック選択を解除
        setSelectedApplicantId(null);

        //ここでavailabilityUtils.js処理を実行
        const newAvailability = (slotIndex === null)?
            calculateSlotAvailabilityById(applicantId, applicants, scheduleData)
            : calculateSlotAvailabilityByIndex(slotIndex, applicants, scheduleData);
        setScheduleData(prevData => ({
            ...prevData,
            availability: newAvailability
        }));
    }, [scheduleData, applicants]);

    const handleDragEnd = useCallback(() => {
        const resetAvailability = getInitialAvailability(scheduleData);
        setScheduleData(prevData => ({
            ...prevData,
            availability: resetAvailability
        }));
        setDraggingApplicantId(null);
        setDraggingSlotIndex(null);
        setHoveredCellId(null);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }, []);

    const handleDragEnter = useCallback((e: React.DragEvent, cellId: string) => {
        e.preventDefault();
        setHoveredCellId(cellId);
    }, []);

    const handleDragLeave = useCallback(() => {
        setHoveredCellId(null);
    }, []);

    /*ドロップされたらどうなるかの挙動。システムの根幹１*/
    const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        setHoveredCellId(null);

        // 1. D&Dデータの取得
        const applicantId = e.dataTransfer.getData('applicantId');//ドラッグ中の児童
        const sourceCellId = e.dataTransfer.getData('sourceCellId');//ドラッグ中の児童がもといた場所（applicant-listまたは各slot）

        // applicantIdが取得できない場合は処理を中止
        if (!applicantId || targetId === sourceCellId) {
            return;
        }

        // 2. ソースの解析
        const sourceSlot = parseSlotId(sourceCellId);

        //targetが割り当て可能なら入れ替える
        if(targetId.startsWith('app-')){
            const targetApplicant = processedApplicants.find(
                                        applicant => applicant.id === targetId
                                    );
            if(!sourceSlot || (targetApplicant && !targetApplicant.isAvailable) || targetId === draggingApplicantId){
                return;
            }
            setScheduleData(prevData => {
                // ユーティリティ関数を使用 (※既存のコードに合わせて手動で書くなら以下)
                const newAssignments = assignApplicantToSlot(sourceSlot, prevData.assignments, targetId);
                const resetAvailability = getInitialAvailability({
                    ...prevData,
                    assignments: newAssignments
                });
                return { ...prevData, assignments: newAssignments, availability: resetAvailability, };
            });
            setDraggingSlotIndex(null);
            setDraggingApplicantId(null);
            return;
        }


        // 3. ターゲットがリストの場合の処理 (割り当て解除)
        if (targetId === 'applicant-list') {
            if(!sourceSlot){
                return;
            }
            // リストtoリストの場合は何もしない
            setScheduleData(prevData => {
                // ユーティリティ関数を使用 (※既存のコードに合わせて手動で書くなら以下)
                const newAssignments = deleteAssignmentFromSlot(sourceSlot, prevData.assignments);
                const resetAvailability = getInitialAvailability({
                    ...prevData,
                    assignments: newAssignments
                });
                return { ...prevData, assignments: newAssignments, availability: resetAvailability, };
            });
            setDraggingSlotIndex(null);
            setDraggingApplicantId(null);
            return;
        }

        // 4. ターゲットがグリッド以外の場合の処理 (異常系 / ターゲットIDが不正)
        const targetSlot = parseSlotId(targetId);
        // targetSlot が null の場合
        if (!targetSlot) {
            return;
        }

        // 5. グリッドターゲットのチェック (利用不可)
        const targetAvailability = scheduleData.availability[targetSlot.rowIndex][targetSlot.colIndex];
        if (['admin_block', 'unAvailable'].includes(targetAvailability)) {
            return;
        }

        // 6. 状態更新(スロット→スロット/リスト→スロット)
        setScheduleData(prevData => {
            let newAssignments = prevData.assignments;

            // ターゲットの現在の割り当てを取得 (スワップ時などに使用)
            const currentTargetAssignment = newAssignments[targetSlot.rowIndex][targetSlot.colIndex];

            // D. で取得した targetAvailability を使用
            const targetAvailability = prevData.availability[targetSlot.rowIndex][targetSlot.colIndex];
            // 割り当てロジックを Availability の状態に依存させる
            switch (targetAvailability) {
                case 'settable':
                    newAssignments = assignApplicantToSlot(targetSlot, newAssignments, applicantId);
                    break;

                case 'switchable':
                    if(sourceCellId === 'applicant-list'){
                        newAssignments = assignApplicantToSlot(targetSlot, newAssignments, applicantId);
                    } else{
                        newAssignments = assignApplicantToSlot(targetSlot, newAssignments, applicantId);
                        newAssignments = assignApplicantToSlot(sourceSlot, newAssignments, currentTargetAssignment);
                    }
                    break;

                case 'movableToOther':
                    // アクション: 移動 (Grid -> Empty)
                    // 1. ターゲットにドラッグ中の児童を割り当てる
                    newAssignments = assignApplicantToSlot(targetSlot, newAssignments, applicantId);
                    // 2. 移動元(ソース)を空にする
                    newAssignments = deleteAssignmentFromSlot(sourceSlot, newAssignments);
                    break;

                case 'movableFromOther':
                    // アクション: 新規/上書き (List -> Occupied)
                    // ターゲットにドラッグ中の児童を割り当てる (上書き/新規)
                    newAssignments = assignApplicantToSlot(targetSlot, newAssignments, applicantId);
                    break;

                // 'admin_block' や 'unAvailable' は既にガード節で return されているため、
                // 理論上、ここには来ないが、念のため prevData を返す
                default:
                    return prevData;
            }
            const resetAvailability = getInitialAvailability({
                ...prevData,
                assignments: newAssignments
            });
            // データ更新
            return {
                ...prevData,
                assignments: newAssignments,
                availability: resetAvailability,
            };
        });
        setDraggingApplicantId(null);
        setDraggingSlotIndex(null);
        return;
    }, [scheduleData, applicants]);

    // UIに公開するロジックと状態
    return {
        // データ
        scheduleData, applicants,
        confirmModalState, setConfirmModalState,
        studentDetailsModalState,
        openStudentDetailsModal,
        closeStudentDetailsModal,
        upsertStudentModalState,
        openAddStudentModal,
        openEditStudentModal,
        closeUpsertStudentModal,
        handleSaveStudent,
        allScheduleSlots, // 全面談枠のリスト
        unBlockedSlots,
        processedApplicants,
        // -----------------
        interviewDuration, DURATION_OPTIONS, setInterviewDuration,
        selectedDate, setSelectedDate,
        selectedStartTime, setSelectedStartTime, TIME_OPTIONS,
        draggingApplicantId, isAddButtonActive, setIsAddButtonActive,
        selectedSlot,selectedApplicantId,hoveredCellId,draggingSlotIndex,

        // 関数
        handleAddRow, handleDeleteRow,
        handleAddColFromPicker, handleDeleteCol,
        toggleSlotAvailability,
        handleDragStart, handleDragEnd, handleDragOver, handleDrop, handleDragEnter, handleDragLeave,
        handleSlotClick,
        handleApplicantClick,
        handleClickDeleteButton,
        confirmDeleteStudent,

        // スタイル/レンダリングヘルパー
        styles,
        getSlotStyle,
    };
};

export default useScheduleManager;