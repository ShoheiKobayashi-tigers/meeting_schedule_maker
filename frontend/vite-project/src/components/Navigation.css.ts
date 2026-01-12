import { style } from '@vanilla-extract/css';
import { vars } from '../styles/vars.css';
import { baseButton } from '../styles/layout.css.ts';

export const navBar = style({
  display: 'flex',
  backgroundColor: '#2d3748', // ダークグレー
  padding: '0 1rem',
  gap: '0.5rem',
  height: '50px',
  alignItems: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});

export const navButton = style({
  padding: '0.5rem 1rem',
  backgroundColor: 'transparent',
  border: 'none',
  color: '#cbd5e0',
  fontSize: '0.9rem',
  fontWeight: '600',
  cursor: 'pointer',
  borderRadius: '4px',
  transition: 'all 0.2s',
  outline: 'none',

  ':hover': {
    backgroundColor: '#4a5568',
    color: '#fff',
  },
});

export const navButtonActive = style({
  backgroundColor: '#4a5568',
  color: '#fff',
});

export const navButtonLabel = style({
  display: 'inline-block',
});

export const restoreButton = style([baseButton, {
  backgroundColor: 'transparent',
  color: vars.color.textMuted,
  border: `1px solid ${vars.color.border}`,
  fontSize: '0.8rem',
  padding: '6px 12px',
  ':hover': {
    backgroundColor: vars.color.background,
    color: vars.color.primary,
    borderColor: vars.color.primary,
  }
}]);

export const bottomActions = style({
  padding: vars.space.medium,
  marginTop: 'auto', // サイドバーの場合、下端に寄せる
  borderTop: `1px solid ${vars.color.border}`,
});
