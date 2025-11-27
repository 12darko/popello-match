import React from 'react';
import { Crown, X, Check, Hammer, Shuffle, Coins } from 'lucide-react';

interface DailyBonusModalProps {
    streak: number;
    isClaimed: boolean;
    onClaim: () => void;
    onClose: () => void;
    t: (k: string) => string;
}

export const DailyBonusModal: React.FC<DailyBonusModalProps> = ({ streak, isClaimed, onClaim, onClose, t }) => {
    const rewards = [50, 100, 'HAMMER', 150, 'SHUFFLE', 200, 500];

    return (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-indigo-900 w-full max-w-lg rounded-3xl p-6 border border-indigo-700 shadow-2xl text-center relative">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-indigo-400 hover:text-white"><X /></button>
                <Crown size={48} className="text-yellow-400 mx-auto mb-2 animate-bounce-short" fill="currentColor" />
                <h2 className="text-3xl font-black text-white mb-2 italic">{t('daily_bonus')}</h2>
                <p className="text-indigo-300 mb-6 text-sm">{t('streak')}: <span className="text-white font-bold">{streak} {t('day')}</span></p>
                <div className="grid grid-cols-4 gap-2 mb-8">
                    {rewards.map((reward, idx) => {
                        const dayNum = idx + 1;
                        let isToday = dayNum === streak;
                        let isPast = dayNum < streak;
                        if (isClaimed && isToday) { isPast = true; isToday = false; }
                        const isFuture = dayNum > streak;
                        let content;
                        if (reward === 'HAMMER') content = <Hammer size={20} className="text-red-400" />;
                        else if (reward === 'SHUFFLE') content = <Shuffle size={20} className="text-blue-400" />;
                        else content = <span className="text-yellow-400 font-bold text-xs flex flex-col items-center">{reward}<Coins size={10} /></span>;
                        return (
                            <div key={idx} className={`
                 relative rounded-xl p-2 flex flex-col items-center justify-center aspect-[3/4] border-2
                 ${isToday ? 'bg-indigo-800 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)] scale-110 z-10' : ''}
                 ${isPast ? 'bg-indigo-950/50 border-indigo-900 opacity-50' : ''}
                 ${isFuture ? 'bg-indigo-900 border-indigo-800' : ''}
               `}>
                                <span className="text-[8px] text-indigo-400 uppercase mb-1">{t('day')} {dayNum}</span>
                                {isPast ? <Check className="text-green-500" size={24} /> : content}
                            </div>
                        );
                    })}
                </div>
                {isClaimed ? (
                    <div className="bg-indigo-950 rounded-2xl p-4 text-indigo-200 text-sm font-bold border border-indigo-800">
                        {t('come_back')}
                    </div>
                ) : (
                    <button onClick={onClaim} className="w-full bg-yellow-400 text-black font-black py-4 rounded-2xl shadow-lg text-lg hover:scale-105 transition-transform animate-pulse">
                        {t('claim')}
                    </button>
                )}
            </div>
        </div>
    );
};
