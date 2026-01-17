import { style } from '@vanilla-extract/css';

export const panelContainer = style({
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    height: '100%',
    overflowY: 'auto'
});

export const mainTitle = style({
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#2d3748',
    marginBottom: '0.5rem',
});

export const description = style({
    color: '#718096',
    fontSize: '0.9rem',
    marginBottom: '2rem',
});

export const section = style({
    marginBottom: '2.5rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #edf2f7',
    ':last-child': { borderBottom: 'none' }
});

export const sectionTitle = style({
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#4a5568',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
});

export const controlRow = style({
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    marginBottom: '1rem'
});

export const input = style({
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e0',
    fontSize: '1rem',
    flex: 1
});

export const select = style([input, { flex: 'none', minWidth: '120px' }]);

export const addButton = style({
    padding: '0.6rem 1rem',
    backgroundColor: '#3182ce',
    color: 'white',
    fontWeight: 600,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    ':hover': { backgroundColor: '#2b6cb0' }
});

export const listContainer = style({
    border: '1px solid #edf2f7',
    borderRadius: '8px',
    backgroundColor: '#f8fafc'
});

export const listItem = style({
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #edf2f7',
    ':last-child': { borderBottom: 'none' }
});

export const listText = style({
    fontSize: '0.95rem',
    fontWeight: 500,
    color: '#2d3748',
    flex: 1
});

export const deleteButton = style({
    color: '#e53e3e',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: 600,
    ':hover': { textDecoration: 'underline' }
});