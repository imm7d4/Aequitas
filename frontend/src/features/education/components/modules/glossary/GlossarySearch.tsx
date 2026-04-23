import React from 'react';

interface GlossarySearchProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onClear: () => void;
}

const GlossarySearch: React.FC<GlossarySearchProps> = ({ searchQuery, onSearchChange, onClear }) => {
    return (
        <div className="glossary-search-section">
            <input
                type="text"
                className="glossary-search-input"
                placeholder="Search terms... (e.g., 'market order', 'RSI', 'margin')"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
                <button className="clear-search-btn" onClick={onClear}>
                    Clear
                </button>
            )}
        </div>
    );
};

export default GlossarySearch;
