import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

// layout.css.ts に任せる container や header 等は削除しました

export const formGrid = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.large,
  marginBottom: '32px',
  padding: vars.space.large,
  backgroundColor: vars.color.white,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const inputRow = style({
  display: 'flex',
  gap: vars.space.large,
  width: '100%',
  '@media': {
    'screen and (max-width: 640px)': {
      flexDirection: 'column', // 画面が狭い場合は自動で縦に並べる
    },
  },
});

export const label = style({
  display: 'flex',
  flexDirection: 'column',
  gap: vars.space.small,
  fontSize: '0.9rem',
  fontWeight: 'bold',
  color: vars.color.textPrimary,
  flex: 1
});

export const input = style({
  padding: '12px 16px',
  borderRadius: vars.borderRadius.small,
  border: `1px solid ${vars.color.border}`,
  fontSize: '1rem',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'all 0.2s ease',
  backgroundColor: vars.color.white,
  ':focus': {
    outline: 'none',
    borderColor: vars.color.primary,
    boxShadow: `0 0 0 3px ${vars.color.primary}1a`,
  },
});

export const textarea = style([input, {
  resize: 'vertical',
  lineHeight: '1.6',
  minHeight: '120px',
}]);

// --- ダウンロードエリア ---
export const downloadArea = style({
  backgroundColor: '#f8fafc',
  borderRadius: vars.borderRadius.medium,
  padding: '32px',
  textAlign: 'center',
  margin: `0 ${vars.space.large} 32px`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
});

export const statusBadge = style({
  padding: '6px 16px',
  borderRadius: '20px',
  backgroundColor: vars.color.white,
  color: '#0284c7', 
  fontSize: '0.85rem',
  fontWeight: '800',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  display: 'inline-block',
});

export const downloadIcon = style({
  fontSize: '48px',
  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
});

export const footer = style({
  padding: vars.space.large,
  borderTop: `1px solid ${vars.color.border}`,
  display: 'flex',
  justifyContent: 'flex-end',
  backgroundColor: vars.color.white,
});