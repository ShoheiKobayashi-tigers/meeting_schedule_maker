/**
 * 苗字と名前を半角スペースで連結してフルネームを生成します。
 * 保存/登録時に使用します。
 * @param {string} last_name 苗字
 * @param {string} first_name 名前
 * @returns {string} フルネーム (例: "佐藤 太郎")
 */
export const combineName = (last_name, first_name) => {
    // 前後の空白を削除
    const trimmedlast_name = last_name ? last_name.trim() : '';
    const trimmedfirst_name = first_name ? first_name.trim() : '';

    if (trimmedlast_name && trimmedfirst_name) {
        // 半角スペースで連結
        return `${trimmedlast_name} ${trimmedfirst_name}`;
    }

    // どちらか一方だけがある場合はそれを返す（両方空の場合は空文字列）
    return trimmedlast_name || trimmedfirst_name;
};

/**
 * フルネーム文字列を最初の半角スペースで分割し、苗字と名前を分離します。
 * 編集時のフォーム初期値設定に使用します。
 * @param {string} fullName フルネーム
 * @returns {{last_name: string, first_name: string}} 苗字と名前のオブジェクト
 */
export const splitName = (fullName) => {
    if (!fullName) {
        return { last_name: '', first_name: '' };
    }

    const parts = fullName.trim().split(' ');

    // スペースがない場合、全て苗字と見なす
    if (parts.length === 1) {
        return { last_name: parts[0], first_name: '' };
    }

    // 最初の要素を苗字、残りの要素を再度スペースで結合して名前とする
    const last_name = parts[0];
    const first_name = parts.slice(1).join(' ');

    return { last_name, first_name };
};