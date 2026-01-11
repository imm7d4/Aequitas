import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import {
    ShoppingCart as BuyIcon,
    TrendingDown as SellIcon,
    ShowChart as ChartIcon,
    AddAlert as AlertIcon,
    Delete as DeleteIcon,
    Star as StarIcon,
    StarBorder as StarOutlineIcon,
} from '@mui/icons-material';

interface ContextMenuProps {
    anchorPosition: { top: number; left: number } | null;
    onClose: () => void;
    onBuy: () => void;
    onSell: () => void;
    onChart: () => void;
    onAlert: () => void;
    onRemove: () => void;
    onTogglePin?: () => void;
    isPinned?: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
    anchorPosition,
    onClose,
    onBuy,
    onSell,
    onChart,
    onAlert,
    onRemove,
    onTogglePin,
    isPinned,
}) => {
    const handleAction = (action: () => void) => {
        action();
        onClose();
    };

    return (
        <Menu
            open={Boolean(anchorPosition)}
            onClose={onClose}
            anchorReference="anchorPosition"
            anchorPosition={anchorPosition || undefined}
            slotProps={{
                paper: {
                    sx: {
                        minWidth: 180,
                        boxShadow: 3,
                    },
                },
            }}
        >
            <MenuItem onClick={() => handleAction(onBuy)}>
                <ListItemIcon>
                    <BuyIcon fontSize="small" color="success" />
                </ListItemIcon>
                <ListItemText>Buy</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleAction(onSell)}>
                <ListItemIcon>
                    <SellIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Sell</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleAction(onChart)}>
                <ListItemIcon>
                    <ChartIcon fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText>Open Chart</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleAction(onAlert)}>
                <ListItemIcon>
                    <AlertIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add Alert</ListItemText>
            </MenuItem>

            {onTogglePin && (
                <>
                    <Divider />
                    <MenuItem onClick={() => handleAction(onTogglePin)}>
                        <ListItemIcon>
                            {isPinned ? (
                                <StarIcon fontSize="small" color="primary" />
                            ) : (
                                <StarOutlineIcon fontSize="small" />
                            )}
                        </ListItemIcon>
                        <ListItemText>{isPinned ? 'Unpin' : 'Pin to Top'}</ListItemText>
                    </MenuItem>
                </>
            )}

            <Divider />
            <MenuItem onClick={() => handleAction(onRemove)}>
                <ListItemIcon>
                    <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Remove from Watchlist</ListItemText>
            </MenuItem>
        </Menu>
    );
};
