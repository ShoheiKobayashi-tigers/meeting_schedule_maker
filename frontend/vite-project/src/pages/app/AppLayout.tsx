// src/pages/app/AppLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom'; 
import { Home } from 'lucide-react';
import { Navigation } from '../../components/Navigation';
import { Button } from '../../components/ui/Button/Button';
import { useAppStore } from '../../store/useAppStore'; 
import { getSessionPassword } from '../../utils/secureStorage';

// --- グローバルモーダル群のインポート ---
import { HelpMenu } from '../../components/ui/HelpMenu/HelpMenu';
import { ImportStudentModal } from '../../features/students-manage/components/modals/ImportStudentModal';
import { ConfirmationModal } from '../../components/modals/ConfirmationModal';
import { AutoAssignConfirmModal } from '../../components/modals/AutoAssignConfirmModal';
import { StartupAdModal } from '../../components/modals/StartupAdModal';

import * as layout from '../../styles/layout.css';

// --- ロードマップ機能（元のApp.tsxからお引っ越し） ---
// ----------------------------------------------------
// ロードマップ用スタイル定義（疑似 vanilla-extract）
// ----------------------------------------------------
const roadmapStyles: Record<string, React.CSSProperties> = {
    beta: {
        color: '#1e293b',
        fontWeight: 'bold',
    },
    openButton: {
        background: 'none', border: 'none', color: '#1e293b', 
        fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold'
    },
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 
    },
    modal: {
        backgroundColor: 'white', padding: '32px', borderRadius: '16px', 
        maxWidth: '720px', width: '90%', maxHeight: '85vh', overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },
    header: { 
        display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' 
    },
    icon: { 
        fontSize: '24px' 
    },
    title: { 
        margin: 0, fontSize: '1.4rem', color: '#1e293b' 
    },
    description: { 
        color: '#475569', lineHeight: '1.6', marginBottom: '24px' 
    },
    listContainer: { 
        backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' 
    },
    listTitle: { 
        margin: '0 0 16px 0', fontSize: '1.1rem', color: '#0f172a', borderBottom: '2px solid #cbd5e1', paddingBottom: '8px' 
    },
    list: { 
        margin: 0, paddingLeft: '20px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '12px', lineHeight: '1.5' 
    },
    itemDesc: { 
        fontSize: '0.85rem', color: '#64748b' 
    },
    note: { 
        fontSize: '0.85rem', color: '#94a3b8', marginTop: '24px', lineHeight: '1.5' 
    },
    footer: { 
        textAlign: 'right', marginTop: '24px' 
    },
    closeButton: { 
        padding: '12px 32px' 
    }
};

