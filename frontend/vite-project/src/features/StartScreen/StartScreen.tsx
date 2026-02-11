import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import * as s from './StartScreen.css'; // cssファイルは後述

export const StartScreen: React.FC = () => {
  const { db, resetAll, setSessionActive } = useAppStore();
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // 保存されたデータがあるかチェック（例: 生徒データが1件以上あるか）
    if (db.applicants.length > 0 || db.scheduleData.rows.length > 0) {
      setHasData(true);
    }
  }, [db]);

  const handleContinue = () => {
    setSessionActive(); // 状態維持のままフラグだけON
  };

  const handleNewGame = () => {
    if (hasData) {
      if (!window.confirm("現在保存されているデータは消去されます。よろしいですか？")) {
        return;
      }
    }
    resetAll(); // データ全消去して開始
  };

  return (
    <div className={s.container}>
      <div className={s.card}>
        <h1 className={s.title}>面談スケジュール調整システム</h1>
        <p className={s.subtitle}>Guardian Schedule Manager</p>

        <div className={s.buttonGroup}>
          <button 
            className={s.continueButton} 
            onClick={handleContinue}
            disabled={!hasData}
          >
            前回の続きから再開
            {hasData && <span className={s.dataInfo}>（データあり）</span>}
          </button>

          <button 
            className={s.newButton} 
            onClick={handleNewGame}
          >
            新しく始める
          </button>
        </div>
        
        {!hasData && (
          <p className={s.note}>※保存されたデータが見つかりませんでした。「新しく始める」を選択してください。</p>
        )}
      </div>
    </div>
  );
};