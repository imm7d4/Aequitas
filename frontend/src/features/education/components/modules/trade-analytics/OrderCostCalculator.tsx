import React, { useState } from 'react';

const OrderCostCalculator: React.FC = () => {
    const [calcQuantity, setCalcQuantity] = useState(100);
    const [calcPrice, setCalcPrice] = useState(500);
    const [calcOrderType, setCalcOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');

    const calculateOrderCost = () => {
        const baseValue = calcQuantity * calcPrice;
        const buffer = calcOrderType === 'MARKET' ? baseValue * 0.01 : 0;
        const commission = Math.min(baseValue * 0.0003, 20); // 0.03% or ₹20 cap
        const total = baseValue + buffer + commission;

        return { baseValue, buffer, commission, total };
    };

    const costs = calculateOrderCost();

    return (
        <div className="tab-pane animate-in">
            <section className="guide-section">
                <h2>📊 Interactive Order Cost Calculator</h2>
                <div className="calculator-container">
                    <div className="calc-inputs">
                        <div className="input-group">
                            <label>Order Type</label>
                            <select value={calcOrderType} onChange={(e) => setCalcOrderType(e.target.value as 'MARKET' | 'LIMIT')}>
                                <option value="MARKET">Market Order</option>
                                <option value="LIMIT">Limit Order</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Quantity</label>
                            <input type="number" value={calcQuantity} onChange={(e) => setCalcQuantity(Number(e.target.value))} min="1" />
                        </div>
                        <div className="input-group">
                            <label>Price (₹)</label>
                            <input type="number" value={calcPrice} onChange={(e) => setCalcPrice(Number(e.target.value))} min="0" step="0.05" />
                        </div>
                    </div>

                    <div className="calc-results">
                        <h3>Cost Breakdown</h3>
                        <div className="result-row">
                            <span>Base Value</span>
                            <span className="value">₹{costs.baseValue.toLocaleString('en-IN')}</span>
                        </div>
                        {calcOrderType === 'MARKET' && (
                            <div className="result-row highlight">
                                <span>Market Buffer (1%)</span>
                                <span className="value">₹{costs.buffer.toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        <div className="result-row">
                            <span>Commission</span>
                            <span className="value">₹{costs.commission.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="result-row total">
                            <span><strong>Total Required</strong></span>
                            <span className="value"><strong>₹{costs.total.toLocaleString('en-IN')}</strong></span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OrderCostCalculator;
