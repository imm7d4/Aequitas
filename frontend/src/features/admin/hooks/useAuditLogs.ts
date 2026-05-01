import { useState, useEffect, useMemo } from 'react';
import { adminService, AuditLog } from '../services/adminService';

const FILTER_ALL = 'ALL';

export const useAuditLogs = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAction, setFilterAction] = useState(FILTER_ALL);
    const [unmaskedLogs, setUnmaskedLogs] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAuditLogs();
            const mappedLogs = data.map((log: any) => ({
                ...log,
                id: log.id || log._id,
                correlation_id: log.correlation_id || 'N/A'
            }));
            setLogs(mappedLogs);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const logJustification = async (id: string, ticketRef: string, justification: string) => {
        try {
            await adminService.justifyAuditLog(id, ticketRef, justification);
            setUnmaskedLogs(prev => new Set(prev).add(id));
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 log.actor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 log.action.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesAction = filterAction === FILTER_ALL || log.action === filterAction;
            return matchesSearch && matchesAction;
        });
    }, [logs, searchTerm, filterAction]);

    return {
        logs: filteredLogs,
        loading,
        searchTerm,
        setSearchTerm,
        filterAction,
        setFilterAction,
        unmaskedLogs,
        logJustification
    };
};
