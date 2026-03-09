import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css'

export const actionButtonGroup = style({
  display: 'flex',
  gap: vars.space.small,
  alignItems: 'center', // ボタンが縦にズレないように追加
});

// --- タイトル周り ---
export const titleWrapper = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});