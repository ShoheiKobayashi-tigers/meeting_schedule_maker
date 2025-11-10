import React, { useCallback, useMemo } from 'react';

const ApplicantListPanel = ({ manager }) => {
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
                    ? '面談枠が選択されています。児童（生徒）をクリックして割り当ててください。'
                    : '面談枠からここにドロップすると割り当て解除され、リストに戻ります'
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
                                // 面談枠を選択中はクリック可能な要素であることを示唆する色に変更
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
export default ApplicantListPanel;