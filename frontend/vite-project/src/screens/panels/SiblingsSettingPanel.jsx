import React, { useState, useCallback, useMemo } from 'react';
import { combineName, splitName } from '../../utils/nameUtils.js';
import { combineClass, splitClass } from '../../utils/classUtils.js';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// スタイル定義 (既存コンポーネントのスタイルを参考に簡略化)
const styles = {
    panel: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.06)',
        maxWidth: '700px',
        margin: '0 auto',
        minHeight: '400px',
        marginTop: '1.5rem',
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
    select: {
        // 1. デフォルトの見た目をリセット
        appearance: 'none',
        WebkitAppearance: 'none',
        MozAppearance: 'none',

        // 2. 基本的なデザインを設定
        padding: '0.6rem 2.5rem 0.6rem 0.75rem', // 右側にカスタム矢印のスペースを確保
        border: '1px solid #ced4da', // ボーダー色
        borderRadius: '0.3rem',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
        minWidth: '120px',
        fontSize: '0.8rem',
        fontFamily: 'Roboto, Arial, sans-serif',

        // 3. カスタム矢印を追加 (シンプルな下向きの矢印SVG)
        // #495057 は inputStyle のテキスト色に合わせています。
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23495057' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 1rem center',
        backgroundSize: '0.6rem',

        // 4. フォーカス時のスタイル
        ':focus': {
            borderColor: '#4299e1',
            boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.25)',
            outline: 'none',
        },
    },
};

