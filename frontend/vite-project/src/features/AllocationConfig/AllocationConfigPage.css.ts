import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';
import * as s from '../../styles/layout.css'

export const container = style([s.basePanelCard]);
export const header = style([s.panelHeader]);
export const title = style([s.panelTitle]);
// 余白ありのスクロールエリアを適用
export const mainContent = style([s.panelScrollArea]);

export const overlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: '#fff',
  zIndex: 2000,
  display: 'flex',
  flexDirection: 'column',
});

export const description = style({
  fontSize: '14px',
  color: vars.color.textSecondary,
  margin: 0,
});

// 全体設定エリア
export const globalSettings = style({
  padding: '20px',
  backgroundColor: '#f8fafc',
  borderBottom: `1px solid ${vars.color.border}`,
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  position: 'sticky',
  top: 0,
  zIndex: 20,
});

export const settingLabel = style({
  fontWeight: 'bold',
  fontSize: '14px',
  color: '#334155',
});

export const select = style({
  padding: '8px 12px',
  borderRadius: '6px',
  border: `1px solid ${vars.color.border}`,
  fontSize: '14px',
  cursor: 'pointer',
});

// テーブルエリア
export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
});

export const th = style({
  position: 'sticky',
  top: '74px', // globalSettings の高さ分下げる
  backgroundColor: '#f1f5f9',
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#475569',
  borderBottom: `2px solid ${vars.color.border}`,
  zIndex: 10,
});

export const tr = style({
  borderBottom: '1px solid #e2e8f0',
  ':hover': {
    backgroundColor: '#f8fafc',
  },
});

export const td = style({
  padding: '12px 16px',
  fontSize: '14px',
  color: '#334155',
  verticalAlign: 'middle',
});

export const checkCell = style({
  textAlign: 'center',
  width: '100px',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: '#e2e8f0', // デフォルトホバー
  },
});

export const checkbox = style({
  width: '18px',
  height: '18px',
  cursor: 'pointer',
});

export const nameCell = style({
  display: 'flex',
  flexDirection: 'column',
});

export const studentId = style({
  fontSize: '11px',
  color: '#94a3b8',
});