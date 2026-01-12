import { style } from '@vanilla-extract/css';
import { 
  basePageContainer, 
  baseLeftPanel, 
  baseRightPanel 
} from '../../styles/layout.css.ts';

// gapやpaddingはすべて basePageContainer が管理
export const container = style([basePageContainer]);

export const leftPanel = style([baseLeftPanel]);

// 右パネルの幅も baseRightPanel(400px) で他ページと統一
export const rightPanel = style([baseRightPanel]);