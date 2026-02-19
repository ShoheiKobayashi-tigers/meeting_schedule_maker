import { style } from '@vanilla-extract/css';

export const overlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: '#fff', // 全画面
  zIndex: 2000,
  padding: '40px',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
});

export const header = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
  borderBottom: '1px solid #e2e8f0',
  paddingBottom: '16px',
});

export const content = style({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
  border: '2px dashed #cbd5e1',
});