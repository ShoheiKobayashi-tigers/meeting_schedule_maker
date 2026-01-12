import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css.ts';
import { basePanelTitle, baseScrollArea, baseListHeader, baseListRow } from '../../../styles/layout.css.ts';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: vars.space.large, // このパネルはヘッダー分離型でないので独自padding
});

export const title = style([basePanelTitle]);

export const guideMessage = style({
  color: vars.color.textMuted,
  fontSize: '0.875rem',
  marginBottom: vars.space.medium,
});

export const scrollArea = style([baseScrollArea]);

export const actionArea = style({
  marginBottom: vars.space.medium,
  paddingBottom: vars.space.medium,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const listHeader = style([baseListHeader]);

export const listRow = style([baseListRow]);