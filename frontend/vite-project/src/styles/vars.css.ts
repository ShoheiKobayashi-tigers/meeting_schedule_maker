// src/styles/vars.css.ts
import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    // --- ブランドカラー ---
    primary: '#4299e1',      // メインの青
    primaryHover: '#3182ce', // ホバー時の少し濃い青
    success: '#48bb78',
    danger: '#e53e3e',
    dangerHover: '#c53030',
    
    // --- 背景色 ---
    background: '#f8fafc',   // アプリ全体の背景（少し青みがかったモダンなグレー）
    white: '#ffffff',        // パネルなどの白
    surface: '#ffffff',      // (whiteと同じですが、意味合いで使い分けるなら残してOK)
    
    // --- インタラクション（状態） ---
    hoverGray: '#f1f5f9',    // リストなどをホバーした時
    border: '#e2e8f0',       // 境界線（少し明るめのグレーにすると垢抜けます）
    
    // --- テキストカラー（一本化） ---
    textPrimary: '#1e293b',  // 最も濃い文字（見出しや重要なテキスト）
    textSecondary: '#64748b',// 補足説明やサブテキスト
    textMuted: '#94a3b8',    // プレースホルダーや非活性の文字
  },
  
  space: {
    none: '0',
    xs: '0.25rem',   // 4px (アイコンの隙間などに便利)
    small: '0.5rem', // 8px
    medium: '1rem',  // 16px
    large: '1.5rem', // 24px
    xl: '2rem',      // 32px (大きな余白用)
  },
  
  // ★追加：角丸の統一ルール
  borderRadius: {
    small: '4px',   // バッジや小さな入力欄
    medium: '8px',  // ボタンや入力フォーム
    large: '12px',  // パネル（カード）の外枠
    full: '9999px', // 丸いアイコンやピル状のバッジ
  },
  
  shadow: {
    panel: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    floating: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // モーダル用など
  }
});