// ----------------------------------------------------
// 新設: ロードマップ機能
// ----------------------------------------------------
const RoadmapFeature: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div style={roadmapStyles.beta}>（β版）{'-->'}</div>
            <button onClick={() => setIsOpen(true)} style={roadmapStyles.openButton}>
                今後の実装予定
            </button>

            {isOpen && (
                <div style={roadmapStyles.overlay}>
                    <div style={roadmapStyles.modal}>
                        
                        <div style={roadmapStyles.header}>
                            <h2 style={roadmapStyles.title}>個人面談・三者面談 スケジュールメーカー（β版）</h2>
                        </div>
                        
                        <p style={roadmapStyles.description}>
                            ご利用ありがとうございます！現在、より便利なツールを目指して以下の機能開発を進めています。
                        </p>
                        
                        <div style={roadmapStyles.listContainer}>
                            <h3 style={roadmapStyles.listTitle}>
                                📌 今後の実装予定
                            </h3>
                            <ul style={roadmapStyles.list}>
                                <li>
                                    <strong>安全なデータ同期（手入力の保護）（2026年5月末まで）</strong><br/>
                                    <span style={roadmapStyles.itemDesc}>
                                        担任の先生が手入力で聞いた予定が、後から送信された保護者フォームのデータで誤って上書きされないよう、データ競合時の保護機能を追加します。
                                    </span>
                                </li>
                                <li>
                                    <strong>データのバックアップ・復元機能（2026年10月末まで）</strong><br/>
                                    <span style={roadmapStyles.itemDesc}>
                                        万が一データが消えてしまっても復元できるよう、作成途中のデータをファイルとしてバックアップ・読み込みできる機能を追加します。
                                    </span>
                                </li>
                                <li>
                                    <strong>パスワード忘れ時の救済機能（時期未定）</strong><br/>
                                    <span style={roadmapStyles.itemDesc}>
                                        ゼロ知識暗号化の仕様上、システム管理者でもパスワードの解除はできませんが、配付用のお手紙（Wordファイル）の控えに残るIDを使用し、保護者から回収した「希望日時データ」のみを復旧できる機能を開発予定です。
                                    </span>
                                </li>                                
                                <li>
                                    <strong>現場に寄り添った操作性の改善（随時）</strong><br/>
                                    <span style={roadmapStyles.itemDesc}>
                                        「ブラウザの戻るボタン」を押してもアプリが終了しないようにする対応や、名簿から特定の児童をすぐに探せる「絞り込み検索機能」を追加します。
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <p style={roadmapStyles.note}>
                            ※ 本バージョンはβ（テスト）版です。予期せぬ動作をする可能性がありますが、個人を特定できる全ての情報は、お使いのPCのストレージ内に自動保存されます。<br/>
                            ご意見、ご要望、不具合のご報告は
                            <a 
                                href="https://forms.gle/GMqBkzefmF3EAASx7" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ color: '#0070f3', textDecoration: 'underline', fontWeight: 'bold', margin: '0 4px' }}
                            >
                                こちらのお問い合わせフォーム
                            </a>
                            からお気軽にお知らせください！
                        </p>
                        

                        <div style={roadmapStyles.footer}>
                            <Button variant="dark" onClick={() => setIsOpen(false)} style={roadmapStyles.closeButton}>
                                確認して閉じる
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export const AppLayout: React.FC = () => {
    const location = useLocation();
    const { hasEntered } = useAppStore(state => state.ui);
    const { resetEnteredState } = useAppStore(state => state);

    const basePath = location.pathname.startsWith('/demo') ? '/demo' : '/app';

// 🌟 現在がスタートページ（/app または /demo の直下）かどうかを判定
    const isStartPage = location.pathname === '/app' || location.pathname === '/app/' || 
                        location.pathname === '/demo' || location.pathname === '/demo/';

    // 🌟 追い出し処理（スタートページ「以外」にいる時だけ発動）
    useEffect(() => {
        if (!isStartPage) {
            // 🌟 1. 現在の相対パス（例: /step3/manual）を計算して保存
            const relativePath = location.pathname.replace(basePath, '');
            if (relativePath && relativePath !== '/') {
                localStorage.setItem('student-app-last-route', relativePath);
            }

            // 🌟 2. もし未認証なら、パスを保存した直後にスタート画面へ追い出す
            if (!getSessionPassword() || !hasEntered) {
                resetEnteredState(); 
                
                // ▼▼▼ 修正箇所：basePath に戻すのをやめる ▼▼▼
                // navigate(basePath, { replace: true }); 
                
                // デモモードからログアウトした場合でも確実に本番環境へ戻し、
                // さらに強制リロードをかけてメモリ（デモデータ）を完全に消去する
                window.location.href = '/app'; 
            }
        }
    }, [location.pathname, isStartPage, hasEntered, basePath, resetEnteredState]);

    // 🌟 スタートページ以外で認証されていない場合は何も描画しない（チラつき防止）
    if (!isStartPage && !hasEntered) {
        return null; 
    }

    return (
        <div className={layout.appContainer}>
            <header className={layout.appHeader}>
                <a 
                    href='/app' 
                    style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', gap: '8px' }}
                    title="スタート画面へ戻る"
                >
                    {/* SVGのホームアイコン */}
                    <Home/>
                    <h1 className={layout.appTitle} style={{ margin: 0 }}>個人面談・三者面談 スケジュールメーカー</h1>
                </a>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, marginLeft: '16px' }}>
                    <RoadmapFeature />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, marginLeft: '16px', justifyContent: 'flex-end', gap: '24px' }}>
                    <HelpMenu />
                </div>
            </header>

            {!isStartPage && <Navigation />}

            <main className={layout.appMainArea} style={isStartPage ? { padding: 0 } : {}}>
                <Outlet />
            </main>

            {/* 見えないところで待機するモーダル群 */}
            <ImportStudentModal />
            <ConfirmationModal />
            <AutoAssignConfirmModal />
            <StartupAdModal />
        </div>
    );
};