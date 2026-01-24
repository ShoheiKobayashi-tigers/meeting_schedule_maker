import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css.ts';
import * as s from '../../styles/layout.css.ts';

export const container = s.basePageContainer;
export const leftPanel = s.baseLeftPanel;
export const rightPanel = s.baseRightPanel;

// ApplicantSettingPanel.tsx で使うヘッダー

export const studentRow = style({
  padding: vars.space.medium,
  cursor: 'pointer',
  borderBottom: `1px solid ${vars.color.border}`,
  selectors: {
    '&:hover': { backgroundColor: vars.color.hoverGray },
  },
});

export const selectedRow = style({
  backgroundColor: vars.color.hoverGray,
  borderLeft: `4px solid ${vars.color.primary}`,
});

// SiblingSettingPanel.tsx 側で使うタイトル
export const siblingTitle = style([s.basePanelTitle, { padding: vars.space.large }]);
export const scrollArea = style([s.baseScrollArea, { padding: vars.space.large }]);