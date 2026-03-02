// src/pages/app/StartPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import * as s from './StartPage.css'; // 🌟 お引っ越ししたCSSファイルを読み込む

export const StartPage: React.FC = () => {
  const navigate = useNavigate(); // 🌟 URL移動用の魔法の杖
  const { db, resetAll, setHasEntered } = useAppStore();
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // 保存されたデータがあるかチェック
    if (db.applicants.length > 0 || db.scheduleData.rows.length > 0) {
      setHasData(true);
    }
  }, [db]);

  const handleContinue = () => {
    setHasEntered(true); 
    // 🌟 Zustandのフラグを立てた後、URLをStep1に移動させる！
    navigate('/app/step1/students');
  };

  const handleNewGame = () => {
    if (hasData) {
      if (!window.confirm("現在保存されているデータは消去されます。よろしいですか？")) {
        return;
      }
    }
    resetAll(); // データ全消去して開始
    setHasEntered(true);
    // 🌟 リセットした後、URLをStep1に移動させる！
    navigate('/app/step1/students');
  };

  return (
    <div className={s.container}>
      <div className={s.card}>
        <h1 className={s.title}>個人面談・三者面談 スケジュールメーカー</h1>
        <p className={s.subtitle}>Meeting Schedule Maker</p>

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