import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css'

export const actionButtonGroup = style({
  display: 'flex',
  gap: vars.space.small,
  alignItems: 'center', // ボタンが縦にズレないように追加
});