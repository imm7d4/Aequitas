import React from 'react';

const ExecutionAndPlanning: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">05</span>
                    <h2>Ignoring Slippage</h2>
                </div>
                <div className="glass-card">
                    <p>Market orders in illiquid stocks cause slippage. Use <strong>Limit Orders</strong> to control your price and protect your capital.</p>
                </div>
            </section>

            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">08</span>
                    <h2>Trading Without a Plan</h2>
                </div>
                <div className="glass-card darker">
                    <p>Every trade needs Entry, SL, Target, and Position Size <strong>BEFORE</strong> entry. If you don't have a plan, you're gambling.</p>
                </div>
            </section>

            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">10</span>
                    <h2>No Trading Journal</h2>
                </div>
                <div className="glass-card">
                    <p>Without a journal, you repeat the same mistakes. Record Date, Symbol, Entry/Exit, Reasoning, and Lessons Learned.</p>
                </div>
            </section>
        </>
    );
};

export default ExecutionAndPlanning;
