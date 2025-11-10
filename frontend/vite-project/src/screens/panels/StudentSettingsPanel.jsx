import React, { useCallback, useMemo } from 'react';

// --- 児童（生徒）情報設定画面コンポーネント (追加ボタンをモーダル起動に変更) ---
const StudentSettingsPanel = ({ manager }) => {
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
export default StudentSettingsPanel;