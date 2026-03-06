// src/pages/public/LandingPage.css.ts
import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

// ==========================================
// 1. スムーススクロール（HTML全体に適用）
// ==========================================
globalStyle('html', {
  scrollBehavior: 'smooth',
});

// ==========================================
// 2. LP全体を囲うラッパー（スコープの起点）
// ==========================================
export const wrapper = style({
  fontFamily: '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif',
  color: '#333',
  lineHeight: '1.6',
});

// ==========================================
// 3. スコープ付きグローバルスタイル
// （wrapper の中にあるタグ"だけ"にスタイルを当てる）
// ==========================================

// 見出し (h2)
globalStyle(`${wrapper} h2`, {
  fontSize: '1.8rem',
  textAlign: 'center',
  marginBottom: '40px',
  color: '#1f2937',
});
globalStyle(`${wrapper} h2`, {
  '@media': {
    'screen and (min-width: 768px)': {
      fontSize: '2.2rem',
    }
  }
});

// 見出し (h3)
globalStyle(`${wrapper} h3`, {
  fontSize: '1.3rem',
  marginBottom: '12px',
  color: '#111827',
});

// 段落 (p)
globalStyle(`${wrapper} p`, {
  color: '#4b5563',
});

// リンク全般 (a)
globalStyle(`${wrapper} a`, {
  textDecoration: 'none',
});

// リスト (ul, ol)
globalStyle(`${wrapper} ul, ${wrapper} ol`, {
  color: '#4b5563',
  paddingLeft: '24px',
});
globalStyle(`${wrapper} li`, {
  marginBottom: '8px',
});

// ==========================================
// 4. ローカルクラス（特定のパーツ用）
// ==========================================

// --- ヘッダー（目次ナビゲーション） ---
export const header = style({
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(8px)',
  borderBottom: '1px solid #e5e7eb',
  padding: '12px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const headerTitle = style({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  color: '#166534',
});

export const headerNav = style({
  display: 'none', // スマホでは非表示
  gap: '24px',
  fontSize: '0.95rem',
  fontWeight: 'bold',
  '@media': {
    'screen and (min-width: 768px)': {
      display: 'flex',
    },
  },
});

export const navLink = style({
  color: '#4b5563',
  transition: 'color 0.2s ease',
  ':hover': {
    color: '#16a34a',
  },
});

export const headerBtn = style({
  backgroundColor: '#16a34a',
  color: 'white',
  padding: '8px 16px',
  borderRadius: '6px',
  fontWeight: 'bold',
  fontSize: '0.9rem',
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: '#15803d',
  },
});

// --- セクション共通 ---
export const sectionBase = style({
  padding: '60px 20px',
  scrollMarginTop: '60px', // ヘッダーの高さ分ズラす
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '80px 20px',
    },
  },
});

export const bgWhite = style([sectionBase, { backgroundColor: 'white' }]);
export const bgGray = style([sectionBase, { backgroundColor: '#f9fafb' }]);
export const bgDark = style([sectionBase, { backgroundColor: '#1f2937', color: 'white' }]);
export const bgGreenLight = style([sectionBase, { backgroundColor: '#f0fdf4' }]);

export const sectionInner = style({ maxWidth: '800px', margin: '0 auto' });
export const sectionInnerWide = style({ maxWidth: '1000px', margin: '0 auto' });

// --- ヒーローセクション専用 ---
export const heroBadge = style({
  display: 'inline-block',
  backgroundColor: '#16a34a',
  color: 'white',
  padding: '4px 12px',
  borderRadius: '999px',
  fontSize: '0.9rem',
  fontWeight: 'bold',
  marginBottom: '16px',
});

export const heroTitle = style({
  fontSize: 'clamp(1.8rem, 5vw, 3rem)',
  fontWeight: 'bold',
  color: '#166534',
  marginBottom: '24px',
  lineHeight: '1.3',
});

export const heroText = style({
  fontSize: '1.1rem',
  marginBottom: '32px',
  color: '#4b5563',
});

export const buttonGroup = style({
  display: 'flex',
  justifyContent: 'center',
  gap: '16px',
  flexWrap: 'wrap',
});

