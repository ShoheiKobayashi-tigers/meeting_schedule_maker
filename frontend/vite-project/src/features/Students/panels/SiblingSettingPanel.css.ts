import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css.ts';
import * as s from '../../../styles/layout.css.ts';

export const title = s.basePanelTitle;

export const section = style([s.baseScrollArea,{
  margin: vars.space.large,
}]);

export const sectionTitle = style({
  fontSize: '1rem',
  fontWeight: 700,
  marginBottom: vars.space.medium,
  color: vars.color.textMain,
});

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: vars.space.large,
});

export const scrollArea = style([s.baseScrollArea]);

export const listHeader = style([s.baseListHeader, {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: vars.space.medium,
}]);

export const listRow = style([s.baseListRow, {
  display: 'flex',
  border: '1px solid #edf2f7',
  borderRadius: '8px',
  backgroundColor: '#f8fafc',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12.5px',
  cursor: 'default', // クリック廃止
  ':hover': {
    backgroundColor: 'transparent', // ホバー時の背景色変更も無効化（必要に応じて）
  }
}]);

export const actionButtonGroup = style({
  display: 'flex',
  gap: vars.space.small,
});

export const emptyMessage = style({
  textAlign: 'center',
  color: vars.color.textMuted, // varsの定義を使用
  padding: '2rem',
  fontSize: '0.875rem',
  backgroundColor: vars.color.white,
  borderRadius: '8px',
  border: `1px dashed ${vars.color.border}`,
  marginTop: vars.space.medium,
});