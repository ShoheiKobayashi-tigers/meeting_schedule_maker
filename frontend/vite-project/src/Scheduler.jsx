// src/Scheduler.jsx

import React, { useEffect, useRef } from 'react';
// CSSは忘れずにインポート
import 'dhtmlx-scheduler/codebase/dhtmlxscheduler.css';
// カスタムCSS (枠の高さとグリッド線のスタイル定義) をインポート
import './custom_scheduler.css';
import { scheduler } from 'dhtmlx-scheduler';

const SchedulerComponent = ({ events }) => {
  // スケジューラのDOM要素を参照するためのref
  const schedulerRef = useRef(null);

  useEffect(() => {
    // --------------------------------------------------
    // DHTMLX Schedulerの設定は init() の前に記述する
    // --------------------------------------------------

    // 1. **時間軸の粒度を15分に設定** (イベントスナップ)
    scheduler.config.time_step = 15;

    // 2. **1時間あたりの縦の幅（高さ）を設定** (CSSと連動)
    scheduler.config.hour_size_px = 100;

    // 3. **【追加】時間軸の分割を15分単位**にする (1時間を4分割)
    // これによりDHTMLXが15分ごとにグリッド線を描画するようになります。
    scheduler.config.hour_divide = 4;
/*
    // 4. **時間目盛りのカスタマイズ**
    // 左側の時刻表示を制御し、グリッド線のクラスを割り当てます。
    scheduler.templates.hour_scale = function(date){
        const minutes = date.getMinutes();
        // 00分（時間始まり）のみ時刻を表示
        if (minutes === 0) {
            return "<div class='dhx_scale_h'>" + scheduler.date.date_to_str("%H:%i")(date) + "</div>";
        }
        // 15分, 30分, 45分の目盛りは空欄
        return "";
    };*/
/*
    // 5. **グリッド線のカスタマイズ**
    // 各タイムセルにCSSクラスを割り当て、実線と点線を分ける
    scheduler.templates.event_class = function(start, end, event) {
        // イベントではなく、セルのクラスを割り当てたいので、ここは timeline_cell_class が理想的ですが、
        // Week Viewでセルにクラスを割り当てるには event_class を使用し、
        // CSS側でグリッド線に適用する必要があります。
        // もしくは Week View 用の別のテンプレートを探す必要がありますが、
        // とりあえず今回はCSSの適用で対応します。
        // ※このテンプレートはイベントのクラスを制御するもので、セルのクラス制御ではないため、
        //   CSS側の制御がより重要になります。
        return ""; // クラス割り当てはCSSで直接行います
    };*/

    // --------------------------------------------------
    // スケジューラを初期化
    // --------------------------------------------------
    // 'week'ビューで初期化
    scheduler.init(schedulerRef.current, new Date(), 'week');

    // データをロード
    scheduler.parse(events);

    // 【重要】クリーンアップ関数
    return () => {
      scheduler.clearAll(); // コンポーネントがアンマウントされる際にクリーンアップ
    };
  }, [events]); // eventsが変わったら再描画

  return (
    <div
      ref={schedulerRef}
      style={{ width: '1280px', height: '720px' }}
      // スケジューラがレンダリングされる要素
    />
  );
};

export default SchedulerComponent;