import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Alert
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';

export function AdminPanel() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user?.isAdmin) {
        return (
            <Container maxWidth="md" sx={{ mt: 8 }}>
                <Alert severity="error">
                    Access Denied: You do not have administrator privileges.
                </Alert>
                <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
                    Return to Dashboard
                </Button>
            </Container>
        );
    }

    const adminActions = [
        {
            title: 'Add Instrument',
            description: 'Create a new tradable stock or asset.',
            icon: <AddCircleOutlineIcon sx={{ fontSize: 40 }} />,
            action: () => navigate('/admin/instruments/new')
        },
        {
            title: 'Manage Hours',
            description: 'Configure weekly trading hours for all exchanges.',
            icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
            action: () => navigate('/admin/manage-hours')
        },
        {
            title: 'Market Holidays',
            description: 'Add or remove trading holidays.',
            icon: <EventIcon sx={{ fontSize: 40 }} />,
            action: () => navigate('/admin/market-holidays')
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <AdminPanelSettingsIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Typography variant="h3">
                    Admin Control Panel
                </Typography>
            </Box>

            <Alert severity="info" sx={{ mb: 4 }}>
                Welcome, Admin! Here you can manage the platform foundation.
            </Alert>

            <Grid container spacing={4}>
                {adminActions.map((action, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 4 } }}>
                            <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 4 }}>
                                <Box sx={{ mb: 2, color: 'primary.main' }}>
                                    {action.icon}
                                </Box>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {action.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {action.description}
                                </Typography>
                            </CardContent>
                            <Box sx={{ p: 2, pt: 0 }}>
                                <Button fullWidth variant="contained" onClick={action.action}>
                                    Manage
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 4 }}>
                <Button variant="outlined" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </Button>
            </Box>
        </Container>
    );
}
