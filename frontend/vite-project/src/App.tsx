// src/App.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// --- Pages (展示台) のインポート ---
import { LandingPage } from "./pages/public/LandingPage";
import { PortalPage } from "./pages/guardian/PortalPage";

import { AppLayout } from "./pages/app/AppLayout";
import { StartPage } from "./pages/app/StartPage";

import { StudentsPage } from "./pages/app/step1-setup/StudentsPage";
import { SiblingsPage } from "./pages/app/step1-setup/SiblingsPage";

import { DateTimePage } from "./pages/app/step2-schedule/DateTimePage";
import { SlotsPage } from "./pages/app/step2-schedule/SlotsPage";

import { ModeSelectPage } from "./pages/app/step3-collection/ModeSelectPage";
import { ManualInputPage } from "./pages/app/step3-collection/ManualInputPage";
import { DocumentPage } from "./pages/app/step3-collection/DocumentPage";
import { PublishPage } from "./pages/app/step3-collection/PublishPage";

import { ConfigPage } from "./pages/app/step4-assignment/ConfigPage";
import { BoardPage } from "./pages/app/step4-assignment/BoardPage";

import { ResultPage } from "./pages/app/step5-export/ResultPage";

export const App: React.FC = () => {
  return (
    <Routes>
      {/* 🏠 公開ページ (LP) */}
      <Route path="/" element={<LandingPage />} />

      {/* 👪 保護者ポータル */}
      <Route path="/p/:workspaceId" element={<PortalPage />} />

      {/* 👨‍🏫 先生用アプリ本体（共通レイアウトの中に各Stepが入る） */}
      {/* ========================================= */}
      {/* 🌟 本番用ルート (/app) */}
      {/* ========================================= */}
      <Route path="/app" element={<AppLayout />}>
        {/* /app 直下にアクセスした場合は StartPage */}
        <Route index element={<StartPage />} />

        {/* Step 1: 名簿の準備 */}
        <Route path="step1/students" element={<StudentsPage />} />
        <Route path="step1/siblings" element={<SiblingsPage />} />

        {/* Step 2: 面談枠の作成 */}
        <Route path="step2/datetime" element={<DateTimePage />} />
        <Route path="step2/slots" element={<SlotsPage />} />

        {/* Step 3: 希望日程の回収 */}
        <Route path="step3" element={<ModeSelectPage />} />
        <Route path="step3/manual" element={<ManualInputPage />} />
        <Route path="step3/form/document" element={<DocumentPage />} />
        <Route path="step3/form/publish" element={<PublishPage />} />
        <Route path="step3/form/manual" element={<ManualInputPage />} />

        {/* Step 4: スケジュール割当 */}
        <Route path="step4/config" element={<ConfigPage />} />
        <Route path="step4/board" element={<BoardPage />} />

        {/* Step 5: 確定と結果出力 */}
        <Route path="step5/result" element={<ResultPage />} />
      </Route>
      
      {/* ========================================= */}
      {/* 🌟 デモ用ルート (/demo) - 中身は/appと全く同じ！ */}
      {/* ========================================= */}
      <Route path="/demo" element={<AppLayout />}>
        {/* /app 直下にアクセスした場合は StartPage */}
        <Route index element={<StartPage />} />

        {/* Step 1: 名簿の準備 */}
        <Route path="step1/students" element={<StudentsPage />} />
        <Route path="step1/siblings" element={<SiblingsPage />} />

        {/* Step 2: 面談枠の作成 */}
        <Route path="step2/datetime" element={<DateTimePage />} />
        <Route path="step2/slots" element={<SlotsPage />} />

        {/* Step 3: 希望日程の回収 */}
        <Route path="step3" element={<ModeSelectPage />} />
        <Route path="step3/manual" element={<ManualInputPage />} />
        <Route path="step3/form/document" element={<DocumentPage />} />
        <Route path="step3/form/publish" element={<PublishPage />} />
        <Route path="step3/form/manual" element={<ManualInputPage />} />

        {/* Step 4: スケジュール割当 */}
        <Route path="step4/config" element={<ConfigPage />} />
        <Route path="step4/board" element={<BoardPage />} />

        {/* Step 5: 確定と結果出力 */}
        <Route path="step5/result" element={<ResultPage />} />
      </Route>
    </Routes>
  );
};
