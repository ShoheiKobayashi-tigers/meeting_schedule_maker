// src/components/modals/StartupAdModal.tsx (新規作成)
import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { BaseInfoModal } from '../ui/Modal/BaseInfoModal';
import { NinjaAd } from '../NinjaAd';

export const StartupAdModal: React.FC = () => {
  // Storeから状態と関数を取得
  const { ui, setStartupAdModalOpen } = useAppStore();

  const handleClose = () => {
    setStartupAdModalOpen(false);
  };

  return (
    <BaseInfoModal
      title="ようこそ！"
      isOpen={ui.isStartupAdModalOpen}
      onClose={handleClose}
    >
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <p style={{ color: '#64748b', marginBottom: '20px', lineHeight: '1.6' }}>
          本ツールは無料で提供されており、広告収入によって運営・維持されています。<br/>
          開発継続のため、ご理解とご協力をお願いいたします。
        </p>
        
        {/* 広告コンポーネント */}
        <div style={{ margin: '20px 0', minHeight: '90px' }}>
          <NinjaAd />
        </div>
      </div>
    </BaseInfoModal>
  );
};