/**
 * 苗字と名前を半角スペースで連結してフルネームを生成します。
 * 保存/登録時に使用します。
 * @param {string} lastName 苗字
 * @param {string} firstName 名前
 * @returns {string} フルネーム (例: "佐藤 太郎")
 */
export const combineName = (lastName, firstName) => {
    // 前後の空白を削除
    const trimmedLastName = lastName ? lastName.trim() : '';
    const trimmedFirstName = firstName ? firstName.trim() : '';

    if (trimmedLastName && trimmedFirstName) {
        // 半角スペースで連結
        return `${trimmedLastName} ${trimmedFirstName}`;
    }

    // どちらか一方だけがある場合はそれを返す（両方空の場合は空文字列）
    return trimmedLastName || trimmedFirstName;
};

/**
 * フルネーム文字列を最初の半角スペースで分割し、苗字と名前を分離します。
 * 編集時のフォーム初期値設定に使用します。
 * @param {string} fullName フルネーム
 * @returns {{lastName: string, firstName: string}} 苗字と名前のオブジェクト
 */
export const splitName = (fullName) => {
    if (!fullName) {
        return { lastName: '', firstName: '' };
    }

    const parts = fullName.trim().split(' ');

    // スペースがない場合、全て苗字と見なす
    if (parts.length === 1) {
        return { lastName: parts[0], firstName: '' };
    }

    // 最初の要素を苗字、残りの要素を再度スペースで結合して名前とする
    const lastName = parts[0];
    const firstName = parts.slice(1).join(' ');

    return { lastName, firstName };
};