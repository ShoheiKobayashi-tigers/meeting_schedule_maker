import React, { useEffect, useRef } from 'react';

export const NinjaAd: React.FC = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 忍者AdMaxの仕様上、画面遷移（ルーティング）のたびに
    // スクリプトを再度実行して広告を再描画させるための処理です。
    const script = document.createElement('script');
    
    // ⚠️ ここに忍者AdMaxで取得したスクリプトのURLを入れます
    script.src = 'https://adm.shinobi.jp/s/0186706e61ce41b1d06185a3463844c1.js'; 
    script.async = true;

    if (adRef.current) {
      adRef.current.appendChild(script);
    }

    // コンポーネントが破棄される時（別のページに移動した時）にスクリプトをお掃除します
    return () => {
      if (adRef.current && script.parentNode) {
        adRef.current.removeChild(script);
      }
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', margin: '24px 0' }}>
      {/* ⚠️ idの部分に、取得したタグに書かれているidを入れます */}
      <div ref={adRef} id="admax_1225870"></div>
    </div>
  );
};