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


