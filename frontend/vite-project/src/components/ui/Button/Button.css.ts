import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

export const baseButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.small,
  padding: '8px 16px',
  borderRadius: '6px',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: '1px solid transparent',
  whiteSpace: 'nowrap',
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
    filter: 'grayscale(1)',
  },
});

export const variant = styleVariants({
  add: {
    backgroundColor: vars.color.primary,
    color: 'white',
    ':hover': { opacity: 0.9 },
  },
  confirm: {
    backgroundColor: vars.color.primary,
    color: 'white',
    ':hover': { opacity: 0.9 },
  },
  edit: {
    backgroundColor: 'white',
    color: vars.color.textMain,
    borderColor: vars.color.border,
    ':hover': { backgroundColor: vars.color.hoverGray },
  },
  cancel: {
    backgroundColor: 'white',
    color: vars.color.textMuted,
    borderColor: vars.color.border,
    ':hover': { backgroundColor: vars.color.hoverGray },
  },
  delete: {
    backgroundColor: 'white',
    color: '#E53E3E', // Danger Red
    borderColor: '#E53E3E',
    ':hover': { 
      backgroundColor: '#FFF5F5',
      borderColor: '#C53030'
    },
  },
});

// アイコン専用のサイズ調整など
export const icon = style({
  fontSize: '1.1em',
});