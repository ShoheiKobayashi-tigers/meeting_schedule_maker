// src/features/restore-data/RestoreModal.tsx
import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { useAppStore } from '../../store/useAppStore';
import { parseExcelFile, downloadRestoreTemplate } from '../../utils/excelUtils';
import { setSessionPassword, decryptFromCloud } from '../../utils/secureStorage';
import { Button } from '../../components/ui/Button/Button';
import { getErrorMessage } from '../../constants/errorMessages';
import * as s from './RestoreModal.css';

const STORAGE_KEY = "student-app-storage";

type RestoreStep = 1 | 2 | 3;

export const RestoreModal: React.FC = () => {
  const isRestoreModalOpen = useAppStore((state) => state.ui.isRestoreModalOpen);
  const setRestoreModalOpen = useAppStore((state) => state.setRestoreModalOpen);
  const resetAll = useAppStore((state) => state.resetAll);
  const setHasEntered = useAppStore((state) => state.setHasEntered);

  // ステップ管理
  const [currentStep, setCurrentStep] = useState<RestoreStep>(1);

  // 各ステップの入力値
  const [otp, setOtp] = useState('');
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [loginUrl, setLoginUrl] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // 検証突破後にサーバーから受け取ったデータを一時保持するメモリ
  const [serverPayload, setServerPayload] = useState<any>(null);
  const [extractedSecretKey, setExtractedSecretKey] = useState('');
  const [extractedWorkspaceId, setExtractedWorkspaceId] = useState('');
  const [parsedApplicants, setParsedApplicants] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isRestoreModalOpen) return null;
  
  // ファイル選択時のハンドラー関数
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setExcelFile(e.target.files[0]);
    }
  };
  // --- 【Step 1】OTPの存在チェック ---
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!otp) return setErrorMsg('ワンタイムパスワードを入力してください。');

    setLoading(true);
    try {
      // サーバー側でOTPが有効かだけを仮チェックするエンドポイント（失効はさせない）
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/workspaces/restore/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(getErrorMessage(json.code || 'RESTORE_OTP_INVALID'));
      }

      // OTPが正しければ Step 2 へ進む
      setCurrentStep(2);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 【STEP 2】エクセルとURLの完全一致バリデーション ---
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!excelFile || !loginUrl) return setErrorMsg('ファイルとURLを両方指定してください。');

    let workspaceId = '';
    let secretKey = '';
    try {
      const urlObj = new URL(loginUrl);
      const pathParts = urlObj.pathname.split('/');
      workspaceId = pathParts[pathParts.indexOf('p') + 1];
      secretKey = urlObj.hash.substring(1);
      if (!workspaceId || !secretKey) throw new Error();
    } catch (err) {
      setErrorMsg('保護者ログイン用URLの形式が正しくありません。\n末尾の「#」以降の文字列まで含めて入力してください。');
      return;
    }

    setLoading(true);
    try {
      const rawExcelData = await parseExcelFile(excelFile);
      if (rawExcelData.length === 0) throw new Error('児童一覧ファイルにデータが含まれていません。');

      // 2. パース処理を「出席番号」「苗字」「名前」「認証トークン」の直接取得に修正
      const applicantsBase = rawExcelData.map((row: any) => {
        return {
          id: `app-${crypto.randomUUID()}`,
          student_id: String(row['出席番号'] || ''),
          family_name: String(row['苗字'] || '').trim(),
          first_name: String(row['名前'] || '').trim(),
          token: String(row['認証トークン'] || '').trim(), // ここで突合
          preferred_dates: [],
        };
      });

      const excelTokens = applicantsBase.map(a => a.token);

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/workspaces/restore/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspace_id: workspaceId, otp, excelTokens }),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(getErrorMessage(json.code || 'RESTORE_TOKENS_MISMATCH'));
      }

      const payload = await res.json();
      
      setServerPayload(payload);
      setExtractedSecretKey(secretKey);
      setExtractedWorkspaceId(workspaceId);
      setParsedApplicants(applicantsBase);
      setCurrentStep(3);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 【Step 3】新しいパスワードで暗号化してZustandにコミット ---
  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newPassword || !confirmPassword) return setErrorMsg('パスワードを入力してください。');
    if (newPassword.length < 4) return setErrorMsg('パスワードは4文字以上で入力してください。');
    if (newPassword !== confirmPassword) return setErrorMsg('確認用パスワードが一致しません。');

    // 離脱防止ガードをON
    const preventClose = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "データ復元完了処理中です。ページを閉じないでください。";
    };
    window.addEventListener('beforeunload', preventClose);
    setLoading(true);

    try {
      const { formSettings, guardianResponses } = serverPayload;

      // 暗号化データの復号と結合処理（がっちゃんこ）
      const decRows = decryptFromCloud(formSettings.rows, extractedSecretKey) || [];
      const decCols = decryptFromCloud(formSettings.cols, extractedSecretKey) || [];
      const decAvailability = decryptFromCloud(formSettings.availability, extractedSecretKey) || [];
      const decEventName = decryptFromCloud(formSettings.event_name, extractedSecretKey) || "";
      const decClassName = decryptFromCloud(formSettings.class_name, extractedSecretKey) || "";
      const decFormMessage = decryptFromCloud(formSettings.message, extractedSecretKey) || "";

      const finalApplicants = parsedApplicants.map(app => {
        const matchResponse = guardianResponses.find((r: any) => r.token === app.token);
        let dates: string[] = [];
        if (matchResponse && matchResponse.preferred_dates) {
          dates = decryptFromCloud(matchResponse.preferred_dates, extractedSecretKey) || [];
        }
        return { ...app, preferred_dates: dates, is_fixed: false, is_last_slot: false, needs_gap_after: false };
      });

      // Zustandストアの上書き
      setSessionPassword(newPassword);
      resetAll();

      useAppStore.setState({
        db: {
          workspaceId: extractedWorkspaceId,
          secretKey: extractedSecretKey,
          applicants: finalApplicants,
          siblings: [],
          step3Mode: 'form',
          autoAssignmentConfig: { sibling_slot_gap: 2 },
          schoolSettings: {
            eventName: decEventName, className: decClassName, formMessage: decFormMessage,
            letterMessage: "", distributionDate: "", limitDate: formSettings.limit_date || "",
            isOpened: formSettings.is_opened ?? true,
            schoolName: "", principalName: "", senderName: "", resultDistributionDate: "", resultLetterMessage: ""
          },
          scheduleData: { rows: decRows, cols: decCols, availability: decAvailability, assignments: decRows.map(() => decCols.map(() => null)) }
        }
      });

      // LocalStorageへの同期暗号化保存
      localStorage.setItem(
        STORAGE_KEY,
        CryptoJS.AES.encrypt(
          JSON.stringify({ state: { db: useAppStore.getState().db }, version: 0 }),
          newPassword
        ).toString()
      );

      setHasEntered(true);
      window.removeEventListener('beforeunload', preventClose);
      setRestoreModalOpen(false);
      
      alert("🎉 データの復元に成功しました！");
      window.location.reload();
    } catch (err: any) {
      setErrorMsg('最終書き込み中にエラーが発生しました。');
      window.removeEventListener('beforeunload', preventClose);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setCurrentStep(1);
    setOtp(''); setExcelFile(null); setLoginUrl(''); setNewPassword(''); setConfirmPassword('');
    setRestoreModalOpen(false);
  };

  return (
    <div className={s.overlay}>
      <div className={s.container}>
        <h2 className={s.title}>🔒 システム復元ウィザード</h2>
        
        {/* ステップインジケーター */}
        <div className={s.stepIndicator}>
          <span className={currentStep === 1 ? s.activeStep : s.inactiveStep}>1. パスワード認証</span>
          <span className={currentStep === 2 ? s.activeStep : s.inactiveStep}>2. データ検証</span>
          <span className={currentStep === 3 ? s.activeStep : s.inactiveStep}>3. パスワード設定</span>
        </div>

        {errorMsg && <div className={s.errorMessage}>{errorMsg}</div>}

        {/* --- 【STEP 1】ワンタイムパスワード入力 --- */}
        {currentStep === 1 && (
          <form onSubmit={handleStep1Submit} className={s.form}>
            <div className={s.field}>
              <label className={s.label}>開発者から届いたワンタイムパスワードを入力してください</label>
              <input 
                type="text" placeholder="例: OTP-XXXXXX" className={s.input}
                value={otp} onChange={(e) => setOtp(e.target.value)} disabled={loading}
              />
            </div>
            <div className={s.footer}>
              <Button variant='outline' type="button" onClick={handleClose}>閉じる</Button>
              <Button variant='dark' type="submit" disabled={loading}>
                {loading ? '認証中...' : '次へ進む'}
              </Button>
            </div>
          </form>
        )}

        {/* --- 【STEP 2】名簿とURLの突合検証 --- */}
        {currentStep === 2 && (
          <form onSubmit={handleStep2Submit} className={s.form}>
            
            {/* 3. UIの変更：ひな形ダウンロードボタンの設置 */}
            <div className={s.field}>
              <label className={s.label}>① 復元用児童一覧ファイルの準備</label>
              <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                手元に名簿データ（.xlsx）がない場合は、まずひな形をダウンロードし、出席番号、苗字、名前、および配付プリントに記載されている6桁の認証トークンを入力して保存してください。
              </p>
              <Button 
                variant="outline" 
                type="button" 
                onClick={downloadRestoreTemplate} 
                style={{ width: 'fit-content', marginBottom: '16px' }}
              >
                復元用ひな形をダウンロード (.xlsx)
              </Button>
            </div>

            <div className={s.field}>
              <label className={s.label}>② 作成したファイルの選択</label>
              <input type="file" accept=".xlsx" onChange={handleFileChange} disabled={loading} style={{ fontSize: '0.85rem', marginBottom: '16px' }} />
            </div>

            <div className={s.field}>
              <label className={s.label}>③ お手元の「保護者ログイン用URL」</label>
              <input 
                type="text" placeholder="https://.../p/xxxxxx#yyyyyy" className={s.urlInput}
                value={loginUrl} onChange={(e) => setLoginUrl(e.target.value)} disabled={loading}
              />
            </div>

            <div className={s.footer}>
              <Button variant='outline' type="button" onClick={() => setCurrentStep(1)} disabled={loading}>戻る</Button>
              <Button variant='dark' type="submit" disabled={loading}>
                {loading ? 'データを検証中...' : 'データを検証する'}
              </Button>
            </div>
          </form>
        )}

        {/* --- 【STEP 3】再暗号化用パスワードの設定 --- */}
        {currentStep === 3 && (
          <form onSubmit={handleStep3Submit} className={s.form}>
            <div className={s.successBox}>
              検証に成功しました！データを安全に再構築するため、新しいアプリ復元用パスワードを設定してください。
            </div>
            <div className={s.field}>
              <label className={s.label}>新しいパスワード（4文字以上）</label>
              <input 
                type="password" placeholder="新しいパスワードを入力" className={s.passwordInput}
                value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={loading}
              />
              <input 
                type="password" placeholder="確認のためもう一度入力" className={s.input}
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading}
              />
            </div>
            <div className={s.footer}>
              <Button variant='dark' type="submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? '復元完了処理を実行中...' : '復元を完了してアプリを再開する'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};