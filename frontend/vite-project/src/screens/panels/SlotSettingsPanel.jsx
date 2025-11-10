import ToggleSwitch from '../../components/ui/ToggleSwitch.jsx';
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
export default SlotSettingsPanel;