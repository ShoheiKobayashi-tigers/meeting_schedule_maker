import React from 'react';
import * as s from './ImportStep.css';

export const SyncStep: React.FC = () => {
  return (
    <div className={s.container}>
      <section className={s.section}>
        <h4 className={s.sectionTitle}>4. クラウド同期と回答待機</h4>
        <p className={s.description}>
          現在の名簿情報をクラウドにアップロードし、保護者からの入力を受け付けます。
        </p>

        <div className={s.previewCard} style={{ padding: '24px', textAlign: 'center' }}>
          <p>ステータス: <strong>オフライン</strong></p>
          <button>クラウドと同期を開始する</button>
        </div>
      </section>
    </div>
  );
};