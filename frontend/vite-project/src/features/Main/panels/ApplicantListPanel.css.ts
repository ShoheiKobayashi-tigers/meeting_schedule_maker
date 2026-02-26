import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

// ※ container, title, scrollArea, deleteButton 等は削除しました

export const guideMessage = style({
  color: vars.color.textSecondary,
  fontSize: '0.875rem',
  lineHeight: '1.4',
  marginBottom: vars.space.medium,
});

export const actionArea = style({
  marginTop: vars.space.medium, // スクロール領域とボタンの間に少し余白
  paddingTop: vars.space.medium,
  borderTop: `1px solid ${vars.color.border}`, // リストとの区切り線（上部に変更）
  display: 'flex',
  justifyContent: 'center',
});

// ドロップゾーン専用のスタイル（ボタンとは少し違う見た目のため残します）
export const dropZone = style({
  padding: '0.75rem 1rem',
  backgroundColor: '#edf2f7', // 薄いグレー
  color: vars.color.textSecondary,
  border: `2px dashed ${vars.color.border}`,
  borderRadius: vars.borderRadius.medium,
  textAlign: 'center',
  fontSize: '0.9rem',
  fontWeight: '600',
  width: '100%',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: '#e2e8f0',
    borderColor: vars.color.textSecondary,
  },
});

export const emptyState = style({
  textAlign: 'center',
  padding: '2rem',
  color: vars.color.textMuted,
  fontWeight: '700',
});