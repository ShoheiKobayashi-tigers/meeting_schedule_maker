// src/utils/docxUtils.ts
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType, 
  convertMillimetersToTwip, 
  ImageRun, 
  PageBreak 
} from 'docx';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode';
import { Applicant } from '../types/Students';
import { SchoolSettings } from '../types/BulkConfig';
import { getNengo, parseWareki } from './timeUtils';
import { setEngine } from 'node:crypto';

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
 * 改行コード(\n)を含む文字列を、docx用のTextRun配列に変換する関数
 */
const createTextRunsFromMultiline = (text: string, size: number = 10.5) => {
  // 1. 改行コードで分割する
  const lines = text.split(/\r?\n/);

  // 2. 分割した行ごとにTextRunを作成する
  return lines.map((line, index) => {
    return new TextRun({
      text: line,
      size: size, // フォントサイズ
      // 2行目以降（index > 0）なら、直前に改行(break)を入れる
      break: index > 0 ? 1 : 0, 
    });
  });
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
    const loginUrl = `${baseUrl}/p/${workspaceId}`;
    
    // 2. QRコード生成
    const qrBuffer = await generateQRBuffer(loginUrl);

    // 3. ページ内容の構築
    const pageParagraphs = [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({ text: parseWareki(settings.distributionDate) || "令和〇年〇月〇日", size: 22 }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({ text:  `${student.student_id} 番  ${student.family_name} ${student.first_name}さん`, size: 22, underline: {}}),
          new TextRun({ text: '　保護者様', size: 22})
        ],
      }),
      // ヘッダー（学校情報）
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({ text: settings.schoolName || "〇〇小学校", size: 22 }),
          new TextRun({ text: settings.principalName ? `\n校長　${settings.principalName}` : "\n校長氏名", size: 22, break: 1}),
          new TextRun({ text: settings.principalName ? `\n${settings.className}担任　${settings.senderName}` : "\n学級名　担任氏名", size: 22, break: 1 }),
        ],
      }),

      // タイトル
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 400 },
        children: [
          new TextRun({ text: `${getNengo(settings.distributionDate)}${settings.eventName}希望調査への回答について`, bold: true, size: 32 }),
        ],
      }),

      // 本文
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 300 },
        children: createTextRunsFromMultiline(settings.letterMessage?.replace('個人面談', `${settings.eventName}`), 22)
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
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 },
        children: [
          new TextRun({ text: "※QRコードが読み取れない場合は、お手数ではございますが、上記URLを直接入力してアクセスしてください。", size: 16 }),
          new TextRun({ text: "※", size: 16, break: 1 }),          
          new TextRun({ text: `${parseWareki(settings.limitDate)}` || "令和〇年〇月〇日", size: 16, bold: true }),
          new TextRun({ text: "までに必ずご入力をお願いいたします。", size: 16 }),
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
    styles: {
      default: {
        document: {
          run: {
            font: {
              name: "UD デジタル 教科書体 NK",     // 英数字用
              eastAsia: "UD デジタル 教科書体 NK", // 日本語用（ここが重要）
            },
          },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: {
            // Wordの「やや狭い」設定
            top: convertMillimetersToTwip(25.4),    // 上: 25.4mm (1インチ)
            bottom: convertMillimetersToTwip(25.4), // 下: 25.4mm (1インチ)
            left: convertMillimetersToTwip(19.05),  // 左: 19.05mm (0.75インチ)
            right: convertMillimetersToTwip(19.05), // 右: 19.05mm (0.75インチ)
          },
        },        
      },
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${settings.eventName}希望調査_配付用資料_${new Date().toISOString().split('T')[0]}.docx`);
};