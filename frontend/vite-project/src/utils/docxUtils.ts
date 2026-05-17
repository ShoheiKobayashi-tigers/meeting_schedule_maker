// src/utils/docxUtils.ts
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType, 
  convertMillimetersToTwip, 
  ImageRun, 
  PageBreak,
  Table,
  TableRow,
  TableCell,
  WidthType,
  HeightRule,
  VerticalAlign 
} from 'docx';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode';
import { Applicant } from '../types/Students';
import { SchoolSettings } from '../types/BulkConfig';
import { ScheduleData } from '../types/ScheduleManager';
import { getNengo, parseWareki } from './timeUtils';
import { sortDateCols, sortTimeRows } from './sortUtils';
import { createApplicantAssignmentMap } from './assignmentUtils';
import { formatDisplayDate } from '../hooks/useProcessedSchedule'

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
  workspaceId: string,
  secretKey: string
) => {
  const children: Paragraph[] = [];

  // アプリのベースURL（デプロイ環境に合わせて変更してください）
  const baseUrl = window.location.origin;

  for (let i = 0; i < applicants.length; i++) {
    const student = applicants[i];
    
    // 1. URLの末尾にハッシュ（#）を使って鍵を隠蔽する！
    const loginUrl = `${baseUrl}/p/${workspaceId}#${secretKey}`;
    
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
          new TextRun({ text: "※認証コードを入力欄に、スマートフォンのテンキー入力は対応しておりません。英字キーボードモードでご入力ください。", size: 16 }),
          new TextRun({ text: "※QRコードが読み取れない場合は、お手数ではございますが、上記URLを直接入力してアクセスしてください。", size: 16, break: 1 }),
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

export const generateScheduleTableDocx = async (
  applicants: Applicant[],
  scheduleData: ScheduleData,
  settings: SchoolSettings
) => {
  const sortedCols = sortDateCols(scheduleData.cols);
  const sortedRows = sortTimeRows(scheduleData.rows);

  // 1. 同姓チェック用マップ作成（クラス内に同じ苗字が何人いるかカウント）
  const familyNameCounts = applicants.reduce((acc, app) => {
    acc[app.family_name] = (acc[app.family_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 2. 名前の表示形式を決定する関数
  const getDisplayName = (app: Applicant) => {
    if (familyNameCounts[app.family_name] > 1) {
      // 同姓がいる場合は「苗字(下の名前の1文字目)」
      const firstChar = app.first_name ? app.first_name.charAt(0) : "";
      return `${app.family_name}(${firstChar})`;
    }
    // いない場合は「苗字」のみ
    return app.family_name;
  };

  // 3. 日付ヘッダーの「年」を削除し、曜日を追加する関数（YYYY-MM-DD -> M月D日）
  const formatDateWithoutYear = (dateStr: string) => {
    const parts = dateStr.split('-');
    const day = formatDisplayDate(dateStr).split(' ')[1];
    if (parts.length === 3) {
      return `${parseInt(parts[1], 10)}月${parseInt(parts[2], 10)}日 ${day}`;
    }
    return dateStr; // 想定外のフォーマットならそのまま返す
  };

  // 4. 表の列幅を計算（用紙210mm - 左右余白15mmずつ = 有効幅180mm）
  const a4WidthMm = 210;
  const sideMarginsMm = 30; // 15mm * 2
  const availableWidthMm = a4WidthMm - sideMarginsMm;
  const colAWidthMm = 28; // 時間の列は2.8cm(28mm)固定
  const otherColWidthMm = sortedCols.length > 0 ? (availableWidthMm - colAWidthMm) / sortedCols.length : 0;

  const colAWidthTwip = Math.floor(convertMillimetersToTwip(colAWidthMm));
  const otherColWidthTwip = Math.floor(convertMillimetersToTwip(otherColWidthMm));
  
  const columnWidths = [colAWidthTwip, ...Array(sortedCols.length).fill(otherColWidthTwip)];

  const headerRow = new TableRow({
    height: { value: convertMillimetersToTwip(6), rule: HeightRule.EXACT },    
    children: [
      new TableCell({
        width: { size: colAWidthTwip, type: WidthType.DXA },
        children: [new Paragraph({ text: "時間", alignment: AlignmentType.CENTER })],
        verticalAlign: VerticalAlign.CENTER,
      }),
      ...sortedCols.map((col) => {
        const dateStr = formatDateWithoutYear(col);
        return new TableCell({
          width: { size: otherColWidthTwip, type: WidthType.DXA },
          children: [new Paragraph({ text: dateStr, alignment: AlignmentType.CENTER })],
          verticalAlign: VerticalAlign.CENTER,
        });
      }),
    ],
  });

  const dataRows = sortedRows.map((rowLabel) => {
    const originalRowIndex = scheduleData.rows.indexOf(rowLabel);

    return new TableRow({
      height: { value: convertMillimetersToTwip(10), rule: HeightRule.EXACT },    
      children: [
        new TableCell({
          width: { size: colAWidthTwip, type: WidthType.DXA },
          children: [new Paragraph({ text: rowLabel, alignment: AlignmentType.CENTER })],
          verticalAlign: VerticalAlign.CENTER,
        }),
        ...sortedCols.map((colLabel) => {
          const originalColIndex = scheduleData.cols.indexOf(colLabel);
          const appId = scheduleData.assignments[originalRowIndex][originalColIndex];
          const app = applicants.find((a) => a.id === appId);
          
          // 表示名の取得
          const cellText = app ? getDisplayName(app) : "";
          
          return new TableCell({
            width: { size: otherColWidthTwip, type: WidthType.DXA },
            children: [new Paragraph({ text: cellText, alignment: AlignmentType.CENTER })],
            verticalAlign: VerticalAlign.CENTER,
          });
        }),
      ],
    });
  });

  const scheduleTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: columnWidths,
    rows: [headerRow, ...dataRows],
  });

  const children: (Paragraph | Table)[] = [
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [new TextRun({ text: parseWareki(settings.resultDistributionDate) || "令和〇年〇月〇日", size: 22 })],
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [new TextRun({ text: "保護者の皆様", size: 22 })],
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({ text: settings.schoolName || "〇〇小学校", size: 22 }),
        new TextRun({ text: settings.principalName ? `\n校長　${settings.principalName}` : "\n校長氏名", size: 22, break: 1 }),
        new TextRun({ text: settings.principalName ? `\n${settings.className}担任　${settings.senderName}` : "\n学級名　担任氏名", size: 22, break: 1 }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 400 },
      children: [new TextRun({ text: `${settings.eventName} 日程決定のお知らせ`, bold: true, size: 32 })],
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 400 },
      children: createTextRunsFromMultiline(settings.resultLetterMessage || "", 22),
    }),
    scheduleTable,
  ];

  const doc = new Document({
    styles: { default: { document: { run: { font: { name: "UD デジタル 教科書体 NK", eastAsia: "UD デジタル 教科書体 NK" } } } } },
    sections: [{
      properties: {
        page: { margin: { top: convertMillimetersToTwip(20), bottom: convertMillimetersToTwip(20), left: convertMillimetersToTwip(15), right: convertMillimetersToTwip(15) } },        
      },
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${settings.eventName}日程表_${new Date().toISOString().split('T')[0]}.docx`);
};

// =========================================================================
// 部品関数 1: お便り上部のヘッダー情報（日付、宛名、差出人）
// =========================================================================
const createHeaderParagraphs = (settings: SchoolSettings, student: Applicant) => [
  new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { after: 200 },
    children: [
      new TextRun({ 
        text: settings.resultDistributionDate ? formatDisplayDate(settings.resultDistributionDate) : "令和〇年〇月〇日", 
        size: 22 
      }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 200 },
    children: [
      new TextRun({ text: `${student.student_id || "〇"} 番  ${student.family_name} ${student.first_name} さん`, size: 22, underline: {} }),
      new TextRun({ text: '  保護者様', size: 22 })
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { after: 400 },
    children: [
      new TextRun({ text: settings.schoolName || "〇〇小学校", size: 22 }),
      new TextRun({ text: settings.principalName ? `\n校長  ${settings.principalName}` : "\n校長氏名", size: 22, break: 1 }),
      new TextRun({ text: settings.senderName ? `\n${settings.className || "第〇学年"}担任  ${settings.senderName}` : "\n学級名  担任氏名", size: 22, break: 1 }),
    ],
  })
];

// =========================================================================
// 部品関数 2: 「記 〜 以上」のメイン案内セクション（インデントによる美化）
// =========================================================================
const createDetailsSection = (dateText: string, timeText: string) => [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 1000, after: 600 }, // 上下にしっかり余白をとる
    children: [new TextRun({ text: "記", size: 24, bold: true })],
  }),
  new Paragraph({
    indent: { left: convertMillimetersToTwip(25) }, // 左から4.5cm綺麗に字下げして縦ラインを揃える
    spacing: { after: 300 },
    children: [
      new TextRun({ text: "１．日  時：  ", size: 24 }),
      // 日時だけフォントを少し大きく、太字にして最重要項目として目立たせる
      new TextRun({ text: `${dateText}   ${timeText}`, size: 28, bold: true }),
    ],
  }),
  new Paragraph({
    indent: { left: convertMillimetersToTwip(25) },
    spacing: { after: 300 },
    children: [
      new TextRun({ text: "２．場  所：  ", size: 24 }),
      new TextRun({ text: "各教室", size: 24 }), 
    ],
  }),
  new Paragraph({
    indent: { left: convertMillimetersToTwip(25) },
    spacing: { after: 600 }, // 「以上」の前に広めの余白
    children: [
      new TextRun({ text: "３．お 願い：  ", size: 24 }),
      new TextRun({ text: "スリッパ等の上履きおよび下足袋をご持参ください。", size: 24 }),
    ],
  }),
  new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { after: 800 }, // 下のフッターとの間を広くあける
    children: [new TextRun({ text: "以上", size: 24, bold: true })],
  }),
];

// =========================================================================
// メイン関数: 児童ごとの決定通知書（個別のお便り）を一括生成
// =========================================================================
export const generateIndividualResultDocx = async (
  applicants: Applicant[],
  scheduleData: ScheduleData,
  settings: SchoolSettings
) => {
  const children: Paragraph[] = [];
  
  // 割り当てデータのインデックスMapを事前に生成（1回のみ実行で効率的）
  const assignmentMap = createApplicantAssignmentMap(scheduleData);

  for (let i = 0; i < applicants.length; i++) {
    const student = applicants[i];
    
    // 型安全のためのガード処理: student.id がある場合のみMapから取得
    const assignment = student.id ? assignmentMap.get(student.id) : undefined;

    const assignedDateText = assignment ? formatDisplayDate(assignment.date) : "未定";
    const assignedTimeText = assignment ? assignment.time : "未定";

    // 1ページ分の段落（Paragraph）を配列にプッシュ
    children.push(
      ...createHeaderParagraphs(settings, student),
      
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 300, after: 400 },
        children: [
          new TextRun({ text: `${settings.eventName || "個別面談"} 日程決定のお知らせ`, bold: true, size: 32 }),
        ],
      }),
      
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 400 },
        // 改行コード（\n）が含まれる挨拶文章を適切にTextRunへ分割する共通ユーティリティ関数
        children: createTextRunsFromMultiline(settings.resultLetterMessage || "", 22)
      }),
      
      // 今回新設した 「記 〜 以上」 のスタイリッシュな中央配置ブロック
      ...createDetailsSection(assignedDateText, assignedTimeText),
      
      // 用紙下部のお問い合わせ・備考フッター（これでスカスカ感をさらに払拭）
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 400 },
        children: [
          new TextRun({ text: "※指定された日時のご都合が悪くなった場合は、お早めに担任までご連絡ください。", size: 20 }),
          new TextRun({ text: "※お時間になりましたら、直接各教室の前の廊下でお待ちください。", size: 20, break: 1 }),
        ],
      })
    );

    // 最後の児童でなければ、次の児童のために改ページを挿入する
    if (i < applicants.length - 1) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }
  }

  // Wordドキュメント全体の構成
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: {
              name: "UD デジタル 教科書体 NK",     
              eastAsia: "UD デジタル 教科書体 NK", 
            },
          },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertMillimetersToTwip(25.4),    
            bottom: convertMillimetersToTwip(25.4), 
            left: convertMillimetersToTwip(19.05),  
            right: convertMillimetersToTwip(19.05), 
          },
        },        
      },
      children: children,
    }],
  });

  // ファイルとしてダウンロード実行
  const blob = await Packer.toBlob(doc);
  const fileName = `${settings.eventName || "面談"}日程決定_個別通知_${new Date().toISOString().split('T')[0]}.docx`;
  saveAs(blob, fileName);
};