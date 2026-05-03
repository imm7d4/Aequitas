import { useState, useEffect, useCallback } from 'react';
import { SupportTicket } from '../types/support.types';

export const useSupportTicketing = () => {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

    const fetchTickets = useCallback(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/admin/tickets`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(res => res.json())
            .then(data => {
                setTickets(data.data || []);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const updateStatus = useCallback((id: string, status: string) => {
        return fetch(`${import.meta.env.VITE_API_URL}/admin/tickets/${id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ status })
        })
            .then(() => fetchTickets())
            .catch(() => { });
    }, [fetchTickets]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    return {
        tickets,
        loading,
        selectedTicket,
        setSelectedTicket,
        fetchTickets,
        updateStatus
    };
};
