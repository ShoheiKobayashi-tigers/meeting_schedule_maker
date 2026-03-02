// src/pages/app/AppLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from '../../components/Navigation';
import { Button } from '../../components/ui/Button/Button';

// --- グローバルモーダル群のインポート ---
import { ImportStudentModal } from '../../features/students-manage/components/modals/ImportStudentModal';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';
import { AutoAssignConfirmModal } from '../../components/modals/AutoAssignConfirmModal';

import * as layout from '../../styles/layout.css';

// --- ロードマップ機能（元のApp.tsxからお引っ越し） ---
const RoadmapFeature: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <div style={{ color: '#1e293b', fontWeight: 'bold' }}>（β版）{'-->'}</div>
            <button 
                onClick={() => setIsOpen(true)} 
                style={{ background: 'none', border: 'none', color: '#1e293b', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
            >
                今後の実装予定
            </button>

            {isOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
                    <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '16px', maxWidth: '720px', width: '90%', maxHeight: '85vh', overflowY: 'auto' }}>
                        <h2 style={{ margin: '0 0 16px 0', fontSize: '1.4rem' }}>個人面談・三者面談 スケジュールメーカー（β版）</h2>
                        <p style={{ color: '#475569', marginBottom: '24px' }}>ご利用ありがとうございます！現在、以下の機能開発を進めています。</p>
                        <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <li><strong>セキュリティ強化とデータ保護（2026年3月末まで）</strong></li>
                                <li><strong>ユーザー操作ガイドの充実（2026年3月末まで）</strong></li>
                                <li><strong>安全なデータ同期（手入力の保護）（2026年5月末まで）</strong></li>
                                <li><strong>データのバックアップ・復元機能（2026年10月末まで）</strong></li>
                            </ul>
                        </div>
                        <div style={{ textAlign: 'right', marginTop: '24px' }}>
                            <Button variant="primary" onClick={() => setIsOpen(false)}>確認して閉じる</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export const AppLayout: React.FC = () => {
    return (
        <div className={layout.appContainer}>
            <header className={layout.appHeader}>
                <h1 className={layout.appTitle}>個人面談・三者面談 スケジュールメーカー</h1>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, marginLeft: '16px' }}>
                    <RoadmapFeature />
                </div>
            </header>

            <Navigation />

            <main className={layout.appMainArea}>
                <Outlet />
            </main>

            {/* 見えないところで待機するモーダル群 */}
            <ImportStudentModal />
            <ConfirmationModal />
            <AutoAssignConfirmModal />
        </div>
    );
};