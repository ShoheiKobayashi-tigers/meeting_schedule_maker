import React, { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore'; // パスは環境に合わせて調整してください
import * as s from './HamburgerMenu.css';

export const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setBulkSetupOpen } = useAppStore();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleBulkSetupClick = () => {
    setBulkSetupOpen(true);
    closeMenu();
  };

  return (
    <>
      {/* メニューが開いている時の透明なバックドロップ（外側クリックで閉じる用） */}
      {isOpen && <div className={s.backdrop} onClick={closeMenu} />}

      <div className={s.container}>
        <button className={s.menuButton} onClick={toggleMenu} aria-label="メニュー">
          ☰
        </button>

        {isOpen && (
          <div className={s.dropdown}>
            <button className={s.menuItem} onClick={handleBulkSetupClick}>
              一括設定ウィザード
            </button>
            {/* 将来的な機能はここに追加 */}
            {/* <button className={s.menuItem}>🚪 ログアウト</button> */}
          </div>
        )}
      </div>
    </>
  );
};