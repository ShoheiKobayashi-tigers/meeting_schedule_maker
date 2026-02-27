import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  width: '100%',
  maxWidth: '400px',
  margin: '0 auto',
  boxSizing: 'border-box',
  fontFamily: 'sans-serif',
});

// プレビュー時（先生画面）専用のスタイル調整
export const previewContainer = style([container, {
  padding: 0,
  margin: '0 auto',
}]);

// 通常時（保護者スマホ画面）のスタイル調整
export const normalContainer = style([container, {
  padding: '24px',
  backgroundColor: vars.color.white,
  marginTop: '4vh', // スマホ縦横対応のため固定pxではなくvhを使用
}]);

export const infoCard = style({
  backgroundColor: '#f8fafc',
  padding: '16px',
  borderRadius: vars.borderRadius.medium,
  border: `1px solid ${vars.color.border}`,
  textAlign: 'left',
});

export const infoTitle = style({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: vars.color.textPrimary,
  marginBottom: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const messageBox = style({
  fontSize: '0.9rem',
  color: vars.color.textSecondary,
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap',
  marginTop: '12px',
});

export const inputGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  alignItems: 'center',
});

export const label = style({
  fontSize: '0.9rem',
  fontWeight: 'bold',
  color: vars.color.textPrimary,
});

export const input = style({
  padding: '14px 16px',
  borderRadius: vars.borderRadius.small,
  border: `2px solid ${vars.color.border}`,
  fontSize: '1.5rem', // 大きくして入力しやすく
  textAlign: 'center',
  letterSpacing: '4px',
  width: '240px',
  boxSizing: 'border-box',
  transition: 'all 0.2s',
  color: vars.color.textPrimary,
  textTransform: 'uppercase',
  ':focus': {
    outline: 'none',
    borderColor: vars.color.primary,
    boxShadow: `0 0 0 3px ${vars.color.primary}1a`,
  },
  '::placeholder': {
    color: '#cbd5e1',
  }
});

export const inputPreview = style([input, {
  backgroundColor: '#f1f5f9',
}]);

export const errorMessage = style({
  color: vars.color.danger,
  fontSize: '0.85rem',
  padding: '12px',
  backgroundColor: '#fef2f2',
  borderRadius: vars.borderRadius.small,
  border: `1px solid ${vars.color.danger}40`,
  whiteSpace: 'pre-wrap',
  textAlign: 'center',
  lineHeight: '1.5',
  fontWeight: 'bold',
});