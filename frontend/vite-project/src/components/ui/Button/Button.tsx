// src/components/ui/Button/Button.tsx
import React from 'react';
import * as s from './Button.css';

// 提案するButtonVariant
type ButtonVariant = 
  | 'primary'   // 最も目立たせるメインアクション（青背景・白文字）。旧: add, confirm
  | 'secondary' // サブアクション（薄いグレー背景）。目立たせたくないけど枠は欲しい時
  | 'outline'   // 枠線のみのアクション（白背景・色付き枠）。旧: edit, cancel
  | 'danger'    // 危険な操作（赤背景 または 白背景＋赤文字）。旧: delete
  | 'ghost'    // 背景も枠線もないテキストだけのボタン（ホバーで少しグレーになる）
  | 'dark';     // 黒・ダークグレー系の引き締まるボタン

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  leftIcon, 
  children, 
  className, 
  ...props 
}) => {
  return (
    <button 
      className={`${s.baseButton} ${s.variant[variant]} ${className || ''}`} 
      {...props}
    >
      {leftIcon && <span className={s.icon}>{leftIcon}</span>}
      {children}
    </button>
  );
};