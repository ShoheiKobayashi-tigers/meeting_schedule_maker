import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import Button from '../../components/ui/Button/Button';
import * as s from './AllocationConfigPage.css';

export const AllocationConfigPage: React.FC = () => {
  const isOpen = useAppStore((state) => state.isAllocationConfigOpen);
  const setOpen = useAppStore((state) => state.setAllocationConfigOpen);

  if (!isOpen) return null;

  return (
    <div className={s.overlay}>
      <header className={s.header}>
        <div>
          <h2 style={{ margin: 0 }}>自動割り当て詳細設定</h2>
          <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>設定画面のモックアップです</p>
        </div>
        <Button variant="edit" onClick={() => setOpen(false)}>
          保存して戻る
        </Button>
      </header>

      <div className={s.content}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '24px', color: '#94a3b8' }}>⚒️ コンテンツ制作中</p>
          <p style={{ color: '#94a3b8' }}>ここに生徒リストとチェックボックスが並びます</p>
        </div>
      </div>
    </div>
  );
};