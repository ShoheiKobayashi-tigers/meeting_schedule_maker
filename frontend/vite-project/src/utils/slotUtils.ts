/**
 * スロットID文字列 ('slot-R-C') からインデックスオブジェクト { rowIndex, colIndex } を抽出する
 * @param {string} slotId - スケジュールスロットの一意なID (例: 'slot-0-1')
 * @returns {{rowIndex: number, colIndex: number} | null} インデックスオブジェクト、または無効なIDの場合は null
 */
export const parseSlotId = (slotId: string) => {
    // 'slot-R-C' を '-' で分割
    const parts = slotId.split('-');

    // 長さチェック: ['slot', 'R', 'C'] の3要素が必要
    if (parts.length !== 3 || parts[0] !== 'slot') {
        return null;
    }

    const rowIndex = parseInt(parts[1], 10);
    const colIndex = parseInt(parts[2], 10);

    // 数値変換のチェック
    if (isNaN(rowIndex) || isNaN(colIndex)) {
        return null;
    }

    return { rowIndex, colIndex };
};

/**
 * インデックスオブジェクト { rowIndex, colIndex } からスロットID文字列を生成する
 * @param {number} rowIndex - 行インデックス
 * @param {number} colIndex - 列インデックス
 * @returns {string} スロットID文字列 (例: 'slot-0-1')
 */
export const createSlotId = (rowIndex, colIndex) => {
    return `slot-${rowIndex}-${colIndex}`;
};

/**
 * 指定された applicantId が割り当てられている面談枠の位置 ({rowIndex, colIndex}) を検索して返します。
 *
 * @param {string | number} applicantId 検索対象の児童ID。
 * @param {Array<Array<object | null>>} assignments スケジュール全体の割り当てデータ。
 * @returns {{rowIndex: number, colIndex: number} | null} 位置情報、見つからなかった場合は null。
 */
export const findSlotByApplicantId = (applicantId, assignments) => {
    if (!assignments) {
        return null;
    }

    // assignments (二次元配列) をループして、一致する applicantId を探す
    for (let r = 0; r < assignments.length; r++) {
        const row = assignments[r];
        for (let c = 0; c < row.length; c++) {
            const assignment = row[c];

            // 割り当てオブジェクトが存在し、かつ applicantId が一致する場合
            if (assignment && assignment.applicantId === applicantId) {
                // 位置情報 ({rowIndex, colIndex}) を返して検索を終了
                return {
                    rowIndex: r,
                    colIndex: c
                };
            }
        }
    }

    // 全て検索しても見つからなかった場合
    return null;
};