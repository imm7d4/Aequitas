import { Chip, alpha, useTheme } from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    ShoppingCart,
    Sell,
} from '@mui/icons-material';

interface IntentBadgeProps {
    intent?: string;
    side: 'BUY' | 'SELL';
}

export const IntentBadge: React.FC<IntentBadgeProps> = ({ intent, side }) => {
    const theme = useTheme();

    // Map intent to display text and styling
    const getIntentConfig = () => {
        switch (intent) {
            case 'OPEN_LONG':
                return {
                    label: 'BUY (Long)',
                    color: theme.palette.success.main,
                    bgColor: alpha(theme.palette.success.main, 0.1),
                    borderColor: alpha(theme.palette.success.main, 0.3),
                    icon: <TrendingUp sx={{ fontSize: '14px !important' }} />,
                };
            case 'CLOSE_LONG':
                return {
                    label: 'SELL (Exit Long)',
                    color: theme.palette.info.main,
                    bgColor: alpha(theme.palette.info.main, 0.1),
                    borderColor: alpha(theme.palette.info.main, 0.3),
                    icon: <Sell sx={{ fontSize: '14px !important' }} />,
                };
            case 'OPEN_SHORT':
                return {
                    label: 'SHORT SELL',
                    color: theme.palette.error.main,
                    bgColor: alpha(theme.palette.error.main, 0.1),
                    borderColor: alpha(theme.palette.error.main, 0.3),
                    icon: <TrendingDown sx={{ fontSize: '14px !important' }} />,
                };
            case 'CLOSE_SHORT':
                return {
                    label: 'BUY TO COVER',
                    color: theme.palette.warning.main,
                    bgColor: alpha(theme.palette.warning.main, 0.1),
                    borderColor: alpha(theme.palette.warning.main, 0.3),
                    icon: <ShoppingCart sx={{ fontSize: '14px !important' }} />,
                };
            default:
                // Fallback to side if intent is not specified
                return {
                    label: side,
                    color: side === 'BUY' ? theme.palette.success.main : theme.palette.error.main,
                    bgColor: alpha(side === 'BUY' ? theme.palette.success.main : theme.palette.error.main, 0.1),
                    borderColor: alpha(side === 'BUY' ? theme.palette.success.main : theme.palette.error.main, 0.3),
                    icon: side === 'BUY' ? <TrendingUp sx={{ fontSize: '14px !important' }} /> : <TrendingDown sx={{ fontSize: '14px !important' }} />,
                };
        }
    };

    const config = getIntentConfig();

    return (
        <Chip
            icon={config.icon}
            label={config.label}
            size="small"
            sx={{
                bgcolor: config.bgColor,
                color: config.color,
                fontWeight: 700,
                fontSize: '0.7rem',
                border: '1px solid',
                borderColor: config.borderColor,
                height: 24,
                '& .MuiChip-icon': {
                    color: config.color,
                },
            }}
        />
    );
};
