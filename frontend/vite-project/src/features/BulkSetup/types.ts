// features/BulkSetup/types.ts (新設、あるいはHub内に直接書いてもOK)
export type BulkStep = 'import' | 'template' | 'handout' | 'sync';

export interface StepConfig {
  id: BulkStep;
  label: string;
  description: string;
}

export const BULK_STEPS: StepConfig[] = [
  { id: 'import', label: 'Step 1: 名簿インポート', description: 'Excelから児童情報を登録します' },
  { id: 'template', label: 'Step 2: お便り設定', description: '配布するお便りの文面を編集します' },
  { id: 'handout', label: 'Step 3: 配布物出力', description: '個別QRコード入りのdocxを出力します' },
  { id: 'sync', label: 'Step 4: 回答同期', description: '保護者の回答データを回収します' },
];