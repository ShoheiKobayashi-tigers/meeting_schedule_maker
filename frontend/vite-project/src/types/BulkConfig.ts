// src/types/Config.ts
import { z } from 'zod';

/**
 * お便り・学校基本設定のバリデーションスキーマ
 */
export const schoolSettingsSchema = z.object({
  eventName: z.string().min(1, 'イベント名は必須です'),

  distributionDate: z.string().min(1, 'お便り配布予定日は必須です'),

  // 学校名 (例: 〇〇市立 △△小学校)
  schoolName: z.string().min(1, '学校名は必須です'),
  
  // 校長名 (例: 校長 佐藤 太郎)
  principalName: z.string().min(1, '校長名は必須です'),
  
  // 送信者・担任名 (例: 第1学年1組 担任)
  senderName: z.string().min(1, '差出人名は必須です'),

  className: z.string().min(1, 'クラス名は必須です'),

  isOpened: z.boolean(),
  
  // 案内文のカスタマイズ（任意項目）
  formMessage: z.string().min(1, '保護者フォームの本文は必須です'),

  letterMessage: z.string().min(1, 'お便りの本文は必須です'),
  
  // 回答期限（日付文字列として保持）
  limitDate: z.string().min(1, '回答期限は必須です'),
});

/**
 * TypeScriptの型定義
 */
export type SchoolSettings = z.infer<typeof schoolSettingsSchema>;

/**
 * 初期値（TemplateStepなどで利用）
 */
// 定数として定義（ファイルの上のほう）

const DEFAULT_LETTER_MESSAGE = `　梅雨の候、保護者の皆様におかれましては、ますますご清祥のこととお慶び申し上げます。
　日頃より、本校の教育活動にご理解とご協力をいただき、厚く御礼申し上げます。
　さて、今学期の学校でのお子様の様子をお伝えし、ご家庭での様子をお伺いして、今後の指導に役立てるため、下記のとおり個人面談を実施いたします。
つきましては、ご多用中とは存じますが、ご出席くださいますようご案内申し上げます。
　本システムでは、スマートフォン等から希望日時を登録していただくことができます。
　下記のQRコード、または認証コードをご利用の上、期間内にご回答をお願いいたします。
　尚、本校に兄弟姉妹がいらっしゃる場合は、使用するQRコード及びURLが異なりますのでご注意ください。`;

const DEFAULT_FORM_MESSAGE = `　日頃より本校の教育活動にご理解とご協力をいただき、ありがとうございます。

　個人面談の希望日時をお伺いします。
　お手元の案内状に記載されている「認証コード（6桁）」を入力し、次へ進んでください。`;


export const DEFAULT_SCHOOL_SETTINGS: SchoolSettings = {
  eventName: '個人面談',
  distributionDate: '',
  schoolName: '',
  principalName: '',
  senderName: '',
  className: '',
  limitDate: '',
  letterMessage: DEFAULT_LETTER_MESSAGE,
  isOpened: true,
  formMessage: DEFAULT_FORM_MESSAGE,
};