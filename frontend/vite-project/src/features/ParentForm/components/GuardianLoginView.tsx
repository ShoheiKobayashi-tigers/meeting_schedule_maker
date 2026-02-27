import React from 'react';
import { Button } from '../../../components/ui/Button/Button';
import * as s from './GuardianLoginView.css';

interface Props {
  hasInfo: boolean;
  eventName: string;
  classNameStr: string;
  message: string;
  inputToken: string;
  onTokenChange: (val: string) => void;
  onNext: () => void;
  loading: boolean;
  error: string;
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
    <div className={isPreview ? s.previewContainer : s.normalContainer}>
      
      {hasInfo && (
        <div style={{ marginBottom: '32px' }}>
          <h1 className={s.infoTitle}>
            <span style={{ fontSize: '1.2rem' }}>🗓️</span> {eventName}
          </h1>
          <h2 style={{ fontSize: '1rem', color: '#334155', margin: 0 }}>
            対象: {classNameStr} の保護者の皆様
          </h2>
          <div className={s.infoCard} style={{ marginTop: '16px' }}>
            <div className={s.messageBox}>
              {message}
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
         <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
           データを読み込んでいます...
         </div>
      ) : (
        <div className={s.inputGroup}>
          <label className={s.label}>お子様の認証コード</label>
          <input 
            type="text" 
            className={isPreview ? s.inputPreview : s.input}
            value={inputToken}
            onChange={e => onTokenChange(e.target.value.toUpperCase())}
            placeholder="A1B2C3"
            readOnly={isPreview}
          />
          <div style={{ marginTop: '16px', width: '100%', maxWidth: '240px' }}>
            <Button 
              variant="primary" 
              onClick={onNext} 
              disabled={loading || inputToken.length < 6 || isPreview}
              style={{ width: '100%', padding: '16px', borderRadius: '30px' }} // ここだけ丸みを持たせる
            >
              次へ進む
            </Button>
          </div>
        </div>
      )}
      
      {error && (
        <div className={s.errorMessage}>
          {error}
        </div>
      )}
      
    </div>
  );
};