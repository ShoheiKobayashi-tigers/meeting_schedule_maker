// src/utils/tokenUtils.ts

// 紛らわしい文字 (0, O, 1, l, I) を除いたアルファベットと数字
const TOKEN_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export const generateShortToken = (length = 6): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += TOKEN_CHARS.charAt(Math.floor(Math.random() * TOKEN_CHARS.length));
  }
  return result;
};