// src/pages/app/step3-collection/ModeSelectPage.tsx
import { ModeSelectModal } from '../../../components/modals/ModeSelectModal';
import { DocumentStep } from '../../../features/BulkSetup/components/steps/DocumentStep';

export const ModeSelectPage = () => (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div style={{ filter: 'blur(3px)', opacity: 0.5, pointerEvents: 'none', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <DocumentStep onNext={() => {}} />
        </div>
        <ModeSelectModal />
    </div>
);