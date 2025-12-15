import React, { useState } from 'react';
import StudentSettingsPanel from './panels/StudentSettingsPanel.jsx';
import SiblingsSettingPanel from './panels/SiblingsSettingPanel.jsx';

const StudentSettingsScreen = ({ manager, siblingsManager }) => {
    const [currentRightPanel, setCurrentRightPanel] = useState('DEFAULT'); // 'DEFAULT', 'SIBLINGS_SETTINGS'
    // manager.styles.fullScreenLayout のような、画面全体に広がるスタイルを使用
    return (
        <div style={manager.styles.fullScreenLayout}>
            <div style={manager.styles.leftPanel}>
                <StudentSettingsPanel
                  manager={manager}
                  onViewSiblingsSettings={() => setCurrentRightPanel('SIBLINGS_SETTINGS')}
                />
            </div>

            <div style={manager.styles.rightPanel}>
              {currentRightPanel === 'SIBLINGS_SETTINGS' ? (
                    <SiblingsSettingPanel
                        manager={manager}
                        siblingsManager={siblingsManager}
                        // 戻るボタンのコールバック
                        onBack={() => setCurrentRightPanel('DEFAULT')}
                    />
                ) : (
                    // デフォルトの右パネル表示
                    <div style={{padding: '1.5rem', color: '#718096'}}>
                        <p style={{fontSize: '1.1rem', fontWeight: 'bold'}}>兄弟情報設定</p>
                        <hr style={{margin: '10px 0'}}/>
                        <p>ここでは、兄弟情報の設定を確認・編集できます。</p>
                        <p>「兄弟情報の一覧・設定へ」ボタンを押してください。</p>
                    </div>
                )
              }
            </div>
        </div>
    );
};

export default StudentSettingsScreen;