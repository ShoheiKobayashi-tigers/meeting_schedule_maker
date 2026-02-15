// features/BulkSetup/components/GuardianPortal.tsx

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ScheduleBaseTable, { GridRow, GridCell } from '../../../components/ui/ScheduleBaseTable/ScheduleBaseTable';
import { formatDisplayDate } from '../../../hooks/useProcessedSchedule';
import { sortTimeRows, sortDateCols } from '../../../utils/sortUtils';

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
  const [searchParams, setSearchParams] = useSearchParams();

  const tokenFromUrl = searchParams.get('token');
  const stepParam = searchParams.get('step'); // 'confirm' | 'complete' | null

  // --- State ---
  const [inputToken, setInputToken] = useState(''); 
  const [data, setData] = useState<VerifyResponse | null>(null);
  const [selections, setSelections] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 公開情報を保持するStateを追加
  const [publicInfo, setPublicInfo] = useState<{ 
    class_name: string; 
    message: string; 
    is_opened: boolean;
    event_name: string 
  } | null>(null);

  // ★修正1: 「最後に試行したトークン」を記録するRefに変更
  // (成功・失敗問わず、一度アクセスしたら記録してループを防ぐ)
  const lastAttemptedToken = useRef<string | null>(null);
  
  // 成功状態の管理用（データ保持チェック用）
  const lastSuccessToken = useRef<string | null>(null);

  // ★重要: サーバーデータをソートして使用するための useMemo
  // これにより、管理画面と同様に日付・時間が昇順で表示されます
  const sortedSchedule = useMemo(() => {
    if (!data) return { rows: [], cols: [] };

    return {
      // 時間文字列 ("09:00 - 09:15") を開始時刻順にソート
      rows: sortTimeRows(data.schedule.rows),
      // ISO日付文字列 ("2025-12-01") をカレンダー順にソート
      cols: sortDateCols(data.schedule.cols)
    };
  }, [data]);

  // 初回マウント時に「表紙情報」を取得
  useEffect(() => {
    const fetchPublicInfo = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/workspaces/${workspaceId}/public`);
        if (res.ok) {
          const info = await res.json();
          setPublicInfo(info);
        }
      } catch (e) {
        console.error("表紙情報の取得に失敗", e);
      }
    };
    fetchPublicInfo();
  }, [workspaceId]);
  
  // --- Helpers: フォーマット変換ロジック ---

  // 1. 受信時: "YYYY-MM-DD HH:mm - HH:mm" -> "row-col"
  const mapServerDatesToIds = (serverDates: string[], rows: string[], cols: string[]) => {
    const ids: string[] = [];
    serverDates.forEach(dateStr => {
      // 文字列を "日付" と "時間帯" に分割
      // 例: "2026-03-20 10:00 - 10:30" -> date="2026-03-20", time="10:00 - 10:30"
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

  // 2. 送信時: "row-col" -> "YYYY-MM-DD HH:mm - HH:mm"
  const mapIdsToServerDates = (selectedIds: string[], rows: string[], cols: string[]) => {
    return selectedIds.map(id => {
      const [rStr, cStr] = id.split('-');
      const rIndex = parseInt(rStr, 10);
      const cIndex = parseInt(cStr, 10);
      
      const datePart = cols[cIndex]; // "2026-03-20"
      const timePart = rows[rIndex]; // "10:00 - 10:30"
      
      // Zustandの形式に合わせて結合
      return `${datePart} ${timePart}`;
    });
  };

  // --- Core Logic: URLの変更を検知してログイン/ログアウトを制御 ---

  // ログイン処理（API実行）
  const executeLogin = useCallback(async (tokenVal: string, isAutoLogin: boolean = false) => {
    // すでにデータ取得済みなら何もしない（React.Strictmode対策など）
    if (data && lastSuccessToken.current === tokenVal) return;

    // ★修正2: 処理開始時に「試行済み」として記録する
    // これにより、API処理中に loading が変化して useEffect が走っても
    // 「同じトークンだから」と無視され、ループが止まる
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
      if (res.status === 403) throw new Error('現在、回答の受付を停止しています');
      if (!res.ok) throw new Error('エラーが発生しました');
      
      const json: VerifyResponse = await res.json();
      
      // --- 成功時の処理 ---
      setData(json);
      lastSuccessToken.current = tokenVal;

      // ★重要: 成功したタイミングでのみ URL を更新する
      // (すでにURLにある場合は書き換えないようにして、履歴の重複を防ぐ)
      if (!isAutoLogin) {
        setSearchParams({ token: tokenVal });
      }

      // ★注意: json.schedule.rows/cols は未ソートのため直接使わず、
      // ここで即座にソートして初期値計算に使う
      const sortedRows = sortTimeRows(json.schedule.rows);
      const sortedCols = sortDateCols(json.schedule.cols);

      const initialSelections = mapServerDatesToIds(
        json.preferred_dates || [],
        sortedRows, // ソート済みを使用
        sortedCols  // ソート済みを使用
      );
      setSelections(initialSelections);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [workspaceId, setSearchParams, data]); // dataを依存に追加

  // URLのトークンが変わった時の副作用を定義
  useEffect(() => {
    if (tokenFromUrl) {
      // ★修正3: 「最後に試みたトークン」と比較する
      if (tokenFromUrl !== lastAttemptedToken.current) {
        
        // URLが変わったので、古いデータがあれば破棄して不整合を防ぐ
        if (data) {
          setData(null);
          setSelections([]);
        }
        if(!loading){
          executeLogin(tokenFromUrl, true); // true = 自動ログイン
        }
      }
    } else {
      // トークンがURLから消えた場合のリセット
      // (次に同じトークンを入れても反応するようにRefもリセット)
      lastAttemptedToken.current = null;
      lastSuccessToken.current = null;
      
      if (data) {
        setData(null);
        setSelections([]);
        setInputToken('');
      }
      setError('');
    }
  }, [tokenFromUrl, data, loading, executeLogin]);


  // --- UI Handlers ---

  // 「次へ進む」ボタン: 単にURLを変更するだけ（あとはuseEffectがやる）
  const handleNextClick = () => {
    if (!inputToken) return;
    // URL変更(setSearchParams)は行わず、APIを叩きに行く
    executeLogin(inputToken, false); // false = 手動ログイン
  };

  const goToConfirm = () => {
    if (!tokenFromUrl) return;
    // step=confirm を付与して履歴に追加
    setSearchParams({ token: tokenFromUrl, step: 'confirm' });
  };

  const backToSelect = () => {
    if (!tokenFromUrl) return;
    // stepパラメータを削除（＝SELECT画面へ戻る）
    setSearchParams({ token: tokenFromUrl });
  };

  const handleSubmit = async () => {
    if (!data || !tokenFromUrl) return;
    setLoading(true);
    
    // ★ここで UI用のIDを サーバー形式の日付に変換して送信
    const formattedDates = mapIdsToServerDates(
      selections,
      sortedSchedule.rows,
      sortedSchedule.cols
    );

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/workspaces/${workspaceId}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: tokenFromUrl,
          preferred_dates: formattedDates
        }),
      });

      if (!res.ok) throw new Error('送信に失敗しました。もう一度お試しください。');
      
      // 完了画面へ（step=complete）
      setSearchParams({ token: tokenFromUrl, step: 'complete' });

    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const toggleSelection = (cellId: string) => {
    if (selections.includes(cellId)) {
      setSelections(prev => prev.filter(id => id !== cellId));
    } else {
      setSelections(prev => [...prev, cellId]);
    }
  };

  const handleCloseBrowser = () => {
    window.close(); // 効かない場合が多い
    alert("画面を閉じて終了してください。");
  };

  // --- Grid Generation ---
  const gridData: GridRow[] = useMemo(() => {
    // dataが無くても sortedSchedule は {rows:[], cols:[]} を返すので安全
    if (sortedSchedule.rows.length === 0) return [];
    
    // ★ sortedSchedule.rows/cols を使用してグリッドを生成
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


  // --- Render Helpers ---

  // A. 選択画面用のセル（クリック可能）
  const renderSelectCell = (cell: GridCell) => {
    const valueId = `${cell.rowIndex}-${cell.colIndex}`;
    const isSelected = selections.includes(valueId);

    return (
      <div 
        onClick={() => toggleSelection(valueId)}
        style={{
          height: '100%', width: '100%', minHeight: '60px',
          cursor: 'pointer',
          backgroundColor: isSelected ? '#d1fae5' : 'transparent',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          borderRadius: '4px',
          transition: 'all 0.2s ease',
          userSelect: 'none'
        }}
      >
        <div style={{
          width: '28px', height: '28px',
          borderRadius: '50%',
          border: isSelected ? 'none' : '2px solid #cbd5e1',
          backgroundColor: isSelected ? '#059669' : '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '16px', fontWeight: 'bold'
        }}>
          {isSelected && '✓'}
        </div>
        <span style={{ fontSize: '11px', marginTop: '6px', color: isSelected ? '#065f46' : '#94a3b8', fontWeight: isSelected ? 'bold' : 'normal' }}>
          {isSelected ? '希望する' : '選択可'}
        </span>
      </div>
    );
  };

  // B. 確認画面用のセル（読み取り専用・ハイライト表示）
  const renderConfirmCell = (cell: GridCell) => {
    const valueId = `${cell.rowIndex}-${cell.colIndex}`;
    const isSelected = selections.includes(valueId);

    // 選択されていないセルは薄くする
    if (!isSelected) {
      return (
        <div style={{ 
          height: '100%', width: '100%', minHeight: '60px', 
          backgroundColor: '#f8fafc', color: '#cbd5e1',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px'
        }}>
          -
        </div>
      );
    }

    // 選択されたセルは強調表示
    return (
      <div style={{
        height: '100%', width: '100%', minHeight: '60px',
        backgroundColor: '#d1fae5', 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        borderRadius: '4px', border: '1px solid #10b981'
      }}>
        <span style={{ color: '#047857', fontWeight: 'bold', fontSize: '14px' }}>希望</span>
        <span style={{ fontSize: '10px', color: '#047857' }}>選択済み</span>
      </div>
    );
  };

  // --- Views ---

  // 現在のステップをURLから判定
  // dataがない、またはtokenがない場合は強制的にLOGIN（ローディング含む）
  const currentStep = (!data || !tokenFromUrl) 
    ? 'LOGIN' 
    : (stepParam === 'confirm' ? 'CONFIRM' 
        : (stepParam === 'complete' ? 'COMPLETE' : 'SELECT'));

  // 1. ログイン画面
  if (currentStep === 'LOGIN') {
    return (
      <div style={{ maxWidth: '400px', margin: '80px auto', padding: '24px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        {publicInfo && (
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '24px', color: '#333' }}>{publicInfo.event_name}希望日程回答フォーム</h1>
                <h2 style={{ fontSize: '20px', color: '#333' }}>本校{publicInfo.class_name}の保護者の皆様</h2>
                <div style={{ 
                    fontSize: '14px', color: '#666', textAlign: 'left', 
                    background: '#f8fafc', padding: '16px', borderRadius: '8px', marginTop: '16px',
                    whiteSpace: 'pre-wrap' 
                }}>
                    {publicInfo.message}
                </div>
                {!publicInfo.is_opened && (
                    <p style={{ color: 'red', fontWeight: 'bold', marginTop: '16px' }}>
                        ※現在、回答の受付を停止しています。希望される方は、担任までご連絡ください。
                    </p>
                )}
            </div>
        )}
        
        {loading ? (
           <div style={{ marginTop: '40px', color: '#666' }}>
             データを読み込んでいます...
           </div>
        ) : (
          <>
            <input 
              type="text" 
              value={inputToken}
              onChange={e => setInputToken(e.target.value.toUpperCase())}
              placeholder="A1B2C3"
              style={{ 
                fontSize: '28px', padding: '12px', width: '200px', textAlign: 'center', 
                letterSpacing: '4px', marginBottom: '24px', border: '2px solid #e2e8f0', borderRadius: '8px',
                outline: 'none'
              }}
            />
            <br />
            <button 
              onClick={handleNextClick} 
              disabled={loading || inputToken.length < 6}
              style={{ 
                padding: '14px 40px', fontSize: '16px', fontWeight: 'bold',
                backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '30px', 
                cursor: 'pointer', opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
            >
              次へ進む
            </button>
          </>
        )}
        {error && <p style={{ color: '#e53e3e', marginTop: '20px', fontWeight: 'bold', backgroundColor: '#fff5f5', padding: '10px', borderRadius: '4px' }}>{error}</p>}
      </div>
    );
  }

  // 2. 日程選択画面
  if (currentStep === 'SELECT') {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
        <header style={{ padding: '16px 20px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h2 style={{ margin: 0, fontSize: '18px', color: '#1e293b' }}>希望日程入力</h2>
          <div style={{ fontSize: '14px', color: '#64748b', backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '20px' }}>
            選択中: <strong style={{ color: '#0070f3', fontSize: '16px' }}>{selections.length}</strong> 枠
          </div>
        </header>

        {data?.settings.message && (
          <div style={{ padding: '16px 20px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', fontSize: '14px', lineHeight: '1.6', color: '#334155' }}>
            ご都合のよい日程を選択してください。（複数選択可）
          </div>
        )}

        <div style={{ flex: 1, overflow: 'auto', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <ScheduleBaseTable 
            grid={gridData} 
            renderCell={renderSelectCell} 
          />
        </div>

        <footer style={{ padding: '16px 20px', backgroundColor: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '16px', boxShadow: '0 -4px 6px rgba(0,0,0,0.02)' }}>
          <button 
            onClick={handleCloseBrowser}
            style={{ 
              flex: 1, padding: '14px', 
              backgroundColor: '#fff', color: '#64748b', border: '2px solid #e2e8f0',
              borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' 
            }}
          >
            閉じる
          </button>
          
          <button 
            onClick={goToConfirm} // URLを変更
            disabled={selections.length === 0}
            style={{ 
              flex: 1, padding: '14px', backgroundColor: selections.length > 0 ? '#0070f3' : '#cbd5e1', 
              color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold',
              cursor: selections.length > 0 ? 'pointer' : 'not-allowed'
            }}
          >
            確認画面へ
          </button>
        </footer>
      </div>
    );
  }

  // 3. 確認画面
  if (currentStep === 'CONFIRM') {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
        <header style={{ padding: '20px', backgroundColor: 'white', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>内容確認</h2>
          <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '14px' }}>
            以下の内容で送信します。よろしければ「送信する」を押してください。
          </p>
        </header>

        <div style={{ flex: 1, overflow: 'auto', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          {/* 確認用レンダラーを使ったテーブル表示 */}
          <ScheduleBaseTable 
            grid={gridData} 
            renderCell={renderConfirmCell} 
          />
        </div>

        <footer style={{ padding: '16px 20px', backgroundColor: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '16px', boxShadow: '0 -4px 6px rgba(0,0,0,0.02)' }}>
          <button 
            onClick={backToSelect} // URLのstepを消して戻る
            disabled={loading}
            style={{ 
              flex: 1, padding: '14px', 
              backgroundColor: '#fff', color: '#64748b', border: '2px solid #e2e8f0',
              borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' 
            }}
          >
            修正する
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            style={{ 
              flex: 1, padding: '14px', 
              backgroundColor: '#059669', color: 'white', 
              border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(5, 150, 105, 0.2)',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? '送信中...' : '送信する'}
          </button>
        </footer>
      </div>
    );
  }

  // 4. 完了画面
  if (currentStep === 'COMPLETE') {
    return (
      <div style={{ padding: '60px 20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: '#d1fae5', borderRadius: '50%', color: '#059669', fontSize: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          ✓
        </div>
        <h2 style={{ fontSize: '24px', color: '#1e293b', marginBottom: '16px' }}>回答を受け付けました</h2>
        <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '40px' }}>
          ご協力ありがとうございました。<br/>
          希望日程の送信が完了しました。
        </p>
        
        <button 
          onClick={handleCloseBrowser} 
          style={{ 
            padding: '16px 48px', backgroundColor: '#334155', color: 'white', 
            border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' 
          }}
        >
          画面を閉じる
        </button>
      </div>
    );
  }

  return null;
};