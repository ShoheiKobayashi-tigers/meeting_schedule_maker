import React from 'react';

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

export default ToggleSwitch;