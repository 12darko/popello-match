import React, { useEffect, useState } from 'react';
import { ComboData } from '../types';
import { COMBO_CONFIG } from '../constants';

interface ComboCounterProps {
    combo: ComboData;
    t: (key: string) => string;
}

export const ComboCounter: React.FC<ComboCounterProps> = ({ combo, t }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        // FIX: Only show combo when level is 2+ (not at start when it's 0 or first match when it's 1)
        if (combo.level >= 2) {
            setIsVisible(true);
            setScale(1.2);

            const scaleTimer = setTimeout(() => setScale(1), 200);

            // NEW: Auto-hide after 2 seconds
            const hideTimer = setTimeout(() => setIsVisible(false), 2000);

            return () => {
                clearTimeout(scaleTimer);
                clearTimeout(hideTimer);
            };
        } else {
            setIsVisible(false);
        }
    }, [combo.level]);

    // FIX: Don't show for level 0 or 1
    if (!isVisible || combo.level < 2) return null;

    const messageKey = COMBO_CONFIG.MESSAGES[Math.min(combo.level, COMBO_CONFIG.MESSAGES.length - 1)];
    const message = messageKey ? t(messageKey) : '';

    // Color based on combo level
    const getColor = () => {
        if (combo.level >= 6) return 'text-purple-400';
        if (combo.level >= 4) return 'text-pink-400';
        if (combo.level >= 2) return 'text-yellow-400';
        return 'text-white';
    };

    const getGlowColor = () => {
        if (combo.level >= 6) return 'rgba(168, 85, 247, 0.8)';
        if (combo.level >= 4) return 'rgba(244, 114, 182, 0.8)';
        if (combo.level >= 2) return 'rgba(250, 204, 21, 0.8)';
        return 'rgba(255, 255, 255, 0.6)';
    };

    return (
        <div
            className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            style={{
                transform: `translate(-50%, -50%) scale(${scale})`,
                transition: 'transform 0.2s ease-out'
            }}
        >
            <div className="text-center animate-bounce-in">
                {/* Message */}
                {message && (
                    <div
                        className={`text-6xl md:text-8xl font-black ${getColor()} mb-2`}
                        style={{
                            textShadow: `
                0 0 20px ${getGlowColor()},
                0 0 40px ${getGlowColor()},
                0 4px 8px rgba(0, 0, 0, 0.8)
              `,
                            animation: 'pulse 0.5s ease-in-out'
                        }}
                    >
                        {message}
                    </div>
                )}

                {/* Multiplier */}
                <div className="flex items-center justify-center gap-2">
                    <div
                        className="text-4xl md:text-5xl font-black text-white"
                        style={{
                            textShadow: `
                0 0 15px ${getGlowColor()},
                0 4px 6px rgba(0, 0, 0, 0.8)
              `
                        }}
                    >
                        {combo.multiplier}x
                    </div>
                    <div
                        className="text-2xl md:text-3xl font-bold text-white/90"
                        style={{
                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
                        }}
                    >
                        {t('combo')}
                    </div>
                </div>

                {/* Sparkle effects */}
                {combo.level >= 3 && (
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-3 h-3 bg-white rounded-full"
                                style={{
                                    top: '50%',
                                    left: '50%',
                                    animation: `sparkle-burst 0.8s ease-out forwards`,
                                    animationDelay: `${i * 0.1}s`,
                                    transform: `rotate(${i * 45}deg) translateX(0)`,
                                    opacity: 0
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Compact version for in-game HUD
interface ComboIndicatorProps {
    combo: ComboData;
    t: (key: string) => string;
}

export const ComboIndicator: React.FC<ComboIndicatorProps> = ({ combo, t }) => {
    // FIX: Don't show for level 0 or 1
    if (combo.level < 2) return null;

    return (
        <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 rounded-full shadow-lg border-2 border-white/30 animate-pulse-slow">
            <div className="text-white font-black text-lg">
                {combo.multiplier}x
            </div>
            <div className="text-white/90 font-bold text-sm uppercase">
                {t('combo')}
            </div>
            {combo.level >= 3 && (
                <div className="text-yellow-200 text-xs">🔥</div>
            )}
        </div>
    );
};
