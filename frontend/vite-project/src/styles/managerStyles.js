// managerStyles.js
// このファイルは、useScheduleManager.js で使用されるすべてのスタイル定義を保持します。
import { useMemo, useCallback } from 'react';
// isAddButtonActiveのような状態依存のスタイル関数を定義に含めるため、
// スタイルオブジェクト全体を生成する関数としてエクスポートします。
// スタイル (動的な部分をuseMemoに含める)
export const useManagerStyles = ({ isAddButtonActive, hoveredCellId, selectedSlot }) => {
 const styles = useMemo(() => ({
    container: {
        paddingTop: '5rem', // navBarの高さ（約4rem）＋余裕1rem
        width: '100%',
        height: '100vh',
        backgroundColor: '#f8f8f8',
        fontFamily: 'Inter, sans-serif',
        position: 'relative',
        boxSizing: 'border-box',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        paddingBottom: '1.5rem',
    },
    panel: {
        padding: '1.5rem',
        borderRadius: '0.75rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        backgroundColor: 'white',
        // height: 'calc(100vh - 7.5rem)', // containerのpaddingTopが5remになったので調整が必要
        height: '100%', // contentArea内の高さを利用
        overflowY: 'auto',
        boxSizing: 'border-box',
        flexShrink: 0,
        marginTop: '1.5rem',
    },
    // contentAreaにflexを適用し、containerの残りの領域を埋める
    contentArea: {
        flex: 1,
        display: 'flex',
        width: '100%',
        height: 'calc(100% - 5rem)', // containerのpaddingTop分を引いた高さ
    },
    leftPanel: {
        flex: '1',
        marginRight: '1.5rem',
        minWidth: '700px',
        width: '1400px',
    },
    rightPanel: {
        width: '300px',
        minWidth: '300px',
        flexShrink: 0,
    },
    fullScreenLayout: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%', // contentArea内の高さを利用
    },
    baseItem: {
        padding: '0.6rem 1rem',
        margin: '0.6rem 0',
        borderRadius: '0.4rem',
        textAlign: 'center',
        fontWeight: '600',
        transition: 'all 0.2s ease-in-out',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        cursor: 'grab',
        fontSize: '0.95rem'
    },
    scheduledApplicant: {
        padding: '0.4rem',
        width: '90%',
        backgroundColor: '#4299e1',
        color: 'white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        cursor: 'move',
        margin: '0.3rem 0',
        fontSize: '12px',
    },
    button: {
        padding: '0.6rem 1.2rem',
        borderRadius: '0.5rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.1s ease-in-out',
        border: 'none',
        fontSize: '1rem',
    },
    navButton: {
        backgroundColor: '#ffffff',
        border: '1px solid #ced4da',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        padding: '0.75rem 1.25rem',
        fontSize: '1rem',
        color: '#495057',
        fontWeight: '500',
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        marginRight: '1rem',
        // ホバー時の見た目（これは動作しませんが、デザインの意図として残します）
        '&:hover': {
            backgroundColor: '#e9ecef',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
        },
    },
    navButtonActive: {
        backgroundColor: '#4299e1',
        color: 'white',
        border: '1px solid #0056b3',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
        fontWeight: 'bold',
    },
    navButtonIcon: {
        marginRight: '0.5rem',
        fontSize: '1.2rem',
    },
    navBar: {
        display: 'flex',
        justifyContent: 'flex-start',
        padding: '1rem 1.5rem',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        width: '100%',
        boxSizing: 'border-box',
        zIndex: 10,
        position: 'fixed',
        top: 0,
        left: 0,
    },
    activeNavButton: { backgroundColor: '#2d3748', },
    addButton: {
        backgroundColor: isAddButtonActive ? '#38a169' : '#48bb78',
        transform: isAddButtonActive ? 'translateY(1px)' : 'translateY(0)',
        color: 'white',
        boxShadow: isAddButtonActive ? '0 2px 4px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginRight: '0.5rem',
    },
    deleteButton: {
        backgroundColor: 'transparent',
        color: '#e53e3e',
        fontSize: '1rem',
        fontWeight: '700',
        padding: '0 0.5rem',
        cursor: 'pointer',
        marginLeft: 'auto',
        transition: 'color 0.1s',
    },
    inputStyle: {
        border: '1px solid #ccc',
        borderRadius: '0.3rem',
        padding: '0.6rem 0.75rem',
        marginRight: '1rem',
        minWidth: '100px',
        backgroundColor: '#fff',
    },addButton: {
        backgroundColor: isAddButtonActive ? '#38a169' : '#48bb78',
        transform: isAddButtonActive ? 'translateY(1px)' : 'translateY(0)',
        color: 'white',
        boxShadow: isAddButtonActive ? '0 2px 4px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginRight: '0.5rem',
    },
}), [isAddButtonActive]);

const getSlotStyle = useCallback((cellId, isAvailable, isSelected) => ({
    minWidth: '140px',
    minHeight: '5px',
    border: `2px ${hoveredCellId === cellId || isSelected ? 'solid' : 'dashed'} ${isAvailable ? (isSelected ? '#38a169' : '#718096') : '#cbd5e0'}`,
    borderRadius: '0.5rem',
    margin: '0.25rem',
    padding: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isAvailable
        ? (hoveredCellId === cellId ? '#e2e8f0' : (isSelected ? '#e6fffa' : '#edf2f7'))
        : (hoveredCellId === cellId ? '#e2e8f0' : '#f7fafc'),
    color: isAvailable ? '#4a5568' : '#a0aec0',
    fontWeight: '50',
    fontSize: '10px',
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    pointerEvents: 'auto',
}), [hoveredCellId]);
    return { styles, getSlotStyle };
};
