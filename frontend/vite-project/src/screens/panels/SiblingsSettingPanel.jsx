import React, { useState, useCallback } from 'react';

// スタイル定義 (既存コンポーネントのスタイルを参考に簡略化)
const styles = {
    panel: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        width: '100%',
        maxWidth: '700px',
        margin: '0 auto',
        minHeight: '400px',
    },
    h2: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#2d3748',
        borderBottom: '2px solid #edf2f7',
        paddingBottom: '0.5rem',
        marginBottom: '1rem',
    },
    listContainer: {
        marginTop: '1rem',
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 0',
        borderBottom: '1px solid #edf2f7',
    },
    info: { flexGrow: 1, minWidth: 0 },
    name: { fontWeight: '600', color: '#2d3748', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    details: { fontSize: '0.875rem', color: '#718096' },
    actions: { display: 'flex', gap: '0.5rem', marginLeft: '1rem' },
    buttonBase: {
        padding: '0.3rem 0.6rem',
        borderRadius: '0.3rem',
        fontSize: '0.875rem',
        fontWeight: '600',
        cursor: 'pointer',
        border: 'none',
        transition: 'background-color 0.2s, color 0.2s',
    },
    addButton: {
        backgroundColor: '#48bb78',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.3rem',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        border: 'none',
    },
    input: { width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.25rem', boxSizing: 'border-box' },
    formGroup: { marginBottom: '1rem' },
    label: { display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.3rem', color: '#4a5568' },
};

// 兄弟の追加・編集フォームコンポーネント
const SiblingForm = ({ initialData, onSave, onCancel }) => {
    // 編集モードの場合、IDを保持
    const defaultData = initialData.id ? initialData : { id: null, name: '', class: '', family_id: '' };
    const [formData, setFormData] = useState(defaultData);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.family_id) {
             alert('氏名とFamily IDは必須です。');
             return;
        }
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} style={styles.panel}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                {initialData.id ? '兄弟情報の編集' : '兄弟の新規登録'}
            </h3>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="name">氏名</label>
                <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleChange} style={styles.input} required />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="class">クラス名（任意）</label>
                <input type="text" id="class" name="class" value={formData.class || ''} onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="family_id">Family ID (同一家族識別子)</label>
                <input type="text" id="family_id" name="family_id" value={formData.family_id || ''} onChange={handleChange} style={styles.input} required placeholder="例: family-1" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={onCancel} style={{ ...styles.buttonBase, backgroundColor: '#e2e8f0', color: '#4a5568' }}>
                    キャンセル
                </button>
                <button type="submit" style={{ ...styles.buttonBase, backgroundColor: '#4299e1', color: 'white' }}>
                    保存
                </button>
            </div>
        </form>
    );
};

// --- SiblingsSettingPanelメインコンポーネント ---
const SiblingsSettingPanel = ({ siblingsManager, onBack }) => {
    const { siblings, addSibling, updateSibling, deleteSibling } = siblingsManager;
    // 編集中の兄弟データ (null: リスト表示, object: フォーム表示)
    const [editingSibling, setEditingSibling] = useState(null);

    // 保存処理（新規登録/更新）
    const handleSave = useCallback((data) => {
        if (data.id) {
            updateSibling(data); // 既存IDがあれば更新
        } else {
            addSibling(data); // なければ新規追加
        }
        setEditingSibling(null);
    }, [addSibling, updateSibling]);

    // 編集ボタンクリック
    const handleEdit = useCallback((sibling) => {
        setEditingSibling(sibling);
    }, []);

    // 削除ボタンクリック
    const handleDelete = useCallback((sibling) => {
        if (window.confirm(`兄弟 ${sibling.name} (ID: ${sibling.id}) を削除しますか？`)) {
            deleteSibling(sibling.id);
        }
    }, [deleteSibling]);

    // 新規追加ボタンクリック
    const handleAdd = useCallback(() => {
        // family_idは、既存の学生からコピーするロジックなども考えられますが、ここでは空で開始
        setEditingSibling({ id: null, name: '', class: '', family_id: '' });
    }, []);

    // 編集フォーム表示中はフォームをレンダリング
    if (editingSibling) {
        return (
            <SiblingForm
                initialData={editingSibling}
                onSave={handleSave}
                onCancel={() => setEditingSibling(null)}
            />
        );
    }

    // リスト表示
    return (
        <div style={styles.panel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ ...styles.h2, borderBottom: 'none', marginBottom: '0' }}>兄弟情報の設定</h2>
                <button
                    onClick={onBack}
                    style={{ ...styles.buttonBase, backgroundColor: '#e2e8f0', color: '#4a5568' }}
                    title="児童（生徒）リストに戻る"
                >
                    &larr; 児童（生徒）設定へ戻る
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <button
                    onClick={handleAdd}
                    style={styles.addButton}
                >
                    + 兄弟を新規登録
                </button>
            </div>

            <div style={styles.listContainer}>
                {siblings.map((sibling) => (
                    <div key={sibling.id} style={styles.item}>
                        <div style={styles.info}>
                            <div style={styles.name}>{sibling.name}</div>
                            <div style={styles.details}>
                                {sibling.class ? `クラス: ${sibling.class}` : 'クラス未設定'} | Family ID: <span style={{fontWeight: 'bold'}}>{sibling.family_id || '未設定'}</span>
                            </div>
                        </div>
                        <div style={styles.actions}>
                            <button
                                style={{ ...styles.buttonBase, backgroundColor: '#f0f4f8', color: '#4299e1' }}
                                onClick={() => handleEdit(sibling)}
                            >
                                編集
                            </button>
                            <button
                                style={{ ...styles.buttonBase, backgroundColor: '#fef2f2', border: '1px solid #f56565', color: '#c53030' }}
                                onClick={() => handleDelete(sibling)}
                            >
                                削除
                            </button>
                        </div>
                    </div>
                ))}
                {siblings.length === 0 && (
                    <p style={{textAlign: 'center', color: '#718096', padding: '1rem'}}>
                        兄弟が登録されていません。
                    </p>
                )}
            </div>
        </div>
    );
};

export default SiblingsSettingPanel;