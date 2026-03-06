// src/components/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  // 現在のURLパスを取得
  const { pathname } = useLocation();

  useEffect(() => {
    // パスが変更されるたびに、画面の左上（0, 0）へスクロールする
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // 画面には何も表示しない裏方のコンポーネントです
};