const ScheduleSettingsPanel = ({ manager }) => {
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
export default ScheduleSettingsPanel;