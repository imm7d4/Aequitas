import { useState, useEffect } from 'react';
import { accountService, TradingAccount, Transaction } from '../services/accountService';
import { tradeService, Trade as TradeModel } from '../../trading/services/tradeService';

export const useFinanceSettings = () => {
    const [account, setAccount] = useState<TradingAccount | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [trades, setTrades] = useState<Record<string, TradeModel>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isFunding, setIsFunding] = useState(false);
    const [fundAmount, setFundAmount] = useState('10000');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isFundingDialogOpen, setIsFundingDialogOpen] = useState(false);
    const [fundingStep, setFundingStep] = useState<'amount' | 'otp'>('amount');
    const [otpCode, setOtpCode] = useState('');
    const [pendingTransactionId, setPendingTransactionId] = useState<string | null>(null);
    const [timer, setTimer] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchData = async () => {
        try {
            const [acc, txs, userTrades] = await Promise.all([
                accountService.getBalance(), accountService.getTransactions(), tradeService.getTrades(),
            ]);
            setAccount(acc);
            setTransactions(txs || []);
            const tradeMap: Record<string, TradeModel> = {};
            if (userTrades) userTrades.forEach(t => tradeMap[t.tradeId] = t);
            setTrades(tradeMap);
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to load financial data' });
        } finally { setIsLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);
    useEffect(() => {
        let interval: any;
        if (timer > 0) interval = setInterval(() => setTimer(t => t - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleFund = async () => {
        const amount = parseFloat(fundAmount);
        if (isNaN(amount) || amount <= 0) return setMessage({ type: 'error', text: 'Invalid amount' });
        setIsFunding(true);
        try {
            const { transactionId } = await accountService.initiateDeposit(amount);
            setPendingTransactionId(transactionId);
            setFundingStep('otp');
            setTimer(60);
            setMessage({ type: 'success', text: 'OTP sent to email.' });
        } catch (err: any) { setMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to initiate' }); }
        finally { setIsFunding(false); }
    };

    const handleVerifyOtp = async () => {
        if (!otpCode || !pendingTransactionId) return;
        setIsFunding(true);
        try {
            const updatedAccount = await accountService.completeDeposit(pendingTransactionId, otpCode);
            setAccount(updatedAccount);
            const updatedTxs = await accountService.getTransactions();
            setTransactions(updatedTxs || []);
            setMessage({ type: 'success', text: 'Funds added!' });
            handleCloseDialog();
        } catch (err: any) { setMessage({ type: 'error', text: err?.response?.data?.message || 'Invalid OTP' }); }
        finally { setIsFunding(false); }
    };

    const handleCloseDialog = () => {
        setIsFundingDialogOpen(false); setFundingStep('amount'); setOtpCode(''); setPendingTransactionId(null);
    };

    return {
        account, transactions, trades, isLoading, isFunding, fundAmount, setFundAmount, message, setMessage,
        isFundingDialogOpen, setIsFundingDialogOpen, fundingStep, otpCode, setOtpCode, timer, page, setPage, rowsPerPage, setRowsPerPage,
        handleFund, handleVerifyOtp, handleCloseDialog
    };
};
