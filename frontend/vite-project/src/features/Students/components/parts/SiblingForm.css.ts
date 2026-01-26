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
  color: vars.color.textMain,
});



export const buttonGroup = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: vars.space.medium,
  marginTop: vars.space.large,
});

export const input = style([baseInput]); // 既存の共通スタイルを継承

export const error = style({
  color: vars.color.danger, // varsの定義を使用
  fontSize: '0.75rem',
  marginTop: '2px',
  fontWeight: 500,
});