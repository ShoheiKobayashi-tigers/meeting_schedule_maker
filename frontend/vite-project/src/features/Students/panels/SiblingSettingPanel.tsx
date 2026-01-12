// src/features/Students/components/SiblingSettingPanel.tsx
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { SelectField } from '../../../components/ui/SelectField/SelectField';
import * as s from './SiblingSettingPanel.css';

const SiblingSettingPanel: React.FC = () => {
  const { applicants, siblings } = useAppStore((state) => state.db);
  const [selectedApplicantId, setSelectedApplicantId] = useState('');

  // 1. プルダウン用の選択肢（フルネーム）を作成
  const applicantOptions = useMemo(() => 
    applicants.map(app => ({
      value: app.id!,
      label: `${app.first_name} ${app.last_name}`
    })), [applicants]
  );

  // 2. 表示する兄弟リストを計算（ここがポイント！）
  const displayedSiblings = useMemo(() => {
    // 何も選択されていない場合は、全件を返す
    if (!selectedApplicantId) {
      return siblings;
    }

    // 生徒が選択されている場合は、その生徒の family_id で絞り込む
    const currentApplicant = applicants.find(a => a.id === selectedApplicantId);
    if (!currentApplicant?.family_id) {
      return []; // family_id が設定されていない場合は、紐付けなしとみなす
    }

    return siblings.filter(sib => sib.family_id === currentApplicant.family_id);
  }, [selectedApplicantId, applicants, siblings]);

  return (
    <div className={s.content}>
      <section className={s.section}>
        <h3 className={s.sectionTitle}>生徒を選択して兄弟を絞り込む</h3>
        <SelectField 
          options={applicantOptions}
          value={selectedApplicantId}
          onChange={setSelectedApplicantId}
          placeholder="すべての兄弟を表示中（生徒を選択して絞り込み）"
        />
      </section>

      <section className={s.section}>
        <h3 className={s.sectionTitle}>
          {selectedApplicantId ? "紐付いている兄弟" : "登録されている兄弟一覧"}
        </h3>
        <div className={s.content}>
          {displayedSiblings.length > 0 ? (
            displayedSiblings.map(sib => (
              <div key={sib.id} className={s.listRow}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 'bold' }}>{sib.first_name} {sib.last_name}</span>
                  <span style={{ fontSize: '0.85rem', color: '#718096' }}>
                    {sib.grade}年 {sib.class}組 (family_id: {sib.family_id})
                  </span>
                </div>
                {/* 選択時のみ解除ボタンを表示するなどの制御も可能 */}
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#a0aec0', padding: '2rem' }}>
              該当する兄弟が見つかりません。
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default SiblingSettingPanel;