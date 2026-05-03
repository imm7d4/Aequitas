import React from 'react';
import { Box, Typography, IconButton, styled } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { Instrument } from '../../types/instrument.types';

interface IdentityProps {
    instrument: Instrument;
}

const StyledContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    flexShrink: 0
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': { backgroundColor: theme.palette.action.hover },
    width: 28,
    height: 28
}));

const SymbolTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 800,
    letterSpacing: '-0.02em',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    lineHeight: 1.1,
    [theme.breakpoints.up('lg')]: { fontSize: '1rem' },
    [theme.breakpoints.up('xl')]: { fontSize: '1.25rem' }
}));

const InstrumentName = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    [theme.breakpoints.up('lg')]: { display: 'none', fontSize: '0.6rem' },
    [theme.breakpoints.up('xl')]: { display: 'block', fontSize: '0.7rem' }
}));

export const Identity = React.memo(({ instrument }: IdentityProps) => {
    const navigate = useNavigate();

    return (
        <StyledContainer>
            <ActionButton size="small" onClick={() => navigate(-1)}>
                <ArrowBackIcon sx={{ fontSize: 16 }} />
            </ActionButton>
            <div>
                <SymbolTitle variant="h6">
                    {instrument.symbol} 
                    <span style={{ opacity: 0.5, fontWeight: 300, fontSize: '0.8em', margin: '0 2px' }}>
                        /
                    </span> 
                    {instrument.exchange}
                </SymbolTitle>
                <InstrumentName variant="caption">
                    {instrument.name}
                </InstrumentName>
            </div>
        </StyledContainer>
    );
});
