import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { instrumentService } from '../services/instrumentService';
import { CreateInstrumentRequest, UpdateInstrumentRequest } from '../types/instrument.types';

export function AdminInstrumentForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState<CreateInstrumentRequest>({
        symbol: '',
        name: '',
        isin: '',
        exchange: 'NSE',
        type: 'STOCK',
        sector: '',
        lotSize: 1,
        tickSize: 0.05,
        listingDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
    });

    const [isLoading, setIsLoading] = useState(isEdit);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (isEdit) {
            const fetchInstrument = async () => {
                try {
                    const instrument = await instrumentService.getInstrumentById(id);
                    setFormData({
                        symbol: instrument.symbol,
                        name: instrument.name,
                        isin: instrument.isin,
                        exchange: instrument.exchange,
                        type: instrument.type,
                        sector: instrument.sector,
                        lotSize: instrument.lotSize,
                        tickSize: instrument.tickSize,
                        listingDate: instrument.listingDate ? new Date(instrument.listingDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                        status: instrument.status,
                    });
                } catch (err: any) {
                    setError('Failed to fetch instrument details');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchInstrument();
        }
    }, [id, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'lotSize' || name === 'tickSize' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setSuccess(null);

        try {
            if (isEdit) {
                const updateData: UpdateInstrumentRequest = {
                    name: formData.name,
                    sector: formData.sector,
                    lotSize: formData.lotSize,
                    tickSize: formData.tickSize,
                    status: formData.status,
                };
                await instrumentService.updateInstrument(id, updateData);
                setSuccess('Instrument updated successfully!');
            } else {
                await instrumentService.createInstrument(formData);
                setSuccess('Instrument created successfully!');
                // Reset form on success for new creation
                setFormData({
                    symbol: '',
                    name: '',
                    isin: '',
                    exchange: 'NSE',
                    type: 'STOCK',
                    sector: '',
                    lotSize: 1,
                    tickSize: 0.05,
                    listingDate: new Date().toISOString().split('T')[0],
                    status: 'ACTIVE',
                });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save instrument');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

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
                    {isEdit ? `Edit Instrument: ${formData.symbol}` : 'Add New Instrument'}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Symbol"
                                name="symbol"
                                value={formData.symbol}
                                onChange={handleChange}
                                required
                                disabled={isEdit}
                                helperText={isEdit ? "Symbol cannot be changed" : "e.g., RELIANCE"}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="ISIN"
                                name="isin"
                                value={formData.isin}
                                onChange={handleChange}
                                required
                                disabled={isEdit}
                                helperText={isEdit ? "ISIN cannot be changed" : "e.g., INE002A01018"}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                helperText="Full company name"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Exchange"
                                name="exchange"
                                value={formData.exchange}
                                onChange={handleChange}
                                required
                                disabled={isEdit}
                            >
                                <MenuItem value="NSE">NSE</MenuItem>
                                <MenuItem value="BSE">BSE</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                                disabled={isEdit}
                            >
                                <MenuItem value="STOCK">STOCK</MenuItem>
                                <MenuItem value="ETF">ETF</MenuItem>
                                <MenuItem value="BOND">BOND</MenuItem>
                                <MenuItem value="MUTUAL_FUND">MUTUAL FUND</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Sector"
                                name="sector"
                                value={formData.sector}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Energy, Technology"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Lot Size"
                                name="lotSize"
                                value={formData.lotSize}
                                onChange={handleChange}
                                required
                                inputProps={{ min: 1 }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Tick Size"
                                name="tickSize"
                                value={formData.tickSize}
                                onChange={handleChange}
                                required
                                inputProps={{ min: 0.01, step: 0.01 }}
                            />
                        </Grid>
                        {isEdit && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                                    <MenuItem value="SUSPENDED">SUSPENDED</MenuItem>
                                    <MenuItem value="DELISTED">DELISTED</MenuItem>
                                </TextField>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Listing Date"
                                name="listingDate"
                                value={formData.listingDate}
                                onChange={handleChange}
                                required
                                InputLabelProps={{ shrink: true }}
                                helperText="Date the instrument was listed on the exchange"
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
                                    {isEdit ? 'Update Instrument' : 'Create Instrument'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}