export const primaryBtn = style({
  display: 'inline-block',
  backgroundColor: '#16a34a',
  color: 'white',
  padding: '16px 32px',
  borderRadius: '8px',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  minWidth: '280px',
  textAlign: 'center',
  transition: 'transform 0.2s, background-color 0.2s',
  ':hover': {
    backgroundColor: '#15803d',
    transform: 'translateY(-2px)',
  },
});

export const secondaryBtn = style({
  display: 'inline-block',
  backgroundColor: 'white',
  color: '#16a34a',
  padding: '16px 32px',
  borderRadius: '8px',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  border: '2px solid #16a34a',
  minWidth: '280px',
  textAlign: 'center',
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: '#f0fdf4',
  },
});

// --- グリッドとカード ---
export const grid = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '32px',
  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
});

export const featureCard = style({
  backgroundColor: 'white',
  padding: '32px 24px',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
  border: '1px solid #f3f4f6',
  transition: 'transform 0.2s',
  ':hover': {
    transform: 'translateY(-4px)',
  },
});

export const stepCard = style({
  backgroundColor: 'white',
  padding: '24px',
  borderRadius: '12px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  marginBottom: '16px',
  borderLeft: '4px solid #16a34a',
});

export const securityBox = style({
  textAlign: 'left',
  backgroundColor: 'rgba(255,255,255,0.1)',
  padding: '32px',
  borderRadius: '12px',
});

// --- FAQ ---
export const faqContainer = style({
  backgroundColor: '#f9fafb',
  padding: '32px',
  borderRadius: '12px',
});

export const faqItem = style({
  borderBottom: '1px solid #e5e7eb',
  padding: '16px 0',
  ':last-child': {
    borderBottom: 'none',
  },
});

export const faqButton = style({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  background: 'none',
  border: 'none',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#1f2937',
  cursor: 'pointer',
  textAlign: 'left',
  padding: '8px 0',
  ':hover': {
    color: '#16a34a',
  },
});

export const faqContent = style({
  marginTop: '12px',
  color: '#4b5563',
  lineHeight: '1.6',
  paddingBottom: '8px',
});

// --- フッター ---
export const footer = style({
  backgroundColor: '#111827',
  color: 'white',
  padding: '60px 20px',
  textAlign: 'center',
});

export const footerLinks = style({
  display: 'flex',
  justifyContent: 'center',
  gap: '24px',
  flexWrap: 'wrap',
  marginBottom: '24px',
  fontSize: '0.9rem',
});

export const videoWrapper = style({
  marginTop: '40px',
  backgroundColor: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '8px', // 動画の周りの白いフチ
  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
  maxWidth: '800px',
  margin: '40px auto 0', // 中央寄せ
});

export const videoPlayer = style({
  width: '100%',
  height: 'auto',
  display: 'block', // 下部の隙間を消す
  borderRadius: '8px', // 動画自体も角丸に
  backgroundColor: '#f3f4f6', // 読み込み中の背景色
  aspectRatio: '16 / 9',
  objectFit: 'cover',
});

export const footerLink = style({
  color: '#cbd5e1',
  textDecoration: 'none',
  transition: 'color 0.2s',
  ':hover': {
    color: vars.color.white,
    textDecoration: 'underline',
  }
});

export const footerCopy = style({
  fontSize: '0.875rem', // 14px相当
  margin: 0,
});

export const footerCtaTitle = style({
  fontSize: '1.5rem',
  marginBottom: '24px',
  color: vars.color.white,
});

// フッター内のCTAボタンのラッパー
export const footerCtaWrapper = style({
  marginBottom: '40px',
});


// src/pages/public/LandingPage.css.ts に追加・上書き

// ▼ 新設：最強の1番をアピールする「特大カード」
export const featuredCard = style({
  backgroundColor: 'white',
  padding: '32px',
  borderRadius: '16px',
  boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  border: '2px solid #16a34a',
  marginBottom: '40px',
  display: 'flex', // grid から flex に変更
  flexDirection: 'column', // 上下並びを指定
  gap: '32px',
  transition: 'transform 0.2s',
  ':hover': {
    transform: 'translateY(-4px)',
  },
  '@media': {
    'screen and (min-width: 768px)': {
      padding: '48px',
      // （※ここに以前あった gridTemplateColumns: '1fr 1.2fr' は削除します）
    },
  },
});

