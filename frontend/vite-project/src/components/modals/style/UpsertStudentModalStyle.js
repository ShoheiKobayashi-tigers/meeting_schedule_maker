// src/components/modals/UpsertStudentModalStyle.js

export const styles = {
    // スタイル
     overlayStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1002,
        fontFamily: 'Inter, sans-serif',
    },

     contentStyle: {
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        maxWidth: '650px',
        minHeight: '400px',
        maxHeight: '90vh',
        width: '90%',
        display: 'flex',
        position: 'relative',
        animation: 'fadeInUp 0.3s ease-out',
        flexDirection: 'column',
    },

    headerStyle: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0rem',
        paddingBottom: '1rem',
    },

    closeButtonStyle: {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '1.5rem',
        fontWeight: '300',
        cursor: 'pointer',
        color: '#a0aec0',
        transition: 'color 0.2s',
        padding: '0.25rem',
    },

     inputStyle: {
        border: '1px solid #cbd5e0',
        borderRadius: '0.5rem',
        padding: '0.6rem 0.75rem',
        width: '100%',
        boxSizing: 'border-box',
        fontSize: '1rem',
        marginBottom: '0.5rem',
    },

     labelStyle: {
        display: 'block',
        fontWeight: '700',
        color: '#4a5568',
        marginBottom: '0.25rem',
        marginTop: '1rem',
    },

     h4Style: {
        fontSize: '1.3rem',
        fontWeight: '800',
        color: '#2d3748',
        borderBottom: '2px solid #edf2f7',
        paddingBottom: '0.5rem',
        marginTop: '2rem',
        marginBottom: '1rem',
    },

     buttonBaseStyle: {
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: 'none',
        fontSize: '1rem',
     },
};
