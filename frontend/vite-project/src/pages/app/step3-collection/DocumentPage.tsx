// src/pages/app/step3-collection/DocumentPage.tsx
import { useNavigate } from 'react-router-dom';
import { DocumentStep } from '../../../features/collection/panels/DocumentStep';

export const DocumentPage = () => {
    const navigate = useNavigate();
    return <DocumentStep onNext={() => navigate('/app/step3/form/publish')} />;
};