// features/BulkSetup/components/steps/PreviewStep.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '../../../../styles/vars.css';

export const splitLayout = style({
  display: 'grid',
  gridTemplateColumns: '1fr 320px',
  gap: '32px',
  marginTop: '24px',
});

export const editArea = style({
  display: 'flex',
  flexDirection: 'column',
});

export const label = style({
  fontSize: '14px',
  fontWeight: 'bold',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const textarea = style({
  width: '100%',
  height: '240px',
  padding: '12px',
  borderRadius: '8px',
  border: `1px solid ${vars.color.border}`,
  fontSize: '14px',
  lineHeight: '1.6',
  resize: 'none',
  ':focus': {
    borderColor: vars.color.primary,
    outline: 'none',
  },
});

export const previewArea = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const phoneFrame = style({
  width: '280px',
  height: '480px',
  border: '12px solid #333',
  borderRadius: '32px',
  backgroundColor: '#fff',
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
});

export const phoneScreen = style({
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  backgroundColor: '#fff',
});