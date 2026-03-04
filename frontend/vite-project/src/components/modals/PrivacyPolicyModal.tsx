// src/components/modals/PrivacyPolicyModal.tsx
import React from 'react';
import { BaseInfoModal } from '../ui/Modal/BaseInfoModal'; // 🌟 修正
import { useAppStore } from '../../store/useAppStore';

export const PrivacyPolicyModal: React.FC = () => {
  const isOpen = useAppStore(state => state.ui.isPrivacyModalOpen);
  const setOpen = useAppStore(state => state.setPrivacyModalOpen);

  return (
    <BaseInfoModal title="プライバシーポリシー" isOpen={isOpen} onClose={() => setOpen(false)}> {/* 🌟 修正 */}
      <div>
        <p>当サービスにおけるプライバシー情報の取り扱いは以下の通りです。</p>
        
        <h3>1. 個人情報の収集・保存</h3>
        <p>当サービスは完全なクライアントサイドアプリケーションであり、ユーザーが入力した情報を開発者や第三者が収集することはありません。</p>
        
        {/* 長文コンテンツをここに記述 */}
      </div>
    </BaseInfoModal>
  );
};