import React, { useMemo } from 'react';
import { Box, Typography, Stack, Alert, TablePagination, useTheme } from '@mui/material';
import { History as HistoryIcon } from '@mui/icons-material';
import { useFinanceSettings } from '../hooks/useFinanceSettings';
import { AccountBalance } from './AccountBalance';
import { FundingDialog } from './FundingDialog';
import { getTransactionColumns } from './TransactionColumns';
import { CustomGrid } from '../../../shared/components/CustomGrid';
import { Loader } from '../../../shared/components/Loader';

export const FinanceSettings: React.FC = () => {
    const theme = useTheme();
    const {
        account, transactions, trades, isLoading, isFunding, fundAmount, setFundAmount, message, setMessage,
        isFundingDialogOpen, setIsFundingDialogOpen, fundingStep, otpCode, setOtpCode, timer, page, setPage, rowsPerPage, setRowsPerPage,
        handleFund, handleVerifyOtp, handleCloseDialog
    } = useFinanceSettings();

    const columns = useMemo(() => getTransactionColumns(trades, theme), [trades, theme]);

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><Loader message="Fetching financial data..." /></Box>;
    }

    return (
        <Stack spacing={4}>
            {message && <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ borderRadius: 1.5 }}>{message.text}</Alert>}

            <AccountBalance 
                balance={account?.balance || 0} 
                currency={account?.currency || 'INR'} 
                onAddFunds={() => setIsFundingDialogOpen(true)} 
            />

            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <HistoryIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>Recent Transactions</Typography>
                </Box>

                <Box sx={{ position: 'relative' }}>
                    <CustomGrid<any>
                        columns={columns}
                        data={transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                    />
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={transactions.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(_, p) => setPage(p)}
                        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                        sx={{ borderTop: '1px solid', borderColor: 'divider' }}
                    />
                </Box>
            </Box>

            <FundingDialog
                open={isFundingDialogOpen}
                step={fundingStep}
                amount={fundAmount}
                otp={otpCode}
                isFunding={isFunding}
                timer={timer}
                onClose={handleCloseDialog}
                onAmountChange={setFundAmount}
                onOtpChange={setOtpCode}
                onFund={handleFund}
                onVerify={handleVerifyOtp}
                onResend={handleFund}
            />
        </Stack>
    );
};
