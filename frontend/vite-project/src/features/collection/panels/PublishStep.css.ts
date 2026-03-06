import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

// layout.css.ts に任せる container, header, title 等は削除しました

export const layoutContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
});

// 上段：編集とプレビュー
export const topSection = style({
  display: 'grid',
  gridTemplateColumns: '1fr 380px', // 左リキッド、右固定
  gap: '40px',
  alignItems: 'start',
  '@media': {
    'screen and (max-width: 900px)': {
      gridTemplateColumns: '1fr', // 狭い画面では縦積み
    },
  },
});

// --- 左カラム：編集エリア ---
export const editColumn = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const sectionLabel = style({
  fontWeight: 'bold',
  fontSize: '16px',
  color: vars.color.textPrimary,
  marginBottom: '8px',
});

export const messageTextarea = style({
  width: '100%',
  padding: '15px',
  borderRadius: vars.borderRadius.medium,
  border: `1px solid ${vars.color.border}`,
  fontSize: '15px',
  lineHeight: '1.7',
  resize: 'vertical',
  minHeight: '150px',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  backgroundColor: vars.color.white,
  ':focus': {
    borderColor: vars.color.primary,
    outline: 'none',
    boxShadow: `0 0 0 3px ${vars.color.primary}1a`,
  },
});

// 右カラム：プレビューエリア
export const previewColumn = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const phoneFrame = style({
  width: '100%',
  maxWidth: '340px',
  height: '640px',
  // iPhone風の枠デザイン
  border: '14px solid #2d3748',
  borderRadius: '40px',
  overflow: 'hidden',
  backgroundColor: vars.color.white,
  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
  position: 'relative',
});

export const phoneScreen = style({
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  backgroundColor: vars.color.white,
  paddingTop: '20px',
});

// 下段：公開コントロール
export const bottomSection = style({
  backgroundColor: '#f8fafc',
  padding: '32px',
  borderRadius: vars.borderRadius.medium,
  border: `1px solid ${vars.color.border}`,
});

export const controlGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '32px',
  alignItems: 'start',
  '@media': {
    'screen and (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const controlGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const urlBox = style({
  padding: '12px 16px',
  backgroundColor: vars.color.white,
  borderRadius: vars.borderRadius.small,
  border: `1px solid ${vars.color.border}`,
  fontSize: '14px',
  color: vars.color.textPrimary,
  fontFamily: 'monospace',
  wordBreak: 'break-all',
});

export const switchContainer = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px',
  backgroundColor: vars.color.white,
  borderRadius: vars.borderRadius.small,
  border: `1px solid ${vars.color.border}`,
});

export const checkbox = style({
  width: '24px',
  height: '24px',
  cursor: 'pointer',
  accentColor: vars.color.primary, // ブラウザ標準のアクセントカラーを使用
});

export const checkboxLabel = style({
  fontSize: '14px',
  fontWeight: 'bold',
  cursor: 'pointer',
});

export const errorText = style({
  color: vars.color.danger,
  fontSize: '13px',
  marginTop: '12px',
  padding: '8px',
  backgroundColor: '#fef2f2',
  borderRadius: vars.borderRadius.small,
  lineHeight: '1.5',
  border: '1px solid #fecaca',
});

// ▼ ヘッダーのタイトル下にある説明文
export const headerDescription = style({
  color: '#64748b',
  fontSize: '0.9rem',
  marginTop: '8px',
  lineHeight: '1', // 0 だと文字が潰れるので 1.5 に修正しました
});

// ▼ ヘッダー右側のステータスバッジ群の親要素
export const headerBadgeWrapper = style({
  marginTop: 0,
});

// ▼ ステータスバッジ本体（公開中 / 準備中のバリエーション）
export const statusBadge = style({
  fontWeight: 'bold',
  padding: '8px 16px',
  borderRadius: '20px',
  fontSize: '0.85rem',
  display: 'inline-block',
});

// 公開中（緑）
export const badgePublished = style([statusBadge, {
  color: '#059669',
  backgroundColor: '#d1fae5',
}]);

// 準備中（グレー）
export const badgePending = style([statusBadge, {
  color: '#64748b',
  backgroundColor: '#f1f5f9',
}]);