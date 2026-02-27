import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

// 画面全体（縦・横どちらでも画面いっぱいに広がる）
export const pageContainer = style({
  minHeight: '100dvh', // ★100vhではなく100dvhにすることでスマホブラウザのバーを考慮
  backgroundColor: '#f1f5f9',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'stretch', // 横向き時に上下いっぱいまで広げる
  fontFamily: 'sans-serif',
});

// メインのスマホサイズコンテナ
// メインのコンテナ
export const mainContent = style({
  width: '100%',
  // デフォルト（スマホの縦画面）はフルスクリーン
  backgroundColor: vars.color.white,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 0 20px rgba(0,0,0,0.05)',
  
  '@media': {
    // 【タブレット等の縦長画面】画面が広くても縦長の場合は「カード型」に留める
    'screen and (min-width: 768px) and (orientation: portrait)': {
      maxWidth: '600px',
      margin: '2vh auto',
      borderRadius: vars.borderRadius.large,
      overflow: 'hidden',
      height: '96dvh', // 上下のマージン分(2vh * 2)を引く
    },
    // 【PC・スマホ横画面】横向き判定時は制限を解除し「横いっぱいフルスクリーン」にする！
    'screen and (orientation: landscape)': {
      maxWidth: '100%', // 幅の制限を解除
      margin: 0,
      borderRadius: 0, // フルスクリーンなので角丸もなし
      height: '100dvh',
    }
  }
});

// ヘッダー（タイトルなど）
export const header = style({
  padding: '16px 20px',
  backgroundColor: vars.color.white,
  borderBottom: `1px solid ${vars.color.border}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
  zIndex: 10,
});

export const headerTitle = style({
  margin: 0,
  fontSize: '1.1rem',
  color: vars.color.textPrimary,
});

// 選択中の件数バッジ
export const selectionBadge = style({
  fontSize: '0.85rem',
  color: vars.color.textSecondary,
  backgroundColor: '#f1f5f9',
  padding: '6px 12px',
  borderRadius: '20px',
});

// サブヘッダー（説明文）
export const subHeader = style({
  padding: '12px 20px',
  backgroundColor: '#f8fafc',
  borderBottom: `1px solid ${vars.color.border}`,
  fontSize: '0.85rem',
  color: vars.color.textSecondary,
  lineHeight: '1.5',
});

// テーブルやコンテンツが入るスクロール領域（flex: 1 で残りの高さをすべて埋める）
export const scrollArea = style({
  flex: 1,
  overflow: 'auto', // ★ここがミソ。縦横どちらでも中身がはみ出たらスクロールする
  padding: '16px',
});

// フッター（ボタンエリア）
export const footer = style({
  padding: '16px 20px',
  backgroundColor: vars.color.white,
  borderTop: `1px solid ${vars.color.border}`,
  display: 'flex',
  gap: '12px',
  boxShadow: '0 -4px 6px rgba(0,0,0,0.02)',
  zIndex: 10,
});

// --- テーブルのセルスタイル ---
export const cellBase = style({
  height: '100%',
  width: '100%',
  minHeight: '60px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  transition: 'all 0.2s ease',
  userSelect: 'none',
});

export const cellSelectable = style([cellBase, {
  cursor: 'pointer',
  backgroundColor: 'transparent',
}]);

export const cellSelected = style([cellBase, {
  cursor: 'pointer',
  backgroundColor: '#d1fae5',
}]);

export const cellConfirmDisabled = style([cellBase, {
  backgroundColor: '#f8fafc',
  color: '#cbd5e1',
  fontSize: '20px',
}]);

export const cellConfirmSelected = style([cellBase, {
  backgroundColor: '#d1fae5',
  border: '1px solid #10b981',
}]);

// --- セル内の要素 ---
export const checkCircle = style({
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.color.white,
  fontSize: '16px',
  fontWeight: 'bold',
});

// 完了画面のレイアウト
export const completeContainer = style({
  padding: '60px 20px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
});