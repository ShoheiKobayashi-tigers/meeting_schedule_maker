import { style, keyframes } from '@vanilla-extract/css';

const fadeInUp = keyframes({
  'from': { opacity: 0, transform: 'translateY(10px)' },
  'to': { opacity: 1, transform: 'translateY(0)' }
});

export const overlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2000,
  backdropFilter: 'blur(4px)',
});

export const content = style({
  backgroundColor: 'white',
  borderRadius: '12px',
  width: '95%',
  maxWidth: '600px',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  animation: `${fadeInUp} 0.3s ease-out`,
});

export const header = style({
  padding: '1.5rem',
  borderBottom: '1px solid #edf2f7',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const title = style({
  margin: 0,
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#2d3748',
});

export const closeButton = style({
  background: 'none',
  border: 'none',
  fontSize: '1.8rem',
  color: '#a0aec0',
  cursor: 'pointer',
  lineHeight: 1,
  ':hover': { color: '#e53e3e' }
});

export const scrollArea = style({
  padding: '1.5rem',
  overflowY: 'auto',
  flex: 1,
});

export const sectionTitle = style({
  fontSize: '0.9rem',
  fontWeight: 700,
  color: '#4a5568',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginTop: '1.5rem',
  marginBottom: '1rem',
  display: 'flex',
  alignItems: 'center',
  ':before': {
    content: '""',
    width: '4px',
    height: '16px',
    backgroundColor: '#3182ce',
    marginRight: '8px',
    borderRadius: '2px',
  }
});

export const field = style({
  marginBottom: '1.25rem',
});

export const label = style({
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#4a5568',
  marginBottom: '0.5rem',
});

export const required = style({
  color: '#e53e3e',
  marginLeft: '2px',
});

export const input = style({
  width: '100%',
  padding: '0.6rem 0.8rem',
  borderRadius: '6px',
  border: '1px solid #cbd5e0',
  fontSize: '1rem',
  transition: 'all 0.2s',
  ':focus': {
    outline: 'none',
    borderColor: '#3182ce',
    boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.15)',
  }
});

export const dateGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: '0.5rem',
  backgroundColor: '#f8fafc',
  padding: '1rem',
  borderRadius: '8px',
  border: '1px solid #edf2f7',
});

export const checkboxLabel = style({
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.875rem',
  cursor: 'pointer',
  padding: '4px 0',
});

export const checkbox = style({
  marginRight: '8px',
  width: '16px',
  height: '16px',
});

export const errorText = style({
  color: '#e53e3e',
  fontSize: '0.75rem',
  marginTop: '0.4rem',
});

export const siblingBox = style({
  backgroundColor: '#ebf8ff',
  padding: '1.25rem',
  borderRadius: '8px',
  borderLeft: '4px solid #3182ce',
});

export const row = style({
  display: 'flex',
  gap: '1rem',
});

export const radioGroup = style({
  display: 'flex',
  gap: '2rem',
  marginBottom: '1.5rem',
});

export const radioLabel = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontWeight: 500,
  cursor: 'pointer',
});

export const footer = style({
  padding: '1.25rem 1.5rem',
  borderTop: '1px solid #edf2f7',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '1rem',
});

const baseButton = style({
  padding: '0.6rem 1.5rem',
  borderRadius: '6px',
  fontWeight: 600,
  cursor: 'pointer',
  border: 'none',
  transition: 'all 0.2s',
});

export const cancelButton = style([baseButton, {
  backgroundColor: '#edf2f7',
  color: '#4a5568',
  ':hover': { backgroundColor: '#e2e8f0' }
}]);

export const saveButton = style([baseButton, {
  backgroundColor: '#38a169',
  color: 'white',
  ':hover': { backgroundColor: '#2f855a' }
}]);

export const updateButton = style([baseButton, {
  backgroundColor: '#3182ce',
  color: 'white',
  ':hover': { backgroundColor: '#2b6cb0' }
}]);