import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEducationModule } from '../hooks/useEducation';
import { useTelemetry } from '@/shared/services/telemetry/TelemetryProvider';
import { getCustomModule } from '../components/modules/ModuleRegistry';
import ScrollToTop from '../components/ScrollToTop';
import { useTheme } from '@mui/material';
import { ModuleHeader } from './ModulePage/ModuleHeader';
import { ModuleSection } from './ModulePage/ModuleSection';
import './ModulePage.css';

const ModulePage: React.FC = () => {
    const { moduleId } = useParams<{ moduleId: string }>();
    const { module, loading, error } = useEducationModule(moduleId || null);
    const { track } = useTelemetry();
    const theme = useTheme();

    React.useEffect(() => {
        if (module) {
            track({
                event_name: 'PAGE_VISIT',
                event_version: 'v1',
                classification: 'USER_ACTION',
                description: `Education Module: ${module.title}`,
                properties: { page_name: `Education Module: ${module.title}`, module_id: moduleId }
            });
        }
    }, [module, track, moduleId]);

    const CustomComponent = getCustomModule(moduleId || null);
    if (CustomComponent) return <CustomComponent />;

    const themeVars = {
        '--bg-paper': theme.palette.background.paper,
        '--bg-default': theme.palette.background.default,
        '--text-primary': theme.palette.text.primary,
        '--text-secondary': theme.palette.text.secondary,
        '--primary-main': theme.palette.primary.main,
        '--divider': theme.palette.divider,
        '--success-main': theme.palette.success.main,
        '--error-main': theme.palette.error.main,
        '--warning-main': '#ff9800',
        '--warning-light': theme.palette.mode === 'light' ? '#fff3e0' : 'rgba(255, 152, 0, 0.1)',
    } as any;

    if (loading) return <div className="module-page" style={themeVars}><div className="loading">Loading module...</div></div>;
    if (error || !module) return <div className="module-page" style={themeVars}><div className="error">Module not found</div><Link to="/education" className="back-button">← Back to Education</Link></div>;

    return (
        <div className="module-page dense" style={themeVars}>
            <ModuleHeader title={module.title} difficulty={module.difficulty} estimatedTime={module.estimatedTime} />
            <div className="module-content-dense">
                {module.sections.map((section, idx) => <ModuleSection key={idx} section={section} />)}
                <div className="takeaways-compact">
                    <h3>Key Takeaways</h3>
                    <ul>{module.keyTakeaways.map((t, idx) => <li key={idx}>{t}</li>)}</ul>
                </div>
            </div>
            <ScrollToTop />
        </div>
    );
};

export default ModulePage;
