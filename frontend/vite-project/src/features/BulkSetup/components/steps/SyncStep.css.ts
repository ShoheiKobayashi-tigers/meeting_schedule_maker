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
export const container = style({
  padding: '24px',
  textAlign: 'center',
  maxWidth: '800px',
  margin: '0 auto',
});

export const section = style({
  marginBottom: '32px',
});

export const sectionTitle = style({
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '24px',
  color: '#333',
});

export const previewCard = style({
  backgroundColor: '#fff',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  padding: '32px',
  textAlign: 'center',
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

export const settingItem = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  marginBottom: '32px',
  padding: '16px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
});

export const label = style({
  fontWeight: 'bold',
  color: '#334155',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const checkbox = style({
  width: '18px',
  height: '18px',
  cursor: 'pointer',
  accentColor: '#0070f3',
});

export const statusText = style({
  fontSize: '14px',
  marginLeft: '8px',
  padding: '4px 12px',
  borderRadius: '20px',
  fontWeight: 'bold',
  transition: 'all 0.2s',
});