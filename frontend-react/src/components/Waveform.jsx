import React from 'react';

export default function Waveform({ color = '#00E5FF', height = '40px', barCount = 20 }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '3px',
            height: height,
            padding: '0 10px'
        }}>
            {[...Array(barCount)].map((_, i) => (
                <div
                    key={i}
                    style={{
                        width: '3px',
                        backgroundColor: color,
                        borderRadius: '10px',
                        animation: `waveform-pulse 1s ease-in-out infinite`,
                        animationDelay: `${i * 0.05}s`,
                        boxShadow: `0 0 10px ${color}`
                    }}
                />
            ))}
            <style>{`
        @keyframes waveform-pulse {
          0%, 100% { height: 10%; opacity: 0.3; }
          50% { height: 100%; opacity: 1; }
        }
      `}</style>
        </div>
    );
}