export const featuredImageWrapper = style({
  width: '100%',
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  border: '1px solid #e5e7eb',
});

// ▼ 変更：2〜4番を並べる「3列グリッド」
export const subGrid = style({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '15px',
  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: 'repeat(3, 1fr)', // PCでは3列に綺麗に並べる
    },
  },
});


// 2つのシナリオを縦に並べる大枠
export const scenarioContainer = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '32px', // シナリオ同士の余白を少し広げる
  width: '100%',
  paddingTop: '32px', // テキストとの間に余白
  borderTop: '1px dashed #e2e8f0', // 点線で区切ると「ここから図解！」感が出て綺麗です
});

// シナリオの小見出し（Lucideアイコンが綺麗に並ぶように調整）
export const scenarioLabel = style({
  fontSize: '1rem', // 少しだけ大きく
  fontWeight: 'bold',
  color: '#374151',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '4px', // 画像との間に少し隙間
});

// 1つのシナリオ（タイトル ＋ 画像横並び）の枠
export const scenarioRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

// 画像と矢印を横に並べるコンテナ
export const scenarioImages = style({
  display: 'grid', // flex から grid に変更
  gridTemplateColumns: '1fr auto 1fr', // 【魔法の1行】画像(1) : 矢印(auto) : 画像(1) に強制分割
  alignItems: 'center',
  gap: '16px', // 矢印と画像の隙間
  width: '100%',
});

// ▼ 画像本体のスタイル（どんな元画像でも指定の箱に綺麗に収める）
export const scenarioImage = style({
  width: '100%',
  aspectRatio: '16 / 7', // ここで「綺麗な長方形」の箱のサイズを定義
  objectFit: 'cover', // 箱の比率に合わせて、画像を自動でトリミング（絶対に引き伸ばさない）
  objectPosition: 'top center', // トリミングする際、画像の「上のほう」を優先して見せる
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', // 少しだけ影をつけて浮き上がらせる
  backgroundColor: '#f8fafc',
  transition: 'transform 0.2s',
  ':hover': {
    transform: 'translateY(-2px)',
  }
});

// 真ん中の矢印
export const scenarioArrow = style({
  color: '#9ca3af', // 控えめなグレー
  flexShrink: 0,
  width: '24px',
  height: '24px',
});


// src/pages/public/LandingPage.css.ts に追加

// ▼ 特大カード2用の青いバッジ
const baseBadge = style({
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: '999px',
  fontSize: '0.85rem',
  fontWeight: 'bold',
});

export const primaryBadge = style([
  baseBadge, {
    backgroundColor: '#dcfce7',
    color: '#166534',
  }
])
export const secodaryBadge = style([
  baseBadge,{
  backgroundColor: '#dbeafe',
  color: '#1e3a8a',
  }
])

// ▼ 4枚の画像を2x2で並べるグリッド
export const fourImageGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)', // 横に2つ並べる
  gap: '16px',
  width: '100%',
  paddingTop: '32px',
  borderTop: '1px dashed #e2e8f0',
});

// ▼ 4枚の画像のそれぞれの枠
export const gridImageWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

// ▼ 画像の上のキャプション（①お便り設定 など）
export const gridImageLabel = style({
  fontSize: '0.85rem',
  fontWeight: 'bold',
  color: '#4b5563',
  textAlign: 'center',
});

// ▼ 4枚の画像本体（サイズを完全に統一）
export const gridImage = style({
  width: '100%',
  aspectRatio: '4 / 3', // 4枚並べるのに最適な、少し正方形寄りの比率
  objectFit: 'cover',
  objectPosition: 'top center',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  backgroundColor: '#f8fafc',
  transition: 'transform 0.2s',
  ':hover': {
    transform: 'translateY(-2px)',
  }
});

// ▼ サブ機能のアイコン用（Lucide）
export const subFeatureIcon = style({
  color: '#16a34a', // ブランドカラーの緑
  marginBottom: '8px',
});