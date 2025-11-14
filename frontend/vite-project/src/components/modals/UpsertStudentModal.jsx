import React, { useState } from 'react';
const UpsertStudentModal = ({ isOpen, student, allApplicants, allScheduleSlots, onSave, onClose }) => {
    if (!isOpen || !student) return null;

    const initialFormData = {
        name: student.name || '',
        student_id: student.student_id || '',
//         sibling_id: student.sibling_id || '',
//         sibling_class: student.sibling_class || '',
//         sibling_coordination_slot: student.sibling_coordination_slot || '',
        preferred_dates: student.preferred_dates || [],
        id: student.id,
//         sibling_name_manual: student.sibling_name_manual || '',
    };

    const [formData, setFormData] = useState(initialFormData);

    // 兄弟の有無を管理
//     const [hasSibling, setHasSibling] = useState(!!initialFormData.sibling_id);

    // 🚨 新規状態: 兄弟の氏名を手動入力するための状態
//     const [siblingNameManual, setSiblingNameManual] = useState(initialFormData.sibling_name_manual || '');

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
//        if (name === 'hasSibling') { // 🌟 変更点 2-1: ラジオボタンのロジック
//            const isSiblingPresent = checked && value === 'yes';
//            setHasSibling(isSiblingPresent);
//
//            // 「いない」に変更した場合、関連フィールドをクリア
//            if (!isSiblingPresent) {
//                setFormData(prev => ({
//                    ...prev,
//                    sibling_id: null, // 兄弟IDをクリア
//                    sibling_class: '',
//                    sibling_coordination_slot: null,
//                }));
//                setSiblingNameManual(''); // 手動入力の氏名もクリア
//            } else {
//                // 「いる」に変更した場合、フォームの内部状態としてプレースホルダーIDを設定
//                // 兄弟が「いる」状態であることを示すために使用します
//                setFormData(prev => ({ ...prev, sibling_id: 'manual_entry' }));
//            }
//        } else if (name === 'sibling_name_manual') { // 🌟 変更点 2-2: 手動氏名入力のロジック
//            setSiblingNameManual(value);
//        } else {
//            setFormData(prev => ({ ...prev, [name]: value }));
//        }
          setFormData(prev => ({ ...prev, [name]: value }));
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
//         if (!hasSibling) {
//             baseData.sibling_id = null;
//             baseData.sibling_class = null;
//             baseData.sibling_coordination_slot = null;
//             baseData.sibling_name_manual = null; // 手動入力フィールドもクリア
//         } else {
//             // 兄弟がいる場合
//             // sibling_idは「いる」ことを示すダミー値 (manual_entry) または以前のIDを保持
//             baseData.sibling_id = formData.sibling_id || 'manual_entry';
//             baseData.sibling_class = (formData.sibling_class && formData.sibling_class.trim()) ? formData.sibling_class.trim() : null;
//             baseData.sibling_coordination_slot = formData.sibling_coordination_slot || null;
//             baseData.sibling_name_manual = siblingNameManual.trim(); // 手動入力された氏名を保存
//         }

        onSave(baseData);
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
{/*                     <h4 style={h4Style}>兄弟の情報</h4> */}
{/*                     <div> */}
{/*                         <label style={labelStyle}>兄弟はいますか？</label> */}
{/*                         <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '0.5rem' }}> */}
{/*                             <label style={{ fontWeight: '500', color: '#4a5568', display: 'flex', alignItems: 'center' }}> */}
{/*                                 <input */}
{/*                                     type="radio" */}
{/*                                     name="hasSibling" */}
{/*                                     value="yes" */}
{/*                                     checked={hasSibling} */}
{/*                                     onChange={handleChange} */}
{/*                                     style={{ marginRight: '0.5rem' }} */}
{/*                                 /> */}
{/*                                 いる */}
{/*                             </label> */}
{/*                             <label style={{ fontWeight: '500', color: '#4a5568', display: 'flex', alignItems: 'center' }}> */}
{/*                                 <input */}
{/*                                     type="radio" */}
{/*                                     name="hasSibling" */}
{/*                                     value="no" */}
{/*                                     checked={!hasSibling} */}
{/*                                     onChange={handleChange} */}
{/*                                     style={{ marginRight: '0.5rem' }} */}
{/*                                 /> */}
{/*                                 いない */}
{/*                             </label> */}
{/*                         </div> */}
{/*                     </div> */}
{/*                     {hasSibling && ( */}
{/*                         <div style={{ borderLeft: '3px solid #63b3ed', paddingLeft: '1rem', marginTop: '1rem', paddingBottom: '0.5rem' }}> */}
{/*                              */}{/* 🚨 兄弟の氏名入力フィールド（手動入力） */}
{/*                             <div> */}
{/*                                 <label style={labelStyle} htmlFor="sibling_name_manual">兄弟の氏名 <span style={{color: '#e53e3e'}}>*</span></label> */}
{/*                                 <input */}
{/*                                     id="sibling_name_manual" */}
{/*                                     name="sibling_name_manual" */}
{/*                                     type="text" */}
{/*                                     value={siblingNameManual} */}
{/*                                     onChange={handleChange} */}
{/*                                     style={inputStyle} */}
{/*                                     placeholder="例: 佐藤 次郎" */}
{/*                                     required // 氏名を入力必須とする */}
{/*                                 /> */}
{/*                             </div> */}

{/*                             <div> */}
{/*                                 <label style={labelStyle} htmlFor="sibling_class">兄弟のクラス</label> */}
{/*                                 <input */}
{/*                                     id="sibling_class" */}
{/*                                     name="sibling_class" */}
{/*                                     type="text" */}
{/*                                     value={formData.sibling_class || ''} */}
{/*                                     onChange={handleChange} */}
{/*                                     style={inputStyle} */}
{/*                                     placeholder="例: 小学5年A組" */}
{/*                                 /> */}
{/*                             </div> */}

{/*                              */}{/* 🌟 既存の兄弟の調整希望日程プルダウン（再利用） */}
{/*                             <div> */}
{/*                                 <label style={labelStyle} htmlFor="sibling_coordination_slot">兄弟の調整希望日程</label> */}
{/*                                 <select */}
{/*                                     id="sibling_coordination_slot" */}
{/*                                     name="sibling_coordination_slot" */}
{/*                                     value={formData.sibling_coordination_slot || ''} */}
{/*                                     onChange={handleChange} */}
{/*                                     style={inputStyle} */}
{/*                                 > */}
{/*                                     <option value="">-- 面談枠を選択 --</option> */}
{/*                                     {allScheduleSlots.map(slot => ( */}
{/*                                         <option key={slot} value={slot}>{slot}</option> */}
{/*                                     ))} */}
{/*                                 </select> */}
{/*                                 <p style={{fontSize: '0.8rem', color: '#718096', margin: '0 0 0.5rem 0'}}> */}
{/*                                     面談枠が未設定の場合は面談枠が表示されません。 */}
{/*                                 </p> */}
{/*                             </div> */}
{/*                         </div> */}
{/*                     )} */}

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
                                    面談枠が設定されていません。面談枠の設定画面で面談枠を作成してください。
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
export default UpsertStudentModal;