// src/components/modals/ConfirmationModal.tsx
import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import * as s from './ConfirmationModal.css'; // 切り出したスタイル

export const ConfirmationModal: React.FC = () => {
    const config = useAppStore((state) => state.ui.confirmationModal);
    const close = useAppStore((state) => state.closeConfirmationModal);

    if (!config.isOpen) return null;

    return (
        <div className={s.overlay} onClick={close}>
            <div className={s.content} onClick={(e) => e.stopPropagation()}>
                <h3 className={s.title}>{config.title}</h3>
                <p style={{ color: '#4a5568', lineHeight: '1.6' }}>{config.message}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <button className={s.cancelButton} onClick={close}>
                        {config.cancelText || 'キャンセル'}
                    </button>
                    <button className={s.confirmButton} onClick={() => { config.onConfirm?.(); close(); }}>
                        {config.confirmText || '実行する'}
                    </button>
                </div>
            </div>
        </div>
    );
};