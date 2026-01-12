import React, { useState } from 'react';
import * as s from './StudentSetting.css';
import ApplicantSettingPanel from './panels/ApplicantSettingPanel';
import SiblingSettingPanel from './panels/SiblingSettingPanel';

const StudentSetting = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className={s.container}>
      {/* 左：生徒一覧パネル */}
      <div className={s.leftPanel}>
        <ApplicantSettingPanel 
          selectedId={selectedId} 
          onSelect={setSelectedId} 
        />
      </div>

      {/* 右：家族・兄弟設定パネル（常時表示） */}
      <div className={s.rightPanel}>
        <SiblingSettingPanel/>
      </div>
    </div>
  );
};

export default StudentSetting;