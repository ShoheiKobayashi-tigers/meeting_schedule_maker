import React, { useCallback, useMemo } from 'react';

const ApplicantListPanel = ({ manager }) => {
    const {
        applicants, scheduleData, handleDragOver, handleDrop,
        handleDragStart, handleDragEnd, draggingApplicantId, styles,
        selectedSlot, selectedApplicantId, categorizedApplicants,hoveredCellId,
        handleApplicantClick, handleClickDeleteButton, draggingSlotIndex // 活性判定のために追加
    } = manager;

    // 1. 【最適解】useMemo を使って、表示対象の Applicant のみを抽出
    const displayedApplicants = useMemo(() => {
        if (!categorizedApplicants) return [];

        return categorizedApplicants.filter(applicant => {
            // 未割り当て (isRegistered: false) の Applicant のみを表示
            return !applicant.isRegistered;
        });
    // categorizedApplicants (useScheduleManagerのuseMemo結果) の参照が変わったときのみ再計算
    }, [categorizedApplicants]);

    // 活性化判定用の変数（表示ロジックをシンプルにするため）
    const activeSlot = selectedSlot || draggingSlotIndex || hoveredCellId;
    const applicantSelectedOnSlot = selectedSlot? scheduleData.assignments[selectedSlot.rowIndex][selectedSlot.colIndex] : null;

    return (
        <div
            style={{ ...styles.panel, ...styles.rightPanel }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'applicant-list')}
        >
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: '#2d3748' }}>
              未割り当ての児童（生徒）リスト
            </h2>
            {/* 割り当て解除ボタン */}
            {applicantSelectedOnSlot && (
                <button
                    onClick={handleClickDeleteButton}
                    style={{
                        padding: '0.5rem 1rem',
                        marginBottom: '1rem',
                        backgroundColor: '#5d5d63',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '600',
                        width: '100%',
                        transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#a1a3a6'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#5d5d63'}
                >
                    割り当て解除
                </button>
            )}
            <p style={{ color: '#718096', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {selectedSlot
                    ? '面談枠が選択されています。児童（生徒）をクリックして割り当ててください。'
                    : selectedApplicantId
                    ? '面談枠をクリックして「' + manager.getApplicantName(selectedApplicantId) + '」さんを割り当ててください。'
                    : '面談枠からここにドロップすると割り当て解除され、リストに戻ります'
                }
            </p>
            <div className="applicant-list" style={{ overflowY: 'auto', flex: 1 }}>
                {displayedApplicants.map(applicant => {
                    const isAvailable = applicant.isAvailable; // Managerから渡されたフラグ
                    const isActive = selectedApplicantId === applicant.id || (activeSlot && isAvailable);

                    return (
                        <div
                            key={applicant.id}
                            draggable="true"
                            onDragStart={(e) => handleDragStart(e, applicant.id)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            onDrop={(e) => {
                                e.stopPropagation(); // パネル全体へのドロップイベントの発火を止める
                                manager.handleDrop(e, applicant.id); // 固有のターゲットIDを渡す
                            }}
                            onClick={() => handleApplicantClick(applicant.id)}
                            style={{
                                ...styles.baseItem,
                                // スロット活性時 かつ 利用可能な場合
                                backgroundColor: isActive ? '#d1f1da' : (isAvailable ? '#ebf8ff' : '#f7fafc'), // 利用可能でない場合は薄い色
                                border: `1px solid ${isActive ? '#48bb78' : '#90cdf4'}`,
                                cursor: isActive ? 'pointer' : (activeSlot ? 'not-allowed' : 'grab'),
                                opacity: (!isAvailable) ? 0.5 : 1, // 利用不可なら半透明
                                ...(draggingApplicantId === applicant.id ? {opacity: 0.4, boxShadow: 'none'} : {}),
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isActive ? '#c4e0f5' : (isAvailable ? '#ebf8ff' : '#f7fafc')}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isActive ? '#d1f1da' : (isAvailable ? '#ebf8ff' : '#f7fafc')}
                        >
                            {applicant.name}
                            {!isAvailable && <span style={{marginLeft: '8px', color: '#e53e3e', fontSize: '0.8em'}}> (希望外)</span>}
                        </div>
                    );
                })}
              {displayedApplicants.length === 0 && applicants.length > 0 && (
                <p style={{textAlign: 'center', marginTop: '2rem', color: '#48bb78', fontWeight: '700'}}>
                    全ての児童（生徒）が割り当てられました！
                </p>
              )}
              {displayedApplicants.length === 0 && applicants.length > 0 && activeSlot && (
                  <p style={{textAlign: 'center', marginTop: '2rem', color: '#e53e3e', fontWeight: '700'}}>
                      この面談枠を希望する未割り当ての児童（生徒）はいません。
                  </p>
              )}
            </div>
          </div>
    );
};
export default ApplicantListPanel;