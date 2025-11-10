// src/hooks/scheduleReducer.js

// 🚨 timeUtils.js に分離済みのヘルパー関数をインポート
import { sortTimeRows, sortDateCols, calculateTimeRange, getNextStartTime } from '../utils/timeUtils';

// --- Reducerヘルパー関数 (再構築ロジック) ---

const reconstructAssignments = (oldRows, newRows, oldAssignments, oldAvailability, oldCols) => {
    const newAssignments = Array(newRows.length).fill(null).map(() => Array(oldCols.length).fill(null));
    const newAvailability = Array(newRows.length).fill(null).map(() => Array(oldCols.length).fill(true));

    newRows.forEach((rowHeader, newRowIndex) => {
        const rowStartTime = rowHeader.split(' - ')[0];
        const oldIndex = oldRows.findIndex(r => r.startsWith(rowStartTime + ' -'));

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

// --- スケジュールデータ Reducer ---

export const scheduleReducer = (state, action) => {
    const { rows, cols, assignments, availability } = state;

    switch (action.type) {

        // 1. 面談時間帯の追加
        case 'ADD_ROW': {
            const { selectedStartTime, interviewDuration } = action.payload;
            const newRowHeader = calculateTimeRange(selectedStartTime, interviewDuration);
            const newRowStartTime = newRowHeader.split(' - ')[0];

            // 既に同じ開始時刻が存在する場合は処理を中断 (堅牢性の担保)
            if (rows.some(row => row.startsWith(newRowStartTime + ' -'))) {
                return state;
            }

            const newOriginalRows = [...rows, newRowHeader];
            const sortedNewRows = sortTimeRows(newOriginalRows);

            const { newAssignments, newAvailability } = reconstructAssignments(
                rows, sortedNewRows, assignments, availability, cols
            );

            // 次の開始時刻を計算 (UI側で利用するため、return値には含めない)

            return {
                ...state,
                rows: sortedNewRows,
                assignments: newAssignments,
                availability: newAvailability,
            };
        }

        // 2. 面談時間帯の削除
        case 'DELETE_ROW': {
            const { rowIndex } = action.payload;

            const newOriginalRows = rows.filter((_, i) => i !== rowIndex);
            const newAssignments = assignments.filter((_, i) => i !== rowIndex);
            const newAvailability = availability.filter((_, i) => i !== rowIndex);
            const sortedNewRows = sortTimeRows(newOriginalRows);

            return {
                ...state,
                rows: sortedNewRows,
                assignments: newAssignments,
                availability: newAvailability,
            };
        }

        // 3. 日付列の追加
        case 'ADD_COL': {
            const { newHeader } = action.payload;
            if (cols.includes(newHeader)) return state;

            const newOriginalCols = [...cols, newHeader];
            const sortedNewCols = sortDateCols(newOriginalCols);

            const { newAssignments, newAvailability } = reconstructCols(
                cols, sortedNewCols, rows, assignments, availability
            );

            return {
                ...state,
                cols: sortedNewCols,
                assignments: newAssignments,
                availability: newAvailability,
            };
        }

        // 4. 日付列の削除
        case 'DELETE_COL': {
            const { colIndex } = action.payload;

            const newOriginalCols = cols.filter((_, i) => i !== colIndex);
            const newAssignments = assignments.map(row =>
                row.filter((_, i) => i !== colIndex)
            );
            const newAvailability = availability.map(row =>
                row.filter((_, i) => i !== colIndex)
            );
            const sortedNewCols = sortDateCols(newOriginalCols);

            return {
                ...state,
                cols: sortedNewCols,
                assignments: newAssignments,
                availability: newAvailability,
            };
        }

        // 5. スロットの利用可否切り替え
        case 'TOGGLE_AVAILABILITY': {
            const { rowIndex, colIndex, clearAssignment } = action.payload;

            const newAvailability = availability.map((row, rIdx) =>
                rIdx === rowIndex
                    ? row.map((val, cIdx) => (cIdx === colIndex ? !val : val))
                    : row
            );

            let newAssignments = assignments;
            if (clearAssignment) {
                // 割り当てを解除する場合（強制解除時）
                newAssignments = assignments.map((row, rIdx) => [...row]);
                newAssignments[rowIndex][colIndex] = null;
            }

            return {
                ...state,
                assignments: newAssignments,
                availability: newAvailability
            };
        }

        // 6. 割り当て（D&D、クリック）の実行
        case 'EXECUTE_ASSIGNMENT': {
            const { newAssignments } = action.payload;
            return {
                ...state,
                assignments: newAssignments,
            };
        }

        // 7. 児童（生徒）の削除に伴う割り当て解除
        case 'CLEAR_ASSIGNMENT_BY_APPLICANT_ID': {
            const { applicantId } = action.payload;
            const newAssignments = assignments.map(row =>
                row.map(id => id === applicantId ? null : id)
            );
            return { ...state, assignments: newAssignments };
        }

        default:
            return state;
    }
};