import React from 'react';
import { Link } from 'react-router-dom';
import { useEducationIndex } from '../hooks/useEducation';
import ScrollToTop from '../components/ScrollToTop';
import {
    Typography,
    useTheme,
    alpha,
    Box
} from '@mui/material';
import {
    AccountBalance as FoundationIcon,
    FlashOn as ExecutionIcon,
    Psychology as StrategyIcon,
    Analytics as AdvancedIcon,
    MenuBook as GlossaryIcon,
    AutoGraph as DiagnosticsIcon,
    School as AcademyIcon
} from '@mui/icons-material';
import './EducationHub.css';

const CategoryIcon = ({ icon }: { icon: string }) => {
    switch (icon) {
        case '🏗️': return <FoundationIcon />;
        case '⚡': return <ExecutionIcon />;
        case '🧠': return <StrategyIcon />;
        case '📉': return <AdvancedIcon />;
        default: return <AcademyIcon />;
    }
};

const EducationHub: React.FC = () => {
    const { index, loading, error } = useEducationIndex();
    const theme = useTheme();

    if (loading) {
        return (
            <div className="education-hub" style={{ 
                '--bg-paper': theme.palette.background.paper,
                '--bg-default': theme.palette.background.default,
                '--text-primary': theme.palette.text.primary,
                '--text-secondary': theme.palette.text.secondary,
                '--primary-main': theme.palette.primary.main,
                '--primary-light': alpha(theme.palette.primary.main, 0.1),
                '--divider': theme.palette.divider,
            } as any}>
                <div className="loading">Loading education modules...</div>
            </div>
        );
    }

    if (error || !index) {
        return (
            <div className="education-hub" style={{ 
                '--bg-paper': theme.palette.background.paper,
                '--bg-default': theme.palette.background.default,
                '--text-primary': theme.palette.text.primary,
                '--text-secondary': theme.palette.text.secondary,
                '--primary-main': theme.palette.primary.main,
                '--primary-light': alpha(theme.palette.primary.main, 0.1),
                '--divider': theme.palette.divider,
            } as any}>
                <div className="error">Failed to load education modules. Please try again.</div>
            </div>
        );
    }

    return (
        <div className="education-hub" style={{ 
            '--bg-paper': theme.palette.background.paper,
            '--bg-default': theme.palette.background.default,
            '--text-primary': theme.palette.text.primary,
            '--text-secondary': theme.palette.text.secondary,
            '--primary-main': theme.palette.primary.main,
            '--primary-light': alpha(theme.palette.primary.main, 0.1),
            '--divider': theme.palette.divider,
            '--secondary-main': theme.palette.secondary.main,
            '--error-main': theme.palette.error.main,
            '--success-main': theme.palette.success.main,
        } as any}>
            {/* Header */}
            <header className="education-header">
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Education Hub
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Master the markets with our curated learning paths and resources.
                </Typography>
                <div className="learning-path-visual">
                    <div className="path-stat"><span>5</span> Phases</div>
                    <div className="path-stat"><span>16</span> Modules</div>
                    <div className="path-stat"><span>Institutional</span> Grade</div>
                </div>
            </header>

            {/* Categories */}
            <div className="categories-grid">
                {index.categories.map((category) => (
                    <div key={category.id} className="category-card">
                        <div className="category-header">
                            <Box className="category-icon-container">
                                <CategoryIcon icon={category.icon} />
                            </Box>
                            <Typography variant="h6" className="category-title">
                                {category.title}
                            </Typography>
                        </div>
                        <p className="category-description">{category.description}</p>

                        {/* Module List */}
                        <div className="module-list">
                            {category.modules.map((moduleId) => {
                                const module = index.modules[moduleId];
                                if (!module) return null;

                                const isFeatured = module.featured;
                                const isRequired = module.required;

                                return (
                                    <Link
                                        key={moduleId}
                                        to={`/education/${moduleId}`}
                                        className={`module-item ${isFeatured ? 'featured' : ''}`}
                                    >
                                        <div className="module-info">
                                            <div className="module-title-row">
                                                <span className="module-title">{module.title}</span>
                                                {isRequired && <span className="badge required">Required</span>}
                                                {isFeatured && <span className="badge featured">⭐</span>}
                                            </div>
                                            <span className="module-meta">
                                                {module.difficulty} • {module.estimatedTime}
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Links */}
            <div className="quick-links">
                <Typography variant="h5" sx={{ mb: 3 }}>Quick Access</Typography>
                <div className="quick-links-grid">
                    <Link to="/education/glossary" className="quick-link">
                        <Box className="quick-link-icon-container">
                            <GlossaryIcon />
                        </Box>
                        <div>
                            <h4>Financial Glossary</h4>
                            <p>98 essential trading terms</p>
                        </div>
                    </Link>
                    <Link to="/diagnostics" className="quick-link">
                        <Box className="quick-link-icon-container">
                            <DiagnosticsIcon />
                        </Box>
                        <div>
                            <h4>Trade Diagnostics</h4>
                            <p>Analyze your trading performance</p>
                        </div>
                    </Link>
                </div>
            </div>

            <ScrollToTop />
        </div>
    );
};

export default EducationHub;
