// features/ParentForm/components/GuardianLoginView.tsx
import React from 'react';

interface Props {
  // 表示データ
  hasInfo: boolean; // publicInfoが存在するかどうか
  eventName: string;
  classNameStr: string;
  message: string;
  
  // 入力・操作
  inputToken: string;
  onTokenChange: (val: string) => void;
  onNext: () => void;
  
  // 状態
  loading: boolean;
  error: string;
  
  // プレビュー用フラグ (trueの場合、余白調整や入力無効化を行う)
  isPreview?: boolean;
}

export const GuardianLoginView: React.FC<Props> = ({
  hasInfo,
  eventName,
  classNameStr,
  message,
  inputToken,
  onTokenChange,
  onNext,
  loading,
  error,
  isPreview = false,
}) => {
  return (
    <div style={{ 
      maxWidth: '400px', 
      // プレビュー時はスマホ枠内に収めるため余白(80px)をなくす
      margin: isPreview ? '0 auto' : '80px auto', 
      padding: '24px', 
      textAlign: 'center', 
      fontFamily: 'sans-serif',
      // プレビューの背景色に合わせるため、明示的に白背景を指定（元のCSSは親に依存していたが安全のため）
      backgroundColor: '#fff', 
      borderRadius: isPreview ? '0' : '0', // 必要に応じて調整
      boxSizing: 'border-box',
      width: '100%'
    }}>
      {hasInfo && (
          <div style={{ marginBottom: '32px' }}>
              <h1 style={{ fontSize: '24px', color: '#333' }}>{eventName}希望日程回答フォーム</h1>
              <h2 style={{ fontSize: '20px', color: '#333' }}>本校{classNameStr}の保護者の皆様</h2>
              <div style={{ 
                  fontSize: '14px', color: '#666', textAlign: 'left', 
                  background: '#f8fafc', padding: '16px', borderRadius: '8px', marginTop: '16px',
                  whiteSpace: 'pre-wrap' 
              }}>
                  {message}
              </div>
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
            // プレビュー時は入力を受け付けない（または親で制御）
            onChange={e => onTokenChange(e.target.value.toUpperCase())}
            placeholder="A1B2C3"
            readOnly={isPreview}
            style={{ 
              fontSize: '28px', padding: '12px', width: '200px', textAlign: 'center', 
              letterSpacing: '4px', marginBottom: '24px', border: '2px solid #e2e8f0', borderRadius: '8px',
              outline: 'none',
              backgroundColor: isPreview ? '#f5f5f5' : '#fff', // プレビュー時は少しグレーにして入力不可感を出す
              color: '#333'
            }}
          />
          <br />
          <button 
            onClick={onNext} 
            // プレビュー時はボタンを押せないようにする
            disabled={loading || inputToken.length < 6 || isPreview}
            style={{ 
              padding: '14px 40px', fontSize: '16px', fontWeight: 'bold',
              backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '30px', 
              cursor: isPreview ? 'default' : 'pointer', 
              opacity: (loading || isPreview) ? 0.7 : 1,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            次へ進む
          </button>
        </>
      )}
      {error && (
        <p style={{ 
          color: '#e53e3e', marginTop: '20px', fontWeight: 'bold', 
          backgroundColor: '#fff5f5', padding: '10px', borderRadius: '4px', 
          whiteSpace: 'pre-wrap' 
        }}>
          {error}
        </p>
      )}
    </div>
  );
};