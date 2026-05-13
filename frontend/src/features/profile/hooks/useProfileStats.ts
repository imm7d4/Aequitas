import { useState, useEffect, useCallback } from 'react';
import { profileStatsService, ProfileStats } from '../services/profileStatsService';

export const useProfileStats = () => {
    const [stats, setStats] = useState<ProfileStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await profileStatsService.getStats();
            setStats(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load stats');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, isLoading, error, refresh: fetchStats };
};
