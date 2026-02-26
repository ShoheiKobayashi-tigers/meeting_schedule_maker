import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

// ------------------------------------------------------------------
// ※ container, title, scrollArea, listHeader, listRow の定義はすべて削除し、
//    layout.css.ts の共通クラスを直接 .tsx 側で使うようにしました！
// ------------------------------------------------------------------

export const studentInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const studentName = style({
  fontWeight: 'bold',
});

export const studentId = style({
  fontSize: '0.85rem',
  color: vars.color.textPrimary,
});

export const actionButtonGroup = style({
  display: 'flex',
  gap: vars.space.small,
  alignItems: 'center', // ボタンが縦にズレないように追加
});

export const assignmentBadge = style({
  marginLeft: vars.space.small,
  fontSize: '0.7rem',
  padding: '2px 6px',
  backgroundColor: '#EBF8FF', // Light Blue
  color: '#2B6CB0',           // Dark Blue
  borderRadius: '4px',
  fontWeight: 'normal',
  verticalAlign: 'middle',
});

export const assignmentDetail = style({
  marginTop: '4px',
  fontSize: '0.8rem',
  color: vars.color.primary,
  fontWeight: '500',
});

export const noAssignment = style({
  marginTop: '4px',
  fontSize: '0.8rem',
  color: vars.color.textMuted,
  fontStyle: 'italic',
});