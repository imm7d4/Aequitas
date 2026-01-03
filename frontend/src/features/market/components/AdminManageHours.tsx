import { useState, useEffect } from 'react';
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
    CircularProgress,
    Divider,
    FormControlLabel,
    Switch,
    Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { marketService } from '@/features/market/services/marketService';
import type { CreateMarketHoursRequest } from '@/features/market/types/market.types';

const DAYS_OF_WEEK = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 7, label: 'Sunday' },
];

const DEFAULT_HOURS: Omit<CreateMarketHoursRequest, 'exchange' | 'dayOfWeek'> = {
    preMarketStart: '09:00',
    preMarketEnd: '09:15',
    marketOpen: '09:15',
    marketClose: '15:30',
    postMarketStart: '15:30',
    postMarketEnd: '16:00',
    isClosed: false,
};

export function AdminManageHours() {
    const navigate = useNavigate();
    const [exchange, setExchange] = useState<'NSE' | 'BSE'>('NSE');
    const [weeklyHours, setWeeklyHours] = useState<CreateMarketHoursRequest[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        loadWeeklyHours();
    }, [exchange]);

    const loadWeeklyHours = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const hours = await marketService.getWeeklyHours(exchange);

            // Convert to editable format
            const editableHours: CreateMarketHoursRequest[] = DAYS_OF_WEEK.map((day) => {
                const existingHours = hours[day.value - 1];
                if (existingHours) {
                    return {
                        exchange,
                        dayOfWeek: day.value,
                        preMarketStart: existingHours.preMarketStart,
                        preMarketEnd: existingHours.preMarketEnd,
                        marketOpen: existingHours.marketOpen,
                        marketClose: existingHours.marketClose,
                        postMarketStart: existingHours.postMarketStart,
                        postMarketEnd: existingHours.postMarketEnd,
                        isClosed: existingHours.isClosed,
                    };
                } else {
                    // Default: Saturday and Sunday are closed
                    const isClosed = day.value === 6 || day.value === 7;
                    return {
                        exchange,
                        dayOfWeek: day.value,
                        ...DEFAULT_HOURS,
                        isClosed,
                    };
                }
            });

            setWeeklyHours(editableHours);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load market hours');
        } finally {
            setIsLoading(false);
        }
    };

    const handleHoursChange = (
        dayIndex: number,
        field: keyof Omit<CreateMarketHoursRequest, 'exchange' | 'dayOfWeek'>,
        value: string | boolean
    ) => {
        setWeeklyHours((prev) => {
            const updated = [...prev];
            updated[dayIndex] = {
                ...updated[dayIndex],
                [field]: value,
            };
            return updated;
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await marketService.updateWeeklyHours(exchange, weeklyHours);
            setSuccess(`Successfully updated market hours for ${exchange}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save market hours');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/admin')}
                sx={{ mb: 3 }}
            >
                Back to Admin Panel
            </Button>

            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Manage Market Hours
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Configure trading hours for all days of the week. Toggle "Market Closed" to mark non-trading days.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

                <Box sx={{ mb: 4 }}>
                    <TextField
                        select
                        label="Exchange"
                        value={exchange}
                        onChange={(e) => setExchange(e.target.value as 'NSE' | 'BSE')}
                        sx={{ minWidth: 200 }}
                    >
                        <MenuItem value="NSE">NSE</MenuItem>
                        <MenuItem value="BSE">BSE</MenuItem>
                    </TextField>
                </Box>

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {weeklyHours.map((dayHours, index) => (
                            <Box key={dayHours.dayOfWeek} sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Typography variant="h6" sx={{ color: 'primary.main', flexGrow: 1 }}>
                                        {DAYS_OF_WEEK[index].label}
                                    </Typography>
                                    {dayHours.isClosed && (
                                        <Chip label="Closed" color="error" size="small" />
                                    )}
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={!dayHours.isClosed}
                                                onChange={(e) => handleHoursChange(index, 'isClosed', !e.target.checked)}
                                                color="primary"
                                            />
                                        }
                                        label="Market Open"
                                    />
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Pre-Market Start"
                                            value={dayHours.preMarketStart}
                                            onChange={(e) => handleHoursChange(index, 'preMarketStart', e.target.value)}
                                            placeholder="09:00"
                                            helperText="Format: HH:MM"
                                            disabled={dayHours.isClosed}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Pre-Market End"
                                            value={dayHours.preMarketEnd}
                                            onChange={(e) => handleHoursChange(index, 'preMarketEnd', e.target.value)}
                                            placeholder="09:15"
                                            helperText="Format: HH:MM"
                                            disabled={dayHours.isClosed}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Market Open"
                                            value={dayHours.marketOpen}
                                            onChange={(e) => handleHoursChange(index, 'marketOpen', e.target.value)}
                                            placeholder="09:15"
                                            helperText="Format: HH:MM"
                                            disabled={dayHours.isClosed}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Market Close"
                                            value={dayHours.marketClose}
                                            onChange={(e) => handleHoursChange(index, 'marketClose', e.target.value)}
                                            placeholder="15:30"
                                            helperText="Format: HH:MM"
                                            disabled={dayHours.isClosed}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Post-Market Start"
                                            value={dayHours.postMarketStart}
                                            onChange={(e) => handleHoursChange(index, 'postMarketStart', e.target.value)}
                                            placeholder="15:30"
                                            helperText="Format: HH:MM"
                                            disabled={dayHours.isClosed}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            fullWidth
                                            label="Post-Market End"
                                            value={dayHours.postMarketEnd}
                                            onChange={(e) => handleHoursChange(index, 'postMarketEnd', e.target.value)}
                                            placeholder="16:00"
                                            helperText="Format: HH:MM"
                                            disabled={dayHours.isClosed}
                                        />
                                    </Grid>
                                </Grid>
                                {index < weeklyHours.length - 1 && <Divider sx={{ mt: 3 }} />}
                            </Box>
                        ))}

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
                            <Button onClick={() => navigate('/admin')}>
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                Save All Changes
                            </Button>
                        </Box>
                    </>
                )}
            </Paper>
        </Container>
    );
}
