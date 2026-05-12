import { Container, Paper, Typography, TextField, Button, MenuItem, Box, Alert } from '@mui/material';
import { Loader } from '@/shared/components/Loader';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { useAdminManageHours } from '../hooks/useAdminManageHours';
import { DayHoursCard } from './DayHoursCard';

export function AdminManageHours() {
    const { exchange, setExchange, weeklyHours, isLoading, isSaving, error, success, handleHoursChange, handleSave, navigate, DAYS_OF_WEEK } = useAdminManageHours();

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin')} sx={{ mb: 3 }}>Back to Admin Panel</Button>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>Manage Market Hours</Typography>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
                <Box sx={{ mb: 4 }}>
                    <TextField select label="Exchange" value={exchange} onChange={(e) => setExchange(e.target.value as 'NSE' | 'BSE')} sx={{ minWidth: 200 }}>
                        <MenuItem value="NSE">NSE</MenuItem>
                        <MenuItem value="BSE">BSE</MenuItem>
                    </TextField>
                </Box>
                {isLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><Loader size="medium" /></Box> : (
                    <>
                        {weeklyHours.map((dayHours, index) => (
                            <DayHoursCard 
                                key={dayHours.dayOfWeek} 
                                dayLabel={DAYS_OF_WEEK[index].label} 
                                dayHours={dayHours} 
                                onHoursChange={(field, val) => handleHoursChange(index, field, val)} 
                                showDivider={index < weeklyHours.length - 1} 
                            />
                        ))}
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
                            <Button onClick={() => navigate('/admin')}>Cancel</Button>
                            <Button variant="contained" startIcon={isSaving ? <Loader size="small" /> : <SaveIcon />} onClick={handleSave} disabled={isSaving}>
                                Save All Changes
                            </Button>
                        </Box>
                    </>
                )}
            </Paper>
        </Container>
    );
}
