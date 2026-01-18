import React from 'react';
import { Link } from 'react-router-dom';
import { useEducationIndex } from '../hooks/useEducation';
import './EducationHub.css';

const EducationHub: React.FC = () => {
    const { index, loading, error } = useEducationIndex();

    if (loading) {
        return (
            <div className="education-hub">
                <div className="loading">Loading education modules...</div>
            </div>
        );
    }

    if (error || !index) {
        return (
            <div className="education-hub">
                <div className="error">Failed to load education modules. Please try again.</div>
            </div>
        );
    }

    return (
        <div className="education-hub">
            {/* Header */}
            <header className="education-header">
                <div className="header-badge">The Aequitas Academy</div>
                <h1>Master the Markets</h1>
                <p className="hero-lead">Follow the <strong>Institutional Trader's Path</strong>. From platform architecture to advanced market microstructure, learn how the modern exchange really works.</p>
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
                            <span className="category-icon">{category.icon}</span>
                            <h2>{category.title}</h2>
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
                <h3>Quick Access</h3>
                <div className="quick-links-grid">
                    <Link to="/diagnostics" className="quick-link">
                        <span className="quick-link-icon">📊</span>
                        <div>
                            <h4>Trade Diagnostics</h4>
                            <p>Analyze your trading performance</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EducationHub;
