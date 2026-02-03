// features/BulkSetup/components/steps/SyncStep.css.ts
import { style, keyframes } from '@vanilla-extract/css';
import { vars } from '../../../../styles/vars.css';

const pulse = keyframes({
  '0%': { opacity: 1 },
  '50%': { opacity: 0.5 },
  '100%': { opacity: 1 },
});

export const statusCard = style({
  padding: '32px',
  borderRadius: '12px',
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.surface,
  textAlign: 'center',
  marginTop: '24px',
});

export const indicator = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '24px',
});

export const dot = style({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: '#ccc', // デフォルト（オフライン）
});

export const dotOnline = style({
  backgroundColor: '#4caf50',
  boxShadow: '0 0 8px rgba(76, 175, 80, 0.5)',
  animation: `${pulse} 2s infinite`,
});

export const syncButton = style({
  width: '100%',
  maxWidth: '300px',
  padding: '12px',
  borderRadius: '6px',
  border: 'none',
  backgroundColor: vars.color.primary,
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
  ':disabled': {
    backgroundColor: vars.color.border,
    cursor: 'not-allowed',
  },
});