import { Announcement } from '../types';

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'apology-guardian-form-20260512',
    title: '【復旧済】保護者フォームの不具合に関するお詫び',
    isActive: false, // 公開を終了する場合はここを false にする
    content: (
      <div style={{ lineHeight: '1.6', color: '#333' }}>
        <p style={{ marginBottom: '1em' }}>
          5月5日から5月12日夜にかけて、ステップ3「保護者フォーム」の設定保存や回答取得ができない不具合が発生しておりました。
        </p>
        <p style={{ marginBottom: '1em' }}>
          システムアップデート時の設定不備が原因でしたが、現在は修正が完了し、すべて正常にご利用いただけます。
        </p>
        <p style={{ marginBottom: '1em' }}>
          ご不便をおかけしましたことを深くお詫び申し上げます。<br />
          また、不具合をご報告いただいた皆様、誠にありがとうございました。
        </p>
        <p>今後の再発防止と品質向上に努めてまいります。</p>
      </div>
    ),
  },
  {
    id: 'feature-restore-data-20260705',
    title: '🎉【新機能】パスワード忘失・データ消滅時の「データ復元機能」を追加しました',
    // 💡 7月末まで自動で表示し、8月1日になったら自動で非表示にするロジック（または手動でfalseにする）
    isActive: new Date() < new Date('2026-08-01'), 
    content: (
      <div style={{ lineHeight: '1.6', color: '#1e293b' }}>
        <p style={{ marginBottom: '1em' }}>
          「前回の続きから再開するパスワードを忘れてしまった」「ブラウザのキャッシュを削除してデータが消えてしまった」という場合でも、<strong>保護者から集まった希望日時の回答データを安全に救出してアプリを再開できる機能</strong>を実装しました！
        </p>
        <p style={{ marginBottom: '1em', padding: '10px 12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', color: '#166534', fontSize: '0.9rem' }}>
          💡 <strong>安心のセキュリティ設計</strong><br />
          当システムの独自仕様である「ゼロ知識暗号化」を維持したまま復元を行うため、復元作業中に児童・生徒の氏名や出席番号などの個人情報が開発者（運営側）へ送信・記録されることは一切ありません。
        </p>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
          ※復元には「以前エクスポートした児童一覧Excelファイル」と「保護者ログイン用URL」がお手元にある必要があります。詳細は、トップ画面の「パスワードを忘れた場合」から復元申請フォームをご確認ください。
        </p>
      </div>
    ),
  },
  // 今後、別のお知らせを追加したい場合はここに行を追加するだけ
  /*
  {
    id: 'update-feature-20260601',
    title: '【新機能】新機能が追加されました！',
    isActive: false,
    content: ( ... )
  }
  */
];