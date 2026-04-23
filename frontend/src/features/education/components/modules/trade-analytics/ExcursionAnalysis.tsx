import React from 'react';

const ExcursionAnalysis: React.FC = () => {
    return (
        <>
            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">02</span>
                    <h2>MAE & MFE</h2>
                </div>
                <div className="glass-card darker">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <h4>MAE (Adverse)</h4>
                            <p>Worst drawdown experienced. Reveals entry timing quality.</p>
                        </div>
                        <div>
                            <h4>MFE (Favorable)</h4>
                            <p>Best unrealized profit reached. Reveals exit efficiency.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ExcursionAnalysis;
