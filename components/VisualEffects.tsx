import React from 'react';
import { Effect } from '../types';

export const EffectsLayer: React.FC<{ effects: Effect[] }> = ({ effects }) => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
            {effects.map(effect => {
                if (effect.type === 'TEXT') {
                    return (
                        <div key={effect.id}
                            className="absolute font-black text-xl text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] animate-float-up z-50"
                            style={{ left: `${effect.x}%`, top: `${effect.y}%` }}
                        >
                            {effect.content}
                        </div>
                    );
                }
                // Particles
                return (
                    <div key={effect.id}
                        className={`absolute w-3 h-3 rounded-full ${effect.color} animate-particle-out z-40`}
                        style={{
                            left: `${effect.x}%`,
                            top: `${effect.y}%`,
                            '--tw-translate-x': `${effect.dx}px`,
                            '--tw-translate-y': `${effect.dy}px`
                        } as React.CSSProperties}
                    />
                );
            })}
        </div>
    );
};

export const DynamicBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
            {/* Moving Blobs */}
            <div className="absolute top-0 left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
            <div className="absolute top-0 right-[-10%] w-96 h-96 bg-yellow-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" style={{ animationDelay: '2s' }} />
            <div className="absolute -bottom-8 left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" style={{ animationDelay: '4s' }} />

            {/* Fireflies */}
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_4px_white]"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `110%`,
                        animation: `firefly ${10 + Math.random() * 15}s linear infinite`,
                        animationDelay: `${Math.random() * 15}s`,
                        opacity: 0
                    }}
                />
            ))}
        </div>
    );
};

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
