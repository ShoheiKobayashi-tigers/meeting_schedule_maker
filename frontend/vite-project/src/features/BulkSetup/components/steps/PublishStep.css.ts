// features/BulkSetup/components/steps/PublishStep.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '../../../../styles/vars.css';
import * as s from '../../../../styles/layout.css'

export const container = style({
  paddingBottom: '1300px',
  margin: '0 auto',
  height: '100%',
  boxSizing: 'border-box',
  fontFamily: 'sans-serif',
});

export const header = style({
  marginBottom: '40px',
  textAlign: 'left',
  borderBottom: `1px solid ${vars.color.border}`,
  paddingBottom: '24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'end',
});

export const title = style({
  fontSize: '28px',
  fontWeight: '800',
  color: '#1e293b',
  marginBottom: '12px',
});

export const statusSection = style({
  marginBottom: '8px',
});

// レイアウトコンテナ
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
  color: '#334155',
  marginBottom: '8px',
});

export const messageTextarea = style({
  width: '100%',
  padding: '16px',
  borderRadius: '12px',
  border: `1px solid ${vars.color.border}`,
  fontSize: '15px',
  lineHeight: '1.7',
  resize: 'vertical',
  minHeight: '400px',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  backgroundColor: '#fff',
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
  backgroundColor: '#fff',
  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)',
  position: 'relative',
});

export const phoneScreen = style({
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  backgroundColor: '#fff',
  paddingTop: '20px',
});

// 下段：公開コントロール
export const bottomSection = style({
  backgroundColor: '#f8fafc',
  padding: '32px',
  borderRadius: '16px',
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

export const controlTitle = style({
  fontSize: '18px',
  fontWeight: 'bold',
  margin: 0,
  paddingBottom: '16px',
  borderBottom: '1px solid #f1f5f9',
  color: '#1e293b',
});

export const urlBox = style({
  padding: '12px 16px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  fontSize: '14px',
  color: '#334155',
  fontFamily: 'monospace',
  wordBreak: 'break-all',
});

export const switchContainer = style({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
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

export const statusBadgeText = style({
  fontSize: '13px',
  fontWeight: 'bold',
  minWidth: '60px',
  textAlign: 'right',
});

export const primaryButton = style({
  width: '100%',
  padding: '16px',
  backgroundColor: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontWeight: 'bold',
  fontSize: '15px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  boxShadow: '0 4px 6px rgba(0, 112, 243, 0.2)',
  ':disabled': {
    backgroundColor: '#94a3b8',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 12px rgba(0, 112, 243, 0.3)',
  },
  ':active': {
    transform: 'translateY(0)',
  }
});

export const syncButton = style([s.baseButton, {
  width: '100%',
  backgroundColor: vars.color.primary,
  color: 'white'
}]);

export const pullButton = style([s.baseButton, {
  width: '100%',
  backgroundColor: '#fff',
  color: vars.color.primary,
  border: `2px solid ${vars.color.primary}`,
  boxShadow: 'none',
  ':hover': {
    backgroundColor: '#f0f9ff',
    opacity: 1,
    transform: 'translateY(-1px)',
  }
}]);

export const errorText = style({
  color: '#ef4444',
  fontSize: '13px',
  marginTop: '12px',
  padding: '8px',
  backgroundColor: '#fef2f2',
  borderRadius: '6px',
  lineHeight: '1.5',
  border: '1px solid #fecaca',
});