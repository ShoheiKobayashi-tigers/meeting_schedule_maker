// features/BulkSetup/types.ts (新設、あるいはHub内に直接書いてもOK)
export type BulkStep = 'import' | 'template' | 'preview' | 'handout' | 'sync';

export interface StepConfig {
  id: BulkStep;
  label: string;
  description: string;
}

export const BULK_STEPS: StepConfig[] = [
  { id: 'import', label: 'Step 1: 名簿インポート', description: 'Excelから児童情報を登録' },
  { id: 'template', label: 'Step 2: お便り設定', description: '学校名などの基本情報設定' },
  { id: 'preview', label: 'Step 3: フォームプレビュー', description: '保護者画面の確認と本文編集' }, // 追加
  { id: 'handout', label: 'Step 4: 配布物出力', description: '個別QRコード入りのdocx出力' },
  { id: 'sync', label: 'Step 5: 回答同期', description: 'クラウドへの公開と同期' },
];