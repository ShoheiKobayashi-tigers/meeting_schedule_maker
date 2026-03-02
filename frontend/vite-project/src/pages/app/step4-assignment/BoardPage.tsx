// src/pages/app/step4-assignment/BoardPage.tsx
import React from 'react';
import { ApplicantListPanel } from '../../../features/assignment-board/panels/ApplicantListPanel';
import { ScheduleTablePanel } from '../../../features/assignment-board/panels/ScheduleTablePanel';

import * as layout from '../../../styles/layout.css'

export const BoardPage: React.FC = () => {
    return (
        <div className={layout.pageLayoutDouble}>
            <div className={layout.leftPanel}>
                <ScheduleTablePanel />                
            </div>
            <div className={layout.rightPanel}>
                <ApplicantListPanel />
            </div>
        </div>
    );
};