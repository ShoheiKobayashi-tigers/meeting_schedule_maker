// src/types/Students.ts
import { z } from 'zod';

/**
 * 1. 兄弟(Sibling)の入力定義
 */
export const siblingInputSchema = z.object({
    id: z.string().optional(),
    family_name: z.string().min(1, '兄弟の氏名は必須です'),
    first_name: z.string().min(1, '兄弟の氏名は必須です'),
    grade: z.string().min(1, '学年を入力してください'),
    class: z.string().min(1, '組を入力してください'),
    // チェックボックス等で複数選択されるスロット
    assigned_slot: z.string().optional(),
    family_id: z.string().min(1, '紐付ける生徒を選択してください'),
});

/**
 * 2. 生徒(Applicant)の入力定義
 */
export const applicantInputSchema = z.object({
    id: z.string().optional(), // 新規登録時は空
    family_name: z.string().min(1, '生徒の氏名は必須です'),
    first_name: z.string().min(1, '生徒の氏名は必須です'),
    student_id: z.string().min(1, '学籍番号を入力してください'),
    preferred_dates: z.array(z.string()),
    family_id: z.string().optional(),
    token: z.string().optional(),
    is_fixed: z.boolean(),
    is_last_slot: z.boolean(),
    needs_gap_after: z.boolean(),
});

/**
 * 3. フォーム全体の複合定義
 */
export const studentFormSchema = applicantInputSchema.extend({
    has_sibling: z.boolean().default(false),
    // has_siblingがtrueの時のみ、上記siblingInputSchemaのルールを適用する
    sibling_data: siblingInputSchema.optional(),
});

// --- 型の抽出 ---
export type StudentFormValues = z.infer<typeof studentFormSchema>;
export type Applicant = z.infer<typeof applicantInputSchema>;
export type Sibling = z.infer<typeof siblingInputSchema>;