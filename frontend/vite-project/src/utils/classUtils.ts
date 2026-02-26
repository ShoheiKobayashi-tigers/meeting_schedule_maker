//classUtils.js

/**
 * 学年と組を連結してクラス名のフル文字列を生成します。
 * 保存/登録時に使用します。
 * @param {string} grade 学年 (例: "5")
 * @param {string} classNumber 組 (例: "1")
 * @returns {string} クラス名のフル文字列 (例: "5年1組")
 */
export const combineClass = (grade: any, classNumber: any) => {
    const trimmedGrade = grade ? String(grade).trim() : '';
    const trimmedClassNumber = classNumber ? String(classNumber).trim() : '';

    if (trimmedGrade && trimmedClassNumber) {
        // 例: "5年1組"
        return `${trimmedGrade}年${trimmedClassNumber}組`;
    }

    return null; // 両方または片方がない場合は null を返す
};

/**
 * クラス名のフル文字列を解析し、学年と組の番号を分離します。
 * 編集時のフォーム初期値設定に使用します。
 * @param {string} className - 例: '5年1組'
 * @returns {{grade: string, classNumber: string}} 学年と組のオブジェクト
 */
export const splitClass = (className: any) => {
    if (!className) {
        return { grade: '', classNumber: '' };
    }

    // 正規表現で「数字+年」「数字+組」を抽出
    const match = String(className).match(/(\d+)年(\d+)組/);

    if (match) {
        return {
            grade: match[1],      // 最初のキャプチャグループ (学年)
            classNumber: match[2] // 2番目のキャプチャグループ (組)
        };
    }

    // 正規表現に一致しない場合は空文字を返す
    return { grade: '', classNumber: '' };
};