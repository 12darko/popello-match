import React from 'react';
import { LevelConfig } from '../../types';
import { calculateStarRating } from '../../services/gameLogic';
import { Crown, Star, Play } from 'lucide-react';

interface WinScreenProps {
    score: number;
    levelConfig: LevelConfig;
    onNextLevel: () => void;
    onBackToMenu: () => void;
    t: (key: string) => string;
}

export const WinScreen: React.FC<WinScreenProps> = ({
    score,
    levelConfig,
    onNextLevel,
    onBackToMenu,
    t
}) => {
    const stars = calculateStarRating(score, levelConfig);

    return (
        <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-gradient-to-b from-indigo-900 to-indigo-950 w-full max-w-md rounded-[2rem] border-4 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.5)] p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                <Crown size={64} className="text-yellow-400 mx-auto mb-4 animate-bounce-short relative z-10" fill="currentColor" />
                <h2 className="text-4xl font-black text-white mb-2 relative z-10 italic">{t('level_complete')}</h2>
                <p className="text-indigo-200 text-sm mb-6 relative z-10">{t('amazing_work')}</p>

                <div className="bg-black/30 rounded-2xl p-6 mb-6 relative z-10">
                    <div className="text-yellow-400 text-5xl font-black mb-2">{score.toLocaleString()}</div>
                    <div className="text-indigo-300 text-sm uppercase tracking-widest">{t('points')}</div>
                </div>

                <div className="flex justify-center gap-2 mb-8 relative z-10">
                    {[1, 2, 3].map(i => (
                        <Star
                            key={i}
                            size={48}
                            className={`transition-all duration-300 ${i <= stars ? 'text-yellow-400 scale-110' : 'text-gray-600'}`}
                            fill={i <= stars ? 'currentColor' : 'none'}
                        />
                    ))}
                </div>

                <div className="flex flex-col gap-3 relative z-10">
                    <button
                        onClick={onNextLevel}
                        className="w-full bg-green-500 text-white font-black text-lg py-4 rounded-2xl shadow-lg hover:bg-green-400 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <Play size={24} fill="currentColor" />
                        {t('next_level')}
                    </button>
                    <button
                        onClick={onBackToMenu}
                        className="w-full bg-indigo-800 text-indigo-200 font-bold py-3 rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                        {t('back_to_menu')}
                    </button>
                </div>
            </div>
        </div>
    );
};
