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
  interviewDuration: number, 
  startHour = 8, 
  endHour = 17
): string[] => {
  const slots: string[] = [];
  const startInMinutes = startHour * 60;
  const endInMinutes = endHour * 60;

  for (let minutes = startInMinutes; minutes <= endInMinutes; minutes += interviewDuration) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
  }
  return slots;
};