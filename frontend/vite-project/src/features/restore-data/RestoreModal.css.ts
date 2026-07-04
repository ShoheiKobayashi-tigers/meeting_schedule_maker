// src/features/restore-data/RestoreModal.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.7)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 99999,
});

export const container = style({
  backgroundColor: vars.color.white,
  padding: '32px',
  borderRadius: vars.borderRadius.large,
  width: '90%',
  maxWidth: '520px',
  boxShadow: vars.shadow.floating,
});

export const title = style({
  margin: '0 0 8px 0',
  fontSize: '1.4rem',
  color: vars.color.textPrimary,
  fontWeight: 'bold',
});

// 新設：ステップ状況のバー
export const stepIndicator = style({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '24px',
  borderBottom: `1px solid ${vars.color.border}`,
  paddingBottom: '12px',
  gap: '8px',
});

const baseStep = style({
  fontSize: '0.75rem',
  fontWeight: 'bold',
  padding: '4px 8px',
  borderRadius: '4px',
});

export const activeStep = style([baseStep, {
  backgroundColor: `${vars.color.primary}22`,
  color: vars.color.primary,
}]);

export const inactiveStep = style([baseStep, {
  backgroundColor: '#f1f5f9',
  color: vars.color.textMuted,
}]);

export const errorMessage = style({
  backgroundColor: '#fef2f2',
  color: vars.color.danger,
  padding: '12px',
  borderRadius: vars.borderRadius.medium,
  marginBottom: '16px',
  fontSize: '0.85rem',
  whiteSpace: 'pre-wrap',
  fontWeight: 'bold',
  border: '1px solid #fecaca',
});

// 新設：検証成功時のボックス
export const successBox = style({
  backgroundColor: '#f0fdf4',
  color: '#166534',
  padding: '14px',
  borderRadius: vars.borderRadius.medium,
  fontSize: '0.85rem',
  fontWeight: 'bold',
  border: '1px solid #bbf7d0',
  lineHeight: '1.5',
  marginBottom: '16px',
});

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
});

export const label = style({
  fontSize: '0.85rem',
  fontWeight: 'bold',
  marginBottom: '8px',
  color: vars.color.textPrimary,
  lineHeight: '1.4',
});

export const input = style({
  width: '100%',
  padding: '12px',
  borderRadius: vars.borderRadius.medium,
  border: `1px solid ${vars.color.border}`,
  fontSize: '1rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'all 0.2s',
  color: vars.color.textPrimary,
  ':focus': {
    borderColor: vars.color.primary,
    boxShadow: `0 0 0 3px rgba(66, 153, 225, 0.1)`,
  },
});

export const urlInput = style([input, {
  fontFamily: 'monospace',
  fontSize: '0.85rem',
}]);

export const passwordInput = style([input, {
  marginBottom: '8px',
}]);

export const divider = style({
  borderBottom: `1px dashed ${vars.color.border}`,
  margin: '8px 0',
});

export const footer = style({
  display: 'flex',
  gap: '12px',
  marginTop: '16px',
  justifyContent: 'flex-end',
});