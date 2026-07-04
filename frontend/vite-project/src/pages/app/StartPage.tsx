// src/pages/app/StartPage.tsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import { Eye, EyeOff } from "lucide-react"; // 🌟 lucide-reactからインポート
import { useAppStore } from "../../store/useAppStore";
import { AnnouncementModalManager } from "../../features/announcements/components/AnnouncementModalManager";
import { setSessionPassword, setForceDemoMode } from "../../utils/secureStorage"; 
import { Button } from "../../components/ui/Button/Button";
import * as s from "./StartPage.css";

const STORAGE_KEY = "student-app-storage";
type PageMode = "menu" | "resume" | "new";

export const StartPage: React.FC = () => {
  const navigate = useNavigate();
  const { resetAll, loadDemoData, setHasEntered, setStartupAdModalOpen, setRestoreModalOpen } = useAppStore();

  const [mode, setMode] = useState<PageMode>("menu");
  const [hasData, setHasData] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //隠しコマンド数える用
  const clickCount = useRef<number>(0);

  useEffect(() => {
    const encryptedValue = localStorage.getItem(STORAGE_KEY);
    setHasData(!!encryptedValue);
  }, []);

  // 🔓 ロック解除
  const handleUnlock = async () => {
    setErrorMsg("");
    const encryptedValue = localStorage.getItem(STORAGE_KEY);
    if (!encryptedValue) return;

    try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, password);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedString) throw new Error("Decryption failed");

      setSessionPassword(password);
      await useAppStore.persist.rehydrate();

      setHasEntered(true);
      setStartupAdModalOpen(true);
      
      // 🌟 記憶していた最後の場所（なければStep1）へ復帰
      const lastRoute = localStorage.getItem("student-app-last-route");
      if (lastRoute) {
        navigate(`/app${lastRoute}`);
      } else {
        navigate("/app/step1/datetime");
      }
    } catch (error) {
      setErrorMsg("パスワードが間違っています。");
    }
  };

  // ✨ 新規作成
  const handleNewGame = async () => {
    setErrorMsg("");
    if (password.length < 4) {
      setErrorMsg("パスワードは4文字以上で設定してください。");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("確認用パスワードが一致しません。");
      return;
    }
    if (!isAgreed) {
      setErrorMsg("セキュリティと免責事項に同意してください。");
      return;
    }

    setSessionPassword(password);
    resetAll();
    localStorage.removeItem("student-app-last-route");
    localStorage.setItem(
      STORAGE_KEY,
      CryptoJS.AES.encrypt(
        JSON.stringify({
          state: { db: useAppStore.getState().db },
          version: 0,
        }),
        password,
      ).toString(),
    );

    await useAppStore.persist.rehydrate();
    setHasEntered(true);
    navigate("/app/step1/datetime");
  };

  // 🧪 デモ開始
  const handleDemoStart = async () => {
    setForceDemoMode(true); 
    setSessionPassword("demo-mode");
    loadDemoData();
    await useAppStore.persist.rehydrate();
    setHasEntered(true);
    setStartupAdModalOpen(true);
    navigate("/demo/step1/datetime");
    setTimeout(() => {
        setForceDemoMode(false);
    }, 500);
  };
  // 🗑️ 強制リセット
  const handleForceReset = () => {
    if (
      window.confirm(
        "【警告】現在のデータを全て破棄しますか？（復元はできません）",
      )
    ) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem("student-app-last-route");
      setHasData(false);
      setMode("menu");
      setPassword("");
      setErrorMsg("");
    }
  };

  const goBack = () => {
    setMode("menu");
    setPassword("");
    setConfirmPassword("");
    setErrorMsg("");
  };

  //隠しコマンドで復元モーダルを表示させる
  const handleTitleClick = () => {
    clickCount.current += 1;
    
    if (clickCount.current >= 10) {
      if (setRestoreModalOpen) setRestoreModalOpen(true);
      clickCount.current = 0; // カウントをリセット
    }
  };

  return (
    <div className={s.container}>
      <AnnouncementModalManager />
      <div className={s.card}>
        <div className={s.header}>
          <h1 className={s.title} onClick={handleTitleClick}>個人面談・三者面談 スケジュールメーカー</h1>
          <p className={s.subtitle}>お使いのPC内のみにデータが保存されます</p>
          <p className={s.subtitle}>※教員側はPCでのご利用を推奨しております</p>
        </div>

        {errorMsg && <div className={s.errorMessage}>{errorMsg}</div>}

        {/* ========================================== */}
        {/* 1. メインメニュー */}
        {/* ========================================== */}
        {mode === "menu" && (
          <div className={s.buttonGroup}>
            <Button
              variant="dark"
              className={s.largeButton}
              onClick={() => setMode("resume")}
              disabled={!hasData}
            >
              前回の続きから再開{" "}
              {hasData && (
                <span
                  style={{
                    fontSize: "0.8rem",
                    opacity: 0.9,
                    marginLeft: "8px",
                  }}
                >
                  （データあり）
                </span>
              )}
            </Button>

            <Button
              variant="outline"
              className={s.largeButton}
              onClick={() => {
                if (
                  hasData &&
                  !window.confirm(
                    "新しく始めると現在の本番データは消去されます。本当によろしいですか？",
                  )
                )
                  return;
                setMode("new");
              }}
            >
              新しくスケジュールを作る
            </Button>

            <div className={s.divider}></div>

            <Button
              variant="secondary"
              className={s.largeButton}
              onClick={handleDemoStart}
            >
              サンプルデータで操作を試す
            </Button>
          </div>
        )}

        {/* ========================================== */}
        {/* 2. 再開用パスワード入力画面 */}
        {/* ========================================== */}
        {mode === "resume" && (
          <div className={s.inputGroup}>
            <p style={{ textAlign: "center", margin: 0, color: "#475569" }}>
              再開するためのパスワードを入力してください。
            </p>
            
            <div className={s.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="パスワード"
                className={s.passwordInputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* 🌟 再開画面にも目のアイコンを追加してパスワードを確認できるようにしました */}
              <button
                type="button"
                className={s.passwordToggleBtn}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            <Button
              variant="dark"
              className={s.largeButton}
              onClick={handleUnlock}
            >
              ロックを解除
            </Button>

            <div className={s.linkContainer}>
              <Button variant="ghost" onClick={goBack}>
                ← メニューへ戻る
              </Button>
              <Button
                variant="ghost"
                onClick={handleForceReset}
                style={{ color: "#ef4444" }}
              >
                パスワードを忘れた場合
              </Button>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* 3. 新規作成（パスワード設定）画面 */}
        {/* ========================================== */}
        {mode === "new" && (
          <div className={s.inputGroup}>
            <div className={s.warningBox}>
              <h3 className={s.warningTitle}>⚠️ パスワードの管理について</h3>
              <p className={s.warningText}>
                個人情報を守るため、データは暗号化されてPC内に保存されます。
                <br />
                <strong>
                  パスワードを忘れた場合、開発者でもデータの復元はできません。
                </strong>
              </p>
            </div>
            {/* 🌟 1つ目のパスワード入力欄 */}
            <div className={s.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"} // 🌟 Stateで切り替え
                placeholder="復元用パスワードを作成（4文字以上）"
                className={s.passwordInputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={s.passwordToggleBtn}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1} // Tab移動の対象外にする（UX向上）
              >
                {/* 🌟 Lucideアイコンに変更 */}
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            {/* 🌟 2つ目の確認用パスワード入力欄 */}
            <div className={s.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="確認のためもう一度入力"
                className={s.passwordInputField}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <label className={s.disclaimerLabel}>
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                style={{ marginTop: "3px" }}
              />
              <span>
                免責事項：入力データはブラウザ内のみに保存されます。端末やパスワードの管理は自己責任で行い、データ紛失時の復元不可に同意します。
              </span>
            </label>

            <Button
              variant="dark"
              className={s.largeButton}
              onClick={handleNewGame}
              disabled={!isAgreed}
            >
              同意して作成を始める
            </Button>

            <div className={s.centerLink}>
              <Button variant="ghost" onClick={goBack}>
                ← メニューへ戻る
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};