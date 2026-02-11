import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ScheduleBaseTable, { GridRow, GridCell } from '../../../components/ui/ScheduleBaseTable/ScheduleBaseTable';
import { formatDisplayDate } from '../../../hooks/useProcessedSchedule';

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

  // --- State ---
  const [step, setStep] = useState<'LOGIN' | 'SELECT' | 'CONFIRM' | 'COMPLETE'>('LOGIN');
  const [inputToken, setInputToken] = useState('');
  const [data, setData] = useState<VerifyResponse | null>(null);
  const [selections, setSelections] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  // --- API Actions ---
  
  // 1. ログイン
  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/workspaces/${workspaceId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: inputToken }),
      });

      if (res.status === 401) throw new Error('認証コードが正しくありません');
      if (res.status === 403) throw new Error('現在、回答の受付を停止しています');
      if (!res.ok) throw new Error('エラーが発生しました');
      
      const json: VerifyResponse = await res.json();
      setData(json);

      // ★ここでサーバー形式の日付を UI用のIDに変換してセット
      const initialSelections = mapServerDatesToIds(
        json.preferred_dates || [],
        json.schedule.rows,
        json.schedule.cols
      );
      setSelections(initialSelections);

      setStep('SELECT');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. 送信ロジック
  const handleSubmit = async () => {
    if (!data) return;
    setLoading(true);
    
    // ★ここで UI用のIDを サーバー形式の日付に変換して送信
    const formattedDates = mapIdsToServerDates(
      selections,
      data.schedule.rows,
      data.schedule.cols
    );

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/workspaces/${workspaceId}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: data.token,
          preferred_dates: formattedDates // 変換済みデータを送る
        }),
      });

      if (!res.ok) throw new Error('送信に失敗しました。もう一度お試しください。');
      
      setStep('COMPLETE');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Grid Generation ---
  const gridData: GridRow[] = useMemo(() => {
    if (!data) return [];
    
    return data.schedule.rows.map((rowLabel, rIndex) => ({
      rowIndex: rIndex,
      rowLabel: rowLabel,
      cells: data.schedule.cols.map((colLabel, cIndex) => ({
        rowIndex: rIndex,
        colIndex: cIndex,
        rowLabel: rowLabel,
        colLabel: colLabel, 
        displayColLabel: formatDisplayDate(colLabel),
        assignment: null,
        status: 'OPEN',
      })),
    }));
  }, [data]);

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

  // 1. ログイン画面
  if (step === 'LOGIN') {
    return (
      <div style={{ maxWidth: '400px', margin: '80px auto', padding: '24px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h3 style={{ marginBottom: '24px', color: '#333' }}>保護者用ページ</h3>
        <p style={{ color: '#666', marginBottom: '16px' }}>お便りに記載された6桁の認証コードを入力してください。</p>
        
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
          onClick={handleLogin} 
          disabled={loading || inputToken.length < 6}
          style={{ 
            padding: '14px 40px', fontSize: '16px', fontWeight: 'bold',
            backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '30px', 
            cursor: 'pointer', opacity: loading ? 0.7 : 1,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          {loading ? '確認中...' : '次へ進む'}
        </button>
        {error && <p style={{ color: '#e53e3e', marginTop: '20px', fontWeight: 'bold', backgroundColor: '#fff5f5', padding: '10px', borderRadius: '4px' }}>{error}</p>}
      </div>
    );
  }

  // 2. 日程選択画面
  if (step === 'SELECT') {
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
            {data.settings.message}
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
            onClick={() => setStep('CONFIRM')}
            style={{ 
              flex: 1, padding: '14px', 
              backgroundColor: selections.length > 0 ? '#0070f3' : '#cbd5e1', 
              color: 'white', 
              border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold',
              cursor: selections.length > 0 ? 'pointer' : 'not-allowed',
              boxShadow: selections.length > 0 ? '0 4px 6px rgba(0,112,243,0.2)' : 'none'
            }}
            disabled={selections.length === 0}
          >
            確認画面へ
          </button>
        </footer>
      </div>
    );
  }

  // 3. 確認画面
  if (step === 'CONFIRM') {
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
            onClick={() => setStep('SELECT')} 
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
  if (step === 'COMPLETE') {
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