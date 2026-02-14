import { style } from '@vanilla-extract/css';

export const overlay = style({
  position: 'fixed',
  inset: 0, // top:0, left:0, right:0, bottom:0 の短縮
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
});

export const content = style({
  backgroundColor: 'white',
  padding: '24px',
  borderRadius: '8px',
  width: '600px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
});

export const title = style({
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '16px',
  borderBottom: '1px solid #eee',
  paddingBottom: '8px',
  color: '#333',
});

export const section = style({
  marginBottom: '24px',
});

export const description = style({
  fontSize: '14px',
  color: '#666',
  marginBottom: '8px',
});

export const descriptionBold = style([
  description, // 配列で指定することで、descriptionのスタイルを引き継げる
  {
    fontWeight: 'bold',
    color: '#334155', // ついでに色を少し濃くするなどの調整も楽
  }
]);

export const uploadArea = style({
  border: '2px dashed #cbd5e1',
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center',
  backgroundColor: '#f8fafc',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  ':hover': {
    backgroundColor: '#f1f5f9',
    borderColor: '#94a3b8',
  },
});

export const fileInput = style({
  display: 'block',
  margin: '0 auto',
});

export const tableContainer = style({
  maxHeight: '150px',
  overflowY: 'auto',
  border: '1px solid #e2e8f0',
  borderRadius: '4px',
});

export const table = style({
  width: '100%',
  fontSize: '12px',
  borderCollapse: 'collapse',
});

export const tableHeader = style({
  position: 'sticky',
  top: 0,
  backgroundColor: '#f1f5f9',
  zIndex: 1,
});

export const tableRow = style({
  borderTop: '1px solid #eee',
});

export const tableCell = style({
  padding: '8px',
  textAlign: 'left',
});

export const footer = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px',
  marginTop: '32px',
});