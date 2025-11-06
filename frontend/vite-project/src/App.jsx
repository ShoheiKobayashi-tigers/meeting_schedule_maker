import React, { useState, useMemo, useCallback } from 'react';

// --- I. ヘルパー関数 (純粋なロジック層 - 共通利用) ---

/**
 * 時刻文字列 (HH:mm) と分数から、HH:mm - HH:mm 形式の範囲文字列を生成する
 */
const calculateTimeRange = (startTimeStr, duration) => {
    const [startH, startM] = startTimeStr.split(':').map(Number);
    let start = new Date(2000, 0, 1, startH, startM);

    let end = new Date(start.getTime());
    end.setMinutes(end.getMinutes() + duration);

    const formatTime = (date) => {
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
    };

    return `${formatTime(start)} - ${formatTime(end)}`;
};

/**
 * 次に追加すべき時間帯の開始時間を計算する (ソート済みリストを前提とする)
 */
const getNextStartTime = (rows, defaultStart = '09:00') => {
    if (rows.length === 0) {
        return defaultStart;
    }
    const latestRow = rows[rows.length - 1];
    const endTimeString = latestRow.split(' - ')[1];

    if (!endTimeString || isNaN(endTimeString.split(':')[0])) return defaultStart;

    return endTimeString;
};

/**
 * 時間帯ヘッダー ("HH:mm - HH:mm") を開始時刻でソートする
 */
const sortTimeRows = (rows) => {
    return [...rows].sort((a, b) => {
        const startTimeA = a.split(' - ')[0];
        const startTimeB = b.split(' - ')[0];
        // HH:mm 形式でゼロパディングされているため、文字列比較で十分
        return startTimeA.localeCompare(startTimeB);
    });
};

/**
 * 日付ヘッダー ("MM/DD (曜日)") を MM/DD でソートする
 */
const sortDateCols = (cols) => {
    return [...cols].sort((a, b) => {
        // MM/DD (曜日) から MM/DD の部分のみを抽出
        const datePartA = a.substring(0, a.indexOf(' '));
        const datePartB = b.substring(0, b.indexOf(' '));
        return datePartA.localeCompare(datePartB);
    });
};


// --- II. 共通UIコンポーネント (プレゼンテーション層) ---

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = '実行する', cancelText = 'キャンセル' }) => {
    // スタイル定義は元のまま
    if (!isOpen) return null;

    const contentStyle = {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.75rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        maxWidth: '450px',
        width: '90%',
        fontFamily: 'Inter, sans-serif',
    };
    const buttonBaseStyle = {
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: 'none',
        fontSize: '1rem',
    };
    const confirmButtonStyle = {
        ...buttonBaseStyle,
        backgroundColor: '#e53e3e', // Red
        color: 'white',
        marginLeft: '1rem',
    };
    const cancelButtonStyle = {
        ...buttonBaseStyle,
        backgroundColor: '#edf2f7', // Light Gray
        color: '#4a5568',
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        }}>
            <div style={contentStyle}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#2d3748', marginBottom: '1rem' }}>
                    {title}
                </h3>
                <p style={{ color: '#4a5568', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    {message}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <button
                        style={cancelButtonStyle}
                        onClick={onCancel}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dce1e7'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#edf2f7'}
                    >
                        {cancelText}
                    </button>
                    <button
                        style={confirmButtonStyle}
                        onClick={onConfirm}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c53030'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e53e3e'}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

// トグルスイッチコンポーネント
const ToggleSwitch = ({ isChecked, onChange }) => {
    const styles = {
        toggleContainer: { display: 'inline-block', verticalAlign: 'middle', },
        toggleLabel: { display: 'block', width: '40px', height: '24px', backgroundColor: '#ccc', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'background-color 0.3s', },
        toggleLabelActive: { backgroundColor: '#48bb78', },
        toggleCircle: { position: 'absolute', top: '2px', left: '2px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white', transition: 'transform 0.3s', },
        toggleCircleActive: { transform: 'translateX(16px)', },
    };
    return (
        <div style={styles.toggleContainer} onClick={onChange}>
            <div style={{ ...styles.toggleLabel, ...(isChecked && styles.toggleLabelActive) }}>
                <div style={{ ...styles.toggleCircle, ...(isChecked && styles.toggleCircleActive) }}></div>
            </div>
        </div>
    );
};


// --- III. ロジック層 (カスタムフック) ---

