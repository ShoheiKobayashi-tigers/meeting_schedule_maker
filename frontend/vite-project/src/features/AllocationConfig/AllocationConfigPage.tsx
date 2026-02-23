import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../../components/ui/Button/Button';
import * as s from './AllocationConfigPage.css';

export const AllocationConfigPage: React.FC = () => {
  // Store から必要な値を取得
  const { applicants, siblings, autoAssignmentConfig } =
    useAppStore((state) => state.db);
  const { isAllocationConfigOpen } = useAppStore((state) => state.ui);
  const {
    setAutoAssignmentConfig,
    setAllocationConfigOpen,
    saveApplicant,
  } = useAppStore((state) => state);

  if (!isAllocationConfigOpen) return null;

  // 兄弟制限の全体ルールが適用されているか（制限なし:99 以外なら適用中）
  const isGapRuleActive = autoAssignmentConfig.sibling_slot_gap !== 99;

  // フラグの切り替え処理（複数選択不可・排他制御）
  const toggleFlag = (applicantId: string, field: 'is_fixed' | 'is_last_slot' | 'needs_gap_after') => {
    const target = applicants.find(a => a.id === applicantId);
    if (target) {
      const isCurrentlyTrue = !!target[field];
      
      if (isCurrentlyTrue) {
        // すでにオンのものをクリックした場合は、単にそれをオフにする
        saveApplicant({ 
          ...target, 
          [field]: false 
        });
      } else {
        // 新しくオンにする場合は、クリックしたものを true にし、他を強制的に false にする
        saveApplicant({ 
          ...target, 
          is_fixed: field === 'is_fixed',
          is_last_slot: field === 'is_last_slot',
          needs_gap_after: field === 'needs_gap_after'
        });
      }
    }
  };

  return (
    <div className={s.overlay}>
      <div className={s.container}>
        
        {/* ヘッダー */}
        <header className={s.header}>
          <div>
            <h2 className={s.title}>自動割り当て詳細設定</h2>
            <p className={s.description}>
              次回の自動割り当て実行時に優先的に考慮される「全体ルール」と「個別ルール」を設定します。<br/>
              ※ここでチェックを入れた生徒の条件が優先されますが、枠の状況によっては必ずしも希望通りにならない場合があります。
            </p>
          </div>
          <Button variant="cancel" onClick={() => setAllocationConfigOpen(false)}>保存して戻る</Button>
        </header>

        {/* メインコンテンツ（スクロール領域） */}
        <div className={s.mainContent}>
          
          {/* 1. 全体ルール設定エリア */}
          <div className={s.globalSettings}>
            <span className={s.settingLabel}>👨‍👩‍👧‍👦 兄弟・双子の配置間隔ルール:</span>
            <select 
              className={s.select}
              value={autoAssignmentConfig.sibling_slot_gap} // ★Storeの値を反映
              onChange={(e) => setAutoAssignmentConfig({sibling_slot_gap: Number(e.target.value)})}
            >
              <option value={1}>連続（待ち時間なし）</option>
              <option value={2}>待ち時間 1枠分まで許可 (推奨)</option>
              <option value={3}>待ち時間 2枠分まで許可</option>
              <option value={4}>待ち時間 3枠分まで許可</option>
              <option value={99}>制限なし（同じ日ならOK）</option>
            </select>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              ※同じ家族設定を持つ児童同士の割り当て間隔を制御します。
            </span>
          </div>

          {/* 2. 個別ルール設定テーブル */}
          <table className={s.table}>
            <thead>
              <tr>
                <th className={s.th} style={{ width: '60px' }}>No.</th>
                <th className={s.th}>氏名 / 学籍番号</th>
                <th className={s.th} style={{ textAlign: 'center' }}>
                  📌 固定<br/>
                  <span style={{fontWeight:'normal', fontSize:'10px'}}>現在位置から動かさない</span>
                </th>
                <th className={s.th} style={{ textAlign: 'center' }}>
                  🔚 トリ<br/>
                  <span style={{fontWeight:'normal', fontSize:'10px'}}>その日の最後に配置</span>
                </th>
                <th className={s.th} style={{ textAlign: 'center' }}>
                  ☕ 休憩<br/>
                  <span style={{fontWeight:'normal', fontSize:'10px'}}>終了後に1枠空ける</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {applicants.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    登録されている児童がいません
                  </td>
                </tr>
              ) : (
                applicants.map((app, index) => {
                  // ★この生徒が「他クラスの兄弟」または「同クラスの双子」を持っているか判定
                  const hasLinkedSibling = !!app.family_id && (
                    siblings.some(s => s.family_id === app.family_id) || 
                    applicants.filter(a => a.family_id === app.family_id).length > 1
                  );
                  
                  // 兄弟がいて、かつ全体ルールが制限ありの場合、最後枠と休憩のチェックを禁止する
                  const isRestricted = hasLinkedSibling && isGapRuleActive;

                  return (
                    <tr key={app.id} className={s.tr}>
                      <td className={s.td}>{index + 1}</td>
                      <td className={s.td}>
                        <div className={s.nameCell}>
                          <span style={{ fontWeight: 'bold' }}>{app.family_name} {app.first_name}</span>
                          <span className={s.studentId}>{app.student_id}</span>
                          {hasLinkedSibling && (
                            <span style={{fontSize: '10px', color: '#ea580c', marginLeft: '8px'}}>※兄弟あり</span>
                          )}
                        </div>
                      </td>
                      
                      {/* 📌 固定フラグ (これは先生の手動強制上書きなので常に許可) */}
                      <td 
                        className={s.checkCell} 
                        onClick={() => toggleFlag(app.id!, 'is_fixed')}
                        style={{ backgroundColor: app.is_fixed ? '#eff6ff' : undefined }}
                      >
                        <input 
                          type="checkbox" 
                          className={s.checkbox}
                          checked={!!app.is_fixed} 
                          readOnly 
                        />
                      </td>

                      {/* 🔚 最後尾フラグ (制限対象) */}
                      <td 
                        className={s.checkCell} 
                        onClick={() => { if (!isRestricted) toggleFlag(app.id!, 'is_last_slot'); }}
                        style={{ 
                          backgroundColor: isRestricted ? '#f1f5f9' : (app.is_last_slot ? '#f0fdf4' : undefined),
                          cursor: isRestricted ? 'not-allowed' : 'pointer',
                          opacity: isRestricted ? 0.4 : 1
                        }}
                        title={isRestricted ? "兄弟の配置ルールが優先されるため、設定できません" : ""}
                      >
                        <input 
                          type="checkbox" 
                          className={s.checkbox}
                          checked={!!app.is_last_slot} 
                          disabled={isRestricted}
                          readOnly 
                        />
                      </td>

                      {/* ☕ 休憩フラグ (制限対象) */}
                      <td 
                        className={s.checkCell} 
                        onClick={() => { if (!isRestricted) toggleFlag(app.id!, 'needs_gap_after'); }}
                        style={{ 
                          backgroundColor: isRestricted ? '#f1f5f9' : (app.needs_gap_after ? '#fff7ed' : undefined),
                          cursor: isRestricted ? 'not-allowed' : 'pointer',
                          opacity: isRestricted ? 0.4 : 1
                        }}
                        title={isRestricted ? "兄弟の配置ルールが優先されるため、設定できません" : ""}
                      >
                        <input 
                          type="checkbox" 
                          className={s.checkbox}
                          checked={!!app.needs_gap_after}
                          disabled={isRestricted} 
                          readOnly 
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
};