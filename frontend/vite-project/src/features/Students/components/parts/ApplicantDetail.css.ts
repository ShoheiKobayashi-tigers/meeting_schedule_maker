import { style } from '@vanilla-extract/css';
import { vars } from '../../../../styles/vars.css';

export const container = style({
  padding: vars.space.large,
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.large,
});

export const infoSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.small,
  paddingBottom: vars.space.medium,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const label = style({
  fontSize: '0.75rem',
  color: vars.color.textMuted,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const value = style({
  fontSize: '1.1rem',
  color: vars.color.textMain,
  fontWeight: '500',
});

export const nameValue = style([
  value,
  {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
]);

export const assignmentBox = style({
  backgroundColor: '#f0f7ff', // 非常に薄い青
  padding: vars.space.medium,
  borderRadius: '8px',
  border: '1px solid #c3dafe',
});

export const assignmentValue = style({
  fontSize: '1.1rem',
  color: vars.color.primary,
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.small,
});

export const buttonGroup = style({
  display: 'flex',
  gap: vars.space.medium,
  marginTop: vars.space.large,
});

export const deleteSection = style({
  marginTop: 'auto',
  paddingTop: vars.space.large,
  display: 'flex',
  justifyContent: 'flex-end',
});