import React from 'react';
import { GlossaryTerm } from './GlossaryData';

interface GlossaryCategorySectionProps {
    category: string;
    terms: GlossaryTerm[];
}

const GlossaryCategorySection: React.FC<GlossaryCategorySectionProps> = ({ category, terms }) => {
    if (terms.length === 0) return null;

    return (
        <section
            id={`category-${category.replace(/\s+/g, '-')}`}
            className="glossary-category-section"
        >
            <div className="category-header">
                <h2>{category}</h2>
                <span className="term-count">{terms.length} terms</span>
            </div>

            <div className="terms-grid">
                {terms.map((term) => (
                    <div key={term.id} className="term-card">
                        <h3 className="term-name">{term.term}</h3>
                        <p className="term-definition">{term.definition}</p>

                        {term.formula && (
                            <div className="term-formula">
                                <span className="formula-label">Formula:</span>
                                <code>{term.formula}</code>
                            </div>
                        )}

                        {term.example && (
                            <div className="term-example">
                                <span className="example-label">Example:</span>
                                <p>{term.example}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default GlossaryCategorySection;