// 兄弟の追加・編集フォームコンポーネント
const SiblingForm = ({ manager, initialData, onSave, onCancel }) => {
    const { lastName: initialLastName, firstName: initialFirstName } = splitName(initialData.name);
    const { grade: initialGrade, classNumber: initialClassNumber } = splitClass(initialData.class);
    // 編集モードの場合、IDを保持
    const defaultData = {
        id: initialData.id || null,
        lastName: initialLastName || '',
        firstName: initialFirstName || '',
        grade: initialGrade || '',
        classNumber: initialClassNumber || '',
        family_id: initialData.family_id || '',
        assigned_slot: initialData.assigned_slot || '',
    }
    const [formData, setFormData] = useState(defaultData);
    // 兄弟のFamily IDを決定するための選択済み生徒のfamily_idを保持する
    // 新規登録時は 'NEW' (未選択) または initialData の family_id を選択
    const [selectedFamilyId, setSelectedFamilyId] = useState(initialData.family_id || 'NEW');
    const uniqueApplicants = manager.applicants.reduce((acc, current) => {
        // family_id をキーとして、最初に見つかった生徒情報を格納 (重複排除)
        if (current.family_id && !acc.some(app => app.family_id === current.family_id)) {
            acc.push(current);
        }
        return acc;
    }, []);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    // プルダウンの選択が変更されたときのハンドラー
    const handleFamilyIdChange = (e) => {
        const value = e.target.value;
        setSelectedFamilyId(value);
        // formData の family_id を更新
        setFormData(prev => ({ ...prev, family_id: value === 'NEW' ? '' : value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const fullName = combineName(formData.lastName, formData.firstName);
        // Family IDが設定されていない場合はエラー
        if (selectedFamilyId === 'NEW' || !formData.family_id) {
             alert('氏名と関連付ける生徒（Family ID）の選択は必須です。');
             return;
        }
        if (!fullName || !formData.family_id) {
             alert('氏名は必須です。');
             return;
        }

        const fullClass = combineClass(formData.grade, formData.classNumber);
        const isPartialClassInput =
            (formData.grade && !formData.classNumber) ||
            (!formData.grade && formData.classNumber);
        if (isPartialClassInput) {
            alert('兄弟のクラスを設定する場合、学年と組の両方を入力してください。');
            return;
        }

        const dataToSave = {
            ...formData,
            name: fullName, // フルネームを name フィールドにセット
            class: fullClass,
            grade: undefined, // 保存データから grade を削除
            classNumber: undefined, // 保存データから classNumber を削除
        };

        onSave(dataToSave);
    };

    return (
        <form onSubmit={handleSubmit} style={styles.panel} manager={manager}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                {initialData.id ? '兄弟情報の編集' : '兄弟の新規登録'}
            </h3>
            {/* Family IDを自動割り当てするためのプルダウン */}
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="family-selector">自クラスの児童（生徒）を選択</label>
                <select
                    id="family-selector"
                    name="family_id_selector"
                    value={selectedFamilyId}
                    onChange={handleFamilyIdChange}
                    style={styles.select}
                    required
                >
                    <option value="NEW" disabled>-- 生徒を選択してください --</option>
                    {uniqueApplicants.map((app) => (
                        // family_idをoptionのvalueに使用
                        <option key={app.family_id} value={app.family_id}>
                            {app.name}
                        </option>
                    ))}
                </select>
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="name">氏名</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {/* 苗字 (lastName) */}
                    <div style={{ flex: 1 }}>
                        <label htmlFor="lastName" style={{...styles.label, fontSize: '0.875rem', fontWeight: 'normal'}}>苗字</label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>

                    {/* 名前 (firstName) */}
                    <div style={{ flex: 1 }}>
                        <label htmlFor="firstName" style={{...styles.label, fontSize: '0.875rem', fontWeight: 'normal'}}>名前</label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>
                </div>
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="class">クラス名（任意）</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {/* 学年 (Grade) */}
                    <div style={{ flex: 1 }}>
                        <label htmlFor="grade" style={{...styles.label, fontSize: '0.875rem', fontWeight: 'normal'}}>学年</label>
                        <input
                            id="grade"
                            name="grade"
                            type="number"
                            value={formData.grade || ''} //  formData.grade を使用
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="例: 5"
                        />
                    </div>

                    {/* 組 (Class Number) */}
                    <div style={{ flex: 1 }}>
                        <label htmlFor="classNumber" style={{...styles.label, fontSize: '0.875rem', fontWeight: 'normal'}}>組</label>
                        <input
                            id="classNumber"
                            name="classNumber"
                            type="text"
                            value={formData.classNumber || ''} //  formData.classNumber を使用
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="例: 1"
                        />
                    </div>
                </div>
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="assigned_slot">面談調整日程（任意）</label>
                <select
                    id="assigned_slot"
                    name="assigned_slot"
                    value={formData.assigned_slot || ''}
                    onChange={handleChange}
                    style={{...styles.select, minWidth: '100%'}} // selectStyleを適用し、幅を調整
                >
                    <option value="">-- 面談枠を選択（任意） --</option>
                    {manager.allScheduleSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                    ))}
                </select>
                {manager.allScheduleSlots.length === 0 && (
                     <p style={{fontSize: '0.8rem', color: '#718096', margin: '0.5rem 0 0 0'}}>
                         面談枠が設定されていません。
                     </p>
                )}
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
const SiblingsSettingPanel = ({ manager, siblingsManager, onBack }) => {
    const { siblings, addSibling, updateSibling, deleteSibling } = siblingsManager;
    // 編集中の兄弟データ (null: リスト表示, object: フォーム表示)
    const [editingSibling, setEditingSibling] = useState(null);
    const getStudentNameByFamilyId = useCallback((familyId) => {
        // manager.applicants (生徒リスト) から family_id が一致する生徒を検索
        const student = manager.applicants.find(app => app.family_id === familyId);
        return student ? student.name : '生徒未登録'; // 見つからなかった場合のフォールバック
    }, [manager.applicants]); // 依存配列に applicants を含める
    const sortedSiblings = useMemo(() => {
        // nullやundefinedを考慮してソートキーを比較
        return [...siblings].sort((a, b) => {
            const idA = a.family_id || '';
            const idB = b.family_id || '';

            if (idA < idB) return -1;
            if (idA > idB) return 1;
            return 0;
        });
    }, [siblings]);

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
        setEditingSibling({ id: null, name: '', class: '', family_id: '',  assigned_slot: ''});
    }, []);

    // 編集フォーム表示中はフォームをレンダリング
    if (editingSibling) {
        return (
            <SiblingForm
                initialData={editingSibling}
                onSave={handleSave}
                onCancel={() => setEditingSibling(null)}
                manager={manager}
                applicants={manager.applicants}
                allScheduleSlots={manager.allScheduleSlots}
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
                {sortedSiblings.map((sibling) => {
                    const studentName = getStudentNameByFamilyId(sibling.family_id);
                    return(
                        <div key={sibling.id} style={styles.item}>
                            <div style={styles.info}>
                                <div style={styles.name}>{sibling.name}<span style={{...styles.details, fontSize: '13px'}}> ( {studentName} ) </span></div>
                                <div style={styles.details}>
                                    {sibling.class ? ` ${sibling.class}` : 'クラス未設定'}
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
                    );
                })}
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