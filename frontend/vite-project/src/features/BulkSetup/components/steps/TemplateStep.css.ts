// features/BulkSetup/components/steps/TemplateStep.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '../../../../styles/vars.css';

export const formContainer = style({
  display: 'grid',
  gap: '24px',
  maxWidth: '500px',
  marginTop: '24px',
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const label = style({
  fontSize: '14px',
  fontWeight: 'bold',
  color: vars.color.textPrimary,
});

export const input = style({
  padding: '10px 12px',
  borderRadius: '6px',
  border: `1px solid ${vars.color.border}`,
  fontSize: '16px',
  transition: 'border-color 0.2s',
  ':focus': {
    outline: 'none',
    borderColor: vars.color.primary,
  },
});

export const actions = style({
  marginTop: '40px',
  display: 'flex',
  justifyContent: 'flex-end',
});