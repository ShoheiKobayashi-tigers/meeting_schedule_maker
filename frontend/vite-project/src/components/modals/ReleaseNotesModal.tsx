// src/components/modals/ReleaseNotesModal.tsx
import React from 'react';
import { BaseInfoModal } from '../ui/Modal/BaseInfoModal'; // 🌟 修正
import { useAppStore } from '../../store/useAppStore';

export const ReleaseNotesModal: React.FC = () => {
  const isOpen = useAppStore(state => state.ui.isReleaseNotesModalOpen);
  const setOpen = useAppStore(state => state.setReleaseNotesModalOpen);

  return (
    <BaseInfoModal title="更新情報" isOpen={isOpen} onClose={() => setOpen(false)}> {/* 🌟 修正 */}
      <div>
        <h3>v1.0.0-beta (2026/02/28)</h3>
        <ul>
          <li>β版を公開しました。</li>
          <li>自動割り当て機能の基本ロジックを実装しました。</li>
        </ul>
        <h3>v2.0.0-beta (2026/03/04)</h3>
        <ul>
          <li><strong>操作手順の改善：<br/></strong>「Step1（面談枠の作成）」と「Step2（名簿の準備）」の順番を入れ替え、より自然な流れでスケジュールを組めるように改善しました。</li>
          <li><strong>作業再開時の挙動の改善：<br/></strong>スタート画面からアプリに戻った際、前回最後に開いていた画面から自動的に再開されるようになりました。</li>
          <li><strong>リセット機能の追加：<br/></strong>現在のデータを消去して最初からやり直せる「リセット」ボタンを画面上部に追加しました。</li>
          <li><strong>デモモードの追加：<br/></strong>実際のデータを入れる前に、サンプルデータを使って操作感を試せる「デモモード」を実装しました。</li>
          <li><strong>セキュリティと安定性の向上：<br/></strong>データの保護（セキュリティ）を大幅に強化しました。また、画面の見た目の微調整や、内部システムの大規模な改修を行い、アプリ全体の動作がより快適・安定しました。</li>
          <li><strong>利用規約（仮）等の表示：<br/></strong>ヘッダーに利用規約（仮）等を追加しました</li>
        </ul>
        <h3>v2.1.0-beta (2026/03/04)</h3>
        <ul>
          <li><strong>LP（ランディングページ）の追加：<br/></strong>
            本アプリの特徴や、ご利用の5ステップを分かりやすく紹介するトップページを新設しました。先生方が安心して導入できるよう、セキュリティ仕様の解説やFAQも掲載しています。
          </li>
          <li><strong>利用規約とプライバシーポリシーの策定：<br/></strong>
            学校現場の厳しい情報保護ルール下でも安心してご利用いただけるよう、データの取り扱いや免責事項を明確に定めた規約を公開しました。（本サービスヘッダーまたはLPのフッターのリンクからいつでもご確認いただけます）
          </li>
          <li><strong>クラウドデータベースのセキュリティ強化：<br/></strong>
            保護者から希望日程をオンライン回収する際の通信において、「ゼロ知識暗号化（URLハッシュキー方式）」を導入しました。サーバーには暗号化された無意味な文字列のみが保存され、復号するための「鍵」はプリントのQRコード（URL）にのみ存在します。これにより、開発者や第三者がデータを解読することは数学的に100%不可能な、極めて安全なシステムを達成しました。
          </li>
        </ul>
        <h3>v2.1.1-beta (2026/03/04)</h3>
        <ul>
          <li><strong>不具合修正（デモモード使用後の挙動）：<br/></strong>
            デモモードを使用すると、設定した復元用パスワードがデモモード用に変わってしまう不具合を修正いたしました。
          </li>
        </ul>
        <h3>v2.1.2-beta (2026/03/05)</h3>
        <ul>
          <li><strong>不具合修正（希望日程手入力画面）：<br/></strong>
            1つ以上枠を選択すると、他のボタンが使用できなくなる不具合を修正いたしました。
          </li>  
          <li><strong>不具合修正（保護者フォーム）：<br/></strong>
            保護者がログインできなくなってしまっていた不具合を修正いたしました。
          </li>
          <li><strong>不具合修正（希望日程登録関連）：<br/></strong>
            面談不可の枠も登録できてしまう不具合を修正いたしました。
          </li>
        </ul>
        
        {/* 今後のリリースで追記していく */}
      </div>
    </BaseInfoModal>
  );
};