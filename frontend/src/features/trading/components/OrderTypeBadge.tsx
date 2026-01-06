import { Chip, Tooltip, alpha, useTheme } from '@mui/material';
import {
    ShowChart as LimitIcon,
    Stop as StopIcon,
    TrendingUp as TrailingIcon,
} from '@mui/icons-material';

export type OrderType = 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT' | 'TRAILING_STOP';

interface OrderTypeBadgeProps {
    orderType: OrderType;
    onClick?: () => void;
    showTooltip?: boolean;
    size?: 'small' | 'medium';
}

const ORDER_TYPE_CONFIG = {
    MARKET: {
        label: 'Market',
        color: '#757575', // grey[600]
        icon: null,
        tooltip: 'Market order - Executes immediately at best available price',
    },
    LIMIT: {
        label: 'Limit',
        color: '#1976d2', // blue[600]
        icon: LimitIcon,
        tooltip: 'Limit order - Executes only at specified price or better',
    },
    STOP: {
        label: 'Stop',
        color: '#ed6c02', // orange[600]
        icon: StopIcon,
        tooltip: 'Stop order - Triggers market order when stop price is reached',
    },
    STOP_LIMIT: {
        label: 'Stop-Limit',
        color: '#9c27b0', // purple[600]
        icon: StopIcon,
        tooltip: 'Stop-Limit order - Triggers limit order when stop price is reached',
    },
    TRAILING_STOP: {
        label: 'Trailing Stop',
        color: '#42a5f5', // blue[400]
        icon: TrailingIcon,
        tooltip: 'Trailing Stop - Stop price automatically adjusts as market moves favorably',
    },
};

export const OrderTypeBadge: React.FC<OrderTypeBadgeProps> = ({
    orderType,
    onClick,
    showTooltip = true,
    size = 'small',
}) => {
    const theme = useTheme();
    const config = ORDER_TYPE_CONFIG[orderType];
    const Icon = config.icon;

    const badge = (
        <Chip
            label={config.label}
            icon={Icon ? <Icon sx={{ fontSize: '16px !important' }} /> : undefined}
            size={size}
            onClick={onClick}
            sx={{
                bgcolor: alpha(config.color, 0.1),
                color: config.color,
                fontWeight: 700,
                border: '1px solid',
                borderColor: alpha(config.color, 0.3),
                cursor: onClick ? 'pointer' : 'default',
                '&:hover': onClick ? {
                    bgcolor: alpha(config.color, 0.2),
                    borderColor: alpha(config.color, 0.5),
                } : {},
                // Gradient for trailing stop
                ...(orderType === 'TRAILING_STOP' && {
                    background: `linear-gradient(135deg, ${alpha(theme.palette.info.light, 0.2)} 0%, ${alpha(theme.palette.info.main, 0.2)} 100%)`,
                    borderColor: theme.palette.info.main,
                    color: theme.palette.info.dark,
                }),
            }}
        />
    );

    if (showTooltip) {
        return (
            <Tooltip title={config.tooltip} arrow placement="top">
                {badge}
            </Tooltip>
        );
    }

    return badge;
};
