import { style } from '@vanilla-extract/css';
import { vars } from '../../../../styles/vars.css';

export const container = style({
  backgroundColor: '#f0f7ff',
  padding: '12px',
  borderRadius: '8px',
  border: `1px solid ${vars.color.border}`, // #e2e8f0
  marginTop: '16px',
});

export const header = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
});

export const title = style({
  fontSize: '14px',
  fontWeight: 'bold',
  color: vars.color.textPrimary,
  margin: 0,
});

export const content = style({
  fontSize: '13px',
  color: vars.color.textPrimary,
});

export const section = style({
  marginBottom: '4px',
  ':last-child': {
    marginBottom: 0,
  },
});

export const sectionLabel = style({
  fontWeight: 'bold',
  color: vars.color.textSecondary,
  fontSize: '11px',
});

export const list = style({
  margin: '4px 0 8px 16px',
  padding: 0,
});

export const emptyText = style({
  fontSize: '12px',
  color: vars.color.textSecondary,
  margin: 0,
});

export const selfBadge = style({
  fontSize: '10px',
  color: vars.color.primary,
  marginLeft: '4px',
  opacity: 0.8,
});