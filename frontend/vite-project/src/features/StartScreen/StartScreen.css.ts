import { style } from '@vanilla-extract/css';

export const container = style({
  height: '100vh',
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f1f5f9', // 少し落ち着いた背景色に
});

export const card = style({
  width: '100%',
  // ★修正: PC向けに幅を広げる
  maxWidth: '800px', 
  padding: '60px', // 余白も少し広げてリッチに
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  textAlign: 'center',
  display: 'flex',       // レイアウト調整用にflex化
  flexDirection: 'column',
  alignItems: 'center',  // 中身を中央揃え
});

export const title = style({
  fontSize: '32px', // タイトルも少し大きく
  fontWeight: '800',
  color: '#1e293b',
  marginBottom: '12px',
  letterSpacing: '-0.02em',
});

export const subtitle = style({
  fontSize: '16px',
  color: '#64748b',
  marginBottom: '48px',
});

export const buttonGroup = style({
  display: 'flex',
  // ★修正: PCなので横並びにする
  flexDirection: 'row', 
  gap: '24px',
  width: '100%',
  justifyContent: 'center',
});

const baseButton = style({
  padding: '20px 40px', // クリックエリアを確保しつつPCらしいサイズ感に
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: 'none',
  // ★修正: 横並びにしたので、幅は固定かflexで調整
  flex: 1, 
  maxWidth: '300px', // ボタンが横に伸びすぎないように制限
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column', // データあり表示などのために縦並び許可
  gap: '4px',
});

export const continueButton = style([baseButton, {
  backgroundColor: '#0f172a', // PC管理画面っぽいダークカラー
  color: 'white',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  ':hover': { 
    backgroundColor: '#1e293b',
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  ':disabled': { 
    backgroundColor: '#cbd5e1', 
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none'
  },
}]);

export const newButton = style([baseButton, {
  backgroundColor: 'white',
  color: '#475569',
  border: '2px solid #e2e8f0',
  ':hover': { 
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    color: '#1e293b'
  },
}]);

export const dataInfo = style({
  fontSize: '12px',
  fontWeight: 'normal',
  opacity: 0.8,
});

export const note = style({
  marginTop: '32px',
  fontSize: '13px',
  color: '#94a3b8',
});