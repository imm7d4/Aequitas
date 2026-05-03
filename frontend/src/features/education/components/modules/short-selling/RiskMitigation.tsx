import React from 'react';

export const RiskMitigation: React.FC = () => (
    <div className="example-box">
        <h3>Risk Mitigation Strategies</h3>
        <div className="strategy-grid">
            <div className="strategy-card"><h4>1. Stop-Losses</h4><p>Set 5-8% above entry. Use STOP or TRAILING_STOP.</p></div>
            <div className="strategy-card"><h4>2. Position Sizing</h4><p>Max 20% of capital to shorts.</p></div>
            <div className="strategy-card"><h4>3. Entries</h4><p>Short exhausted trends (RSI &gt; 70) or support breaks.</p></div>
            <div className="strategy-card"><h4>4. Margin</h4><p>Monitor ratio. Action required if &lt; 1.0.</p></div>
            <div className="strategy-card"><h4>5. Profit Taking</h4><p>Use partial covers (lock in at 5%, 10%).</p></div>
            <div className="strategy-card"><h4>6. Overnight Risk</h4><p>Close before earnings or major RBI/Budget news.</p></div>
        </div>
    </div>
);
