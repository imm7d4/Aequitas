import React from 'react';

const OrderDiagnosticGuide: React.FC = () => {
    return (
        <section className="guide-section align-right">
            <div className="section-header">
                <span className="step-num">10</span>
                <h2>Diagnostic Flowchart</h2>
            </div>

            <div className="glass-card darker">
                <h3>🔍 Step-by-Step Troubleshooting</h3>
                <div style={{ marginTop: '1.5rem' }}>
                    <div className="diagnostic-step">
                        <p><strong>Step 1: Check Order Status</strong></p>
                        <ul>
                            <li>PENDING, FILLED, PARTIALLY_FILLED, CANCELED, REJECTED.</li>
                        </ul>
                    </div>
                    <div className="diagnostic-step">
                        <p><strong>Step 2: If REJECTED</strong></p>
                        <ul>
                            <li>Funds? Lot size? Circuit limits?</li>
                        </ul>
                    </div>
                    <div className="diagnostic-step">
                        <p><strong>Step 3: If PENDING</strong></p>
                        <ul>
                            <li>Price reached? Market open? Halted?</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderDiagnosticGuide;
