// src/components/modals/TermsOfServiceModal.tsx
import React from 'react';
import { BaseInfoModal } from '../ui/Modal/BaseInfoModal';
import { useAppStore } from '../../store/useAppStore';

export const TermsOfServiceModal: React.FC = () => {
  const isOpen = useAppStore(state => state.ui.isTermsModalOpen);
  const setOpen = useAppStore(state => state.setTermsModalOpen);

  return (
    <BaseInfoModal title="利用規約（仮）" isOpen={isOpen} onClose={() => setOpen(false)}>
      <div>
        <h3>第1条（目的）</h3>
        <p>本規約は、個人面談・三者面談 スケジュールメーカー（以下「本サービス」）の利用に関する条件を定めるものです。</p>
        
        <h3>第2条（データの取り扱い）</h3>
        <p>本サービスに入力された児童の氏名等の個人情報は、お使いのブラウザ（ローカルストレージ）内にのみ保存され、外部サーバーへの送信は一切行われません。</p>
        
        {/* 長文コンテンツをここに記述 */}
      </div>
    </BaseInfoModal>
  );
};