// src/App.tsx
import React, {useState} from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { Navigation } from './components/Navigation';
import { Button } from './components/ui/Button/Button';
import { StartScreen } from './features/StartScreen/StartScreen';
import { GuardianPortal } from './features/ParentForm/GuardianPortal/GuardianPortal';

// === Step 1 用パネル ===
import { ApplicantSettingPanel } from './features/Students/panels/ApplicantSettingPanel';
import { SiblingSettingPanel } from './features/Students/panels/SiblingSettingPanel';

// === Step 2 用パネル ===
import { ScheduleSettingPanel } from './features/Schedule/panels/ScheduleSettingPanel';
import { SlotSettingPanel } from './features/Schedule/panels/SlotSettingPanel';

// === Step 3 用パネル ===
import { DocumentStep } from './features/BulkSetup/components/steps/DocumentStep';
import { PublishStep } from './features/BulkSetup/components/steps/PublishStep';
import { ModeSelectModal } from './components/modals/ModeSelectModal';
import { ManualInputPanel } from './features/ManualInput/ManualInputPanel';

// === Step 4 用パネル ===
import { AllocationConfigPage } from './features/AllocationConfig/AllocationConfigPage';
import { ScheduleScreen } from './features/Main/Main';

// === Step 5 用パネル ===
import { ResultStep } from './features/BulkSetup/components/steps/ResultStep';

// === UIパーツとモーダル群 ===
import { ConfirmationModal } from './components/modals/ConfirmationModal';
import { AutoAssignConfirmModal } from './components/modals/AutoAssignConfirmModal';
import { BulkSetupHub } from './features/BulkSetup/BulkSetupHub';
// (旧StudentSetting内にあったモーダルをAppに移動)
import { ImportStudentModal } from './features/Students/components/modals/ImportStudentModal';

import * as layout from './styles/layout.css'

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
                                    <strong>セキュリティ強化とデータ保護（2026年3月末まで）</strong><br/>
                                    <span style={roadmapStyles.itemDesc}>
                                        現在、個人の特定が可能な全ての情報は、お使いのPCのストレージ内に自動保存されます。更なるセキュリティ強化のため、「ストレージ保存のデータの強力な暗号化」「リセットボタン」などを実装し、コンプライアンスに準拠した安全な環境を提供します。<br/>※現在は画面をリロードし、「新しく始める」ボタンを押すことでリセットが可能です。
                                    </span>
                                </li>
                                <li>
                                    <strong>ユーザー操作ガイドの充実（2026年3月末まで）</strong><br/>
                                    <span style={roadmapStyles.itemDesc}>
                                        初めてツールに触れる先生でも、迷わず簡単にスケジュールが組めるようなチュートリアル画面や操作ガイドをご用意します。
                                    </span>
                                </li>
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
                            <Button variant="primary" onClick={() => setIsOpen(false)} style={roadmapStyles.closeButton}>
                                確認して閉じる
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// ----------------------------------------------------
// 新設: 先生用のメイン画面を独立したコンポーネントにする
// ----------------------------------------------------
const TeacherApp: React.FC = () => {
    const workspaceId = useAppStore((state) => state.db.workspaceId);
    const { hasEntered, activeStep, activeSubStep, step3Mode } = useAppStore((state) => state.ui);
    const setActiveSubStep = useAppStore((state) => state.setActiveSubStep);

    if (!workspaceId || !hasEntered) {
        return <StartScreen />;
    }

    // 3. 先生用メインレイアウト
    return (
        <div className={layout.appContainer}>
            {/* 一番上のバー（タイトルと設定） */}
            <header className={layout.appHeader}>
                <h1 className={layout.appTitle}>個人面談・三者面談 スケジュールメーカー</h1>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, marginLeft: '16px' }}>
                    {/* ★ 作成したコンポーネントを置くだけ！TeacherAppのコードは汚れません */}
                    <RoadmapFeature />
                </div>
            </header>

            {/* 2段構えのナビゲーション */}
            <Navigation />

            {/* メイン表示領域（フェーズ1では既存コンポーネントをそのまま描画） */}
            <main className={layout.appMainArea}>
                
                {/* =========================================
                    Step 1: 名簿の準備
                ========================================= */}
                {activeStep === 'step1' && activeSubStep === '1-1' && (
                    <ApplicantSettingPanel />
                )}
                {activeStep === 'step1' && activeSubStep === '1-2' && (
                    <SiblingSettingPanel />
                )}

                {/* =========================================
                    Step 2: 面談枠の作成
                ========================================= */}
                {activeStep === 'step2' && activeSubStep === '2-1' && (
                    <ScheduleSettingPanel />
                )}
                {activeStep === 'step2' && activeSubStep === '2-2' && (
                    <SlotSettingPanel />
                )}
                
                {/* =========================================
                    Step 3: 希望日程の回収
                ========================================= */}
                {activeStep === 'step3' && (
                    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column',height: '100%', overflow: 'hidden' }}>
                        
                        {/* モード未選択時: 背景に3A-1を置き、上にModalを被せる */}
                        {step3Mode === null && (
                            <>
                                {/* 背景としてダミー表示（ぼかし効果） */}
                                <div style={{ filter: 'blur(3px)', opacity: 0.5, pointerEvents: 'none', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <DocumentStep onNext={() => {}} />
                                </div>
                                <ModeSelectModal />
                            </>
                        )}

                        {/* モードA: 手入力 (これから作る画面のプレースホルダー) */}
                        {step3Mode === 'manual' && activeSubStep === '3A-1' && (
                            <ManualInputPanel />
                        )}
                        {/* モードB: フォーム */}
                        {step3Mode === 'form' && activeSubStep === '3B-1' && (
                            <DocumentStep onNext={() => setActiveSubStep('3B-2')} />
                        )}
                        {step3Mode === 'form' && activeSubStep === '3B-2' && (
                            <PublishStep />
                        )}
                        {step3Mode === 'form' && activeSubStep === '3B-3' && (
                            <ManualInputPanel />
                        )}
                    </div>
                )}

                {/* =========================================
                    Step 4: スケジュール割当
                ========================================= */}
                {activeStep === 'step4' && activeSubStep === '4-1' && (
                    <AllocationConfigPage />
                )}
                {activeStep === 'step4' && activeSubStep === '4-2' && (
                    <ScheduleScreen />
                )}
                
                {/* =========================================
                    Step 5: 確定と結果出力
                ========================================= */}
                {activeStep === 'step5' && activeSubStep === '5-1' && (
                    <ResultStep />
                )}
                
            </main>

            {/* モーダル群 (旧StudentSetting内にあったものもここに集約) */}
            <ImportStudentModal />
            <BulkSetupHub />
            <ConfirmationModal />
            <AutoAssignConfirmModal/>
        </div>
    );
};

// ----------------------------------------------------
// アプリの根幹: URLに応じて表示する画面を切り替える
// ----------------------------------------------------
export const App: React.FC = () => {
    return (
        <Routes>
            {/* "/p/〇〇" のURLにアクセスした場合は保護者画面を表示 */}
            <Route path="/p/:workspaceId" element={<GuardianPortal />} />
            
            {/* それ以外のURL ("/" など) にアクセスした場合は先生画面を表示 */}
            <Route path="/*" element={<TeacherApp />} />
        </Routes>
    );
};