import React from 'react';
import { Gamepad2, Star, Crown, ShoppingCart, Settings, Coins, RotateCcw, Play, Lock } from 'lucide-react';
import { PageTransition } from '../components/effects/PageTransition';
import { DynamicBackground } from '../components/effects/DynamicBackground';

export const MenuScreen: React.FC<any> = ({
    progress,
    handleLevelSelect,
    setShowDailyQuests,
    setShowAchievements,
    setShowTournament,
    setShowShop,
    setShowSettings,
    levelListRef,
    t
}) => {
    return (
        <PageTransition animation="fade" className="h-full w-full bg-[#2e1065] relative overflow-hidden flex flex-col">
            <DynamicBackground />

            {/* Top Bar */}
            <div className="p-3 relative z-20 space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center shadow-lg">
                            <span className="font-black text-white text-lg">P</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-indigo-300 font-bold uppercase">{t('level')}</span>
                            <span className="text-white font-black text-sm leading-none">{progress.maxLevelReached}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-1.5 rounded-full shadow-lg">
                        <span className="text-white font-black text-sm">❤️ {progress.lives}</span>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                    <button onClick={() => setShowDailyQuests(true)} className="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white p-2 rounded-xl shadow-md border border-purple-400/30 transition-transform">
                        <Gamepad2 size={18} />
                    </button>
                    <button onClick={() => setShowAchievements(true)} className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-white p-2 rounded-xl shadow-md border border-amber-400/30 transition-transform">
                        <Star size={18} />
                    </button>
                    <button onClick={() => setShowTournament(true)} className="bg-rose-600 hover:bg-rose-500 active:scale-95 text-white p-2 rounded-xl shadow-md border border-rose-400/30 transition-transform">
                        <Crown size={18} />
                    </button>
                    <button onClick={() => setShowShop(true)} className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white p-2 rounded-xl shadow-md border border-indigo-400/30 relative transition-transform">
                        <ShoppingCart size={18} />
                        {progress.coins < 100 && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />}
                    </button>
                    <button onClick={() => setShowSettings(true)} className="bg-indigo-800 hover:bg-indigo-700 active:scale-95 text-indigo-200 p-2 rounded-xl shadow-md border border-indigo-600/30 transition-transform">
                        <Settings size={18} />
                    </button>
                </div>
            </div>

            {/* Coin Display */}
            <div className="px-4 pb-2 relative z-20 flex justify-center">
                <div className="bg-indigo-900/50 border border-indigo-700 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg backdrop-blur-sm">
                    <Coins className="text-yellow-400 drop-shadow-md" size={24} fill="currentColor" />
                    <div className="flex flex-col">
                        <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wide">{t('coins')}</span>
                        <span className="text-xl font-black text-white leading-none">{progress.coins.toLocaleString()}</span>
                    </div>
                    <button onClick={() => setShowShop(true)} className="ml-1 bg-green-500 hover:bg-green-400 text-white p-1 rounded-lg shadow-sm active:scale-95 transition-transform">
                        <RotateCcw size={14} className="rotate-45" />
                    </button>
                </div>
            </div>

            {/* Level Grid */}
            <div ref={levelListRef} className="flex-1 overflow-y-auto p-6 pb-32 relative z-10 scrollbar-hide">
                <div className="grid grid-cols-4 gap-4">
                    {Array.from({ length: progress.maxLevelReached }).map((_, i) => {
                        const levelNum = i + 1;
                        const stars = progress.levelScores[levelNum] || 0;
                        const isCurrent = levelNum === progress.maxLevelReached;

                        return (
                            <button
                                key={levelNum}
                                onClick={() => handleLevelSelect(levelNum)}
                                className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative transition-all duration-300 ${isCurrent
                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_4px_0_#4c1d95] scale-110 z-10 ring-4 ring-white/20'
                                    : 'bg-indigo-800/40 border border-indigo-700/50 hover:bg-indigo-700/60'
                                    }`}
                            >
                                <span className={`font-black text-lg ${isCurrent ? 'text-white' : 'text-indigo-300'}`}>{levelNum}</span>
                                <div className="flex gap-0.5 mt-1">
                                    {[1, 2, 3].map(s => (
                                        <Star key={s} size={8} className={s <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-indigo-900/50'} />
                                    ))}
                                </div>
                                {isCurrent && (
                                    <div className="absolute -bottom-3 bg-green-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-bounce">
                                        PLAY
                                    </div>
                                )}
                            </button>
                        );
                    })}

                    {/* Locked Levels Preview */}
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={`locked-${i}`} className="aspect-square rounded-2xl bg-black/20 border border-white/5 flex items-center justify-center opacity-50">
                            <Lock size={16} className="text-indigo-900" />
                        </div>
                    ))}
                </div>
            </div>
        </PageTransition>
    );
};
