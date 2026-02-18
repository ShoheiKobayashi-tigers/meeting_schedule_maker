// features/BulkSetup/components/steps/DocumentStep.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '../../../../styles/vars.css';

export const container = style({
  padding: '40px',
  maxWidth: '1000px',
  margin: '0 auto',
  fontFamily: 'sans-serif',
});

export const header = style({
  marginBottom: '40px',
  textAlign: 'left', 
  borderBottom: `1px solid ${vars.color.border}`,
  paddingBottom: '24px',
});

export const title = style({
  fontSize: '28px',
  fontWeight: '800',
  color: '#1e293b',
  marginBottom: '12px',
});

export const description = style({
  color: '#64748b',
  fontSize: '15px',
  lineHeight: '1.6',
});

export const formGrid = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  marginBottom: '48px',
});
export const column = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

export const label = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#334155',
});

export const input = style({
  padding: '12px 16px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  fontSize: '15px',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'all 0.2s ease',
  backgroundColor: '#fff',
  ':focus': {
    outline: 'none',
    borderColor: vars.color.primary,
    boxShadow: `0 0 0 3px ${vars.color.primary}1a`,
  },
});

export const textarea = style([input, {
  resize: 'vertical',
  lineHeight: '1.6',
  minHeight: '120px',
}]);

// --- ダウンロードエリアのリッチ化 ---
export const downloadArea = style({
  backgroundColor: '#f8fafc',
  border: `1px solid ${vars.color.border}`,
  borderRadius: '16px',
  padding: '32px',
  textAlign: 'center',
  marginBottom: '40px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
});

export const statusBadge = style({
  padding: '6px 16px',
  borderRadius: '20px',
  backgroundColor: '#fff',
  color: '#0284c7',
  fontSize: '12px',
  fontWeight: '800',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  marginBottom: '8px',
  display: 'inline-block',
});

export const downloadIcon = style({
  fontSize: '56px',
  marginBottom: '8px',
  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
});

export const downloadTitle = style({
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#334155',
  margin: 0,
});

// 統一されたボタンデザイン（Primaryスタイル）
const baseButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  backgroundColor: vars.color.primary, // #0070f3
  color: 'white',
  border: 'none',
  padding: '14px 32px',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'all 0.2s',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  textDecoration: 'none',
  ':hover': {
    opacity: 0.9,
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
  ':active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  ':disabled': {
    backgroundColor: '#cbd5e1',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
  }
});

export const downloadButton = style([baseButton, {
  width: '100%',
  maxWidth: '400px',
}]);

export const nextButtonWrapper = style({
  textAlign: 'right',
  paddingTop: '24px',
});

export const nextButton = style([baseButton, {
  // 必要であれば個別の調整
}]);