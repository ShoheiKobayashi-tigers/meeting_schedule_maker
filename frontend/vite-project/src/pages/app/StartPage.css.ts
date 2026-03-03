// src/pages/app/StartPage.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const container = style({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: vars.color.background,
  padding: vars.space.medium,
});

export const card = style({
  width: '100%',
  maxWidth: '560px', 
  padding: vars.space.xl,
  backgroundColor: vars.color.white,
  borderRadius: vars.borderRadius.large,
  boxShadow: vars.shadow.floating,
  display: 'flex',
  flexDirection: 'column',
});

export const header = style({
  textAlign: 'center',
  marginBottom: vars.space.medium,
});

export const title = style({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: vars.color.textPrimary,
});

export const subtitle = style({
  fontSize: '0.9rem',
  color: vars.color.textSecondary,
  margin: 0,
});

// --- レイアウト用コンテナ ---
export const buttonGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.medium,
  width: '100%',
});

export const inputGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.medium,
});

export const divider = style({
  borderBottom: `1px solid ${vars.color.border}`,
  margin: `${vars.space.small} 0`,
});

export const linkContainer = style({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: vars.space.small,
  alignItems: 'center',
});

export const centerLink = style({
  textAlign: 'center',
  marginTop: vars.space.small,
});

// --- 共通Buttonの拡張クラス ---
// （Button.tsxの色設定を活かしつつ、StartPage用に大きく見せる）
export const largeButton = style({
  padding: '16px',
  fontSize: '1.05rem',
  width: '100%',
  justifyContent: 'center',
});

// --- 入力フォーム ---
export const inputField = style({
  width: '100%',
  padding: '14px',
  borderRadius: vars.borderRadius.medium,
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.white,
  fontSize: '1rem',
  color: vars.color.textPrimary,
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  ':focus': { 
    borderColor: vars.color.primary,
    boxShadow: `0 0 0 3px rgba(66, 153, 225, 0.1)`
  },
});

// --- メッセージ・警告系 ---
export const errorMessage = style({
  backgroundColor: '#fef2f2',
  color: vars.color.danger,
  padding: vars.space.medium,
  borderRadius: vars.borderRadius.medium,
  marginBottom: vars.space.large,
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '0.9rem',
});

export const warningBox = style({
  backgroundColor: '#fffbeb',
  padding: vars.space.medium,
  borderRadius: vars.borderRadius.medium,
  border: '1px solid #fde68a',
});

export const warningTitle = style({
  margin: `0 0 ${vars.space.small} 0`,
  color: '#b45309',
  fontSize: '0.95rem',
});

export const warningText = style({
  margin: 0,
  color: '#92400e',
  fontSize: '0.85rem',
  lineHeight: 1.5,
});

export const disclaimerLabel = style({
  display: 'flex',
  gap: vars.space.small,
  alignItems: 'flex-start',
  fontSize: '0.85rem',
  color: vars.color.textSecondary,
  cursor: 'pointer',
  marginTop: vars.space.xs,
  lineHeight: 1.4,
});

// --- パスワード入力欄のラッパー ---
export const passwordWrapper = style({
  position: 'relative',
  width: '100%',
});

export const passwordToggleBtn = style({
  position: 'absolute',
  right: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  padding: '4px',
  cursor: 'pointer',
  color: vars.color.textMuted,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'color 0.2s',
  ':hover': {
    color: vars.color.textPrimary,
  }
});

// ※既存の inputField に paddingRight を追加して、文字がアイコンに被らないようにします
export const passwordInputField = style([inputField, {
  paddingRight: '40px', 
}]);