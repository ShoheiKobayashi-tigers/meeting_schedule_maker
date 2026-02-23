// src/features/BulkSetup/components/steps/ResultStep.tsx
import React from "react";
import { useAppStore } from "../../../../store/useAppStore";
import { generateScheduleTableDocx } from "../../../../utils/docxUtils";
import * as s from "./ResultStep.css";

export const ResultStep: React.FC = () => {
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
    <div className={s.container}>
      <div className={s.header}>
        <h3 className={s.title}>3. 日程結果のお知らせ 出力</h3>
        <p className={s.description}>
          保護者に配布する「日程確定のお知らせ（クラス全体のスケジュール表）」を作成します。
          <br />
          ここで入力した内容と、現在のスケジュール表の割り当てが自動的にWordファイルに反映されます。
        </p>
      </div>
      <div className={s.formGrid}>
        <label className={s.label}>
          お便り配布予定日{" "}
          <span style={{ fontSize: "12px", fontWeight: "normal" }}>
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

      <div className={s.downloadArea}>
        <div className={s.statusBadge}>準備完了</div>
        <div className={s.downloadIcon}>📄</div>

        <button onClick={handleDownload} className={s.downloadButton}>
          案内を一括生成してダウンロード (.docx)
        </button>

        <p style={{ marginTop: "16px", fontSize: "12px", color: "#666" }}>
          ※ 生成には数秒〜数十秒かかる場合があります
        </p>
      </div>
    </div>
  );
};
