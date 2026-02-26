import { style } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css';

export const toggleWrapper = style({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // セルの中央に寄せる
    gap: '6px',
    height: '100%',
    paddingTop: vars.space.small,
});

export const statusTextOn = style({ 
    fontSize: '0.8rem', 
    color: vars.color.success, // varsの緑色を使用 
    fontWeight: 700 
});

export const statusTextOff = style({ 
    fontSize: '0.8rem', 
    color: vars.color.textMuted, // varsのグレーを使用
    fontWeight: 500 
});