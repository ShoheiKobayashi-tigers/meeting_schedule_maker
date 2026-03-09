// src/features/assignment-board/parts/SlotLegendTooltip/SlotLegendTooltip.css.ts
import { style } from '@vanilla-extract/css';

export const tooltipContainer = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  cursor: 'help',
});

// 白背景で美しく浮き上がる吹き出しデザイン
export const tooltipContent = style({
  visibility: 'hidden',
  opacity: 0,
  transition: 'all 0.2s ease-in-out',
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%) translateY(8px)',
  backgroundColor: '#ffffff', // ★ 白背景に変更
  color: '#2d3748',           // ★ 文字色を濃いグレーに
  padding: '16px',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontWeight: 'normal',
  whiteSpace: 'nowrap',
  zIndex: 50,
  // ★ 境界を見やすくするためのリッチなシャドウと極薄いボーダー
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e2e8f0', 
  pointerEvents: 'none',
  
  // 吹き出しのしっぽ（三角形）
  '::before': {
    content: '""',
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    borderWidth: '8px',
    borderStyle: 'solid',
    // ★ しっぽの色も白（ボーダーなしの影頼み）に合わせる
    borderColor: 'transparent transparent #ffffff transparent',
  },

  selectors: {
    [`${tooltipContainer}:hover &`]: {
      visibility: 'visible',
      opacity: 1,
      transform: 'translateX(-50%) translateY(12px)',
    }
  }
});

export const tooltipHeader = style({
  marginBottom: '12px',
  fontWeight: 'bold',
  borderBottom: '1px solid #e2e8f0', // ★ 下線も白背景に合わせて薄いグレーに
  paddingBottom: '6px',
});

export const tooltipRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '10px',
  ':last-child': {
    marginBottom: 0,
  }
});

// ★ 四角形を「横長の長方形」に大幅サイズアップ（幅40px, 高さ20px）
export const colorBox = style({
  width: '40px',
  height: '20px',
  borderRadius: '4px', 
});

export const colorBoxMovable = style([colorBox, {
  backgroundColor: '#f0fff4',
  border: '1px solid #48bb78',
}]);

export const colorBoxPreferred = style([colorBox, {
  backgroundColor: '#ffedd5',
  border: '1px solid #fb923c', // ツールチップ側はoutlineではなくborder
}]);

export const colorBoxBlock = style([colorBox, {
  backgroundColor: '#f1f1f1',
  border: '1px solid #e2e8f0',
}]);

// ★ 追加：選択中の色見本（水色背景＋青枠）
export const colorBoxSelected = style([colorBox, {
  backgroundColor: '#ebf8ff',
  border: '1px solid #3182ce',
}]);