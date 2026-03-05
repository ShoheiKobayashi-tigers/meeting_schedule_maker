import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../../../styles/vars.css';

export const overlay = style({
  position: 'fixed',
  top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: 100,
});

export const container = style({
  backgroundColor: vars.color.white,
  borderRadius: '12px',
  width: '90vw',
  maxHeight: '90vh',
  display: 'flex',
  flexDirection: 'column',
  padding: vars.space.large,
  boxShadow: vars.shadow.panel,
});

export const header = style({ marginBottom: vars.space.medium });
export const title = style({ fontSize: '1.25rem', fontWeight: 700, margin: 0 });
export const subTitle = style({ fontSize: '0.85rem', color: vars.color.textMuted });

export const tableContainer = style({
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  minHeight: 0,
});

export const cellRecipe = recipe({
  base: {
    width: '100%',
    height: '100%',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s, border 0.2s',
    boxSizing: 'border-box',
    border: '2px solid transparent',
  },
  
  // ★ boolean の組み合わせをやめ、排他的な「1つの状態」にする
  variants: {
    state: {
      default: {
        cursor: 'pointer',
        ':hover': { backgroundColor: vars.color.hoverGray },
      },
      selected: {
        cursor: 'pointer',
        backgroundColor: `${vars.color.primary}22`,
        borderColor: vars.color.primary,
        ':hover': { backgroundColor: `${vars.color.primary}33` },
      },
      blocked: {
        backgroundColor: vars.color.muted,
        cursor: 'not-allowed',
      }
    }
  },

  defaultVariants: {
    state: 'default',
  }
});

export const checkIcon = style({
  color: vars.color.primary,
  fontWeight: 'bold',
  fontSize: '1.2rem',
});

export const footer = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: vars.space.medium,
  marginTop: vars.space.large,
  paddingTop: vars.space.medium,
  borderTop: `1px solid ${vars.color.border}`,
});