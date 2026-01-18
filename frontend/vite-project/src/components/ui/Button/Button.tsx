import React from 'react';
import * as s from './Button.css';

type ButtonVariant = 'add' | 'edit' | 'delete' | 'confirm' | 'cancel';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  leftIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'confirm', 
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

export default Button;