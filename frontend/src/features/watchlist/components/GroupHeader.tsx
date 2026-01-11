import { Box, Typography, IconButton } from '@mui/material';
import { ExpandMore as ExpandIcon, ExpandLess as CollapseIcon } from '@mui/icons-material';

interface GroupHeaderProps {
    groupName: string;
    count: number;
    avgChange: number;
    totalVolume: number;
    isExpanded: boolean;
    onToggle: () => void;
}

export const GroupHeader: React.FC<GroupHeaderProps> = ({
    groupName,
    count,
    avgChange,
    totalVolume,
    isExpanded,
    onToggle,
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1.5,
                bgcolor: 'action.hover',
                borderBottom: '1px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                '&:hover': {
                    bgcolor: 'action.selected',
                },
            }}
            onClick={onToggle}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton size="small" sx={{ p: 0 }}>
                    {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
                </IconButton>
                <Typography variant="subtitle2" fontWeight={700}>
                    {groupName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    ({count} {count === 1 ? 'instrument' : 'instruments'})
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Avg Change
                    </Typography>
                    <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                            color: avgChange >= 0 ? 'success.main' : 'error.main',
                        }}
                    >
                        {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
                    </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Total Volume
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                        {totalVolume.toLocaleString()}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};
