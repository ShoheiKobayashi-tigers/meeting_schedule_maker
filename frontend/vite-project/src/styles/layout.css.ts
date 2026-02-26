// src/styles/layout.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from './vars.css.ts'; 

/* =========================================
   1. アプリ全体の土台 (App.tsx 用)
========================================= */
export const appContainer = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden', 
  backgroundColor: vars.color.background, 
});

export const appHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: `0 ${vars.space.large}`,
  height: '48px',
  backgroundColor: vars.color.white,
  borderBottom: `1px solid ${vars.color.border}`,
  flexShrink: 0,
});

export const appTitle = style({
  fontWeight: 'bold', 
  fontSize: '1.2rem', 
  color: vars.color.primary,
  margin: 0,
});

export const appMainArea = style({
  flex: 1, 
  display: 'flex',
  flexDirection: 'column',
  padding: vars.space.large, 
  overflow: 'hidden', 
  minHeight: 0,
});

/* =========================================
   2. パネルの「箱」 (※スクロール機能は持たない)
========================================= */
export const basePanelCard = style({
  backgroundColor: vars.color.white,
  borderRadius: '12px',
  border: `1px solid ${vars.color.border}`,
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden', 
});

export const pageLayoutDouble = style({
  display: 'flex',
  gap: vars.space.large,
  flex: 1,
  minHeight: 0,
});

export const leftPanel = style([basePanelCard, { flex: 1, minWidth: 0 }]);
export const rightPanel = style([basePanelCard, { width: '25%', minWidth: '350px', flexShrink: 0 }]);

/* =========================================
   3. パネル内の「固定ヘッダー」
========================================= */
export const panelHeader = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 24px',
  borderBottom: `1px solid ${vars.color.border}`,
  backgroundColor: '#f8fafc',
  flexShrink: 0, 
});

export const panelTitle = style({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: vars.color.textPrimary,
  margin: 0,
});

/* =========================================
   4. スクロール領域とリスト行
========================================= */
export const panelScrollArea = style({
  flex: 1, 
  overflowY: 'auto', 
  padding: '24px',
});

export const listRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
  borderBottom: `1px solid ${vars.color.border}`,
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: '#f1f5f9',
  },
});

/* =========================================
   5. UI部品の共通スタイル (後方互換性のため維持)
========================================= */
export const baseListHeader = style({
  fontSize: '1.2rem',
  fontWeight: 700,
  margin: 0,
  color: vars.color.textPrimary,
});

export const baseListRow = style({
  fontSize: '1.2rem',
  fontWeight: 700,
  margin: 0,
  color: vars.color.textPrimary,
});

export const baseSelect = style({
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.white,
  fontSize: '1rem',
  color: vars.color.textPrimary,
  outline: 'none',
  cursor: 'pointer',
  transition: 'border-color 0.2s',
  ':focus': { borderColor: vars.color.primary }
});

export const baseInput = style({
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.white,
  fontSize: '1rem',
  color: vars.color.textPrimary,
  boxSizing: 'border-box',
  outline: 'none',
  transition: 'border-color 0.2s',
  ':focus': { borderColor: vars.color.primary },
  '::placeholder': { color: vars.color.textMuted }
});