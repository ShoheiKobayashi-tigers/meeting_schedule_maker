import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css.ts';
import { panelTitle, panelScrollArea, baseListHeader, baseListRow } from '../../../styles/layout.css.ts';

export const title = style([panelTitle, { marginBottom: vars.space.medium }]);

export const section = style({
  marginBottom: vars.space.large,
});

export const sectionTitle = style({
  fontSize: '1rem',
  fontWeight: 700,
  marginBottom: vars.space.medium,
  color: vars.color.textMain,
});

export const content = style([panelScrollArea]);

export const listHeader = style([baseListHeader]);

export const listRow = style([baseListRow]);

