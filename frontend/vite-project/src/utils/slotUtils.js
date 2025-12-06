/**
 * スロットID文字列 ('slot-R-C') からインデックスオブジェクト { rowIndex, colIndex } を抽出する
 * @param {string} slotId - スケジュールスロットの一意なID (例: 'slot-0-1')
 * @returns {{rowIndex: number, colIndex: number} | null} インデックスオブジェクト、または無効なIDの場合は null
 */
export const parseSlotId = (slotId) => {
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