import { useState, useMemo, useCallback } from 'react';
import { calculateTimeRange, getNextStartTime } from '../utils/timeUtils';
import { sortTimeRows, sortDateCols } from '../utils/sortUtils';
import { parseSlotId, createSlotId } from '../utils/slotUtils';
import { assignApplicantToSlot, deleteAssignmentFromSlot } from '../utils/assignmentUtils';
import { calculateSlotAvailabilityById, calculateSlotAvailabilityByIndex, getInitialAvailability, isPreferred } from '../utils/availabilityUtils';
import { getApplicantById, getRegisteredIdsSet } from '../utils/applicantUtils';
import { useManagerStyles } from '../styles/managerStyles.js';

const useScheduleManager = (initialApplicants) => {
    const [applicants, setApplicants] = useState(initialApplicants);
    const [interviewDuration, setInterviewDuration] = useState(15);
    const DURATION_OPTIONS = [5, 10, 15, 20, 30, 45, 60];

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [selectedStartTime, setSelectedStartTime] = useState('09:00');

    const [draggingApplicantId, setDraggingApplicantId] = useState(null);
    const [draggingSlotIndex, setDraggingSlotIndex] = useState(null);
    const [isAddButtonActive, setIsAddButtonActive] = useState(false);
    const [hoveredCellId, setHoveredCellId] = useState(null);

    const [selectedSlot, setSelectedSlot] = useState(null);
    const { styles, getSlotStyle } = useManagerStyles({
            isAddButtonActive,
            hoveredCellId,
            selectedSlot,
        });

    // クリックで選択された児童のIDを保持する状態
    const [selectedApplicantId, setSelectedApplicantId] = useState(null);

    const [modalState, setModalState] = useState({
        isOpen: false, title: '', message: '', onConfirm: () => {},
    });

    // 児童（生徒）詳細モーダルの状態
    const [studentDetailsModalState, setStudentDetailsModalState] = useState({
        isOpen: false,
        student: null, // 表示対象の児童（生徒）オブジェクト
    });

    // 児童（生徒）追加/編集モーダルの状態
    const [upsertStudentModalState, setUpsertStudentModalState] = useState({
        isOpen: false,
        student: null,
        mode: 'add',
    });

    // 既存の児童（生徒）を編集するためのモーダルを開く
    const openEditStudentModal = useCallback((student) => {
        setUpsertStudentModalState({ isOpen: true, student: student });
    }, []);

    // ------------------------------------------

    const TIME_OPTIONS = useMemo(() => {
        const times = [];
        for (let h = 9; h <= 17; h++) {
            for (let m = 0; m < 60; m += interviewDuration) {
                if (h === 17 && m > 0) continue;
                times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
            }
        }
        return times;
    }, [interviewDuration]);

    const [scheduleData, setScheduleData] = useState(() => {
        const initialRows = sortTimeRows([calculateTimeRange('09:00', 15), calculateTimeRange('09:15', 15), calculateTimeRange('14:00', 15)]);
        const initialCols = sortDateCols(['12/01 (月)', '11/30 (日)']);

        const initialAssignments = Array(initialRows.length).fill(null).map(() => Array(initialCols.length).fill(null));
        initialAssignments[0][1] = { applicantId: 'app-2', type: 'neutral' };

        const initialAvailability = Array(initialRows.length).fill('available').map(() => Array(initialCols.length).fill('available'));

        return {
            rows: initialRows,
            cols: initialCols,
            assignments: initialAssignments,
            availability: initialAvailability,
        };
    });

    // 全面談面談枠のリストを生成
    const allScheduleSlots = useMemo(() => {
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

    const unBlockedSlots = useMemo(() => {
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

    const getApplicantName = useCallback((applicantId) => {
        return applicants.find(app => app.id === applicantId)?.name || 'Unknown Applicant';
    }, [applicants]);

    const categorizedApplicants = useMemo(() => {
        // 全assignmentsから割り当て済みのIDをSetに抽出
        const registeredIds = getRegisteredIdsSet(scheduleData.assignments);

        // 2. 【動的な状態の計算】選択/ドラッグスロットの特定
        // 選択スロットの処理
        const dragTargetSlot = (draggingApplicantId && hoveredCellId)
            ? parseSlotId(hoveredCellId) // parseSlotIdを使用して {rowIndex, colIndex} に変換
            : null;
        const activeSlotIndex = selectedSlot ?? dragTargetSlot ?? draggingSlotIndex;

        // ドラッグ元のスロット処理
        const activeSlotName = activeSlotIndex
            ? `${scheduleData.cols[activeSlotIndex.colIndex]} ${scheduleData.rows[activeSlotIndex.rowIndex]}`
            : null;


        // 【判定処理】applicants 配列をループし、Setで高速チェック
        return applicants.map(applicant => {
            const isRegistered = registeredIds.has(applicant.id);

            // 動的フラグA: 選択スロットを希望しているか？
            const isAvailable = activeSlotName
                ? isPreferred(applicant, activeSlotName)
                : true;


            return {
                ...applicant,
                isRegistered: isRegistered,
                isAvailable: isAvailable
            };
        });
    }, [applicants, scheduleData.assignments, scheduleData.cols, scheduleData.rows, selectedSlot, draggingSlotIndex, hoveredCellId]);


    /**
     * 指定された児童（生徒）IDが割り当てられている面談枠の日程（日付と時間帯）を返す
     */
    const getAssignmentDetails = useCallback((applicantId) => {
        const { rows, cols, assignments } = scheduleData;

        for (let r = 0; r < rows.length; r++) {
            for (let c = 0; c < cols.length; c++) {
                // オブジェクトのapplicantIdプロパティと比較
                if (assignments[r][c] && assignments[r][c].applicantId === applicantId) {
                    const date = cols[c];
                    const time = rows[r];
                    return { date, time };
                }
            }
        }
        return null;
    }, [scheduleData]);

    // --- 児童（生徒）詳細モーダル関連関数 (変更なし) ---
    const openStudentDetailsModal = useCallback((student) => {
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
        // 新規登録用の初期データを設定
        setUpsertStudentModalState({
            isOpen: true,
            student: {
                name: '',
                student_id: '',
                preferred_dates: []
            },
            mode: 'add',
        });
    }, []);

    const closeUpsertStudentModal = useCallback(() => {
        setUpsertStudentModalState({
            isOpen: false,
            student: null,
            mode: 'add',
        });
    }, []);

    const handleSaveStudent = useCallback((studentData) => {
        // データのバリデーションと整形
        const saveData = {
            ...studentData,
            name: studentData.name.trim(),
            student_id: studentData.student_id.trim() || null,
            preferred_dates: studentData.preferred_dates || [],
        };

        if (studentData.id) {
            // 編集ロジック
            setApplicants(prev => prev.map(s => s.id === studentData.id ? saveData : s));
            return saveData;
        } else {
            // 新規追加ロジック
            const newId = `app-${Date.now()}`;
            const newFamilyId = studentData.family_id || newId.replace('app-', 'fam-');
            const newStudent = {
                ...saveData,
                id: newId,
                student_id: saveData.student_id || `NEW-${applicants.length + 1}`,
                family_id: newFamilyId,
            };
            setApplicants(prev => [...prev, newStudent]);
            return newStudent;
        }
    }, [applicants]);

    // --- 児童（生徒）情報の削除処理 (変更なし) ---
    const handleDeleteStudent = useCallback((studentId) => {
        // 児童（生徒）リストから削除
        setApplicants(prev => prev.filter(s => s.id !== studentId));

        // スケジュールからも削除（割り当て解除）
        setScheduleData(prevData => {
            const newAssignments = prevData.assignments.map(row =>
                row.map(slot => (slot && slot.applicantId === studentId) ? null : slot)
            );
            return { ...prevData, assignments: newAssignments };
        });
        setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    }, []);

    const confirmDeleteStudent = useCallback((student) => {
        const isAssigned = scheduleData.assignments.flat().some(slot => slot && slot.applicantId === student.id);

        setModalState({
            isOpen: true,
            title: '児童（生徒）の削除確認',
            message: isAssigned
                ? `「${student.name}」さんは現在スケジュールに割り当てられています。削除を実行すると、割り当ては強制的に解除され、データから削除されます。続行しますか？`
                : `「${student.name}」さんをデータから削除しますか？`,
            onConfirm: () => handleDeleteStudent(student.id),
            confirmText: isAssigned ? '強制削除' : '削除',
            cancelText: 'キャンセル',
        });
    }, [scheduleData.assignments, handleDeleteStudent]);


    // マトリックス再構築ヘルパー (行追加/削除時)
    const reconstructAssignments = (oldRows, newRows, oldAssignments, oldAvailability, oldCols) => {
        const newAssignments = Array(newRows.length).fill(null).map(() => Array(oldCols.length).fill(null));
        const newAvailability = Array(newRows.length).fill(null).map(() => Array(oldCols.length).fill('available'));

        newRows.forEach((rowHeader, newRowIndex) => {
            // 開始時刻部分で一致を検索
            const rowStartTime = rowHeader.split(' - ')[0];
            const oldIndex = oldRows.findIndex(r => r.startsWith(rowStartTime + ' -'));

            oldCols.forEach((_, newColIndex) => {
                if (oldIndex !== -1) {
                    newAssignments[newRowIndex][newColIndex] = oldAssignments[oldIndex][newColIndex];
                    newAvailability[newRowIndex][newColIndex] = oldAvailability[oldIndex][newColIndex];
                } else {
                    newAssignments[newRowIndex][newColIndex] = null;
                    newAvailability[newRowIndex][newColIndex] = 'available';
                }
            });
        });
        return { newAssignments, newAvailability };
    };

    // マトリックス再構築ヘルパー (列追加/削除時)
    const reconstructCols = (oldCols, newCols, oldRows, oldAssignments, oldAvailability) => {
        const newAssignments = oldRows.map(() => Array(newCols.length).fill(null));
        const newAvailability = oldRows.map(() => Array(newCols.length).fill('available'));

        oldRows.forEach((_, rowIndex) => {
            newCols.forEach((colHeader, newColIndex) => {
                const oldIndex = oldCols.findIndex(c => c === colHeader);
                if (oldIndex !== -1) {
                    newAssignments[rowIndex][newColIndex] = oldAssignments[rowIndex][oldIndex];
                    newAvailability[rowIndex][newColIndex] = oldAvailability[rowIndex][oldIndex];
                } else {
                    newAssignments[rowIndex][newColIndex] = null;
                    newAvailability[rowIndex][newColIndex] = 'available';
                }
            });
        });
        return { newAssignments, newAvailability };
    };

    // --- 行・列の削除処理 (変更なし) ---
    const performRowDeletion = useCallback((rowIndex) => {
        setScheduleData(prevData => {
            const rowToDelete = prevData.rows[rowIndex];
            const newOriginalRows = prevData.rows.filter((_, i) => i !== rowIndex);

            const newAssignments = prevData.assignments.filter((_, i) => prevData.rows[i] !== rowToDelete);
            const newAvailability = prevData.availability.filter((_, i) => prevData.rows[i] !== rowToDelete);

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
        setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    }, []);

    const performColDeletion = useCallback((colIndex) => {
        setScheduleData(prevData => {
            const colToDelete = prevData.cols[colIndex];
            const newOriginalCols = prevData.cols.filter((_, i) => i !== colIndex);

            const newAssignments = prevData.assignments.map(row =>
                row.filter((_, i) => prevData.cols[i] !== colToDelete)
            );
            const newAvailability = prevData.availability.map(row =>
                row.filter((_, i) => prevData.cols[i] !== colToDelete)
            );

            const sortedNewCols = sortDateCols(newOriginalCols);

            return {
                ...prevData,
                cols: sortedNewCols,
                assignments: newAssignments,
                availability: newAvailability,
            };
        });
        setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    }, []);

    const handleDeleteRow = useCallback((rowIndex) => {
        const assignedCount = scheduleData.assignments[rowIndex].filter(id => id !== null).length;

        if (assignedCount > 0) {
            setModalState({
                isOpen: true,
                title: '行の削除確認',
                message: `${assignedCount}名がこの時間帯（${scheduleData.rows[rowIndex]}）にすでに配置されています。削除を実行すると、これらの割り当ては強制的に解除されリストに戻ります。続行しますか？`,
                onConfirm: () => performRowDeletion(rowIndex),
                confirmText: '強制削除',
                cancelText: 'キャンセル',
            });
        } else {
            performRowDeletion(rowIndex);
        }
    }, [scheduleData.assignments, scheduleData.rows, performRowDeletion]);

    const handleDeleteCol = useCallback((colIndex) => {
        const assignedCount = scheduleData.assignments.reduce((count, row) => count + (row[colIndex] !== null ? 1 : 0), 0);

        if (assignedCount > 0) {
            setModalState({
                isOpen: true,
                title: '列の削除確認',
                message: `${assignedCount}名がこの日付（${scheduleData.cols[colIndex]}）にすでに配置されています。削除を実行すると、これらの割り当ては強制的に解除されリストに戻ります。続行しますか？`,
                onConfirm: () => performColDeletion(colIndex),
                confirmText: '強制削除',
                cancelText: 'キャンセル',
            });
        } else {
            performColDeletion(colIndex);
        }
    }, [scheduleData.assignments, scheduleData.cols, performColDeletion]);

    // --- 行・列の追加処理 ---
    const handleAddRow = useCallback(() => {
        const newRowHeader = calculateTimeRange(selectedStartTime, interviewDuration);
        // 開始時刻が同じ時間帯があるかチェック
        const newRowStartTime = newRowHeader.split(' - ')[0];
        if (scheduleData.rows.some(row => row.startsWith(newRowStartTime + ' -'))) {
             // すでに同じ開始時刻が存在する場合は何もしない (durationが異なっても不可とする)
             return;
        }

        setScheduleData(prevData => {
            const originalRows = prevData.rows;
            const newOriginalRows = [...originalRows, newRowHeader];
            const sortedNewRows = sortTimeRows(newOriginalRows);

            const { newAssignments, newAvailability } = reconstructAssignments(
                originalRows, sortedNewRows, prevData.assignments, prevData.availability, prevData.cols
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
    }, [selectedStartTime, interviewDuration, scheduleData.rows]);

    const handleAddColFromPicker = useCallback(() => {
        if (!selectedDate) return;

        const dateObj = new Date(selectedDate);
        // dateObjがInvalid Dateでないかチェック
        if (isNaN(dateObj.getTime())) return;

        const weekday = ['日', '月', '火', '水', '木', '金', '土'][dateObj.getDay()];

        // MM/DD 形式にフォーマット (ISO形式は YYYY-MM-DD なのでそのまま split/slice)
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const newHeader = `${month}/${day} (${weekday})`;

        if (scheduleData.cols.includes(newHeader)) return;

        setScheduleData(prevData => {
            const originalCols = prevData.cols;
            const newOriginalCols = [...originalCols, newHeader];
            const sortedNewCols = sortDateCols(newOriginalCols);

            const { newAssignments, newAvailability } = reconstructCols(
                originalCols, sortedNewCols, prevData.rows, prevData.assignments, prevData.availability
            );

            return {
                ...prevData,
                cols: sortedNewCols,
                assignments: newAssignments,
                availability: newAvailability,
            };
        });
    }, [selectedDate, scheduleData.cols, scheduleData.rows]);


    // --- 利用可否設定処理 ---
    const performUnassignAndToggle = useCallback((rowIndex, colIndex) => {
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
        setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    }, []);

    const toggleSlotAvailability = useCallback((rowIndex, colIndex) => {
        const isCurrentlyAvailable = scheduleData.availability[rowIndex][colIndex] !== 'admin_block';
        const assignedSlot = scheduleData.assignments[rowIndex][colIndex];
        const assignedApplicantId = assignedSlot ? assignedSlot.applicantId : null;
        const targetTime = scheduleData.rows[rowIndex];
        const targetDate = scheduleData.cols[colIndex];

        if (isCurrentlyAvailable && assignedSlot) {
            const applicantName = getApplicantName(assignedApplicantId);
            setModalState({
                isOpen: true,
                title: '割り当ての強制解除確認',
                message: `この面談枠（${targetDate} ${targetTime}）には「${applicantName}」さんが割り当てられています。利用不可に設定すると、この割り当ては強制的に解除され、児童（生徒）リストに戻ります。実行しますか？`,
                onConfirm: () => performUnassignAndToggle(rowIndex, colIndex),
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
    }, [scheduleData, getApplicantName, performUnassignAndToggle]);

    // クリック割り当て処理
    const handleSlotClick = useCallback((rowIndex, colIndex) => {
        const currentSlot = { rowIndex, colIndex };
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
                        newAssignments = assignApplicantToSlot(selectedSlot, newAssignments, currentAssignment.applicantId);
                        newAssignments = assignApplicantToSlot(currentSlot, newAssignments, selectedAssignment.applicantId);
                        break;

                    case 'movableToOther':
                        // selectedSlot → currentSlot へ移動
                        newAssignments = assignApplicantToSlot(currentSlot, newAssignments, selectedAssignment.applicantId);
                        newAssignments = deleteAssignmentFromSlot(selectedSlot, newAssignments);
                        break;

                    case 'movableFromOther':
                        // currentSlot → selectedSlot へ移動
                        newAssignments = assignApplicantToSlot(selectedSlot, newAssignments, currentAssignment.applicantId);
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

    const handleApplicantClick = useCallback((applicantId) => {
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

        //selectedSlotが存在している場合、割り当てロジック
        const { rowIndex, colIndex } = selectedSlot;

        setScheduleData(prevData => {
            const targetApplicant = categorizedApplicants.find(
                                           applicant => applicant.id === applicantId
                                       );

            if(!targetApplicant.isAvailable){
                const resetAvailability = getInitialAvailability(prevData);
                return {
                    ...prevData,
                    availability: resetAvailability
                };
            }
            const newAssignments = assignApplicantToSlot(selectedSlot, prevData.assignments, applicantId);

//            // 既存の割り当て (targetApplicantId) があれば、それを解除 (nullにする)
//            // これにより、リストに戻る (assignedIdsから外れる)
//            if (targetApplicantId) {
//                newAssignments[rowIndex][colIndex] = null; // リストに戻すために一時的に解除
//            }
//
//            // 面談枠から同じ児童（生徒）を解除する（他の面談枠から移動させるため）
//            // (targetApplicantIdとは別の、applicantIdが既に割り当てられている面談枠を探す)
//            let foundSource = false;
//            for (let r = 0; r < newAssignments.length; r++) {
//                for (let c = 0; c < newAssignments[r].length; c++) {
//                    if (newAssignments[r][c] && newAssignments[r][c].applicantId === applicantId) { // オブジェクトチェック
//                        newAssignments[r][c] = null;
//                        foundSource = true;
//                        break;
//                    }
//                }
//                if (foundSource) break;
//            }
//
//            // 選択された面談枠に割り当てる
//            newAssignments[rowIndex][colIndex] = { applicantId: applicantId, type: 'neutral' /* 他の初期情報 */ };

            const resetAvailability = getInitialAvailability(prevData);
            return {
                ...prevData,
                assignments: newAssignments,
                availability: resetAvailability
            };
        });
        setSelectedApplicantId(null);
        setSelectedSlot(null); // 割り当て完了後、選択解除
    }, [selectedSlot, scheduleData, applicants, categorizedApplicants]);

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
    const handleDragStart = useCallback((e, applicantId, sourceCellId = null) => {
        //sourceIdはドラッグされた児童がもともといた場所を示す文字列
        const sourceId = sourceCellId || 'applicant-list'; //どちらかnullじゃないほうを登録
        e.dataTransfer.setData('applicantId', applicantId);
        e.dataTransfer.setData('sourceCellId', sourceId);
        setDraggingApplicantId(applicantId);
        if (sourceId !== 'applicant-list'){
            setDraggingSlotIndex(parseSlotId(sourceId));//sourceCellIdを{Index, Index}のオブジェクトに変換したものをセット
        } else {
            setDraggingSlotIndex(null);
        }
        e.dataTransfer.effectAllowed = "move";
        setSelectedSlot(null); // D&D開始時、クリック選択を解除
        setSelectedApplicantId(null);

        //ここでavailabilityUtils.js処理を実行
        const newAvailability = sourceId === 'applicant-list'?
            calculateSlotAvailabilityById(applicantId, applicants, scheduleData)
            : calculateSlotAvailabilityByIndex(parseSlotId(sourceId), applicants, scheduleData);
        setScheduleData(prevData => ({
            ...prevData,
            availability: newAvailability
        }));
    }, [scheduleData, draggingApplicantId, draggingSlotIndex]);

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

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }, []);

    const handleDragEnter = useCallback((e, cellId) => {
        e.preventDefault();
        setHoveredCellId(cellId);
    }, []);

    const handleDragLeave = useCallback(() => {
        setHoveredCellId(null);
    }, []);

    /*ドロップされたらどうなるかの挙動。システムの根幹１*/
    const handleDrop = useCallback((e, targetId) => {
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
            const targetApplicant = categorizedApplicants.find(
                                        applicant => applicant.id === targetId
                                    );
            if(!targetApplicant.isAvailable || targetId === draggingApplicantId){
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
                        newAssignments = assignApplicantToSlot(sourceSlot, newAssignments, currentTargetAssignment.applicantId);
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
        modalState, setModalState,
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
        categorizedApplicants,
        // -----------------
        interviewDuration, DURATION_OPTIONS, setInterviewDuration,
        selectedDate, setSelectedDate,
        selectedStartTime, setSelectedStartTime, TIME_OPTIONS,
        draggingApplicantId, isAddButtonActive, setIsAddButtonActive,
        selectedSlot,selectedApplicantId,hoveredCellId,draggingSlotIndex,

        // 関数
        getApplicantName,
        handleAddRow, handleDeleteRow,
        handleAddColFromPicker, handleDeleteCol,
        toggleSlotAvailability,
        handleDragStart, handleDragEnd, handleDragOver, handleDrop, handleDragEnter, handleDragLeave,
        handleSlotClick,
        handleApplicantClick,
        handleClickDeleteButton,
        confirmDeleteStudent,
        getAssignmentDetails,

        // スタイル/レンダリングヘルパー
        styles,
        getSlotStyle,
    };
};

export default useScheduleManager;