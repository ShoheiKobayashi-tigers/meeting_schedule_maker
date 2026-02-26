// src/features/Main/Main.tsx
import { ScheduleTablePanel } from './panels/ScheduleTablePanel.tsx';
import { ApplicantListPanel } from './panels/ApplicantListPanel.tsx';

import * as layout from '../../styles/layout.css';

export const ScheduleScreen = () => {
    // managerを引数でもらう必要がなくなります！
    return (
        <div className={layout.pageLayoutDouble}>
            <div className={layout.leftPanel}>
                {/* 各パネル内部で useAppStore() を呼ぶように修正していきます */}
                <ScheduleTablePanel />
            </div>
            <div className={layout.rightPanel}>
                <ApplicantListPanel />
            </div>
        </div>
    );
};