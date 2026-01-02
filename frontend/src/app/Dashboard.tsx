import { Box, Typography, Button, Container, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { MarketStatusBadge } from '@/features/market/components/MarketStatusBadge';

export function Dashboard(): JSX.Element {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = (): void => {
        logout();
        navigate('/login');
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Typography variant="h3">
                        Dashboard
                    </Typography>
                    <MarketStatusBadge />
                </Stack>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    Welcome, {user?.email}!
                </Typography>

                <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Quick Actions
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/instruments')}
                        sx={{ mr: 2 }}
                    >
                        View Instruments
                    </Button>
                    {user?.isAdmin && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => navigate('/admin')}
                            sx={{ mr: 2 }}
                        >
                            Admin Panel
                        </Button>
                    )}
                    <Button variant="outlined" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>

                <Typography variant="body2" color="text.secondary">
                    Your trading account has been created successfully.
                </Typography>
            </Box>
        </Container>
    );
}
