// src/components/ui/Modal/BaseModal.tsx
import React from 'react';
import * as s from './BaseInfoModal.css';
import { Button } from '../Button/Button'; // 既存のボタン

type BaseInfoModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode; // 🌟 ここに好きな中身を入れられる
};

export const BaseInfoModal: React.FC<BaseInfoModalProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.modalContainer} onClick={(e) => e.stopPropagation()}>
        
        <div className={s.header}>
          <h2 className={s.title}>{title}</h2>
        </div>

        {/* 🌟 利用規約やプライバシーポリシーの長文はここに入る */}
        <div className={s.body}>
          {children}
        </div>

        <div className={s.footer}>
          <Button variant="outline" onClick={onClose}>閉じる</Button>
        </div>
        
      </div>
    </div>
  );
};