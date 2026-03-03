// src/utils/demoData.ts
import { Applicant, Sibling } from "../types/Students";
import { ScheduleData } from "../types/ScheduleManager";

// 🌟 1. 面談枠のベース定義（5日間 × 12枠 = 60枠）
const DEMO_COLS = ["2026-04-13", "2026-04-14", "2026-04-15", "2026-04-16", "2026-04-17"];
const DEMO_ROWS = [
    "13:00 - 13:15", "13:15 - 13:30", "13:30 - 13:45", "13:45 - 14:00",
    "14:00 - 14:15", "14:15 - 14:30", "14:30 - 14:45", "14:45 - 15:00",
    "15:00 - 15:15", "15:15 - 15:30", "15:30 - 15:45", "15:45 - 16:00"
];

// 🌟 2. 兄弟データ（名前をリアルなものに変更）
export const DEMO_SIBLINGS: Sibling[] = [
    // 家族A（3兄弟）
    { id: "sib-1", family_name: "佐藤", first_name: "陸", grade: "5", class: "1", family_id: "fam-3bros", assigned_slot: "2026-04-14 13:00 - 13:15" },
    { id: "sib-2", family_name: "佐藤", first_name: "空", grade: "2", class: "3", family_id: "fam-3bros", assigned_slot: "2026-04-14 13:45 - 14:00" },
    // その他8人の兄弟
    { id: "sib-3", family_name: "鈴木", first_name: "翔太", grade: "6", class: "1", family_id: "fam-11", assigned_slot: "2026-04-13 15:00 - 15:15" },
    { id: "sib-4", family_name: "高橋", first_name: "結愛", grade: "4", class: "2", family_id: "fam-12", assigned_slot: "2026-04-13 15:30 - 15:45" },
    { id: "sib-5", family_name: "田中", first_name: "健太", grade: "5", class: "1", family_id: "fam-13", assigned_slot: "2026-04-14 15:30 - 15:45" },
    { id: "sib-6", family_name: "伊藤", first_name: "陽葵", grade: "3", class: "3", family_id: "fam-14", assigned_slot: "2026-04-15 13:00 - 13:15" },
    { id: "sib-7", family_name: "渡辺", first_name: "大輝", grade: "6", class: "2", family_id: "fam-15", assigned_slot: "2026-04-15 15:00 - 15:15" },
    { id: "sib-8", family_name: "山本", first_name: "美咲", grade: "4", class: "1", family_id: "fam-16", assigned_slot: "2026-04-16 13:00 - 13:15" },
    { id: "sib-9", family_name: "中村", first_name: "蓮", grade: "5", class: "3", family_id: "fam-17", assigned_slot: "2026-04-16 15:00 - 15:15" },
    { id: "sib-10", family_name: "小林", first_name: "紬", grade: "2", class: "1", family_id: "fam-18", assigned_slot: "2026-04-17 15:00 - 15:15" },
];

