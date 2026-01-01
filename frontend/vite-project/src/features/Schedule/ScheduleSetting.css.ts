import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  gap: '1.5rem',
  padding: '1.5rem',
  height: 'calc(100vh - 64px)', // ヘッダーの高さを引いた残り（環境に合わせて調整）
  backgroundColor: '#f7fafc',
  boxSizing: 'border-box',
});

export const leftPanel = style({
  flex: 1,           // 左側を可能な限り広げる
  minWidth: 0,       // Flex子要素が中身の幅に引きずられて突き抜けるのを防ぐ
  display: 'flex',
  flexDirection: 'column',
});

export const rightPanel = style({
  width: '350px',    // 右パネルは入力項目なので幅を固定
  flexShrink: 0,     // 画面が狭くなっても右パネルは潰さない
  display: 'flex',
  flexDirection: 'column',
});