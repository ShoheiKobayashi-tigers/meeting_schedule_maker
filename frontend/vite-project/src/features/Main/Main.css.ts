import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css.ts';
import { 
  basePageContainer, 
  baseLeftPanel, 
  baseRightPanel, 
  basePanelCard 
} from '../../styles/layout.css.ts';

export const container = style([basePageContainer]);

export const leftPanel = style([baseLeftPanel]);

export const rightPanel = style([baseRightPanel]);

export const panelCard = style([basePanelCard, {
  marginTop: vars.space.large, // 必要に応じて個別の調整のみ記述
}]);