import { useState, useMemo, useCallback } from 'react';
import { calculateTimeRange, getNextStartTime } from '../utils/timeUtils';
import { sortTimeRows, sortDateCols } from '../utils/sortUtils';
import {parseSlotId, createSlotId} from '../utils/slotUtils';
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
    const [clickedApplicantId, setClickedApplicantId] = useState(null);

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
        initialAssignments[0][0] = { applicantId: 'app-1', type: 'neutral' };

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
            return { ...prevData, availability: newAvailability, selectedSlot: null, clickedApplicantId: null };
        });
    }, [scheduleData, getApplicantName, performUnassignAndToggle]);

    // クリック割り当て処理
    const handleSlotClick = useCallback((rowIndex, colIndex, isAvailable) => {
        const currentSlot = { rowIndex, colIndex };
        // 今クリックしたslot自身が既に選択されているかを判定
        const isCurrentSlotSelected = selectedSlot && selectedSlot.rowIndex === rowIndex && selectedSlot.colIndex === colIndex;

        // 自分自身か利用不可面談枠をクリックしたとき、今までの選択は解除される
        if (isCurrentSlotSelected || !isAvailable) {
            setSelectedSlot(null);
            setClickedApplicantId(null);
            return;
        }

        if(!clickedApplicantId){
            setSelectedSlot(currentSlot);
            //ここでavailabilityUtils.js処理を実行
            return;
        }

        if (clickedApplicantId && isAvailable) {
            // 児童が選択されており、面談枠が利用可能な場合
            // この処理は、既存の handleApplicantClick のロジックとほぼ同じ内容をインラインで実行します。

            setScheduleData(prevData => {
                const newAssignments = prevData.assignments.map(row => [...row]);

                // 1. 同じ児童が他の面談枠に割り当てられていれば、その面談枠を解除（移動）
                let foundSource = false;
                for (let r = 0; r < newAssignments.length; r++) {
                    for (let c = 0; c < newAssignments[r].length; c++) {
                        // clickedApplicantIdが既に割り当てられている面談枠を探す
                        if (newAssignments[r][c] && newAssignments[r][c].applicantId === clickedApplicantId) {
                            newAssignments[r][c] = null;
                            foundSource = true;
                            // 見つかっても、スワップではないので処理を続行
                        }
                    }
                }

                // 2. ターゲットスロットに割り当てる
                newAssignments[rowIndex][colIndex] = { applicantId: clickedApplicantId, type: 'neutral' };

                // 3. ターゲットスロットに元々いた児童をリストに戻す（上書きの場合）
                // (元のロジックでは、handleApplicantClick内でtargetApplicantIdの解除処理がありましたが、
                // 上の for ループがclickedApplicantIdの移動に集中しているため、ここでは単純な上書きとして実装します)

                return { ...prevData, assignments: newAssignments };
            });

            // 割り当て完了後、児童の選択とスロットの選択を解除
            setClickedApplicantId(null);
            setSelectedSlot(null);
            return;
        }
        // --- 面談枠間のスワップ処理 (Slot A が選択されている状態で Slot B がクリックされた場合) ---
        if (selectedSlot && !isCurrentSlotSelected) {
            const fromRowIndex = selectedSlot.rowIndex;
            const fromColIndex = selectedSlot.colIndex;

            setScheduleData(prevData => {
                const newAssignments = prevData.assignments.map(row => [...row]);

                const slotA = newAssignments[fromRowIndex][fromColIndex]; // slotA はオブジェクトまたは null
                const slotB = newAssignments[rowIndex][colIndex]; // slotB はオブジェクトまたは null

                newAssignments[fromRowIndex][fromColIndex] = slotB;
                newAssignments[rowIndex][colIndex] = slotA;

                return { ...prevData, assignments: newAssignments };
            });

            // スワップ後は選択を解除
            setSelectedSlot(null);
            return;
        }
    }, [selectedSlot, clickedApplicantId]);

    const handleApplicantClick = useCallback((applicantId) => {
        if (!selectedSlot) {
            setClickedApplicantId(prevId => {
                // prevId と applicantId が同じなら null (解除)、異なるなら applicantId (選択)
                const newId = prevId === applicantId ? null : applicantId;
                // newId が null でない場合のみ、後続メソッドを実行する
                if (newId !== null) {
                    // 後続メソッド（後日実装）
                    // newId を引数として渡す
                    // 例: availabilityUtils.process(newId);
                }
                return newId;
            });
            return;
        }

        const { rowIndex, colIndex } = selectedSlot;

        setScheduleData(prevData => {
            const newAssignments = prevData.assignments.map(row => [...row]);
            const targetSlot = newAssignments[rowIndex][colIndex];
            const targetApplicantId = targetSlot ? targetSlot.applicantId : null;

            // 既存の割り当て (targetApplicantId) があれば、それを解除 (nullにする)
            // これにより、リストに戻る (assignedIdsから外れる)
            if (targetApplicantId) {
                newAssignments[rowIndex][colIndex] = null; // リストに戻すために一時的に解除
            }

            // 面談枠から同じ児童（生徒）を解除する（他の面談枠から移動させるため）
            // (targetApplicantIdとは別の、applicantIdが既に割り当てられている面談枠を探す)
            let foundSource = false;
            for (let r = 0; r < newAssignments.length; r++) {
                for (let c = 0; c < newAssignments[r].length; c++) {
                    if (newAssignments[r][c] && newAssignments[r][c].applicantId === applicantId) { // オブジェクトチェック
                        newAssignments[r][c] = null;
                        foundSource = true;
                        break;
                    }
                }
                if (foundSource) break;
            }

            // 選択された面談枠に割り当てる
            newAssignments[rowIndex][colIndex] = { applicantId: applicantId, type: 'neutral' /* 他の初期情報 */ };

            return { ...prevData, assignments: newAssignments };
        });

        setSelectedSlot(null); // 割り当て完了後、選択解除
    }, [selectedSlot]);

