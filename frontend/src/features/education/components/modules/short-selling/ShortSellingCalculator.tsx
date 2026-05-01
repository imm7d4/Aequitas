import React, { useState, useMemo } from 'react';

const ShortSellingCalculator: React.FC = () => {
    const [calcQuantity, setCalcQuantity] = useState(100);
    const [calcEntryPrice, setCalcEntryPrice] = useState(500);
    const [calcCurrentPrice, setCalcCurrentPrice] = useState(480);
    const [calcAccountBalance, setCalcAccountBalance] = useState(100000);

    const marginCalc = useMemo(() => {
        const positionValue = calcQuantity * calcEntryPrice;
        const requiredMargin = positionValue * 0.20; // 20% margin requirement
        const currentLiability = calcQuantity * calcCurrentPrice;
        const unrealizedPL = (calcEntryPrice - calcCurrentPrice) * calcQuantity;
        const availableCash = calcAccountBalance - requiredMargin;
        const totalEquity = calcAccountBalance + unrealizedPL;
        const marginRatio = totalEquity / requiredMargin;

        let marginStatus = 'OK';
        if (marginRatio < 0.5) marginStatus = 'CRITICAL';
        else if (marginRatio < 1.0) marginStatus = 'WARNING';

        return {
            positionValue,
            requiredMargin,
            currentLiability,
            unrealizedPL,
            availableCash,
            totalEquity,
            marginRatio,
            marginStatus
        };
    }, [calcQuantity, calcEntryPrice, calcCurrentPrice, calcAccountBalance]);

    return (
        <div className="tab-pane animate-in">
            <section className="guide-section">
                <h2>📊 Interactive Short Selling Margin Calculator</h2>
                <p>Calculate margin requirements, P&L, and margin ratios for short positions in real-time</p>

                <div className="calculator-container">
                    <div className="calc-inputs">
                        <div className="input-group">
                            <label>Quantity (shares)</label>
                            <input
                                type="number"
                                value={calcQuantity}
                                onChange={(e) => setCalcQuantity(Number(e.target.value))}
                                min="1"
                            />
                        </div>

                        <div className="input-group">
                            <label>Entry Price (₹)</label>
                            <input
                                type="number"
                                value={calcEntryPrice}
                                onChange={(e) => setCalcEntryPrice(Number(e.target.value))}
                                min="0"
                                step="0.05"
                            />
                        </div>

                        <div className="input-group">
                            <label>Current Price (₹)</label>
                            <input
                                type="number"
                                value={calcCurrentPrice}
                                onChange={(e) => setCalcCurrentPrice(Number(e.target.value))}
                                min="0"
                                step="0.05"
                            />
                        </div>

                        <div className="input-group">
                            <label>Account Balance (₹)</label>
                            <input
                                type="number"
                                value={calcAccountBalance}
                                onChange={(e) => setCalcAccountBalance(Number(e.target.value))}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="calc-results">
                        <h3>Position Details</h3>
                        <div className="result-row">
                            <span>Position Value</span>
                            <span className="value">₹{marginCalc.positionValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="result-row highlight">
                            <span>Required Margin (20%)</span>
                            <span className="value">₹{marginCalc.requiredMargin.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="result-row">
                            <span>Current Liability</span>
                            <span className="value">₹{marginCalc.currentLiability.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                        </div>

                        <h3 style={{ marginTop: '2rem' }}>P&L Analysis</h3>
                        <div className={`result-row ${marginCalc.unrealizedPL >= 0 ? 'success' : 'danger'}`}>
                            <span>Unrealized P&L</span>
                            <span className="value">
                                {marginCalc.unrealizedPL >= 0 ? '+' : ''}₹{marginCalc.unrealizedPL.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="result-row">
                            <span>ROI on Margin</span>
                            <span className="value">
                                {((marginCalc.unrealizedPL / marginCalc.requiredMargin) * 100).toFixed(2)}%
                            </span>
                        </div>

                        <h3 style={{ marginTop: '2rem' }}>Margin Status</h3>
                        <div className="result-row">
                            <span>Available Cash</span>
                            <span className="value">₹{marginCalc.availableCash.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="result-row">
                            <span>Total Equity</span>
                            <span className="value">₹{marginCalc.totalEquity.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className={`result-row total ${marginCalc.marginStatus === 'CRITICAL' ? 'danger' : marginCalc.marginStatus === 'WARNING' ? 'warning' : ''}`}>
                            <span><strong>Margin Ratio</strong></span>
                            <span className="value"><strong>{marginCalc.marginRatio.toFixed(2)}</strong></span>
                        </div>
                        <div className="result-row">
                            <span><strong>Status</strong></span>
                            <span className="value">
                                <span className={`status-badge ${marginCalc.marginStatus === 'OK' ? 'filled' : marginCalc.marginStatus === 'WARNING' ? 'pending' : 'cancelled'}`}>
                                    {marginCalc.marginStatus}
                                </span>
                            </span>
                        </div>

                        {marginCalc.marginStatus === 'WARNING' && (
                            <div className="info-box warning">
                                ⚠️ <strong>WARNING:</strong> Your equity has dropped below the initial margin requirement. Consider adding funds or closing the position to avoid critical margin call.
                            </div>
                        )}

                        {marginCalc.marginStatus === 'CRITICAL' && (
                            <div className="info-box danger">
                                🚨 <strong>CRITICAL MARGIN CALL:</strong> Your equity is less than 50% of the margin requirement! Immediate action required.
                            </div>
                        )}
                    </div>
                </div>

                <div className="calculator-scenarios">
                    <h3>Quick Scenarios to Try</h3>
                    <div className="scenario-buttons">
                        <button className="scenario-btn success" onClick={() => { setCalcQuantity(100); setCalcEntryPrice(500); setCalcCurrentPrice(450); setCalcAccountBalance(100000); }}>📈 Profitable Short</button>
                        <button className="scenario-btn warning" onClick={() => { setCalcQuantity(100); setCalcEntryPrice(500); setCalcCurrentPrice(550); setCalcAccountBalance(100000); }}>📉 Small Loss</button>
                        <button className="scenario-btn danger" onClick={() => { setCalcQuantity(100); setCalcEntryPrice(500); setCalcCurrentPrice(650); setCalcAccountBalance(100000); }}>🚨 Margin Call</button>
                        <button className="scenario-btn danger" onClick={() => { setCalcQuantity(100); setCalcEntryPrice(500); setCalcCurrentPrice(900); setCalcAccountBalance(100000); }}>💥 Short Squeeze</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ShortSellingCalculator;
