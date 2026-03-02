// src/pages/app/AppLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from '../../components/Navigation';
import * as layout from '../../styles/layout.css';

export const AppLayout: React.FC = () => {
    return (
        <div className={layout.appContainer}>
            {/* 一番上のバー（タイトル） */}
            <header className={layout.appHeader}>
                <h1 className={layout.appTitle}>個人面談・三者面談 スケジュールメーカー</h1>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, marginLeft: '16px' }}>
                    {/* ※RoadmapFeature（今後の実装予定ボタン）は後でここに復活させます */}
                </div>
            </header>

            {/* 2段構えのナビゲーション（ここでURLが変わる） */}
            <Navigation />

            {/* メイン表示領域（ここでURLに応じた各Stepの画面がパチパチ切り替わる） */}
            <main className={layout.appMainArea}>
                <Outlet />
            </main>

            {/* ※モーダル群（ImportStudentModalなど）もフェーズ3以降でここに復活させます */}
        </div>
    );
};