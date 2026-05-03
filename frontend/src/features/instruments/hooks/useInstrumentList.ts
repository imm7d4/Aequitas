import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInstruments } from '../hooks/useInstruments';
import { useInstrumentStore } from '../store/instrumentStore';
import { useWatchlistStore } from '@/features/watchlist/store/watchlistStore';
import { useMarketData } from '@/features/market/hooks/useMarketData';
import type { Instrument } from '../types/instrument.types';

export const useInstrumentList = () => {
    useInstruments();
    const navigate = useNavigate();
    const {
        instruments, searchResults, isLoading, error, filters, searchQuery, pagination, sorting,
        setFilters, setSearchQuery, setSearchResults, setPagination, setSorting,
    } = useInstrumentStore();

    const instrumentIds = useMemo(() => instruments.map(i => i.id), [instruments]);
    const { prices } = useMarketData(instrumentIds);
    const { watchlists, activeWatchlistId, addInstrumentToWatchlist, removeInstrumentFromWatchlist, openSelectionDialog, fetchWatchlists } = useWatchlistStore();

    useEffect(() => { fetchWatchlists(); }, [fetchWatchlists]);

    const sectors = useMemo(() => {
        const uniqueSectors = new Set(instruments.map((ins: Instrument) => ins.sector).filter(Boolean));
        return ['ALL', ...Array.from(uniqueSectors).sort()];
    }, [instruments]);

    const filteredInstruments = useMemo(() => {
        const source = (searchQuery && searchQuery.trim() !== '') ? searchResults : instruments;
        return source.filter((ins: Instrument) => {
            const exchangeMatch = filters.exchange === 'ALL' || ins.exchange === filters.exchange;
            const typeMatch = filters.type === 'ALL' || ins.type === filters.type;
            const sectorMatch = filters.sector === 'ALL' || ins.sector === filters.sector;
            return exchangeMatch && typeMatch && sectorMatch;
        });
    }, [instruments, searchResults, filters, searchQuery]);

    const sortedInstruments = useMemo(() => {
        return [...filteredInstruments].sort((a, b) => {
            const aMarket = prices[a.id];
            const bMarket = prices[b.id];
            let comparison = 0;
            switch (sorting.column) {
                case 'symbol': comparison = a.symbol.localeCompare(b.symbol); break;
                case 'name': comparison = a.name.localeCompare(b.name); break;
                case 'ltp': comparison = (aMarket?.lastPrice || 0) - (bMarket?.lastPrice || 0); break;
                case 'change': comparison = (aMarket?.change || 0) - (bMarket?.change || 0); break;
                case 'changePct': comparison = (aMarket?.changePct || 0) - (bMarket?.changePct || 0); break;
                case 'volume': comparison = (aMarket?.volume || 0) - (bMarket?.volume || 0); break;
                case 'high': comparison = (aMarket?.high || 0) - (bMarket?.high || 0); break;
                case 'low': comparison = (aMarket?.low || 0) - (bMarket?.low || 0); break;
                case 'exchange': comparison = a.exchange.localeCompare(b.exchange); break;
                case 'sector': comparison = (a.sector || '').localeCompare(b.sector || ''); break;
            }
            return sorting.direction === 'asc' ? comparison : -comparison;
        });
    }, [filteredInstruments, sorting, prices]);

    const displayInstruments = useMemo(() => {
        const { page, rowsPerPage } = pagination;
        return sortedInstruments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [sortedInstruments, pagination]);

    const handleSort = (column: string) => {
        setSorting({ column, direction: sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc' });
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setPagination({ ...pagination, page: 0 });
    };

    const resetFilters = () => {
        setFilters({ exchange: 'ALL', type: 'ALL', sector: 'ALL' });
        setSearchQuery('');
        setSearchResults([]);
        setPagination({ page: 0, rowsPerPage: 25 });
    };

    const handleWatchlistToggle = async (e: React.MouseEvent, instrument: Instrument) => {
        e.stopPropagation();
        const isInAnyWatchlist = watchlists.some(w => w.instrumentIds.includes(instrument.id));
        if ((isInAnyWatchlist && watchlists.length > 1) || watchlists.length === 0 || (!isInAnyWatchlist && watchlists.length > 1)) {
            openSelectionDialog(instrument);
            return;
        }
        if (!activeWatchlistId) return;
        const inWatchlist = watchlists.find(w => w.id === activeWatchlistId)?.instrumentIds.includes(instrument.id);
        try {
            if (inWatchlist) await removeInstrumentFromWatchlist(activeWatchlistId, instrument.id);
            else await addInstrumentToWatchlist(activeWatchlistId, instrument.id);
        } catch (err) {}
    };

    return {
        displayInstruments, filteredInstruments, isLoading, error, filters, searchQuery, pagination, sorting, sectors, prices, watchlists,
        handleSort, handleFilterChange, resetFilters, handleWatchlistToggle, navigate,
        setPagination
    };
};
