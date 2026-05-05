// src/components/ui/HelpMenu/HelpMenu.tsx
import React, { useState } from 'react';
import { MoreVerticalIcon as HelpIcon } from 'lucide-react';
import * as s from './HelpMenu.css';

export const HelpMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {isOpen && <div className={s.backdrop} onClick={closeMenu} />}

      <div className={s.container}>
        <button className={s.menuButton} onClick={toggleMenu} aria-label="ヘルプメニュー">
          <HelpIcon className={s.icon} />
        </button>

        {isOpen && (
          <div className={s.dropdown}>
            
            {/* 🟦 第1グループ：サービス全体・最新情報 */}
            <a href="/" target="_blank" rel="noopener noreferrer" className={s.menuItem} onClick={closeMenu}>
              <div className={s.textWrapper}>
                <div className={s.itemTitle}>トップページ</div>
                <div className={s.itemDescription}>サービス紹介・特徴を確認する</div>
              </div>
            </a>
            <a href="/updates" target="_blank" rel="noopener noreferrer" className={s.menuItem} onClick={closeMenu}>
              <div className={s.textWrapper}>
                <div className={s.itemTitle}>更新情報</div>
                <div className={s.itemDescription}>アップデート履歴・不具合修正</div>
              </div>
            </a>

            <div className={s.menuDivider} />

            {/* 🟩 第2グループ：困った時のサポート（アクション） */}
            <a href="/guide" target="_blank" rel="noopener noreferrer" className={s.menuItem} onClick={closeMenu}>
              <div className={s.textWrapper}>
                <div className={s.itemTitle}>ご利用ガイド（概要）</div>
                <div className={s.itemDescription}>使い方マニュアル</div>
              </div>
            </a>
            <a href="https://koba-maishin.com/%e3%80%90%e5%ae%8c%e5%85%a8%e3%82%ac%e3%82%a4%e3%83%89%e3%80%91%e3%82%b9%e3%82%b1%e3%82%b8%e3%83%a5%e3%83%bc%e3%83%ab%e3%83%a1%e3%83%bc%e3%82%ab%e3%83%bc%e3%81%ae%e4%bd%bf%e3%81%84%e6%96%b9/" target="_blank" rel="noopener noreferrer" className={s.menuItem} onClick={closeMenu}>
              <div className={s.textWrapper}>
                <div className={s.itemTitle}>ご利用ガイド（詳細＞開発者ブログへ）</div>
                <div className={s.itemDescription}>写真付きの使い方完全ガイド</div>
              </div>
            </a>
            <a href="https://forms.gle/GMqBkzefmF3EAASx7" target="_blank" rel="noopener noreferrer" className={s.menuItem} onClick={closeMenu}>
              <div className={s.textWrapper}>
                <div className={s.itemTitle}>お問い合わせ</div>
                <div className={s.itemDescription}>ご意見・ご要望・不具合のご報告</div>
              </div>
            </a>

            <div className={s.menuDivider} />

            {/* 🟧 第3グループ：開発者情報 */}
            <a href="https://koba-maishin.com" target="_blank" rel="noopener noreferrer" className={s.menuItem} onClick={closeMenu}>
              <div className={s.textWrapper}>
                <div className={s.itemTitle}>開発者ブログ</div>
                <div className={s.itemDescription}>教育×ITのノウハウを発信中</div>
              </div>
            </a>
            <a href="https://x.com/koba_EdTech" target="_blank" rel="noopener noreferrer" className={s.menuItem} onClick={closeMenu}>
              <div className={s.textWrapper}>
                <div className={s.itemTitle}>開発者 X (Twitter)</div>
                <div className={s.itemDescription}>最新情報や開発の裏側をお届け</div>
              </div>
            </a>

            <div className={s.menuDivider} />

            {/* 🟨 第4グループ：法的ドキュメント（一番下に配置） */}
            <a href="/security" target="_blank" rel="noopener noreferrer" className={s.menuItem} onClick={closeMenu}>
              <div className={s.textWrapper}>
                <div className={s.itemTitle}>セキュリティについて</div>
              </div>
            </a>
            <a href="/terms" target="_blank" rel="noopener noreferrer" className={s.menuItem} onClick={closeMenu}>
              <div className={s.textWrapper}>
                <div className={s.itemTitle}>利用規約</div>
              </div>
            </a>
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className={s.menuItem} onClick={closeMenu}>
              <div className={s.textWrapper}>
                <div className={s.itemTitle}>プライバシーポリシー</div>
              </div>
            </a>

          </div>
        )}
      </div>
    </>
  );
};