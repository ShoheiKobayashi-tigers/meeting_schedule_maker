import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  border: `1px solid ${vars.color.border}`,
  overflow: 'hidden',
});

export const header = style({
  padding: '24px',
  borderBottom: `1px solid ${vars.color.border}`,
  backgroundColor: '#f8fafc',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const title = style({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: vars.color.textPrimary,
  margin: 0,
});

export const progressBadge = style({
  backgroundColor: vars.color.primary,
  color: '#ffffff',
  padding: '6px 16px',
  borderRadius: '999px',
  fontSize: '0.9rem',
  fontWeight: 'bold',
});

export const scrollArea = style({
  flex: 1,
  overflowY: 'auto',
  padding: '0',
});

export const listRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  borderBottom: `1px solid ${vars.color.border}`,
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: '#f1f5f9',
  },
});

export const studentInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const studentName = style({
  fontSize: '1rem',
  fontWeight: 'bold',
  color: vars.color.textPrimary,
});

export const studentId = style({
  color: vars.color.textSecondary,
  fontSize: '0.85rem',
  marginRight: '8px',
});

export const statusText = style({
  fontSize: '0.85rem',
  color: vars.color.textSecondary,
});