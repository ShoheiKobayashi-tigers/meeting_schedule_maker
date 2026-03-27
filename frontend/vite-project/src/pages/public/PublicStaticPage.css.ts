// src/pages/public/PublicStaticPage.css.ts
import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '../../styles/vars.css';

// LPで使われている緑色を変数として定義しておく（保守性アップ）
const lpGreen = '#16a34a';      // 明るい緑（ボタンやアクセント）
const lpGreenDark = '#166534';  // 濃い緑（タイトルやホバー時）

export const container = style({
  maxWidth: '800px',
  margin: '0 auto',
  padding: `40px ${vars.space.large}`,
  lineHeight: '1.8',
  color: vars.color.textPrimary,
});

// ==========================================
// ★ globalStyle を使って、標準のHTMLタグに一括でスタイルを当てる！
// ==========================================

// タイトル (h1)
globalStyle(`${container} h1`, {
  fontSize: '2.5rem',
  marginBottom: vars.space.medium,
  fontWeight: 'bold',
  color: lpGreenDark, // ★ 追加: タイトルを濃い緑に
});

// セクション見出し (h2)
globalStyle(`${container} h2`, {
  borderBottom: `2px solid ${lpGreen}`, // ★ 変更: 下線を緑に
  paddingBottom: vars.space.small,
  marginTop: '40px',
  marginBottom: vars.space.medium,
  fontSize: '1.75rem',
  fontWeight: 'bold',
});

// サブセクション見出し (h3)
globalStyle(`${container} h3`, {
  marginTop: vars.space.medium,
  marginBottom: vars.space.small,
  color: lpGreen, // ★ 変更: 小見出しを緑に
  fontSize: '1.25rem',
  fontWeight: 'bold',
});

// サブサブセクション見出し (h4)
globalStyle(`${container} h4`, {
  marginTop: vars.space.medium,
  marginBottom: vars.space.small,
  color: lpGreenDark, // h1と同じ濃い緑
  fontSize: '1.1rem',
  fontWeight: 'bold',
});

// 段落 (p)
globalStyle(`${container} p`, {
  marginBottom: vars.space.medium,
});

// リスト (ul, ol)
globalStyle(`${container} ul, ${container} ol`, {
  marginBottom: vars.space.medium,
  paddingLeft: vars.space.large,
});

globalStyle(`${container} li`, {
  marginBottom: vars.space.small,
});


// ==========================================
// 特殊なブロックだけ個別のクラスとして定義
// ==========================================
export const faqBox = style({
  marginTop: '60px',
  padding: vars.space.large,
  backgroundColor: '#f0fdf4', // ★ 変更: LPと同じ極薄い緑背景（bgGreenLightと同じ）
  borderRadius: vars.borderRadius.medium,
});

export const backLinkWrapper = style({
  marginTop: '40px',
  textAlign: 'center',
});

export const backLink = style({
  color: lpGreen, // ★ 変更: リンクを緑に
  textDecoration: 'none',
  fontWeight: 'bold',
  transition: 'color 0.2s',
  ':hover': {
    textDecoration: 'underline',
    color: lpGreenDark, // ★ 変更: ホバー時は濃い緑に
  }
});