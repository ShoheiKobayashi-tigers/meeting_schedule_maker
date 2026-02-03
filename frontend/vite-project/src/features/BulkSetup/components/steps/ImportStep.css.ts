import { style } from '@vanilla-extract/css';
import { vars } from '../../../../styles/vars.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  padding: '8px',
});

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const sectionTitle = style({
  fontSize: '18px',
  fontWeight: 'bold',
  color: vars.color.textPrimary,
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const description = style({
  fontSize: '14px',
  color: vars.color.textSecondary,
  lineHeight: '1.6',
  margin: 0,
});

// ファイル選択・ドロップエリア
export const dropzone = style({
  border: `2px dashed ${vars.color.border}`,
  borderRadius: '12px',
  padding: '40px',
  textAlign: 'center',
  backgroundColor: vars.color.surface,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  position: 'relative',
  ':hover': {
    borderColor: vars.color.primary,
    backgroundColor: vars.color.backgroundHover,
  },
});

export const fileInput = style({
  position: 'absolute',
  inset: 0,
  opacity: 0,
  cursor: 'pointer',
});

export const uploadIcon = style({
  fontSize: '32px',
  marginBottom: '12px',
  display: 'block',
});

// 区切り線
export const divider = style({
  border: 'none',
  borderTop: `1px solid ${vars.color.border}`,
  margin: 0,
});

// プレビュー表示用（インポート後のテーブル等）
export const previewCard = style({
  border: `1px solid ${vars.color.border}`,
  borderRadius: '8px',
  overflow: 'hidden',
  marginTop: '16px',
});