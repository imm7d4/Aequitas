import React, { useMemo } from 'react';
import { useTheme } from '@mui/material';
import { TradeResult } from '../services/analyticsService';
import { CustomGrid } from '../../../shared/components/CustomGrid';
import { TradeExpansionContent } from './TradeExpansionContent';
import { getTradeDiagnosticsColumns } from './TradeDiagnosticsColumns';

interface TradeDiagnosticsLogProps {
    trades: TradeResult[];
}

export const TradeDiagnosticsLog: React.FC<TradeDiagnosticsLogProps> = ({ trades }) => {
    const theme = useTheme();

    const columns = useMemo(() => getTradeDiagnosticsColumns(theme), [theme]);

    const gridData = useMemo(() => 
        (trades || []).map(t => ({ ...t, id: t.id || `${t.symbol}-${t.exitTime}` })),
    [trades]);

    return (
        <CustomGrid<any>
            columns={columns}
            data={gridData}
            renderExpansion={(row) => <TradeExpansionContent trade={row} />}
            isLoading={false}
        />
    );
};
