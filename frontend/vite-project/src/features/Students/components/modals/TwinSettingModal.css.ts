// features/Students/components/modals/TwinSettingModal.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '../../../../styles/vars.css';

export const overlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
});

export const container = style({
  backgroundColor: vars.color.white,
  borderRadius: '12px',
  width: '500px',
  maxWidth: '90%',
  maxHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  padding: '24px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
});

export const header = style({
  marginBottom: '20px',
});

export const title = style({
  fontSize: '1.25rem',
  fontWeight: 700,
  color: vars.color.textPrimary,
  margin: '0 0 8px 0',
});

export const description = style({
  fontSize: '0.875rem',
  color: vars.color.textSecondary,
  lineHeight: 1.5,
  margin: 0,
});

export const listContainer = style({
  flex: 1,
  overflowY: 'auto',
  border: `1px solid ${vars.color.border}`,
  borderRadius: '8px',
  padding: '8px',
  marginBottom: '24px',
  maxHeight: '400px',
});

export const listItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  borderBottom: `1px solid ${vars.color.border}`,
  ':last-child': {
    borderBottom: 'none',
  },
  ':hover': {
    backgroundColor: vars.color.hoverGray,
  },
});

export const selectedItem = style({
  backgroundColor: '#e6fffa', // 薄い緑（選択状態）
  borderColor: '#38b2ac',
});

export const radioInput = style({
  width: '18px',
  height: '18px',
  cursor: 'pointer',
  accentColor: vars.color.primary,
});

export const studentInfo = style({
  display: 'flex',
  flexDirection: 'column',
});

export const studentName = style({
  fontSize: '1rem',
  fontWeight: 600,
  color: vars.color.textPrimary,
});

export const studentId = style({
  fontSize: '0.75rem',
  color: vars.color.textMuted,
});

export const emptyMessage = style({
  padding: '24px',
  textAlign: 'center',
  color: vars.color.textMuted,
  fontSize: '0.875rem',
});

export const footer = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  paddingTop: '20px',
  borderTop: `1px solid ${vars.color.border}`,
});