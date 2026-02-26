import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css'; // ★ varsをインポート

export const tableWrapper = style({
  overflow: 'auto',
  flex: 1,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.borderRadius.medium,
  backgroundColor: vars.color.white,
  position: 'relative',
});

export const table = style({
  borderCollapse: 'separate',
  borderSpacing: 0,
  width: '100%',
  minWidth: '900px',
  tableLayout: 'fixed',
});

export const headerCell = style({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  borderBottom: `2px solid ${vars.color.border}`,
  borderRight: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.hoverGray, // ヘッダーは少しグレーに
  padding: vars.space.medium,
  fontWeight: '700',
  textAlign: 'center',
  color: vars.color.textPrimary,
});

export const timeCell = style({
  position: 'sticky',
  left: 0,
  zIndex: 20,
  borderBottom: `1px solid ${vars.color.border}`,
  borderRight: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.hoverGray,
  padding: vars.space.medium,
  fontWeight: '600',
  width: '150px',
  textAlign: 'center',
  color: vars.color.textPrimary,
});

export const cornerCell = style([
  timeCell,
  { left: 0, zIndex: 30 },
]);

export const cell = style({
  borderBottom: `1px solid ${vars.color.border}`,
  borderRight: `1px solid ${vars.color.border}`,
  verticalAlign: 'top',
  padding: vars.space.small,
  minHeight: '80px',
  position: 'relative',
  alignItems: 'center',    
  justifyContent: 'center',
});