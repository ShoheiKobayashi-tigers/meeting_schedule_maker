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

export const mainTitle = style({
  fontSize: '1.875rem',
  fontWeight: '800',
  color: '#2d3748',
  marginBottom: '0.5rem',
});

export const sectionTitle = style({
  fontSize: '1.25rem',
  fontWeight: '700',
  color: '#2d3748',
  borderBottom: '2px solid #edf2f7',
  paddingBottom: '0.5rem',
  marginTop: '2rem',
});

export const inputRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginTop: '1rem',
});

export const listArea = style({
  marginTop: '1rem',
  border: '1px solid #edf2f7',
  borderRadius: '0.5rem',
  maxHeight: '200px',
  overflowY: 'auto',
});

export const listItem = style({
  display: 'flex',
  alignItems: 'center',
  padding: '0.5rem',
  borderBottom: '1px solid #edf2f7',
  ':last-child': { borderBottom: 'none' },
});

export const deleteButton = style({
  color: '#e53e3e',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  marginLeft: 'auto',
  ':hover': { color: '#c53030' },
});

// description: 説明文のスタイル
export const description = style({
  color: '#718096',
  marginBottom: '1.5rem',
});

// section: 各設定項目を囲む枠
export const section = style({
  marginBottom: '3rem',
});

// select: プルダウンメニューのスタイル
export const select = style({
  padding: '0.5rem',
  borderRadius: '0.375rem',
  border: '1px solid #e2e8f0',
  backgroundColor: '#fff',
  fontSize: '1rem',
  minWidth: '120px',
});

// listIndex: リストの番号 (1. 2. ...)
export const listIndex = style({
  fontWeight: '700',
  color: '#718096',
  minWidth: '30px',
});

// listText: ヘッダー名 (日付や時刻)
export const listText = style({
  fontWeight: '600',
  color: '#2d3748',
  flexGrow: 1,
});