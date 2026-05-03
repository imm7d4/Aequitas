import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { marketService } from '@/features/market/services/marketService';
import { CreateMarketHoursRequest } from '@/features/market/types/market.types';

export const useAdminMarketHoursForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CreateMarketHoursRequest>({
        exchange: 'NSE', dayOfWeek: 1, preMarketStart: '09:00', preMarketEnd: '09:15',
        marketOpen: '09:15', marketClose: '15:30', postMarketStart: '15:30', postMarketEnd: '16:00',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'dayOfWeek' ? Number(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(null);
        try {
            await marketService.createMarketHours(formData);
            setSuccess('Market hours configured successfully!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save market hours');
        } finally {
            setIsSaving(false);
        }
    };

    const days = [
        { value: 1, label: 'Monday' }, { value: 2, label: 'Tuesday' }, { value: 3, label: 'Wednesday' },
        { value: 4, label: 'Thursday' }, { value: 5, label: 'Friday' }, { value: 6, label: 'Saturday' }, { value: 7, label: 'Sunday' },
    ];

    return { formData, isSaving, error, success, handleChange, handleSubmit, days, navigate };
};
