import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
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

export const cellRecipe = recipe({
  base: {
    width: '100%',
    height: '100%',
    minHeight: '60px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    userSelect: 'none',
  },
  variants: {
    state: {
      default: {
        cursor: 'pointer',
        ':hover': { backgroundColor: '#f8fafc' }, // 少し明るく
      },
      selected: {
        cursor: 'pointer',
      },
      blocked: {
        // 親のtd側で背景はグレーになるので、ここではカーソルのみ変更
        cursor: 'not-allowed', 
      }
    }
  },
  defaultVariants: {
    state: 'default',
  }
});

export const cellConfirmDisabled = style([cellBase, {
  backgroundColor: vars.color.muted,
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

export const checkCircleRecipe = recipe({
  base: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  variants: {
    isSelected: {
      true: {
        border: 'none',
        backgroundColor: '#059669', // プライマリグリーン
      },
      false: {
        border: '2px solid #cbd5e1',
        backgroundColor: '#fff',
      }
    }
  }
});

// ==========================================
// ★ 追加: セル内のテキスト用レシピ
// ==========================================
export const cellTextRecipe = recipe({
  base: {
    fontSize: '11px',
    marginTop: '6px',
  },
  variants: {
    isSelected: {
      true: {
        color: '#065f46',
        fontWeight: 'bold',
      },
      false: {
        color: '#94a3b8',
        fontWeight: 'normal',
      }
    }
  }
});

// ==========================================
// ★ 追加: その他のベタ書きスタイルをクラス化
// ==========================================

// ブロックされたセルの「×」
export const blockedCrossLabel = style({
  color: '#94a3b8',
  fontSize: '14px',
});

// 確認画面の「希望」ラベル
export const confirmLabelMain = style({
  color: '#047857',
  fontWeight: 'bold',
  fontSize: '14px',
});

// 確認画面の「選択済み」サブラベル
export const confirmLabelSub = style({
  fontSize: '10px',
  color: '#047857',
});

// 完了画面のチェックマークラッパー
export const completeIconWrapper = style({
  width: '80px',
  height: '80px',
  backgroundColor: '#d1fae5',
  borderRadius: '50%',
  color: '#059669',
  fontSize: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px',
});

// 完了画面のテキスト群
export const completeTitle = style({
  fontSize: '1.5rem',
  color: '#1e293b',
  marginBottom: '16px',
});
export const completeDescription = style({
  color: '#475569',
  lineHeight: '1.6',
  marginBottom: '40px',
});

// ボタン類のレイアウト調整用
export const buttonFlex1 = style({ flex: 1 });
export const buttonFlex2 = style({ flex: 2 });
export const completeButton = style({ width: '100%', padding: '16px' });