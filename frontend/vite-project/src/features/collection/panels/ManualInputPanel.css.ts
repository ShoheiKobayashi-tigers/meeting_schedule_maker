import { style } from '@vanilla-extract/css';
import { keyframes } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

export const progressBadge = style({
  backgroundColor: vars.color.primary,
  color: vars.color.white,
  padding: '6px 16px',
  borderRadius: '999px',
  fontSize: '0.9rem',
  fontWeight: 'bold',
});

export const headerContent = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
});

export const headerLeft = style({
  display: 'flex',
  alignItems: 'center',
});

// ▼ 右側にボタンとバッジを並べるためのコンテナ（追加）
export const headerRight = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
});

// ▼ アイコンをくるくる回すアニメーション（追加）
const spin = keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' }
});

export const spinningIcon = style({
  animation: `${spin} 1s linear infinite`,
});

export const studentInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const studentName = style({
  fontSize: '1rem',
  fontWeight: 'bold',
  color: vars.color.textPrimary,
});

export const studentId = style({
  color: vars.color.textSecondary,
  fontSize: '0.85rem',
  marginRight: '8px',
});

export const rightSection = style({
  display: 'flex',
  alignItems: 'center',
  gap: '24px', 
});

export const statusText = style({
  fontSize: '0.95rem',
  minWidth: '160px', 
  textAlign: 'right',
});