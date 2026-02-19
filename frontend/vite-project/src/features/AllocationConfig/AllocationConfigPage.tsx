import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import Button from '../../components/ui/Button/Button';
import * as s from './AllocationConfigPage.css';

export const AllocationConfigPage: React.FC = () => {
  // Store から必要な値を取得
  const isOpen = useAppStore((state) => state.isAllocationConfigOpen);
  const setOpen = useAppStore((state) => state.setAllocationConfigOpen);
  
  const applicants = useAppStore((state) => state.db.applicants);
  const saveApplicant = useAppStore((state) => state.saveApplicant);
  // ※本来は schoolSettings の状態もここに入れますが、まだストアにない場合は一旦固定値にします。
  // const schoolSettings = useAppStore((state) => state.db.schoolSettings);
  // const setSchoolSettings = useAppStore((state) => state.setSchoolSettings);

  if (!isOpen) return null;

  // フラグの切り替え処理
  const toggleFlag = (applicantId: string, field: 'is_fixed' | 'is_last_slot' | 'needs_gap_after') => {
    const target = applicants.find(a => a.id === applicantId);
    if (target) {
      saveApplicant({ 
        ...target, 
        [field]: !target[field] 
      });
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
          <Button variant="cancel" onClick={() => setOpen(false)}>保存して戻る</Button>
        </header>

        {/* メインコンテンツ（スクロール領域） */}
        <div className={s.mainContent}>
          
          {/* 1. 全体ルール設定エリア */}
          <div className={s.globalSettings}>
            <span className={s.settingLabel}>👨‍👩‍👧‍👦 兄弟・双子の配置間隔ルール:</span>
            <select 
              className={s.select}
              defaultValue={2} // Storeに連携するまでは初期値2
              // onChange={(e) => setSchoolSettings({...schoolSettings, sibling_slot_gap: Number(e.target.value)})}
            >
              <option value={0}>連続（隙間なし）のみ許可</option>
              <option value={1}>前後 1枠まで許可</option>
              <option value={2}>前後 2枠まで許可 (推奨)</option>
              <option value={3}>前後 3枠まで許可</option>
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
                applicants.map((app, index) => (
                  <tr key={app.id} className={s.tr}>
                    <td className={s.td}>{index + 1}</td>
                    <td className={s.td}>
                      <div className={s.nameCell}>
                        <span style={{ fontWeight: 'bold' }}>{app.family_name} {app.first_name}</span>
                        <span className={s.studentId}>{app.student_id}</span>
                      </div>
                    </td>
                    
                    {/* 📌 固定フラグ */}
                    <td 
                      className={s.checkCell} 
                      onClick={() => toggleFlag(app.id!, 'is_fixed')}
                      style={{ backgroundColor: app.is_fixed ? '#eff6ff' : undefined }} // 青系
                    >
                      <input 
                        type="checkbox" 
                        className={s.checkbox}
                        checked={!!app.is_fixed} 
                        readOnly 
                      />
                    </td>

                    {/* 🔚 最後尾フラグ */}
                    <td 
                      className={s.checkCell} 
                      onClick={() => toggleFlag(app.id!, 'is_last_slot')}
                      style={{ backgroundColor: app.is_last_slot ? '#f0fdf4' : undefined }} // 緑系
                    >
                      <input 
                        type="checkbox" 
                        className={s.checkbox}
                        checked={!!app.is_last_slot} 
                        readOnly 
                      />
                    </td>

                    {/* ☕ 休憩フラグ */}
                    <td 
                      className={s.checkCell} 
                      onClick={() => toggleFlag(app.id!, 'needs_gap_after')}
                      style={{ backgroundColor: app.needs_gap_after ? '#fff7ed' : undefined }} // オレンジ系
                    >
                      <input 
                        type="checkbox" 
                        className={s.checkbox}
                        checked={!!app.needs_gap_after} 
                        readOnly 
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
};