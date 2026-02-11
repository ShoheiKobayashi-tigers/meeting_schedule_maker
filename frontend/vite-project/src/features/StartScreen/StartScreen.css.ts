import { style } from '@vanilla-extract/css';

export const container = style({
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f8fafc',
});

export const card = style({
  width: '100%',
  maxWidth: '480px',
  padding: '40px',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  textAlign: 'center',
});

export const title = style({
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1e293b',
  marginBottom: '8px',
});

export const subtitle = style({
  fontSize: '14px',
  color: '#64748b',
  marginBottom: '40px',
});

export const buttonGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const baseButton = style({
  padding: '16px',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.2s',
  border: 'none',
  width: '100%',
});

export const continueButton = style([baseButton, {
  backgroundColor: '#0070f3',
  color: 'white',
  ':hover': { backgroundColor: '#0051a2' },
  ':disabled': { backgroundColor: '#cbd5e1', cursor: 'not-allowed' },
}]);

export const newButton = style([baseButton, {
  backgroundColor: 'white',
  color: '#334155',
  border: '2px solid #e2e8f0',
  ':hover': { backgroundColor: '#f1f5f9' },
}]);

export const dataInfo = style({
  fontSize: '12px',
  marginLeft: '8px',
  opacity: 0.8,
});

export const note = style({
  marginTop: '24px',
  fontSize: '12px',
  color: '#94a3b8',
});