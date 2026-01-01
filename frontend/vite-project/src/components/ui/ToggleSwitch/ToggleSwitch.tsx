// src/components/ui/ToggleSwitch.tsx
// スタイル定義ファイルからレシピとベースクラスをインポート
import { toggleContainer, labelRecipe, circleRecipe } from './ToggleSwitch.css';
interface ToggleSwitchProps {
    isChecked: boolean;
    onChange: () => void; // 引数や戻り値がない関数の型
}

// トグルスイッチコンポーネント
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isChecked, onChange }) => {

    // スタイルオブジェクトの定義は不要になりました！

    // レシピ関数にisCheckedの値を渡し、クラス名を生成
    const labelClasses = labelRecipe({ checked: isChecked });
    const circleClasses = circleRecipe({ checked: isChecked });

    return (
        // style属性は削除し、className属性とインポートしたクラス名に置き換える
        <div className={toggleContainer} onClick={onChange}>
            <div className={labelClasses}>
                <div className={circleClasses}></div>
            </div>
        </div>
    );
};

export default ToggleSwitch;