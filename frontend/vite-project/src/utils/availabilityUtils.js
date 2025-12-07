// availabilityUtils.js
import { getApplicantById } from './applicantUtils.js';

// -------------------------------------------------------------------------
// ヘルパー関数: スロットが児童の希望日程に含まれているかを判定
// -------------------------------------------------------------------------
export const isPreferred = (applicant, slotName) => {
    // 児童データや希望日程がない場合は false を返す
    if (!applicant || !applicant.preferred_dates) {
        return false;
    }
    // preferred_dates（配列）が slotName（文字列）を含むかをチェック
    return applicant.preferred_dates.includes(slotName);
};

// -------------------------------------------------------------------------
// ヘルパー関数: 新しい availability 配列を元の admin_block の状態を保持しつつ作成
// -------------------------------------------------------------------------
const createNewAvailability = (oldAvailability, rowsLength, colsLength) => {
    const newAvailability = Array(rowsLength).fill(null).map((_, r) =>
        Array(colsLength).fill(null).map((_, c) => {
            const status = oldAvailability[r][c];

            if (status === 'admin_block') {
                return 'admin_block';
            }
            return 'available';
        })
    );
    return newAvailability;
};

// -------------------------------------------------------------------------
// メイン関数: 利用可能性計算
// -------------------------------------------------------------------------
export const calculateSlotAvailabilityById = (applicantId,  applicants ,scheduleData) => {
    const { rows, cols, assignments, availability: oldAvailability } = scheduleData;

    const rowsLength = rows.length;
    const colsLength = cols.length;
    const newAvailability = createNewAvailability(oldAvailability, rowsLength, colsLength);
    const applicant = getApplicantById(applicantId, applicants);

    for (let r = 0; r < rowsLength; r++) {
        for (let c = 0; c < colsLength; c++) {
            // トグルでoffにしている場所はoffのまま
            if (newAvailability[r][c] === 'admin_block') {
                continue;
            }

            let targetSlotName = `${cols[c]} ${rows[r]}`;

            // 適合性 (Preferred) の判断
            if(isPreferred(applicant, targetSlotName)){
                //検索対象Slotに児童がいるかいないかで、availabilityを分ける
                if (assignments[r][c] === null){
                    newAvailability[r][c] = 'settable';
                    continue;
                } else {
                    newAvailability[r][c] = 'switchable';
                    continue;
                }
            }
            newAvailability[r][c] = 'unAvailable';
        }
    }

    return newAvailability;
};
export const calculateSlotAvailabilityByIndex = (selectedSlot,  applicants ,scheduleData) => {
    const { rows, cols, assignments, availability: oldAvailability } = scheduleData;

    const rowsLength = rows.length;
    const colsLength = cols.length;
    const newAvailability = createNewAvailability(oldAvailability, rowsLength, colsLength);
    // selectedSlot が無効か、割り当てが存在しないかチェック
    const assignment = assignments[selectedSlot.rowIndex][selectedSlot.colIndex];
    const slotName = `${cols[selectedSlot.colIndex]} ${rows[selectedSlot.rowIndex]}`;
    let applicant = null;
    if (assignment) {
        applicant = getApplicantById(assignment.applicantId, applicants)
    }

    if (!applicant && assignment) {
        // assignment はあるが applicant データが見つからない場合（エラーケース）
        return newAvailability;
    }
    if (!assignment) {
        // 選択スロットに割り当てがない場合 (空き枠への移動判定)
        // この後のロジックは、ターゲットスロットに児童がいる場合にのみ 'movable' を設定する
    }

    for (let r = 0; r < rowsLength; r++) {
        for (let c = 0; c < colsLength; c++) {
            // トグルでoffにしている場所はoffのまま
            if (newAvailability[r][c] === 'admin_block') {
                continue;
            }

            let targetAssignment = assignments[r][c];
            let targetSlotName = `${cols[c]} ${rows[r]}`;

            let targetApplicant = null;
            if (targetAssignment) {
                targetApplicant = getApplicantById(targetAssignment.applicantId, applicants);
            }

            // --- A. 選択スロットが空き枠の場合 (!assignment) ---
            if (!assignment) {
                // ターゲットも空き枠なら unAvailable
                if (!targetAssignment) {
                    newAvailability[r][c] = 'unAvailable';
                    continue;
                }
                // ターゲットが空き枠を希望していれば movable
                if (isPreferred(targetApplicant, slotName)) {
                    newAvailability[r][c] = 'movable';
                    continue;
                }
                // 希望していなければ unAvailable
                newAvailability[r][c] = 'unAvailable';
                continue;
            }

            // --- B. 選択スロットに児童がいる場合 (assignment が true) ---

            // ターゲットスロットに児童がいるか？
            if (targetAssignment) {
                // 交換 (switchable) の判定
                if (isPreferred(targetApplicant, slotName) && isPreferred(applicant, targetSlotName)) {
                    newAvailability[r][c] = 'switchable';
                    continue;
                }
                newAvailability[r][c] = 'unAvailable';
                continue;
            }
            // ターゲットスロットが空き枠の場合 (移動判定)
            // 移動 (movable) の判定
            if (isPreferred(applicant, targetSlotName)) {
                newAvailability[r][c] = 'movable';
                continue;
            }
            newAvailability[r][c] = 'unAvailable';
            continue;
        }
    }
    return newAvailability;
};