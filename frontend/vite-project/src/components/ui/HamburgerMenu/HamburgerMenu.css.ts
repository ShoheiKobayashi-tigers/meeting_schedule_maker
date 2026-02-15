import { style } from '@vanilla-extract/css';

export const container = style({
  position: 'relative',
  height: '100%', 
  display: 'flex',
  alignItems: 'center',
  marginLeft: '16px',
});

export const menuButton = style({
  background: 'white',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '20px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: '#f8fafc',
  },
});

export const dropdown = style({
  position: 'absolute',
  top: '48px',
  right: '0',
  width: '220px',
  backgroundColor: 'white',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  padding: '8px 0',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1001,
});

export const menuItem = style({
  padding: '12px 16px',
  fontSize: '14px',
  color: '#334155',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  textAlign: 'left',
  border: 'none',
  background: 'none',
  width: '100%',
  ':hover': {
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
  },
});

export const backdrop = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 999, // メニューボタンより下、他のコンテンツより上
  cursor: 'default',
});