import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const container = style({
  padding: '1.5rem',
  height: '100%',
  overflowX: 'auto',
});

export const table = style({
  borderCollapse: 'collapse',
  width: '100%',
  minWidth: '900px',
  tableLayout: 'fixed', // 列幅を安定させる
});

export const headerCell = style({
  border: '1px solid #e2e8f0',
  backgroundColor: '#e2e8f0',
  padding: '0.75rem',
  fontWeight: '700',
  color: '#2d3748',
  textAlign: 'center',
});

export const timeCell = style({
  border: '1px solid #e2e8f0',
  backgroundColor: '#f7fafc',
  padding: '0.75rem',
  fontWeight: '700',
  color: '#2d3748',
  whiteSpace: 'nowrap',
  width: '100px',
});

const availableSlot = {
  backgroundColor: '#f0fff4', // 薄い青
  cursor: 'swap',
  outline: '0.5px solid #48bb78',
  outlineOffset:'-2px'
};

// スロットの状態管理
export const slotCell = recipe({
  base: {
    border: '1px solid #e2e8f0',
    verticalAlign: 'top',
    padding: '0.5rem',
    minHeight: '80px',
    transition: 'all 0.2s',
  },
  variants: {
    status: {
      normal: { backgroundColor: '#fff' },
      selected: { backgroundColor: '#ebf8ff', outline: '0.5px solid #4299e1', outlineOffset:'-2px' },
      admin_block: { backgroundColor: '#f1f1f1', cursor: 'not-allowed' },
      settable: availableSlot,
      switchable: availableSlot,
      movableToOther: availableSlot,
      movableFromOther: availableSlot,
      unAvailable: {
        backgroundColor: '#fff', // 薄い赤
        cursor: 'not-allowed'
      },
      hovered: { backgroundColor: '#2e88b8ff', boxShadow: 'none', opacity: 0.4,},
    }
  }
});

export const applicantBadge = recipe({
  base: {
    padding: '0.5rem',
    borderRadius: '0.375rem',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'move',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  variants: {
    type: {
      normal: { backgroundColor: '#4299e1' },
      error: { backgroundColor: '#ed8936' }, // 利用不可なのに割当がある場合
      dragging: { backgroundColor: '#72afe0ff', opacity: 1, boxShadow: 'none' }
    }
  }
});

export const siblingText = style({
  fontSize: '0.65rem',
  color: '#718096',
  marginTop: '0.5rem',
  textAlign: 'center',
  display: 'block',
});

export const errorBadge = style({
  fontSize: '0.75rem',
  color: '#fff',
  backgroundColor: '#c53030',
  padding: '2px 4px',
  borderRadius: '4px',
  marginTop: '4px',
  display: 'inline-block'
});