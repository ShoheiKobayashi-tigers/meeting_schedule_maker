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
          <li><strong>操作手順の改善：</strong>「Step1（面談枠の作成）」と「Step2（名簿の準備）」の順番を入れ替え、より自然な流れでスケジュールを組めるように改善しました。</li>
          <li><strong>作業再開時の挙動の改善：</strong>スタート画面からアプリに戻った際、前回最後に開いていた画面から自動的に再開されるようになりました。</li>
          <li><strong>リセット機能の追加：</strong>現在のデータを消去して最初からやり直せる「リセット」ボタンを画面上部に追加しました。</li>
          <li><strong>デモモードの追加：</strong>実際のデータを入れる前に、サンプルデータを使って操作感を試せる「デモモード」を実装しました。</li>
          <li><strong>セキュリティと安定性の向上：</strong>データの保護（セキュリティ）を大幅に強化しました。また、画面の見た目の微調整や、内部システムの大規模な改修を行い、アプリ全体の動作がより快適・安定しました。</li>
          <li><strong>利用規約（仮）等の表示：</strong>ヘッダーに利用規約（仮）等を追加しました</li>
        </ul>
        
        {/* 今後のリリースで追記していく */}
      </div>
    </BaseInfoModal>
  );
};