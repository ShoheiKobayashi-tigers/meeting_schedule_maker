// features/BulkSetup/components/steps/ImportStep.tsx
import React, { useState } from 'react';
import { downloadTemplate, parseExcelFile } from '../../../../utils/excelUtils';
import { useAppStore } from '../../../../store/useAppStore';
import * as s from './ImportStep.css';
import Button from '../../../../components/ui/Button/Button';

interface ImportStepProps {
  onNext: () => void;
}

export const ImportStep: React.FC<ImportStepProps> = ({ onNext }) => {
  const [previewData, setPreviewData] = useState<any[]>([]);
  const importApplicants = useAppStore((state) => state.importApplicants);

  const handleConfirm = () => {
    if (previewData.length === 0) return;
    importApplicants(previewData);
    onNext();
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
      alert('ファイルの解析に失敗しました。形式を確認してください。');
    }
  };

  return (
    <div className={s.container}>
      <section className={s.section}>
        <h4 className={s.sectionTitle}>1. ひな形を準備する</h4>
        <p className={s.description}>
          まずは専用のExcelファイルをダウンロードし、生徒の情報を入力してください。<br />
          ※「苗字」「名前」「出席番号」の列は消さずに入力してください。
        </p>
        <Button variant='edit' onClick={downloadTemplate}>ひな形(.xlsx)をダウンロード</Button>
      </section>

      <hr className={s.divider} />

      <section className={s.section}>
        <h4 className={s.sectionTitle}>2. 編集したファイルをアップロード</h4>
        <p className={s.description}>
          入力が終わったファイルをここにドラッグ＆ドロップするか、クリックして選択してください。
        </p>
        <div className={s.dropzone}>
          <span className={s.uploadIcon}>📄</span>
          <p>ファイルを選択、またはドラッグ＆ドロップ</p>
          <input 
            type="file" 
            className={s.fileInput} 
            accept=".xlsx, .xls" 
            onChange={handleFileChange} 
          />
        </div>
      </section>

      {previewData.length > 0 && (
        <section className={s.section}>
          <h4 className={s.sectionTitle}>3. 読み込み内容の確認</h4>
          <p className={s.description}>
            以下の {previewData.length} 名を登録します。内容に間違いがないか確認してください。
          </p>
          
          <div className={s.previewCard}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>出席番号</th>
                  <th style={{ padding: '12px' }}>名前</th>
                  <th style={{ padding: '12px' }}>認証トークン</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((student, idx) => (
                  <tr key={idx} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{student.student_id}</td>
                    <td style={{ padding: '12px' }}>{`${student.family_name} ${student.first_name}`}</td>
                    <td style={{ padding: '12px', color: '#64748b', fontSize: '14px' }}>
                      （登録後に自動割当または維持）
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button variant='add' onClick={handleConfirm}>
            この内容で登録して次へ
          </Button>
        </section>
      )}
    </div>
  );
};