import { motion } from 'framer-motion';
import { useMemo } from 'react';

export function HeroTradingVisuals(): JSX.Element {
    // Generate random data points for the "chart"
    const points = useMemo(() => {
        const data = [];
        let y = 50;
        for (let i = 0; i < 20; i++) {
            y += Math.random() * 30 - 15; // Random walk
            data.push([i * 50, y]);
        }
        return data;
    }, []);

    const pathD = `M ${points.map((p) => `${p[0]},${p[1]}`).join(' L ')}`;

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        >
            {/* Ambient Background Glows - already in CSS but enhancing specific areas */}
            <div
                style={{
                    position: 'absolute',
                    top: '20%',
                    right: '10%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                }}
            />

            {/* Trading Chart SVG */}
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 1000 400"
                preserveAspectRatio="none"
                style={{
                    position: 'absolute',
                    bottom: 0,
                    opacity: 0.3,
                    transform: 'skewY(-5deg) translateY(100px)',
                }}
            >
                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* The Filled Area */}
                <motion.path
                    d={`${pathD} L 1000,400 L 0,400 Z`}
                    fill="url(#chartGradient)"
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                />

                {/* The Line Itself */}
                <motion.path
                    d={pathD}
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                />

                {/* Pulsing Dots at peaks */}
                {points.map((p, i) => (
                    i % 4 === 0 && ( /* Only some points */
                        <motion.circle
                            key={i}
                            cx={p[0]}
                            cy={p[1]}
                            r="4"
                            fill="#FFFFFF"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.1,
                            }}
                        />
                    )
                ))}
            </svg>

            {/* Floating Elements (Badges / Data Points) */}
            <FloatingBadge top="15%" left="15%" text="BTC +2.4%" delay={0} />
            <FloatingBadge top="25%" right="20%" text="ETH +1.8%" delay={1} />
            <FloatingBadge bottom="30%" left="20%" text="Order Executed" delay={2} color="#34D399" />
            <FloatingBadge bottom="40%" right="15%" text="AI Matching..." delay={3} color="#A78BFA" />

        </div>
    );
}

function FloatingBadge({ top, left, right, bottom, text, delay, color = '#60A5FA' }: any) {
    return (
        <motion.div
            style={{
                position: 'absolute',
                top, left, right, bottom,
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${color}40`,
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                color: color,
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: `0 4px 20px ${color}20`
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: [0, -10, 0],
            }}
            transition={{
                opacity: { duration: 0.5, delay },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay }
            }}
        >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
            {text}
        </motion.div>
    );
}
