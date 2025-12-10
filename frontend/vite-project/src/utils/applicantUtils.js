// applicantUtils.js

/**
 * IDに基づいて児童データを検索します。
 * @param {string | number} id 検索対象の児童ID。
 * @param {Array<object>} applicants 全児童データの配列。
 * @returns {object | undefined} 一致する児童データ、または見つからなかった場合は undefined。
 */
export const getApplicantById = (id, applicants) => {
    // Array.find() を利用して、効率的に目的の applicant を検索
    return applicants.find(applicant => applicant.id === id);
};

/**
 * 割り当て済みの児童IDのSetを生成します。
 * @param {Array<Array<object | null>>} assignments スケジュール全体の割り当てデータ。
 * @returns {Set<string | number>} 割り当て済みIDのSet
 */
export const getRegisteredIdsSet = (assignments) => {
    const registeredIds = new Set();
    assignments.forEach(row => {
        row.forEach(assignment => {
            if (assignment && assignment.applicantId) {
                registeredIds.add(assignment.applicantId);
            }
        });
    });
    return registeredIds;
};