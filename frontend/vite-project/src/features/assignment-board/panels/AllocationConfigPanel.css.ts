import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

// ※ container, header, title, mainContent, overlay等の骨格定義は削除しました

export const description = style({
  fontSize: '0.875rem',
  color: vars.color.textSecondary,
  margin: `${vars.space.small} 0 0 0`,
  lineHeight: '1.5',
});

// 全体設定エリア（スクロール外の固定領域にするため sticky を外しました）
export const globalSettings = style({
  padding: `${vars.space.small} ${vars.space.large}`,
  backgroundColor: '#f8fafc',
  borderBottom: `1px solid ${vars.color.border}`,
  display: 'flex',
  alignItems: 'center',
  gap: vars.space.medium,
  flexShrink: 0, // 画面が小さくても潰れないようにする
});

export const settingLabel = style({
  fontWeight: 'bold',
  fontSize: '0.9rem',
  color: vars.color.textPrimary,
});

export const select = style({
  padding: '6px 12px',
  borderRadius: vars.borderRadius.small,
  border: `1px solid ${vars.color.border}`,
  fontSize: '0.9rem',
  cursor: 'pointer',
  backgroundColor: vars.color.white,
});

export const helpText = style({
  fontSize: '0.75rem',
  color: vars.color.textSecondary,
});

// テーブルエリア
export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
});

export const th = style({
  position: 'sticky',
  top: 0, // ★ 全体設定を外に出したので、0px でピタッと止まるようになりました！
  backgroundColor: '#f1f5f9',
  padding: vars.space.small,
  textAlign: 'center',
  fontSize: '0.85rem',
  fontWeight: 'bold',
  color: vars.color.textSecondary,
  borderBottom: `2px solid ${vars.color.border}`,
  zIndex: 10,
});

export const tr = style({
  borderBottom: `1px solid ${vars.color.border}`,
  ':hover': {
    backgroundColor: '#f8fafc',
  },
});

export const td = style({
  padding: vars.space.medium,
  fontSize: '0.9rem',
  color: vars.color.textPrimary,
  verticalAlign: 'middle',
});

export const checkCell = style({
  textAlign: 'center',
  width: '100px',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: '#e2e8f0', 
  },
});

export const checkbox = style({
  width: '18px',
  height: '18px',
  cursor: 'pointer',
});

export const nameCell = style({
  display: 'flex',
  gap: '2px',
});

export const studentId = style({
  fontSize: '0.75rem',
  color: vars.color.textMuted,
});

// 画面下部のボタンエリア用
export const footer = style({
  padding: `${vars.space.small} ${vars.space.large} ${vars.space.medium}`,
  borderTop: `1px solid ${vars.color.border}`,
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: vars.color.white,
  flexShrink: 0,
});