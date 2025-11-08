import React, { useState, useMemo, useCallback } from 'react';

// --- I. ヘルパー関数 (純粋なロジック層 - 共通利用) ---

/**
 * 時刻文字列 (HH:mm) と分数から、HH:mm - HH:mm 形式の範囲文字列を生成する
 */
const calculateTimeRange = (startTimeStr, duration) => {
    const [startH, startM] = startTimeStr.split(':').map(Number);
    let start = new Date(2000, 0, 1, startH, startM);

    let end = new Date(start.getTime());
    end.setMinutes(end.getMinutes() + duration);

    const formatTime = (date) => {
        const h = String(date.getHours()).padStart(2, '0');
        const m = String(date.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
    };

    return `${formatTime(start)} - ${formatTime(end)}`;
};

/**
 * 次に追加すべき時間帯の開始時間を計算する (ソート済みリストを前提とする)
 */
const getNextStartTime = (rows, defaultStart = '09:00') => {
    if (rows.length === 0) {
        return defaultStart;
    }
    const latestRow = rows[rows.length - 1];
    // endTimeString は "HH:mm - HH:mm" の2つ目の時刻
    const endTimeString = latestRow.split(' - ')[1];

    if (!endTimeString || endTimeString.split(':').some(isNaN)) return defaultStart;

    return endTimeString;
};

/**
 * 時間帯ヘッダー ("HH:mm - HH:mm") を開始時刻でソートする
 */
const sortTimeRows = (rows) => {
    return [...rows].sort((a, b) => {
        const startTimeA = a.split(' - ')[0];
        const startTimeB = b.split(' - ')[0];
        // HH:mm 形式でゼロパディングされているため、文字列比較で十分
        return startTimeA.localeCompare(startTimeB);
    });
};

/**
 * 日付ヘッダー ("MM/DD (曜日)") を MM/DD でソートする
 */
const sortDateCols = (cols) => {
    return [...cols].sort((a, b) => {
        // MM/DD (曜日) から MM/DD の部分のみを抽出
        const datePartA = a.substring(0, a.indexOf(' '));
        const datePartB = b.substring(0, b.indexOf(' '));
        return datePartA.localeCompare(datePartB);
    });
};

// --- II. 共通UIコンポーネント (プレゼンテーション層) ---

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = '実行する', cancelText = 'キャンセル' }) => {
    // スタイル定義は元のまま
    if (!isOpen) return null;

    const contentStyle = {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.75rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        maxWidth: '450px',
        width: '90%',
        fontFamily: 'Inter, sans-serif',
    };
    const buttonBaseStyle = {
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: 'none',
        fontSize: '1rem',
    };
    const confirmButtonStyle = {
        ...buttonBaseStyle,
        backgroundColor: '#e53e3e', // Red
        color: 'white',
        marginLeft: '1rem',
    };
    const cancelButtonStyle = {
        ...buttonBaseStyle,
        backgroundColor: '#edf2f7', // Light Gray
        color: '#4a5568',
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        }}>
            <div style={contentStyle}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#2d3748', marginBottom: '1rem' }}>
                    {title}
                </h3>
                <p style={{ color: '#4a5568', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    {message}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <button
                        style={cancelButtonStyle}
                        onClick={onCancel}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dce1e7'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#edf2f7'}
                    >
                        {cancelText}
                    </button>
                    <button
                        style={confirmButtonStyle}
                        onClick={onConfirm}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c53030'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e53e3e'}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

