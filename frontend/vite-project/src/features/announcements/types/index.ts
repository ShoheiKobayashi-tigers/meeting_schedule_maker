import { ReactNode } from 'react';

export interface Announcement {
  id: string;           // localStorage の重複判定に使う一意のID (例: 'apology-20260512')
  title: string;        // モーダルのタイトル
  content: ReactNode;   // モーダルの本文（JSXを許容してリッチな表現を可能にする）
  isActive: boolean;    // 現在表示対象とするかどうかのフラグ
}