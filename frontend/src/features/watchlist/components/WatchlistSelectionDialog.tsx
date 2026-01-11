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
    TextField,
    Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useWatchlistStore } from '../store/watchlistStore';

export const WatchlistSelectionDialog: React.FC = () => {
    const {
        watchlists,
        selectionDialogOpen: open,
        selectedInstrument: instrument,
        closeSelectionDialog: onClose,
        syncInstrumentInWatchlists,
        createWatchlist,
    } = useWatchlistStore();

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [newWatchlistName, setNewWatchlistName] = useState('');
    const [showCreate, setShowCreate] = useState(false);

    // Initialize selectedIds based on instrument's presence in watchlists
    useEffect(() => {
        if (open && instrument) {
            const initialSelected = watchlists
                .filter(w => w.instrumentIds.includes(instrument.id))
                .map(w => w.id);
            setSelectedIds(initialSelected);
            setShowCreate(watchlists.length === 0);
            setNewWatchlistName('');
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
            let targetWatchlistIds = [...selectedIds];

            // If a new watchlist name is provided, create it first
            if (newWatchlistName.trim()) {
                const newId = await createWatchlist(newWatchlistName.trim());
                targetWatchlistIds.push(newId);
            }

            // Always sync, even if targetWatchlistIds is empty (to remove from all watchlists)
            await syncInstrumentInWatchlists(instrument.id, targetWatchlistIds);
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
            <DialogTitle sx={{ pb: 1 }}>
                Watchlist Options
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {instrument.symbol} • {instrument.name}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 1 }}>
                    {watchlists.length > 0 && (
                        <>
                            <Typography variant="overline" color="text.secondary" fontWeight={700}>
                                Add to Existing
                            </Typography>
                            <FormGroup sx={{ mb: 2 }}>
                                {watchlists.map(w => (
                                    <FormControlLabel
                                        key={w.id}
                                        control={
                                            <Checkbox
                                                checked={selectedIds.includes(w.id)}
                                                onChange={() => handleToggle(w.id)}
                                                color="primary"
                                                size="small"
                                            />
                                        }
                                        label={
                                            <Typography variant="body2" fontWeight={500}>
                                                {w.name}
                                            </Typography>
                                        }
                                    />
                                ))}
                            </FormGroup>
                            <Divider sx={{ mb: 2 }} />
                        </>
                    )}

                    {!showCreate && watchlists.length > 0 && (
                        <Button
                            startIcon={<AddIcon />}
                            onClick={() => setShowCreate(true)}
                            size="small"
                            sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                            Create New Watchlist
                        </Button>
                    )}

                    {(showCreate || watchlists.length === 0) && (
                        <Box sx={{ mt: watchlists.length === 0 ? 0 : 1 }}>
                            <Typography variant="overline" color="text.secondary" fontWeight={700}>
                                {watchlists.length === 0 ? 'Create first watchlist' : 'Create New Watchlist'}
                            </Typography>
                            <TextField
                                autoFocus
                                fullWidth
                                size="small"
                                placeholder="e.g. My Favorites"
                                value={newWatchlistName}
                                onChange={(e) => setNewWatchlistName(e.target.value)}
                                sx={{ mt: 1 }}
                            />
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} disabled={isSaving}>Cancel</Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={isSaving || (watchlists.length === 0 && !newWatchlistName.trim())}
                    startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
                    sx={{ borderRadius: '8px', px: 3 }}
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

