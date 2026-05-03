import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { useTelemetry } from '@/shared/services/telemetry/TelemetryProvider';

export const useUserProfile = () => {
    const { user, logout } = useAuth();
    const { track } = useTelemetry();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);

    const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
        track({ event_name: 'profile.menu_opened', event_version: 'v1', classification: 'USER_ACTION' });
        setAnchorEl(e.currentTarget);
    };

    const handleMenuClose = () => setAnchorEl(null);

    const handleLogoutConfirm = async () => {
        setOpenLogoutConfirm(false);
        track({ event_name: 'profile.logout_clicked', event_version: 'v1', classification: 'USER_ACTION' });
        await logout();
    };

    return { user, anchorEl, openLogoutConfirm, setOpenLogoutConfirm, handleMenuOpen, handleMenuClose, handleLogoutConfirm, navigate };
};
