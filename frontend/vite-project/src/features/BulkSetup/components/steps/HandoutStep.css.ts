// features/BulkSetup/components/steps/HandoutStep.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '../../../../styles/vars.css';

export const printHero = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px 20px',
  backgroundColor: vars.color.backgroundHover,
  borderRadius: '16px',
  margin: '24px 0',
  border: `1px solid ${vars.color.border}`,
});

export const icon = style({
  fontSize: '64px',
  marginBottom: '20px',
});

export const statusBadge = style({
  padding: '4px 12px',
  borderRadius: '20px',
  backgroundColor: '#e1f5fe',
  color: '#0288d1',
  fontSize: '13px',
  fontWeight: 'bold',
  marginBottom: '16px',
});

export const downloadBtn = style({
  padding: '12px 24px',
  backgroundColor: vars.color.surface,
  border: `2px solid ${vars.color.primary}`,
  color: vars.color.primary,
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: vars.color.primary,
    color: 'white',
  },
});