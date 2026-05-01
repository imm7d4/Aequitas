import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/features/auth';
import { useAuthStore } from '@/features/auth/hooks/useAuth';
import { useWatchlistStore } from '../store/watchlistStore';

export const useWatchlistPersistence = (watchlistInstruments: any[], groupBy: 'sector' | 'exchange' | 'type' | null) => {
    const { user } = useAuth();
    const [pinnedInstruments, setPinnedInstruments] = useState<string[]>(() => {
        const user = useAuthStore.getState().user;
        if (user?.email) {
            const saved = localStorage.getItem(`pinned_instruments_${user.email}`);
            if (saved) {
                try { return JSON.parse(saved); } catch (e) { console.error(e); }
            }
        }
        return [];
    });

    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (user?.email) {
            localStorage.setItem(`pinned_instruments_${user.email}`, JSON.stringify(pinnedInstruments));
        }
    }, [pinnedInstruments, user?.email]);

    useEffect(() => {
        const saved = localStorage.getItem('watchlist_expanded_groups');
        if (saved) setExpandedGroups(new Set(JSON.parse(saved)));
    }, []);

    useEffect(() => {
        localStorage.setItem('watchlist_expanded_groups', JSON.stringify(Array.from(expandedGroups)));
    }, [expandedGroups]);

    const togglePin = useCallback((id: string) => {
        setPinnedInstruments(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }, []);

    const toggleGroup = useCallback((groupName: string) => {
        setExpandedGroups(prev => {
            const next = new Set(prev);
            if (next.has(groupName)) next.delete(groupName);
            else next.add(groupName);
            return next;
        });
    }, []);

    const { pinnedItems, regularItems } = useMemo(() => {
        const pinned = watchlistInstruments.filter(inst => pinnedInstruments.includes(inst!.id));
        const regular = watchlistInstruments.filter(inst => !pinnedInstruments.includes(inst!.id));
        return { pinnedItems: pinned, regularItems: regular };
    }, [watchlistInstruments, pinnedInstruments]);

    const groupedInstruments = useMemo(() => {
        if (!groupBy) return null;
        const groups: Record<string, any[]> = {};
        watchlistInstruments.forEach(inst => {
            if (!inst) return;
            const key = inst[groupBy] || 'Other';
            if (!groups[key]) groups[key] = [];
            groups[key].push(inst);
        });
        return groups;
    }, [watchlistInstruments, groupBy]);

    return {
        pinnedInstruments, togglePin,
        expandedGroups, toggleGroup,
        pinnedItems, regularItems,
        groupedInstruments
    };
};
