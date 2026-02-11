// features/ParentForm/GuardianPortal.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

export const container = style({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  backgroundColor: '#f8f9fa',
});

export const card = style({
  width: '100%',
  maxWidth: '400px',
  backgroundColor: '#fff',
  padding: '32px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
});

export const schoolName = style({
  fontSize: '14px',
  color: '#666',
  textAlign: 'center',
  marginBottom: '8px',
});

export const title = style({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: '24px',
  color: vars.color.textPrimary,
});

export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const input = style({
  padding: '16px',
  fontSize: '24px',
  textAlign: 'center',
  letterSpacing: '0.5em',
  border: `2px solid #ddd`,
  borderRadius: '8px',
  textTransform: 'uppercase',
  ':focus': {
    borderColor: vars.color.primary,
    outline: 'none',
  },
});

export const errorText = style({
  color: '#e53e3e',
  fontSize: '12px',
  textAlign: 'center',
});

export const submitButton = style({
  backgroundColor: vars.color.primary,
  color: '#fff',
  padding: '16px',
  borderRadius: '8px',
  border: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
  ':disabled': {
    opacity: 0.5,
  },
});