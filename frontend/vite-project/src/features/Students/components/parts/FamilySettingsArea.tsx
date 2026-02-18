import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../../../store/useAppStore';
import Button from '../../../../components/ui/Button/Button';
import { TwinSettingModal } from '../modals/TwinSettingModal';
import * as s from './FamilySettingsArea.css';

interface Props {
  currentFamilyId?: string | null;
  currentStudentId?: string; // 本人判定用
  onLinkChange: (newFamilyId: string) => void;
}

export const FamilySettingsArea: React.FC<Props> = ({
  currentFamilyId,
  currentStudentId,
  onLinkChange,
}) => {
  const applicants = useAppStore((state) => state.db.applicants);
  const siblings = useAppStore((state) => state.db.siblings);
  
  const [isTwinModalOpen, setIsTwinModalOpen] = useState(false);

  // 家族メンバーの検索
  const familyMembers = useMemo(() => {
    if (!currentFamilyId) return { applicants: [], siblings: [] };

    return {
      applicants: applicants.filter(a => a.family_id === currentFamilyId),
      siblings: siblings.filter(s => s.family_id === currentFamilyId)
    };
  }, [currentFamilyId, applicants, siblings]);

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h4 className={s.title}>👥 家族設定 (双子・きょうだい)</h4>
        
        {/* 設定ボタン */}
        <Button 
          type="button" 
          variant="edit" 
          onClick={() => setIsTwinModalOpen(true)}
          style={{ fontSize: '11px', padding: '4px 8px', height: 'auto', minHeight: '0' }}
        >
          双子設定
        </Button>
      </div>

      <div className={s.content}>
        {currentFamilyId ? (
          <>
            {/* 登録児童リスト */}
            {familyMembers.applicants.length > 0 && (
              <div className={s.section}>
                <span className={s.sectionLabel}>自クラス:</span>
                <ul className={s.list}>
                  {familyMembers.applicants.map(a => (
                    <li key={a.id}>
                      {a.family_name} {a.first_name} 
                      {a.id === currentStudentId && <span className={s.selfBadge}>(本人)</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* きょうだいリスト */}
            {familyMembers.siblings.length > 0 && (
              <div className={s.section}>
                <span className={s.sectionLabel}>きょうだい(枠確保のみ):</span>
                <ul className={s.list}>
                  {familyMembers.siblings.map(sib => (
                    <li key={sib.id}>
                      {sib.family_name} {sib.first_name} <span style={{ fontSize: '11px', color: '#64748b' }}>({sib.grade}年)</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p className={s.emptyText}>
            設定なし (同じクラスの双子などがいる場合は設定してください)
          </p>
        )}
      </div>

      {/* 設定モーダル */}
      <TwinSettingModal
        isOpen={isTwinModalOpen}
        currentStudentId={currentStudentId}
        onClose={() => setIsTwinModalOpen(false)}
        onLink={onLinkChange}
      />
    </div>
  );
};