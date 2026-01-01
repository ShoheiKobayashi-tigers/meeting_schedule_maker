import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const panelContainer = style({
  display: 'flex',
  flexDirection: 'column',
  // manager.stylesから渡ってくる値を想定していますが、固定値ならここで定義
  height: '100%', 
});

export const title = style({
  fontSize: '1.5rem',
  fontWeight: '800',
  marginBottom: '1rem',
  color: '#2d3748',
});

export const description = style({
  color: '#718096',
  marginBottom: '1rem',
  fontSize: '0.875rem',
});

export const scrollArea = style({
  overflowY: 'auto',
  flex: 1,
});

// スロット行のスタイル（状態によって背景色を変える）
export const slotRow = recipe({
  base: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 0.5rem',
    borderBottom: '1px dashed #edf2f7',
  },
  variants: {
    available: {
      true: { backgroundColor: '#f7fff8' },
      false: { backgroundColor: '#fff7f7' },
    },
  },
});

export const textContent = style({
  flex: 1,
  minWidth: 0,
});

export const headerText = style({
  fontWeight: '600',
  fontSize: '0.9rem',
  color: '#2d3748',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

export const subText = style({
  fontSize: '0.8rem',
  color: '#718096',
});

export const assignmentText = style({
  fontSize: '0.75rem',
  color: '#4299e1',
  marginTop: '2px',
});

export const statusLabel = recipe({
  base: {
    marginRight: '0.75rem',
    fontWeight: '700',
  },
  variants: {
    available: {
      true: { color: '#48bb78' },
      false: { color: '#f56565' },
    },
  },
});