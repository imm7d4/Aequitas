import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEducationModule } from '../hooks/useEducation';
import { getCustomModule } from '../components/modules/ModuleRegistry';
import './ModulePage.css';

const ModulePage: React.FC = () => {
    const { moduleId } = useParams<{ moduleId: string }>();
    const { module, loading, error } = useEducationModule(moduleId || null);

    // Check for custom component
    const CustomComponent = getCustomModule(moduleId || null);

    if (loading) {
        return (
            <div className="module-page">
                <div className="loading">Loading module...</div>
            </div>
        );
    }

    if (error || !module) {
        return (
            <div className="module-page">
                <div className="error">Module not found</div>
                <Link to="/education" className="back-button">← Back to Education</Link>
            </div>
        );
    }

    // Render custom component if available
    if (CustomComponent) {
        return <CustomComponent />;
    }

    const renderSection = (section: any) => {
        switch (section.type) {
            case 'text':
                return renderTextSection(section);
            case 'flow':
                return renderFlowSection(section);
            default:
                return renderTextSection(section);
        }
    };

    const renderTextSection = (section: any) => {
        const content = section.content;

        return (
            <div className="section-content text-section">
                <h3 className="section-subtitle">{section.title}</h3>
                {content.text && <p className="section-text">{content.text}</p>}

                {content.highlights && (
                    <ul className="compact-list">
                        {content.highlights.map((highlight: string, idx: number) => (
                            <li key={idx}>{highlight}</li>
                        ))}
                    </ul>
                )}

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

                {content.reasons && content.reasons.map((item: any, idx: number) => (
                    <div key={idx} className="info-block">
                        <strong>{item.reason}:</strong> {item.explanation}
                        {item.impact && <div className="impact-text">→ {item.impact}</div>}
                    </div>
                ))}

                {content.causes && content.causes.map((item: any, idx: number) => (
                    <div key={idx} className="info-block">
                        <strong>{item.cause}:</strong> {item.explanation}
                        {item.example && <div className="inline-example">Ex: {item.example}</div>}
                    </div>
                ))}

                {content.scenarios && content.scenarios.map((item: any, idx: number) => (
                    <div key={idx} className="info-block">
                        <strong>{item.scenario}:</strong> {item.explanation}
                        {item.example && <div className="inline-example">Ex: {item.example}</div>}
                    </div>
                ))}

                {content.guarantees && content.guarantees.map((item: any, idx: number) => (
                    <div key={idx} className="info-block guarantee">
                        <strong>✓ {item.promise}:</strong> {item.explanation}
                        <div className="verification-text">→ {item.verification}</div>
                    </div>
                ))}

                {content.prevention && (
                    <div className="compact-tips">
                        <strong>Prevention:</strong>
                        <ul>
                            {content.prevention.map((tip: string, idx: number) => (
                                <li key={idx}>{tip}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {content.handling && (
                    <div className="compact-tips">
                        <strong>Handling:</strong>
                        <ul>
                            {content.handling.map((tip: string, idx: number) => (
                                <li key={idx}>{tip}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {content.rule && (
                    <div className="important-rule">
                        <strong>⚠️</strong> {content.rule}
                    </div>
                )}

                {content.important && (
                    <div className="important-rule">
                        <strong>⚠️</strong> {content.important}
                    </div>
                )}
            </div>
        );
    };

    const renderFlowSection = (section: any) => {
        const content = section.content;

        return (
            <div className="section-content flow-section">
                <h3 className="section-subtitle">{section.title}</h3>
                {content.intro && <p className="section-text">{content.intro}</p>}

                <div className="flow-compact">
                    {content.steps.map((step: any, idx: number) => (
                        <div key={idx} className="flow-item">
                            <div className="flow-number">{step.step}</div>
                            <div className="flow-details">
                                <strong>{step.title}:</strong> {step.description}
                                {step.details && (
                                    <ul className="flow-list">
                                        {step.details.map((detail: string, detailIdx: number) => (
                                            <li key={detailIdx}>{detail}</li>
                                        ))}
                                    </ul>
                                )}
                                {step.duration && <span className="duration-badge">{step.duration}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="module-page dense">
            {/* Compact Header */}
            <div className="module-header-compact">
                <Link to="/education" className="back-link">← Education</Link>
                <div className="header-content">
                    <h1>{module.title}</h1>
                    <div className="meta-inline">
                        <span className="badge-inline">{module.difficulty}</span>
                        <span>⏱️ {module.estimatedTime}</span>
                    </div>
                </div>
            </div>

            {/* All Content - No Sections */}
            <div className="module-content-dense">
                {module.sections.map((section, idx) => (
                    <div key={idx}>
                        {renderSection(section)}
                    </div>
                ))}

                {/* Key Takeaways */}
                <div className="takeaways-compact">
                    <h3>Key Takeaways</h3>
                    <ul>
                        {module.keyTakeaways.map((takeaway, idx) => (
                            <li key={idx}>{takeaway}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ModulePage;
