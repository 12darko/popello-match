import React from 'react';
import { Effect } from '../../types';

interface EffectsLayerProps {
    effects: Effect[];
}

export const EffectsLayer: React.FC<EffectsLayerProps> = ({ effects }) => {
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
                        className="absolute w-4 h-4 rounded-full animate-particle-out"
                        style={{
                            left: `${effect.x}%`,
                            top: `${effect.y}%`,
                            backgroundColor: effect.color || '#ffffff',
                            boxShadow: `0 0 8px ${effect.color || '#ffffff'}, 0 0 12px ${effect.color || '#ffffff'}`,
                            zIndex: 100,
                            '--tw-translate-x': `${effect.dx}px`,
                            '--tw-translate-y': `${effect.dy}px`
                        } as React.CSSProperties}
                    />
                );
            })}
        </div>
    );
};
