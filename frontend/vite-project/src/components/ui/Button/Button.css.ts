import { style, styleVariants } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

export const baseButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: vars.space.small,
  padding: '8px 16px',
  borderRadius: vars.borderRadius.medium, // ★直書きの6pxからvarsに変更
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
  primary: {
    backgroundColor: vars.color.primary,
    color: vars.color.white,
    ':hover': { backgroundColor: vars.color.primaryHover },
  },
  secondary: {
    backgroundColor: vars.color.hoverGray,
    color: vars.color.textPrimary,
    ':hover': { backgroundColor: vars.color.border },
  },
  outline: {
    backgroundColor: vars.color.white,
    color: vars.color.textPrimary,
    borderColor: vars.color.border,
    ':hover': { backgroundColor: vars.color.hoverGray },
  },
  danger: {
    backgroundColor: vars.color.white,
    color: vars.color.danger,
    borderColor: vars.color.danger,
    ':hover': { 
      backgroundColor: '#FFF5F5',
      borderColor: vars.color.dangerHover,
      color: vars.color.dangerHover,
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: vars.color.textSecondary,
    ':hover': {
      backgroundColor: vars.color.hoverGray,
      color: vars.color.textPrimary,
    }
  }
});

// アイコン専用のサイズ調整など
export const icon = style({
  fontSize: '1.1em',
});