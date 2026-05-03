import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/features/auth';

export const useTicketConversation = (ticketId: string, onCommentAdded?: () => void) => {
    const { user } = useAuth();
    const [ticket, setTicket] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [attachments, setAttachments] = useState<string[]>([]);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchData = () => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/tickets/${ticketId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => { setTicket(data.data); setLoading(false); scrollToBottom(); })
        .catch(() => setLoading(false));
    };

    useEffect(() => { fetchData(); }, [ticketId]);

    const scrollToBottom = () => {
        setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 100);
    };

    const handleSend = () => {
        if (!message.trim() && attachments.length === 0) return;
        setSending(true);
        fetch(`${import.meta.env.VITE_API_URL}/tickets/${ticketId}/comments`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, attachments })
        })
        .then(() => { setMessage(''); setAttachments([]); setSending(false); fetchData(); if (onCommentAdded) onCommentAdded(); })
        .catch(() => setSending(false));
    };

    return { user, ticket, loading, message, setMessage, attachments, setAttachments, sending, handleSend, scrollRef };
};
