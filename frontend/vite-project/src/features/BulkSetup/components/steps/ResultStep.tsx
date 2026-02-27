import React from "react";
import { useAppStore } from "../../../../store/useAppStore";
import { generateScheduleTableDocx } from "../../../../utils/docxUtils";
import { Button } from "../../../../components/ui/Button/Button"; // ★共通ボタンを追加

import * as s from "./ResultStep.css";
import * as layout from "../../../../styles/layout.css"; // ★お道具箱を追加

export const ResultStep: React.FC = () => {
  // === ロジック部分は一切変更なし ===
  const { schoolSettings, applicants, scheduleData } = useAppStore(
    (state) => state.db,
  );
  const setSchoolSettings = useAppStore((state) => state.setSchoolSettings);

  const handleChange = (field: keyof typeof schoolSettings, value: string) => {
    setSchoolSettings({ ...schoolSettings, [field]: value });
  };

  const handleDownload = async () => {
    await generateScheduleTableDocx(applicants, scheduleData, schoolSettings);
  };

  return (
    <div className={layout.basePanelCard}>
      
      {/* 1. 固定領域：ヘッダー */}
      <div className={layout.panelHeader} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <h3 className={layout.panelTitle}>日程結果のお知らせ 出力</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '8px', lineHeight: '1.5' }}>
          保護者に配布する「日程確定のお知らせ（クラス全体のスケジュール表）」を作成します。<br />
          ここで入力した内容と、現在のスケジュール表の割り当てが自動的にWordファイルに反映されます。
        </p>
      </div>

      {/* 2. スクロール領域：設定フォームとダウンロード */}
      <div className={layout.panelScrollArea} style={{ padding: '24px 0 0 0' }}>
        
        {/* 入力フォーム */}
        <div className={s.formGrid}>
          <label className={s.label}>
            お便り配布予定日{" "}
            <span style={{ fontSize: "12px", fontWeight: "normal", color: "#64748b" }}>
              ※和暦で表示されます
            </span>
          </label>
          <input
            type="date"
            className={s.input}
            value={schoolSettings.resultDistributionDate || ""}
            onChange={(e) =>
              handleChange("resultDistributionDate", e.target.value)
            }
          />
        </div>

        <div className={s.formGrid}>
          <label className={s.label}>お便り本文</label>
          <textarea
            className={s.textarea}
            rows={6}
            value={schoolSettings.resultLetterMessage || ""}
            onChange={(e) => handleChange("resultLetterMessage", e.target.value)}
          />
        </div>

        {/* ダウンロードエリア */}
        <div className={s.downloadArea}>
          <div className={s.statusBadge}>準備完了</div>
          <div className={s.downloadIcon}>📄</div>

          <Button variant="primary" onClick={handleDownload} style={{ maxWidth: '400px', width: '100%' }}>
            案内を一括生成してダウンロード (.docx)
          </Button>

          <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
            ※ 生成には数秒〜数十秒かかる場合があります
          </p>
        </div>

      </div>
    </div>
  );
};