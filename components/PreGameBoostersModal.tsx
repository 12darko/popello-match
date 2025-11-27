import React, { useState } from 'react';
import { Rocket, Bomb, Sparkles } from 'lucide-react';
import { SelectedBoosters, Inventory } from '../types';

interface PreGameBoostersModalProps {
    inventory: Inventory;
    onStart: (boosters: SelectedBoosters) => void;
    onSkip: () => void;
    t: (key: string) => string;
}

export const PreGameBoostersModal: React.FC<PreGameBoostersModalProps> = ({
    inventory,
    onStart,
    onSkip,
    t
}) => {
    const [selected, setSelected] = useState<SelectedBoosters>({
        rockets: 0,
        bombs: 0,
        discoBalls: 0
    });

    const boosters = [
        {
            id: 'rockets',
            name: t('rocket'),
            icon: <Rocket size={32} className="text-orange-400" />,
            available: inventory.rockets || 0,
            max: 2,
            color: 'from-orange-500 to-red-500'
        },
        {
            id: 'bombs',
            name: t('bomb'),
            icon: <Bomb size={32} className="text-purple-400" />,
            available: inventory.bombs || 0,
            max: 2,
            color: 'from-purple-500 to-pink-500'
        },
        {
            id: 'discoBalls',
            name: t('disco_ball'),
            icon: <Sparkles size={32} className="text-cyan-400" />,
            available: inventory.discoBalls || 0,
            max: 1,
            color: 'from-cyan-500 to-blue-500'
        }
    ];

    const increment = (id: string, max: number, available: number) => {
        const current = selected[id as keyof SelectedBoosters] || 0;
        if (current < max && current < available) {
            setSelected(prev => ({ ...prev, [id]: current + 1 }));
        }
    };

    const decrement = (id: string) => {
        const current = selected[id as keyof SelectedBoosters] || 0;
        if (current > 0) {
            setSelected(prev => ({ ...prev, [id]: current - 1 }));
        }
    };

    const totalSelected = (selected.rockets || 0) + (selected.bombs || 0) + (selected.discoBalls || 0);
    const hasSelection = totalSelected > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-indigo-950 w-full max-w-md rounded-[2rem] border border-indigo-800 shadow-2xl">
                {/* Header */}
                <div className="p-5 bg-indigo-900 border-b border-indigo-800 rounded-t-[2rem]">
                    <div className="text-yellow-400 font-black text-2xl italic text-center">
                        {t('select_boosters')}
                    </div>
                    <div className="text-indigo-300 text-xs text-center mt-1">
                        {t('select_boosters_desc')}
                    </div>
                </div>

                {/* Boosters List */}
                <div className="p-6 space-y-4">
                    {boosters.map(booster => {
                        const currentSelected = selected[booster.id as keyof SelectedBoosters] || 0;
                        const isMaxed = currentSelected >= booster.max || currentSelected >= booster.available;
                        const hasNone = booster.available === 0;

                        return (
                            <div
                                key={booster.id}
                                className={`bg-gradient-to-r ${booster.color} p-4 rounded-2xl border-2 ${currentSelected > 0 ? 'border-yellow-400 shadow-lg shadow-yellow-400/50' : 'border-white/20'
                                    } transition-all duration-300 ${hasNone ? 'opacity-50' : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    {/* Icon & Info */}
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                                            {booster.icon}
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-lg">{booster.name}</div>
                                            <div className="text-white/80 text-xs">
                                                {t('available')}: {booster.available}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Counter */}
                                    {hasNone ? (
                                        <div className="text-white/60 text-sm font-bold">{t('none')}</div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => decrement(booster.id)}
                                                disabled={currentSelected === 0}
                                                className="bg-white/20 hover:bg-white/30 disabled:opacity-30 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl active:scale-95 transition-all"
                                            >
                                                −
                                            </button>
                                            <div className="w-12 text-center text-white font-black text-2xl">
                                                {currentSelected}
                                            </div>
                                            <button
                                                onClick={() => increment(booster.id, booster.max, booster.available)}
                                                disabled={isMaxed}
                                                className="bg-white/20 hover:bg-white/30 disabled:opacity-30 w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl active:scale-95 transition-all"
                                            >
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-6 pt-0 space-y-3">
                    {hasSelection && (
                        <div className="bg-indigo-900/50 p-3 rounded-xl border border-indigo-700 text-center">
                            <div className="text-indigo-300 text-xs uppercase tracking-wide">{t('total_selected')}</div>
                            <div className="text-white font-black text-xl">{totalSelected} {t('boosters')}</div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={onSkip}
                            className="flex-1 bg-indigo-800 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all"
                        >
                            {t('skip')}
                        </button>
                        <button
                            onClick={() => onStart(selected)}
                            className="flex-[2] bg-green-500 hover:bg-green-400 text-white font-black py-4 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                            {t('start_game')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
