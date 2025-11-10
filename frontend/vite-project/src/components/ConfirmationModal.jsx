import React from 'react';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = '実行する', cancelText = 'キャンセル' }) => {
    // スタイル定義は元のまま
    if (!isOpen) return null;

    const contentStyle = {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.75rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        maxWidth: '450px',
        width: '90%',
        fontFamily: 'Inter, sans-serif',
    };
    const buttonBaseStyle = {
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: 'none',
        fontSize: '1rem',
    };
    const confirmButtonStyle = {
        ...buttonBaseStyle,
        backgroundColor: '#e53e3e', // Red
        color: 'white',
        marginLeft: '1rem',
    };
    const cancelButtonStyle = {
        ...buttonBaseStyle,
        backgroundColor: '#edf2f7', // Light Gray
        color: '#4a5568',
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        }}>
            <div style={contentStyle}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#2d3748', marginBottom: '1rem' }}>
                    {title}
                </h3>
                <p style={{ color: '#4a5568', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                    {message}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <button
                        style={cancelButtonStyle}
                        onClick={onCancel}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dce1e7'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#edf2f7'}
                    >
                        {cancelText}
                    </button>
                    <button
                        style={confirmButtonStyle}
                        onClick={onConfirm}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c53030'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e53e3e'}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;