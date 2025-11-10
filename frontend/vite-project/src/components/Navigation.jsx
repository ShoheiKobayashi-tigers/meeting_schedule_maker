import React from 'react';

// App.jsxからVIEWSオブジェクトを受け取る
const VIEWS = {
    SCHEDULE: 'schedule',
    SETTINGS: 'settings',
    STUDENTS: 'students',
};

const Navigation = ({ currentView, onViewChange, styles }) => {

    // ボタンの定義とメタデータ
    const navItems = [
        {
            view: VIEWS.SCHEDULE,
            label: 'スケジュール',
        },
        {
            view: VIEWS.SETTINGS,
            label: '面談枠の設定',
        },
        {
            view: VIEWS.STUDENTS,
            label: '児童（生徒）情報管理',
        },
    ];

    return (
        <nav style={styles.navBar}>
            {navItems.map((item) => (
                <button
                    key={item.view}
                    onClick={() => onViewChange(item.view)}
                    // 🌟 選択中のボタンにスタイルを適用するための条件
                    style={{
                        ...styles.navButton,
                        ...(currentView === item.view ? styles.navButtonActive : {}),
                    }}
                >
                    <span style={styles.navButtonIcon}>{item.icon}</span>
                    <span style={styles.navButtonLabel}>{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default Navigation;