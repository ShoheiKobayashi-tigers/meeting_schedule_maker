// src/features/guardian-form/GuardianPortal/GuardianPortal.tsx
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'; // ★ useNavigate を追加
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
  schedule: {
    rows: string[];
    cols: string[];
  };
  settings: {
    className: string;
    message: string;
    limitDate: string | null;
    isOpened: boolean;
  };
}

export const GuardianPortal: React.FC = () => {
  const { workspaceId } = useParams();
  const [searchParams] = useSearchParams(); // setSearchParams は削除
  const navigate = useNavigate();           // ★ 追加

  const tokenFromUrl = searchParams.get('token');
  const stepParam = searchParams.get('step');

  const secretKey = window.location.hash.substring(1); 

  const [inputToken, setInputToken] = useState(''); 
  const [data, setData] = useState<VerifyResponse | null>(null);
  const [selections, setSelections] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [publicInfo, setPublicInfo] = useState<{ 
    class_name: string; 
    message: string; 
    is_opened: boolean;
    event_name: string 
  } | null>(null);

  const lastAttemptedToken = useRef<string | null>(null);
  const lastSuccessToken = useRef<string | null>(null);

  const sortedSchedule = useMemo(() => {
    if (!data) return { rows: [], cols: [] };
    return {
      rows: sortTimeRows(data.schedule.rows),
      cols: sortDateCols(data.schedule.cols)
    };
  }, [data]);

  useEffect(() => {
    if (!secretKey) {
      setError("アクセスURLが正しくありません。\nプリントに記載されたQRコードをもう一度読み取るか、URLを正確に入力してください。");
    }
  }, [secretKey]);

  useEffect(() => {
    if (!secretKey) return; // 鍵がなければ通信しない
    const fetchPublicInfo = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/workspaces/${workspaceId}/public`);
        if (res.ok) {
          const info = await res.json();
          // 取得した表紙情報を secretKey で復号
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
  
  const mapServerDatesToIds = (serverDates: string[], rows: string[], cols: string[]) => {
    const ids: string[] = [];
    serverDates.forEach(dateStr => {
      const firstSpaceIndex = dateStr.indexOf(' ');
      if (firstSpaceIndex === -1) return;
      const datePart = dateStr.substring(0, firstSpaceIndex);
      const timePart = dateStr.substring(firstSpaceIndex + 1);
      const colIndex = cols.indexOf(datePart);
      const rowIndex = rows.indexOf(timePart);
      if (colIndex !== -1 && rowIndex !== -1) {
        ids.push(`${rowIndex}-${colIndex}`);
      }
    });
    return ids;
  };

  const mapIdsToServerDates = (selectedIds: string[], rows: string[], cols: string[]) => {
    return selectedIds.map(id => {
      const [rStr, cStr] = id.split('-');
      const rIndex = parseInt(rStr, 10);
      const cIndex = parseInt(cStr, 10);
      const datePart = cols[cIndex];
      const timePart = rows[rIndex];
      return `${datePart} ${timePart}`;
    });
  };

  const executeLogin = useCallback(async (tokenVal: string, isAutoLogin: boolean = false) => {
    if (!secretKey) return;
    if (data && lastSuccessToken.current === tokenVal) return;
    lastAttemptedToken.current = tokenVal;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/workspaces/${workspaceId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenVal }),
      });
      if (res.status === 401) throw new Error('認証コードが正しくありません');
      if (res.status === 403) throw new Error("現在、回答の受付を停止しています。\n希望される方は、担任までご連絡ください。");
      if (!res.ok) throw new Error('エラーが発生しました');
      
      const json: VerifyResponse = await res.json();

      // ログイン後の設定とスケジュール枠を secretKey で一気に復号
      const decRows = decryptFromCloud(json.schedule.rows as any, secretKey) || json.schedule.rows;
      const decCols = decryptFromCloud(json.schedule.cols as any, secretKey) || json.schedule.cols;
      
      let decDates = [];
      if (typeof json.preferred_dates === 'string') {
         decDates = decryptFromCloud(json.preferred_dates, secretKey) || [];
      } else if (Array.isArray(json.preferred_dates)) {
         decDates = json.preferred_dates;
      }

      const decData: VerifyResponse = {
         ...json,
         preferred_dates: decDates,
         schedule: { rows: decRows, cols: decCols },
         settings: { 
            ...json.settings, 
            className: decryptFromCloud(json.settings.className, secretKey) || json.settings.className,
            message: decryptFromCloud(json.settings.message, secretKey) || json.settings.message 
         }
      };

      setData(decData);
      lastSuccessToken.current = tokenVal;

      if (!isAutoLogin) {
        // ★ 修正: 相対パスでのナビゲーションで確実にハッシュを引き継ぐ
        navigate(`?token=${tokenVal}${window.location.hash}`, { replace: true });
      }

      const sortedRows = sortTimeRows(decData.schedule.rows);
      const sortedCols = sortDateCols(decData.schedule.cols);
      const initialSelections = mapServerDatesToIds(decData.preferred_dates || [], sortedRows, sortedCols);
      setSelections(initialSelections);
    } catch (err: any) {
      console.error("Login Error:", err); // デバッグ用
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, navigate, data, secretKey]); // ★ 依存配列から setSearchParams を除去

  useEffect(() => {
    if (tokenFromUrl) {
      if (tokenFromUrl !== lastAttemptedToken.current) {
        if (data) {
          setData(null);
          setSelections([]);
        }
        if(!loading){
          executeLogin(tokenFromUrl, true);
        }
      }
    } else {
      lastAttemptedToken.current = null;
      lastSuccessToken.current = null;
      if (data) {
        setData(null);
        setSelections([]);
        setInputToken('');
      }
      // ★ ここにあった `setError('');` を削除（エラーの揉み消しを防止）
    }
  }, [tokenFromUrl, data, loading, executeLogin]);

  const handleNextClick = () => {
    if (!inputToken) return;
    executeLogin(inputToken, false);
  };

  const goToConfirm = () => {
    if (!tokenFromUrl) return;
    navigate(`?token=${tokenFromUrl}&step=confirm${window.location.hash}`);
  };

  const backToSelect = () => {
    if (!tokenFromUrl) return;
    navigate(`?token=${tokenFromUrl}${window.location.hash}`);
  };

  const handleSubmit = async () => {
    if (!data || !tokenFromUrl || !secretKey) return;
    setLoading(true);
    const formattedDates = mapIdsToServerDates(selections, sortedSchedule.rows, sortedSchedule.cols);
    
    const encryptedDates = encryptForCloud(formattedDates, secretKey);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/workspaces/${workspaceId}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenFromUrl, preferred_dates: encryptedDates }),
      });
      if (!res.ok) throw new Error('送信に失敗しました。もう一度お試しください。');
      navigate(`?token=${tokenFromUrl}&step=complete${window.location.hash}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (cellId: string) => {
    if (selections.includes(cellId)) {
      setSelections(prev => prev.filter(id => id !== cellId));
    } else {
      setSelections(prev => [...prev, cellId]);
    }
  };

  const handleCloseBrowser = () => {
    window.close();
    alert("画面を閉じて終了してください。");
  };

  const gridData: GridRow[] = useMemo(() => {
    if (sortedSchedule.rows.length === 0) return [];
    return sortedSchedule.rows.map((rowLabel, rIndex) => ({
      rowIndex: rIndex,
      rowLabel: rowLabel,
      cells: sortedSchedule.cols.map((colLabel, cIndex) => ({
        rowIndex: rIndex,
        colIndex: cIndex,
        rowLabel: rowLabel,
        colLabel: colLabel, 
        displayColLabel: formatDisplayDate(colLabel),
        assignment: null,
        status: 'OPEN',
      })),
    }));
  }, [sortedSchedule]);


  // ==========================================
  // ここから下は「見た目（UI）」
  // ==========================================
  const renderSelectCell = (cell: GridCell) => {
    const valueId = `${cell.rowIndex}-${cell.colIndex}`;
    const isSelected = selections.includes(valueId);

    return (
      <div className={isSelected ? s.cellSelected : s.cellSelectable} onClick={() => toggleSelection(valueId)}>
        <div className={s.checkCircle} style={{
          border: isSelected ? 'none' : '2px solid #cbd5e1',
          backgroundColor: isSelected ? '#059669' : '#fff',
        }}>
          {isSelected && '✓'}
        </div>
        <span style={{ fontSize: '11px', marginTop: '6px', color: isSelected ? '#065f46' : '#94a3b8', fontWeight: isSelected ? 'bold' : 'normal' }}>
          {isSelected ? '希望する' : '選択可'}
        </span>
      </div>
    );
  };

  const renderConfirmCell = (cell: GridCell) => {
    const valueId = `${cell.rowIndex}-${cell.colIndex}`;
    const isSelected = selections.includes(valueId);

    if (!isSelected) {
      return (
        <div className={s.cellConfirmDisabled}>-</div>
      );
    }
    return (
      <div className={s.cellConfirmSelected}>
        <span style={{ color: '#047857', fontWeight: 'bold', fontSize: '14px' }}>希望</span>
        <span style={{ fontSize: '10px', color: '#047857' }}>選択済み</span>
      </div>
    );
  };

  const currentStep = (!data || !tokenFromUrl) 
    ? 'LOGIN' 
    : (stepParam === 'confirm' ? 'CONFIRM' : (stepParam === 'complete' ? 'COMPLETE' : 'SELECT'));

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
            onNext={handleNextClick}
            loading={loading}
            error={error}
            isPreview={false}
          />
        )}

        {currentStep === 'SELECT' && (
          <>
            <header className={s.header}>
              <h2 className={s.headerTitle}>希望日程入力</h2>
              <div className={s.selectionBadge}>
                選択中: <strong style={{ color: '#0070f3', fontSize: '1rem' }}>{selections.length}</strong> 枠
              </div>
            </header>
            
            <div className={s.subHeader}>
              ご都合のよい日程を選択してください。（複数選択可）
            </div>

            <div className={s.scrollArea}>
              <ScheduleBaseTable grid={gridData} renderCell={renderSelectCell} />
            </div>

            <footer className={s.footer}>
              <Button variant="outline" onClick={handleCloseBrowser} style={{ flex: 1 }}>閉じる</Button>
              <Button variant="primary" onClick={goToConfirm} disabled={selections.length === 0} style={{ flex: 2 }}>確認画面へ</Button>
            </footer>
          </>
        )}

        {currentStep === 'CONFIRM' && (
          <>
            <div className={s.header}>
              <h2 className={s.headerTitle}>内容確認</h2>
            </div>
            <div className={s.subHeader}>
              以下の内容で送信します。
            </div>
            <div className={s.scrollArea}>
              <ScheduleBaseTable grid={gridData} renderCell={renderConfirmCell} />
            </div>

            <footer className={s.footer}>
              <Button variant="outline" onClick={backToSelect} disabled={loading} style={{ flex: 1 }}>修正する</Button>
              <Button variant="primary" onClick={handleSubmit} disabled={loading} style={{ flex: 2, backgroundColor: '#059669', borderColor: '#059669' }}>
                {loading ? '送信中...' : '送信する'}
              </Button>
            </footer>
          </>
        )}

        {currentStep === 'COMPLETE' && (
          <div className={s.completeContainer}>
            <div style={{ width: '80px', height: '80px', backgroundColor: '#d1fae5', borderRadius: '50%', color: '#059669', fontSize: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              ✓
            </div>
            <h2 style={{ fontSize: '1.5rem', color: '#1e293b', marginBottom: '16px' }}>回答を受け付けました</h2>
            <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '40px' }}>
              ご協力ありがとうございました。<br/>希望日程の送信が完了しました。
            </p>
            <Button variant="outline" onClick={handleCloseBrowser} style={{ width: '100%', padding: '16px' }}>画面を閉じる</Button>
          </div>
        )}

      </div>
    </div>
  );
};