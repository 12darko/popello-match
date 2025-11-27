import React, { useState, useEffect } from 'react';
import { Heart, Plus } from 'lucide-react';
import { getTimeUntilNextLife, formatTimeRemaining, canPlay } from '../services/livesService';
import { LIVES_CONFIG } from '../constants';

interface LivesIndicatorProps {
    lives: number;
    lastLifeLostTime?: number;
    unlimitedLivesUntil?: number;
    onBuyLives?: () => void;
    t: (key: string) => string;
    compact?: boolean;
}

export const LivesIndicator: React.FC<LivesIndicatorProps> = ({
    lives,
    lastLifeLostTime = 0,
    unlimitedLivesUntil = 0,
    onBuyLives,
    t,
    compact = false
}) => {
    const [timeRemaining, setTimeRemaining] = useState('');
    const [isUnlimited, setIsUnlimited] = useState(false);

    useEffect(() => {
        const updateTimer = () => {
            if (unlimitedLivesUntil > 0 && Date.now() < unlimitedLivesUntil) {
                setIsUnlimited(true);
                if (unlimitedLivesUntil === Number.MAX_SAFE_INTEGER) {
                    setTimeRemaining('∞');
                } else {
                    const remaining = unlimitedLivesUntil - Date.now();
                    setTimeRemaining(formatTimeRemaining(remaining));
                }
            } else {
                setIsUnlimited(false);
                if (lives < LIVES_CONFIG.MAX_LIVES) {
                    const ms = getTimeUntilNextLife(lives, lastLifeLostTime);
                    setTimeRemaining(formatTimeRemaining(ms));
                } else {
                    setTimeRemaining('');
                }
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [lives, lastLifeLostTime, unlimitedLivesUntil]);

    if (compact) {
        return (
            <div className="flex items-center gap-1 bg-red-500 px-3 py-1.5 rounded-full shadow-lg">
                <Heart size={16} fill="white" className="text-white" />
                <span className="text-white font-bold text-sm">
                    {isUnlimited ? '∞' : lives}
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 rounded-full shadow-lg border-2 border-white/30">
            {/* Hearts Display */}
            <div className="flex items-center gap-1">
                {[...Array(LIVES_CONFIG.MAX_LIVES)].map((_, i) => (
                    <Heart
                        key={i}
                        size={20}
                        fill={i < lives || isUnlimited ? 'white' : 'transparent'}
                        className={`
              text-white transition-all duration-300
              ${i < lives || isUnlimited ? 'scale-100' : 'scale-90 opacity-40'}
            `}
                    />
                ))}
            </div>

            {/* Timer or Unlimited Badge */}
            {isUnlimited ? (
                <div className="flex items-center gap-1 bg-yellow-400 text-black px-2 py-0.5 rounded-full text-xs font-black">
                    <span>{t('unlimited_lives')}</span>
                    {timeRemaining !== '∞' && <span>({timeRemaining})</span>}
                </div>
            ) : lives < LIVES_CONFIG.MAX_LIVES && timeRemaining && (
                <span className="text-white text-xs font-bold bg-black/20 px-2 py-0.5 rounded-full">
                    {timeRemaining}
                </span>
            )}

            {/* Buy Lives Button */}
            {onBuyLives && !isUnlimited && (
                <button
                    onClick={onBuyLives}
                    className="ml-1 bg-white/20 hover:bg-white/30 p-1 rounded-full transition-colors active:scale-95"
                    aria-label={t('buy_lives')}
                >
                    <Plus size={16} className="text-white" />
                </button>
            )}
        </div>
    );
};


// Out of Lives Modal
interface OutOfLivesModalProps {
    lives: number;
    lastLifeLostTime?: number;
    coins: number;
    onBuyLives: (count: number) => void;
    onWatchAd: () => void;
    onWait: () => void;
    t: (key: string) => string;
}

export const OutOfLivesModal: React.FC<OutOfLivesModalProps> = ({
    lives,
    lastLifeLostTime = 0,
    coins,
    onBuyLives,
    onWatchAd,
    onWait,
    t
}) => {
    const [timeRemaining, setTimeRemaining] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const ms = getTimeUntilNextLife(lives, lastLifeLostTime);
            setTimeRemaining(formatTimeRemaining(ms));
        }, 1000);

        return () => clearInterval(interval);
    }, [lives, lastLifeLostTime]);

    const canAfford1 = coins >= LIVES_CONFIG.COST_PER_LIFE;
    const canAfford5 = coins >= LIVES_CONFIG.COST_PER_LIFE * 5;

    return (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-gradient-to-b from-red-600 to-red-800 w-full max-w-md rounded-[2rem] border-4 border-white/20 shadow-2xl p-8 text-center relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/10 to-transparent" />
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-pink-500/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-red-500/30 rounded-full blur-3xl" />

                {/* Content */}
                <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-4 inline-block p-4 bg-white/10 rounded-full">
                        <Heart size={64} className="text-white" fill="white" />
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl font-black text-white mb-2 animate-pulse">
                        {t('out_of_lives')}
                    </h2>

                    {/* Next life timer */}
                    <p className="text-white/80 text-sm mb-8">
                        {t('wait_for_life').replace('{time}', timeRemaining)}
                    </p>

                    {/* Options */}
                    <div className="space-y-3">
                        {/* Watch Ad for 1 Life */}
                        <button
                            onClick={onWatchAd}
                            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black py-4 rounded-2xl shadow-lg text-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2"
                        >
                            <span>📺 {t('watch_ad_title')}</span>
                            <div className="bg-black/20 px-2 py-1 rounded-lg flex items-center gap-1">
                                +1 <Heart size={14} fill="currentColor" />
                            </div>
                        </button>

                        {/* Buy 1 Life */}
                        <button
                            onClick={() => onBuyLives(1)}
                            disabled={!canAfford1}
                            className={`
                w-full py-3 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-between px-6
                ${canAfford1
                                    ? 'bg-white text-red-600 hover:bg-gray-100 active:scale-95'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'}
              `}
                        >
                            <span>+1 {t('lives')}</span>
                            <span className="text-sm">{LIVES_CONFIG.COST_PER_LIFE} 🪙</span>
                        </button>

                        {/* Buy 5 Lives */}
                        <button
                            onClick={() => onBuyLives(5)}
                            disabled={!canAfford5}
                            className={`
                w-full py-3 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-between px-6 relative
                ${canAfford5
                                    ? 'bg-white text-red-600 hover:bg-gray-100 active:scale-95'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'}
              `}
                        >
                            {canAfford5 && (
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full">
                                    BEST VALUE
                                </div>
                            )}
                            <span>+5 {t('lives')}</span>
                            <span className="text-sm">{LIVES_CONFIG.COST_PER_LIFE * 5} 🪙</span>
                        </button>

                        {/* Wait */}
                        <button
                            onClick={onWait}
                            className="w-full text-white/60 text-sm font-bold py-2 hover:text-white underline decoration-white/40 underline-offset-4"
                        >
                            {t('close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
