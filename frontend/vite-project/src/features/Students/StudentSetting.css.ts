import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css.ts';
import { 
  basePageContainer, baseLeftPanel, baseRightPanel, basePanelCard, 
  basePanelHeader, basePanelTitle, baseScrollArea, baseListHeader 
} from '../../styles/layout.css.ts';

export const container = style([basePageContainer]);
export const leftPanel = style([baseLeftPanel, basePanelCard]);
export const rightPanel = style([baseRightPanel, basePanelCard]);

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
export const siblingTitle = style([basePanelTitle, { padding: vars.space.large }]);
export const scrollArea = style([baseScrollArea, { padding: vars.space.large }]);