// applicantUtils.js
// import { number } from 'zod';
import { Applicant } from '../types/Students';
import { ScheduleData } from '../types/ScheduleManager';

/**
 * IDに基づいて児童データを検索します。
 * @param {string | number} id 検索対象の児童ID。
 * @param {Array<object>} applicants 全児童データの配列。
 * @returns {object | undefined} 一致する児童データ、または見つからなかった場合は undefined。
 */
export const getApplicantById = (id: string, applicants: Applicant[]): Applicant | undefined => {
    // Array.find() を利用して、効率的に目的の applicant を検索
    const applicant = applicants.find(applicant => applicant.id === id);
    return applicant;
};

/**
 * 割り当て済みの児童IDのSetを生成します。
 * @param {Array<Array<object | null>>} assignments スケジュール全体の割り当てデータ。
 * @returns {Set<string | number>} 割り当て済みIDのSet
 */
export const getCurrentAssignment = (applicantId: string, scheduleData: ScheduleData) => {
    const rowsLength = scheduleData.rows.length;
    const colsLength = scheduleData.cols.length;
    const { assignments, rows, cols } = scheduleData;

    for (let r = 0; r < rowsLength; r++) {
        for (let c = 0; c < colsLength; c++) {
            if (assignments[r][c] === applicantId) {
                return {
                    rowIndex: r,
                    colIndex: c,
                    // 見つけた瞬間に、DBの定義から直接「値」を取得する
                    time: rows[r],
                    date: cols[c]
                };
            }
        }
    }
    return null;
};