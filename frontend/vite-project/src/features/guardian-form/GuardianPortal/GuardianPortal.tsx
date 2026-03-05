// src/features/guardian-form/GuardianPortal/GuardianPortal.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ScheduleBaseTable, GridRow, GridCell } from '../../../components/ui/ScheduleBaseTable/ScheduleBaseTable';
import { formatDisplayDate } from '../../../hooks/useProcessedSchedule';
import { sortTimeRows, sortDateCols } from '../../../utils/sortUtils';
import { GuardianLoginView } from '../components/GuardianLoginView';
import { Button } from '../../../components/ui/Button/Button';
import { encryptForCloud, decryptFromCloud } from '../../../utils/secureStorage';

import * as s from './GuardianPortal.css';

// --- 型定義 ---
interface VerifyResponse {
  token: string;
  preferred_dates: string[];
  schedule: { rows: string[]; cols: string[]; availability: string[][]; };
  settings: { className: string; message: string; limitDate: string | null; isOpened: boolean; };
}

export const GuardianPortal: React.FC = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // =====================================================================
  // 1. URLを唯一の情報源（Single Source of Truth）として各種パラメータを取得
  // =====================================================================
  const searchParams = new URLSearchParams(location.search);
  const tokenFromUrl = searchParams.get('token');
  const stepParam = searchParams.get('step') || 'SELECT'; // デフォルトはSELECT
  const secretKey = location.hash.substring(1); 

  // =====================================================================
  // 2. ローカル状態（UIの状態保持用）
  // =====================================================================
  const [inputToken, setInputToken] = useState(''); 
  const [data, setData] = useState<VerifyResponse | null>(null);
  const [selections, setSelections] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [publicInfo, setPublicInfo] = useState<{ class_name: string; message: string; is_opened: boolean; event_name: string } | null>(null);

  const sortedSchedule = useMemo(() => {
    if (!data) return { rows: [], cols: [] };
    return { rows: sortTimeRows(data.schedule.rows), cols: sortDateCols(data.schedule.cols) };
  }, [data]);

  // =====================================================================
  // 3. 初回マウント時：表紙情報（クラス名・イベント名など）を取得
  // =====================================================================
  useEffect(() => {
    if (!secretKey) {
      setError("アクセスURLが正しくありません。\nプリントに記載されたQRコードをもう一度読み取るか、URLを正確に入力してください。");
      return;
    }
    const fetchPublicInfo = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/workspaces/${workspaceId}/public`);
        if (res.ok) {
          const info = await res.json();
          // 暗号化キーで復号
          const decClassName = decryptFromCloud(info.class_name, secretKey) || info.class_name;
          const decMessage = decryptFromCloud(info.message, secretKey) || info.message;
          const decEventName = decryptFromCloud(info.event_name, secretKey) || info.event_name;
          setPublicInfo({ ...info, class_name: decClassName, message: decMessage, event_name: decEventName });
          
          if (!info.is_opened) {
            setError("現在、回答の受付を停止しています。\n希望される方は、担任までご連絡ください。");
          }
        }
      } catch (e) {
        console.error("表紙情報の取得に失敗", e);
      }
    };
    fetchPublicInfo();
  }, [workspaceId, secretKey]);

  // =====================================================================
  // 4. トークン監視：URLにトークンが付与/削除された際にAPIを叩く
  // =====================================================================
  useEffect(() => {
    if (!secretKey) return;

    // ▼ブラウザの「戻る」等でURLからトークンが消えた場合、画面を初期化する
    if (!tokenFromUrl) {
      setData(null);
      setSelections([]);
      setError('');
      return;
    }

    // ▼URLにトークンが存在する場合、APIで検証してデータを取得
    let isMounted = true;
    const verifyToken = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/workspaces/${workspaceId}/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenFromUrl }),
        });
        
        if (res.status === 401) throw new Error('認証コードが正しくありません');
        if (res.status === 403) throw new Error("現在、回答の受付を停止しています。");
        if (!res.ok) throw new Error('通信エラーが発生しました');
        
        const json: VerifyResponse = await res.json();

        // 復号処理
        const decRows = decryptFromCloud(json.schedule.rows as any, secretKey) || json.schedule.rows;
        const decCols = decryptFromCloud(json.schedule.cols as any, secretKey) || json.schedule.cols;
        const decAvailability = json.schedule.availability ? (decryptFromCloud(json.schedule.availability as any, secretKey) || json.schedule.availability) : null;
        let decDates = Array.isArray(json.preferred_dates) ? json.preferred_dates : (decryptFromCloud(json.preferred_dates, secretKey) || []);

        const decData: VerifyResponse = {
           ...json,
           preferred_dates: decDates,
           schedule: { rows: decRows, cols: decCols, availability: decAvailability },
           settings: { 
              ...json.settings, 
              className: decryptFromCloud(json.settings.className, secretKey) || json.settings.className,
              message: decryptFromCloud(json.settings.message, secretKey) || json.settings.message 
           }
        };

        if (isMounted) {
          setData(decData);
          // 既存の選択状態を初期化
          const initialIds: string[] = [];
          decDates.forEach((dateStr: string) => {
            const spaceIdx = dateStr.indexOf(' ');
            if (spaceIdx === -1) return;
            const cIdx = sortDateCols(decCols).indexOf(dateStr.substring(0, spaceIdx));
            const rIdx = sortTimeRows(decRows).indexOf(dateStr.substring(spaceIdx + 1));
            if (cIdx !== -1 && rIdx !== -1) initialIds.push(`${rIdx}-${cIdx}`);
          });
          setSelections(initialIds);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message);
          // エラー時は無効なトークンをURLから消し、履歴を残さずにログインへ弾き返す
          navigate(`${location.pathname}${location.hash}`, { replace: true });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // すでにデータを取得済みなら再取得しない
    if (!data || data.token !== tokenFromUrl) {
      verifyToken();
    }

    return () => { isMounted = false; };
  }, [workspaceId, secretKey, tokenFromUrl, location.pathname, location.hash, navigate, data]);


  // =====================================================================
  // 5. 画面遷移アクション（すべてURLの書き換えだけで制御！）
  // =====================================================================

  const handleLoginClick = () => {
    if (!inputToken) return;
    // PUSH遷移（replaceしない）。絶対パス＋ハッシュ維持でバグを防止。
    navigate(`${location.pathname}?token=${inputToken}${location.hash}`);
  };

  const goToConfirm = () => {
    // PUSH遷移。戻るボタンで選択画面に戻れるようにする。
    navigate(`${location.pathname}?token=${tokenFromUrl}&step=confirm${location.hash}`);
  };

  const backToSelect = () => {
    // PUSH遷移。stepパラメータを削ることで選択画面へ戻る。
    navigate(`${location.pathname}?token=${tokenFromUrl}${location.hash}`);
  };

  const handleSubmit = async () => {
    if (!data || !tokenFromUrl || !secretKey) return;
    setLoading(true);
    
    // データ整形と暗号化
    const formattedDates = selections.map(id => {
      const [rStr, cStr] = id.split('-');
      return `${sortedSchedule.cols[parseInt(cStr, 10)]} ${sortedSchedule.rows[parseInt(rStr, 10)]}`;
    });
    const encryptedDates = encryptForCloud(formattedDates, secretKey);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/workspaces/${workspaceId}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenFromUrl, preferred_dates: encryptedDates }),
      });
      if (!res.ok) throw new Error('送信に失敗しました。もう一度お試しください。');
      
      // ★ 完了画面へは REPLACE 遷移。これにより、戻るボタンで確認画面に戻れなくなる。
      navigate(`${location.pathname}?token=${tokenFromUrl}&step=complete${location.hash}`, { replace: true });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (cellId: string) => {
    setSelections(prev => prev.includes(cellId) ? prev.filter(id => id !== cellId) : [...prev, cellId]);
  };

  const handleCloseBrowser = () => {
    window.close();
    alert("画面を閉じて終了してください。");
  };

  // =====================================================================
  // 6. UIレンダリング部分
  // =====================================================================
  const availabilityMap = useMemo(() => {
    const map: Record<string, Record<string, string>> = {};
    if (!data?.schedule) return map;

    data.schedule.rows.forEach((rowLabel, rIdx) => {
      map[rowLabel] = {};
      data.schedule.cols.forEach((colLabel, cIdx) => {
        // 元の配列からステータスを取得（なければOPEN）
        map[rowLabel][colLabel] = data.schedule.availability?.[rIdx]?.[cIdx] || 'OPEN';
      });
    });
    return map;
  }, [data]);  
  
  const gridData: GridRow[] = useMemo(() => {
    if (sortedSchedule.rows.length === 0) return [];
    return sortedSchedule.rows.map((rowLabel, rIndex) => ({
      rowIndex: rIndex,
      rowLabel: rowLabel,
      cells: sortedSchedule.cols.map((colLabel, cIndex) => {
        const status = availabilityMap[rowLabel]?.[colLabel] || "OPEN";
        return {
          rowIndex: rIndex,
          colIndex: cIndex,
          rowLabel: rowLabel,
          colLabel: colLabel,
          displayColLabel: formatDisplayDate(colLabel),
          assignment: null,
          status: status,
        };
      }),
    }));
  }, [sortedSchedule]);

const renderSelectCell = (cell: GridCell) => {
    // 1. ブロックされているかどうかの判定
    const isBlocked = cell.status === 'admin_block' || cell.status === 'BLOCKED';

    // 2. ブロック時の表示（早期リターン。onClickがないためクリックしても何も起きません）
    if (isBlocked) {
      return (
        <div className={s.cellRecipe({ state: 'blocked' })}>
          <span className={s.blockedCrossLabel}>×</span>
        </div>
      );
    }

    // 3. 選択可能な場合の表示
    const valueId = `${cell.rowIndex}-${cell.colIndex}`;
    const isSelected = selections.includes(valueId);
    const state = isSelected ? 'selected' : 'default';

    return (
      <div className={s.cellRecipe({ state })} onClick={() => toggleSelection(valueId)}>
        <div className={s.checkCircleRecipe({ isSelected })}>
          {isSelected && '✓'}
        </div>
        <span className={s.cellTextRecipe({ isSelected })}>
          {isSelected ? '希望する' : '選択可'}
        </span>
      </div>
    );
  };

  const renderConfirmCell = (cell: GridCell) => {
    const valueId = `${cell.rowIndex}-${cell.colIndex}`;
    const isSelected = selections.includes(valueId);
    if (!isSelected) return <div className={s.cellConfirmDisabled}>-</div>;
    return (
      <div className={s.cellConfirmSelected}>
        <span className={s.confirmLabelMain}>希望</span>
        <span className={s.confirmLabelSub}>選択済み</span>
      </div>
    );
  };

  // 表示するステップの判定 (URLのパラメータだけで一意に決まる)
  const currentStep = (!data || !tokenFromUrl) ? 'LOGIN' : stepParam;

  return (
    <div className={s.pageContainer}>
      <div className={s.mainContent}>

        {currentStep === 'LOGIN' && (
          <GuardianLoginView
            hasInfo={!!publicInfo}
            eventName={publicInfo?.event_name || ''}
            classNameStr={publicInfo?.class_name || ''}
            message={publicInfo?.message || ''}
            inputToken={inputToken}
            onTokenChange={setInputToken}
            onNext={handleLoginClick} 
            loading={loading}
            error={error}
          />
        )}

        {currentStep === 'SELECT' && (
          <>
            <header className={s.header}>
              <h2 className={s.headerTitle}>希望日程入力</h2>
              <div className={s.selectionBadge}>選択中: <strong style={{ color: '#0070f3', fontSize: '1rem' }}>{selections.length}</strong> 枠</div>
            </header>
            <div className={s.subHeader}>ご都合のよい日程を選択してください。（複数選択可）</div>
            <div className={s.scrollArea}><ScheduleBaseTable grid={gridData} renderCell={renderSelectCell} /></div>
            <footer className={s.footer}>
              <Button variant="outline" onClick={handleCloseBrowser} style={{ flex: 1 }}>閉じる</Button>
              <Button variant="primary" onClick={goToConfirm} disabled={selections.length === 0} style={{ flex: 2 }}>確認画面へ</Button>
            </footer>
          </>
        )}

        {currentStep === 'confirm' && (
          <>
            <div className={s.header}><h2 className={s.headerTitle}>内容確認</h2></div>
            <div className={s.subHeader}>以下の内容で送信します。</div>
            <div className={s.scrollArea}><ScheduleBaseTable grid={gridData} renderCell={renderConfirmCell} /></div>
            <footer className={s.footer}>
              <Button variant="outline" onClick={backToSelect} disabled={loading} style={{ flex: 1 }}>修正する</Button>
              <Button variant="primary" onClick={handleSubmit} disabled={loading} style={{ flex: 2, backgroundColor: '#059669', borderColor: '#059669' }}>
                {loading ? '送信中...' : '送信する'}
              </Button>
            </footer>
          </>
        )}

        {currentStep === 'complete' && (
          <div className={s.completeContainer}>
            <div className={s.completeIconWrapper}>✓</div>
            <h2 className={s.completeTitle}>回答を受け付けました</h2>
            <p className={s.completeDescription}>
              ご協力ありがとうございました。<br/>希望日程の送信が完了しました。
            </p>
            <div className={s.completeButton}>
              <Button variant="outline" onClick={handleCloseBrowser}>画面を閉じる</Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};