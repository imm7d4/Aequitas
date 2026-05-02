import React from 'react';
import { Box, Typography } from '@mui/material';
import {
    Warning as AlertIcon,
    CheckCircle as SuccessIcon,
    Info as InfoIcon
} from '@mui/icons-material';

interface ModuleSectionProps {
    section: any;
}

export const ModuleSection: React.FC<ModuleSectionProps> = ({ section }) => {
    const renderTextSection = () => {
        const content = section.content;
        return (
            <div className="section-content text-section">
                <h3 className="section-subtitle">{section.title}</h3>
                {content.text && <p className="section-text">{content.text}</p>}
                {content.concepts && (
                    <div className="concepts-grid">
                        {content.concepts.map((concept: any, idx: number) => (
                            <div key={idx} className="concept-item">
                                <strong>{concept.term}:</strong> {concept.explanation}
                                {concept.example && <div className="inline-example">Ex: {concept.example}</div>}
                            </div>
                        ))}
                    </div>
                )}
                {content.guarantees && content.guarantees.map((item: any, idx: number) => (
                    <div key={idx} className="info-block guarantee">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'var(--success-main)', mb: 0.5 }}>
                            <SuccessIcon sx={{ fontSize: 18 }} />
                            <strong>{item.promise}</strong>
                        </Box>
                        <Typography variant="body2" sx={{ ml: 3.2 }}>{item.explanation}</Typography>
                    </div>
                ))}
                {content.rule && (
                    <div className="important-rule">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}><AlertIcon sx={{ fontSize: 18 }} /><strong>RULE</strong></Box>
                        <Typography variant="body2" sx={{ ml: 3.2 }}>{content.rule}</Typography>
                    </div>
                )}
            </div>
        );
    };

    const renderFlowSection = () => {
        const content = section.content;
        return (
            <div className="section-content flow-section">
                <h3 className="section-subtitle">{section.title}</h3>
                <div className="flow-compact">
                    {content.steps.map((step: any, idx: number) => (
                        <div key={idx} className="flow-item">
                            <div className="flow-number">{step.step}</div>
                            <div className="flow-details">
                                <strong>{step.title}:</strong> {step.description}
                                {step.duration && <span className="duration-badge">{step.duration}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return section.type === 'flow' ? renderFlowSection() : renderTextSection();
};
