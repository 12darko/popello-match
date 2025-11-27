import React from 'react';

export const Confetti: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {[...Array(50)].map((_, i) => (
                <div key={i}
                    className="absolute w-3 h-3 rounded-sm animate-fall"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `-10%`,
                        backgroundColor: ['#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'][Math.floor(Math.random() * 5)],
                        animationDuration: `${2 + Math.random() * 3}s`,
                        animationDelay: `${Math.random() * 2}s`,
                    }}
                />
            ))}
        </div>
    );
};
