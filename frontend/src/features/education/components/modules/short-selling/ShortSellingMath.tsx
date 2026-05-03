import React from 'react';
import { ProfitableExample, LossExample, PartialCoverExample } from './ShortSellingExamples';
import { ShortSellingEquityTable } from './ShortSellingEquityTable';

const ShortSellingMath: React.FC = () => {
    return (
        <div className="tab-pane animate-in">
            <section className="guide-section">
                <h2>The Equity Inversion Rule</h2>
                <p className="large-text">
                    P&L for a short position is calculated as: <code>(EntryPrice - CurrentPrice) × Quantity</code>. 
                    Notice the inversion—lower price equals higher profit.
                </p>

                <div className="formula-block">
                    <h3>Short Position P&L Formula</h3>
                    <p className="math">Unrealized P&L = (Entry Price - Current Price) × Quantity</p>
                    <p className="math">If Current Price &lt; Entry Price → Profit (Positive P&L)</p>
                    <p className="math">If Current Price &gt; Entry Price → Loss (Negative P&L)</p>
                </div>

                <ProfitableExample />
                <LossExample />
                <PartialCoverExample />
                <ShortSellingEquityTable />
            </section>
        </div>
    );
};

export default ShortSellingMath;
