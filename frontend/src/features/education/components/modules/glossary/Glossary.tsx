import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from '../../ScrollToTop';
import '../ModuleStyles.css';
import { GLOSSARY_DATA, CATEGORIES, GlossaryTerm } from './GlossaryData';
import GlossarySearch from './GlossarySearch';
import GlossaryCategorySection from './GlossaryCategorySection';

const Glossary: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTerms = useMemo(() => {
        if (!searchQuery.trim()) return GLOSSARY_DATA;
        const query = searchQuery.toLowerCase();
        return GLOSSARY_DATA.filter(
            (term) =>
                term.term.toLowerCase().includes(query) ||
                term.definition.toLowerCase().includes(query) ||
                term.category.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const termsByCategory = useMemo(() => {
        const grouped: Record<string, GlossaryTerm[]> = {};
        filteredTerms.forEach((term) => {
            if (!grouped[term.category]) grouped[term.category] = [];
            grouped[term.category].push(term);
        });
        return grouped;
    }, [filteredTerms]);

    return (
        <div className="custom-module-page glossary-theme">
            <header className="module-hero">
                <div className="hero-content">
                    <Link to="/education" className="back-link">← Education Hub</Link>
                    <div className="status-pill info">Reference</div>
                    <h1>Financial Glossary</h1>
                    <p className="hero-lead">Your comprehensive reference for trading terminology. 135 essential terms across 9 categories.</p>
                </div>
                <div className="hero-visual">
                    <div className="gear-visual">
                        <div className="gear large"></div>
                        <div className="gear small"></div>
                    </div>
                </div>
            </header>

            <div className="content-container">
                <GlossarySearch 
                    searchQuery={searchQuery} 
                    onSearchChange={setSearchQuery} 
                    onClear={() => setSearchQuery('')} 
                />

                {searchQuery && (
                    <div className="search-results-info">
                        Found <strong>{filteredTerms.length}</strong> term{filteredTerms.length !== 1 ? 's' : ''} matching "{searchQuery}"
                    </div>
                )}

                {CATEGORIES.map((category) => (
                    <GlossaryCategorySection 
                        key={category} 
                        category={category} 
                        terms={termsByCategory[category] || []} 
                    />
                ))}

                {filteredTerms.length === 0 && (
                    <div className="no-results">
                        <p>No terms found matching "{searchQuery}"</p>
                        <button onClick={() => setSearchQuery('')} className="primary-btn">Clear Search</button>
                    </div>
                )}
            </div>
            <ScrollToTop />
        </div>
    );
};

export default Glossary;
