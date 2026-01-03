import { Box } from '@mui/material';
import { InstrumentList } from '@/features/instruments/components/InstrumentList';

export function InstrumentsPage(): JSX.Element {
    return (
        <Box sx={{ py: 2 }}>
            <InstrumentList />
        </Box>
    );
}
