// availabilityUtils.js
import { ScheduleData, SlotIndex } from '../types/ScheduleManager.ts';
import { Applicant } from '../types/Applicant.ts';
import { getApplicantById } from './applicantUtils.ts';

// -------------------------------------------------------------------------
// 1. 基本パーツ（変更なし）
// -------------------------------------------------------------------------
export const isPreferred = (applicant: Applicant, slotName: string): boolean => {
    if (!applicant || !applicant.preferred_dates) {
        return false;
    }
    return applicant.preferred_dates.includes(slotName);
};

const createNewAvailability = (oldAvailability: ScheduleData['availability'], rowsLength: number, colsLength: number): ScheduleData['availability'] => {
    return Array(rowsLength).fill(null).map((_, r) =>
        Array(colsLength).fill(null).map((_, c) => {
            return oldAvailability[r][c] === 'admin_block' ? 'admin_block' : 'available';
        })
    );
};

// -------------------------------------------------------------------------
// 2. 【新機能】 共通ループ処理（イテレーター）
// -------------------------------------------------------------------------
/**
 * スケジュールの全マスを走査し、コールバック関数の判定結果を適用する高階関数
 * @param {object} scheduleData - スケジュールデータ
 * @param {function} logicCallback - 各マスの判定ロジック ({ r, c, targetAssignment, targetSlotName }) => status文字列
 * @returns {Array} 新しい availability 配列
 */
const mapScheduleSlots = (scheduleData: ScheduleData, logicCallback) => {
    const { rows, cols, assignments, availability: oldAvailability } = scheduleData;
    const rowsLength = rows.length;
    const colsLength = cols.length;

    // ベースの作成
    const newAvailability = createNewAvailability(oldAvailability, rowsLength, colsLength);

    // 全マスをループ
    for (let r = 0; r < rowsLength; r++) {
        for (let c = 0; c < colsLength; c++) {
            // admin_block は判定スキップ
            if (newAvailability[r][c] === 'admin_block') {
                continue;
            }

            // 判定に必要な情報をまとめる
            const context = {
                r,
                c,
                targetAssignment: assignments[r][c], // そのマスの現在の割り当て
                targetSlotName: `${cols[c]} ${rows[r]}` // そのマスの名前 ("月 10:00"など)
            };

            // コールバック（中身のロジック）を実行してステータスを取得
            const status = logicCallback(context);

            // ステータスが返ってきたら適用
            if (status) {
                newAvailability[r][c] = status;
            }
        }
    }
    return newAvailability;
};

// -------------------------------------------------------------------------
// 3. 具体的な計算関数（スッキリ版）
// -------------------------------------------------------------------------

// A. ID指定で「配置可能か」を計算
export const calculateSlotAvailabilityById = (applicantId, applicants, scheduleData) => {
    const applicant = getApplicantById(applicantId, applicants);

    // 共通ループ関数を使用
    return mapScheduleSlots(scheduleData, ({ targetAssignment, targetSlotName }) => {
        // 1. 希望していないなら 'unAvailable'
        if (!isPreferred(applicant, targetSlotName)) {
            return 'unAvailable';
        }

        // 2. 空き枠なら 'settable'、誰かいれば 'switchable'
        return targetAssignment === null ? 'settable' : 'switchable';
    });
};

// B. 選択スロットから「移動・交換可能か」を計算
export const calculateSlotAvailabilityByIndex = (selectedSlot: SlotIndex, applicants: Applicant[], scheduleData: ScheduleData) => {
    const { assignments, rows, cols } = scheduleData;

    // --- 前準備: 移動元（主役）の情報を取得 ---
    const sourceAssignment = assignments[selectedSlot.rowIndex][selectedSlot.colIndex];
    const sourceSlotName = `${cols[selectedSlot.colIndex]} ${rows[selectedSlot.rowIndex]}`;

    let sourceApplicant = null;
    if (sourceAssignment) {
        sourceApplicant = getApplicantById(sourceAssignment, applicants);
    }

    // エラーケース: 割り当てがあるのに児童データがない場合は何もしない（初期状態を返す）
    if (sourceAssignment && !sourceApplicant) {
        return createNewAvailability(scheduleData.availability, scheduleData.rows.length, scheduleData.cols.length);
    }

    // 共通ループ関数を使用
    return mapScheduleSlots(scheduleData, ({ targetAssignment, targetSlotName }) => {
        // ターゲットにいる児童を取得（いれば）
        let targetApplicant = null;
        if (targetAssignment) {
            targetApplicant = getApplicantById(targetAssignment, applicants);
        }

        // ケース1: 元が「空き枠」の場合 (誰もいないところからの移動)
        if (!sourceAssignment) {
            // 相手も空き枠ならNG
            if (!targetAssignment) {
              return 'unAvailable';
            }
            // 相手がこちらの枠(sourceSlotName)を希望していれば movable
            return isPreferred(targetApplicant, sourceSlotName) ? 'movableFromOther' : 'unAvailable';
        }

        // ケース2: 元に「児童(sourceApplicant)」がいる場合

        // 相手がいる場合 (交換判定)
        if (targetAssignment) {
            // 相互に希望しているか？
            const match = isPreferred(targetApplicant, sourceSlotName) && isPreferred(sourceApplicant, targetSlotName);
            return match ? 'switchable' : 'unAvailable';
        }

        // 相手が空き枠の場合 (移動判定)
        return isPreferred(sourceApplicant, targetSlotName) ? 'movableToOther' : 'unAvailable';
    });
};

/**
 * リセット用: 現在の管理者ブロックの状態を維持しつつ、
 * 利用可能性の状態をすべて 'available' にリセットする配列を生成します。
 * @param {object} scheduleData - スケジュールデータ（rows, cols, availabilityを含む）
 * @returns {Array<Array<string>>} リセットされた availability 配列
 */
export const getInitialAvailability = (scheduleData) => {
    const { rows, cols, availability: oldAvailability } = scheduleData;
    const rowsLength = rows.length;
    const colsLength = cols.length;

    // createNewAvailability を利用して、admin_block 以外を 'available' に戻す
    return createNewAvailability(oldAvailability, rowsLength, colsLength);
};