//    const handleApplicantListClick = useCallback((applicantId) => {
//        // 面談枠が選択されている場合は、既存の割り当てロジックを優先
//        if (selectedSlot) {
//            handleApplicantClick(applicantId); // 既存の割り当て処理を呼び出す
//            return;
//        }
//
//        // 児童IDが既に選択されている場合は解除、そうでなければ選択
//        setClickedApplicantId(prevId =>
//            prevId === applicantId ? null : applicantId
//        );
//    }, [selectedSlot, handleApplicantClick]);


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
        
//        availabilityUtils.jsのメソッドにapplicants, scheduleData, draggingSlotIndex,applicantIdを引数にして送る
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggingApplicantId(null);
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
        setSelectedSlot(null);
        setDraggingSlotIndex(null);

        // 1. D&Dデータの取得
        const applicantId = e.dataTransfer.getData('applicantId');
        const sourceCellId = e.dataTransfer.getData('sourceCellId');

        // applicantIdが取得できない場合は処理を中止
        if (!applicantId) {
            setDraggingApplicantId(null);
            return;
        }

        // 2. ターゲット/ソースの解析
        const targetParts = targetId.split('-');
        const targetIsGrid = targetParts.length === 3;
        const targetRowIndex = targetIsGrid ? parseInt(targetParts[1], 10) : -1;
        const targetColIndex = targetIsGrid ? parseInt(targetParts[2], 10) : -1;

        const sourceParts = sourceCellId.split('-');
        const sourceIsGrid = sourceParts.length === 3;
        const sourceRowIndex = sourceIsGrid ? parseInt(sourceParts[1], 10) : -1;
        const sourceColIndex = sourceIsGrid ? parseInt(sourceParts[2], 10) : -1;

        // 3. グリッドターゲットのチェック (利用不可)
        if (targetIsGrid) {
            if (scheduleData.availability[targetRowIndex][targetColIndex] === 'admin_block') {
                setDraggingApplicantId(null);
                return;
            }
        }

        // 4. ターゲットがリストの場合の処理 (割り当て解除)
        if (targetId === 'applicant-list') {
            if (sourceIsGrid) {
                setScheduleData(prevData => {
                    const newAssignments = prevData.assignments.map(row => [...row]);
                    // 移動元の面談枠をクリア (nullを代入)
                    newAssignments[sourceRowIndex][sourceColIndex] = null;
                    return { ...prevData, assignments: newAssignments };
                });
            }
            setDraggingApplicantId(null);
            return;
        }

        // 5. ターゲットがグリッド以外の場合の処理 (異常系)
        if (!targetIsGrid || targetRowIndex < 0 || targetColIndex < 0) {
            setDraggingApplicantId(null);
            return;
        }

        // 6. 状態更新
        setScheduleData(prevData => {
            const newAssignments = prevData.assignments.map(row => [...row]);

            // ターゲットセルの現在の割り当て情報 (オブジェクトまたは null)
            const currentTargetSlot = newAssignments[targetRowIndex][targetColIndex];

            // 新しく割り当てるSlotオブジェクトを作成
            const newSlotForTarget = { applicantId: applicantId, type: 'neutral' };

            // 6-1. スキップ条件の修正
            // a) 同じ面談枠へのドロップは無視
            if (sourceIsGrid && sourceRowIndex === targetRowIndex && sourceColIndex === targetColIndex) {
                return prevData;
            }
            // b) リストから埋まった面談枠へ、同じ児童（生徒）をドロップした場合は無視
            // 割り当てオブジェクトのapplicantIdプロパティを参照するように修正
            if (!sourceIsGrid && currentTargetSlot && currentTargetSlot.applicantId === applicantId) {
                return prevData;
            }

            // 6-2. 割り当て処理

            // ターゲット面談枠が空の場合
            if (currentTargetSlot === null) {
                // ソースがグリッドの場合、移動元をクリア
                if (sourceIsGrid) {
                    newAssignments[sourceRowIndex][sourceColIndex] = null;
                }
                // ターゲットに新しいSlotオブジェクトを代入
                newAssignments[targetRowIndex][targetColIndex] = newSlotForTarget;

            // ターゲット面談枠が埋まっており、ソースがグリッドの場合 (スワップ)
            } else if (sourceIsGrid) {
                // ターゲットに新しいSlotオブジェクトを代入
                newAssignments[targetRowIndex][targetColIndex] = newSlotForTarget;
                // 移動元に元のターゲットSlot（オブジェクト）を戻す (スワップ)
                newAssignments[sourceRowIndex][sourceColIndex] = currentTargetSlot;

            // ターゲット面談枠が埋まっており、ソースがリストの場合 (上書き)
            } else if (!sourceIsGrid) {
                 // ターゲット面談枠に新しいSlotオブジェクトを上書き
                 newAssignments[targetRowIndex][targetColIndex] = newSlotForTarget;
            }

            return { ...prevData, assignments: newAssignments };
        });

        setDraggingApplicantId(null);
    }, [scheduleData.availability]);

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
        // -----------------
        interviewDuration, DURATION_OPTIONS, setInterviewDuration,
        selectedDate, setSelectedDate,
        selectedStartTime, setSelectedStartTime, TIME_OPTIONS,
        draggingApplicantId, isAddButtonActive, setIsAddButtonActive,
        selectedSlot,clickedApplicantId,

        // 関数
        getApplicantName,
        handleAddRow, handleDeleteRow,
        handleAddColFromPicker, handleDeleteCol,
        toggleSlotAvailability,
        handleDragStart, handleDragEnd, handleDragOver, handleDrop, handleDragEnter, handleDragLeave,
        handleSlotClick,
        handleApplicantClick,
//        handleApplicantListClick,
        confirmDeleteStudent,
        getAssignmentDetails,

        // スタイル/レンダリングヘルパー
        styles,
        getSlotStyle,
    };
};

export default useScheduleManager;