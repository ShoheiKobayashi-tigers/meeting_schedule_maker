import React from 'react';
import { useAppStore, VIEWS } from '../store/useAppStore';
import * as s from './Navigation.css';
import { SettingMenu } from './ui/SettingMenu/SettingMenu';

const Navigation: React.FC = () => {
  const currentView = useAppStore((state) => state.ui.currentView);
  const setCurrentView = useAppStore((state) => state.setCurrentView);

  const navItems = [
    { view: VIEWS.SCHEDULE, label: 'スケジュール' },
    { view: VIEWS.SETTINGS, label: '面談枠の設定' },
    { view: VIEWS.STUDENTS, label: '児童（生徒）情報管理' },
  ];

  return (
    <nav className={s.navBar}>
      {/* ★左側: ナビゲーションボタンのグループ */}
      <div className={s.navGroup}>
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className={`${s.navButton} ${currentView === item.view ? s.navButtonActive : ''}`}
          >
            <span className={s.navButtonLabel}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* ★右側: ハンバーガーメニュー */}
      <SettingMenu />
    </nav>
  );
};

export default Navigation;