// src/pages/public/LandingPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import * as s from './LandingPage.css'

import { useAppStore } from '../../store/useAppStore';
import { setSessionPassword, setForceDemoMode } from "../../utils/secureStorage"; 
import { NinjaAd } from '../../components/NinjaAd';
import { ArrowRight, SquareDashed, Users, PenTool, FileSpreadsheet, Printer } from 'lucide-react';

// FAQ用のアコーディオンコンポーネント
const FAQItem: React.FC<{ question: string; answer: React.ReactNode }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={s.faqItem}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={s.faqButton}
        aria-expanded={isOpen}
      >
        <span>Q. {question}</span>
        <span>{isOpen ? '−' : '＋'}</span>
      </button>
      {isOpen && <div className={s.faqContent}>{answer}</div>}
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setHasEntered, loadDemoData } = useAppStore();

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
    <div className={s.wrapper}>
      
      {/* --- 目次ナビゲーション（追従ヘッダー） --- */}
      <header className={s.header}>
        <a href="#" className={s.headerTitle}>個人面談・三者面談 スケジュールメーカー</a>
        <nav className={s.headerNav}>
          <a href="#overview" className={s.navLink}>概要</a>
          <a href="#how-to-use" className={s.navLink}>使い方</a>
          <a href="#security" className={s.navLink}>セキュリティ</a>
          <a href="#faq" className={s.navLink}>FAQ</a>
        </nav>
        <Link to="/app" className={s.headerBtn}>無料で始める</Link>
      </header>

      <main>
        {/* --- Hero Section (ファーストビュー) --- */}
        <section className={s.bgGreenLight} style={{ textAlign: 'center' }}>
          <div className={s.sectionInner}>
            <span className={s.heroBadge}>完全無料・面倒なアカウント登録なし</span>
            <h1 className={s.heroTitle}>
              面談の日程調整を<br />「一瞬」で終わらせる。
            </h1>
            <p className={s.heroText}>
              名簿の読み込み、兄弟姉妹の自動割り当て、QRコード付き案内プリントの出力まで。<br/>
              学校の厳しいセキュリティ基準もクリアした、先生のための無料ツール。
            </p>
            
            <div className={s.buttonGroup}>
              <Link to="/app" className={s.primaryBtn}>無料で使ってみる</Link>
              <button className={s.secondaryBtn} onClick={handleDemoStart}>デモを体験する</button>
            </div>
            
            {/* ※ここにGIF動画を配置するプレースホルダー */}
                <div className={s.videoWrapper}>
                    <video
                        className={s.videoPlayer}
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
        <section id="overview" className={s.bgWhite}>
          <div className={s.sectionInnerWide}>
            <h2>先生の負担を劇的に減らす、唯一無二の特長</h2>
            
            {/*  特大カード1 */}
            <article className={s.featuredCard}>
              <div>
                <div className={s.primaryBadge}>
                  最大の特長
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>
                  パズルのような兄弟調整も<br/>「一瞬」で自動完了
                </h3>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                  手作業では最も頭を悩ませる「AくんとBさんは兄弟だから同じ日の連続した時間に…」という複雑な条件を、システム独自のアルゴリズムが一瞬で解決。余裕をもたせた枠の確保や、「一番最後にしてほしい」などの個別要望にも完璧に対応します。
                </p>
              </div>
              {/* 📸 「Before/After」のシナリオ型 */}
              <div className={s.scenarioContainer}>
                
                {/* シナリオ1：兄弟の調整 */}
                <div className={s.scenarioRow}>
                  {/* ★ 絵文字を Lucide の Users アイコンに変更 */}
                  <div className={s.scenarioLabel}>
                    <Users size={20} color="#16a34a" /> 
                    兄弟がいる保護者の待ち時間を設定（連続枠も可）
                  </div>
                  <div className={s.scenarioImages}>
                    <img src="/images/setting-sibling.png" alt="兄弟リンクの設定" className={s.scenarioImage} />
                    <ArrowRight className={s.scenarioArrow} />
                    <img src="/images/result-sibling.png" alt="連続配置されたスケジュール" className={s.scenarioImage} />
                  </div>
                </div>

                {/* シナリオ2：休憩・空き枠の確保 */}
                <div className={s.scenarioRow}>
                  {/* ★ 絵文字を Lucide の Coffee アイコンに変更 */}
                  <div className={s.scenarioLabel}>
                    <SquareDashed size={20} color="#16a34a" /> 
                    「この子の後には空き枠を確保したい」という希望にも対応
                  </div>
                  <div className={s.scenarioImages}>
                    <img src="/images/setting-break.png" alt="休憩枠のブロック設定" className={s.scenarioImage} />
                    <ArrowRight className={s.scenarioArrow} />
                    <img src="/images/result-break.png" alt="空き枠が確保されたスケジュール" className={s.scenarioImage} />
                  </div>
                </div>

              </div>
            </article>
            {/*  特大カード2 */}
            <article className={s.featuredCard} style={{ borderColor: '#40fc28' }}>
              <div>
                <div className={s.primaryBadge}>
                  もうひとつの特長
                </div>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>
                  大量の紙とデータ入力から解放。<br/>スマホで希望日を「自動集計」
                </h3>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: '#4b5563' }}>
                  面談準備で一番の重労働だった「回収した紙を見ながらパソコンに入力する作業」をゼロに。システムが発行するQRコード付きのおたよりを配付するだけで、保護者がスマホから提出したデータは、ボタン一つで先生の手元へ安全に同期・自動集計されます。
                </p>
              </div>
              
              {/* 📸 4枚の画像を田の字（2x2）で並べるストーリーテリング */}
              <div className={s.fourImageGrid}>
                <div className={s.gridImageWrapper}>
                  <div className={s.gridImageLabel}>① おたより設定画面</div>
                  <img src="/images/form-setting.png" alt="お便り設定画面" className={s.gridImage} />
                </div>
                <div className={s.gridImageWrapper}>
                  <div className={s.gridImageLabel}>② QRコード付きおたより発行</div>
                  <img src="/images/form-print.png" alt="QRコードのお便り" className={s.gridImage} />
                </div>
                <div className={s.gridImageWrapper}>
                  <div className={s.gridImageLabel}>③ 保護者のスマホ画面（ログイン・入力）</div>
                  <img src="/images/form-mobile.png" alt="保護者フォーム入力画面" className={s.gridImage} />
                </div>
                <div className={s.gridImageWrapper}>
                  <div className={s.gridImageLabel}>④ ワンクリックで希望日程を同期・一覧化</div>
                  <img src="/images/form-dashboard.png" alt="入力状況の確認画面" className={s.gridImage} />
                </div>
              </div>
            </article>

            {/* 🌟 サポートする3つの強み（3列グリッド） */}
            <div className={s.subGrid}>
              
              {/* 1. 手入力（個人利用の救済措置） */}
              <article className={s.featureCard}>
                <PenTool size={40} className={s.subFeatureIcon} />
                <h3 style={{ minHeight: '30%'}}>学校の許可がなくても大丈夫<br/>［紙 ＋ 手入力モード］</h3>
                <p style={{ fontSize: '0.95rem' }}>「うちの学校ではWebフォーム導入はハードルが高い…」という場合でも安心。従来通り紙で回収し、先生の手元で代行入力すれば、強力な自動調整の恩恵だけを個人のクラスで受けられます。</p>
              </article>

              {/* 2. Excel読込 */}
              <article className={s.featureCard}>
                <FileSpreadsheet size={40} className={s.subFeatureIcon} />
                <h3 style={{ minHeight: '30%'}}>いつものExcel名簿を<br/>そのままコピペ読込</h3>
                <p style={{ fontSize: '0.95rem' }}>新しいツール導入時の「名簿登録の手間」をゼロに。先生が普段お使いのExcel生徒名簿から名前をコピー＆ペーストするだけで、数秒で準備が完了します。</p>
              </article>

              {/* 3. Word出力 */}
              <article className={s.featureCard}>
                <Printer size={40} className={s.subFeatureIcon} />
                <h3 style={{ minHeight: '30%'}}>結果のお知らせプリントも<br/>Wordで一括出力</h3>
                <p style={{ fontSize: '0.95rem' }}>決定した日程の表が載ったお知らせプリント（全員共通）をWordファイル（.docx）で生成。学校独自のフォーマットや挨拶文への微調整も簡単です。</p>
              </article>
              
            </div>

          </div>
        </section>

        {/* --- 2. 使い方 (How to use) --- */}
        <section id="how-to-use" className={s.bgGray}>
          <div className={s.sectionInner}>
            <h2>使い方はとても簡単（5ステップ）</h2>
            
            <div>
              <article className={s.stepCard}>
                <h3 style={{ color: '#16a34a' }}>Step 1. スケジュール枠の準備</h3>
                <p>面談を実施する日程と、1枠あたりの時間（15分など）を設定するだけで、ベースとなるタイムテーブルが完成します。</p>
              </article>
              
              <article className={s.stepCard}>
                <h3 style={{ color: '#16a34a' }}>Step 2. 名簿のインポート</h3>
                <p>Excelから生徒名簿を読み込みます（手入力可）。同校に兄弟姉妹がいる場合は、ここで設定しておくことで自動調整の対象になります。</p>
              </article>
              
              <article className={s.stepCard}>
                <h3 style={{ color: '#16a34a' }}>Step 3. 希望日程の回収（Word生成）</h3>
                <p>システムが全児童分の「専用QRコード付きプリント」をWordで自動生成します。保護者はスマホから簡単に希望日時を提出できます。</p>
                <p>従来通り、紙のお手紙で回収したものを手動で入力することも可能です。</p>
              </article>
              
              <article className={s.stepCard}>
                <h3 style={{ color: '#16a34a' }}>Step 4. スケジュールの自動割当</h3>
                <p>集まった希望をもとに、ボタン一つでシステムが最適なスケジュールを自動で組み上げます。ドラッグ＆ドロップ微調整も可能です。</p>
              </article>

              <article className={s.stepCard}>
                <h3 style={{ color: '#16a34a' }}>Step 5. 結果の出力（Word生成）</h3>
                <p>完成した日程表を、保護者配付用のおたより（Word）や、先生の手元用Excelデータとしてエクスポートして完了です。</p>
              </article>
            </div>
              <div className={s.guideLinkContainer}>詳しく操作手順は、<Link to='/guide' className={s.link}>こちら！</Link></div>
          </div>
        </section>

        {/* --- 3. セキュリティ (Security) --- */}
        <section id="security" className={s.bgDark}>
          <div className={s.sectionInner} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛡️</div>
            <h2 style={{ color: 'white' }}>学校の厳しいセキュリティ基準をクリア</h2>
            
            <div className={s.securityBox}>
              <p style={{ color: '#d1d5db', fontSize: '1.1rem', marginBottom: '16px' }}>
                教育現場で新しいツールを導入する際、最大の壁となるのが「個人情報の取り扱いルール（クラウド利用制限）」です。
              </p>
              <p style={{ color: '#d1d5db', fontSize: '1.1rem', marginBottom: '16px' }}>
                本アプリは、児童・生徒の氏名を含む名簿データを<strong>お使いのパソコンのブラウザ内（ローカル）にのみ暗号化して保存</strong>します。インターネット上のサーバーに個人の特定が可能な情報が送信されることは一切ありません。
              </p>
              <p style={{ color: '#d1d5db', fontSize: '1.1rem' }}>
                また、保護者から希望日程をオンライン回収する通信には<strong>「ゼロ知識暗号化」</strong>を採用しています。クラウドには暗号化されたデータのみが置かれ、復号する「鍵」は配付用プリントのQRコード内にしか存在しません。開発者すらデータを解読できない構造により、情報漏洩リスクを極限まで抑えています。
              </p>
              <p style={{ color: '#d1d5db', fontSize: '1.1rem' }}>
                ※詳細は<Link to="/privacy" className={s.link}>プライバシーポリシー</Link>をご参照ください。
              </p>
              <div style={{ marginTop: "24px", textAlign: "center" }}>
                <Link 
                  to="/security" 
                  style={{ 
                    display: "inline-block", 
                    padding: "12px 24px", 
                    backgroundColor: "#16a34a", 
                    color: "white", 
                    borderRadius: "8px", 
                    textDecoration: "none",
                    fontWeight: "bold",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                  }}
                >
                  なぜ安全？セキュリティの仕組みを図解で見る
                </Link>
              </div>              
            </div>            
          </div>
        </section>

        {/* --- 4. FAQ (Frequently Asked Questions) --- */}
        <section id="faq" className={s.bgWhite}>
          <div className={s.sectionInner}>
            <h2>よくあるご質問（FAQ）</h2>
            
            <div className={s.faqContainer}>
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
      <footer className={s.footer}>
        <div className={s.sectionInner}>
          <div className={s.footerCtaTitle}>
            面談準備の「パズル」から解放されましょう
          </div>
          <div className={s.footerCtaWrapper}>
            <Link to="/app" className={s.primaryBtn}>
              今すぐ無料で使い始める
            </Link>
          </div>
          <div className={s.footerLinks}>
            <Link to="/guide" className={s.footerLink}>ご利用ガイド</Link>
            <Link to="/security" className={s.footerLink}>セキュリティについて</Link>
            <Link to="/terms" className={s.footerLink}>利用規約</Link>
            <Link to="/privacy" className={s.footerLink}>プライバシーポリシー</Link>
            <a href="https://koba-maishin.com" target="_blank" rel="noopener noreferrer" className={s.footerLink}>開発者ブログ</a>
            <a href="https://x.com/koba_EdTech" target="_blank" rel="noopener noreferrer" className={s.footerLink}>開発者 X (Twitter)</a>
            <a href="https://forms.gle/GMqBkzefmF3EAASx7" target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af' }}>
              お問い合わせ
            </a>
          </div>
          <p className={s.footerCopy}>&copy; 2026 面談スケジュールメーカー All Rights Reserved.</p>
        </div>
      </footer>
      <NinjaAd />
    </div>
    </>
  );
};