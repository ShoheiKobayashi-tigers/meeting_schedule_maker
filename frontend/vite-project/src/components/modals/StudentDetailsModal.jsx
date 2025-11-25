// src/components/modals/StudentDetailsModal.jsx

import React from 'react';
// 💡 スタイルをインポート
import { styles } from './style/StudentDetailsModalStyle.js';

/**
 * 児童（生徒）の詳細情報、面談割り当て、兄弟情報を表示するモーダルコンポーネント。
 */
const StudentDetailsModal = ({ isOpen, student, onClose, assignmentDetails, siblingDetails }) => {
    if (!isOpen || !student) return null;

    // スタイルオブジェクトを簡潔に参照できるように変数に格納
    const {
        overlayStyle, contentStyle, headerStyle, closeButtonStyle, h4Style,
        infoGroupStyle, infoItemStyle, labelStyle, valueStyle,
        assignmentBadgeStyle, siblingAssignmentBadgeStyle, coordinationSlotStyle, unassignedStyle
    } = styles;

    return (
        <div style={overlayStyle} onClick={onClose}>
            <style>
                {/* アニメーション定義はUI構造の一部として残します */}
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


                    {/* 3. 希望日程 */}
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
                    {/* 4. 兄弟情報 */}
                    <h4 style={h4Style}>兄弟の情報 (家族ID: {student.family_id})</h4>
                    <div style={infoGroupStyle}>
                        {/* 💡 修正点: siblingDetails が配列であり、中身があるか確認 */}
                        {siblingDetails && siblingDetails.length > 0 ? (
                            <ul style={{ listStyleType: 'none', paddingLeft: '0', margin: '0.5rem 0' }}>
                                {siblingDetails.map((sibling) => (
                                    <li key={sibling.id} style={{ marginBottom: '1rem', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', backgroundColor: '#f7faff' }}>

                                        {/* 兄弟氏名 / 区分 */}
                                        <div style={infoItemStyle}>
                                            <span style={labelStyle}>氏名 / クラス</span>
                                            <span style={valueStyle}>
                                                <strong style={{color: '#2b6cb0'}}>{sibling.name}</strong> / {sibling.class || '不明'}
                                            </span>
                                        </div>

                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={unassignedStyle}>兄弟の登録はありません。</p>
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

export default StudentDetailsModal;