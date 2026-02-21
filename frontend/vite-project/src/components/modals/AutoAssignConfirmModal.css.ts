import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css'

export const overlay = style({
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 3000,
});

export const modal = style({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '32px',
  width: '500px',
  maxWidth: '90%',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
});

export const title = style({
  fontSize: '20px',
  fontWeight: 'bold',
  color: vars.color.textPrimary,
  marginBottom: '24px',
  textAlign: 'center',
});

export const summaryBox = style({
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center',
  marginBottom: '24px',
});

export const summaryText = style({
  fontSize: '18px',
  color: '#334155',
  marginBottom: '8px',
});

export const highlight = style({
  fontSize: '28px',
  fontWeight: 'bold',
  color: vars.color.primary, // もしvarsになければ '#3b82f6' などにしてください
  margin: '0 4px',
});

export const successMessage = style({
  fontSize: '14px',
  color: '#16a34a',
  margin: 0,
  fontWeight: 'bold',
});

export const warningMessage = style({
  fontSize: '14px',
  color: '#ea580c',
  margin: 0,
  fontWeight: 'bold',
});

export const unassignedList = style({
  backgroundColor: '#fff7ed',
  border: '1px solid #fed7aa',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '24px',
  maxHeight: '150px',
  overflowY: 'auto',
});

export const unassignedTitle = style({
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#c2410c',
  marginBottom: '8px',
});

export const actions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
});