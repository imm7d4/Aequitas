import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

export const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '80vh',
                    textAlign: 'center',
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: { xs: '6rem', md: '10rem' },
                        fontWeight: 900,
                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        lineHeight: 1,
                        mb: 2,
                    }}
                >
                    404
                </Typography>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Oops! Page Not Found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: 500 }}>
                    The page you are looking for might have been removed, had its name changed,
                    or is temporarily unavailable. Let's get you back on track.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<HomeIcon />}
                    onClick={() => navigate('/dashboard')}
                    sx={{
                        borderRadius: '12px',
                        px: 4,
                        py: 1.5,
                        fontWeight: 700,
                        textTransform: 'none',
                        boxShadow: '0 8px 16px -4px rgba(25, 118, 210, 0.3)',
                        '&:hover': {
                            boxShadow: '0 12px 20px -4px rgba(25, 118, 210, 0.4)',
                        },
                    }}
                >
                    Back to Dashboard
                </Button>
            </Box>
        </Container>
    );
};
