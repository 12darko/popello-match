import React from 'react';
import { PowerUpType } from '../types';
import { POWERUP_CONFIG } from '../constants';

interface PowerUpProps {
    type: PowerUpType;
    row: number;
    col: number;
    direction?: 'HORIZONTAL' | 'VERTICAL';
    onClick?: () => void;
    size?: number;
}

export const PowerUp: React.FC<PowerUpProps> = ({
    type,
    row,
    col,
    direction,
    onClick,
    size = 100
}) => {
    const config = POWERUP_CONFIG[type];
    const Icon = config.icon;

    return (
        <div
            className={`
        absolute w-full h-full rounded-xl
        bg-gradient-to-br ${config.gradient}
        border-4 border-white
        shadow-[0_0_20px_rgba(255,255,255,0.5)]
        animate-pulse-slow
        cursor-pointer
        hover:scale-110
        active:scale-95
        transition-all
        duration-200
        z-10
      `}
            onClick={onClick}
            style={{
                animation: 'powerup-glow 2s ease-in-out infinite'
            }}
        >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-white/20 rounded-xl animate-shimmer" />

            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
                <Icon
                    className={`w-3/4 h-3/4 ${config.textColor} drop-shadow-lg`}
                    style={{
                        transform: direction === 'HORIZONTAL' ? 'rotate(90deg)' : 'rotate(0deg)',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
                    }}
                />
            </div>

            {/* Sparkle particles */}
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full opacity-70"
                    style={{
                        top: `${20 + i * 30}%`,
                        left: `${10 + i * 35}%`,
                        animation: `sparkle ${1 + i * 0.3}s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`
                    }}
                />
            ))}
        </div>
    );
};

// Inline styles for animations (add to index.css later)
const styles = `
@keyframes powerup-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.5);
  }
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) skewX(-15deg);
  }
  100% {
    transform: translateX(200%) skewX(-15deg);
  }
}
`;
