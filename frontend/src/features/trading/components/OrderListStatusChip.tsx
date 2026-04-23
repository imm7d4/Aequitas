import React from 'react';
import { Chip, alpha, useTheme } from '@mui/material';
import {
    AccessTime as PendingIcon,
    CheckCircle as SuccessIcon,
    Cancel as CancelIcon,
    Error as ErrorIcon,
} from '@mui/icons-material';
import { ORDER_STATUS } from '@/shared/constants/AppConstants';

interface OrderListStatusChipProps {
    status: string;
}

export const OrderListStatusChip: React.FC<OrderListStatusChipProps> = ({ status }) => {
    const theme = useTheme();

    switch (status.toUpperCase()) {
        case 'NEW':
        case ORDER_STATUS.PENDING:
            return (
                <Chip
                    icon={<PendingIcon sx={{ fontSize: '16px !important' }} />}
                    label="Pending"
                    size="small"
                    sx={{
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        color: 'warning.main',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: alpha(theme.palette.warning.main, 0.2),
                    }}
                />
            );
        case ORDER_STATUS.FILLED:
            return (
                <Chip
                    icon={<SuccessIcon sx={{ fontSize: '16px !important' }} />}
                    label="Executed"
                    size="small"
                    sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: 'success.main',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: alpha(theme.palette.success.main, 0.2),
                    }}
                />
            );
        case ORDER_STATUS.CANCELLED:
            return (
                <Chip
                    icon={<CancelIcon sx={{ fontSize: '16px !important' }} />}
                    label="Cancelled"
                    size="small"
                    sx={{
                        bgcolor: alpha(theme.palette.text.secondary, 0.1),
                        color: 'text.secondary',
                        fontWeight: 700,
                    }}
                />
            );
        case ORDER_STATUS.REJECTED:
            return (
                <Chip
                    icon={<ErrorIcon sx={{ fontSize: '16px !important' }} />}
                    label="Rejected"
                    size="small"
                    sx={{
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        color: 'error.main',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: alpha(theme.palette.error.main, 0.2),
                    }}
                />
            );
        default:
            return <Chip label={status} size="small" />;
    }
};
