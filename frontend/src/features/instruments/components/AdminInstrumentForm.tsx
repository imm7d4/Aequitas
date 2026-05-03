import { Container, Paper, Typography, Button, Box, Alert, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAdminInstrumentForm } from '../hooks/useAdminInstrumentForm';
import { InstrumentFormFields } from './InstrumentFormFields';

export function AdminInstrumentForm() {
    const { formData, isEdit, isLoading, isSaving, error, success, handleChange, handleSubmit, navigate } = useAdminInstrumentForm();

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin')} sx={{ mb: 3 }}>Back to Admin Panel</Button>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>{isEdit ? `Edit: ${formData.symbol}` : 'Add New Instrument'}</Typography>
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
                <form onSubmit={handleSubmit}>
                    <InstrumentFormFields formData={formData} isEdit={isEdit} onChange={handleChange} />
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                        <Button onClick={() => navigate('/admin')}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={isSaving} startIcon={isSaving && <CircularProgress size={20} />}>
                            {isEdit ? 'Update Instrument' : 'Create Instrument'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
}
