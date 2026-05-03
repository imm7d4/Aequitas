import React from 'react';
import { Box, Typography, TextField, Grid, FormControlLabel, Switch, Chip, Divider } from '@mui/material';

interface DayHoursCardProps {
    dayLabel: string;
    dayHours: any;
    onHoursChange: (field: string, value: string | boolean) => void;
    showDivider: boolean;
}

export const DayHoursCard: React.FC<DayHoursCardProps> = ({ dayLabel, dayHours, onHoursChange, showDivider }) => (
    <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ color: 'primary.main', flexGrow: 1 }}>{dayLabel}</Typography>
            {dayHours.isClosed && <Chip label="Closed" color="error" size="small" />}
            <FormControlLabel
                control={<Switch checked={!dayHours.isClosed} onChange={(e) => onHoursChange('isClosed', !e.target.checked)} color="primary" />}
                label="Market Open"
            />
        </Box>
        <Grid container spacing={2}>
            {['preMarketStart', 'preMarketEnd', 'marketOpen', 'marketClose', 'postMarketStart', 'postMarketEnd'].map((field) => (
                <Grid item xs={12} sm={6} md={4} key={field}>
                    <TextField
                        fullWidth label={field.replace(/([A-Z])/g, ' $1').trim()}
                        value={dayHours[field]}
                        onChange={(e) => onHoursChange(field, e.target.value)}
                        disabled={dayHours.isClosed}
                        size="small"
                    />
                </Grid>
            ))}
        </Grid>
        {showDivider && <Divider sx={{ mt: 3 }} />}
    </Box>
);
