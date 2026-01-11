import { useState } from 'react';
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
    IconButton,
} from '@mui/material';
import { DragIndicator as DragIcon } from '@mui/icons-material';

interface ColumnSettingsProps {
    open: boolean;
    onClose: () => void;
    availableColumns: { id: string; label: string; required?: boolean }[];
    visibleColumns: string[];
    columnOrder: string[];
    onSave: (visible: string[], order: string[]) => void;
}

export const ColumnSettings: React.FC<ColumnSettingsProps> = ({
    open,
    onClose,
    availableColumns,
    visibleColumns,
    columnOrder,
    onSave,
}) => {
    const [localVisible, setLocalVisible] = useState<string[]>(visibleColumns);
    const [localOrder, setLocalOrder] = useState<string[]>(columnOrder);

    const handleToggle = (columnId: string) => {
        const column = availableColumns.find(c => c.id === columnId);
        if (column?.required) return; // Can't toggle required columns

        setLocalVisible(prev =>
            prev.includes(columnId)
                ? prev.filter(id => id !== columnId)
                : [...prev, columnId]
        );
    };

    const handleSave = () => {
        onSave(localVisible, localOrder);
        onClose();
    };

    const handleReset = () => {
        const defaultVisible = availableColumns.map(c => c.id);
        const defaultOrder = availableColumns.map(c => c.id);
        setLocalVisible(defaultVisible);
        setLocalOrder(defaultOrder);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Customize Columns</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Select which columns to display. Required columns cannot be hidden.
                </Typography>

                <FormGroup>
                    {availableColumns.map((column) => (
                        <FormControlLabel
                            key={column.id}
                            control={
                                <Checkbox
                                    checked={localVisible.includes(column.id)}
                                    onChange={() => handleToggle(column.id)}
                                    disabled={column.required}
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <IconButton size="small" disabled sx={{ cursor: 'grab' }}>
                                        <DragIcon fontSize="small" />
                                    </IconButton>
                                    <Typography variant="body2">
                                        {column.label}
                                        {column.required && (
                                            <Typography
                                                component="span"
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ ml: 1 }}
                                            >
                                                (Required)
                                            </Typography>
                                        )}
                                    </Typography>
                                </Box>
                            }
                        />
                    ))}
                </FormGroup>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleReset} color="inherit">
                    Reset to Default
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};
