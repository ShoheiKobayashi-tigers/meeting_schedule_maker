// src/components/ui/SettingMenu/SettingMenu.css.ts
import { style } from '@vanilla-extract/css';

export const container = style({
  position: 'relative',
  height: '100%', 
  display: 'flex',
  alignItems: 'center',
  marginLeft: '16px',
});

export const menuButton = style({
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#cbd5e0',
  flexShrink: 0,
  transition: 'all 0.2s',
  ':hover': {
    backgroundColor: '#4a5568',
    color: '#fff',
  },
});

export const icon = style({
  width: '28px',
  height: '28px',
  flexShrink: 0,
});

export const dropdown = style({
  position: 'absolute',
  top: '52px',
  right: '0',
  width: '260px',
  backgroundColor: 'white',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  padding: '8px 0',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 1001,
  overflow: 'hidden',
});

// <a>タグでも<button>タグでも使えるように調整
export const menuItem = style({
  padding: '12px 16px',
  fontSize: '14px',
  color: '#334155',
  cursor: 'pointer',
  transition: 'background-color 0.1s',
  textAlign: 'left',
  border: 'none',
  background: 'none',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  textDecoration: 'none', // ★<a>タグの下線を消す
  boxSizing: 'border-box',
  ':hover': {
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
  },
});

export const menuDivider = style({
  height: '1px',
  backgroundColor: '#e2e8f0',
  margin: '4px 0',
});

export const backdrop = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 999,
  cursor: 'default',
});

export const textWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px', // タイトルと説明文の隙間
});

export const itemTitle = style({
  fontWeight: 'bold',
  fontSize: '14px',
  color: '#1e293b', // 真っ黒ではなく、高級感のある濃いネイビーグレー
  lineHeight: '1.4',
});

export const itemDescription = style({
  fontSize: '11px',
  color: '#64748b',
  lineHeight: '1.4',
});