// src/pages/app/step3-collection/ModeSelectPage.tsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../../store/useAppStore';
import { ModeSelectModal } from '../../../components/modals/ModeSelectModal';
import { DocumentStep } from '../../../features/collection/panels/DocumentStep';

export const ModeSelectPage = () => {
    const navigate = useNavigate();
    // Zustandから「現在のモード」を取得
    const step3Mode = useAppStore(state => state.db.step3Mode);
    const location = useLocation();
    const basePath = location.pathname.startsWith('/demo') ? '/demo' : '/app';

    // ページが開かれた瞬間に、モードが決まっているかチェック！
    useEffect(() => {
        if (step3Mode === 'manual') {
            // 手入力モードなら、ブラウザ履歴を残さずに 3A-1 へ瞬間移動
            navigate(`${basePath}/step3/manual`, { replace: true });
        } else if (step3Mode === 'form') {
            // フォームモードなら、ブラウザ履歴を残さずに 3B-1 へ瞬間移動
            navigate(`${basePath}/step3/form/document`, { replace: true });
        }
    }, [step3Mode, navigate]);

    // 既にモードが決まっている（ジャンプ中）なら、モーダルをチラ見せしない
    if (step3Mode === 'manual' || step3Mode === 'form') return null;

    // まだ決まっていない（null）時だけ、モーダルを表示する
    return (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <div style={{ filter: 'blur(3px)', opacity: 0.5, pointerEvents: 'none', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <DocumentStep onNext={() => {}} />
            </div>
            <ModeSelectModal />
        </div>
    );
};