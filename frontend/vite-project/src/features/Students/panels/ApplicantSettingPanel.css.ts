import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';
import { basePanelTitle, baseScrollArea, baseListHeader, baseListRow } from '../../../styles/layout.css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: vars.space.large,
});

export const title = style([basePanelTitle, { fontSize: '1.2rem' }]);

export const scrollArea = style([baseScrollArea]);

export const listHeader = style([baseListHeader, {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: vars.space.medium,
}]);

export const listRow = style([baseListRow, {
  display: 'flex',
  border: '1px solid #edf2f7',
  borderRadius: '8px',
  backgroundColor: '#f8fafc',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: `${vars.space.medium} ${vars.space.large}`,
  cursor: 'default', // クリック廃止
  ':hover': {
    backgroundColor: 'transparent', // ホバー時の背景色変更も無効化（必要に応じて）
  }
}]);

export const studentInfo = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const studentName = style({
  fontWeight: 'bold',
});

export const studentId = style({
  fontSize: '0.85rem',
  color: vars.color.textMain,
});

export const actionButtonGroup = style({
  display: 'flex',
  gap: vars.space.small,
});

export const assignmentBadge = style({
  marginLeft: vars.space.small,
  fontSize: '0.7rem',
  padding: '2px 6px',
  backgroundColor: '#EBF8FF', // Light Blue
  color: '#2B6CB0',           // Dark Blue
  borderRadius: '4px',
  fontWeight: 'normal',
  verticalAlign: 'middle',
});

export const assignmentDetail = style({
  marginTop: '4px',
  fontSize: '0.8rem',
  color: vars.color.primary, // 割り当てられていることを強調
  fontWeight: '500',
});

export const noAssignment = style({
  marginTop: '4px',
  fontSize: '0.8rem',
  color: vars.color.textMuted,
  fontStyle: 'italic',
});