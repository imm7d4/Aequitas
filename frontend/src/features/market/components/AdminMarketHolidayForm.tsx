import { Container, Paper, Typography, Button, Box, Alert, Divider, TextField, MenuItem, Grid } from '@mui/material';
import { Loader } from '@/shared/components/Loader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAdminMarketHolidays } from '../hooks/useAdminMarketHolidays';
import { HolidayFormFields } from './HolidayFormFields';
import { HolidayTable } from './HolidayTable';

export function AdminMarketHolidayForm() {
    const { formData, isSaving, isLoadingHolidays, error, success, filteredHolidays, filters, setFilters, handleChange, handleSubmit, handleDelete, navigate } = useAdminMarketHolidays();

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin')} sx={{ mb: 3 }}>Back to Admin Panel</Button>
            <Paper sx={{ p: 4 }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        letterSpacing: '-0.01em',
                        mb: 2,
                        color: 'text.primary',
                    }}
                >
                    Manage Market Holidays
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
                <form onSubmit={handleSubmit}>
                    <HolidayFormFields formData={formData} onChange={handleChange} />
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                        <Button onClick={() => navigate('/admin')}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={isSaving} startIcon={isSaving && <Loader size="small" />}>Add Holiday</Button>
                    </Box>
                </form>
            </Paper>

            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" gutterBottom>Scheduled Holidays</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                        <TextField select fullWidth label="Exchange" value={filters.exchange} onChange={(e) => setFilters({ ...filters, exchange: e.target.value })} size="small">
                            <MenuItem value="ALL">All</MenuItem>
                            <MenuItem value="NSE">NSE</MenuItem>
                            <MenuItem value="BSE">BSE</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
                {isLoadingHolidays ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><Loader size="medium" /></Box> : <HolidayTable holidays={filteredHolidays} onDelete={handleDelete} />}
            </Paper>
        </Container>
    );
}
