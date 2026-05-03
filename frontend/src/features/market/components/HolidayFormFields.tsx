import React from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';

interface HolidayFormFieldsProps {
    formData: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const HolidayFormFields: React.FC<HolidayFormFieldsProps> = ({ formData, onChange }) => (
    <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
            <TextField fullWidth select label="Exchange" name="exchange" value={formData.exchange} onChange={onChange} required>
                <MenuItem value="NSE">NSE</MenuItem>
                <MenuItem value="BSE">BSE</MenuItem>
                <MenuItem value="ALL">ALL</MenuItem>
            </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField fullWidth type="date" label="Date" name="date" value={formData.date} onChange={onChange} required InputLabelProps={{ shrink: true }} />
        </Grid>
        <Grid item xs={12}>
            <TextField fullWidth label="Holiday Name" name="name" value={formData.name} onChange={onChange} required placeholder="e.g., Diwali" />
        </Grid>
    </Grid>
);
