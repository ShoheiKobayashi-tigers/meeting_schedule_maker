import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../../../styles/vars.css'; // ★追加: varsをインポート

// ※ 完全に不要だった container, table, headerCell, timeCell は削除しました！

// ドラッグ＆ドロップ時の「配置可能」な枠の共通スタイル
const availableSlot = {
  backgroundColor: '#f0fff4', // 薄い青
  cursor: 'swap',
  outline: '0.5px solid #48bb78',
  outlineOffset:'-2px'
};

// スロットの状態管理
export const slotCell = recipe({
  base: {
    // border: `1px solid ${vars.color.border}`, // ★ varsに置き換え
    verticalAlign: 'top',
    padding: '0.25rem',
    height: '80%',
    minHeight: '40px',
    transition: 'all 0.2s',
  },
  variants: {
    status: {
      normal: { backgroundColor: vars.color.white }, // ★ varsに置き換え
      selected: { backgroundColor: '#ebf8ff', outline: `0.5px solid ${vars.color.primary}`, outlineOffset:'-2px' },
      admin_block: { backgroundColor: '#f1f1f1', cursor: 'not-allowed' },
      settable: availableSlot,
      switchable: availableSlot,
      movableToOther: availableSlot,
      movableFromOther: availableSlot,
      preferred_only: {
        backgroundColor: '#ffedd5', // ふんわりとした淡いオレンジ
        outline: `0.5px solid #fb923c`, // 境界をくっきりさせる少し濃いオレンジ
        outlineOffset: '-2px',
        cursor: 'not-allowed',
      },      unAvailable: {
        backgroundColor: vars.color.white,
        cursor: 'not-allowed'
      },
      hovered: { backgroundColor: '#2e88b8ff', boxShadow: 'none', opacity: 0.4,},
    }
  }
});

export const applicantBadge = recipe({
  base: {
    padding: '0.5rem',
    borderRadius: vars.borderRadius.small, // ★ varsに置き換え
    color: vars.color.white,
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'move',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  variants: {
    type: {
      normal: { backgroundColor: vars.color.primary }, // ★ varsに置き換え
      error: { backgroundColor: '#ed8936' }, // 利用不可なのに割当がある場合（オレンジ）
      dragging: { backgroundColor: '#72afe0ff', opacity: 1, boxShadow: 'none' }
    }
  }
});

export const siblingText = style({
  fontSize: '0.65rem',
  color: vars.color.textSecondary, // ★ varsに置き換え
  marginTop: '0.1rem',
  textAlign: 'center',
  display: 'block',
});

export const errorBadge = style({
  fontSize: '0.75rem',
  color: vars.color.white,
  backgroundColor: vars.color.danger, // ★ varsに置き換え
  padding: '2px 4px',
  borderRadius: vars.borderRadius.small,
  marginTop: '4px',
  display: 'inline-block'
});