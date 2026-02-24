import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

export const overlay = style({
  position: 'absolute', // 画面全体ではなく、Step 3 の領域内を覆う
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(4px)', // すりガラス効果
  display: 'flex',
  alignItems: 'flex-start',
  paddingTop: '60px',
  justifyContent: 'center',
  zIndex: 100,
});

export const container = style({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '40px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  maxWidth: '800px',
  width: '100%',
  textAlign: 'center',
});

export const title = style({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: vars.color.textPrimary,
  marginBottom: '8px',
});

export const description = style({
  color: vars.color.textSecondary,
  marginBottom: '32px',
});

export const cardContainer = style({
  display: 'flex',
  gap: '24px',
  justifyContent: 'center',
});

export const card = style({
  flex: 1,
  padding: '32px 24px',
  borderRadius: '12px',
  border: `2px solid ${vars.color.border}`,
  backgroundColor: '#f8fafc',
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '16px',
  ':hover': {
    borderColor: vars.color.primary,
    backgroundColor: '#f0f9ff',
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.15)',
  }
});

export const cardIcon = style({
  fontSize: '3rem',
});

export const cardTitle = style({
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: vars.color.primary,
});

export const cardText = style({
  fontSize: '0.9rem',
  color: vars.color.textSecondary,
  lineHeight: '1.5',
});