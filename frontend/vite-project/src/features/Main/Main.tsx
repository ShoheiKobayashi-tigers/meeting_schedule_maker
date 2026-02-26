// src/features/Main/Main.tsx
import * as s from './Main.css.ts'; // さっき作ったスタイル
import { ScheduleTablePanel } from './panels/ScheduleTablePanel.tsx';
import { ApplicantListPanel } from './panels/ApplicantListPanel.tsx';

export const ScheduleScreen = () => {
    // managerを引数でもらう必要がなくなります！
    return (
        <div className={s.container}>
            <div className={s.leftPanel}>
                {/* 各パネル内部で useAppStore() を呼ぶように修正していきます */}
                <ScheduleTablePanel />
            </div>
            <div className={s.rightPanel}>
                <ApplicantListPanel />
            </div>
        </div>
    );
};