import React, { useState } from 'react';
import { downloadTemplate, parseExcelFile } from '../../../../utils/excelUtils';
import { useAppStore } from '../../../../store/useAppStore';
import { Button } from '../../../../components/ui/Button/Button';
import * as s from './ImportStudentModal.css';

// 簡易的なモーダルUIのスタイル（必要に応じて既存のModalコンポーネントに置き換えてください）


export const ImportStudentModal: React.FC = () => {
  
  // ★ Storeから状態と操作関数を取得
  const { ui, setImportStudentModalOpen, importApplicants } = useAppStore();
  
  // Storeの中の isOpen を見る
  const isOpen = ui.importStudentModal.isOpen;
  
  const [previewData, setPreviewData] = useState<any[]>([]);

  // 閉じるための関数をここで定義
  const handleClose = () => {
    setPreviewData([]);
    setImportStudentModalOpen(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rawData = await parseExcelFile(file);
      const mappedData = rawData.map((row: any) => ({
        student_id: String(row['出席番号'] || ''),
        family_name: row['苗字'] || '',
        first_name: row['名前'] || '',
      }));
      setPreviewData(mappedData);
    } catch (err) {
      console.error(err);
      alert('ファイルの解析に失敗しました。');
    }
  };

  const handleConfirm = () => {
    if (previewData.length === 0) return;
    importApplicants(previewData);
    alert(`${previewData.length}件のデータを登録しました。`);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className={s.overlay} onClick={handleClose}>
      <div className={s.content} onClick={(e) => e.stopPropagation()}>
        <h2 className={s.title}>
          名簿の一括登録 (Excel)
        </h2>

        {/* Step 1: ひな形DL */}
        <div className={s.section}>
          <h4>1. Excelひな形を準備</h4>
          <p className={s.description}>
            「苗字」「名前」「出席番号」を入力したExcelを作成してください。
          </p>
          <Button variant="outline" onClick={downloadTemplate} >
            ひな形をダウンロード
          </Button>
        </div>

        {/* Step 2: アップロード */}
        <div className={s.section}>
          <p className={s.description}>
            2. ファイルを選択
          </p>
          <div className={s.uploadArea}>
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              onChange={handleFileChange} 
              className={s.fileInput}
            />
          </div>
        </div>

        {/* Step 3: プレビュー (データがある時だけ表示) */}
        {previewData.length > 0 && (
          <div className={s.section}>
            <p className={s.descriptionBold}>
                確認: {previewData.length} 名のデータを読み込みました
            </p>
            <div className={s.tableContainer}>
              <table className={s.table}>
                <thead className={s.tableHeader}>
                  <tr>
                    <th className={s.tableCell}>番号</th>
                    <th className={s.tableCell}>氏名</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((student, idx) => (
                    <tr key={idx} className={s.tableRow}>
                      <td className={s.tableCell}>{student.student_id}</td>
                      <td className={s.tableCell}>{student.family_name} {student.first_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ボタンエリア */}
        <div className={s.footer}>
          <Button variant="outline" onClick={handleClose}>
            キャンセル
          </Button>
          <Button 
            variant="primary" 
            onClick={handleConfirm} 
            disabled={previewData.length === 0}
          >
            取り込みを実行
          </Button>
        </div>
      </div>
    </div>
  );
};