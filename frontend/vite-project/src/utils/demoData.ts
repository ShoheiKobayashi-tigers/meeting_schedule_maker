import { Applicant, Sibling } from "../types/Students";
import { ScheduleData } from "../types/ScheduleManager";

// 🌟 1. 面談枠のベース定義（5日間 × 12枠 = 60枠）
const DEMO_COLS = ["2026-04-13", "2026-04-14", "2026-04-15", "2026-04-16", "2026-04-17"];
const DEMO_ROWS = [
    "13:00 - 13:15", "13:15 - 13:30", "13:30 - 13:45", "13:45 - 14:00",
    "14:00 - 14:15", "14:15 - 14:30", "14:30 - 14:45", "14:45 - 15:00",
    "15:00 - 15:15", "15:15 - 15:30", "15:30 - 15:45", "15:45 - 16:00"
];

// 🌟 2. 兄弟データ（10人中、2人は同じApplicantの兄弟）
export const DEMO_SIBLINGS: Sibling[] = [
    // 家族A（3兄弟）：Applicant側に1人、ここに2人（玉突き事故の起点）
    { id: "sib-1", family_name: "佐藤", first_name: "一郎", grade: "5", class: "1", family_id: "fam-3bros", assigned_slot: "2026-04-14 13:00 - 13:15" },
    { id: "sib-2", family_name: "佐藤", first_name: "二郎", grade: "2", class: "3", family_id: "fam-3bros", assigned_slot: "2026-04-14 13:45 - 14:00" },
    // その他8人の兄弟（Applicantの11番〜18番とリンクする）
    { id: "sib-3", family_name: "鈴木", first_name: "兄", grade: "6", class: "1", family_id: "fam-11", assigned_slot: "2026-04-13 15:00 - 15:15" },
    { id: "sib-4", family_name: "高橋", first_name: "姉", grade: "4", class: "2", family_id: "fam-12", assigned_slot: "2026-04-13 15:30 - 15:45" },
    { id: "sib-5", family_name: "田中", first_name: "兄", grade: "5", class: "1", family_id: "fam-13", assigned_slot: "2026-04-14 15:30 - 15:45" },
    { id: "sib-6", family_name: "伊藤", first_name: "姉", grade: "3", class: "3", family_id: "fam-14", assigned_slot: "2026-04-15 13:00 - 13:15" },
    { id: "sib-7", family_name: "渡辺", first_name: "兄", grade: "6", class: "2", family_id: "fam-15", assigned_slot: "2026-04-15 15:00 - 15:15" },
    { id: "sib-8", family_name: "山本", first_name: "姉", grade: "4", class: "1", family_id: "fam-16", assigned_slot: "2026-04-16 13:00 - 13:15" },
    { id: "sib-9", family_name: "中村", first_name: "兄", grade: "5", class: "3", family_id: "fam-17", assigned_slot: "2026-04-16 15:00 - 15:15" },
    { id: "sib-10", family_name: "小林", first_name: "姉", grade: "2", class: "1", family_id: "fam-18", assigned_slot: "2026-04-17 15:00 - 15:15" },
];

