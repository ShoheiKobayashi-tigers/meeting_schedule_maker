// src/utils/docxUtils.ts
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType, 
  HeadingLevel, 
  ImageRun, 
  PageBreak 
} from 'docx';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode';
import { Applicant } from '../types/Students';
import { SchoolSettings } from '../types/BulkConfig';

/**
 * QRコード画像をBase64形式からdocxが扱えるUint8Arrayに変換する
 */
const generateQRBuffer = async (text: string): Promise<Uint8Array> => {
  // 背景は白、データは黒のQRコードを生成
  const dataUrl = await QRCode.toDataURL(text, {
    width: 200,
    margin: 2,
    errorCorrectionLevel: 'M',
  });
  // Base64のヘッダーを削ってバイナリに変換
  const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
  const binaryString = window.atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

/**
 * 全生徒分の案内を1つのWordファイルとして生成・ダウンロードする
 */
export const generateHandoutDocx = async (
  applicants: Applicant[],
  settings: SchoolSettings,
  workspaceId: string
) => {
  const children: Paragraph[] = [];

  // アプリのベースURL（デプロイ環境に合わせて変更してください）
  const baseUrl = window.location.origin;

  for (let i = 0; i < applicants.length; i++) {
    const student = applicants[i];
    
    // 1. 個別のログインURLを生成
    // 構造: https://domain.com/p/[workspaceId]?t=[token]
    const loginUrl = `${baseUrl}/p/${workspaceId}?t=${student.token}`;
    
    // 2. QRコード生成
    const qrBuffer = await generateQRBuffer(loginUrl);

    // 3. ページ内容の構築
    const pageParagraphs = [
      // ヘッダー（学校情報）
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({ text: settings.schoolName || "〇〇小学校", size: 22 }),
          new TextRun({ text: settings.principalName ? `\n${settings.principalName}` : "\n校長 氏名", size: 22, break: 1 }),
        ],
      }),

      // タイトル
      new Paragraph({
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 400 },
        children: [
          new TextRun({ text: "教育相談（三者面談）希望調査への回答について", bold: true, size: 32 }),
        ],
      }),

      // 生徒宛名
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ 
            text: `${student.student_id} 番  ${student.family_name} ${student.first_name} 様`, 
            size: 24, 
            underline: {} 
          }),
        ],
      }),

      new Paragraph({
        spacing: { after: 300 },
        children: [
          new TextRun({ text: "日頃より本校の教育活動へのご理解とご協力をいただき感謝申し上げます。", size: 20 }),
          new TextRun({ text: "\nさて、今年度の教育相談を下記により実施いたします。つきましては、以下のQRコードまたは認証コードを用いて、スマートフォンやPCよりご希望の日時をご回答ください。", size: 20, break: 1 }),
        ],
      }),

      // QRコードエリア
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 200 },
        children: [
          new ImageRun({
            data: qrBuffer,
            type: 'png',
            transformation: { width: 120, height: 120 },
          }),
        ],
      }),

      // 認証コードエリア
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({ text: "【 あなたの認証コード 】", size: 20 }),
          new TextRun({ 
            text: student.token || "----", 
            size: 64, 
            bold: true, 
            color: "d63384", // ピンク色で強調
            break: 1 
          }),
        ],
      }),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: "URL: " + loginUrl, size: 14, color: "666666" }),
        ],
      }),

      new Paragraph({
        spacing: { before: 400 },
        children: [
          new TextRun({ text: "※QRコードが読み取れない場合は、上記URLにアクセスし、認証コードを直接入力してください。", size: 16 }),
          new TextRun({ text: "\n※回答期限までに必ずご入力をお願いいたします。", size: 16, break: 1, bold: true }),
        ],
      }),

      // フッター（担任名）
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 600 },
        children: [
          new TextRun({ text: settings.senderName || "担任", size: 22 }),
        ],
      }),
    ];

    // children配列にこの生徒の段落を追加
    children.push(...pageParagraphs);

    // 最後の生徒以外は、ページ区切りを挿入
    if (i < applicants.length - 1) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }
  }

  // 4. ドキュメントとして書き出し
  const doc = new Document({
    sections: [{
      properties: {},
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `面談希望調査_配付用資料_${new Date().toISOString().split('T')[0]}.docx`);
};