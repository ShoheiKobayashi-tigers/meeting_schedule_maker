/**
 * 時間帯ヘッダー ("HH:mm - HH:mm") を開始時刻でソートする
 */
export const sortTimeRows = (rows: string[]): string[] => {
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
export const sortDateCols = (cols: string[]): string[] => {
    return [...cols].sort((a, b) => {
        // MM/DD (曜日) から MM/DD の部分のみを抽出
        const datePartA = a.substring(0, a.indexOf(' '));
        const datePartB = b.substring(0, b.indexOf(' '));
        return datePartA.localeCompare(datePartB);
    });
};

/**
 * スケジュールスロット文字列 ("MM/DD (曜日) HH:mm - HH:mm") を
 * 日付でソートし、日付が同じ場合は開始時刻でソートする
 * @param {string[]} slots - スケジュールスロットの配列
 * @returns {string[]} ソートされたスケジュールスロットの配列
 */
export const sortScheduleSlots = (slots: string[]): string[] => {
    return [...slots].sort((a, b) => {
        // スロットを日付部分と時刻部分に分割
        // 例: "12/04 (木) 09:00 - 09:15" -> ["12/04 (木", "09:00 - 09:15"]
        const partsA = a.split(') ');
        const partsB = b.split(') ');

        // 1. 日付で比較 (MM/DDの部分のみを抽出)
        const datePartA = partsA[0].substring(0, 5); // "MM/DD"
        const datePartB = partsB[0].substring(0, 5); // "MM/DD"
        const dateCompare = datePartA.localeCompare(datePartB);

        if (dateCompare !== 0) {
            return dateCompare;
        }

        // 2. 日付が同じ場合は開始時刻で比較 (HH:mm の部分のみを抽出)
        const timePartA = partsA[1].split(' - ')[0]; // "HH:mm"
        const timePartB = partsB[1].split(' - ')[0]; // "HH:mm"
        return timePartA.localeCompare(timePartB);
    });
};