// トグルスイッチコンポーネント
const ToggleSwitch = ({ isChecked, onChange }) => {
    const styles = {
        toggleContainer: { display: 'inline-block', verticalAlign: 'middle', },
        toggleLabel: { display: 'block', width: '40px', height: '24px', backgroundColor: '#ccc', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'background-color 0.3s', },
        toggleLabelActive: { backgroundColor: '#48bb78', },
        toggleCircle: { position: 'absolute', top: '2px', left: '2px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'white', transition: 'transform 0.3s', },
        toggleCircleActive: { transform: 'translateX(16px)', },
    };
    return (
        <div style={styles.toggleContainer} onClick={onChange}>
            <div style={{ ...styles.toggleLabel, ...(isChecked && styles.toggleLabelActive) }}>
                <div style={{ ...styles.toggleCircle, ...(isChecked && styles.toggleCircleActive) }}></div>
            </div>
        </div>
    );
};


// 児童（生徒）詳細モーダルコンポーネント (前回の実装から変更なし)
// 児童（生徒）詳細モーダルコンポーネント
const StudentDetailsModal = ({ isOpen, student, onClose, assignmentDetails, siblingDetails }) => {
    if (!isOpen || !student) return null;

    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1001,
        fontFamily: 'Inter, sans-serif',
    };

    const contentStyle = {
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: '700px', // より大きな幅
        width: '90%',
        minHeight: '400px',
        position: 'relative',
        animation: 'fadeInUp 0.3s ease-out',
        display: 'flex',
        flexDirection: 'column',
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid #edf2f7',
        paddingBottom: '1rem',
        marginBottom: '1.5rem',
    };

    const closeButtonStyle = {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '1.5rem',
        fontWeight: '300',
        cursor: 'pointer',
        color: '#a0aec0',
        transition: 'color 0.2s',
        padding: '0.25rem',
    };

    // --- 新規/更新スタイル ---
    const h4Style = {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#2d3748',
        borderBottom: '2px solid #edf2f7',
        paddingBottom: '0.5rem',
        marginTop: '1.5rem',
        marginBottom: '1rem',
    };

    const infoGroupStyle = {
        marginBottom: '1.5rem',
        padding: '0 0.5rem',
    };

    const infoItemStyle = {
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 0',
        borderBottom: '1px dotted #ebf4ff', // ドット線に変更
    };

    const labelStyle = {
        fontWeight: '700',
        color: '#4a5568',
        width: '180px', // 幅を少し広げて項目名を揃える
        flexShrink: 0,
        fontSize: '1rem',
    };

    const valueStyle = {
        color: '#2d3748',
        fontSize: '1rem',
        fontWeight: '500',
        flexGrow: 1,
    };

    const assignmentBadgeStyle = {
        backgroundColor: '#e6fffa', // Greenish-blue for current assignment
        padding: '0.3rem 0.6rem',
        borderRadius: '0.4rem',
        marginRight: '0.5rem',
        color: '#38a169',
        fontWeight: '600',
        display: 'inline-block',
        whiteSpace: 'nowrap',
    };

    const siblingAssignmentBadgeStyle = {
        backgroundColor: '#fffff0', // Light yellow for sibling
        padding: '0.3rem 0.6rem',
        borderRadius: '0.4rem',
        marginRight: '0.5rem',
        color: '#b7791f', // Brownish-yellow
        fontWeight: '600',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        border: '1px solid #f6e05e',
    };

    const coordinationSlotStyle = {
        backgroundColor: '#e9d8fd', // Purpleish-blue for coordination slot
        padding: '0.3rem 0.6rem',
        borderRadius: '0.4rem',
        marginRight: '0.5rem',
        color: '#6b46c1',
        fontWeight: '600',
        display: 'inline-block',
        whiteSpace: 'nowrap',
    };

    const unassignedStyle = {
        color: '#718096',
        fontSize: '1rem',
        fontWeight: '500',
        padding: '0.5rem 0',
    };
    // ------------------------------------

    return (
        <div style={overlayStyle} onClick={onClose}>
            <style>
                {`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}
            </style>
            <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
                <div style={headerStyle}>
                    <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#2d3748' }}>
                        児童（生徒）詳細
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

                    {/* 1. 基本情報 (氏名と出席番号) */}
                    <h4 style={h4Style}>基本情報</h4>
                    <div style={infoGroupStyle}>
                        <div style={infoItemStyle}>
                            <span style={labelStyle}>氏名</span>
                            <span style={valueStyle}>{student.name}</span>
                        </div>
                        <div style={{...infoItemStyle, borderBottom: 'none'}}>
                            <span style={labelStyle}>出席番号</span>
                            <span style={valueStyle}>{student.student_id || '未登録'}</span>
                        </div>
                    </div>

                    {/* 2. 現在の面談割り当て */}
                    <h4 style={h4Style}>現在の面談割り当て</h4>
                    <div style={infoGroupStyle}>
                        {assignmentDetails ? (
                            <p style={{ color: '#2b6cb0', fontWeight: '600', fontSize: '1.1rem', padding: '0.5rem 0' }}>
                                <span style={assignmentBadgeStyle}>{assignmentDetails.date}</span>
                                <span style={assignmentBadgeStyle}>{assignmentDetails.time}</span>
                            </p>
                        ) : (
                            <p style={unassignedStyle}>現在、面談は割り当てられていません。</p>
                        )}
                    </div>

                    {/* 3. 兄弟情報 */}
                    <h4 style={h4Style}>兄弟の情報</h4>
                    <div style={infoGroupStyle}>
                        {student.sibling_id && siblingDetails ? (
                            <>
                                <div style={infoItemStyle}>
                                    <span style={labelStyle}>兄弟氏名 / クラス</span>
                                    <span style={valueStyle}>
                                        {siblingDetails.name || '不明'} / {student.sibling_class || '不明'}
                                    </span>
                                </div>
                                {/* 🌟 修正: 兄弟の調整希望日程を表示 */}
                                <div style={infoItemStyle}>
                                    <span style={labelStyle}>兄弟の調整希望日程</span>
                                    <span style={valueStyle}>
                                        {student.sibling_coordination_slot ? (
                                            <span style={coordinationSlotStyle}>{student.sibling_coordination_slot}</span>
                                        ) : (
                                            '未登録'
                                        )}
                                    </span>
                                </div>
                                <div style={{...infoItemStyle, borderBottom: 'none'}}>
                                    <span style={labelStyle}>兄弟の現在の割り当て</span>
                                    {siblingDetails.assignment ? (
                                        <span style={valueStyle}>
                                            <span style={siblingAssignmentBadgeStyle}>{siblingDetails.assignment.date}</span>
                                            <span style={siblingAssignmentBadgeStyle}>{siblingDetails.assignment.time}</span>
                                        </span>
                                    ) : (
                                        <span style={unassignedStyle}>未割り当て</span>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p style={unassignedStyle}>兄弟の登録はありません。</p>
                        )}
                    </div>

                    {/* 4. 希望日程 */}
                    <h4 style={h4Style}>希望日程（日時のリスト）</h4>
                    <div style={infoGroupStyle}>
                        {student.preferred_dates && student.preferred_dates.length > 0 ? (
                            <ul style={{ listStyleType: 'none', paddingLeft: '0', margin: '0.5rem 0' }}>
                                {student.preferred_dates.map((date, index) => (
                                    <li key={index} style={{ color: '#2d3748', marginBottom: '0.3rem', fontSize: '1rem', padding: '0.3rem 0.5rem', backgroundColor: '#f7faff', borderRadius: '0.3rem', borderLeft: '3px solid #4299e1' }}>
                                        <span style={{fontWeight: '700', marginRight: '0.5rem', color: '#4299e1'}}>{index + 1}.</span>
                                        {date}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={unassignedStyle}>希望日程は登録されていません。</p>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', flexShrink: 0 }}>
                    <button
                        style={{
                            padding: '0.75rem 2rem',
                            borderRadius: '0.5rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            backgroundColor: '#4299e1',
                            color: 'white',
                            border: 'none',
                            transition: 'background-color 0.2s',
                        }}
                        onClick={onClose}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3182ce'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4299e1'}
                    >
                        閉じる
                    </button>
                </div>
            </div>
        </div>
    );
};

// ---------------------------------------------
// --- 🌟 新規: 児童（生徒）追加/編集モーダルコンポーネント ---
// ---------------------------------------------
// ---------------------------------------------
// --- 🌟 修正: 児童（生徒）追加/編集モーダルコンポーネント ---
// ---------------------------------------------
const UpsertStudentModal = ({ isOpen, student, allApplicants, allScheduleSlots, onSave, onClose }) => {
    if (!isOpen || !student) return null;

    const initialFormData = {
        name: student.name || '',
        student_id: student.student_id || '',
        sibling_id: student.sibling_id || '',
        sibling_class: student.sibling_class || '',
        sibling_coordination_slot: student.sibling_coordination_slot || '',
        preferred_dates: student.preferred_dates || [],
        id: student.id,
        sibling_name_manual: student.sibling_name_manual || '',
    };

    const [formData, setFormData] = useState(initialFormData);

    // 兄弟の有無を管理
    const [hasSibling, setHasSibling] = useState(!!initialFormData.sibling_id);

    // 🚨 新規状態: 兄弟の氏名を手動入力するための状態
    const [siblingNameManual, setSiblingNameManual] = useState(initialFormData.sibling_name_manual || '');

    // モード判定
    const isEditMode = !!student.id;

    // スタイル
    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1002,
        fontFamily: 'Inter, sans-serif',
    };

    const contentStyle = {
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        maxWidth: '650px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        animation: 'fadeInUp 0.3s ease-out',
    };

    const inputStyle = {
        border: '1px solid #cbd5e0',
        borderRadius: '0.5rem',
        padding: '0.6rem 0.75rem',
        width: '100%',
        boxSizing: 'border-box',
        fontSize: '1rem',
        marginBottom: '0.5rem',
    };

    const labelStyle = {
        display: 'block',
        fontWeight: '700',
        color: '#4a5568',
        marginBottom: '0.25rem',
        marginTop: '1rem',
    };

    const h4Style = {
        fontSize: '1.3rem',
        fontWeight: '800',
        color: '#2d3748',
        borderBottom: '2px solid #edf2f7',
        paddingBottom: '0.5rem',
        marginTop: '2rem',
        marginBottom: '1rem',
    };

    const buttonBaseStyle = {
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: 'none',
        fontSize: '1rem',
    };

   // ハンドラ
   const handleChange = (e) => {
       const { name, value, type, checked, options } = e.target;

       if (name === 'hasSibling') { // 🌟 変更点 2-1: ラジオボタンのロジック
           const isSiblingPresent = checked && value === 'yes';
           setHasSibling(isSiblingPresent);

           // 「いない」に変更した場合、関連フィールドをクリア
           if (!isSiblingPresent) {
               setFormData(prev => ({
                   ...prev,
                   sibling_id: null, // 兄弟IDをクリア
                   sibling_class: '',
                   sibling_coordination_slot: null,
               }));
               setSiblingNameManual(''); // 手動入力の氏名もクリア
           } else {
               // 「いる」に変更した場合、フォームの内部状態としてプレースホルダーIDを設定
               // 兄弟が「いる」状態であることを示すために使用します
               setFormData(prev => ({ ...prev, sibling_id: 'manual_entry' }));
           }
       } else if (name === 'sibling_name_manual') { // 🌟 変更点 2-2: 手動氏名入力のロジック
           setSiblingNameManual(value);
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


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            alert('氏名は必須です。');
            return;
        }
　　　　　// 最終的な保存データの整形ロジックを更新
        const baseData = {
            ...formData,
            name: formData.name.trim(),
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
            // sibling_idは「いる」ことを示すダミー値 (manual_entry) または以前のIDを保持
            baseData.sibling_id = formData.sibling_id || 'manual_entry';
            baseData.sibling_class = (formData.sibling_class && formData.sibling_class.trim()) ? formData.sibling_class.trim() : null;
            baseData.sibling_coordination_slot = formData.sibling_coordination_slot || null;
            baseData.sibling_name_manual = siblingNameManual.trim(); // 手動入力された氏名を保存
        }

        onSave(finalData);
    };


    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#2d3748', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
                    {isEditMode ? '児童（生徒）情報の編集' : '新規児童（生徒）の追加'}
                </h3>
                <form onSubmit={handleSubmit}>

                    {/* 1. 基本情報 */}
                    <h4 style={h4Style}>基本情報</h4>
                    <div>
                        <label style={labelStyle} htmlFor="name">氏名 <span style={{color: '#e53e3e'}}>*</span></label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            style={inputStyle}
                            placeholder="例: 佐藤 太郎"
                            required
                        />
                    </div>
                    <div>
                        <label style={labelStyle} htmlFor="student_id">出席番号</label>
                        <input
                            id="student_id"
                            name="student_id"
                            type="text"
                            value={formData.student_id}
                            onChange={handleChange}
                            style={inputStyle}
                            placeholder="例: 1201"
                        />
                    </div>

                    {/* 2. 兄弟情報 */}
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
                            {/* 🚨 兄弟の氏名入力フィールド（手動入力） */}
                            <div>
                                <label style={labelStyle} htmlFor="sibling_name_manual">兄弟の氏名 <span style={{color: '#e53e3e'}}>*</span></label>
                                <input
                                    id="sibling_name_manual"
                                    name="sibling_name_manual"
                                    type="text"
                                    value={siblingNameManual}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    placeholder="例: 佐藤 次郎"
                                    required // 氏名を入力必須とする
                                />
                            </div>

                            <div>
                                <label style={labelStyle} htmlFor="sibling_class">兄弟のクラス</label>
                                <input
                                    id="sibling_class"
                                    name="sibling_class"
                                    type="text"
                                    value={formData.sibling_class || ''}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    placeholder="例: 小学5年A組"
                                />
                            </div>

                            {/* 🌟 既存の兄弟の調整希望日程プルダウン（再利用） */}
                            <div>
                                <label style={labelStyle} htmlFor="sibling_coordination_slot">兄弟の調整希望日程</label>
                                <select
                                    id="sibling_coordination_slot"
                                    name="sibling_coordination_slot"
                                    value={formData.sibling_coordination_slot || ''}
                                    onChange={handleChange}
                                    style={inputStyle}
                                >
                                    <option value="">-- スロットを選択 --</option>
                                    {allScheduleSlots.map(slot => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </select>
                                <p style={{fontSize: '0.8rem', color: '#718096', margin: '0 0 0.5rem 0'}}>
                                    面談枠が未設定の場合はスロットが表示されません。
                                </p>
                            </div>
                        </div>
                    )}

                    {/* 3. 希望日程 */}
<h4 style={h4Style}>希望日程（日時のリスト）</h4>
                    <div>
                        <label style={labelStyle} htmlFor="preferred_dates">
                            希望日程を複数選択してください
                        </label>

                        {/* 🌟 修正: チェックボックスで表示 */}
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
                                    面談枠が設定されていません。スロット設定画面で面談枠を作成してください。
                                </p>
                            )}
                        </div>
                        {/* ... (省略: 説明文) ... */}
                        <p style={{fontSize: '0.8rem', color: '#718096', margin: '0.5rem 0 0.5rem 0'}}>
                            兄弟の調整希望日程と合わせて調整の参考にします。
                        </p>
                    </div>

                    {/* フォームアクション */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
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
                            type="submit"
                            style={{
                                ...buttonBaseStyle,
                                backgroundColor: isEditMode ? '#dd6b20' : '#38a169',
                                color: 'white',
                            }}
                        >
                            {isEditMode ? '情報を更新' : '児童（生徒）を登録'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- III. ロジック層 (カスタムフック) ---

// --- III. ロジック層 (カスタムフック) ---

const useScheduleManager = (initialApplicants) => {
    const [applicants, setApplicants] = useState(initialApplicants);
    const [interviewDuration, setInterviewDuration] = useState(15);
    const DURATION_OPTIONS = [1, 5, 10, 15, 20, 30, 45, 60];

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [selectedStartTime, setSelectedStartTime] = useState('09:00');

    const [draggingApplicantId, setDraggingApplicantId] = useState(null);
    const [isAddButtonActive, setIsAddButtonActive] = useState(false);
    const [hoveredCellId, setHoveredCellId] = useState(null);

    const [selectedSlot, setSelectedSlot] = useState(null);

    const [modalState, setModalState] = useState({
        isOpen: false, title: '', message: '', onConfirm: () => {},
    });

    // 児童（生徒）詳細モーダルの状態
    const [studentDetailsModalState, setStudentDetailsModalState] = useState({
        isOpen: false,
        student: null, // 表示対象の児童（生徒）オブジェクト
    });

    // 児童（生徒）追加/編集モーダルの状態
    const [upsertStudentModalState, setUpsertStudentModalState] = useState({
        isOpen: false,
        student: null,
        mode: 'add',
    });
    // ------------------------------------------

    const TIME_OPTIONS = useMemo(() => {
        const times = [];
        for (let h = 9; h <= 17; h++) {
            for (let m = 0; m < 60; m += interviewDuration) {
                if (h === 17 && m > 0) continue;
                times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
            }
        }
        return times;
    }, [interviewDuration]);

    const [scheduleData, setScheduleData] = useState(() => {
        const initialRows = sortTimeRows([calculateTimeRange('09:00', 15), calculateTimeRange('09:15', 15)]);
        const initialCols = sortDateCols(['12/01 (月)', '11/30 (日)']);

        const initialAssignments = Array(initialRows.length).fill(null).map(() => Array(initialCols.length).fill(null));
        initialAssignments[0][0] = 'app-1';

        const initialAvailability = Array(initialRows.length).fill(true).map(() => Array(initialCols.length).fill(true));

        return {
            rows: initialRows,
            cols: initialCols,
            assignments: initialAssignments,
            availability: initialAvailability,
        };
    });

    // 🌟 新規: 全面談スロットのリストを生成
    const allScheduleSlots = useMemo(() => {
        const slots = [];
        // スケジュールボードと同じソート順で日時を結合
        const sortedCols = sortDateCols(scheduleData.cols);
        const sortedRows = sortTimeRows(scheduleData.rows);

        for (const date of sortedCols) {
            for (const time of sortedRows) {
                slots.push(`${date} ${time}`);
            }
        }
        return slots;
    }, [scheduleData.cols, scheduleData.rows]);


    const getApplicantName = useCallback((applicantId) => {
        return applicants.find(app => app.id === applicantId)?.name || 'Unknown Applicant';
    }, [applicants]);


    /**
     * 指定された児童（生徒）IDが割り当てられているスロットの日程（日付と時間帯）を返す
     */
    const getAssignmentDetails = useCallback((applicantId) => {
        const { rows, cols, assignments } = scheduleData;

        for (let r = 0; r < rows.length; r++) {
            for (let c = 0; c < cols.length; c++) {
                if (assignments[r][c] === applicantId) {
                    const date = cols[c];
                    const time = rows[r];
                    return { date, time };
                }
            }
        }
        return null;
    }, [scheduleData]);

    /**
     * 兄弟の氏名と面談日程を返す
     */
    const getSiblingAssignmentDetails = useCallback((student) => {
        if (!student || !student.sibling_id) return null;

        const sibling = applicants.find(app => app.id === student.sibling_id);
        if (!sibling) return null;

        const assignment = getAssignmentDetails(sibling.id);

        return {
            name: sibling.name,
            assignment: assignment, // {date: "MM/DD (曜)", time: "HH:mm - HH:mm"} or null
            class: student.sibling_class || '不明'
        };

    }, [applicants, getAssignmentDetails]);


    // --- 児童（生徒）詳細モーダル関連関数 (変更なし) ---
    const openStudentDetailsModal = useCallback((student) => {
        setStudentDetailsModalState({
            isOpen: true,
            student: student,
        });
    }, []);

    const closeStudentDetailsModal = useCallback(() => {
        setStudentDetailsModalState({
            isOpen: false,
            student: null,
        });
    }, []);
    // ------------------------------------------

    // 🌟 修正: 児童（生徒）追加/編集モーダル関連関数 (新規フィールド対応)
    const openAddStudentModal = useCallback(() => {
        // 新規登録用の初期データを設定
        setUpsertStudentModalState({
            isOpen: true,
            student: {
                name: '',
                student_id: '',
                sibling_id: '',
                sibling_class: '',
                sibling_coordination_slot: '', // 🌟 新規: 兄弟の調整希望日程
                preferred_dates: []
            },
            mode: 'add',
        });
    }, []);

    const closeUpsertStudentModal = useCallback(() => {
        setUpsertStudentModalState({
            isOpen: false,
            student: null,
            mode: 'add',
        });
    }, []);

    const handleSaveStudent = useCallback((studentData) => {
        // データのバリデーションと整形
        const saveData = {
            ...studentData,
            name: studentData.name.trim(),
            student_id: studentData.student_id.trim() || null,
            sibling_id: studentData.sibling_id || null,
            sibling_class: studentData.sibling_class || null,
            sibling_coordination_slot: studentData.sibling_coordination_slot || null, // 🌟 新規: 保存
            preferred_dates: studentData.preferred_dates || [],
        };

        if (studentData.id) {
            // 編集ロジック
            setApplicants(prev => prev.map(s => s.id === studentData.id ? saveData : s));
        } else {
            // 新規追加ロジック
            const newId = `app-${Date.now()}`;
            const newStudent = {
                ...saveData,
                id: newId,
                student_id: saveData.student_id || `NEW-${applicants.length + 1}`,
            };
            setApplicants(prev => [...prev, newStudent]);
        }
        closeUpsertStudentModal();
    }, [applicants.length, closeUpsertStudentModal]);
    // ------------------------------------------


    // --- 児童（生徒）情報の削除処理 (変更なし) ---
    const handleDeleteStudent = useCallback((studentId) => {
        // 児童（生徒）リストから削除
        setApplicants(prev => prev.filter(s => s.id !== studentId));

        // スケジュールからも削除（割り当て解除）
        setScheduleData(prevData => {
            const newAssignments = prevData.assignments.map(row =>
                row.map(id => id === studentId ? null : id)
            );
            return { ...prevData, assignments: newAssignments };
        });
        setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    }, []);

    const confirmDeleteStudent = useCallback((student) => {
        const isAssigned = scheduleData.assignments.flat().includes(student.id);

        setModalState({
            isOpen: true,
            title: '児童（生徒）の削除確認',
            message: isAssigned
                ? `「${student.name}」さんは現在スケジュールに割り当てられています。削除を実行すると、割り当ては強制的に解除され、データから削除されます。続行しますか？`
                : `「${student.name}」さんをデータから削除しますか？`,
            onConfirm: () => handleDeleteStudent(student.id),
            confirmText: isAssigned ? '強制削除' : '削除',
            cancelText: 'キャンセル',
        });
    }, [scheduleData.assignments, handleDeleteStudent]);


    // マトリックス再構築ヘルパー (行追加/削除時)
    const reconstructAssignments = (oldRows, newRows, oldAssignments, oldAvailability, oldCols) => {
        const newAssignments = Array(newRows.length).fill(null).map(() => Array(oldCols.length).fill(null));
        const newAvailability = Array(newRows.length).fill(null).map(() => Array(oldCols.length).fill(true));

        newRows.forEach((rowHeader, newRowIndex) => {
            // 🚨 修正点 1: rowHeader全体ではなく、開始時刻部分で一致を検索
            const rowStartTime = rowHeader.split(' - ')[0];
            const oldIndex = oldRows.findIndex(r => r.startsWith(rowStartTime + ' -'));

            oldCols.forEach((_, newColIndex) => {
                if (oldIndex !== -1) {
                    newAssignments[newRowIndex][newColIndex] = oldAssignments[oldIndex][newColIndex];
                    newAvailability[newRowIndex][newColIndex] = oldAvailability[oldIndex][newColIndex];
                } else {
                    newAssignments[newRowIndex][newColIndex] = null;
                    newAvailability[newRowIndex][newColIndex] = true;
                }
            });
        });
        return { newAssignments, newAvailability };
    };

    // マトリックス再構築ヘルパー (列追加/削除時)
    const reconstructCols = (oldCols, newCols, oldRows, oldAssignments, oldAvailability) => {
        const newAssignments = oldRows.map(() => Array(newCols.length).fill(null));
        const newAvailability = oldRows.map(() => Array(newCols.length).fill(true));

        oldRows.forEach((_, rowIndex) => {
            newCols.forEach((colHeader, newColIndex) => {
                const oldIndex = oldCols.findIndex(c => c === colHeader);
                if (oldIndex !== -1) {
                    newAssignments[rowIndex][newColIndex] = oldAssignments[rowIndex][oldIndex];
                    newAvailability[rowIndex][newColIndex] = oldAvailability[rowIndex][oldIndex];
                } else {
                    newAssignments[rowIndex][newColIndex] = null;
                    newAvailability[rowIndex][newColIndex] = true;
                }
            });
        });
        return { newAssignments, newAvailability };
    };

    // --- 行・列の削除処理 (変更なし) ---
    const performRowDeletion = useCallback((rowIndex) => {
        setScheduleData(prevData => {
            const rowToDelete = prevData.rows[rowIndex];
            const newOriginalRows = prevData.rows.filter((_, i) => i !== rowIndex);

            const newAssignments = prevData.assignments.filter((_, i) => prevData.rows[i] !== rowToDelete);
            const newAvailability = prevData.availability.filter((_, i) => prevData.rows[i] !== rowToDelete);

            const sortedNewRows = sortTimeRows(newOriginalRows);

            const nextStart = getNextStartTime(sortedNewRows, '09:00');
            setSelectedStartTime(nextStart);

            return {
                ...prevData,
                rows: sortedNewRows,
                assignments: newAssignments,
                availability: newAvailability,
            };
        });
        setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    }, []);

    const performColDeletion = useCallback((colIndex) => {
        setScheduleData(prevData => {
            const colToDelete = prevData.cols[colIndex];
            const newOriginalCols = prevData.cols.filter((_, i) => i !== colIndex);

            const newAssignments = prevData.assignments.map(row =>
                row.filter((_, i) => prevData.cols[i] !== colToDelete)
            );
            const newAvailability = prevData.availability.map(row =>
                row.filter((_, i) => prevData.cols[i] !== colToDelete)
            );

            const sortedNewCols = sortDateCols(newOriginalCols);

            return {
                ...prevData,
                cols: sortedNewCols,
                assignments: newAssignments,
                availability: newAvailability,
            };
        });
        setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    }, []);

    const handleDeleteRow = useCallback((rowIndex) => {
        const assignedCount = scheduleData.assignments[rowIndex].filter(id => id !== null).length;

        if (assignedCount > 0) {
            setModalState({
                isOpen: true,
                title: '行の削除確認',
                message: `${assignedCount}名がこの時間帯（${scheduleData.rows[rowIndex]}）にすでに配置されています。削除を実行すると、これらの割り当ては強制的に解除されリストに戻ります。続行しますか？`,
                onConfirm: () => performRowDeletion(rowIndex),
                confirmText: '強制削除',
                cancelText: 'キャンセル',
            });
        } else {
            performRowDeletion(rowIndex);
        }
    }, [scheduleData.assignments, scheduleData.rows, performRowDeletion]);

    const handleDeleteCol = useCallback((colIndex) => {
        const assignedCount = scheduleData.assignments.reduce((count, row) => count + (row[colIndex] !== null ? 1 : 0), 0);

        if (assignedCount > 0) {
            setModalState({
                isOpen: true,
                title: '列の削除確認',
                message: `${assignedCount}名がこの日付（${scheduleData.cols[colIndex]}）にすでに配置されています。削除を実行すると、これらの割り当ては強制的に解除されリストに戻ります。続行しますか？`,
                onConfirm: () => performColDeletion(colIndex),
                confirmText: '強制削除',
                cancelText: 'キャンセル',
            });
        } else {
            performColDeletion(colIndex);
        }
    }, [scheduleData.assignments, scheduleData.cols, performColDeletion]);

    // --- 行・列の追加処理 (変更なし) ---
    const handleAddRow = useCallback(() => {
        const newRowHeader = calculateTimeRange(selectedStartTime, interviewDuration);
        // 🚨 修正点 2: 開始時刻が同じ時間帯があるかチェック
        const newRowStartTime = newRowHeader.split(' - ')[0];
        if (scheduleData.rows.some(row => row.startsWith(newRowStartTime + ' -'))) {
             // すでに同じ開始時刻が存在する場合は何もしない (durationが異なっても不可とする)
             return;
        }

        setScheduleData(prevData => {
            const originalRows = prevData.rows;
            const newOriginalRows = [...originalRows, newRowHeader];
            const sortedNewRows = sortTimeRows(newOriginalRows);

            const { newAssignments, newAvailability } = reconstructAssignments(
                originalRows, sortedNewRows, prevData.assignments, prevData.availability, prevData.cols
            );

            const nextStart = getNextStartTime(sortedNewRows, '09:00');
            setSelectedStartTime(nextStart);

            return {
                ...prevData,
                rows: sortedNewRows,
                assignments: newAssignments,
                availability: newAvailability,
            };
        });
    }, [selectedStartTime, interviewDuration, scheduleData.rows]);

    const handleAddColFromPicker = useCallback(() => {
        if (!selectedDate) return;

        const dateObj = new Date(selectedDate);
        // dateObjがInvalid Dateでないかチェック
        if (isNaN(dateObj.getTime())) return;

        const weekday = ['日', '月', '火', '水', '木', '金', '土'][dateObj.getDay()];

        // MM/DD 形式にフォーマット (ISO形式は YYYY-MM-DD なのでそのまま split/slice)
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const newHeader = `${month}/${day} (${weekday})`;

        if (scheduleData.cols.includes(newHeader)) return;

        setScheduleData(prevData => {
            const originalCols = prevData.cols;
            const newOriginalCols = [...originalCols, newHeader];
            const sortedNewCols = sortDateCols(newOriginalCols);

            const { newAssignments, newAvailability } = reconstructCols(
                originalCols, sortedNewCols, prevData.rows, prevData.assignments, prevData.availability
            );

            return {
                ...prevData,
                cols: sortedNewCols,
                assignments: newAssignments,
                availability: newAvailability,
            };
        });
    }, [selectedDate, scheduleData.cols, scheduleData.rows]);


    // --- 利用可否設定処理 (変更なし) ---
    const performUnassignAndToggle = useCallback((rowIndex, colIndex) => {
        setScheduleData(prevData => {
            const newAssignments = prevData.assignments.map(row => [...row]);
            const newAvailability = prevData.availability.map((row, rIdx) =>
                rIdx === rowIndex
                    ? row.map((val, cIdx) => (cIdx === colIndex ? false : val))
                    : row
            );

            newAssignments[rowIndex][colIndex] = null;

            return { ...prevData, assignments: newAssignments, availability: newAvailability };
        });
        setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} });
    }, []);

    const toggleSlotAvailability = useCallback((rowIndex, colIndex) => {
        const isCurrentlyAvailable = scheduleData.availability[rowIndex][colIndex];
        const assignedApplicantId = scheduleData.assignments[rowIndex][colIndex];
        const targetTime = scheduleData.rows[rowIndex];
        const targetDate = scheduleData.cols[colIndex];

        if (isCurrentlyAvailable && assignedApplicantId) {
            const applicantName = getApplicantName(assignedApplicantId);
            setModalState({
                isOpen: true,
                title: '割り当ての強制解除確認',
                message: `このスロット（${targetDate} ${targetTime}）には「${applicantName}」さんが割り当てられています。利用不可に設定すると、この割り当ては強制的に解除され、児童（生徒）リストに戻ります。実行しますか？`,
                onConfirm: () => performUnassignAndToggle(rowIndex, colIndex),
                confirmText: '強制解除して不可にする',
                cancelText: 'キャンセル (可のまま)',
            });
            return;
        }

        setScheduleData(prevData => {
            const newAvailability = prevData.availability.map((row, rIdx) =>
                rIdx === rowIndex
                    ? row.map((val, cIdx) => (cIdx === colIndex ? !val : val))
                    : row
            );
            return { ...prevData, availability: newAvailability };
        });
    }, [scheduleData, getApplicantName, performUnassignAndToggle]);

    // クリック割り当て処理 (変更なし)
    const handleSlotClick = useCallback((rowIndex, colIndex, isAvailable) => {
        const currentSlot = { rowIndex, colIndex };
        const isCurrentSlotSelected = selectedSlot && selectedSlot.rowIndex === rowIndex && selectedSlot.colIndex === colIndex;

        // 🚨 修正点 3: 利用不可スロットでも選択解除は可能にする
        if (!isAvailable && !isCurrentSlotSelected) {
            setSelectedSlot(null);
            return;
        }

        // --- スロット間のスワップ処理 (Slot A が選択されている状態で Slot B がクリックされた場合) ---
        if (selectedSlot && !isCurrentSlotSelected) {
            const fromRowIndex = selectedSlot.rowIndex;
            const fromColIndex = selectedSlot.colIndex;

            setScheduleData(prevData => {
                const newAssignments = prevData.assignments.map(row => [...row]);

                // Applicant A (Source) と Applicant B (Target) のIDを取得
                const applicantA = newAssignments[fromRowIndex][fromColIndex];
                const applicantB = newAssignments[rowIndex][colIndex];

                // 1. スロット A に スロット B の児童（生徒） (Applicant B) を割り当てる (nullも許容)
                newAssignments[fromRowIndex][fromColIndex] = applicantB;

                // 2. スロット B に スロット A の児童（生徒） (Applicant A) を割り当てる (nullも許容)
                newAssignments[rowIndex][colIndex] = applicantA;

                return { ...prevData, assignments: newAssignments };
            });

            // スワップ後は選択を解除
            setSelectedSlot(null);
            return;
        }
        // --- 通常の選択/解除処理 ---

        setSelectedSlot(prev =>
            isCurrentSlotSelected
                ? null
                : currentSlot
        );
    }, [selectedSlot]);

    const handleApplicantClick = useCallback((applicantId) => {
        if (!selectedSlot) return;

        const { rowIndex, colIndex } = selectedSlot;

        setScheduleData(prevData => {
            const newAssignments = prevData.assignments.map(row => [...row]);
            const targetApplicantId = newAssignments[rowIndex][colIndex];

            // 1. 既存の割り当て (targetApplicantId) があれば、それを解除 (nullにする)
            //    これにより、リストに戻る (assignedIdsから外れる)
            if (targetApplicantId) {
                newAssignments[rowIndex][colIndex] = null; // リストに戻すために一時的に解除
            }

            // 2. スロットから同じ児童（生徒）を解除する（他のスロットから移動させるため）
            //    (targetApplicantIdとは別の、applicantIdが既に割り当てられているスロットを探す)
            let foundSource = false;
            for (let r = 0; r < newAssignments.length; r++) {
                for (let c = 0; c < newAssignments[r].length; c++) {
                    if (newAssignments[r][c] === applicantId) {
                        newAssignments[r][c] = null;
                        foundSource = true;
                        break;
                    }
                }
                if (foundSource) break;
            }

            // 3. 選択されたスロットに割り当てる
            newAssignments[rowIndex][colIndex] = applicantId;

            return { ...prevData, assignments: newAssignments };
        });

        setSelectedSlot(null); // 割り当て完了後、選択解除
    }, [selectedSlot]);


    // --- D&D ロジック (変更なし) ---
    const handleDragStart = useCallback((e, applicantId, sourceCellId = null) => {
        e.dataTransfer.setData('applicantId', applicantId);
        e.dataTransfer.setData('sourceCellId', sourceCellId || 'applicant-list');
        setDraggingApplicantId(applicantId);
        e.dataTransfer.effectAllowed = "move";
        setSelectedSlot(null); // D&D開始時、クリック選択を解除
    }, []);

    const handleDragEnd = useCallback(() => {
        setDraggingApplicantId(null);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }, []);

    const handleDragEnter = useCallback((e, cellId) => {
        e.preventDefault();
        setHoveredCellId(cellId);
    }, []);

    const handleDragLeave = useCallback(() => {
        setHoveredCellId(null);
    }, []);

    const handleDrop = useCallback((e, targetId) => {
        e.preventDefault();
        setHoveredCellId(null);
        setSelectedSlot(null); // D&D完了時、クリック選択を解除

        const applicantId = e.dataTransfer.getData('applicantId');
        const sourceCellId = e.dataTransfer.getData('sourceCellId');

        const targetParts = targetId.split('-');
        const targetIsGrid = targetParts.length === 3;
        const targetRowIndex = targetIsGrid ? parseInt(targetParts[1], 10) : -1;
        const targetColIndex = targetIsGrid ? parseInt(targetParts[2], 10) : -1;

        const sourceParts = sourceCellId.split('-');
        const sourceIsGrid = sourceParts.length === 3;
        const sourceRowIndex = sourceIsGrid ? parseInt(sourceParts[1], 10) : -1;
        const sourceColIndex = sourceIsGrid ? parseInt(sourceParts[2], 10) : -1;

        if (targetIsGrid) {
            // 利用不可スロットへのドロップは拒否
            if (!scheduleData.availability[targetRowIndex][targetColIndex]) {
                setDraggingApplicantId(null);
                return;
            }
        }

        if (targetId === 'applicant-list') {
            // リストに戻す処理（ソースがグリッドの場合のみ）
            if (sourceIsGrid) {
                setScheduleData(prevData => {
                    const newAssignments = prevData.assignments.map(row => [...row]);
                    newAssignments[sourceRowIndex][sourceColIndex] = null;
                    return { ...prevData, assignments: newAssignments };
                });
            }
            setDraggingApplicantId(null);
            return;
        }

        if (!targetIsGrid || targetRowIndex < 0 || targetColIndex < 0) {
            setDraggingApplicantId(null);
            return;
        }

        setScheduleData(prevData => {
            const newAssignments = prevData.assignments.map(row => [...row]);
            const targetApplicantId = newAssignments[targetRowIndex][targetColIndex];

            // 1. 同じスロットへのドロップや、同じ児童（生徒）のリストから埋まったスロットへのドロップは無視
            if ((sourceIsGrid && sourceRowIndex === targetRowIndex && sourceColIndex === targetColIndex) ||
                (!sourceIsGrid && targetApplicantId !== null && applicantId === targetApplicantId)) {
                return prevData;
            }

            // 2. 割り当て解除 (移動元のスロットをクリア)
            if (sourceIsGrid && sourceRowIndex !== -1 && sourceColIndex !== -1) {
                newAssignments[sourceRowIndex][sourceColIndex] = null;
            }

            // 3. 割り当て処理
            // ターゲットスロットが空の場合
            if (targetApplicantId === null) {
                newAssignments[targetRowIndex][targetColIndex] = applicantId;

            // ターゲットスロットが埋まっており、ソースがグリッドの場合 (スワップ)
            } else if (sourceIsGrid) {
                newAssignments[targetRowIndex][targetColIndex] = applicantId;
                newAssignments[sourceRowIndex][sourceColIndex] = targetApplicantId; // 移動元にターゲットの児童（生徒）を配置
            // ターゲットスロットが埋まっており、ソースがリストの場合 (上書き & ターゲットをリストに戻す)
            } else if (!sourceIsGrid) {
                 // ターゲットスロットが埋まっており、ソースがリストの場合 (上書き)
                 newAssignments[targetRowIndex][targetColIndex] = applicantId;
            }

            return { ...prevData, assignments: newAssignments };
        });

        setDraggingApplicantId(null);
    }, [scheduleData.availability]);

    // スタイル (動的な部分をuseMemoに含める)
    const styles = useMemo(() => ({
        container: {
                    display: 'flex',
                    paddingTop: '6rem',
                    width: '100%',
                    height: '100vh',
                    backgroundColor: '#f8f8f8',
                    fontFamily: 'Inter, sans-serif',
                    position: 'relative',
                    boxSizing: 'border-box',
                    paddingLeft: '1.5rem',
                    paddingRight: '1.5rem',
                    paddingBottom: '1.5rem',
                },
                panel: {
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    backgroundColor: 'white',
                    height: 'calc(100vh - 7.5rem)',
                    overflowY: 'auto',
                    boxSizing: 'border-box',
                    flexShrink: 0,
                    marginTop: '1.5rem',
                },
                leftPanel: {
                    flex: '1',
                    marginRight: '1.5rem',
                    minWidth: '700px',
                },
                rightPanel: {
                    width: '300px',
                    minWidth: '300px',
                    flexShrink: 0,
                },
        baseItem: {
            padding: '0.6rem 1rem',
            margin: '0.6rem 0',
            borderRadius: '0.4rem',
            textAlign: 'center',
            fontWeight: '600',
            transition: 'all 0.2s ease-in-out',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            cursor: 'grab',
            fontSize: '0.95rem'
        },
        scheduledApplicant: {
            padding: '0.4rem',
            width: '90%',
            backgroundColor: '#4299e1',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            cursor: 'move',
            margin: '0.3rem 0',
        },
        button: {
            padding: '0.6rem 1.2rem',
            borderRadius: '0.5rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.1s ease-in-out',
            border: 'none',
            fontSize: '1rem',
        },
        navButton: {
            backgroundColor: '#718096',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            marginRight: '1rem',
        },
        activeNavButton: { backgroundColor: '#2d3748', },
        addButton: {
            backgroundColor: isAddButtonActive ? '#38a169' : '#48bb78',
            transform: isAddButtonActive ? 'translateY(1px)' : 'translateY(0)',
            color: 'white',
            boxShadow: isAddButtonActive ? '0 2px 4px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            marginRight: '0.5rem',
        },
        deleteButton: {
            backgroundColor: 'transparent',
            color: '#e53e3e',
            fontSize: '1rem',
            fontWeight: '700',
            padding: '0 0.5rem',
            cursor: 'pointer',
            marginLeft: 'auto',
            transition: 'color 0.1s',
        },
        inputStyle: {
            border: '1px solid #ccc',
            borderRadius: '0.3rem',
            padding: '0.6rem 0.75rem',
            marginRight: '1rem',
            minWidth: '100px',
            backgroundColor: '#fff',
        },
    }), [isAddButtonActive]);

    const getSlotStyle = useCallback((cellId, isAvailable, isSelected) => ({
        minWidth: '140px',
        minHeight: '70px',
        border: `2px ${hoveredCellId === cellId || isSelected ? 'solid' : 'dashed'} ${isAvailable ? (isSelected ? '#38a169' : '#718096') : '#cbd5e0'}`,
        borderRadius: '0.5rem',
        margin: '0.25rem',
        padding: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isAvailable
            ? (hoveredCellId === cellId ? '#e2e8f0' : (isSelected ? '#e6fffa' : '#edf2f7'))
            : (hoveredCellId === cellId ? '#e2e8f0' : '#f7fafc'),
        color: isAvailable ? '#4a5568' : '#a0aec0',
        fontWeight: '500',
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        pointerEvents: 'auto',
    }), [hoveredCellId]);

    // UIに公開するロジックと状態
    return {
        // データ
        scheduleData, applicants,
        modalState, setModalState,
        studentDetailsModalState,
        openStudentDetailsModal,
        closeStudentDetailsModal,
        // 🌟 新規/変更
        upsertStudentModalState,
        openAddStudentModal,
        closeUpsertStudentModal,
        handleSaveStudent,
        allScheduleSlots, // 🌟 追加: 全スロットのリスト
        // -----------------
        interviewDuration, DURATION_OPTIONS, setInterviewDuration,
        selectedDate, setSelectedDate,
        selectedStartTime, setSelectedStartTime, TIME_OPTIONS,
        draggingApplicantId, isAddButtonActive, setIsAddButtonActive,
        selectedSlot,

        // 関数
        getApplicantName,
        handleAddRow, handleDeleteRow,
        handleAddColFromPicker, handleDeleteCol,
        toggleSlotAvailability,
        handleDragStart, handleDragEnd, handleDragOver, handleDrop, handleDragEnter, handleDragLeave,
        handleSlotClick,
        handleApplicantClick,
        confirmDeleteStudent,
        getAssignmentDetails,
        getSiblingAssignmentDetails,

        // スタイル/レンダリングヘルパー
        styles, getSlotStyle,
    };
};

// --- IV. プレゼンテーションコンポーネント (UI層) ---

const ScheduleBoard = ({ manager }) => {
    const {
        scheduleData, getApplicantName, handleDragOver, handleDrop,
        handleDragStart, handleDragEnd, handleDragEnter, handleDragLeave,
        draggingApplicantId, styles, getSlotStyle,
        selectedSlot,
        handleSlotClick
    } = manager;

    const { rows: sortedRows, cols: sortedCols } = scheduleData;

    return (
        <div style={{ ...styles.panel, ...styles.leftPanel }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '800', marginBottom: '1rem', color: '#2d3748' }}>
              面接スケジュールボード (2次元)
            </h1>
            <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
                スロット選択後、右側の児童（生徒）をクリックして割り当てることも可能です。
            </p>

            {sortedRows.length === 0 || sortedCols.length === 0 ? (
                <p style={{textAlign: 'center', color: '#e53e3e', padding: '5rem', border: '1px dashed #e53e3e', borderRadius: '0.5rem'}}>
                    スロットが設定されていません。「スロット設定」画面で時間帯と日付を追加してください。
                </p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '900px' }}>
                        <thead>
                            <tr>
                                <th style={{
                                    border: '1px solid #e2e8f0',
                                    backgroundColor: '#f7fafc',
                                    padding: '0.75rem',
                                    whiteSpace: 'nowrap',
                                    width: '1%',
                                    fontWeight: '700',
                                    color: '#2d3748',
                                }}>時間帯</th>
                                {sortedCols.map((colHeader, sortedColIndex) => (
                                    <th key={sortedColIndex} style={{ border: '1px solid #e2e8f0', backgroundColor: '#e2e8f0', padding: '0.75rem', fontWeight: '700', color: '#2d3748' }}>
                                        {colHeader}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedRows.map((rowHeader, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td style={{
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: '#f7fafc',
                                        padding: '0.75rem',
                                        fontWeight: '700',
                                        color: '#2d3748',
                                        whiteSpace: 'nowrap',
                                        width: '1%',
                                    }}>
                                        {rowHeader}
                                    </td>
                                    {sortedCols.map((_, colIndex) => {
                                        const cellId = `slot-${rowIndex}-${colIndex}`;

                                        const applicantId = scheduleData.assignments[rowIndex][colIndex];
                                        const isAvailable = scheduleData.availability[rowIndex][colIndex];

                                        const isSelected = selectedSlot && selectedSlot.rowIndex === rowIndex && selectedSlot.colIndex === colIndex;

                                        const hasAssignmentOnUnavailableSlot = applicantId && !isAvailable;

                                        return (
                                            <td
                                                key={colIndex}
                                                style={{ border: '1px solid #e2e8f0', verticalAlign: 'top', padding: '0.5rem' }}
                                                onDragOver={handleDragOver}
                                                onDragEnter={(e) => handleDragEnter(e, cellId)}
                                                onDragLeave={handleDragLeave}
                                                onDrop={isAvailable ? (e) => handleDrop(e, cellId) : null}
                                                onClick={() => handleSlotClick(rowIndex, colIndex, isAvailable)}
                                            >
                                                <div style={getSlotStyle(cellId, isAvailable, isSelected)}>
                                                    {applicantId ? (
                                                        <div
                                                            style={{
                                                                ...styles.baseItem,
                                                                ...styles.scheduledApplicant,
                                                                ...(draggingApplicantId === applicantId ? {opacity: 0.4, boxShadow: 'none'} : {}),
                                                                backgroundColor: hasAssignmentOnUnavailableSlot ? '#ed8936' : '#4299e1',
                                                                cursor: 'move',
                                                            }}
                                                            draggable="true"
                                                            onDragStart={(e) => handleDragStart(e, applicantId, cellId)}
                                                            onDragEnd={handleDragEnd}
                                                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 6px 10px rgba(0,0,0,0.2)'}
                                                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = styles.scheduledApplicant.boxShadow}
                                                        >
                                                            {getApplicantName(applicantId)}
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: isAvailable ? (isSelected ? '#38a169' : '#a0aec0') : '#a0aec0', fontWeight: '700' }}>
                                                            {isSelected ? '選択中' : (isAvailable ? 'ここにドロップ/選択' : '利用不可')}
                                                        </span>
                                                    )}
                                                    {hasAssignmentOnUnavailableSlot && (
                                                        <span style={{ fontSize: '0.75rem', color: '#fff', backgroundColor: '#c53030', padding: '2px 4px', borderRadius: '4px', marginTop: '4px' }}>
                                                            要解除
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const SettingsScreen = ({ manager }) => {
    const {
        scheduleData, interviewDuration, DURATION_OPTIONS, setInterviewDuration,
        selectedDate, setSelectedDate, selectedStartTime, setSelectedStartTime, TIME_OPTIONS,
        handleAddRow, handleDeleteRow, handleAddColFromPicker, handleDeleteCol,
        isAddButtonActive, setIsAddButtonActive, styles
    } = manager;

    const { rows: sortedRows, cols: sortedCols } = scheduleData;

    return (
        <div style={{ ...styles.panel, ...styles.leftPanel }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '800', marginBottom: '1rem', color: '#2d3748' }}>
              スロット設定
            </h1>
            <p style={{ color: '#718096', marginBottom: '1.5rem' }}>面談時間、時間帯（縦軸）、日付（横軸）を設定します。</p>

            {/* --- 面談時間設定 --- */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2d3748', borderBottom: '2px solid #edf2f7', paddingBottom: '0.5rem', marginTop: '1.5rem' }}>
                面談時間 (スロットの長さ)
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem', marginBottom: '2rem' }}>
                <span style={{ marginRight: '1rem', fontWeight: '500', color: '#4a5568' }}>面談時間:</span>
                <select
                    value={interviewDuration}
                    onChange={(e) => setInterviewDuration(parseInt(e.target.value, 10))}
                    style={styles.inputStyle}
                >
                    {DURATION_OPTIONS.map(d => (
                        <option key={d} value={d}>{d} 分</option>
                    ))}
                </select>
                <span style={{ color: '#718096', marginLeft: '1rem', fontSize: '0.875rem' }}>
                    時間帯の追加は、この設定（{interviewDuration}分）に基づいて自動計算されます。
                </span>
            </div>

            {/* --- 時間帯（行）設定 --- */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2d3748', borderBottom: '2px solid #edf2f7', paddingBottom: '0.5rem', marginTop: '3rem' }}>
                時間帯 (縦軸) の追加と管理 - 昇順
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem', marginBottom: '1.5rem' }}>
                 <span style={{ marginRight: '1rem', fontWeight: '500', color: '#4a5568' }}>開始時刻:</span>
                 <select
                    value={selectedStartTime}
                    onChange={(e) => setSelectedStartTime(e.target.value)}
                    style={styles.inputStyle}
                 >
                    {TIME_OPTIONS.map(t => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                 </select>

                 <button
                    style={{ ...styles.button, ...styles.addButton }}
                    onClick={handleAddRow}
                    onMouseDown={() => setIsAddButtonActive(true)}
                    onMouseUp={() => setIsAddButtonActive(false)}
                    onMouseLeave={() => setIsAddButtonActive(false)}
                >
                  + 時間帯 ({interviewDuration}分間) を追加
                </button>
            </div>
            <div style={{ maxWidth: '600px', maxHeight: '250px', overflowY: 'auto', border: '1px solid #edf2f7', borderRadius: '0.5rem', padding: '0.5rem' }}>
                {sortedRows.map((rowHeader, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0.5rem', borderBottom: '1px solid #edf2f7' }}>
                        <span style={{ fontWeight: '700', color: '#718096', minWidth: '30px' }}>
                            {index + 1}.
                        </span>
                        <span style={{ fontWeight: '600', color: '#2d3748', flexGrow: 1 }}>
                            {rowHeader}
                        </span>
                        <span style={{ color: '#718096', fontSize: '0.875rem', marginRight: '1rem' }}>
                            ({sortedCols.length}スロット)
                        </span>
                        <button
                            style={styles.deleteButton}
                            onClick={() => handleDeleteRow(index)}
                            title="この時間帯を削除"
                            onMouseEnter={(e) => e.currentTarget.style.color = '#c53030'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#e53e3e'}
                        >
                            削除 &times;
                        </button>
                    </div>
                ))}
                {sortedRows.length === 0 && (
                     <p style={{textAlign: 'center', color: '#718096', padding: '1rem'}}>
                        時間帯がありません。
                    </p>
                )}
            </div>

            {/* --- 日付（列）設定 --- */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2d3748', borderBottom: '2px solid #edf2f7', paddingBottom: '0.5rem', marginTop: '3rem' }}>
                日付 (横軸) の追加と管理 - 昇順
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem', marginBottom: '1.5rem' }}>
                 <span style={{ marginRight: '1rem', fontWeight: '500', color: '#4a5568' }}>日付選択:</span>
                 <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={styles.inputStyle}
                 />

                 <button
                    style={{ ...styles.button, ...styles.addButton }}
                    onClick={handleAddColFromPicker}
                >
                  + 選択した日付を追加
                </button>
            </div>
            <div style={{ maxWidth: '600px', maxHeight: '250px', overflowY: 'auto', border: '1px solid #edf2f7', borderRadius: '0.5rem', padding: '0.5rem' }}>
                {sortedCols.map((colHeader, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem 0.5rem', borderBottom: '1px solid #edf2f7' }}>
                        <span style={{ fontWeight: '700', color: '#718096', minWidth: '30px' }}>
                            {index + 1}.
                        </span>
                        <span style={{ fontWeight: '600', color: '#2d3748', flexGrow: 1 }}>
                            {colHeader}
                        </span>
                        <span style={{ color: '#718096', fontSize: '0.875rem', marginRight: '1rem' }}>
                             ({sortedRows.length}スロット)
                        </span>
                        <button
                            style={styles.deleteButton}
                            onClick={() => handleDeleteCol(index)}
                            title="この列を削除"
                            onMouseEnter={(e) => e.currentTarget.style.color = '#c53030'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#e53e3e'}
                        >
                            削除 &times;
                        </button>
                    </div>
                ))}
                {sortedCols.length === 0 && (
                     <p style={{textAlign: 'center', color: '#718096', padding: '1rem'}}>
                        日付がありません。
                    </p>
                )}
            </div>
        </div>
    );
};

const SlotSettingsPanel = ({ manager }) => {
    const { scheduleData, getApplicantName, toggleSlotAvailability, styles } = manager;

    return (
        <div style={{ ...styles.panel, ...styles.rightPanel, display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: '#2d3748' }}>
              スロット利用可否設定
            </h2>
            <p style={{ color: '#718096', marginBottom: '1rem', fontSize: '0.875rem' }}>
                 「可」に設定されたスロットのみ、児童（生徒）をドロップできます。
                 割り当て済みのスロットを「不可」にすると、割り当てが強制的に解除されます。
            </p>

            {/* スロット個別設定リスト */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
                {scheduleData.rows.length === 0 && scheduleData.cols.length === 0 ? (
                    <p style={{ color: '#718096', textAlign: 'center', padding: '1rem' }}>
                        スロットがありません。左側で追加してください。
                    </p>
                ) : (
                    scheduleData.rows.map((rowHeader, rowIndex) => (
                        scheduleData.cols.map((colHeader, colIndex) => {
                            const isAvailable = scheduleData.availability[rowIndex][colIndex];
                            const assignmentId = scheduleData.assignments[rowIndex][colIndex];

                            return (
                                <div key={`${rowIndex}-${colIndex}`} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.75rem 0.5rem',
                                    borderBottom: '1px dashed #edf2f7',
                                    backgroundColor: isAvailable ? '#f7fff8' : '#fff7f7',
                                }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#2d3748', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                            {colHeader}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#718096' }}>
                                            {rowHeader}
                                        </div>
                                        {assignmentId && (
                                            <div style={{ fontSize: '0.75rem', color: '#4299e1', marginTop: '2px' }}>
                                                (割当済: {getApplicantName(assignmentId)})
                                            </div>
                                        )}
                                    </div>

                                    <span style={{
                                        marginRight: '0.75rem',
                                        fontWeight: '700',
                                        color: isAvailable ? '#48bb78' : '#f56565',
                                    }}>
                                        {isAvailable ? '可' : '不可'}
                                    </span>

                                    <ToggleSwitch
                                        isChecked={isAvailable}
                                        onChange={() => toggleSlotAvailability(rowIndex, colIndex)}
                                    />
                                </div>
                            );
                        })
                    ))
                )}
            </div>
        </div>
    );
};

const ApplicantList = ({ manager }) => {
    const {
        applicants, scheduleData, handleDragOver, handleDrop,
        handleDragStart, handleDragEnd, draggingApplicantId, styles,
        selectedSlot,
        handleApplicantClick
    } = manager;

    const assignedIds = useMemo(() => scheduleData.assignments.flat().filter(id => id !== null), [scheduleData.assignments]);

    return (
        <div
            style={{ ...styles.panel, ...styles.rightPanel }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'applicant-list')}
        >
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: '#2d3748' }}>
              未割り当ての児童（生徒）リスト
            </h2>
            <p style={{ color: '#718096', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {selectedSlot
                    ? 'スロットが選択されています。児童（生徒）をクリックして割り当ててください。'
                    : 'スロットからここにドロップすると割り当て解除され、リストに戻ります'
                }
            </p>
            <div className="applicant-list" style={{ overflowY: 'auto', flex: 1 }}>
                {applicants.map(applicant => (
                    !assignedIds.includes(applicant.id) && (
                        <div
                            key={applicant.id}
                            draggable="true"
                            onDragStart={(e) => handleDragStart(e, applicant.id)}
                            onDragEnd={handleDragEnd}
                            onClick={() => handleApplicantClick(applicant.id)}
                            style={{
                                ...styles.baseItem,
                                // スロット選択中はクリック可能な要素であることを示唆する色に変更
                                backgroundColor: selectedSlot ? '#d1f1da' : '#ebf8ff',
                                border: `1px solid ${selectedSlot ? '#48bb78' : '#90cdf4'}`,
                                cursor: selectedSlot ? 'pointer' : 'grab',
                                ...(draggingApplicantId === applicant.id ? {opacity: 0.4, boxShadow: 'none'} : {}),
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = selectedSlot ? '#c4e0f5' : '#c4e0f5'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedSlot ? '#d1f1da' : '#ebf8ff'}
                        >
                            {applicant.name}
                        </div>
                    )
                ))}
              {assignedIds.length === applicants.length && (
                <p style={{textAlign: 'center', marginTop: '2rem', color: '#48bb78', fontWeight: '700'}}>
                    全ての児童（生徒）が割り当てられました！
                </p>
              )}
            </div>
          </div>
    );
};

// --- 児童（生徒）情報設定画面コンポーネント (追加ボタンをモーダル起動に変更) ---
const StudentSettingsScreen = ({ manager }) => {
    const {
        applicants, styles,
        confirmDeleteStudent, getAssignmentDetails,
        openStudentDetailsModal,
        openAddStudentModal // 🌟 変更: モーダル起動関数を使用
    } = manager;

    // スケジュールに割り当てられている児童（生徒）のIDリスト
    const assignedIds = useMemo(() => manager.scheduleData.assignments.flat().filter(id => id !== null), [manager.scheduleData.assignments]);

    const inputAndButtonContainer = {
        display: 'flex',
        alignItems: 'center',
        marginTop: '1rem',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '2px dashed #edf2f7'
    };

    const addButton = {
        ...styles.button,
        backgroundColor: '#48bb78',
        color: 'white',
    };

    const deleteButton = {
        ...styles.deleteButton,
        backgroundColor: '#fef2f2',
        border: '1px solid #f56565',
        borderRadius: '0.3rem',
        padding: '0.3rem 0.6rem',
        fontSize: '0.875rem',
        fontWeight: '600',
        marginLeft: '1rem',
    };

    const detailsLinkStyle = {
        color: '#4299e1',
        backgroundColor: 'transparent',
        border: 'none',
        padding: '0.3rem 0.6rem',
        fontSize: '0.875rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'color 0.1s',
        textDecoration: 'underline',
        marginRight: '0.5rem',
        marginLeft: '1rem',
        flexShrink: 0,
        whiteSpace: 'nowrap',
    };

    const handleViewDetails = useCallback((student) => {
        openStudentDetailsModal(student);
    }, [openStudentDetailsModal]);

    // 🌟 変更: 新規追加ボタンのハンドラ
    const handleAddStudentClick = useCallback(() => {
        openAddStudentModal();
    }, [openAddStudentModal]);


    return (
        <div style={{ ...styles.panel, ...styles.leftPanel }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '800', marginBottom: '1rem', color: '#2d3748' }}>
              児童（生徒）情報設定
            </h1>
            <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
                スケジュールボードに配置する児童（生徒）のリストを管理します。
            </p>

            {/* 児童（生徒）追加フォーム -> モーダル起動ボタンに変更 */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2d3748', borderBottom: '2px solid #edf2f7', paddingBottom: '0.5rem', marginTop: '1.5rem' }}>
                新規児童（生徒）の追加
            </h2>
            <div style={{...inputAndButtonContainer, justifyContent: 'flex-end'}}>
                 <button
                    style={{...addButton, padding: '0.75rem 2rem'}}
                    onClick={handleAddStudentClick} // モーダルを起動
                >
                  + 新規児童（生徒）を追加（詳細設定）
                </button>
            </div>

            {/* 児童（生徒）リスト */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2d3748', borderBottom: '2px solid #edf2f7', paddingBottom: '0.5rem', marginTop: '1.5rem' }}>
                登録済み児童（生徒） ({applicants.length}名)
            </h2>
            <div style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto', border: '1px solid #edf2f7', borderRadius: '0.5rem', marginTop: '1rem' }}>
                {applicants.map((student) => {
                    const isAssigned = assignedIds.includes(student.id);
                    // 割り当て日程を取得
                    const assignment = isAssigned ? getAssignmentDetails(student.id) : null;

                    return (
                        <div key={student.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0.75rem 1rem',
                            borderBottom: '1px solid #edf2f7',
                            backgroundColor: isAssigned ? '#f7fff8' : 'white',
                        }}>
                            <span style={{ fontWeight: '600', color: '#2d3748', flexGrow: 1 }}>
                                {student.name}
                            </span>
                            {/* 割り当て日程を表示 */}
                            {isAssigned && assignment ? (
                                <div style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '700',
                                    color: '#38a169',
                                    marginRight: '1rem',
                                    textAlign: 'right',
                                    flexShrink: 0,
                                }}>
                                    <div>{assignment.date}</div>
                                    <div style={{fontWeight: '500', fontSize: '0.8rem', color: '#718096'}}>{assignment.time}</div>
                                </div>
                            ) : (
                                <span style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '700',
                                    color: '#718096',
                                    marginRight: '1rem',
                                    flexShrink: 0,
                                }}>
                                    未割当
                                </span>
                            )}
                            {/* 詳細リンク */}
                            <button
                                style={detailsLinkStyle}
                                onClick={() => handleViewDetails(student)}
                                title="この児童（生徒）の詳細を表示"
                                onMouseEnter={(e) => e.currentTarget.style.color = '#3182ce'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#4299e1'}
                            >
                                詳細
                            </button>
                            {/* 削除ボタン */}
                            <button
                                style={deleteButton}
                                onClick={() => confirmDeleteStudent(student)}
                                title="この児童（生徒）をリストから削除"
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fca5a5'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                            >
                                削除
                            </button>
                        </div>
                    );
                })}
                {applicants.length === 0 && (
                    <p style={{textAlign: 'center', color: '#718096', padding: '1rem'}}>
                        児童（生徒）が登録されていません。
                    </p>
                )}
            </div>
        </div>
    );
};

// --- V. メインコンポーネント (統合層) ---

// --- V. メインコンポーネント (統合層) ---

const App = () => {
    // 🚨 修正: 児童（生徒）データ構造を更新し、新しい詳細情報（兄弟の調整希望日程など）を含める
    // 15分スロット設定を前提に希望日程を修正
    const initialApplicants = [
        // 割り当て済みの佐藤太郎さんは、田中一郎さんを兄弟として設定
        {
            id: 'app-1',
            name: '佐藤 太郎',
            student_id: '1201',
            sibling_id: 'app-3',
            sibling_class: '小学3年B組',
            sibling_coordination_slot: '12/01 (月) 09:15 - 09:30', // 調整希望日程を追加
            preferred_dates: ['12/01 (月) 09:15 - 09:30', '11/30 (日) 14:00 - 14:15']
        },
        // 山田花子さんは兄弟なし
        {
            id: 'app-2',
            name: '山田 花子',
            student_id: '1202',
            sibling_id: null,
            sibling_class: null,
            sibling_coordination_slot: null,
            preferred_dates: ['12/01 (月) 13:00 - 13:15', '11/30 (日) 11:00 - 11:15']
        },
        // 田中一郎さんは、佐藤太郎さんを兄弟として設定 (IDを相互参照)
        {
            id: 'app-3',
            name: '田中 一郎',
            student_id: '1203',
            sibling_id: 'app-1',
            sibling_class: '小学5年A組',
            sibling_coordination_slot: '12/01 (月) 09:00 - 09:15', // 調整希望日程を追加
            preferred_dates: ['12/01 (月) 09:00 - 09:15', '11/30 (日) 09:00 - 09:15']
        },
        // 鈴木美咲さんは希望日程なし
        {
            id: 'app-4',
            name: '鈴木 美咲',
            student_id: '1204',
            sibling_id: null,
            sibling_class: null,
            sibling_coordination_slot: null,
            preferred_dates: []
        },
    ];

    // 1. ロジック層からすべての機能を取得
    const manager = useScheduleManager(initialApplicants);

    // 2. UI表示の状態とナビゲーションを管理
    const [view, setView] = useState('students'); // 児童（生徒）設定画面を初期表示

    // 3. プレゼンテーションコンポーネントに委譲
    const renderMainPanel = () => {
        if (view === 'schedule') return <ScheduleBoard manager={manager} />;
        if (view === 'settings') return <SettingsScreen manager={manager} />;
        if (view === 'students') return <StudentSettingsScreen manager={manager} />;
        return null;
    };

    const renderRightPanel = () => {
        if (view === 'schedule') return <ApplicantList manager={manager} />;
        if (view === 'settings') return <SlotSettingsPanel manager={manager} />;
        if (view === 'students') {
            // 児童（生徒）情報設定画面の右側は非表示または空のパネルにする
            return (
                <div style={{ ...manager.styles.rightPanel, backgroundColor: 'transparent', boxShadow: 'none' }}>
                    <p style={{color: '#718096', textAlign: 'center', padding: '1rem', marginTop: '10vh', border: '1px dashed #ccc', borderRadius: '0.5rem'}}>
                        児童（生徒）の追加・削除は<br/>左側のパネルで行います。
                    </p>
                </div>
            );
        }
        return null;
    };

    const navContainerStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        zIndex: 100,
        borderBottom: '1px solid #e2e8f0',
    };

    return (
        <div style={manager.styles.container}>

            {/* 画面切り替えナビゲーション */}
            <div style={navContainerStyle}>
                <h1 style={{fontSize: '1.25rem', fontWeight: '800', color: '#2d3748', marginRight: '2rem', flexShrink: 0}}>
                    面談スケジュール管理
                </h1>
                <button
                    style={{
                        ...manager.styles.button,
                        ...manager.styles.navButton,
                        ...(view === 'schedule' ? manager.styles.activeNavButton : {}),
                    }}
                    onClick={() => setView('schedule')}
                >
                    スケジュールボード
                </button>
                <button
                    style={{
                        ...manager.styles.button,
                        ...manager.styles.navButton,
                        ...(view === 'settings' ? manager.styles.activeNavButton : {}),
                    }}
                    onClick={() => setView('settings')}
                >
                    スロット設定
                </button>
                {/* 新規追加ボタン */}
                <button
                    style={{
                        ...manager.styles.button,
                        ...manager.styles.navButton,
                        ...(view === 'students' ? manager.styles.activeNavButton : {}),
                    }}
                    onClick={() => setView('students')}
                >
                    児童（生徒）情報設定
                </button>
            </div>

            {/* 左側メインパネル (委譲) */}
            {renderMainPanel()}

            {/* 右側パネル (委譲) */}
            {renderRightPanel()}

            {/* 削除確認モーダル (ロジック層から受け取った状態と関数を使用) */}
            <ConfirmationModal
                isOpen={manager.modalState.isOpen}
                title={manager.modalState.title}
                message={manager.modalState.message}
                onConfirm={manager.modalState.onConfirm}
                onCancel={() => manager.setModalState({ isOpen: false, title: '', message: '', onConfirm: () => {} })}
            />

            {/* 児童（生徒）詳細モーダル */}
            <StudentDetailsModal
                isOpen={manager.studentDetailsModalState.isOpen}
                student={manager.studentDetailsModalState.student}
                onClose={manager.closeStudentDetailsModal}
                assignmentDetails={manager.getAssignmentDetails(manager.studentDetailsModalState.student?.id)}
                siblingDetails={manager.getSiblingAssignmentDetails(manager.studentDetailsModalState.student)}
            />

            {/* 🌟 新規: 児童（生徒）追加/編集モーダル */}
            <UpsertStudentModal
                isOpen={manager.upsertStudentModalState.isOpen}
                student={manager.upsertStudentModalState.student}
                allApplicants={manager.applicants}
                allScheduleSlots={manager.allScheduleSlots} // 🌟 追加: 全スロットを渡す
                onSave={manager.handleSaveStudent}
                onClose={manager.closeUpsertStudentModal}
            />
        </div>
    );
};

export default App;