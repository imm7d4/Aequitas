import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { instrumentService } from '@/features/instruments/services/instrumentService';
import { useTelemetry } from '@/shared/services/telemetry/TelemetryProvider';
import type { Instrument } from '@/features/instruments/types/instrument.types';

const RECENT_SEARCHES_KEY = 'aequitas_recent_searches';

// Simple debounce implementation
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: any;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export const useGlobalSearch = () => {
    const navigate = useNavigate();
    const { track } = useTelemetry();
    const [options, setOptions] = useState<Instrument[]>([]);
    const [recentSearches, setRecentSearches] = useState<Instrument[]>([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const searchRef = useRef<HTMLInputElement>(null);

    // Initial load of recent searches
    useEffect(() => {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
            try {
                setRecentSearches(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse recent searches');
            }
        }
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' || (e.ctrlKey && e.key === 'k')) {
                if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
                    return;
                }
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const addToRecentSearches = (instrument: Instrument) => {
        const filtered = recentSearches.filter(i => i.id !== instrument.id);
        const updated = [instrument, ...filtered].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    };

    const smartRank = (results: Instrument[], query: string) => {
        const q = query.toLowerCase();
        return results.sort((a, b) => {
            const aSym = a.symbol.toLowerCase();
            const bSym = b.symbol.toLowerCase();
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();

            if (aSym === q && bSym !== q) return -1;
            if (bSym === q && aSym !== q) return 1;

            if (aSym.startsWith(q) && !bSym.startsWith(q)) return -1;
            if (bSym.startsWith(q) && !aSym.startsWith(q)) return 1;

            if (aName.includes(q) && !bName.includes(q)) return -1;
            if (bName.includes(q) && !aName.includes(q)) return 1;

            return 0;
        });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchInstruments = useCallback(
        debounce(async (query: string) => {
            if (!query) {
                setOptions(recentSearches);
                return;
            }
            setLoading(true);
            try {
                const results = await instrumentService.searchInstruments(query);
                setOptions(smartRank(results, query));
            } catch (error) {
                console.error('Global search error:', error);
            } finally {
                setLoading(false);
            }
        }, 300),
        [recentSearches]
    );

    const handleSelect = (instrument: Instrument) => {
        if (instrument) {
            track({
                event_name: 'search.query_submitted',
                event_version: 'v1',
                classification: 'USER_ACTION',
                metadata: {
                    instrument_id: instrument.id,
                    symbol: instrument.symbol,
                    query: inputValue,
                }
            });
            addToRecentSearches(instrument);
            navigate(`/instruments/${instrument.id}`);
        }
    };

    return {
        options: inputValue ? options : recentSearches,
        recentSearches,
        loading,
        inputValue,
        setInputValue,
        searchRef,
        fetchInstruments,
        handleSelect,
        addToRecentSearches,
    };
};
