// src/components/modals/StudentDetailsModalStyles.js

export const styles = {
    overlayStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1001,
        fontFamily: 'Inter, sans-serif',
    },

    contentStyle: {
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '1rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        maxWidth: '700px',
        width: '90%',
        minHeight: '400px',
        position: 'relative',
        animation: 'fadeInUp 0.3s ease-out',
        display: 'flex',
        flexDirection: 'column',
    },

    headerStyle: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid #edf2f7',
        paddingBottom: '1rem',
        marginBottom: '1.5rem',
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

    h4Style: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#2d3748',
        borderBottom: '2px solid #edf2f7',
        paddingBottom: '0.5rem',
        marginTop: '1.5rem',
        marginBottom: '1rem',
    },

    infoGroupStyle: {
        marginBottom: '1.5rem',
        padding: '0 0.5rem',
    },

    infoItemStyle: {
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 0',
        borderBottom: '1px dotted #ebf4ff',
    },

    labelStyle: {
        fontWeight: '700',
        color: '#4a5568',
        width: '180px',
        flexShrink: 0,
        fontSize: '1rem',
    },

    valueStyle: {
        color: '#2d3748',
        fontSize: '1rem',
        fontWeight: '500',
        flexGrow: 1,
    },

    assignmentBadgeStyle: {
        backgroundColor: '#e6fffa',
        padding: '0.3rem 0.6rem',
        borderRadius: '0.4rem',
        marginRight: '0.5rem',
        color: '#38a169',
        fontWeight: '600',
        display: 'inline-block',
        whiteSpace: 'nowrap',
    },

    siblingAssignmentBadgeStyle: {
        backgroundColor: '#fffff0',
        padding: '0.3rem 0.6rem',
        borderRadius: '0.4rem',
        marginRight: '0.5rem',
        color: '#b7791f',
        fontWeight: '600',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        border: '1px solid #f6e05e',
    },

    coordinationSlotStyle: {
        backgroundColor: '#e9d8fd',
        padding: '0.3rem 0.6rem',
        borderRadius: '0.4rem',
        marginRight: '0.5rem',
        color: '#6b46c1',
        fontWeight: '600',
        display: 'inline-block',
        whiteSpace: 'nowrap',
    },

    unassignedStyle: {
        color: '#718096',
        fontSize: '1rem',
        fontWeight: '500',
        padding: '0.5rem 0',
    },
};