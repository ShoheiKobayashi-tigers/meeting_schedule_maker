import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    primary: '#4299e1',
    success: '#48bb78',
    successDark: '#38a169',
    danger: '#e53e3e',
    background: '#f8f8f8',
    white: '#ffffff',
    border: '#ced4da',
    textMain: '#4a5568',
    textMuted: '#a0aec0',
    hoverGray: '#e2e8f0',
  },
  space: {
    none: '0',
    small: '0.5rem',
    medium: '1rem',
    large: '1.5rem',
  },
  shadow: {
    panel: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  }
});