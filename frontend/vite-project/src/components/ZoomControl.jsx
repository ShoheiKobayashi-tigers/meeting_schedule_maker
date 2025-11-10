import React from 'react';
import { MinusCircle, PlusCircle, Maximize } from 'lucide-react';

/**
 * ZoomControl コンポーネント
 * スケジュールボードの拡大・縮小を制御するためのスライダーとボタンを提供します。
 * * @param {object} props
 * @param {number} props.scaleLevel - 現在の拡大レベル (1-3)
 * @param {number} props.minScale - 最小拡大レベル
 * @param {number} props.maxScale - 最大拡大レベル
 * @param {function} props.handleScaleChange - スライダー変更時のコールバック
 * @param {function} props.handleScaleUp - 拡大ボタンクリック時のコールバック
 * @param {function} props.handleScaleDown - 縮小ボタンクリック時のコールバック
 * @param {object} props.styles - スタイルオブジェクト
 */
const ZoomControl = ({
    scaleLevel,
    minScale,
    maxScale,
    handleScaleChange,
    handleScaleUp,
    handleScaleDown,
    styles,
}) => {
    // スタイルを簡略化するために使用
    const baseStyle = styles.scaleButton;
    const disabledStyle = styles.scaleButtonDisabled;

    const isMax = scaleLevel === maxScale;
    const isMin = scaleLevel === minScale;

    return (
        <div style={styles.zoomControlContainer}>
            {/* 縮小ボタン */}
            <button
                onClick={handleScaleDown}
                disabled={isMin}
                title="縮小"
                style={{ ...baseStyle, ...(isMin && disabledStyle) }}
            >
                <MinusCircle size={20} />
            </button>

            {/* スライダー */}
            <input
                type="range"
                min={minScale}
                max={maxScale}
                value={scaleLevel}
                onChange={handleScaleChange}
                style={styles.scaleRange}
                title={`拡大率: ${scaleLevel}`}
            />

            {/* 拡大ボタン */}
            <button
                onClick={handleScaleUp}
                disabled={isMax}
                title="拡大"
                style={{ ...baseStyle, ...(isMax && disabledStyle) }}
            >
                <PlusCircle size={20} />
            </button>

            {/* 任意: リセットボタンや最大化ボタン
            <button
                onClick={() => handleScaleChange({ target: { value: 2 } })}
                title="標準サイズに戻す"
                style={baseStyle}
            >
                <Maximize size={20} />
            </button>
            */}
        </div>
    );
};

export default ZoomControl;