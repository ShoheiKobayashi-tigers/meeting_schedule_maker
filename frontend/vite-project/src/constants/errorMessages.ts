// src/constants/errorMessages.ts

export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  SYNC_FAILED: 'SYNC_FAILED',
  WORKSPACE_NOT_FOUND: 'WORKSPACE_NOT_FOUND',
  AUTH_CODE_INVALID: 'AUTH_CODE_INVALID',
  FORM_CLOSED: 'FORM_CLOSED',
  SUBMISSION_TARGET_NOT_FOUND: 'SUBMISSION_TARGET_NOT_FOUND',
  FETCH_RESPONSES_FAILED: 'FETCH_RESPONSES_FAILED',
  RESTORE_OTP_INVALID: 'ワンタイムパスワードが正しくないか、または有効期限（24時間）が切れています。発行されたメールを再度ご確認ください。',
  RESTORE_TOKENS_MISMATCH: 'アップロードされた児童一覧ファイル（トークン情報）またはURLが、サーバーに保管されている登録内容と一致しません。対象のクラスのファイルか再度ご確認ください。',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

// ユーザーに表示する優しいエラーメッセージの辞書
export const USER_ERROR_MESSAGES: Record<string, string> = {
  NETWORK_ERROR: 'サーバーとの通信に失敗しました。一時的な通信エラーの可能性があります。お手数ですが、接続状況をお確かめの上、少し時間をおいてからもう一度お試しください。',
  UNKNOWN_ERROR: '予期せぬエラーが発生しました。入力項目をお確かめの上、少し時間をおいてからもう一度お試しください。',
  SYNC_FAILED: 'クラウドとの同期に失敗しました。入力項目をお確かめの上、少し時間をおいてからもう一度お試しください。',
  WORKSPACE_NOT_FOUND: '指定された面談フォームが見つかりません。URLが正しいかお確かめください。',
  AUTH_CODE_INVALID: '認証コードが正しくありません。入力内容をお確かめください。',
  FORM_CLOSED: '現在、この面談フォームは回答の受付を停止しています。',
  SUBMISSION_TARGET_NOT_FOUND: '回答の送信先が見つかりませんでした。フォームが新しく作り直された可能性があります。',
  FETCH_RESPONSES_FAILED: '回答データの取得に失敗しました。少し時間をおいてからもう一度お試しください。',

  // 復元用
  RESTORE_OTP_INVALID: 'ワンタイムパスワードが正しくないか、または有効期限（24時間）が切れています。発行されたメールを再度ご確認ください。',
  RESTORE_TOKENS_MISMATCH: 'アップロードされた児童一覧ファイル（トークン情報）またはURLが、サーバーに保管されている登録内容と一致しません。対象のクラスのファイルか再度ご確認ください。',
};

/**
 * エラーコードからユーザー向けのメッセージを安全に取得する関数
 */
export const getErrorMessage = (code: string | null | undefined): string => {
  if (!code) return USER_ERROR_MESSAGES.UNKNOWN_ERROR;
  
  if (code in USER_ERROR_MESSAGES) {
    return USER_ERROR_MESSAGES[code];
  }
  
  // 辞書にない未知のエラーコードやシステムエラーの場合は汎用メッセージにフォールバック
  return USER_ERROR_MESSAGES.UNKNOWN_ERROR;
};