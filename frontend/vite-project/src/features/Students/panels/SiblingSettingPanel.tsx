// src/features/Students/components/SiblingSettingPanel.tsx
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { formatSlotText } from '../../../hooks/useProcessedSchedule';
import { SelectField } from '../../../components/ui/SelectField/SelectField';
import { Button } from '../../../components/ui/Button/Button'
import { SiblingForm } from '../components/parts/SiblingForm'
import { Sibling } from '../../../types/Students'; // 型をインポート
import * as s from './SiblingSettingPanel.css';
import * as layout from '../../../styles/layout.css';

type PanelMode = 'list' | 'add' | 'edit';

export const SiblingSettingPanel: React.FC = () => {
  const [ selectedId, setSelectedId ] = useState<string | null>(null);
  const { applicants, siblings } = useAppStore((state) => state.db);
  const { openConfirmationModal, deleteSibling, saveSibling } = useAppStore();
  const [filterFamilyId, setFilterFamilyId] = useState(''); // 検索用
  const [mode, setMode] = useState<PanelMode>('list');

  const selectedSibling = useMemo(() => 
    siblings.find(s => s.id === selectedId) || null
  , [siblings, selectedId]);

  const handleEditStart = (id: string) => {
    setSelectedId(id);
    setMode('edit');
  };

  const handleAddStart = () => {
    setSelectedId(null);
    setMode('add');
  };

  const handleBack = () => {
    setMode('list');
    setSelectedId(null);
  };

  const onFormSubmit = (data: Sibling) => {
    saveSibling(data); // ここでStoreに保存
    handleBack(); // リストに戻る
  };

  // 2. 表示する兄弟リストを計算（ここがポイント！）
  const displayedSiblings = useMemo(() => {
    if (!filterFamilyId) return siblings;
    return siblings.filter(s => s.family_id === filterFamilyId);
  }, [siblings, filterFamilyId]);

  // フィルタ用オプション
  const familyFilterOptions = useMemo(() => 
    applicants.map(a => ({ value: a.family_id || '', label: `${a.family_name} ${a.first_name}` }))
  , [applicants]);


  if (mode === 'add' || mode === 'edit') {
    return (
      <div className={layout.basePanelCard}>
        <div className={layout.panelHeader}>
          <h3 className={layout.panelTitle}>{mode === 'add' ? '兄弟の追加' : '兄弟の編集'}</h3>
        </div>
        <SiblingForm 
          initialData={selectedSibling}
          onSubmit={onFormSubmit}
          onCancel={handleBack}
          submitLabel={mode === 'add' ? '登録する' : '更新する'}
        />
      </div>
    );
  }

  return (
    <div className={layout.basePanelCard}>
      <div className={layout.panelHeader}>
        <h3 className={layout.panelTitle}>兄弟設定</h3>
        <Button variant="primary" onClick={handleAddStart}>新規追加</Button>
      </div>
      <div className = {s.filterBar}>
        <SelectField 
          options={familyFilterOptions} 
          value={filterFamilyId} 
          onChange={setFilterFamilyId}
          placeholder="一覧（選択すると兄弟を絞り込めます）"
        />
      </div>
      <div className={layout.panelScrollArea}>
        {displayedSiblings.length > 0 ? (
          displayedSiblings.map(sib => (
            <div key={sib.id} className={layout.listRow}>
              <div className={s.siblingInfo}>
                <div className={s.siblingName}>{sib.family_name} {sib.first_name}</div>
                <div className={s.siblingDetail}>
                  {sib.grade}年 {sib.class}組 : {formatSlotText(sib.assigned_slot)}
                </div>
              </div>
              <div className={s.actionButtonGroup}>
                <Button variant="outline" onClick={() => handleEditStart(sib.id!)}>編集</Button>
                <Button variant="danger" onClick={() => {
                  openConfirmationModal({
                    title: '兄弟の削除',
                    message: `${sib.family_name} ${sib.first_name} を削除しますか？`,
                    onConfirm: () => deleteSibling(sib.id!),
                    confirmText: '削除',
                    cancelText: 'キャンセル'
                  });
                }}>削除</Button>
              </div>
            </div>
          ))
        ) : (
          <p className={s.emptyMessage}>該当する兄弟がいません。</p>
        )}
      </div>
    </div>
  );
};