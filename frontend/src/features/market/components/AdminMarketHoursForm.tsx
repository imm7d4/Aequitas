import { Container, Paper, Typography, TextField, Button, Grid, MenuItem, Box, Alert } from '@mui/material';
import { Loader } from '@/shared/components/Loader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAdminMarketHoursForm } from '../hooks/useAdminMarketHoursForm';

export function AdminMarketHoursForm() {
    const { formData, isSaving, error, success, handleChange, handleSubmit, days, navigate } = useAdminMarketHoursForm();

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin')} sx={{ mb: 3 }}>Back to Admin Panel</Button>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>Configure Market Hours</Typography>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField select fullWidth label="Exchange" name="exchange" value={formData.exchange} onChange={handleChange} required>
                                <MenuItem value="NSE">NSE</MenuItem>
                                <MenuItem value="BSE">BSE</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField select fullWidth label="Day" name="dayOfWeek" value={formData.dayOfWeek} onChange={handleChange} required>
                                {days.map(d => <MenuItem key={d.value} value={d.value}>{d.label}</MenuItem>)}
                            </TextField>
                        </Grid>
                        {['preMarketStart', 'preMarketEnd', 'marketOpen', 'marketClose', 'postMarketStart', 'postMarketEnd'].map((field) => (
                            <Grid item xs={12} sm={6} key={field}>
                                <TextField fullWidth label={field.replace(/([A-Z])/g, ' $1').trim()} name={field} value={formData[field as keyof typeof formData]} onChange={handleChange} required />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                <Button onClick={() => navigate('/admin')}>Cancel</Button>
                                <Button type="submit" variant="contained" disabled={isSaving} startIcon={isSaving && <Loader size="small" />}>Save</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}
