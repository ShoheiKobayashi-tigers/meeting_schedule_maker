/**
 * 時間帯ヘッダー ("HH:mm - HH:mm") を開始時刻でソートする
 */
export const sortTimeRows = (rows) => {
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
export const sortDateCols = (cols) => {
    return [...cols].sort((a, b) => {
        // MM/DD (曜日) から MM/DD の部分のみを抽出
        const datePartA = a.substring(0, a.indexOf(' '));
        const datePartB = b.substring(0, b.indexOf(' '));
        return datePartA.localeCompare(datePartB);
    });
};
