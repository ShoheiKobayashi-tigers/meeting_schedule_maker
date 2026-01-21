import { style } from '@vanilla-extract/css';

export const tableWrapper = style({
  overflow: 'auto',
  flex: 1,
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  backgroundColor: '#fff',
  position: 'relative',
});

export const table = style({
  borderCollapse: 'separate',
  borderSpacing: 0,
  width: '100%',
  minWidth: '900px',
  tableLayout: 'fixed',
});

export const headerCell = style({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  borderBottom: '2px solid #e2e8f0',
  borderRight: '1px solid #e2e8f0',
  backgroundColor: '#edf2f7',
  padding: '0.75rem',
  fontWeight: '700',
  textAlign: 'center',
});

export const timeCell = style({
  position: 'sticky',
  left: 0,
  zIndex: 20,
  borderBottom: '1px solid #e2e8f0',
  borderRight: '1px solid #e2e8f0',
  backgroundColor: '#f7fafc',
  padding: '0.75rem',
  fontWeight: '600',
  width: '100px',
  textAlign: 'center',
});

export const cornerCell = style([
  headerCell,
  { left: 0, zIndex: 30 }
]);

export const cell = style({
  borderBottom: '1px solid #e2e8f0',
  borderRight: '1px solid #e2e8f0',
  verticalAlign: 'top',
  padding: '0.5rem',
  minHeight: '80px',
  position: 'relative',
  
  alignItems: 'center',    
  justifyContent: 'center',
});