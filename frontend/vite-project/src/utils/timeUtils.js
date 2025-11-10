/**
 * 時刻文字列 (HH:mm) と分数から、HH:mm - HH:mm 形式の範囲文字列を生成する
 */
export const calculateTimeRange = (startTimeStr, duration) => {
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
export const getNextStartTime = (rows, defaultStart = '09:00') => {
    if (rows.length === 0) {
        return defaultStart;
    }
    const latestRow = rows[rows.length - 1];
    // endTimeString は "HH:mm - HH:mm" の2つ目の時刻
    const endTimeString = latestRow.split(' - ')[1];

    if (!endTimeString || endTimeString.split(':').some(isNaN)) return defaultStart;

    return endTimeString;
};

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

