// src/pages/public/LandingPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import * as styles from './LandingPage.css'

import { useAppStore } from '../../store/useAppStore';
import { setSessionPassword, setForceDemoMode } from "../../utils/secureStorage"; 
import { TermsOfServiceModal } from '../../components/modals/TermsOfServiceModal';
import { PrivacyPolicyModal } from '../../components/modals/PrivacyPolicyModal';

// FAQ用のアコーディオンコンポーネント
const FAQItem: React.FC<{ question: string; answer: React.ReactNode }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.faqItem}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={styles.faqButton}
        aria-expanded={isOpen}
      >
        <span>Q. {question}</span>
        <span>{isOpen ? '−' : '＋'}</span>
      </button>
      {isOpen && <div className={styles.faqContent}>{answer}</div>}
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setTermsModalOpen, setPrivacyModalOpen, setHasEntered, loadDemoData } = useAppStore();

  // ★ StartPage と同じ「デモ環境のセットアップ＆遷移」関数を作成
  const handleDemoStart = async (e: React.MouseEvent) => {
    e.preventDefault(); // （もしLinkタグなどの場合、デフォルトの遷移を防ぐ）
    
    setForceDemoMode(true); 
    setSessionPassword("demo-mode"); // 合鍵を渡す
    loadDemoData();                  // デモデータを注入
    await useAppStore.persist.rehydrate(); // Zustandの永続化を同期
    setHasEntered(true);             // 入室フラグをON
    
    navigate("/demo/step1/datetime"); // 準備完了してから遷移！
    
    setTimeout(() => {
        setForceDemoMode(false);
    }, 500);
  };
  return (
    <>
    <div className={styles.wrapper}>
      
      {/* --- 目次ナビゲーション（追従ヘッダー） --- */}
      <header className={styles.header}>
        <a href="#" className={styles.headerTitle}>個人面談・三者面談 スケジュールメーカー</a>
        <nav className={styles.headerNav}>
          <a href="#overview" className={styles.navLink}>概要</a>
          <a href="#how-to-use" className={styles.navLink}>使い方</a>
          <a href="#security" className={styles.navLink}>セキュリティ</a>
          <a href="#faq" className={styles.navLink}>FAQ</a>
        </nav>
        <Link to="/app" className={styles.headerBtn}>無料で始める</Link>
      </header>

      <main>
        {/* --- Hero Section (ファーストビュー) --- */}
        <section className={styles.bgGreenLight} style={{ textAlign: 'center' }}>
          <div className={styles.sectionInner}>
            <span className={styles.heroBadge}>完全無料・面倒なアカウント登録なし</span>
            <h1 className={styles.heroTitle}>
              面談の日程調整を<br />「一瞬」で終わらせる。
            </h1>
            <p className={styles.heroText}>
              名簿の読み込み、兄弟姉妹の自動割り当て、QRコード付き案内プリントの出力まで。<br/>
              学校の厳しいセキュリティ基準もクリアした、先生のための無料ツール。
            </p>
            
            <div className={styles.buttonGroup}>
              <Link to="/app" className={styles.primaryBtn}>無料で使ってみる</Link>
              <button className={styles.secondaryBtn} onClick={handleDemoStart}>デモを体験する</button>
            </div>
            
            {/* ※ここにGIF動画を配置するプレースホルダー */}
                <div className={styles.videoWrapper}>
                    <video
                        className={styles.videoPlayer}
                        style={{ aspectRatio: '1920 / 900' }}
                        autoPlay
                        loop
                        muted
                        playsInline
                        // preload="auto" // ファーストビューにあるので最初から読み込む
                        poster="/videos/demo-poster.jpg" // 【推奨】動画が読み込まれる前に表示する画像
                    >
                        {/* publicフォルダ直下をルート (/) としてパスを指定します */}
                        <source src="/videos/demo-animation.mp4" type="video/mp4" />
                        <p>お使いのブラウザは動画の再生に対応していません。</p>
                    </video>
                </div>
            </div>
        </section>

        {/* --- 1. 概要 (Overview) --- */}
        <section id="overview" className={styles.bgWhite}>
          <div className={styles.sectionInnerWide}>
            <h2>圧倒的に選ばれる4つの理由</h2>
            
            <div className={styles.grid}>
              <article className={styles.featureCard}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🤖</div>
                <h3>兄弟姉妹も自動で調整</h3>
                <p>手作業ではパズルのように複雑な兄弟の調整を、システムが一瞬で解決。「一番最後にして」などの要望や、先生の休憩時間確保にも対応します。</p>
              </article>

              <article className={styles.featureCard}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🖨️</div>
                <h3>専用QRコード付きプリントをWord出力</h3>
                <p>保護者に配付する「専用QRコード付き案内プリント」をWordファイル（.docx）で一括生成。ダウンロード後に学校独自の書式へ微調整が可能です。</p>
              </article>

              <article className={styles.featureCard}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📊</div>
                <h3>いつものExcel名簿をそのまま読込</h3>
                <p>新しいツール導入時の「名簿登録の手間」をゼロに。先生が普段お使いのExcel生徒名簿をそのままインポートし、すぐに使い始められます。</p>
              </article>

              <article className={styles.featureCard}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📱</div>
                <h3>紙とデジタルのハイブリッド回収</h3>
                <p>スマホからのWeb回答はもちろん、紙で提出された希望も先生が代行入力可能。すべての回答を統合して自動割り当てにかけられます。</p>
              </article>
            </div>
          </div>
        </section>

        {/* --- 2. 使い方 (How to use) --- */}
        <section id="how-to-use" className={styles.bgGray}>
          <div className={styles.sectionInner}>
            <h2>使い方はとても簡単（5ステップ）</h2>
            
            <div>
              <article className={styles.stepCard}>
                <h3 style={{ color: '#16a34a' }}>Step 1. スケジュール枠の準備</h3>
                <p>面談を実施する日程と、1枠あたりの時間（15分など）を設定するだけで、ベースとなるタイムテーブルが完成します。</p>
              </article>
              
              <article className={styles.stepCard}>
                <h3 style={{ color: '#16a34a' }}>Step 2. 名簿のインポート</h3>
                <p>Excelから生徒名簿を読み込みます（手入力可）。同校に兄弟姉妹がいる場合は、ここで設定しておくことで自動調整の対象になります。</p>
              </article>
              
              <article className={styles.stepCard}>
                <h3 style={{ color: '#16a34a' }}>Step 3. 希望日程の回収（Word生成）</h3>
                <p>システムが全児童分の「専用QRコード付きプリント」をWordで自動生成します。保護者はスマホから簡単に希望日時を提出できます。</p>
                <p>従来通り、紙のお手紙で回収したものを手動で入力することも可能です。</p>
              </article>
              
              <article className={styles.stepCard}>
                <h3 style={{ color: '#16a34a' }}>Step 4. スケジュールの自動割当</h3>
                <p>集まった希望をもとに、ボタン一つでシステムが最適なスケジュールを自動で組み上げます。ドラッグ＆ドロップ微調整も可能です。</p>
              </article>

              <article className={styles.stepCard}>
                <h3 style={{ color: '#16a34a' }}>Step 5. 結果の出力（Word生成）</h3>
                <p>完成した日程表を、保護者配付用のおたより（Word）や、先生の手元用Excelデータとしてエクスポートして完了です。</p>
              </article>
            </div>
          </div>
        </section>

        {/* --- 3. セキュリティ (Security) --- */}
        <section id="security" className={styles.bgDark}>
          <div className={styles.sectionInner} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛡️</div>
            <h2 style={{ color: 'white' }}>学校の厳しいセキュリティ基準をクリア</h2>
            
            <div className={styles.securityBox}>
              <p style={{ color: '#d1d5db', fontSize: '1.1rem', marginBottom: '16px' }}>
                教育現場で新しいツールを導入する際、最大の壁となるのが「個人情報の取り扱いルール（クラウド利用制限）」です。
              </p>
              <p style={{ color: '#d1d5db', fontSize: '1.1rem', marginBottom: '16px' }}>
                本アプリは、児童・生徒の氏名を含む名簿データを<strong>お使いのパソコンのブラウザ内（ローカル）にのみ暗号化して保存</strong>します。インターネット上のサーバーに個人の特定が可能な情報が送信されることは一切ありません。
              </p>
              <p style={{ color: '#d1d5db', fontSize: '1.1rem' }}>
                また、保護者から希望日程をオンライン回収する通信には<strong>「ゼロ知識暗号化」</strong>を採用しています。クラウドには暗号化されたデータのみが置かれ、復号する「鍵」は配付用プリントのQRコード内にしか存在しません。開発者すらデータを解読できない構造により、情報漏洩リスクを極限まで抑えています。
              <br/>※詳細は
              <button 
                onClick={() => setTermsModalOpen(true)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline' }}
                >
                プライバシーポリシー
              </button>
              をご参照ください。
              </p>
            </div>
          </div>
        </section>

        {/* --- 4. FAQ (Frequently Asked Questions) --- */}
        <section id="faq" className={styles.bgWhite}>
          <div className={styles.sectionInner}>
            <h2>よくあるご質問（FAQ）</h2>
            
            <div className={styles.faqContainer}>
              <FAQItem 
                question="本当に無料ですか？後から有料になりませんか？" 
                answer="はい、完全無料です。本ツールは教育現場の多忙化解消を目的として個人開発されたものであり、すべての機能を無料で制限なくご利用いただけます。" 
              />
              <FAQItem 
                question="学校の共有PCでも使えますか？" 
                answer="お使いいただけます。ただし、データはブラウザ（EdgeやChromeなど）に保存されるため、作業途中で別のPCに移動することは現状できません。同じPC・ブラウザでアクセスし、パスワードを入力することで続きから作業できます。" 
              />
              <FAQItem 
                question="保護者はアプリをインストールする必要がありますか？" 
                answer="不要です。先生が配付したプリントのQRコードをスマホのカメラで読み取ると、そのままブラウザ上で希望日時の入力画面が開きます。" 
              />
              <FAQItem 
                question="スマホを持たない保護者や、紙で提出したい保護者がいる場合は？" 
                answer="紙での提出にも対応しています。「手入力モード」を使って、紙で回収した希望日時を先生が代行入力することで、Webからの回答と合算して自動割り当てを行うことができます。" 
              />
              <FAQItem 
                question="パスワードを忘れてしまった場合はどうなりますか？" 
                answer="セキュリティの仕様（ゼロ知識暗号化）上、パスワードを忘れると復旧できず、データは完全にリセットされます。パスワードは必ず手元に控えておくようお願いいたします。" 
              />
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className={styles.footer}>
        <div className={styles.sectionInner}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', color: 'white' }}>
            面談準備の「パズル」から解放されましょう
          </h2>
          <div style={{ marginBottom: '40px' }}>
            <Link to="/app" className={styles.primaryBtn}>
              今すぐ無料で使い始める
            </Link>
          </div>
          <div className={styles.footerLinks}>
            <button 
              onClick={() => setTermsModalOpen(true)}
              style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline' }}
            >
              利用規約
            </button>
            <button 
              onClick={() => setPrivacyModalOpen(true)}
              style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline' }}
            >
              プライバシーポリシー
            </button>
            <a href="https://forms.gle/GMqBkzefmF3EAASx7" target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af' }}>
              お問い合わせ・不具合報告
            </a>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            &copy; {new Date().getFullYear()} 個人面談・三者面談 スケジュールメーカー All rights reserved.
          </div>
        </div>
      </footer>
    </div>
      <TermsOfServiceModal />
      <PrivacyPolicyModal />
    </>
  );
};