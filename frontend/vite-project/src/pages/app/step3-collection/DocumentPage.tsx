// src/pages/app/step3-collection/DocumentPage.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { DocumentStep } from '../../../features/collection/panels/DocumentStep';

export const DocumentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const basePath = location.pathname.startsWith('/demo') ? '/demo' : '/app';

    return <DocumentStep onNext={() => navigate(`${basePath}/step3/form/publish`)} />;
};