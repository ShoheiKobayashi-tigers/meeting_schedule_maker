// src/components/ui/ToggleSwitch.css.ts
import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { vars } from '../../../styles/vars.css'; // ★追加

export const toggleContainer = style({
  display: 'inline-block',
  verticalAlign: 'middle',
  cursor: 'pointer',
});

const labelBase = style({
  display: 'block',
  width: '40px',
  height: '24px',
  backgroundColor: vars.color.border, // ★変更: '#ccc' から vars に
  borderRadius: '12px',
  position: 'relative',
  transition: 'background-color 0.3s',
});

const circleBase = style({
  position: 'absolute',
  top: '2px',
  left: '2px',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: vars.color.white, // ★変更
  transition: 'transform 0.3s',
  boxShadow: '0 1px 3px rgba(0,0,0,0.2)', // ★少し影をつけると本物っぽくなります
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
      true: { backgroundColor: vars.color.success }, // ★変更: ブロック＝赤色(danger) にすると分かりやすいです！（緑なら success）
      false: { backgroundColor: vars.color.border }, 
    },
  },
});

// 円形つまみのレシピ (位置が変わる部分)
export const circleRecipe = recipe({
  base: circleBase,

  variants: {
    // isCheckedの状態（on/off）
    checked: {
      true: { transform: 'translateX(16px)' }, 
      false: { transform: 'translateX(0px)' }, 
    },
  },
});