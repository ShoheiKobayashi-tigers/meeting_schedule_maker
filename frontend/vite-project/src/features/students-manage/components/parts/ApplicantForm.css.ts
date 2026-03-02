import { style } from '@vanilla-extract/css';
import { vars } from '../../../../styles/vars.css';
import { baseInput } from '../../../../styles/layout.css';

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.large,
  padding: vars.space.medium,
});

export const fieldGroup = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: vars.space.medium,
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.small,
});

export const label = style({
  fontSize: '0.875rem',
  fontWeight: 'bold',
  color: vars.color.textPrimary,
});

export const input = style([baseInput]); // 共通スタイルを適用

export const error = style({ // 新設
  color: vars.color.danger,
  fontSize: '0.75rem',
  marginTop: '2px',
});

export const buttonGroup = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: vars.space.medium,
  marginTop: vars.space.large,
});