import React, { useState } from 'react';
import { GearIcon } from '../icons/GearIcon';
import { useAppStore } from '../../../store/useAppStore'; // ★Storeをインポート
import * as s from './SettingMenu.css'

export const SettingMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // ★Storeから開閉アクションを取得
  const { setBulkSetupOpen, setAllocationConfigOpen } = useAppStore((state) => state);


  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleAction = (action: () => void) => {
    action();
    closeMenu();
  };

  return (
    <>
      {/* メニューが開いている時の透明なバックドロップ（外側クリックで閉じる用） */}
      {isOpen && <div className={s.backdrop} onClick={closeMenu} />}

      <div className={s.container}>
        <button className={s.menuButton} onClick={toggleMenu} aria-label="設定メニュー">
          <GearIcon className={s.icon} />
        </button>

        {isOpen && (
          <div className={s.dropdown}>
            
            <button className={s.menuItem} onClick={() => handleAction(() => setBulkSetupOpen(true))}>
              <span style={{ fontSize: '18px' }}>📋</span>
              <div>
                <div style={{ fontWeight: 'bold' }}>保護者フォーム・お便り設定</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>書類・フォーム・公開設定</div>
              </div>
            </button>

            <div className={s.menuDivider} />

            <button className={s.menuItem} onClick={() => handleAction(() => setAllocationConfigOpen(true))}>
              <span style={{ fontSize: '18px' }}>⚙️</span>
              <div>
                <div style={{ fontWeight: 'bold' }}>自動割り当て詳細設定</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>固定・兄弟ルールなど</div>
              </div>
            </button>

            <button className={s.menuItem} onClick={() => handleAction(() => setAllocationConfigOpen(true))}>
              <span style={{ fontSize: '18px' }}>⚙️</span>
              <div>
                <div style={{ fontWeight: 'bold' }}>双子設定</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>同一クラスに在籍の児童を双子に設定</div>
              </div>
            </button>
            
            
          </div>
        )}
      </div>
    </>
  );
};