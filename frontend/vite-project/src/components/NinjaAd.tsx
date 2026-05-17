import React, { useEffect } from 'react';

export const NinjaAd: React.FC = () => {
  useEffect(() => {
    // 1. 広告を動かすためのグローバル変数を準備（TypeScriptエラー回避のためanyを使用）
    const win = window as any;
    win.admaxads = win.admaxads || [];
    
    // 2. この画面が開かれるたびに、広告の表示リクエストをpushする
    win.admaxads.push({
      admax_id: "0186706e61ce41b1d06185a3463844c1",
      type: "banner"
    });

    // 3. 忍者AdMaxのコアスクリプトを読み込む（すでに読み込み済みの場合はスキップ）
    const scriptId = 'ninja-admax-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://adm.shinobi.jp/st/t.js';
      script.async = true;
      script.charset = 'utf-8';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div 
      className="admax-ads" 
      data-admax-id="0186706e61ce41b1d06185a3463844c1" 
      // 💡スマホ画面ではみ出さないよう「maxWidth: '100%'」をこっそり追加しています
      style={{ display: 'inline-block', width: '728px', height: '90px', maxWidth: '100%' }}
    />
  );
};