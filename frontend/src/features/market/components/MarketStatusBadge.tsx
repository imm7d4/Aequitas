import { Chip } from '@mui/material';
import { useMarketStatus } from '../hooks/useMarketStatus';

export const MarketStatusBadge = () => {
    const { marketStatus, isLoading } = useMarketStatus('NSE');

    if (isLoading || !marketStatus) {
        return <Chip label="Loading..." size="small" />;
    }

    const getStatusColor = () => {
        switch (marketStatus.status) {
            case 'OPEN':
                return 'success';
            case 'CLOSED':
                return 'error';
            case 'PRE_MARKET':
            case 'POST_MARKET':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getStatusLabel = () => {
        switch (marketStatus.status) {
            case 'OPEN':
                return 'Market Open';
            case 'CLOSED':
                return 'Market Closed';
            case 'PRE_MARKET':
                return 'Pre-Market';
            case 'POST_MARKET':
                return 'Post-Market';
            default:
                return marketStatus.status;
        }
    };

    return (
        <Chip
            label={getStatusLabel()}
            color={getStatusColor()}
            size="small"
            sx={{ fontWeight: 'bold' }}
        />
    );
};
