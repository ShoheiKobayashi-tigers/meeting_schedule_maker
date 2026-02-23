// features/BulkSetup/components/steps/DocumentStep.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '../../../../styles/vars.css';
import * as s from '../../BulkSetupHub.css'

export const container = style({
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
export const downloadArea = s.downloadArea;

export const statusBadge = s.statusBadge

export const downloadIcon = s.downloadIcon

export const downloadTitle = s.downloadTitle

export const downloadButton = s.downloadButton



export const nextButtonWrapper = style({
  textAlign: 'right',
  paddingTop: '24px',
});

export const nextButton = style([s.baseButton, {
  // 必要であれば個別の調整
}]);