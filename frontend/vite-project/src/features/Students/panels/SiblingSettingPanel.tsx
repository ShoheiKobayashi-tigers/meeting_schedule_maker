// src/features/Students/components/SiblingSettingPanel.tsx
import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { formatDisplayDate } from '../../../hooks/useProcessedSchedule';
import { SelectField } from '../../../components/ui/SelectField/SelectField';
import Button from '../../../components/ui/Button/Button'
import SiblingForm from '../components/parts/SiblingForm'
import { Sibling } from '../../../types/Students'; // 型をインポート
import * as s from './SiblingSettingPanel.css';

interface Props {
  selectedId: string | null;
  onSelect: (id: string | null) => void; // nullを許容
}

type PanelMode = 'list' | 'add' | 'edit';

const SiblingSettingPanel: React.FC<Props> = ({ selectedId, onSelect }) => {
  const { applicants, siblings } = useAppStore((state) => state.db);
  const { openConfirmationModal, deleteSibling, saveSibling } = useAppStore();
  const [filterFamilyId, setFilterFamilyId] = useState(''); // 検索用
  const [mode, setMode] = useState<PanelMode>('list');

  const selectedSibling = useMemo(() => 
    siblings.find(s => s.id === selectedId) || null
  , [siblings, selectedId]);

  const handleEditStart = (id: string) => {
    onSelect(id);
    setMode('edit');
  };

  const handleAddStart = () => {
    onSelect(null);
    setMode('add');
  };

  const handleBack = () => {
    setMode('list');
    onSelect(null);
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
    applicants.map(a => ({ value: a.family_id || '', label: `${a.first_name} ${a.last_name}` }))
  , [applicants]);

  const formatSlotText = (slot: string | undefined) => {
    if (!slot) return '日程未定';
    const parts = slot.split(' '); // 空白で分割
    const datePart = parts[0];     // "2025-12-01"
    const timePart = parts.slice(1).join(' '); // "09:15 - 09:30"
    
    return `${formatDisplayDate(datePart)} ${timePart}`;
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <div className={s.container}>
        <h3 className={s.title}>{mode === 'add' ? '兄弟の追加' : '兄弟の編集'}</h3>
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
    <div className={s.container}>
      <div className={s.listHeader}>
        <h3 className={s.title}>兄弟設定</h3>
        <Button variant="add" onClick={handleAddStart}>新規追加</Button>
      </div>
      <div className = {s.listHeader}>
        <SelectField 
          options={familyFilterOptions} 
          value={filterFamilyId} 
          onChange={setFilterFamilyId}
          placeholder="一覧（選択すると兄弟を絞り込めます）"
        />
      </div>
      <div className={s.scrollArea}>
        {displayedSiblings.length > 0 ? (
          displayedSiblings.map(sib => (
            <div key={sib.id} className={s.listRow}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{sib.first_name} {sib.last_name}</div>
                <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                  {sib.grade}年 {sib.class}組 : {formatSlotText(sib.assigned_slot)}
                </div>
              </div>
              <div className={s.actionButtonGroup}>
                <Button variant="edit" onClick={() => handleEditStart(sib.id!)}>編集</Button>
                <Button variant="delete" onClick={() => {
                  openConfirmationModal({
                    title: '兄弟の削除',
                    message: `${sib.first_name} ${sib.last_name} を削除しますか？`,
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

export default SiblingSettingPanel;