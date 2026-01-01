import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import * as s from '../StudentSetting.css';

interface Props {
  applicantId: string;
}

const SiblingSettingPanel: React.FC<Props> = ({ applicantId }) => {
  const { applicants, siblings } = useAppStore((state) => state.db);
  const saveSibling = useAppStore((state) => state.saveSibling);
  const [query, setQuery] = useState('');

  const currentStudent = useMemo(() => 
    applicants.find(a => a.id === applicantId), [applicants, applicantId]
  );

  const linkedSiblings = useMemo(() => 
    siblings.filter(s => s.family_id === currentStudent?.family_id),
    [siblings, currentStudent]
  );

  // 紐付け候補（まだこの家族にいない兄弟）
  const candidates = useMemo(() => {
    if (query.trim() === '') return [];
    return siblings.filter(s => 
      s.family_id !== currentStudent?.family_id && 
      s.first_name.includes(query)
    );
  }, [siblings, query, currentStudent]);

  const handleLink = (sibling: any) => {
    if (!currentStudent?.family_id) return;
    saveSibling({ ...sibling, family_id: currentStudent.family_id });
    setQuery('');
  };

  return (
    <div>
      <h1 style={{ marginBottom: '0.5rem' }}>{currentStudent?.first_name} {currentStudent?.last_name} さんの家族設定</h1>
      <p style={{ color: '#718096', marginBottom: '2rem' }}>家族ID: {currentStudent?.family_id}</p>

      <section style={{ marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>登録済みの兄弟</h3>
        {linkedSiblings.length > 0 ? (
          linkedSiblings.map(sib => (
            <div key={sib.id} className={s.card} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{sib.first_name} {sib.last_name}({sib.grade}年 {sib.class}組)</span>
              <button style={{ color: '#e53e3e', fontSize: '0.8rem' }}>紐付け解除</button>
            </div>
          ))
        ) : (
          <p style={{ color: '#a0aec0' }}>紐付いている兄弟はいません。</p>
        )}
      </section>

      <section>
        <h3 style={{ marginBottom: '1rem' }}>既存データから兄弟を紐付ける</h3>
        <input
          className={s.searchInput}
          placeholder="兄弟の名前で検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {candidates.length > 0 && (
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', backgroundColor: 'white' }}>
            {candidates.map(c => (
              <div 
                key={c.id} 
                onClick={() => handleLink(c)}
                style={{ padding: '0.75rem', cursor: 'pointer', borderBottom: '1px solid #edf2f7' }}
              >
                {c.first_name} {c.last_name} ({c.grade}年) を追加する
              </div>
            ))}
          </div>
        )}
      </section>

      <button style={{ marginTop: '2rem', width: '100%', padding: '0.75rem', backgroundColor: '#4a5568', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        + 新しく兄弟を作成して登録
      </button>
    </div>
  );
};

export default SiblingSettingPanel;