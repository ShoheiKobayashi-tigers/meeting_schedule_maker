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
  overflowY: 'auto',
  marginBottom: '60px'
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
    backgroundColor: vars.color.hoverGray,
  },
});

export const stepItemActive = style([
  stepItem,
  {
    backgroundColor: vars.color.border, // ほんのり色をつける
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
    backgroundColor: vars.color.hoverGray,
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

// --- ダウンロードエリアのリッチ化 ---
export const downloadArea = style({
  backgroundColor: '#f8fafc',
  border: `1px solid ${vars.color.border}`,
  borderRadius: '16px',
  padding: '32px',
  textAlign: 'center',
  marginBottom: '40px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
});

export const statusBadge = style({
  padding: '6px 16px',
  borderRadius: '20px',
  backgroundColor: '#fff',
  color: '#0284c7',
  fontSize: '12px',
  fontWeight: '800',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  marginBottom: '8px',
  display: 'inline-block',
});

export const downloadIcon = style({
  fontSize: '56px',
  marginBottom: '8px',
  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
});

export const downloadTitle = style({
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#334155',
  margin: 0,
});

export const baseButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  backgroundColor: vars.color.primary, // #0070f3
  color: 'white',
  border: 'none',
  padding: '14px 32px',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.2s',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  textDecoration: 'none',
  ':hover': {
    opacity: 0.9,
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
  ':active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  ':disabled': {
    backgroundColor: '#cbd5e1',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
  }
});

export const downloadButton = style([baseButton, {
  width: '100%',
  maxWidth: '400px',
}]);
