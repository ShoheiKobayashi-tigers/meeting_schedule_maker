import { style } from '@vanilla-extract/css';

export const panelContainer = style({
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    height: '100%',
});

export const panelTitle = style({
    fontSize: '1.2rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    color: '#2d3748',
});

export const settingSection = style({
    marginBottom: '2.5rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid #edf2f7',
    ':last-child': {
        borderBottom: 'none',
    }
});

export const label = style({
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
    color: '#4a5568',
});

export const inputGroup = style({
    display: 'flex',
    gap: '0.5rem',
});

export const input = style({
    flex: 1,
    padding: '0.6rem 0.8rem',
    borderRadius: '6px',
    border: '1px solid #cbd5e0',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
    ':focus': {
        outline: 'none',
        borderColor: '#3182ce',
    }
});

export const addButton = style({
    padding: '0.6rem 1.25rem',
    backgroundColor: '#3182ce',
    color: 'white',
    fontWeight: 600,
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
        backgroundColor: '#2b6cb0',
    },
    ':active': {
        transform: 'translateY(1px)',
    }
});