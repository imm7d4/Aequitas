import { Box } from '@mui/material';
import { InstrumentList } from '@/features/instruments/components/InstrumentList';

export function InstrumentsPage(): JSX.Element {
    return (
        <Box id="instrument-list-container">
            <InstrumentList />
        </Box>
    );
}
