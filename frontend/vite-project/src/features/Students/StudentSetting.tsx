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
        {selectedId ? (
          <SiblingSettingPanel applicantId={selectedId} />
        ) : (
          <div style={{ textAlign: 'center', marginTop: '100px', color: '#a0aec0' }}>
            <h2>生徒を選択してください</h2>
            <p>左側の一覧から生徒をクリックすると、家族設定が表示されます。</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSetting;