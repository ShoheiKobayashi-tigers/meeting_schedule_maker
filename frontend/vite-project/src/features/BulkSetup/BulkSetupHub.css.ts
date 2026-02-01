// features/BulkSetup/BulkSetupHub.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const overlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: vars.color.background, // または白
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  animation: 'fadeIn 0.2s ease-out',
});

export const header = style({
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  borderBottom: `1px solid ${vars.color.border}`,
});

export const container = style({
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
});

export const sidebar = style({
  width: '260px',
  borderRight: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.surface,
  padding: '24px 0',
});

export const content = style({
  flex: 1,
  padding: '40px',
  overflowY: 'auto',
});

export const stepList = style({
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

export const stepItem = style({
  padding: '16px 24px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  borderLeft: '4px solid transparent',
  ':hover': {
    backgroundColor: vars.color.backgroundHover,
  },
});

export const stepItemActive = style([
  stepItem,
  {
    backgroundColor: vars.color.backgroundActive, // ほんのり色をつける
    borderLeft: `4px solid ${vars.color.primary}`, // 左端にアクセントカラー
    fontWeight: 'bold',
  }
]);

export const stepLabel = style({
  fontSize: '14px',
  display: 'block',
});

export const stepDescription = style({
  fontSize: '11px',
  color: vars.color.textSecondary,
  marginTop: '4px',
  fontWeight: 'normal',
});

export const headerLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
});

export const title = style({
  margin: 0,
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: vars.color.textPrimary,
});

export const closeButton = style({
  padding: '8px 16px',
  backgroundColor: 'transparent',
  border: `1px solid ${vars.color.border}`,
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: vars.color.backgroundHover,
    borderColor: vars.color.textSecondary,
  },
});

export const placeholder = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: vars.color.textSecondary,
  textAlign: 'center',
  border: `2px dashed ${vars.color.border}`,
  borderRadius: '12px',
  padding: '60px',
  backgroundColor: vars.color.surface,
});

// コンテンツの中央寄せを微調整
export const contentInner = style({
  maxWidth: '900px',
  margin: '0 auto',
  height: '100%',
});