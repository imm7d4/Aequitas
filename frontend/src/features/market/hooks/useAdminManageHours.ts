import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { marketService } from '@/features/market/services/marketService';
import type { CreateMarketHoursRequest } from '@/features/market/types/market.types';

const DAYS_OF_WEEK = [
    { value: 1, label: 'Monday' }, { value: 2, label: 'Tuesday' }, { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' }, { value: 5, label: 'Friday' }, { value: 6, label: 'Saturday' }, { value: 7, label: 'Sunday' },
];

const DEFAULT_HOURS: Omit<CreateMarketHoursRequest, 'exchange' | 'dayOfWeek'> = {
    preMarketStart: '09:00', preMarketEnd: '09:15', marketOpen: '09:15', marketClose: '15:30', postMarketStart: '15:30', postMarketEnd: '16:00', isClosed: false,
};

export const useAdminManageHours = () => {
    const navigate = useNavigate();
    const [exchange, setExchange] = useState<'NSE' | 'BSE'>('NSE');
    const [weeklyHours, setWeeklyHours] = useState<CreateMarketHoursRequest[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const loadWeeklyHours = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const hours = await marketService.getWeeklyHours(exchange);
            const editableHours: CreateMarketHoursRequest[] = DAYS_OF_WEEK.map((day) => {
                const existing = hours[day.value - 1];
                return existing ? { exchange, dayOfWeek: day.value, ...existing } : { exchange, dayOfWeek: day.value, ...DEFAULT_HOURS, isClosed: day.value >= 6 };
            });
            setWeeklyHours(editableHours);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load market hours');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadWeeklyHours(); }, [exchange]);

    const handleHoursChange = (dayIndex: number, field: string, value: string | boolean) => {
        setWeeklyHours(prev => {
            const updated = [...prev];
            updated[dayIndex] = { ...updated[dayIndex], [field]: value };
            return updated;
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        setSuccess(null);
        try {
            await marketService.updateWeeklyHours(exchange, weeklyHours);
            setSuccess(`Successfully updated market hours for ${exchange}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save market hours');
        } finally {
            setIsSaving(false);
        }
    };

    return { exchange, setExchange, weeklyHours, isLoading, isSaving, error, success, handleHoursChange, handleSave, navigate, DAYS_OF_WEEK };
};
