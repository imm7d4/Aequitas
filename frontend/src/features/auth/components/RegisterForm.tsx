import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Link,
    Paper,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

export function RegisterForm(): JSX.Element {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [localError, setLocalError] = useState<string>('');
    const navigate = useNavigate();
    const { register, isLoading, error } = useAuth();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLocalError('');

        // Client-side validation
        if (!email || !password) {
            setLocalError('Email and password are required');
            return;
        }

        if (password.length < 8) {
            setLocalError('Password must be at least 8 characters');
            return;
        }

        try {
            await register(email, password);
            navigate('/login');
        } catch (err) {
            // Error handled by store
        }
    };

    const displayError = localError || error;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                bgcolor: 'background.default',
            }}
        >
            <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Register
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Create your Aequitas trading account
                </Typography>

                {displayError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {displayError}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                        required
                        helperText="Minimum 8 characters"
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isLoading}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </Button>
                </form>

                <Typography variant="body2" align="center">
                    Already have an account?{' '}
                    <Link href="/login" underline="hover">
                        Login
                    </Link>
                </Typography>
            </Paper>
        </Box>
    );
}
