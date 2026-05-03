import React from 'react';
import { Grid, TextField, MenuItem } from '@mui/material';

interface InstrumentFormFieldsProps {
    formData: any;
    isEdit: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InstrumentFormFields: React.FC<InstrumentFormFieldsProps> = ({ formData, isEdit, onChange }) => (
    <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Symbol" name="symbol" value={formData.symbol} onChange={onChange} required disabled={isEdit} />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField fullWidth label="ISIN" name="isin" value={formData.isin} onChange={onChange} required disabled={isEdit} />
        </Grid>
        <Grid item xs={12}>
            <TextField fullWidth label="Name" name="name" value={formData.name} onChange={onChange} required />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField fullWidth select label="Exchange" name="exchange" value={formData.exchange} onChange={onChange} required disabled={isEdit}>
                <MenuItem value="NSE">NSE</MenuItem>
                <MenuItem value="BSE">BSE</MenuItem>
            </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField fullWidth select label="Type" name="type" value={formData.type} onChange={onChange} required disabled={isEdit}>
                <MenuItem value="STOCK">STOCK</MenuItem>
                <MenuItem value="ETF">ETF</MenuItem>
            </TextField>
        </Grid>
        <Grid item xs={12}><TextField fullWidth label="Sector" name="sector" value={formData.sector} onChange={onChange} required /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth type="number" label="Lot Size" name="lotSize" value={formData.lotSize} onChange={onChange} required /></Grid>
        <Grid item xs={12} sm={6}><TextField fullWidth type="number" label="Tick Size" name="tickSize" value={formData.tickSize} onChange={onChange} required /></Grid>
        {isEdit && (
            <Grid item xs={12}>
                <TextField fullWidth select label="Status" name="status" value={formData.status} onChange={onChange} required>
                    <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                    <MenuItem value="SUSPENDED">SUSPENDED</MenuItem>
                </TextField>
            </Grid>
        )}
        <Grid item xs={12}><TextField fullWidth type="date" label="Listing Date" name="listingDate" value={formData.listingDate} onChange={onChange} required InputLabelProps={{ shrink: true }} /></Grid>
    </Grid>
);
