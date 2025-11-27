import React, { useRef, useEffect } from 'react';
import { LevelConfig, PlayerProgress } from '../../types';
import { DynamicBackground } from '../effects/DynamicBackground';
import { LivesIndicator } from '../LivesIndicator';
import { LEVELS } from '../../constants';
import { Star, Lock, Crown, Menu, Coins } from 'lucide-react';

interface LevelSelectProps {
    progress: PlayerProgress;
    onLevelSelect: (levelNum: number) => void;
    onBackToMenu: () => void;
    levelListRef: React.RefObject<HTMLDivElement>;
    t: (key: string) => string;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
    progress,
    onLevelSelect,
    onBackToMenu,
    levelListRef,
    t
}) => {
    return (
        <div className="h-full w-full relative flex flex-col">
            <DynamicBackground />

            {/* Header */}
            <div className="p-4 flex items-center justify-between relative z-20">
                <button onClick={onBackToMenu} className="bg-indigo-800/80 p-3 rounded-xl shadow-lg active:scale-95 transition-transform backdrop-blur-md border border-indigo-600/50">
                    <Menu size={24} className="text-white" />
                </button>
                <h2 className="text-2xl font-black text-white italic">{t('select_level')}</h2>
                <LivesIndicator lives={progress.lives} />
            </div>

            {/* Stats Bar */}
            <div className="px-4 pb-2 flex gap-2 relative z-20">
                <div className="flex-1 bg-black/30 backdrop-blur-md p-3 rounded-xl border border-white/10">
                    <div className="text-indigo-300 text-xs uppercase tracking-wide mb-1">{t('total_score')}</div>
                    <div className="text-white font-black text-lg">{progress.totalScore.toLocaleString()}</div>
                </div>
                <div className="flex-1 bg-black/30 backdrop-blur-md p-3 rounded-xl border border-white/10">
                    <div className="text-indigo-300 text-xs uppercase tracking-wide mb-1">{t('coins')}</div>
                    <div className="text-yellow-400 font-black text-lg flex items-center gap-1">
                        {progress.coins} <Coins size={16} />
                    </div>
                </div>
            </div>

            {/* Level Grid */}
            <div ref={levelListRef} className="flex-1 overflow-y-auto p-4 relative z-10 scrollbar-hide">
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pb-20">
                    {LEVELS.map(level => {
                        const isUnlocked = level.levelNumber <= progress.maxLevelReached;
                        const stars = progress.levelScores[level.levelNumber] || 0;

                        return (
                            <button
                                key={level.levelNumber}
                                onClick={() => isUnlocked && onLevelSelect(level.levelNumber)}
                                disabled={!isUnlocked}
                                className={`
                  aspect-square rounded-2xl p-4 flex flex-col items-center justify-center gap-2 relative overflow-hidden transition-all
                  ${isUnlocked
                                        ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-2 border-indigo-400 shadow-lg active:scale-95'
                                        : 'bg-slate-800/50 border-2 border-slate-700 cursor-not-allowed opacity-50'
                                    }
                `}
                            >
                                {!isUnlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                        <Lock size={32} className="text-slate-400" />
                                    </div>
                                )}

                                <div className="text-white font-black text-2xl">{level.levelNumber}</div>

                                {isUnlocked && stars > 0 && (
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3].map(i => (
                                            <Star
                                                key={i}
                                                size={12}
                                                className={i <= stars ? 'text-yellow-400' : 'text-gray-600'}
                                                fill={i <= stars ? 'currentColor' : 'none'}
                                            />
                                        ))}
                                    </div>
                                )}

                                {level.levelNumber === progress.maxLevelReached && (
                                    <Crown size={16} className="text-yellow-400 absolute top-1 right-1" fill="currentColor" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
