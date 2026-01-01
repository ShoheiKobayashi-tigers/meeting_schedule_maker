import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

export const item = recipe({
  base: {
    padding: '0.75rem',
    borderRadius: '0.375rem',
    marginBottom: '0.5rem',
    border: '1px solid #90cdf4',
    transition: 'all 0.2s',
    userSelect: 'none',
  },
  variants: {
    status: {
      normal: {
        backgroundColor: '#ebf8ff',
        cursor: 'grab',
      },
      active: {
        backgroundColor: '#d1f1da',
        borderColor: '#48bb78',
        cursor: 'pointer',
      },
      notAllowed: {
        backgroundColor: '#f7fafc',
        borderColor: '#e2e8f0',
        opacity: 0.5,
        cursor: 'not-allowed',
      },
      isDragging: {
        opacity: 0.4,
        boxShadow: 'none',
      }
    }
  }
});

export const badge = style({
  marginLeft: '8px',
  color: '#e53e3e',
  fontSize: '0.8em',
  fontWeight: 'bold',
});