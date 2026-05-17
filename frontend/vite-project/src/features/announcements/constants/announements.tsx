import { Announcement } from '../types';

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'apology-guardian-form-20260512',
    title: '【復旧済】保護者フォームの不具合に関するお詫び',
    isActive: true, // 公開を終了する場合はここを false にする
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