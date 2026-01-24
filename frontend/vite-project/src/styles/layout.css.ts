import { style } from '@vanilla-extract/css';
import { vars } from './vars.css.ts';

// 1. ページ全体のコンテナ
export const basePageContainer = style({
  display: 'flex',
  width: '100vw',
  maxWidth: '100%',
  height: '100vh',
  paddingTop: '2rem', 
  paddingLeft: vars.space.large,
  paddingRight: vars.space.large,
  paddingBottom: vars.space.large,
  backgroundColor: vars.color.background,
  boxSizing: 'border-box',
  gap: vars.space.large,
  overflow: 'hidden',
});

// 2. パネル（白背景のカード）
export const basePanelCard = style({
  backgroundColor: vars.color.white,
  borderRadius: '0.75rem',
  boxShadow: vars.shadow.panel,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden', // 内部でスクロールさせるため
  boxSizing: 'border-box',
  overflowY: 'auto',
});

export const baseLeftPanel = style([basePanelCard,{
  flex: 1,
  minWidth: 0,
}]);

export const baseRightPanel = style([basePanelCard,{
  width: '25%', // ご要望通り 1/4 に設定
  minWidth: '350px',
  flexShrink: 0,
}]);

// 3. パネル内の共通パーツ
export const panelHeader = style({
  padding: vars.space.large,
  borderBottom: `1px solid ${vars.color.border}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const panelTitle = style({
  fontSize: '1.5rem',
  fontWeight: '800',
  marginBottom: '1.5rem',
  color: '#1a202c',
  borderLeft: '4px solid #4299e1',
  paddingLeft: '12px',
});

export const panelScrollArea = style({
  flex: 1,
  overflowY: 'auto',
  padding: vars.space.large,
});


// 【これが共通の listHeader】
export const basePanelHeader = style({
  padding: vars.space.medium,
  borderBottom: `1px solid ${vars.color.border}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  minHeight: '4rem', // 高さを揃える
  boxSizing: 'border-box',
});

// ヘッダー内のタイトル
export const basePanelTitle = style({
  fontSize: '20px',
  fontWeight: 700,
  margin: '10px',
  color: vars.color.textMain,
});

// パネル内のスクロールエリア
export const baseScrollArea = style({
  flex: 1,
  overflowY: 'auto',
});

export const baseListHeader = style({
  fontSize: '1.2rem',
  fontWeight: 700,
  margin: 0,
  color: vars.color.textMain,
})

export const baseListRow = style({
    fontSize: '1.2rem',
  fontWeight: 700,
  margin: 0,
  color: vars.color.textMain,
})

export const baseSelect = style({
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.white,
  fontSize: '1rem',
  color: vars.color.textMain,
  outline: 'none',
  cursor: 'pointer',
  transition: 'border-color 0.2s',
  ':focus': {
    borderColor: vars.color.primary,
  }
});

export const baseButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  border: 'none',
  outline: 'none',
  borderRadius: '4px',
  transition: 'all 0.2s ease',
  fontSize: '0.875rem',
  fontWeight: 600,
  padding: '0.5rem 1rem',
  ':disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
});