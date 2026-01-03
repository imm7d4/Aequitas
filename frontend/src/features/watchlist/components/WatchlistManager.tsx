import React, { useEffect, useState, useCallback } from 'react';
import {
    Box,
    Tabs,
    Tab,
    IconButton,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    Add as AddIcon,
    MoreVert as MoreVertIcon,
    Delete as DeleteIcon,
    Star as StarIcon,
} from '@mui/icons-material';
import { useWatchlistStore } from '../store/watchlistStore';
import { watchlistService } from '../services/watchlistService';

export const WatchlistManager: React.FC = () => {
    const watchlists = useWatchlistStore(s => s.watchlists);
    const activeWatchlistId = useWatchlistStore(s => s.activeWatchlistId);
    const setActiveWatchlistId = useWatchlistStore(s => s.setActiveWatchlistId);
    const fetchWatchlists = useWatchlistStore(s => s.fetchWatchlists);

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newWatchlistName, setNewWatchlistName] = useState('');
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedWatchlistId, setSelectedWatchlistId] = useState<string | null>(null);

    useEffect(() => {
        fetchWatchlists();
    }, [fetchWatchlists]);

    const handleCreateWatchlist = useCallback(async () => {
        if (!newWatchlistName.trim()) return;
        try {
            await watchlistService.createWatchlist({ name: newWatchlistName });
            setNewWatchlistName('');
            setIsCreateDialogOpen(false);
            await fetchWatchlists();
        } catch (err) {
            console.error('Failed to create watchlist', err);
        }
    }, [newWatchlistName, fetchWatchlists]);

    const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>, id: string) => {
        setMenuAnchorEl(event.currentTarget);
        setSelectedWatchlistId(id);
    }, []);

    const handleMenuClose = useCallback(() => {
        setMenuAnchorEl(null);
        setSelectedWatchlistId(null);
    }, []);

    const handleDelete = useCallback(async () => {
        if (!selectedWatchlistId) return;
        try {
            await watchlistService.deleteWatchlist(selectedWatchlistId);
            await fetchWatchlists();
        } catch (err) {
            console.error('Failed to delete watchlist', err);
        }
        handleMenuClose();
    }, [selectedWatchlistId, fetchWatchlists, handleMenuClose]);

    const handleSetDefault = useCallback(async () => {
        if (!selectedWatchlistId) return;
        try {
            await watchlistService.setDefaultWatchlist(selectedWatchlistId);
            await fetchWatchlists();
        } catch (err) {
            console.error('Failed to set default watchlist', err);
        }
        handleMenuClose();
    }, [selectedWatchlistId, fetchWatchlists, handleMenuClose]);

    // Value can be null, MUI Tabs handles this by showing no selection
    const tabsValue = activeWatchlistId || false;

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', bgcolor: 'background.paper' }}>
            <Tabs
                value={tabsValue}
                onChange={(_, newValue) => newValue && setActiveWatchlistId(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ flexGrow: 1 }}
            >
                {watchlists.map((w) => (
                    <Tab
                        key={w.id}
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {w.isDefault && <StarIcon sx={{ fontSize: 'small', mr: 0.5, color: 'primary.main' }} />}
                                <Typography variant="body2">{w.name}</Typography>
                                <IconButton
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleMenuOpen(e, w.id);
                                    }}
                                    sx={{ ml: 1, p: 0.5 }}
                                >
                                    <MoreVertIcon sx={{ fontSize: '1rem' }} />
                                </IconButton>
                            </Box>
                        }
                        value={w.id}
                    />
                ))}
            </Tabs>
            <IconButton color="primary" onClick={() => setIsCreateDialogOpen(true)} sx={{ ml: 1, mr: 1 }}>
                <AddIcon />
            </IconButton>

            <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)}>
                <DialogTitle>Create New Watchlist</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Watchlist Name"
                        fullWidth
                        variant="outlined"
                        value={newWatchlistName}
                        onChange={(e) => setNewWatchlistName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateWatchlist} variant="contained" disabled={!newWatchlistName.trim()}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleSetDefault}>
                    <ListItemIcon><StarIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Set as Default</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    );
};
