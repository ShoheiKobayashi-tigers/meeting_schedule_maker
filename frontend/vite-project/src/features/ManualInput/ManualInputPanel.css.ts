import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const progressBadge = style({
  backgroundColor: vars.color.primary,
  color: vars.color.white,
  padding: '6px 16px',
  borderRadius: '999px',
  fontSize: '0.9rem',
  fontWeight: 'bold',
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

export const rightSection = style({
  display: 'flex',
  alignItems: 'center',
  gap: '24px', 
});

export const statusText = style({
  fontSize: '0.95rem',
  minWidth: '160px', 
  textAlign: 'right',
});