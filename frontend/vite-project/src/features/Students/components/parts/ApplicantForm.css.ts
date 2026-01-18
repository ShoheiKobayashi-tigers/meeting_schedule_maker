import { style } from '@vanilla-extract/css';
import { vars } from '../../../../styles/vars.css';

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

export const input = style({
  padding: '10px',
  borderRadius: '4px',
  border: `1px solid ${vars.color.border}`,
  fontSize: '1rem',
  ':focus': {
    outline: 'none',
    borderColor: vars.color.primary,
  },
});

export const buttonGroup = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: vars.space.medium,
  marginTop: vars.space.large,
});