import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

// ==========================================
// ※ container 等のレイアウト定義は layout.css.ts に任せるため削除しました
// ==========================================

// ヘッダーの下に固定するフィルターバーのスタイル
export const filterBar = style({
  padding: `${vars.space.medium} ${vars.space.large}`,
  backgroundColor: '#f8fafc', // ヘッダーと同じ色にして一体感を出します
  borderBottom: `1px solid ${vars.color.border}`,
  flexShrink: 0, // スクロールしても潰れない
});

// リスト内の情報
export const siblingInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const siblingName = style({
  fontWeight: 'bold',
  color: vars.color.textPrimary,
});

export const siblingDetail = style({
  fontSize: '0.85rem',
  color: vars.color.textSecondary,
});

// アクションボタン
export const actionButtonGroup = style({
  display: 'flex',
  gap: vars.space.small,
  alignItems: 'center',
});

// 空の状態
export const emptyMessage = style({
  textAlign: 'center',
  color: vars.color.textMuted,
  padding: '2rem',
  fontSize: '0.875rem',
  backgroundColor: vars.color.white,
  borderRadius: '8px',
  border: `1px dashed ${vars.color.border}`,
  marginTop: vars.space.medium,
});