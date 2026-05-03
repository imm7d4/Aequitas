import React from 'react';

export const PrioritySection: React.FC = () => (
    <section className="guide-section">
        <div className="section-header"><span className="step-num">05</span><h2>Price-Time Priority</h2></div>
        <div className="glass-card darker">
            <h3>The Two Rules</h3>
            <ol>
                <li><strong>Rule 1: Price Priority</strong> - Best prices always fill first.</li>
                <li><strong>Rule 2: Time Priority</strong> - Earliest order fills first (FIFO).</li>
            </ol>
        </div>
    </section>
);

export const SlippageSection: React.FC = () => (
    <section className="guide-section align-right">
        <div className="section-header"><span className="step-num">06</span><h2>Market Impact & Slippage</h2></div>
        <div className="glass-card danger">
            <h3>Walking Up the Book</h3>
            <p>Large market orders "walk through" multiple price levels, getting progressively worse prices.</p>
        </div>
    </section>
);

export const ImbalanceSection: React.FC = () => (
    <section className="guide-section">
        <div className="section-header"><span className="step-num">07</span><h2>Order Book Imbalances</h2></div>
        <p>Comparing bid vs ask depth can predict short-term price direction.</p>
    </section>
);
