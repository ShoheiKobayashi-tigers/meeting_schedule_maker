import React, { useEffect, useMemo } from 'react';
import { styles } from './style/UpsertStudentModalStyle.js';
import { combineName, splitName } from '../../utils/nameUtils.js';
import { combineClass, splitClass } from '../../utils/classUtils.js';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// 基本的なバリデーションスキーマ
const studentSchema = z.object({
    lastName: z.string().min(1, '苗字は必須です'),
    firstName: z.string().min(1, '名前は必須です'),
    student_id: z.string().min(1, '出席番号は必須です'),
    preferred_dates: z.array(z.string()).default([]),

    // 兄弟に関するフィールド
    hasSibling: z.enum(['yes', 'no']),
    sibling_last_name_manual: z.string().optional(),
    sibling_first_name_manual: z.string().optional(),
    sibling_grade_manual: z.string().optional(),
    sibling_class_number_manual: z.string().optional(),
    sibling_coordination_slot: z.string().optional().nullable(),
}).superRefine((data, ctx) => {
    // 条件付きバリデーション: 兄弟がいる場合
    if (data.hasSibling === 'yes') {
        // 1. 兄弟の氏名は必須
        if (!data.sibling_last_name_manual || data.sibling_last_name_manual.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: '兄弟の苗字は必須です',
                path: ['sibling_last_name_manual'],
            });
        }
        if (!data.sibling_first_name_manual || data.sibling_first_name_manual.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: '兄弟の名前は必須です',
                path: ['sibling_first_name_manual'],
            });
        }

        // 2. クラスの設定: 片方だけ入力されている場合はエラー
        const grade = data.sibling_grade_manual?.trim();
        const classNumber = data.sibling_class_number_manual?.trim();
        if (!data.sibling_first_name_manual || data.sibling_first_name_manual.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: '学年は必須です',
                path: ['sibling_grade_manual'],
            });
        }
        if (!data.sibling_first_name_manual || data.sibling_first_name_manual.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'クラスは必須です',
                path: ['sibling_class_number_manual'],
            });
        }
    }
});

