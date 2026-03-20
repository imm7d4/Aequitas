import React from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { Instrument } from '../types/instrument.types';

interface InstrumentAnalysisProps {
    instrument: Instrument;
}

// Simple MetricCard for internal use in Analysis
function AnalysisMetric({ label, value }: { label: string, value: string }) {
    return (
        <Paper elevation={0} sx={{ p: 1.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 0.5, textTransform: 'uppercase', fontSize: '0.6rem' }}>
                {label}
            </Typography>
            <Typography variant="caption" fontWeight={800} sx={{ fontFamily: '"JetBrains Mono", monospace' }}>
                {value}
            </Typography>
        </Paper>
    );
}

export const InstrumentAnalysis: React.FC<InstrumentAnalysisProps> = ({ instrument }) => {
    return (
        <Box sx={{ mt: 3.5 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Typography variant="subtitle1" fontWeight={800} gutterBottom sx={{ letterSpacing: '-0.01em' }}>
                        Business Summary
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.8, fontSize: '0.9rem' }}>
                        {instrument.name} ({instrument.symbol}) is a leading enterprise in the {instrument.sector} space,
                        incorporated and listed on the {instrument.exchange}. The instrument is currently {instrument.status.toLowerCase()}
                        for market participants. Key trading parameters include a lot size of {instrument.lotSize} units
                        and a minimum price movement (tick size) of ₹{instrument.tickSize.toFixed(2)}.
                    </Typography>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.01)' }}>
                        <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2.5, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', color: 'text.secondary' }}>
                            Technical Profiling
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <AnalysisMetric label="ISIN Alpha-code" value={instrument.isin} />
                            <AnalysisMetric label="Public Listing" value={new Date(instrument.listingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
                            <AnalysisMetric label="Asset Classification" value={instrument.type} />
                            <AnalysisMetric label="Market Segment" value="EQUITY - MAIN" />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