const useScheduleManager = (initialApplicants) => {
    const [applicants] = useState(initialApplicants);
    const [interviewDuration, setInterviewDuration] = useState(15);
    const DURATION_OPTIONS = [1, 5, 10, 15, 20, 30, 45, 60];

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [selectedStartTime, setSelectedStartTime] = useState('09:00');

    const [draggingApplicantId, setDraggingApplicantId] = useState(null);
    const [isAddButtonActive, setIsAddButtonActive] = useState(false);
    const [hoveredCellId, setHoveredCellId] = useState(null);

    // クリック割り当て用の状態
    const [selectedSlot, setSelectedSlot] = useState(null);

    const [modalState, setModalState] = useState({
        isOpen: false, title: '', message: '', onConfirm: () => {},
    });

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
        const initialRows = sortTimeRows([calculateTimeRange('09:00', 15), calculateTimeRange('09:15', 15)]);
        const initialCols = sortDateCols(['12/01 (月)', '11/30 (日)']);

        const initialAssignments = Array(initialRows.length).fill(null).map(() => Array(initialCols.length).fill(null));
        initialAssignments[0][0] = 'app-1';

        const initialAvailability = Array(initialRows.length).fill(true).map(() => Array(initialCols.length).fill(true));

        return {
            rows: initialRows,
            cols: initialCols,
            assignments: initialAssignments,
            availability: initialAvailability,
        };
    });

    const getApplicantName = useCallback((applicantId) => {
        return applicants.find(app => app.id === applicantId)?.name || 'Unknown Applicant';
    }, [applicants]);


    // マトリックス再構築ヘルパー (行追加/削除時)
    const reconstructAssignments = (oldRows, newRows, oldAssignments, oldAvailability, oldCols) => {
        const newAssignments = Array(newRows.length).fill(null).map(() => Array(oldCols.length).fill(null));
        const newAvailability = Array(newRows.length).fill(null).map(() => Array(oldCols.length).fill(true));

        newRows.forEach((rowHeader, newRowIndex) => {
            const oldIndex = oldRows.findIndex(r => r === rowHeader);

            oldCols.forEach((_, newColIndex) => {
                if (oldIndex !== -1) {
                    newAssignments[newRowIndex][newColIndex] = oldAssignments[oldIndex][newColIndex];
                    newAvailability[newRowIndex][newColIndex] = oldAvailability[oldIndex][newColIndex];
                } else {
                    newAssignments[newRowIndex][newColIndex] = null;
                    newAvailability[newRowIndex][newColIndex] = true;
                }
            });
        });
        return { newAssignments, newAvailability };
    };

    // マトリックス再構築ヘルパー (列追加/削除時)
    const reconstructCols = (oldCols, newCols, oldRows, oldAssignments, oldAvailability) => {
        const newAssignments = oldRows.map(() => Array(newCols.length).fill(null));
        const newAvailability = oldRows.map(() => Array(newCols.length).fill(true));

        oldRows.forEach((_, rowIndex) => {
            newCols.forEach((colHeader, newColIndex) => {
                const oldIndex = oldCols.findIndex(c => c === colHeader);
                if (oldIndex !== -1) {
                    newAssignments[rowIndex][newColIndex] = oldAssignments[rowIndex][oldIndex];
                    newAvailability[rowIndex][newColIndex] = oldAvailability[rowIndex][oldIndex];
                } else {
                    newAssignments[rowIndex][newColIndex] = null;
                    newAvailability[rowIndex][newColIndex] = true;
                }
            });
        });
        return { newAssignments, newAvailability };
    };

    // --- 行・列の削除処理 ---
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
        if (scheduleData.rows.includes(newRowHeader)) return;

        setScheduleData(prevData => {
            const originalRows = prevData.rows;
            const newOriginalRows = [...originalRows, newRowHeader];
            const sortedNewRows = sortTimeRows(newOriginalRows);

            const { newAssignments, newAvailability } = reconstructAssignments(
                originalRows, sortedNewRows, prevData.assignments, prevData.availability, prevData.cols
            );

            const nextStart = getNextStartTime(sortedNewRows, '09:00');
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
        const weekday = ['日', '月', '火', '水', '木', '金', '土'][dateObj.getDay()];

        const [year, month, day] = selectedDate.split('-');
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
                    ? row.map((val, cIdx) => (cIdx === colIndex ? false : val))
                    : row
            );

            newAssignments[rowIndex][colIndex] = null;

            return { ...prevData, assignments: newAssignments, availability: newAvailability };
        });
        setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    }, []);

    const toggleSlotAvailability = useCallback((rowIndex, colIndex) => {
        const isCurrentlyAvailable = scheduleData.availability[rowIndex][colIndex];
        const assignedApplicantId = scheduleData.assignments[rowIndex][colIndex];
        const targetTime = scheduleData.rows[rowIndex];
        const targetDate = scheduleData.cols[colIndex];

        if (isCurrentlyAvailable && assignedApplicantId) {
            const applicantName = getApplicantName(assignedApplicantId);
            setModalState({
                isOpen: true,
                title: '割り当ての強制解除確認',
                message: `このスロット（${targetDate} ${targetTime}）には「${applicantName}」さんが割り当てられています。利用不可に設定すると、この割り当ては強制的に解除され、応募者リストに戻ります。実行しますか？`,
                onConfirm: () => performUnassignAndToggle(rowIndex, colIndex),
                confirmText: '強制解除して不可にする',
                cancelText: 'キャンセル (可のまま)',
            });
            return;
        }

        setScheduleData(prevData => {
            const newAvailability = prevData.availability.map((row, rIdx) =>
                rIdx === rowIndex
                    ? row.map((val, cIdx) => (cIdx === colIndex ? !val : val))
                    : row
            );
            return { ...prevData, availability: newAvailability };
        });
    }, [scheduleData, getApplicantName, performUnassignAndToggle]);

    // クリック割り当て処理
    const handleSlotClick = useCallback((rowIndex, colIndex, isAvailable) => {
        if (!isAvailable) {
            setSelectedSlot(null);
            return;
        }

        const currentSlot = { rowIndex, colIndex };
        const isCurrentSlotSelected = selectedSlot && selectedSlot.rowIndex === rowIndex && selectedSlot.colIndex === colIndex;

        // --- 修正点: スロット間のスワップ処理 (Slot A が選択されている状態で Slot B がクリックされた場合) ---
        if (selectedSlot && !isCurrentSlotSelected) {
            const fromRowIndex = selectedSlot.rowIndex;
            const fromColIndex = selectedSlot.colIndex;

            setScheduleData(prevData => {
                const newAssignments = prevData.assignments.map(row => [...row]);

                // Applicant A (Source) と Applicant B (Target) のIDを取得
                const applicantA = newAssignments[fromRowIndex][fromColIndex];
                const applicantB = newAssignments[rowIndex][colIndex];

                // 1. スロット A に スロット B の応募者 (Applicant B) を割り当てる (nullも許容)
                newAssignments[fromRowIndex][fromColIndex] = applicantB;

                // 2. スロット B に スロット A の応募者 (Applicant A) を割り当てる (nullも許容)
                newAssignments[rowIndex][colIndex] = applicantA;

                return { ...prevData, assignments: newAssignments };
            });

            // スワップ後は選択を解除
            setSelectedSlot(null);
            return;
        }
        // --- 通常の選択/解除処理 ---

        setSelectedSlot(prev =>
            isCurrentSlotSelected
                ? null
                : currentSlot
        );
    }, [selectedSlot]);

    const handleApplicantClick = useCallback((applicantId) => {
        if (!selectedSlot) return;

        const { rowIndex, colIndex } = selectedSlot;

        // 修正点: 既に割り当て済みでも処理を続行し、上書き（リストとのスワップ）を許可する
        // if (scheduleData.assignments[rowIndex][colIndex] !== null) return; // 削除

        setScheduleData(prevData => {
            const newAssignments = prevData.assignments.map(row => [...row]);

            // 1. スロットから同じ応募者を解除する（他のスロットから移動させるため）
            let foundSource = false;
            for (let r = 0; r < newAssignments.length; r++) {
                for (let c = 0; c < newAssignments[r].length; c++) {
                    if (newAssignments[r][c] === applicantId) {
                        newAssignments[r][c] = null;
                        foundSource = true;
                        break;
                    }
                }
                if (foundSource) break;
            }

            // 2. 選択されたスロットに割り当てる (既存の割り当てがあれば上書きされる)
            newAssignments[rowIndex][colIndex] = applicantId;

            return { ...prevData, assignments: newAssignments };
        });

        setSelectedSlot(null); // 割り当て完了後、選択解除
    }, [selectedSlot, scheduleData.assignments]);


    // --- D&D ロジック (変更なし) ---
    const handleDragStart = useCallback((e, applicantId, sourceCellId = null) => {
        e.dataTransfer.setData('applicantId', applicantId);
        e.dataTransfer.setData('sourceCellId', sourceCellId || 'applicant-list');
        setDraggingApplicantId(applicantId);
        e.dataTransfer.effectAllowed = "move";
        setSelectedSlot(null); // D&D開始時、クリック選択を解除
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

    const handleDrop = useCallback((e, targetId) => {
        e.preventDefault();
        setHoveredCellId(null);
        setSelectedSlot(null); // D&D完了時、クリック選択を解除

        const applicantId = e.dataTransfer.getData('applicantId');
        const sourceCellId = e.dataTransfer.getData('sourceCellId');

        const targetParts = targetId.split('-');
        const targetIsGrid = targetParts.length === 3;
        const targetRowIndex = targetIsGrid ? parseInt(targetParts[1], 10) : -1;
        const targetColIndex = targetIsGrid ? parseInt(targetParts[2], 10) : -1;

        const sourceParts = sourceCellId.split('-');
        const sourceIsGrid = sourceParts.length === 3;
        const sourceRowIndex = sourceIsGrid ? parseInt(sourceParts[1], 10) : -1;
        const sourceColIndex = sourceIsGrid ? parseInt(sourceParts[2], 10) : -1;

        if (targetIsGrid) {
            if (!scheduleData.availability[targetRowIndex][targetColIndex]) return;
        }

        if (targetId === 'applicant-list') {
            if (sourceIsGrid) {
                setScheduleData(prevData => {
                    const newAssignments = prevData.assignments.map(row => [...row]);
                    newAssignments[sourceRowIndex][sourceColIndex] = null;
                    return { ...prevData, assignments: newAssignments };
                });
            }
            setDraggingApplicantId(null);
            return;
        }

        if (!targetIsGrid || targetRowIndex < 0 || targetColIndex < 0) {
            setDraggingApplicantId(null);
            return;
        }

        setScheduleData(prevData => {
            const newAssignments = prevData.assignments.map(row => [...row]);
            const targetApplicantId = newAssignments[targetRowIndex][targetColIndex];

            if ((sourceIsGrid && sourceRowIndex === targetRowIndex && sourceColIndex === targetColIndex) ||
                (!sourceIsGrid && targetApplicantId !== null && applicantId === targetApplicantId)) {
                return prevData;
            }

            if (targetApplicantId === null) {
                newAssignments[targetRowIndex][targetColIndex] = applicantId;

                if (sourceIsGrid && sourceRowIndex !== -1 && sourceColIndex !== -1) {
                    newAssignments[sourceRowIndex][sourceColIndex] = null;
                }

            } else if (sourceIsGrid && sourceRowIndex !== undefined && sourceColIndex !== undefined) {
                newAssignments[targetRowIndex][targetColIndex] = applicantId;
                newAssignments[sourceRowIndex][sourceColIndex] = targetApplicantId;
            } else if (!sourceIsGrid) {
                 // リストからのドロップで、ターゲットスロットが埋まっている場合 (リストとのスワップ)
                 // リストの応募者(applicantId)をターゲットに割り当て、ターゲットの応募者(targetApplicantId)はリストに戻る
                 newAssignments[targetRowIndex][targetColIndex] = applicantId;
            }

            return { ...prevData, assignments: newAssignments };
        });

        setDraggingApplicantId(null);
    }, [scheduleData.availability]);

    // スタイル (動的な部分をuseMemoに含める)
    const styles = useMemo(() => ({
        container: { display: 'flex', justifyContent: 'space-between', padding: '1.5rem', height: '100vh', backgroundColor: '#f8f8f8', fontFamily: 'Inter, sans-serif', },
        panel: { padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', backgroundColor: 'white', height: '100%', overflowY: 'auto', },
        leftPanel: { flex: 1, marginRight: '1.5rem', minWidth: '400px', },
        rightPanel: { width: '300px', },
        baseItem: { padding: '0.75rem 1rem', margin: '0.75rem 0', borderRadius: '0.5rem', textAlign: 'center', fontWeight: '600', transition: 'all 0.2s ease-in-out', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', cursor: 'grab', },
        scheduledApplicant: { padding: '0.5rem', width: '90%', backgroundColor: '#4299e1', color: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', cursor: 'move', margin: '0.25rem 0', },
        button: { padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.1s ease-in-out', border: 'none', },
        navButton: { backgroundColor: '#718096', color: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', marginRight: '1rem', },
        activeNavButton: { backgroundColor: '#2d3748', },
        addButton: {
            backgroundColor: isAddButtonActive ? '#38a169' : '#48bb78',
            transform: isAddButtonActive ? 'translateY(1px)' : 'translateY(0)',
            color: 'white',
            boxShadow: isAddButtonActive ? '0 2px 4px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            marginRight: '0.5rem',
        },
        deleteButton: { backgroundColor: 'transparent', color: '#e53e3e', fontSize: '1rem', fontWeight: '700', padding: '0 0.5rem', cursor: 'pointer', marginLeft: 'auto', transition: 'color 0.1s', },
        inputStyle: { border: '1px solid #ccc', borderRadius: '0.3rem', padding: '0.5rem 0.75rem', marginRight: '1rem', minWidth: '100px', backgroundColor: '#fff', },
    }), [isAddButtonActive]);

    const getSlotStyle = useCallback((cellId, isAvailable, isSelected) => ({
        minWidth: '150px',
        minHeight: '80px',
        // 境界線: 利用可能（isAvailable: true）で、選択/ホバーされていないときの境界線色を #718096 に変更
        border: `2px ${hoveredCellId === cellId || isSelected ? 'solid' : 'dashed'} ${isAvailable ? (isSelected ? '#38a169' : '#718096') : '#cbd5e0'}`,
        borderRadius: '0.5rem',
        margin: '0.25rem',
        padding: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // 背景色: 利用不可時の色を極めて薄いグレーに
        backgroundColor: isAvailable
            ? (hoveredCellId === cellId ? '#e2e8f0' : (isSelected ? '#e6fffa' : '#edf2f7'))
            : (hoveredCellId === cellId ? '#e2e8f0' : '#f7fafc'),
        // テキスト色: 利用不可時の色を濃いグレーに
        color: isAvailable ? '#4a5568' : '#a0aec0',
        fontWeight: '500',
        transition: 'all 0.2s ease-in-out',
        cursor: isAvailable ? 'pointer' : 'default',
        pointerEvents: isAvailable ? 'auto' : 'none',
    }), [hoveredCellId]);

    // UIに公開するロジックと状態
    return {
        // データ
        scheduleData, applicants,
        modalState, setModalState,
        interviewDuration, DURATION_OPTIONS, setInterviewDuration,
        selectedDate, setSelectedDate,
        selectedStartTime, setSelectedStartTime, TIME_OPTIONS,
        draggingApplicantId, isAddButtonActive, setIsAddButtonActive,
        selectedSlot,

        // 関数
        getApplicantName,
        handleAddRow, handleDeleteRow,
        handleAddColFromPicker, handleDeleteCol,
        toggleSlotAvailability,
        handleDragStart, handleDragEnd, handleDragOver, handleDrop, handleDragEnter, handleDragLeave,
        handleSlotClick,
        handleApplicantClick,

        // スタイル/レンダリングヘルパー
        styles, getSlotStyle,
    };
};


// --- IV. プレゼンテーションコンポーネント (UI層) ---

const ScheduleBoard = ({ manager }) => {
    const {
        scheduleData, getApplicantName, handleDragOver, handleDrop,
        handleDragStart, handleDragEnd, handleDragEnter, handleDragLeave,
        draggingApplicantId, styles, getSlotStyle,
        selectedSlot,
        handleSlotClick
    } = manager;

    const { rows: sortedRows, cols: sortedCols } = scheduleData;

    return (
        <div style={{ ...styles.panel, ...styles.leftPanel }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '800', marginBottom: '1rem', color: '#2d3748' }}>
              📅 面接スケジュールボード (2次元)
            </h1>
            <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
                スロット選択後、右側の応募者をクリックして割り当てることも可能です。
            </p>

            {sortedRows.length === 0 || sortedCols.length === 0 ? (
                <p style={{textAlign: 'center', color: '#e53e3e', padding: '5rem', border: '1px dashed #e53e3e', borderRadius: '0.5rem'}}>
                    スロットが設定されていません。「スロット設定」画面で時間帯と日付を追加してください。
                </p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '600px' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid #e2e8f0', backgroundColor: '#f7fafc', padding: '0.5rem', minWidth: '150px' }}>時間帯</th>
                                {sortedCols.map((colHeader, sortedColIndex) => (
                                    <th key={sortedColIndex} style={{ border: '1px solid #e2e8f0', backgroundColor: '#e2e8f0', padding: '0.75rem', fontWeight: '700', color: '#2d3748' }}>
                                        {colHeader}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedRows.map((rowHeader, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td style={{ border: '1px solid #e2e8f0', backgroundColor: '#f7fafc', padding: '0.75rem', fontWeight: '700', color: '#2d3748' }}>
                                        {rowHeader}
                                    </td>
                                    {sortedCols.map((_, colIndex) => {
                                        const cellId = `slot-${rowIndex}-${colIndex}`;

                                        const applicantId = scheduleData.assignments[rowIndex][colIndex];
                                        const isAvailable = scheduleData.availability[rowIndex][colIndex];

                                        const isSelected = selectedSlot && selectedSlot.rowIndex === rowIndex && selectedSlot.colIndex === colIndex;

                                        const hasAssignmentOnUnavailableSlot = applicantId && !isAvailable;

                                        return (
                                            <td
                                                key={colIndex}
                                                style={{ border: '1px solid #e2e8f0', verticalAlign: 'top', padding: '0.5rem' }}
                                                onDragOver={handleDragOver}
                                                onDragEnter={(e) => handleDragEnter(e, cellId)}
                                                onDragLeave={handleDragLeave}
                                                onDrop={isAvailable ? (e) => handleDrop(e, cellId) : null}
                                                onClick={() => handleSlotClick(rowIndex, colIndex, isAvailable)}
                                            >
                                                <div style={getSlotStyle(cellId, isAvailable, isSelected)}>
                                                    {applicantId ? (
                                                        <div
                                                            style={{
                                                                ...styles.baseItem,
                                                                ...styles.scheduledApplicant,
                                                                ...(draggingApplicantId === applicantId ? {opacity: 0.4, boxShadow: 'none'} : {}),
                                                                backgroundColor: hasAssignmentOnUnavailableSlot ? '#ed8936' : '#4299e1',
                                                                cursor: 'move',
                                                            }}
                                                            draggable="true"
                                                            onDragStart={(e) => handleDragStart(e, applicantId, cellId)}
                                                            onDragEnd={handleDragEnd}
                                                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 10px rgba(0,0,0,0.2)'}
                                                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = styles.scheduledApplicant.boxShadow}
                                                        >
                                                            {getApplicantName(applicantId)}
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: isAvailable ? (isSelected ? '#38a169' : '#a0aec0') : '#a0aec0', fontWeight: '700' }}>
                                                            {isSelected ? '✓ 選択中' : (isAvailable ? 'ここにドロップ/選択' : '利用不可 🚫')}
                                                        </span>
                                                    )}
                                                    {hasAssignmentOnUnavailableSlot && (
                                                        <span style={{ fontSize: '0.75rem', color: '#fff', backgroundColor: '#c53030', padding: '2px 4px', borderRadius: '4px', marginTop: '4px' }}>
                                                            ⚠️要解除
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// ... (SettingsScreen は変更なし) ...

const SettingsScreen = ({ manager }) => {
    const {
        scheduleData, interviewDuration, DURATION_OPTIONS, setInterviewDuration,
        selectedDate, setSelectedDate, selectedStartTime, setSelectedStartTime, TIME_OPTIONS,
        handleAddRow, handleDeleteRow, handleAddColFromPicker, handleDeleteCol,
        isAddButtonActive, setIsAddButtonActive, styles
    } = manager;

    const { rows: sortedRows, cols: sortedCols } = scheduleData;

    return (
        <div style={{ ...styles.panel, ...styles.leftPanel }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '800', marginBottom: '1rem', color: '#2d3748' }}>
              ⚙️ スロット設定
            </h1>
            <p style={{ color: '#718096', marginBottom: '1.5rem' }}>面談時間、時間帯（縦軸）、日付（横軸）を設定します。</p>

            {/* --- 面談時間設定 --- */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2d3748', borderBottom: '2px solid #edf2f7', paddingBottom: '0.5rem', marginTop: '1.5rem' }}>
                ⏱️ 面談時間 (スロットの長さ)
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem', marginBottom: '2rem' }}>
                <span style={{ marginRight: '1rem', fontWeight: '500', color: '#4a5568' }}>面談時間:</span>
                <select
                    value={interviewDuration}
                    onChange={(e) => setInterviewDuration(parseInt(e.target.value, 10))}
                    style={styles.inputStyle}
                >
                    {DURATION_OPTIONS.map(d => (
                        <option key={d} value={d}>{d} 分</option>
                    ))}
                </select>
                <span style={{ color: '#718096', marginLeft: '1rem', fontSize: '0.875rem' }}>
                    時間帯の追加は、この設定（{interviewDuration}分）に基づいて自動計算されます。
                </span>
            </div>

            {/* --- 時間帯（行）設定 --- */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2d3748', borderBottom: '2px solid #edf2f7', paddingBottom: '0.5rem', marginTop: '3rem' }}>
                ⏰ 時間帯 (縦軸) の追加と管理 - 昇順
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem', marginBottom: '1.5rem' }}>
                 <span style={{ marginRight: '1rem', fontWeight: '500', color: '#4a5568' }}>開始時刻:</span>
                 <select
                    value={selectedStartTime}
                    onChange={(e) => setSelectedStartTime(e.target.value)}
                    style={styles.inputStyle}
                 >
                    {TIME_OPTIONS.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                 </select>

                 <button
                    style={{ ...styles.button, ...styles.addButton }}
                    onClick={handleAddRow}
                    onMouseDown={() => setIsAddButtonActive(true)}
                    onMouseUp={() => setIsAddButtonActive(false)}
                    onMouseLeave={() => setIsAddButtonActive(false)}
                >
                  + 時間帯 ({interviewDuration}分間) を追加
                </button>
            </div>
            <div style={{ maxWidth: '600px', maxHeight: '200px', overflowY: 'auto', border: '1px solid #edf2f7', borderRadius: '0.5rem', padding: '0.5rem' }}>
                {sortedRows.map((rowHeader, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0.5rem', borderBottom: '1px solid #edf2f7' }}>
                        <span style={{ fontWeight: '700', color: '#718096', minWidth: '30px' }}>
                            {index + 1}.
                        </span>
                        <span style={{ fontWeight: '600', color: '#2d3748', flexGrow: 1 }}>
                            {rowHeader}
                        </span>
                        <span style={{ color: '#718096', fontSize: '0.875rem', marginRight: '1rem' }}>
                            ({sortedCols.length}スロット)
                        </span>
                        <button
                            style={styles.deleteButton}
                            onClick={() => handleDeleteRow(index)}
                            title="この時間帯を削除"
                            onMouseEnter={(e) => e.currentTarget.style.color = '#c53030'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#e53e3e'}
                        >
                            削除 &times;
                        </button>
                    </div>
                ))}
                {sortedRows.length === 0 && (
                     <p style={{textAlign: 'center', color: '#718096', padding: '1rem'}}>
                        時間帯がありません。
                    </p>
                )}
            </div>

            {/* --- 日付（列）設定 --- */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2d3748', borderBottom: '2px solid #edf2f7', paddingBottom: '0.5rem', marginTop: '3rem' }}>
                🗓️ 日付 (横軸) の追加と管理 - 昇順
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem', marginBottom: '1.5rem' }}>
                 <span style={{ marginRight: '1rem', fontWeight: '500', color: '#4a5568' }}>日付選択:</span>
                 <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={styles.inputStyle}
                 />

                 <button
                    style={{ ...styles.button, ...styles.addButton }}
                    onClick={handleAddColFromPicker}
                >
                  + 選択した日付を追加
                </button>
            </div>
            <div style={{ maxWidth: '600px', maxHeight: '200px', overflowY: 'auto', border: '1px solid #edf2f7', borderRadius: '0.5rem', padding: '0.5rem' }}>
                {sortedCols.map((colHeader, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0.5rem', borderBottom: '1px solid #edf2f7' }}>
                        <span style={{ fontWeight: '700', color: '#718096', minWidth: '30px' }}>
                            {index + 1}.
                        </span>
                        <span style={{ fontWeight: '600', color: '#2d3748', flexGrow: 1 }}>
                            {colHeader}
                        </span>
                        <span style={{ color: '#718096', fontSize: '0.875rem', marginRight: '1rem' }}>
                             ({sortedRows.length}スロット)
                        </span>
                        <button
                            style={styles.deleteButton}
                            onClick={() => handleDeleteCol(index)}
                            title="この列を削除"
                            onMouseEnter={(e) => e.currentTarget.style.color = '#c53030'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#e53e3e'}
                        >
                            削除 &times;
                        </button>
                    </div>
                ))}
                {sortedCols.length === 0 && (
                     <p style={{textAlign: 'center', color: '#718096', padding: '1rem'}}>
                        日付がありません。
                    </p>
                )}
            </div>
        </div>
    );
};

const SlotSettingsPanel = ({ manager }) => {
    const { scheduleData, getApplicantName, toggleSlotAvailability, styles } = manager;

    return (
        <div style={{ ...styles.panel, ...styles.rightPanel, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: '#2d3748' }}>
              ✅ スロット利用可否設定
            </h2>
            <p style={{ color: '#718096', marginBottom: '1rem', fontSize: '0.875rem' }}>
                 「可」に設定されたスロットのみ、応募者をドロップできます。
                 割り当て済みのスロットを「不可」にすると、割り当てが強制的に解除されます。
            </p>

            {/* スロット個別設定リスト */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
                {scheduleData.rows.length === 0 && scheduleData.cols.length === 0 ? (
                    <p style={{ color: '#718096', textAlign: 'center', padding: '1rem' }}>
                        スロットがありません。左側で追加してください。
                    </p>
                ) : (
                    scheduleData.rows.map((rowHeader, rowIndex) => (
                        scheduleData.cols.map((colHeader, colIndex) => {
                            const isAvailable = scheduleData.availability[rowIndex][colIndex];
                            const assignmentId = scheduleData.assignments[rowIndex][colIndex];

                            return (
                                <div key={`${rowIndex}-${colIndex}`} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.75rem 0.5rem',
                                    borderBottom: '1px dashed #edf2f7',
                                    backgroundColor: isAvailable ? '#f7fff8' : '#fff7f7',
                                }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#2d3748', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                            {colHeader}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#718096' }}>
                                            {rowHeader}
                                        </div>
                                        {assignmentId && (
                                            <div style={{ fontSize: '0.75rem', color: '#4299e1', marginTop: '2px' }}>
                                                (割当済: {getApplicantName(assignmentId)})
                                            </div>
                                        )}
                                    </div>

                                    <span style={{
                                        marginRight: '0.75rem',
                                        fontWeight: '700',
                                        // 設定パネル内の利用不可テキストは赤のままにし、危険な状態であることを示します
                                        color: isAvailable ? '#48bb78' : '#f56565',
                                    }}>
                                        {isAvailable ? '可' : '不可'}
                                    </span>

                                    <ToggleSwitch
                                        isChecked={isAvailable}
                                        onChange={() => toggleSlotAvailability(rowIndex, colIndex)}
                                    />
                                </div>
                            );
                        })
                    ))
                )}
            </div>
        </div>
    );
};

const ApplicantList = ({ manager }) => {
    const {
        applicants, scheduleData, handleDragOver, handleDrop,
        handleDragStart, handleDragEnd, draggingApplicantId, styles,
        selectedSlot,
        handleApplicantClick
    } = manager;

    const assignedIds = useMemo(() => scheduleData.assignments.flat().filter(id => id !== null), [scheduleData.assignments]);

    return (
        <div
            style={{ ...styles.panel, ...styles.rightPanel }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'applicant-list')}
        >
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: '#2d3748' }}>
              🧑‍💻 応募者リスト
            </h2>
            <p style={{ color: '#718096', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {selectedSlot
                    ? '↑ スロットが選択されています。応募者をクリックして割り当ててください。'
                    : '※スロットからここにドロップすると割り当て解除されます'
                }
            </p>
            <div className="applicant-list" style={{ overflowY: 'auto', flex: 1 }}>
                {applicants.map(applicant => (
                    !assignedIds.includes(applicant.id) && (
                        <div
                            key={applicant.id}
                            draggable="true"
                            onDragStart={(e) => handleDragStart(e, applicant.id)}
                            onDragEnd={handleDragEnd}
                            onClick={() => handleApplicantClick(applicant.id)}
                            style={{
                                ...styles.baseItem,
                                // スロット選択中はクリック可能な要素であることを示唆する色に変更
                                backgroundColor: selectedSlot ? '#d1f1da' : '#ebf8ff',
                                border: `1px solid ${selectedSlot ? '#48bb78' : '#90cdf4'}`,
                                cursor: selectedSlot ? 'pointer' : 'grab',
                                ...(draggingApplicantId === applicant.id ? {opacity: 0.4, boxShadow: 'none'} : {}),
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = selectedSlot ? '#c4e0f5' : '#c4e0f5'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedSlot ? '#d1f1da' : '#ebf8ff'}
                        >
                            {applicant.name}
                        </div>
                    )
                ))}
              {assignedIds.length === applicants.length && (
                <p style={{textAlign: 'center', marginTop: '2rem', color: '#48bb78', fontWeight: '700'}}>
                    ✅ 全ての応募者が割り当てられました！
                </p>
              )}
            </div>
          </div>
    );
};


// --- V. メインコンポーネント (統合層) ---

const App = () => {
    // 初期応募者データはここで保持し、フックに渡す
    const initialApplicants = [
        { id: 'app-1', name: '佐藤 太郎' },
        { id: 'app-2', name: '山田 花子' },
        { id: 'app-3', name: '田中 一郎' },
        { id: 'app-4', name: '鈴木 美咲' },
    ];

    // 1. ロジック層からすべての機能を取得
    const manager = useScheduleManager(initialApplicants);

    // 2. UI表示の状態とナビゲーションを管理
    const [view, setView] = useState('schedule');

    // 3. プレゼンテーションコンポーネントに委譲
    const renderMainPanel = () => {
        return view === 'schedule'
            ? <ScheduleBoard manager={manager} />
            : <SettingsScreen manager={manager} />;
    };

    const renderRightPanel = () => {
        return view === 'schedule'
            ? <ApplicantList manager={manager} />
            : <SlotSettingsPanel manager={manager} />;
    };

    return (
        <div style={manager.styles.container}>

            {/* 画面切り替えナビゲーション */}
            <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10 }}>
                <button
                    style={{
                        ...manager.styles.button,
                        ...manager.styles.navButton,
                        ...(view === 'schedule' ? manager.styles.activeNavButton : {}),
                    }}
                    onClick={() => setView('schedule')}
                >
                    スケジュールボード
                </button>
                <button
                    style={{
                        ...manager.styles.button,
                        ...manager.styles.navButton,
                        ...(view === 'settings' ? manager.styles.activeNavButton : {}),
                    }}
                    onClick={() => setView('settings')}
                >
                    スロット設定
                </button>
            </div>

            {/* 左側メインパネル (委譲) */}
            {renderMainPanel()}

            {/* 右側パネル (委譲) */}
            {renderRightPanel()}

            {/* 削除確認モーダル (ロジック層から受け取った状態と関数を使用) */}
            <ConfirmationModal
                isOpen={manager.modalState.isOpen}
                title={manager.modalState.title}
                message={manager.modalState.message}
                onConfirm={manager.modalState.onConfirm}
                onCancel={() => manager.setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
            />
        </div>
    );
};

export default App;