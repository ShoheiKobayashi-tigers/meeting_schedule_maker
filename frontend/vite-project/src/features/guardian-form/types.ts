// features/ParentForm/types.ts
import { z } from 'zod';

export const parentLoginSchema = z.object({
  token: z
    .string()
    .length(6, '認証コードは6桁で入力してください')
    .toUpperCase() // 小文字で入力されても自動で大文字に
});

export type ParentLoginInput = z.infer<typeof parentLoginSchema>;