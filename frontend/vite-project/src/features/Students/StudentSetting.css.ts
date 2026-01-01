import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  height: '100vh',
  width: '100%',
  backgroundColor: '#f7fafc',
});

export const leftPanel = style({
  width: '400px',
  borderRight: '1px solid #e2e8f0',
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
});

export const rightPanel = style({
  flex: 1,
  padding: '2rem',
  overflowY: 'auto',
});

export const listHeader = style({
  padding: '1rem',
  borderBottom: '1px solid #e2e8f0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const studentRow = style({
  padding: '1rem',
  cursor: 'pointer',
  borderBottom: '1px solid #edf2f7',
  transition: 'background-color 0.2s',
  selectors: {
    '&:hover': { backgroundColor: '#f7fafc' },
  },
});

export const selectedRow = style({
  backgroundColor: '#ebf8ff',
  borderLeft: '4px solid #3182ce',
  selectors: {
    '&:hover': { backgroundColor: '#ebf8ff' },
  },
});

export const card = style({
  padding: '1rem',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  marginBottom: '1rem',
});

export const searchInput = style({
  width: '100%',
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #cbd5e0',
  marginBottom: '1rem',
});