import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css.ts';

export const container = style({
  paddingTop: '5rem', // navBar(4rem) + 余白
  width: '100%',
  height: '100vh',
  backgroundColor: vars.color.background,
  position: 'relative',
  boxSizing: 'border-box',
  paddingLeft: vars.space.large,
  paddingRight: vars.space.large,
  paddingBottom: vars.space.large,
  display: 'flex', // fullScreenLayout の役割を統合
  flexDirection: 'row',
});

export const leftPanel = style({
  flex: '1', // 残りの幅を埋める
  marginRight: vars.space.large,
  minWidth: '700px',
  // 元のコードの 1400px 指定を再現したい場合は width: '1400px' を追加
  display: 'flex',
  flexDirection: 'column',
});

export const rightPanel = style({
  width: '300px', // 固定幅
  minWidth: '300px',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
});

// 各パネルの中にある白いカード（ScheduleTablePanel などで使用）
export const panelCard = style({
  padding: vars.space.large,
  borderRadius: '0.75rem',
  boxShadow: vars.shadow.panel,
  backgroundColor: vars.color.white,
  height: '100%',
  overflowY: 'auto',
  boxSizing: 'border-box',
  marginTop: vars.space.large,
});