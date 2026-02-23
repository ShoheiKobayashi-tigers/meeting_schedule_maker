// src/features/Students/StudentSetting.tsx
import React, { useState } from 'react';
import * as s from './StudentSetting.css';
import { ApplicantSettingPanel } from './panels/ApplicantSettingPanel';
import { SiblingSettingPanel } from './panels/SiblingSettingPanel';

export const StudentSetting = () => {
  // 生徒一覧の選択IDと、兄弟一覧の選択IDを明確に分離する
  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);
  const [selectedSiblingId, setSelectedSiblingId] = useState<string | null>(null);

  return (
    <div className={s.container}>
      {/* 左：生徒一覧パネル */}
      <div className={s.leftPanel}>
        <ApplicantSettingPanel 
          selectedId={selectedApplicantId} 
          onSelect={setSelectedApplicantId} 
        />
      </div>

      {/* 右：家族・兄弟設定パネル（常時表示） */}
      <div className={s.rightPanel}>
        <SiblingSettingPanel
          selectedId={selectedSiblingId} 
          onSelect={setSelectedSiblingId} 
        />
      </div>
    </div>
  );
};