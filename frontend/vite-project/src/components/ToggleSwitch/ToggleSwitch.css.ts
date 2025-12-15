// src/components/ui/ToggleSwitch.css.ts
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';

// -----------------------------------------------------
// 1. ベースとなる共通スタイルを定義
// -----------------------------------------------------

export const toggleContainer = style({
  display: 'inline-block',
  verticalAlign: 'middle',
  cursor: 'pointer', // onClickはコンテナにつけるため、カーソルを定義
});

// レシピで使用するベーススタイル（トグル全体の外枠）
const labelBase = style({
  display: 'block',
  width: '40px',
  height: '24px',
  backgroundColor: '#ccc',
  borderRadius: '12px',
  position: 'relative',
  transition: 'background-color 0.3s',
});

// レシピで使用するベーススタイル（円形のつまみ）
const circleBase = style({
  position: 'absolute',
  top: '2px',
  left: '2px',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: 'white',
  transition: 'transform 0.3s',
});

// -----------------------------------------------------
// 2. レシピの定義 (isCheckedの状態をバリエーションとして扱う)
// -----------------------------------------------------

// トグル外枠のレシピ (色が変わる部分)
export const labelRecipe = recipe({
  base: labelBase,
  
  variants: {
    // isCheckedの状態（on/off）
    checked: {
      true: { backgroundColor: '#48bb78' }, // アクティブ時の緑
      false: { backgroundColor: '#ccc' },  // 非アクティブ時のグレー
    },
  },
});

// 円形つまみのレシピ (位置が変わる部分)
export const circleRecipe = recipe({
  base: circleBase,

  variants: {
    // isCheckedの状態（on/off）
    checked: {
      true: { transform: 'translateX(16px)' }, // 右に16px移動
      false: { transform: 'translateX(0px)' },  // 左に留まる
    },
  },
});