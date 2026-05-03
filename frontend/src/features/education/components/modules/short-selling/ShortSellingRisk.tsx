import React from 'react';
import { RiskComparison } from './RiskComparison';
import { ShortSqueezeSection } from './ShortSqueezeSection';
import { RiskMitigation } from './RiskMitigation';

const ShortSellingRisk: React.FC = () => {
    return (
        <div className="tab-pane animate-in">
            <section className="guide-section">
                <h2>Understanding Unlimited Loss Potential</h2>
                <p className="large-text">The most critical concept in short selling: <strong>your maximum loss is theoretically unlimited</strong>.</p>

                <RiskComparison />
                <ShortSqueezeSection />

                <div className="glass-card darker">
                    <h3>The Aequitas "No Hedge" Constraint</h3>
                    <p>To ensure portfolio integrity, Aequitas prevents holding opposing views simultaneously.</p>
                    <div className="real-vs-fake-grid">
                        <div className="check-item fake">
                            <h4>❌ Active Long</h4>
                            <p>Cannot short if you own shares. Sell first.</p>
                        </div>
                        <div className="check-item fake">
                            <h4>❌ Active Short</h4>
                            <p>Cannot buy more than you own. Cover first.</p>
                        </div>
                    </div>
                </div>

                <RiskMitigation />

                <div className="glass-card">
                    <h3>Regulatory & Practical Constraints</h3>
                    <div className="constraint-list">
                        <div className="constraint-item"><h4>📋 SLB Pool</h4><p>Must borrow shares to short.</p></div>
                        <div className="constraint-item"><h4>💰 Borrowing Costs</h4><p>Incurs daily fees (0.01-0.05%).</p></div>
                        <div className="constraint-item"><h4>🛑 SEBI Bans</h4><p>Temporary bans possible during volatility.</p></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ShortSellingRisk;
