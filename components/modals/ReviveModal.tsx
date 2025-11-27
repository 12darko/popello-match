import React from 'react';
import { Coins } from 'lucide-react';

interface ReviveModalProps {
    onRevive: () => void;
    onGiveUp: () => void;
    coins: number;
    t: (k: string) => string;
}

export const ReviveModal: React.FC<ReviveModalProps> = ({ onRevive, onGiveUp, coins, t }) => {
    const cost = 200;
    const canAfford = coins >= cost;

    return (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-fade-in">
            <div className="bg-indigo-950 w-full max-w-sm rounded-[2rem] border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)] p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-transparent pointer-events-none" />
                <h2 className="text-4xl font-black text-white mb-1 animate-pulse">{t('out_of_moves')}</h2>
                <p className="text-indigo-200 mb-8 text-sm">{t('so_close')}</p>
                <div className="flex flex-col gap-4 relative z-10">
                    <button
                        onClick={onRevive}
                        disabled={!canAfford}
                        className={`
                w-full py-4 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3
                ${canAfford
                                ? 'bg-green-500 text-white hover:bg-green-400 border-b-4 border-green-700 active:border-b-0 active:translate-y-1'
                                : 'bg-slate-700 text-slate-400 border-b-4 border-slate-900 cursor-not-allowed'}
              `}
                    >
                        <span>{t('get_moves')}</span>
                        <div className="bg-black/30 px-2 py-1 rounded-lg flex items-center gap-1 text-sm">
                            200 <Coins size={14} />
                        </div>
                    </button>
                    <button onClick={onGiveUp} className="text-slate-400 text-sm font-bold hover:text-white underline decoration-slate-600 underline-offset-4">
                        {t('give_up')}
                    </button>
                </div>
            </div>
        </div>
    );
};
