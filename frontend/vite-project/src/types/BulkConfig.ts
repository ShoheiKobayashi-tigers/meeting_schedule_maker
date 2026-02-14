// src/types/Config.ts
import { z } from 'zod';

/**
 * お便り・学校基本設定のバリデーションスキーマ
 */
export const schoolSettingsSchema = z.object({
  // 学校名 (例: 〇〇市立 △△小学校)
  schoolName: z.string().min(1, '学校名は必須です').default(''),
  
  // 校長名 (例: 校長 佐藤 太郎)
  principalName: z.string().min(1, '校長名は必須です').default(''),
  
  // 送信者・担任名 (例: 第1学年1組 担任)
  senderName: z.string().min(1, '差出人名は必須です').default(''),

  className: z.string().min(1, 'クラス名は必須です').default(''),

  limitDate: z.string().optional(),

  isOpened: z.boolean(),
  
  // 案内文のカスタマイズ（任意項目）
  message: z.string().optional(),

  letterMessage: z.string().optional(),
  
  // 回答期限（日付文字列として保持）
  deadline: z.string().optional(),
});

/**
 * TypeScriptの型定義
 */
export type SchoolSettings = z.infer<typeof schoolSettingsSchema>;

/**
 * 初期値（TemplateStepなどで利用）
 */
// 定数として定義（ファイルの上のほう）
const DEFAULT_LETTER_MESSAGE = `保護者の皆様

いつも教育活動にご理解とご協力をいただき、ありがとうございます。
下記の日程で個別面談を行います。
つきましては、本システムのQRコードより、ご希望の日時を選択し、送信してください。

調整の上、後日決定した日時をお知らせいたします。
どうぞよろしくお願いいたします。`;


export const DEFAULT_SCHOOL_SETTINGS: SchoolSettings = {
  schoolName: '',
  principalName: '',
  senderName: '',
  className: '',
  limitDate: '',
  isOpened: true,
  message: '日頃より本校の教育活動へのご理解とご協力をいただき感謝申し上げます。さて、今年度も個人相談を実施いたします。',
  letterMessage: DEFAULT_LETTER_MESSAGE
};