const UpsertStudentModal = ({ isOpen, student, allApplicants, allScheduleSlots, unBlockedSlots, onSave, onClose }) => {
    if (!isOpen || !student) return null;

    // 分割ユーティリティの使用
    const { lastName: initialLastName, firstName: initialFirstName } = splitName(student.name);

    // モード判定
    const isEditMode = !!student.id;

    const defaultFormValues = React.useMemo(() => {
        const { lastName, firstName } = splitName(student.name);

        return {
            lastName: lastName || '',
            firstName: firstName || '',
            student_id: String(student.student_id || ''),
            preferred_dates: student.preferred_dates || [],
            hasSibling: 'no',
            sibling_last_name_manual: '',
            sibling_first_name_manual: '',
            sibling_grade_manual: '',
            sibling_class_number_manual: '',
            sibling_coordination_slot: '',
        };
    }, [student]);

    // React Hook Form のセットアップ
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(studentSchema),
        defaultValues: defaultFormValues,
    });

    // モーダルが開いたときやstudentが変わったときにフォームをリセット
    useEffect(() => {
        if (isOpen && student) {
            const { lastName, firstName } = splitName(student.name);
            reset({
                lastName: lastName || '',
                firstName: firstName || '',
                student_id: String(student.student_id || ''),
                preferred_dates: student.preferred_dates || [],
                hasSibling: 'no',
                sibling_last_name_manual: '',
                sibling_first_name_manual: '',
                sibling_grade_manual: '',
                sibling_class_number_manual: '',
                sibling_coordination_slot: '',
            });
        }
    }, [isOpen, student, reset]);

    // 兄弟がいるかどうかを監視（表示切り替え用）
    const hasSiblingValue = watch('hasSibling');
    const isSiblingPresent = hasSiblingValue === 'yes';

    // スタイル
    const {
        overlayStyle, contentStyle, h4Style,
        labelStyle, inputStyle, buttonBaseStyle,
        headerStyle, closeButtonStyle
    } = styles;

    // 送信ハンドラ
    const onSubmit = (data) => {
        const fullName = combineName(data.lastName, data.firstName);

        const baseData = {
            id: student.id,
            family_id: student.family_id || '',
            name: fullName,
            student_id: data.student_id.trim(),
            preferred_dates: data.preferred_dates,
        };

        if (isSiblingPresent) {
            const siblingFullName = combineName(data.sibling_last_name_manual, data.sibling_first_name_manual);
            const siblingFullClass = combineClass(data.sibling_grade_manual, data.sibling_class_number_manual);

            baseData.sibling_id = 'manual_entry'; // 新規追加ロジックに基づく
            baseData.sibling_name_manual = siblingFullName;
            baseData.sibling_class = siblingFullClass || null;
            baseData.sibling_coordination_slot = data.sibling_coordination_slot || null;
        } else {
            baseData.sibling_id = null;
            baseData.sibling_name_manual = null;
            baseData.sibling_class = null;
            baseData.sibling_coordination_slot = null;
        }

        onSave(baseData);
    };

    // エラーメッセージ用のスタイル
    const errorMsgStyle = {
        color: '#e53e3e',
        fontSize: '0.75rem',
        marginTop: '0.25rem'
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
                    <form onSubmit={handleSubmit(onSubmit)}>

                        {/* 1. 基本情報 (省略) */}
                        <h4 style={h4Style}>基本情報</h4>
                        {/* 氏名、出席番号の入力フィールドは省略 */}
                        <div>
                            <label style={labelStyle} htmlFor="name">氏名 <span style={{color: '#e53e3e'}}>*</span></label>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="lastName" style={{...labelStyle, fontSize: '0.875rem', fontWeight: 'normal'}}>苗字</label>
                                    <input id="lastName" name="lastName" type="text" {...register('lastName')} style={inputStyle} required />
                                    {errors.lastName && <p style={errorMsgStyle}>{errors.lastName.message}</p>}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label htmlFor="firstName" style={{...labelStyle, fontSize: '0.875rem', fontWeight: 'normal'}}>名前</label>
                                    <input id="firstName" name="firstName" type="text" {...register('firstName')} style={inputStyle} required />
                                    {errors.firstName && <p style={errorMsgStyle}>{errors.firstName.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle} htmlFor="student_id">出席番号 <span style={{color: '#e53e3e'}}>*</span></label>
                            <input id="student_id" name="student_id" type="number" {...register('student_id')} style={inputStyle} placeholder="半角数字のみ" />
                            {errors.student_id && <p style={errorMsgStyle}>{errors.student_id.message}</p>}
                        </div>


                        {/* 2. 希望日程 (省略) */}
                        <h4 style={h4Style}>希望日程（日時のリスト）</h4>
                        {/* チェックボックスグループは省略 */}
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
                                {unBlockedSlots.length > 0 ? (
                                    unBlockedSlots.map(slot => (
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
                                                    {...register('preferred_dates')}
                                                    value={slot}
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
                        {!isEditMode && (
                            <>
                            <h4 style={h4Style}>兄弟の情報</h4>
                            <div>
                                <label style={labelStyle}>兄弟はいますか？</label>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '0.5rem' }}>
                                    <label style={{ fontWeight: '500', color: '#4a5568', display: 'flex', alignItems: 'center' }}>
                                        <input type="radio" name="hasSibling" value="yes" {...register('hasSibling')} style={{ marginRight: '0.5rem' }} />
                                        いる
                                    </label>
                                    <label style={{ fontWeight: '500', color: '#4a5568', display: 'flex', alignItems: 'center' }}>
                                        <input type="radio" name="hasSibling" value="no" {...register('hasSibling')} style={{ marginRight: '0.5rem' }} />
                                        いない
                                    </label>
                                </div>
                            </div>

                            <div style={{
                                borderLeft: '3px solid #63b3ed',
                                paddingLeft: '1rem',
                                marginTop: '1rem',
                                paddingBottom: '0.5rem',
                                display: isSiblingPresent ? 'block' : 'none'
                            }}>
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
                                                {...register('sibling_last_name_manual')}
                                                style={inputStyle}
                                            />
                                            {errors.sibling_last_name_manual && <p style={errorMsgStyle}>{errors.sibling_last_name_manual.message}</p>}
                                        </div>

                                        {/* 名前 (firstName) */}
                                        <div style={{ flex: 1 }}>
                                            <label htmlFor="sibling_first_name_manual" style={{...labelStyle, fontSize: '0.875rem', fontWeight: 'normal'}}>名前</label>
                                            <input
                                                id="sibling_first_name_manual"
                                                name="sibling_first_name_manual"
                                                type="text"
                                                {...register('sibling_first_name_manual')}
                                                style={inputStyle}
                                            />
                                            {errors.sibling_first_name_manual && <p style={errorMsgStyle}>{errors.sibling_first_name_manual.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* 兄弟のクラス (省略) */}
                                <div>
                                    <label style={labelStyle} htmlFor="sibling_class">兄弟のクラス <span style={{color: '#e53e3e'}}>*</span></label>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <label htmlFor="sibling_grade_manual" style={{...labelStyle, fontSize: '0.875rem', fontWeight: 'normal'}}>学年</label>
                                            <input id="sibling_grade_manual" name="sibling_grade_manual" type="number" {...register('sibling_grade_manual')} style={inputStyle} placeholder="半角数字のみ" />
                                            {errors.sibling_grade_manual && <p style={errorMsgStyle}>{errors.sibling_grade_manual.message}</p>}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label htmlFor="sibling_class_number_manual" style={{...labelStyle, fontSize: '0.875rem', fontWeight: 'normal'}}>組</label>
                                            <input id="sibling_class_number_manual" name="sibling_class_number_manual" type="text" {...register('sibling_class_number_manual')} style={inputStyle} placeholder="半角英数字" />
                                            {errors.sibling_class_number_manual && <p style={errorMsgStyle}>{errors.sibling_class_number_manual.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* 兄弟の調整希望日程 (省略) */}
                                <div>
                                    <label style={labelStyle} htmlFor="sibling_coordination_slot">兄弟の現在の面談日程</label>
                                    <select id="sibling_coordination_slot" name="sibling_coordination_slot" {...register('sibling_coordination_slot')} style={inputStyle}>
                                        <option value="">-- 面談枠を選択 --</option>
                                        {allScheduleSlots.map(slot => (<option key={slot} value={slot}>{slot}</option>))}
                                    </select>
                                    <p style={{fontSize: '0.8rem', color: '#718096', margin: '0 0 0.5rem 0'}}>面談枠が未設定の場合は面談枠が表示されません。</p>
                                </div>
                            </div>
                            </>
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
                        onClick={handleSubmit(onSubmit)}
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