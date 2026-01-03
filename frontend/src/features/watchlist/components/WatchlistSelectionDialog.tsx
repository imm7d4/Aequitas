import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Typography,
    Box,
    CircularProgress,
} from '@mui/material';
import { useWatchlistStore } from '../store/watchlistStore';

export const WatchlistSelectionDialog: React.FC = () => {
    const {
        watchlists,
        selectionDialogOpen: open,
        selectedInstrument: instrument,
        closeSelectionDialog: onClose,
        syncInstrumentInWatchlists
    } = useWatchlistStore();

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Initialize selectedIds based on instrument's presence in watchlists
    useEffect(() => {
        if (open && instrument) {
            const initialSelected = watchlists
                .filter(w => w.instrumentIds.includes(instrument.id))
                .map(w => w.id);
            setSelectedIds(initialSelected);
        }
    }, [open, instrument, watchlists]);

    const handleToggle = (watchlistId: string) => {
        setSelectedIds(prev =>
            prev.includes(watchlistId)
                ? prev.filter(id => id !== watchlistId)
                : [...prev, watchlistId]
        );
    };

    const handleSave = async () => {
        if (!instrument) return;
        setIsSaving(true);
        try {
            await syncInstrumentInWatchlists(instrument.id, selectedIds);
            onClose();
        } catch (err) {
            console.error('Failed to sync instrument in watchlists', err);
        } finally {
            setIsSaving(false);
        }
    };

    if (!instrument) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                Add to Watchlist
                <Typography variant="body2" color="textSecondary">
                    {instrument.symbol} - {instrument.name}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" gutterBottom>
                        Select watchlists to include this instrument:
                    </Typography>
                    <FormGroup>
                        {watchlists.map(w => (
                            <FormControlLabel
                                key={w.id}
                                control={
                                    <Checkbox
                                        checked={selectedIds.includes(w.id)}
                                        onChange={() => handleToggle(w.id)}
                                        color="primary"
                                    />
                                }
                                label={w.name}
                            />
                        ))}
                    </FormGroup>
                    {watchlists.length === 0 && (
                        <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
                            No watchlists found. Please create one on the dashboard.
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isSaving}>Cancel</Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={isSaving || watchlists.length === 0}
                    startIcon={isSaving ? <CircularProgress size={20} /> : null}
                >
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};