// 🌟 3. 特殊なテスト用生徒（10人）
const SPECIAL_APPLICANTS: Applicant[] = [
    // [1, 2] 同クラスの双子（連続配置テスト）
    { id: "app-1", student_id: "1", family_name: "山田", first_name: "双子A", family_id: "fam-twins", token: "AAAAAA", is_fixed: false, is_last_slot: false, needs_gap_after: false, preferred_dates: ["2026-04-13 13:00 - 13:15", "2026-04-13 13:15 - 13:30"] },
    { id: "app-2", student_id: "2", family_name: "山田", first_name: "双子B", family_id: "fam-twins", token: "BBBBBB", is_fixed: false, is_last_slot: false, needs_gap_after: false, preferred_dates: ["2026-04-13 13:00 - 13:15", "2026-04-13 13:15 - 13:30"] },
    
    // [3] 家族A（3兄弟）の三男：他クラスの兄2人に挟まれた超激戦区（13:15か13:30）を狙う
    { id: "app-3", student_id: "3", family_name: "佐藤", first_name: "三郎", family_id: "fam-3bros", token: "CCCCCC", is_fixed: false, is_last_slot: false, needs_gap_after: false, preferred_dates: ["2026-04-14 13:15 - 13:30", "2026-04-14 13:30 - 13:45"] },
    
// [4] 休憩フラグ：後ろの枠をシステムブロックできるかテスト
    { id: "app-4", student_id: "4", family_name: "加藤", first_name: "休憩希望", family_id: "fam-4", token: "DDDDDD", is_fixed: false, is_last_slot: false, needs_gap_after: true, preferred_dates: ["2026-04-15 14:00 - 14:15"] },
    
    // [5] トリ（最後枠）フラグ：MAX3枠分のブロックと、全体の残り枠計算をパスできるかテスト
    { id: "app-5", student_id: "5", family_name: "吉田", first_name: "最後枠希望", family_id: "fam-5", token: "EEEEEE", is_fixed: false, is_last_slot: true, needs_gap_after: false, preferred_dates: ["2026-04-16 14:45 - 15:00"] },
    
    // [6] 固定フラグ：絶対に動かない岩（スケジュールデータ側で[2][0]に配置済み）
    { id: "app-6", student_id: "6", family_name: "松本", first_name: "固定配置", family_id: "fam-6", token: "FFFFFF", is_fixed: true, is_last_slot: false, needs_gap_after: false, preferred_dates: ["2026-04-13 13:30 - 13:45"] },
    
    // [7] 岩の被害者：第一希望が固定生徒に塞がれているため、第二希望に回されるテスト
    { id: "app-7", student_id: "7", family_name: "井上", first_name: "岩の被害者", family_id: "fam-7", token: "GGGGGG", is_fixed: false, is_last_slot: false, needs_gap_after: false, preferred_dates: ["2026-04-13 13:30 - 13:45", "2026-04-15 13:00 - 13:15"] },
    
    // [8] 完全に弾かれる可哀想な生徒：唯一の希望がadmin_blockの場所。unassignedに入るかテスト
    { id: "app-8", student_id: "8", family_name: "木村", first_name: "弾かれ確定", family_id: "fam-8", token: "HHHHHH", is_fixed: false, is_last_slot: false, needs_gap_after: false, preferred_dates: ["2026-04-13 14:00 - 14:15"] },
    
    // [9] 玉突きの被害者（一般生徒）：貪欲法で先に[14日の13:15]に入るが、後から来た[app-3(三兄弟)]に弾き飛ばされて[17日]へ移動するテスト
    { id: "app-9", student_id: "9", family_name: "林", first_name: "玉突き被害者", family_id: "fam-9", token: "IIIIII", is_fixed: false, is_last_slot: false, needs_gap_after: false, preferred_dates: ["2026-04-14 13:15 - 13:30", "2026-04-17 13:00 - 13:15"] },
    
    // [10] 普通の生徒
    { id: "app-10", student_id: "10", family_name: "山口", first_name: "普通", family_id: "fam-10", token: "JJJJJJ", is_fixed: false, is_last_slot: false, needs_gap_after: false, preferred_dates: ["2026-04-17 14:00 - 14:15"] }
];

// 🌟 4. 一般生徒（30人）の自動生成ロジック
const generateGeneralApplicants = (): Applicant[] => {
    const generated: Applicant[] = [];
    for (let i = 11; i <= 40; i++) {
        // トークン生成（K, L, M... を6文字連続で）
        const char = String.fromCharCode(65 + (i - 1) % 26);
        const token = char.repeat(6);
        
        // 11〜18番は他クラス兄弟(fam-11〜18)とリンクさせる
        const family_id = (i >= 11 && i <= 18) ? `fam-${i}` : undefined;
        
        // 適当な希望日時を2〜3個生成
        const preferred_dates = [];
        const numPrefs = 2 + (i % 2); // 2個か3個
        for(let p = 0; p < numPrefs; p++) {
            // iの値を元に分散させる（かぶらないように）
            const colIdx = (i + p) % 5;
            const rowIdx = (i * 2 + p * 3) % 12;
            preferred_dates.push(`${DEMO_COLS[colIdx]} ${DEMO_ROWS[rowIdx]}`);
        }

        generated.push({
            id: `app-${i}`,
            student_id: i.toString(),
            family_name: `テスト生徒`,
            first_name: `${i}番`,
            family_id: family_id,
            token,
            is_fixed: false,
            is_last_slot: false,
            needs_gap_after: false,
            preferred_dates
        });
    }
    return generated;
};

export const DEMO_APPLICANTS: Applicant[] = [...SPECIAL_APPLICANTS, ...generateGeneralApplicants()];

// 🌟 5. スケジュールベースデータの作成（admin_blockと固定生徒を配置）
const createDemoSchedule = (): ScheduleData => {
    const assignments: (string | null)[][] = Array(12).fill(null).map(() => Array(5).fill(null));
    const availability: string[][] = Array(12).fill(null).map(() => Array(5).fill("normal"));

    // 【仕掛け1】人気の時間帯に admin_block を配置
    // 月曜(col:0)の14:00(row:4) → App-8 がここに突っ込んで爆死する
    availability[4][0] = "admin_block";
    // 火曜(col:1)の15:00(row:8)
    availability[8][1] = "admin_block";

    // 【仕掛け2】固定生徒（App-6）を月曜(col:0)の13:30(row:2)に事前配置
    assignments[2][0] = "app-6";

    return {
        rows: DEMO_ROWS,
        cols: DEMO_COLS,
        assignments,
        availability
    };
};

export const DEMO_SCHEDULE: ScheduleData = createDemoSchedule();