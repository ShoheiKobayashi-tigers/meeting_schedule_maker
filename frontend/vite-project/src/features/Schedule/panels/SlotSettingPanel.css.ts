import { style } from '@vanilla-extract/css';
import * as s from '../../../styles/layout.css';

export const panelContainer = style({
  padding: '1.5rem',
  height: '100%',
  overflowX: 'auto',
});

export const panelTitle = s.panelTitle;

export const scrollWrapper = style({
    overflow: 'auto', // 縦横両方のスクロールに対応
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    flex: 1,
});

export const gridTable = style({
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem',
    minWidth: 'max-content', // 列が多い時に潰れないように
});

export const stickyHeader = style({
    position: 'sticky',
    top: 0,
    backgroundColor: '#f7fafc',
    padding: '12px',
    borderBottom: '2px solid #e2e8f0',
    zIndex: 1,
    textAlign: 'center',
});

export const timeCell = style({
    padding: '12px',
    fontWeight: 600,
    backgroundColor: '#f7fafc',
    borderBottom: '1px solid #e2e8f0',
    textAlign: 'center',
    position: 'sticky',
    left: 0, // 横スクロール時も時刻が見えるように
    zIndex: 2,
});

export const slotCell = style({
    padding: '12px',
    borderBottom: '1px solid #e2e8f0',
    borderLeft: '1px solid #e2e8f0',
    textAlign: 'center',
});

export const toggleWrapper = style({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
});

export const statusTextOn = style({ fontSize: '0.7rem', color: '#48bb78', fontWeight: 700 });
export const statusTextOff = style({ fontSize: '0.7rem', color: '#a0aec0', fontWeight: 500 });