// 🌟 3. 特殊なテスト用生徒（名前をリアルにし、希望枠数を5〜8枠に水増し）
const SPECIAL_APPLICANTS: Applicant[] = [
    // [1, 2] 同クラスの双子（希望5枠）
    { id: "app-1", student_id: "1", family_name: "山田", first_name: "蒼", family_id: "fam-twins", token: "AAAAAA", is_fixed: false, is_last_slot: false, needs_gap_after: false, preferred_dates: ["2026-04-13 13:00 - 13:15", "2026-04-13 13:15 - 13:30", "2026-04-14 14:00 - 14:15", "2026-04-14 14:15 - 14:30", "2026-04-15 15:00 - 15:15"] },
    { id: "app-2", student_id: "2", family_name: "山田", first_name: "碧", family_id: "fam-twins", token: "BBBBBB", is_fixed: false, is_last_slot: false, needs_gap_after: false, preferred_dates: ["2026-04-13 13:00 - 13:15", "2026-04-13 13:15 - 13:30", "2026-04-14 14:00 - 14:15", "2026-04-14 14:15 - 14:30", "2026-04-15 15:00 - 15:15"] },
    
    // [3] 家族A（3兄弟）の三男：他クラスの兄2人に挟まれた激戦区を狙う（希望6枠）
    { id: "app-3", student_id: "3", family_name: "佐藤", first_name: "湊", family_id: "fam-3bros", token: "CCCCCC", is_fixed: false, is_last_slot: false, needs_gap_after: false, preferred_dates: ["2026-04-14 13:15 - 13:30", "2026-04-14 13:30 - 13:45", "2026-04-16 13:00 - 13:15", "2026-04-16 13:15 - 13:30", "2026-04-16 13:30 - 13:45", "2026-04-17 14:00 - 14:15"] },
    
    // [4] 休憩フラグ：後ろの枠をシステムブロックできるかテスト（希望5枠）
    { id: "app-4", student_id: "4", family_name: "加藤", first_name: "結衣", family_id: "fam-4", token: "DDDDDD", is_fixed: false, is_last_slot: false, needs_gap_after: true, preferred_dates: ["2026-04-15 14:00 - 14:15", "2026-04-15 14:15 - 14:30", "2026-04-15 14:30 - 14:45", "2026-04-16 14:00 - 14:15", "2026-04-16 14:15 - 14:30"] },
    
    // [5] トリ（最後枠）フラグ：全体の残り枠計算をパスできるかテスト（希望6枠）
    { id: "app-5", student_id: "5", family_name: "吉田", first_name: "悠真", family_id: "fam-5", token: "EEEEEE", is_fixed: false, is_last_slot: true, needs_gap_after: false, preferred_dates: ["2026-04-13 15:45 - 16:00", "2026-04-14 15:45 - 16:00", "2026-04-15 15:45 - 16:00", "2026-04-16 14:45 - 15:00", "2026-04-17 15:45 - 16:00", "2026-04-17 15:30 - 15:45"] },
    
    // [6] 固定フラグ：絶対に動かない岩（希望3枠）
    { id: "app-6", student_id: "6", family_name: "松本", first_name: "咲良", family_id: "fam-6", token: "FFFFFF", is_fixed: true, is_last_slot: false, needs_gap_after: false, preferred_dates: ["2026-04-13 13:30 - 13:45", "2026-04-13 13:45 - 14:00", "2026-04-14 13:30 - 13:45"] },
    
    // [7] 岩の被害者：第一希望が固定生徒に塞がれているため第二希望へ（希望5枠）
    { id: "app-7", student_id: "7", family_name: "井上", first_name: "颯太", family_id: "fam-7", token: "GGGGGG", is_fixed: false, is_last_slot: false, needs_gap_after: false, preferred_dates: ["2026-04-13 13:30 - 13:45", "2026-04-15 13:00 - 13:15", "2026-04-15 13:15 - 13:30", "2026-04-16 13:30 - 13:45", "2026-04-17 14:00 - 14:15"] },
    
    // [8] 弾かれる生徒：唯一出した2枠が「先生の休憩時間（admin_block）」にモロ被りしているため爆死（希望2枠）
    { id: "app-8", student_id: "8", family_name: "木村", first_name: "凛", family_id: "fam-8", token: "HHHHHH", is_fixed: false, is_last_slot: false, needs_gap_after: false, preferred_dates: ["2026-04-13 14:00 - 14:15", "2026-04-14 15:00 - 15:15", "2026-04-17 13:00 - 13:15"] },
    
    // [9] 玉突きの被害者：後から来た[app-3(三兄弟)]に弾き飛ばされて17日へ移動（希望5枠）
    { id: "app-9", student_id: "9", family_name: "林", first_name: "樹", family_id: "fam-9", token: "IIIIII", is_fixed: false, is_last_slot: false, needs_gap_after: false, preferred_dates: ["2026-04-14 13:15 - 13:30", "2026-04-17 13:00 - 13:15", "2026-04-17 13:15 - 13:30", "2026-04-17 13:30 - 13:45", "2026-04-17 13:45 - 14:00"] },
    
    // [10] 神様みたいな親（希望15枠）
    { id: "app-10", student_id: "10", family_name: "山口", first_name: "陽葵", family_id: "fam-10", token: "JJJJJJ", is_fixed: false, is_last_slot: false, needs_gap_after: false, preferred_dates: ["2026-04-13 14:00 - 14:15", "2026-04-13 14:15 - 14:30", "2026-04-13 14:30 - 14:45", "2026-04-14 14:30 - 14:45", "2026-04-14 14:45 - 15:00", "2026-04-15 13:00 - 13:15", "2026-04-15 13:15 - 13:30", "2026-04-15 13:30 - 13:45", "2026-04-16 13:00 - 13:15", "2026-04-16 13:15 - 13:30", "2026-04-16 13:30 - 13:45", "2026-04-17 14:00 - 14:15", "2026-04-17 14:15 - 14:30", "2026-04-17 14:30 - 14:45", "2026-04-17 14:45 - 15:00"] }
];

