import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

export const overlay = style({
  position: 'fixed',
  top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: 1000,
});

export const container = style({
  backgroundColor: vars.color.white,
  borderRadius: '12px',
  width: '90vw',
  maxWidth: '1000px',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  padding: vars.space.large,
  boxShadow: vars.shadow.panel,
});

export const header = style({ 
  marginBottom: vars.space.medium,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const headerLeft = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const title = style({ 
  fontSize: '1.25rem', 
  fontWeight: 700, 
  margin: 0, 
  color: vars.color.primary,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const studentIdBadge = style({
  backgroundColor: '#f1f5f9',
  color: '#475569',
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '1rem',
});

export const subTitle = style({ 
  fontSize: '0.85rem', 
  color: vars.color.textMuted, 
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const realtimeText = style({
  color: '#64748b',
  fontSize: '0.8rem',
  backgroundColor: '#f8fafc',
  padding: '2px 8px',
  borderRadius: '4px',
});

export const tableContainer = style({
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  minHeight: 0,
});

export const cell = style({
  width: '100%',
  height: '100%',
  minHeight: '40px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',
  ':hover': { backgroundColor: vars.color.hoverGray },
});

export const selectedCell = style({
  backgroundColor: `${vars.color.primary}22`, 
  border: `2px solid ${vars.color.primary}`,
  boxSizing: 'border-box',
});

export const checkIcon = style({
  color: vars.color.primary,
  fontWeight: 'bold',
  fontSize: '1.2rem',
});

export const footer = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: vars.space.large,
  paddingTop: vars.space.medium,
  borderTop: `1px solid ${vars.color.border}`,
});