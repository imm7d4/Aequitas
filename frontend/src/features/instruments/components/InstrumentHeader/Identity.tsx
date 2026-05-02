import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { Instrument } from '../../types/instrument.types';

interface IdentityProps {
    instrument: Instrument;
}

export const Identity: React.FC<IdentityProps> = ({ instrument }) => {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { lg: 1, xl: 2 }, flexShrink: 0 }}>
            <IconButton
                size="small"
                onClick={() => navigate(-1)}
                sx={{ 
                    bgcolor: 'background.paper', 
                    border: '1px solid', 
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover' },
                    width: 28,
                    height: 28
                }}
            >
                <ArrowBackIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Box>
                <Typography 
                    variant="h6" 
                    fontWeight={800} 
                    sx={{ 
                        letterSpacing: '-0.02em', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5, 
                        lineHeight: 1.1,
                        fontSize: { lg: '1rem', xl: '1.25rem' } 
                    }}
                >
                    {instrument.symbol} <Box component="span" sx={{ color: 'text.disabled', fontWeight: 300, fontSize: '0.8em' }}>/</Box> {instrument.exchange}
                </Typography>
                <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    fontWeight={600} 
                    sx={{ 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em',
                        fontSize: { lg: '0.6rem', xl: '0.7rem' },
                        display: { lg: 'none', xl: 'block' }
                    }}
                >
                    {instrument.name}
                </Typography>
            </Box>
        </Box>
    );
};
