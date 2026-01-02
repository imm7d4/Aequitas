import { Card, CardContent, Typography, Chip, Box, Grid } from '@mui/material';
import type { Instrument } from '../types/instrument.types';

interface InstrumentCardProps {
    instrument: Instrument;
    onClick?: () => void;
}

export const InstrumentCard = ({ instrument, onClick }: InstrumentCardProps) => {
    const getStatusColor = () => {
        switch (instrument.status) {
            case 'ACTIVE':
                return 'success';
            case 'SUSPENDED':
                return 'warning';
            case 'DELISTED':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Card
            sx={{
                cursor: onClick ? 'pointer' : 'default',
                '&:hover': onClick ? { boxShadow: 3 } : {},
                transition: 'box-shadow 0.2s',
            }}
            onClick={onClick}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" component="div">
                        {instrument.symbol}
                    </Typography>
                    <Chip
                        label={instrument.status}
                        color={getStatusColor()}
                        size="small"
                    />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {instrument.name}
                </Typography>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                            Exchange
                        </Typography>
                        <Typography variant="body2">{instrument.exchange}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                            Sector
                        </Typography>
                        <Typography variant="body2">{instrument.sector}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                            ISIN
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            {instrument.isin}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                            Type
                        </Typography>
                        <Typography variant="body2">{instrument.type}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
