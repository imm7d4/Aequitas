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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { marketService } from '@/features/market/services/marketService';
import { CreateHolidayRequest, MarketHoliday } from '@/features/market/types/market.types';

export function AdminMarketHolidayForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<CreateHolidayRequest>({
        exchange: 'NSE',
        date: '',
        name: '',
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingHolidays, setIsLoadingHolidays] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [holidays, setHolidays] = useState<MarketHoliday[]>([]);
    const [filters, setFilters] = useState({
        exchange: 'ALL',
        month: 'ALL',
    });

    const months = [
        { value: 'ALL', label: 'All Months' },
        { value: '0', label: 'January' },
        { value: '1', label: 'February' },
        { value: '2', label: 'March' },
        { value: '3', label: 'April' },
        { value: '4', label: 'May' },
        { value: '5', label: 'June' },
        { value: '6', label: 'July' },
        { value: '7', label: 'August' },
        { value: '8', label: 'September' },
        { value: '9', label: 'October' },
        { value: '10', label: 'November' },
        { value: '11', label: 'December' }
    ];

    const fetchHolidays = async () => {
        setIsLoadingHolidays(true);
        try {
            const data = await marketService.getHolidays();
            setHolidays(data);
        } catch (err: any) {
            console.error('Failed to fetch holidays:', err);
        } finally {
            setIsLoadingHolidays(false);
        }
    };

    useEffect(() => {
        fetchHolidays();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            await marketService.createHoliday(formData);
            setSuccess('Holiday added successfully!');
            setFormData({
                exchange: 'NSE',
                date: '',
                name: '',
            });
            fetchHolidays();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add holiday');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string | undefined) => {
        if (!id || !window.confirm('Are you sure you want to delete this holiday?')) return;

        try {
            await marketService.deleteHoliday(id);
            setSuccess('Holiday deleted successfully!');
            fetchHolidays();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete holiday');
        }
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredHolidays = holidays.filter(holiday => {
        const holidayDate = new Date(holiday.date);
        const exchangeMatch = filters.exchange === 'ALL' || holiday.exchange === filters.exchange;
        const monthMatch = filters.month === 'ALL' || holidayDate.getMonth().toString() === filters.month;
        return exchangeMatch && monthMatch;
    });

    const resetFilters = () => {
        setFilters({
            exchange: 'ALL',
            month: 'ALL',
        });
    };

    const isFiltered = filters.exchange !== 'ALL' || filters.month !== 'ALL';

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
                    Manage Market Holidays
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
                                <MenuItem value="ALL">ALL (Both Exchanges)</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Holiday Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Diwali, Independence Day"
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
                                    Add Holiday
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Scheduled Holidays
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ mb: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Filter by Exchange"
                                name="exchange"
                                value={filters.exchange}
                                onChange={handleFilterChange}
                                size="small"
                            >
                                <MenuItem value="ALL">All Exchanges</MenuItem>
                                <MenuItem value="NSE">NSE</MenuItem>
                                <MenuItem value="BSE">BSE</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Filter by Month"
                                name="month"
                                value={filters.month}
                                onChange={handleFilterChange}
                                size="small"
                            >
                                {months.map((m) => (
                                    <MenuItem key={m.value} value={m.value}>
                                        {m.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        {isFiltered && (
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    size="small"
                                    onClick={resetFilters}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Clear Filters
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </Box>

                {isLoadingHolidays ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Exchange</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Holiday Name</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredHolidays.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            No holidays found matching selected filters
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredHolidays.map((holiday) => (
                                        <TableRow key={holiday.id}>
                                            <TableCell>{holiday.exchange}</TableCell>
                                            <TableCell>
                                                {new Date(holiday.date).toLocaleDateString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </TableCell>
                                            <TableCell>{holiday.name}</TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDelete(holiday.id)}
                                                    title="Delete Holiday"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Container>
    );
}
