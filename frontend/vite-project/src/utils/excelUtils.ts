// src/utils/excelUtils.ts
import * as XLSX from 'xlsx';

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