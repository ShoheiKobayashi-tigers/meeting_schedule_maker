// src/components/Navigation.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '../styles/vars.css';

export const navContainer = style({
  backgroundColor: '#ffffff',
  borderBottom: `1px solid ${vars.color.border}`,
  display: 'flex',
  flexDirection: 'column',
});

// --- 親タブ (Tier 1) ---
export const parentTabList = style({
  display: 'flex',
  listStyle: 'none',
  margin: 0,
  padding: '0 24px',
  gap: '8px',
  overflowX: 'auto',
});

export const parentTab = style({
  padding: '16px 12px',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: 'bold',
  color: vars.color.textSecondary,
  borderBottom: '3px solid transparent',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s',
  ':hover': {
    color: vars.color.textPrimary,
  }
});

export const parentTabActive = style([parentTab, {
  color: vars.color.primary,
  borderBottom: `3px solid ${vars.color.primary}`,
}]);

// --- 子タブ (Tier 2) ---
export const childTabContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#f8fafc',
  padding: '8px 24px',
  borderTop: `1px solid ${vars.color.border}`,
  minHeight: '52px',
});

export const childTabList = style({
  display: 'flex',
  listStyle: 'none',
  margin: 0,
  padding: 0,
  gap: '8px',
  overflowX: 'auto',
});

export const childTab = style({
  padding: '6px 16px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  color: vars.color.textSecondary,
  borderRadius: '20px', 
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: '#e2e8f0',
    color: vars.color.textPrimary,
  }
});

export const childTabActive = style([childTab, {
  backgroundColor: vars.color.primary,
  color: '#ffffff',
  ':hover': {
    backgroundColor: vars.color.primary,
    color: '#ffffff',
  }
}]);

// --- 右端のモード切替ボタン ---
export const modeSwitchBtn = style({
  fontSize: '0.75rem',
  color: vars.color.textSecondary,
  background: 'none',
  border: `1px solid ${vars.color.border}`,
  padding: '6px 12px',
  borderRadius: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontWeight: 'bold',
  transition: 'all 0.2s',
  backgroundColor: '#ffffff',
  ':hover': {
    color: vars.color.primary,
    borderColor: vars.color.primary,
  }
});