import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useProcessedApplicants } from '../../../hooks/useProcessedApplicants';
import { useCloudSync } from '../hooks/useCloudSync';
import { Button } from '../../../components/ui/Button/Button';
import { ManualInputModal } from '../parts/ManualInputModal';
import * as s from './ManualInputPanel.css';
import * as layout from '../../../styles/layout.css';
import { RefreshCw } from 'lucide-react';

export const ManualInputPanel: React.FC = () => {
  // ソート済みの名簿を取得（名簿順に次へ/前へ進めるため）
  const processedApplicants = useProcessedApplicants();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const location = useLocation();
  const { pullResponses, loading } = useCloudSync();
  const isWebMode = location.pathname.includes('/step3/form/manual');

  // 登録済み人数の計算
  const totalCount = processedApplicants.length;
  const registeredCount = processedApplicants.filter(a => a.preferred_dates && a.preferred_dates.length > 0).length;

  // ナビゲーション関数
  const handleNext = (currentId: string) => {
    const currentIndex = processedApplicants.findIndex(a => a.id === currentId);
    if (currentIndex < processedApplicants.length - 1) {
      setSelectedId(processedApplicants[currentIndex + 1].id!);
    }
  };

  const handlePrev = (currentId: string) => {
    const currentIndex = processedApplicants.findIndex(a => a.id === currentId);
    if (currentIndex > 0) {
      setSelectedId(processedApplicants[currentIndex - 1].id!);
    }
  };

  // 同期ボタンの処理
  const handlePull = async () => {
    const result = await pullResponses();
    if (result.success) alert("最新の回答を取得しました！");
    else alert("取得失敗: " + result.error);
  };

  return (
    <div className={layout.basePanelCard}>
      
      {/* 固定ヘッダー */}
      <div className={layout.panelHeader}>
        <div className={s.headerContent}>
          
          {/* 左側：タイトルのみ */}
          <div className={s.headerLeft}>
            <h3 className={layout.panelTitle} style={{ margin: 0 }}>
              {isWebMode ? '3. 入力状況の確認' : '入力状況の確認'}
            </h3>
          </div>

          {/* 右側：同期ボタン ＋ 進捗バッジ */}
          <div className={s.headerRight}>
            
            {/* 1. 同期ボタン（Webモードの時だけ表示、バッジのすぐ左に配置） */}
            {isWebMode && (
              <Button 
                variant="outline" 
                onClick={handlePull} 
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }} // アイコンと文字の隙間
              >
                {/* 読み込み中は spinningIcon クラスを当てて回す！ */}
                <RefreshCw size={16} className={loading ? s.spinningIcon : ''} />
                {loading ? '取得中...' : '最新の回答を取り込む'}
              </Button>
            )}

            {/* 2. 進捗バッジ（一番右端の定位置） */}
            <div className={s.progressBadge}>
              入力完了: {registeredCount} / {totalCount} 人
            </div>
            
          </div>

        </div>
      </div>
      
      {/* スクロール領域 */}
      <div className={layout.panelScrollArea}>
        {processedApplicants.map(student => {
          const isRegistered = student.preferred_dates && student.preferred_dates.length > 0;
          
          return (
            <div 
              key={student.id} 
              className={layout.listRow} // 共通リスト行スタイル
              onClick={() => setSelectedId(student.id!)}
            >
               <div className={s.studentInfo}>
                 <div className={s.studentName}>
                   <span className={s.studentId}>{student.student_id}.</span> 
                   {student.family_name} {student.first_name}
                 </div>
               </div>
               <div className={s.rightSection}>
                 <div className={s.statusText}>
                   {isRegistered 
                     ? <span style={{color: '#059669', fontWeight: 'bold'}}>✓ 希望 {student.preferred_dates.length} 枠 入力済み</span>
                     : <span style={{color: '#ef4444'}}>未入力</span>}
                 </div>
                </div>
            </div>
          )
        })}
      </div>
      
      {/* モーダルの呼び出し */}
      {selectedId && (
         <ManualInputModal 
            applicantId={selectedId} 
            onClose={() => setSelectedId(null)}
            onNext={() => handleNext(selectedId)}
            onPrev={() => handlePrev(selectedId)}
            hasNext={processedApplicants.findIndex(a => a.id === selectedId) < processedApplicants.length - 1}
            hasPrev={processedApplicants.findIndex(a => a.id === selectedId) > 0}
         />
      )}
    </div>
  );
};