// 🌟 リアルな名前生成用のリスト
const FAMILY_NAMES = ["斎藤", "清水", "山崎", "森", "池田", "橋本", "阿部", "石川", "山下", "中島", "石井", "小川", "前田", "岡田", "長谷川", "藤田", "後藤", "遠藤", "村上", "近藤", "坂本", "青木", "藤井", "西村", "福田", "三浦", "藤原", "岡本", "松田", "中野"];
const FIRST_NAMES = ["大翔", "陽菜", "蓮", "結愛", "悠真", "咲良", "陽翔", "結衣", "湊", "陽葵", "樹", "紬", "朝陽", "凛", "大和", "澪", "碧", "結月", "颯太", "芽依", "悠人", "心春", "伊吹", "ひまり", "陽向", "莉子", "結城", "あかり", "新", "さくら"];

// 🌟 4. 一般生徒（30人）の自動生成ロジック
const generateGeneralApplicants = (): Applicant[] => {
    const generated: Applicant[] = [];
    
    for (let i = 11; i <= 40; i++) {
        const char = String.fromCharCode(65 + (i - 1) % 26);
        const token = char.repeat(6);
        const family_id = (i >= 11 && i <= 18) ? `fam-${i}` : undefined;
        
        const preferred_dates = new Set<string>();

        // 【安全装置】自動割当が成功するよう、各生徒に被りにくいベース枠を1つ確保
        let baseCol = (i % 5);
        let baseRow = Math.floor((i - 11) / 5) + 5; 
        if (baseRow === 8 && baseCol === 1) baseRow = 11; // admin_blockを回避
        preferred_dates.add(`${DEMO_COLS[baseCol]} ${DEMO_ROWS[baseRow]}`);

        // =========================================================
        // 🎯 先生ご提案の「リアルなばらつき」をシミュレート
        // =========================================================
        let targetPrefs = 5;
        const mod = i % 30;

        // ① 激務の親（1〜4枠）：全体で約5人（app-8含め）
        if (mod === 0) targetPrefs = 1;
        else if (mod === 7) targetPrefs = 2;
        else if (mod === 14) targetPrefs = 3;
        else if (mod === 21) targetPrefs = 4;
        
        // ② 神様みたいな親（21枠以上）：全体で約3人（app-10含め）
        else if (mod === 5) targetPrefs = 24;
        else if (mod === 28) targetPrefs = 28;

        // ③ 協力的な親（11〜20枠）：全体で約7人
        else if (mod === 3) targetPrefs = 12;
        else if (mod === 10) targetPrefs = 15;
        else if (mod === 17) targetPrefs = 18;
        else if (mod === 24) targetPrefs = 14;
        else if (mod === 13) targetPrefs = 19;
        else if (mod === 29) targetPrefs = 11;

        // ④ 普通の親（5〜10枠）：残り多数
        else {
            targetPrefs = 5 + (i % 6); // 5, 6, 7, 8, 9, 10
        }

        // 目標の枠数になるまで追加
        let seed = i * 13;
        while (preferred_dates.size < targetPrefs) {
            const c = (seed * 7) % 5;
            const r = (seed * 11) % 12;

            // 先生の休憩時間(admin_block)は避ける
            if (r === 4 && c === 0) { seed++; continue; }
            if (r === 8 && c === 1) { seed++; continue; }

            preferred_dates.add(`${DEMO_COLS[c]} ${DEMO_ROWS[r]}`);
            seed++;
        }

        generated.push({
            id: `app-${i}`,
            student_id: i.toString(),
            family_name: FAMILY_NAMES[(i - 11) % FAMILY_NAMES.length],
            first_name: FIRST_NAMES[(i - 11) % FIRST_NAMES.length],
            family_id: family_id,
            token,
            is_fixed: false,
            is_last_slot: false,
            needs_gap_after: false,
            preferred_dates: Array.from(preferred_dates)
        });
    }
    return generated;
};

export const DEMO_APPLICANTS: Applicant[] = [...SPECIAL_APPLICANTS, ...generateGeneralApplicants()];

// 🌟 5. スケジュールベースデータの作成
const createDemoSchedule = (): ScheduleData => {
    const assignments: (string | null)[][] = Array(12).fill(null).map(() => Array(5).fill(null));
    const availability: string[][] = Array(12).fill(null).map(() => Array(5).fill("normal"));

    // 月曜の14:00 と 火曜の15:00 を先生の休憩(admin_block)に設定
    // ※ 木村 凛さん(app-8)は、親がこの2枠しか希望を出さなかったため弾かれる
    availability[4][0] = "admin_block";
    availability[8][1] = "admin_block";

    // 固定生徒（松本 さくら）を月曜の13:30に事前配置
    assignments[2][0] = "app-6";

    return {
        rows: DEMO_ROWS,
        cols: DEMO_COLS,
        assignments,
        availability
    };
};

export const DEMO_SCHEDULE: ScheduleData = createDemoSchedule();