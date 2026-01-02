import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';

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
                <Typography variant="h3" gutterBottom>
                    Dashboard
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Welcome, {user?.email}!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Your trading account has been created successfully.
                </Typography>
                <Button variant="outlined" onClick={handleLogout}>
                    Logout
                </Button>
            </Box>
        </Container>
    );
}
