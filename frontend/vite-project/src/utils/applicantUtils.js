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
 * 未割り当ての児童リストを生成します。
 * @param {Array<object>} applicants 全児童データの配列。
 * @param {Array<Array<object | null>>} assignments スケジュール全体の割り当てデータ。
 * @returns {Array<object>} 未割り当ての児童データの配列。
 */
export const getUnregisteredApplicants = (applicants, assignments) => {
    // 1. assignments から、割り当て済みの全ての applicantId を Set に抽出
    const registeredIds = new Set();

    // assignments は二次元配列なので、flatMap のような処理でIDsを平坦化
    assignments.forEach(row => {
        row.forEach(assignment => {
            if (assignment && assignment.applicantId) {
                registeredIds.add(assignment.applicantId);
            }
        });
    });

    // 2. applicants から、registeredIds に含まれない児童をフィルタリング
    return applicants.filter(applicant => !registeredIds.has(applicant.id));
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