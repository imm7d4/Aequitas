import React from 'react';

export const ShortSellingEquityTable: React.FC = () => (
    <div className="balance-sheet-visual">
        <h3>Equity Calculation at Different Price Points</h3>
        <p>Example: Short 100 shares @ ₹500, Account Balance: ₹1,00,000</p>
        <table className="price-equity-table">
            <thead>
                <tr>
                    <th>Current Price</th>
                    <th>Unrealized P&L</th>
                    <th>Total Equity</th>
                    <th>Margin Ratio</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                <tr className="success-row"><td>₹400</td><td>+₹10,000</td><td>₹1,10,000</td><td>11.0</td><td><span className="status-badge filled">OK</span></td></tr>
                <tr className="success-row"><td>₹450</td><td>+₹5,000</td><td>₹1,05,000</td><td>10.5</td><td><span className="status-badge filled">OK</span></td></tr>
                <tr><td>₹500</td><td>₹0</td><td>₹1,00,000</td><td>10.0</td><td><span className="status-badge filled">OK</span></td></tr>
                <tr className="warning-row"><td>₹550</td><td>-₹5,000</td><td>₹95,000</td><td>9.5</td><td><span className="status-badge filled">OK</span></td></tr>
                <tr className="warning-row"><td>₹600</td><td>-₹10,000</td><td>₹90,000</td><td>9.0</td><td><span className="status-badge pending">WARNING</span></td></tr>
                <tr className="danger-row"><td>₹700</td><td>-₹20,000</td><td>₹80,000</td><td>8.0</td><td><span className="status-badge pending">WARNING</span></td></tr>
                <tr className="danger-row"><td>₹950</td><td>-₹45,000</td><td>₹55,000</td><td>5.5</td><td><span className="status-badge cancelled">CRITICAL</span></td></tr>
            </tbody>
        </table>
        <div className="info-box logic">
            <strong>Note:</strong> Margin requirement is ₹10,000 (20% of ₹50,000 position). WARNING triggers when equity &lt; margin (ratio &lt; 1.0). CRITICAL triggers when equity &lt; 50% of margin (ratio &lt; 0.5).
        </div>
    </div>
);
