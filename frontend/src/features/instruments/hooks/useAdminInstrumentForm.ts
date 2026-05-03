import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { instrumentService } from '../services/instrumentService';
import { CreateInstrumentRequest, UpdateInstrumentRequest } from '../types/instrument.types';

export const useAdminInstrumentForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState<CreateInstrumentRequest>({
        symbol: '', name: '', isin: '', exchange: 'NSE', type: 'STOCK', sector: '', lotSize: 1, tickSize: 0.05,
        listingDate: new Date().toISOString().split('T')[0], status: 'ACTIVE',
    });

    const [isLoading, setIsLoading] = useState(isEdit);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (isEdit) {
            const fetchInstrument = async () => {
                try {
                    const instrument = await instrumentService.getInstrumentById(id!);
                    setFormData({
                        symbol: instrument.symbol, name: instrument.name, isin: instrument.isin,
                        exchange: instrument.exchange, type: instrument.type, sector: instrument.sector,
                        lotSize: instrument.lotSize, tickSize: instrument.tickSize,
                        listingDate: instrument.listingDate ? new Date(instrument.listingDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                        status: instrument.status,
                    });
                } catch (err) {
                    setError('Failed to fetch instrument details');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchInstrument();
        }
    }, [id, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: ['lotSize', 'tickSize'].includes(name) ? Number(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(null);
        try {
            if (isEdit) {
                await instrumentService.updateInstrument(id!, {
                    name: formData.name, sector: formData.sector, lotSize: formData.lotSize,
                    tickSize: formData.tickSize, status: formData.status,
                });
                setSuccess('Instrument updated successfully!');
            } else {
                await instrumentService.createInstrument(formData);
                setSuccess('Instrument created successfully!');
                setFormData({
                    symbol: '', name: '', isin: '', exchange: 'NSE', type: 'STOCK', sector: '',
                    lotSize: 1, tickSize: 0.05, listingDate: new Date().toISOString().split('T')[0], status: 'ACTIVE',
                });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save instrument');
        } finally {
            setIsSaving(false);
        }
    };

    return { formData, isEdit, isLoading, isSaving, error, success, handleChange, handleSubmit, navigate };
};
