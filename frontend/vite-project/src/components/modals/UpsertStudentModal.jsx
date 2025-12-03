import React, { useState } from 'react';
import { styles } from './style/UpsertStudentModalStyle.js';
import { combineName, splitName } from '../../utils/nameUtils.js';
import { combineClass, splitClass } from '../../utils/classUtils.js';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const UpsertStudentModal = ({ isOpen, student, allApplicants, allScheduleSlots, onSave, onClose }) => {
    if (!isOpen || !student) return null;
    const { lastName: initialLastName, firstName: initialFirstName } = splitName(student.name);
    const initialFormData = {
        lastName: initialLastName || '',
        firstName: initialFirstName || '',
        student_id: student.student_id || '',
        preferred_dates: student.preferred_dates || [],
        id: student.id,
        family_id: student.family_id || '',
    };

    const [formData, setFormData] = useState(initialFormData);

    // 兄弟の有無を管理
    const [hasSibling, setHasSibling] = useState(false);

    //  新規状態: 兄弟の氏名を手動入力するための状態
    const [siblingLastNameManual, setSiblingLastNameManual] = useState('');
    const [siblingFirstNameManual, setSiblingFirstNameManual] = useState('');
    // 兄弟のクラスを手動入力するための状態 (学年と組)
    const [siblingGradeManual, setSiblingGradeManual] = useState('');
    const [siblingClassNumberManual, setSiblingClassNumberManual] = useState('');

    // モード判定
    const isEditMode = !!student.id;

    // スタイル
    const {
        overlayStyle, contentStyle, h4Style,
        labelStyle, inputStyle, buttonBaseStyle,
        headerStyle, closeButtonStyle
    } = styles;

    // ハンドラ
    const handleChange = (e) => {
        const { name, value, type, checked, options } = e.target;
        if (name === 'hasSibling') {
            const isSiblingPresent = checked && value === 'yes';
            setHasSibling(isSiblingPresent);

            // 「いない」に変更した場合、関連フィールドをクリア
            if (!isSiblingPresent) {
                setSiblingLastNameManual('');
                setSiblingFirstNameManual('');
                setSiblingGradeManual('');
                setSiblingClassNumberManual('');
            } else {
                // 「いる」に変更した場合、フォームの内部状態としてプレースホルダーIDを設定
                // 兄弟が「いる」状態であることを示すために使用します
                setFormData(prev => ({ ...prev, sibling_id: 'manual_entry' }));
            }
        } else if (name === 'sibling_last_name_manual') {
            setSiblingLastNameManual(value);
        } else if (name === 'sibling_first_name_manual') {
            setSiblingFirstNameManual(value);
        } else if (name === 'sibling_grade_manual') {
            setSiblingGradeManual(value);
        } else if (name === 'sibling_class_number_manual') {
            setSiblingClassNumberManual(value);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    const handleDateChange = (e) => {
        const slot = e.target.value;
        const isChecked = e.target.checked;

        setFormData(prev => {
            let newDates = [...prev.preferred_dates];

            if (isChecked) {
                // チェックを付けた場合、追加
                newDates.push(slot);
            } else {
                // チェックを外した場合、削除
                newDates = newDates.filter(date => date !== slot);
            }

            return { ...prev, preferred_dates: newDates };
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        const fullName = combineName(formData.lastName, formData.firstName);
        if (!fullName.trim()) {
            alert('氏名は必須です。');
            return;
        }
        // 兄弟のフルネームを生成（hasSiblingがtrueの場合に使用）
        const siblingFullName = combineName(siblingLastNameManual, siblingFirstNameManual);
        const siblingFullClass = combineClass(siblingGradeManual, siblingClassNumberManual);
　　　　　// 最終的な保存データの整形ロジックを更新
        const baseData = {
            ...formData,
            name: fullName,
            student_id: formData.student_id.trim(),
        };
        // 兄弟がいない場合、全ての兄弟関連フィールドを null/空に設定して保存
        if (!hasSibling) {
            baseData.sibling_id = null;
            baseData.sibling_class = null;
            baseData.sibling_coordination_slot = null;
            baseData.sibling_name_manual = null; // 手動入力フィールドもクリア
        } else {
            // 兄弟がいる場合
            if (!siblingFullName.trim()) {
                 alert('兄弟の氏名（苗字と名前）は必須です。');
                 return;
            }
            if (!siblingFullClass && (siblingGradeManual.trim() || siblingClassNumberManual.trim())) {
                alert('兄弟のクラスを設定する場合、学年と組の両方を入力してください。');
                return;
            }
            baseData.sibling_id = formData.sibling_id || 'manual_entry';
            baseData.sibling_class = siblingFullClass;
            baseData.sibling_coordination_slot = formData.sibling_coordination_slot || null;
            baseData.sibling_name_manual = siblingFullName; // 手動入力された氏名を保存
        }
        onSave(baseData);
    };
    const handleSubmit = (e) => {
        e.preventDefault(); // Enter キーなどによる送信を防止し、
        handleSave();       // 抽出した保存ロジックを呼び出す
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
                <div style={{...headerStyle, flexShrink: 0}}>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#2d3748', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
                        {isEditMode ? '児童（生徒）情報の編集' : '新規児童（生徒）の追加'}
                    </h3>
                    <button
                        style={closeButtonStyle}
                        onClick={onClose}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#e53e3e'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#a0aec0'}
                    >
                        &times;
                    </button>
                </div>
                <div style={{ flexGrow: 1, overflowY: 'auto', paddingRight: '1rem' }}>
                    <form onSubmit={handleSubmit}>

                        {/* 1. 基本情報 */}
                        <h4 style={h4Style}>基本情報</h4>
                        <div>
                            <label style={labelStyle} htmlFor="name">氏名 <span style={{color: '#e53e3e'}}>*</span></label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {/* 苗字 (lastName) */}
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="lastName" style={{...labelStyle, fontSize: '0.875rem', fontWeight: 'normal'}}>苗字</label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        required
                                    />
                                </div>

                                {/* 名前 (firstName) */}
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="firstName" style={{...labelStyle, fontSize: '0.875rem', fontWeight: 'normal'}}>名前</label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        style={inputStyle}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle} htmlFor="student_id">出席番号</label>
                            <input
                                id="student_id"
                                name="student_id"
                                type="number"
                                value={formData.student_id}
                                onChange={handleChange}
                                style={inputStyle}
                                placeholder="例: 1"
                            />
                        </div>

                        {/* 2. 希望日程 */}
                        <h4 style={h4Style}>希望日程（日時のリスト）</h4>
                        <div>
                            <label style={labelStyle} htmlFor="preferred_dates">
                                希望日程を複数選択してください
                            </label>

                            <div style={{
                                border: '1px solid #cbd5e0',
                                borderRadius: '0.5rem',
                                padding: '0.75rem',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                backgroundColor: '#f7fafc'
                            }}>
                                {allScheduleSlots.length > 0 ? (
                                    allScheduleSlots.map(slot => (
                                        <div key={slot} style={{ marginBottom: '0.5rem' }}>
                                            <label style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontWeight: '500',
                                                color: '#2d3748',
                                                cursor: 'pointer',
                                                marginTop: '0.25rem'
                                            }}>
                                                <input
                                                    type="checkbox"
                                                    name="preferred_dates"
                                                    value={slot}
                                                    checked={formData.preferred_dates.includes(slot)}
                                                    onChange={handleDateChange} // ステップ1で定義した新しいハンドラを使用
                                                    style={{ marginRight: '0.75rem', transform: 'scale(1.2)' }}
                                                />
                                                {slot}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: '#718096', margin: 0 }}>
                                        面談枠が設定されていません。面談枠の設定画面で面談枠を作成してください。
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* 3. 兄弟情報 */}
                        <h4 style={h4Style}>兄弟の情報</h4>
                        <div>
                            <label style={labelStyle}>兄弟はいますか？</label>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '0.5rem' }}>
                                <label style={{ fontWeight: '500', color: '#4a5568', display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="radio"
                                        name="hasSibling"
                                        value="yes"
                                        checked={hasSibling}
                                        onChange={handleChange}
                                        style={{ marginRight: '0.5rem' }}
                                    />
                                    いる
                                </label>
                                <label style={{ fontWeight: '500', color: '#4a5568', display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="radio"
                                        name="hasSibling"
                                        value="no"
                                        checked={!hasSibling}
                                        onChange={handleChange}
                                        style={{ marginRight: '0.5rem' }}
                                    />
                                    いない
                                </label>
                            </div>
                        </div>
                        {hasSibling && (
                            <div style={{ borderLeft: '3px solid #63b3ed', paddingLeft: '1rem', marginTop: '1rem', paddingBottom: '0.5rem' }}>
                                <div>
                                    <label style={labelStyle} htmlFor="sibling_name_manual">兄弟の氏名 <span style={{color: '#e53e3e'}}>*</span></label>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        {/* 苗字 (lastName) */}
                                        <div style={{ flex: 1 }}>
                                            <label htmlFor="sibling_last_name_manual" style={{...labelStyle, fontSize: '0.875rem', fontWeight: 'normal'}}>苗字</label>
                                            <input
                                                id="sibling_last_name_manual"
                                                name="sibling_last_name_manual"
                                                type="text"
                                                value={siblingLastNameManual}
                                                onChange={handleChange}
                                                style={inputStyle}
                                                required={hasSibling}
                                            />
                                        </div>

                                        {/* 名前 (firstName) */}
                                        <div style={{ flex: 1 }}>
                                            <label htmlFor="sibling_first_name_manual" style={{...labelStyle, fontSize: '0.875rem', fontWeight: 'normal'}}>名前</label>
                                            <input
                                                id="sibling_first_name_manual"
                                                name="sibling_first_name_manual"
                                                type="text"
                                                value={siblingFirstNameManual}
                                                onChange={handleChange}
                                                style={inputStyle}
                                                required={hasSibling}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label style={labelStyle} htmlFor="sibling_class">兄弟のクラス</label>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        {/* 学年 (Grade) */}
                                        <div style={{ flex: 1 }}>
                                            <label htmlFor="sibling_grade_manual" style={{...labelStyle, fontSize: '0.875rem', fontWeight: 'normal'}}>学年</label>
                                            <input
                                                id="sibling_grade_manual"
                                                name="sibling_grade_manual"
                                                type="number"
                                                value={siblingGradeManual}
                                                onChange={handleChange}
                                                style={inputStyle}
                                                placeholder="例: 5"
                                            />
                                        </div>

                                        {/* 組 (Class Number) */}
                                        <div style={{ flex: 1 }}>
                                            <label htmlFor="sibling_class_number_manual" style={{...labelStyle, fontSize: '0.875rem', fontWeight: 'normal'}}>組</label>
                                            <input
                                                id="sibling_class_number_manual"
                                                name="sibling_class_number_manual"
                                                type="text"
                                                value={siblingClassNumberManual}
                                                onChange={handleChange}
                                                style={inputStyle}
                                                placeholder="例: 1"
                                            />
                                        </div>
                                    </div>                                </div>

                                {/*既存の兄弟の調整希望日程プルダウン（再利用） */}
                                <div>
                                    <label style={labelStyle} htmlFor="sibling_coordination_slot">兄弟の現在の面談日程</label>
                                    <select
                                        id="sibling_coordination_slot"
                                        name="sibling_coordination_slot"
                                        value={formData.sibling_coordination_slot || ''}
                                        onChange={handleChange}
                                        style={inputStyle}
                                    >
                                        <option value="">-- 面談枠を選択 --</option>
                                        {allScheduleSlots.map(slot => (
                                            <option key={slot} value={slot}>{slot}</option>
                                        ))}
                                    </select>
                                    <p style={{fontSize: '0.8rem', color: '#718096', margin: '0 0 0.5rem 0'}}>
                                        面談枠が未設定の場合は面談枠が表示されません。
                                    </p>
                                </div>
                            </div>
                        )}
                        {/* フォームアクション */}
                        <button type="submit" style={{ display: 'none' }} aria-hidden="true" />
                    </form>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem', paddingTop: '1rem' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            ...buttonBaseStyle,
                            backgroundColor: '#edf2f7',
                            color: '#4a5568',
                            marginRight: '1rem',
                        }}
                    >
                        キャンセル
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        style={{
                            ...buttonBaseStyle,
                            backgroundColor: isEditMode ? '#4299e1' : '#38a169',
                            color: 'white',
                        }}
                    >
                        {isEditMode ? '更新' : '登録'}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default UpsertStudentModal;