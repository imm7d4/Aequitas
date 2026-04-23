import React from 'react';

const PsychologicalPitfalls: React.FC = () => {
    return (
        <>
            <section className="guide-section">
                <div className="section-header">
                    <span className="step-num">03</span>
                    <h2>Revenge Trading</h2>
                </div>
                <div className="glass-card danger">
                    <p>Trying to "win back" losses by taking bigger risks. Use the <strong>3-Strike Rule</strong>: After 2 consecutive losses, stop for the day.</p>
                </div>
            </section>

            <section className="guide-section align-right">
                <div className="section-header">
                    <span className="step-num">06</span>
                    <h2>FOMO & Chasing Pumps</h2>
                </div>
                <div className="glass-card danger">
                    <p>Fear Of Missing Out. Buying after a 20% pump often leads to buying the top. Wait for pullbacks to support levels instead.</p>
                </div>
            </section>
        </>
    );
};

export default PsychologicalPitfalls;
