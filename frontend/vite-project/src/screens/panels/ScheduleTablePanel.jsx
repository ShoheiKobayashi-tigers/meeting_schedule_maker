const ScheduleTablePanel = ({ manager, siblingsManager}) => {
    const {
        scheduleData, getApplicantName, handleDragOver, handleDrop,
        handleDragStart, handleDragEnd, handleDragEnter, handleDragLeave,
        draggingApplicantId, styles, getSlotStyle,
        selectedSlot,
        handleSlotClick
    } = manager;

    const { rows: sortedRows, cols: sortedCols } = scheduleData;
    const { getAssignedSiblingsList } = siblingsManager;

    return (
        <div style={{ ...styles.panel, ...styles.leftPanel }}>
            <h1 style={{ fontSize: '1.875rem', fontWeight: '800', marginBottom: '1rem', color: '#2d3748' }}>
              面接スケジュールボード (2次元)
            </h1>
            <p style={{ color: '#718096', marginBottom: '1.5rem' }}>
                面談枠を選択後、右側の児童（生徒）をクリックして割り当てることも可能です。
            </p>

            {sortedRows.length === 0 || sortedCols.length === 0 ? (
                <p style={{textAlign: 'center', color: '#e53e3e', padding: '5rem', border: '1px dashed #e53e3e', borderRadius: '0.5rem'}}>
                    面談枠が設定されていません。「面談枠の設定」画面で時間帯と日付を追加してください。
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
                                    {sortedCols.map((colHeader, colIndex) => {
                                        const cellId = `slot-${rowIndex}-${colIndex}`;

                                        const assignmentSlot = scheduleData.assignments[rowIndex][colIndex];
                                        const applicantId = assignmentSlot ? assignmentSlot.applicantId : null;
                                        const assignmentType = assignmentSlot ? assignmentSlot.type : null;
                                        const isAvailable = scheduleData.availability[rowIndex][colIndex] !== 'admin_block';
                                        const isSelected = selectedSlot && selectedSlot.rowIndex === rowIndex && selectedSlot.colIndex === colIndex;
                                        const hasAssignmentOnUnavailableSlot = applicantId && !isAvailable;
                                        // SlotKeyの形式: '日付 時間帯' (例: '12/01 (月) 09:00 - 09:15')
                                        const slotKey = `${colHeader} ${rowHeader}`;
                                        const assignedSiblingsList = getAssignedSiblingsList(slotKey);

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
                                                    {assignmentSlot ? (
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
                                                <span style={{
                                                    fontSize: '0.65rem',
                                                    color: '#a0aec0',
                                                    marginTop: '0.25rem',
                                                    display: 'block', // 独立した行にする
                                                    textAlign: 'center', // 中央寄せにする
                                                }}>
                                                    {assignedSiblingsList.length > 0 && (
                                                        <div style={{
                                                            fontSize: '0.65rem',
                                                            color: '#a0aec0', // 兄弟の固定割り当てを強調する色
                                                            marginTop: applicantId ? '0.5rem' : '0.2rem',
                                                            marginBottom: '0.2rem',
                                                        }}>
                                                            {assignedSiblingsList.map((siblingText, index) => (
                                                                <div key={index} title="確定済み兄弟の面談枠">
                                                                     {siblingText}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </span>
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
export default ScheduleTablePanel;