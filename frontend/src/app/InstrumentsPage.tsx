import { Container, Box } from '@mui/material';
import { InstrumentList } from '@/features/instruments/components/InstrumentList';
import { MarketStatusBadge } from '@/features/market/components/MarketStatusBadge';

export function InstrumentsPage(): JSX.Element {
    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <MarketStatusBadge />
            </Box>
            <InstrumentList />
        </Container>
    );
}
