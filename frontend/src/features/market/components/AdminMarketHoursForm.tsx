import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { marketService } from '@/features/market/services/marketService';
import { CreateMarketHoursRequest } from '@/features/market/types/market.types';

export function AdminMarketHoursForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<CreateMarketHoursRequest>({
        exchange: 'NSE',
        dayOfWeek: 1, // Monday
        preMarketStart: '09:00',
        preMarketEnd: '09:15',
        marketOpen: '09:15',
        marketClose: '15:30',
        postMarketStart: '15:30',
        postMarketEnd: '16:00',
    });

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'dayOfWeek' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await marketService.createMarketHours(formData);
            setSuccess('Market hours configured successfully!');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save market hours');
        } finally {
            setIsSaving(false);
        }
    };

    const days = [
        { value: 1, label: 'Monday' },
        { value: 2, label: 'Tuesday' },
        { value: 3, label: 'Wednesday' },
        { value: 4, label: 'Thursday' },
        { value: 5, label: 'Friday' },
        { value: 6, label: 'Saturday' },
        { value: 7, label: 'Sunday' },
    ];

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/admin')}
                sx={{ mb: 3 }}
            >
                Back to Admin Panel
            </Button>

            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Configure Market Hours
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Exchange"
                                name="exchange"
                                value={formData.exchange}
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="NSE">NSE</MenuItem>
                                <MenuItem value="BSE">BSE</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Day of Week"
                                name="dayOfWeek"
                                value={formData.dayOfWeek}
                                onChange={handleChange}
                                required
                            >
                                {days.map(day => (
                                    <MenuItem key={day.value} value={day.value}>
                                        {day.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ mt: 2 }}>Sessions (HH:MM)</Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Pre-Market Start"
                                name="preMarketStart"
                                value={formData.preMarketStart}
                                onChange={handleChange}
                                required
                                placeholder="09:00"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Pre-Market End"
                                name="preMarketEnd"
                                value={formData.preMarketEnd}
                                onChange={handleChange}
                                required
                                placeholder="09:15"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Market Open"
                                name="marketOpen"
                                value={formData.marketOpen}
                                onChange={handleChange}
                                required
                                placeholder="09:15"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Market Close"
                                name="marketClose"
                                value={formData.marketClose}
                                onChange={handleChange}
                                required
                                placeholder="15:30"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Post-Market Start"
                                name="postMarketStart"
                                value={formData.postMarketStart}
                                onChange={handleChange}
                                required
                                placeholder="15:30"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Post-Market End"
                                name="postMarketEnd"
                                value={formData.postMarketEnd}
                                onChange={handleChange}
                                required
                                placeholder="16:00"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                                <Button onClick={() => navigate('/admin')}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isSaving}
                                    startIcon={isSaving && <CircularProgress size={20} />}
                                >
                                    Save Configuration
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}
