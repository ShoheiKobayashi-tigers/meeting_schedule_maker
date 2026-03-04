// src/styles/BaseInfoModal.css.ts
import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '../../../styles/vars.css.ts';

/* =========================================
   Info Modal 用スタイル
========================================= */

// 画面全体を覆う背景（半透明のダークカラー ＋ ぼかし）
export const overlay = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.6)', 
  backdropFilter: 'blur(4px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
});

// モーダル本体のコンテナ
export const modalContainer = style({
  backgroundColor: vars.color.white,
  borderRadius: vars.borderRadius.large, // 12pxの角丸
  boxShadow: vars.shadow.floating,       // モーダル用のリッチな影
  width: '90%',
  maxWidth: '600px',
  maxHeight: '80%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden', // 中身が角丸をはみ出さないようにする
});

// ヘッダー部分（タイトル用）
export const header = style({
  padding: `${vars.space.small} ${vars.space.medium}`,
  borderBottom: `1px solid ${vars.color.border}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
});

export const title = style({
  margin: 0,
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: vars.color.textPrimary,
});

// メインコンテンツ領域（長文になった場合はここでスクロールさせる）
export const body = style({
  padding: `${vars.space.small} ${vars.space.medium}`,
  overflowY: 'auto',
  color: vars.color.textSecondary, // 説明文なので少しトーンを落とす
});

// 見出し (h3) のスタイル：区切り線を入れ、少し目立たせる
globalStyle(`${body} h3`, {
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: vars.color.textSecondary,
  marginTop: vars.space.xl,      // 上に広めの余白（前の段落と離す）
  marginBottom: vars.space.small,// 下のテキストとの余白
  paddingBottom: '4px',
  borderBottom: `2px solid ${vars.color.border}`, // 下線を引いてセクションを明確に
});

// 最初の見出しだけは上の余白をなくす（レイアウト崩れ防止）
globalStyle(`${body} h3:first-child`, {
  marginTop: 0,
});

// 段落 (p) のスタイル：段落同士の間に自然な余白を作る
globalStyle(`${body} p`, {
  marginBottom: vars.space.medium,
  marginTop: 0,
});

// リスト (ul, li) のスタイル：箇条書きも綺麗に整える
globalStyle(`${body} ul`, {
  paddingLeft: vars.space.large,
  marginBottom: vars.space.medium,
  marginTop: 0,
});

globalStyle(`${body} li`, {
  marginBottom: '4px',
});

// フッター部分（アクションボタン配置用）
export const footer = style({
  padding: `${vars.space.small} ${vars.space.large}`,
  borderTop: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.background, // コンテンツ領域と区別するため少しグレーに
  display: 'flex',
  justifyContent: 'flex-end',
  gap: vars.space.xs, // 複数のボタンを並べた時の隙間
  flexShrink: 0,
});