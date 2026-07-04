// src/utils/excelUtils.ts
import * as XLSX from 'xlsx';
import { Applicant, Sibling } from '../types/Students';

/**
 * テンプレートExcelのダウンロード
 */
export const downloadTemplate = () => {
  // 1. データの作成 (ヘッダーのみ)
  const data = [
    ["苗字", "名前", "出席番号"],
    ["山田", "太郎", "1"], // 例として一行入れておくと親切
  ];

  // 2. ワークシートの作成
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  
  // 3. ワークブック（ファイル全体）の作成
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "生徒名簿");

  // 4. ファイルとして書き出し
  XLSX.writeFile(workbook, "生徒名簿_ひな形.xlsx");
};

/**
 * Excelファイルのパース
 */
export const parseExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        resolve(json);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
};

export const exportApplicantsTokensToExcel = (applicants: Applicant[], siblings: Sibling[]) => {
  // 1. Excelに出力したい項目だけをマッピングする
  const exportData = applicants.map((app) => ({
    '出席番号': app.student_id,
    '氏名': `${app.family_name} ${app.first_name}`,
    '認証トークン': app.token || '未生成', 
    '兄弟姉妹': siblings
      .filter(s => s.family_id === app.family_id)
        .map(sibling => `${sibling.family_name} ${sibling.first_name}`)
        .join('、')
  }));

  // 2. ワークシートを作成
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '児童情報一覧');

  // 3. ダウンロード実行
  XLSX.writeFile(workbook, '児童情報一覧.xlsx');
};

/**
 * 復元専用テンプレートExcelのダウンロード
 */
export const downloadRestoreTemplate = () => {
  // ユーザー様ご指定の「出席番号 | 苗字 | 名前 | 認証トークン」の並び
  const data = [
    ["出席番号", "苗字", "名前", "認証トークン"],
    ["1", "山田", "太郎", "A1B2C3"], // 先生が迷わないためのサンプル行
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "復元用名簿");
  
  XLSX.writeFile(workbook, "データ復元用_児童一覧_ひな形.xlsx");
};