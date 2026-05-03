import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { marketService } from '@/features/market/services/marketService';
import { CreateHolidayRequest, MarketHoliday } from '@/features/market/types/market.types';

export const useAdminMarketHolidays = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreateHolidayRequest>({ exchange: 'NSE', date: '', name: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingHolidays, setIsLoadingHolidays] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [holidays, setHolidays] = useState<MarketHoliday[]>([]);
    const [filters, setFilters] = useState({ exchange: 'ALL', month: 'ALL' });

    const fetchHolidays = async () => {
        setIsLoadingHolidays(true);
        try {
            const data = await marketService.getHolidays();
            setHolidays(data);
        } catch (err) {} finally { setIsLoadingHolidays(false); }
    };

    useEffect(() => { fetchHolidays(); }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(null);
        try {
            await marketService.createHoliday(formData);
            setSuccess('Holiday added successfully!');
            setFormData({ exchange: 'NSE', date: '', name: '' });
            fetchHolidays();
        } catch (err: any) { setError(err.response?.data?.message || 'Failed to add holiday'); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async (id: string | undefined) => {
        if (!id || !window.confirm('Delete this holiday?')) return;
        try {
            await marketService.deleteHoliday(id);
            setSuccess('Holiday deleted!');
            fetchHolidays();
        } catch (err: any) { setError(err.response?.data?.message || 'Failed to delete'); }
    };

    const filteredHolidays = holidays.filter(h => {
        const date = new Date(h.date);
        const exMatch = filters.exchange === 'ALL' || h.exchange === filters.exchange;
        const moMatch = filters.month === 'ALL' || date.getMonth().toString() === filters.month;
        return exMatch && moMatch;
    });

    return { formData, isSaving, isLoadingHolidays, error, success, filteredHolidays, filters, setFilters, handleChange, handleSubmit, handleDelete, navigate };
};
