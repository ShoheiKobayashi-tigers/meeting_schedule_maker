import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: '1.5rem', // manager.styles.panel の代わり
});

export const title = style({
  fontSize: '1.5rem',
  fontWeight: '800',
  marginBottom: '1rem',
  color: '#2d3748',
});

export const guideMessage = style({
  color: '#718096',
  marginBottom: '1rem',
  fontSize: '0.875rem',
  lineHeight: '1.4',
});

export const scrollArea = style({
  overflowY: 'auto',
  flex: 1,
});

export const actionArea = style({
  marginBottom: '16px',
  padding: '8px 0',
  borderBottom: '1px solid #e2e8f0', // リストとの区切り線
  display: 'flex',
  justifyContent: 'center',
});

// エラーの原因になっていたボタンのスタイル
export const deleteButton = style({
  padding: '0.5rem 1rem',
  marginBottom: '1rem',
  backgroundColor: '#5d5d63',
  color: 'white',
  border: 'none',
  borderRadius: '0.25rem',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: '600',
  width: '100%',
  transition: 'background-color 0.2s',
  selectors: {
    '&:hover': {
      backgroundColor: '#a1a3a6',
    },
  },
});

export const emptyState = style({
  textAlign: 'center',
  marginTop: '2rem',
  fontWeight: '700',
});