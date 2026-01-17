import { style } from '@vanilla-extract/css';

export const overlay = style({
  position: 'fixed',
  top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: 1000,
});

export const content = style({
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '0.75rem',
  maxWidth: '450px',
  width: '90%',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
});

export const title = style({
  fontSize: '1.5rem',
  fontWeight: 800,
  color: '#2d3748',
  marginBottom: '1rem',
});

export const cancelButton = style({
  padding: '0.75rem 1.5rem',
  borderRadius: '0.5rem',
  fontWeight: 700,
  cursor: 'pointer',
  border: 'none',
  backgroundColor: '#edf2f7',
  color: '#4a5568',
  transition: 'background-color 0.2s',
  ':hover': { backgroundColor: '#dce1e7' },
});

export const confirmButton = style({
  padding: '0.75rem 1.5rem',
  borderRadius: '0.5rem',
  fontWeight: 700,
  cursor: 'pointer',
  border: 'none',
  backgroundColor: '#e53e3e',
  color: 'white',
  marginLeft: '1rem',
  transition: 'background-color 0.2s',
  ':hover': { backgroundColor: '#c53030' },
});