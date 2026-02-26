import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

export const description = style({
    color: vars.color.textSecondary,
    fontSize: '0.9rem',
    marginBottom: vars.space.large,
});

export const section = style({
    marginBottom: vars.space.large,
    paddingBottom: vars.space.large,
    borderBottom: `1px solid ${vars.color.border}`,
    ':last-child': { borderBottom: 'none', marginBottom: 0, paddingBottom: 0 }
});

export const sectionTitle = style({
    fontSize: '1.1rem',
    fontWeight: 700,
    color: vars.color.textPrimary,
    marginBottom: vars.space.medium,
    display: 'flex',
    alignItems: 'center',
    gap: vars.space.small
});

export const controlRow = style({
    display: 'flex',
    gap: vars.space.small,
    alignItems: 'center',
    marginBottom: vars.space.medium
});

export const input = style({
    padding: '0.5rem 0.75rem',
    borderRadius: vars.borderRadius.small,
    border: `1px solid ${vars.color.border}`,
    fontSize: '1rem',
    width: '160px',
});

export const select = style([input, { flex: 'none', minWidth: '120px' }]);

export const listContainer = style({
    border: `1px solid ${vars.color.border}`,
    borderRadius: vars.borderRadius.medium,
    backgroundColor: vars.color.background
});

export const listItem = style({
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    borderBottom: `1px solid ${vars.color.border}`,
    ':last-child': { borderBottom: 'none' }
});

export const listText = style({
    fontSize: '0.95rem',
    fontWeight: 500,
    color: vars.color.textPrimary,
    flex: 1
});