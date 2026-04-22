/**
 * 時刻文字列 (HH:mm) と分数から、HH:mm - HH:mm 形式の範囲文字列を生成する
 */
export const calculateTimeRange = (startTimeStr: string, duration: number): string => {
    const [startH, startM] = startTimeStr.split(':').map(Number);
    let start = new Date(2000, 0, 1, startH, startM);

    let end = new Date(start.getTime());
    end.setMinutes(end.getMinutes() + duration);

    const formatTime = (date: Date) => {
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
    };

    return `${formatTime(start)} - ${formatTime(end)}`;
};

/**
 * 次に追加すべき時間帯の開始時間を計算する
 */
export const getNextTimeSlot = (currentTime: string, duration: number): string => {
  const [hours, minutes] = currentTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + duration;
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

export const generateTimeSlots = (
  interviewDuration: number, // 互換性のため引数は残しておきますが、ループでは使いません
  startHour = 8, 
  endHour = 20,
  stepMinutes = 5
): string[] => {
  const slots: string[] = [];
  const startInMinutes = startHour * 60;
  const endInMinutes = endHour * 60;

  // 面談時間に関わらず、5分刻みですべての時刻を選択肢として生成する
  for (let minutes = startInMinutes; minutes <= endInMinutes; minutes += stepMinutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
  }
  return slots;
};

export const parseWareki = (strDate : string): string => {
  if(!strDate){
    return '';
  }
  const date = new Date(strDate);
  return new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
    timeZone: 'Asia/Tokyo',
    era: 'long', // 'short'だと "R6" や "令和"
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
};

/**
 * 和暦の日付文字列（例: "令和6年2月14日"）から年度（例: "令和5年度"）を取得する
 */
export const getNengo = (strDate: string): string => {
  const dateString = parseWareki(strDate);
  // 正規表現で「元号」「年」「月」を抽出
  // "元" または "数字" に対応
  const match = dateString.match(/^(.+?)(元|\d+)年(\d+)月/);

  if (!match) {
    console.error('無効な日付形式です');
    return '';
  }

  const era = match[1]; // 例: "令和"
  const yearStr = match[2]; // 例: "6" または "元"
  const month = parseInt(match[3], 10); // 例: 2

  // "元" は 1 として扱う
  let year = yearStr === '元' ? 1 : parseInt(yearStr, 10);

  // 1月〜3月は前の年度になる
  if (month >= 1 && month <= 3) {
    year -= 1;
  }

  // 年度表記を作成
  // 計算結果が1の場合は "元" に戻す（お好みで "1" のままでもOK）
  const fiscalYearStr = year === 1 ? '元' : year.toString();

  // "0年度" になるケース（改元直後の1~3月など）のハンドリング
  // ※文字列操作だけでは前の元号（平成など）を知る術がないため、
  // 必要であればここでエラーにするか、そのまま返す仕様にします。
  if (year === 0) {
    return `${era}前年度`; // または エラーを投げる
  }

  return `${era}${fiscalYearStr}年度`;
};