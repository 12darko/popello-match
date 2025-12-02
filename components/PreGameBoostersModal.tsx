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

    const toggleSelection = (id: string, available: number) => {
        if (available === 0) return;

        const current = selected[id as keyof SelectedBoosters] || 0;
        const newCount = current === 0 ? 1 : 0;

        setSelected(prev => ({ ...prev, [id]: newCount }));
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
                        const isSelected = currentSelected > 0;
                        const hasNone = booster.available === 0;

                        return (
                            <button
                                key={booster.id}
                                onClick={() => toggleSelection(booster.id, booster.available)}
                                disabled={hasNone}
                                className={`w-full relative overflow-hidden group transition-all duration-300
                                    ${isSelected
                                        ? `bg-gradient-to-r ${booster.color} border-2 border-yellow-400 shadow-lg shadow-yellow-400/20 scale-[1.02]`
                                        : `bg-indigo-900/40 border-2 border-indigo-800 hover:bg-indigo-900/60`
                                    } 
                                    ${hasNone ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                                    p-4 rounded-2xl flex items-center justify-between
                                `}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={`p-3 rounded-xl backdrop-blur-sm transition-colors ${isSelected ? 'bg-white/20' : 'bg-indigo-950/50'}`}>
                                        {booster.icon}
                                    </div>
                                    <div className="text-left">
                                        <div className={`font-black text-lg ${isSelected ? 'text-white' : 'text-indigo-100'}`}>
                                            {booster.name}
                                        </div>
                                        <div className={`text-xs font-bold ${isSelected ? 'text-white/90' : 'text-indigo-400'}`}>
                                            {t('available')}: {booster.available}
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    {hasNone ? (
                                        <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider bg-indigo-950/30 px-3 py-1 rounded-lg">
                                            {t('none')}
                                        </span>
                                    ) : (
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                                            ${isSelected
                                                ? 'bg-yellow-400 border-yellow-400 text-indigo-900'
                                                : 'border-indigo-600 text-transparent'
                                            }
                                        `}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-6 pt-0 space-y-3">
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
