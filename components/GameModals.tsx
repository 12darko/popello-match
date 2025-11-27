import React, { useState, useEffect } from 'react';
import { BlockType } from '../types';
import { BLOCK_STYLES } from '../constants';
import { ThumbsUp, X } from 'lucide-react';

// Tutorial Modal
export const TutorialModal: React.FC<{
    type: string;
    onClose: () => void;
    t: (k: string) => string;
}> = ({ type, onClose, t }) => {
    let titleKey = "";
    let descKey = "";
    let Icon: any = null;

    switch (type) {
        case BlockType.Crate:
            titleKey = "tut_crate_title";
            descKey = "tut_crate_desc";
            Icon = BLOCK_STYLES[BlockType.Crate].icon;
            break;
        case BlockType.Stone:
            titleKey = "tut_stone_title";
            descKey = "tut_stone_desc";
            Icon = BLOCK_STYLES[BlockType.Stone].icon;
            break;
        case BlockType.Obsidian:
            titleKey = "tut_obsidian_title";
            descKey = "tut_obsidian_desc";
            Icon = BLOCK_STYLES[BlockType.Obsidian].icon;
            break;
        case 'ICE':
            titleKey = "tut_ice_title";
            descKey = "tut_ice_desc";
            Icon = null;
            break;
        default: return null;
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-indigo-900 w-full max-w-xs rounded-3xl border-4 border-white/20 shadow-2xl p-6 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="text-sm font-black text-indigo-300 uppercase tracking-widest mb-4">{t('new_hazard')}</div>
                <div className="w-24 h-24 mb-6 relative animate-bounce-short">
                    <div className="absolute inset-0 bg-white/10 rounded-full blur-xl" />
                    {type === 'ICE' ? (
                        <div className="w-full h-full bg-cyan-400 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg" />
                    ) : (
                        <div className={`w-full h-full rounded-2xl flex items-center justify-center shadow-lg ${BLOCK_STYLES[type as BlockType]?.color}`}>
                            {Icon && <Icon className={`w-3/4 h-3/4 ${BLOCK_STYLES[type as BlockType]?.textColor}`} />}
                        </div>
                    )}
                </div>
                <h2 className="text-2xl font-black text-white mb-2">{t(titleKey)}</h2>
                <p className="text-indigo-100 text-sm leading-relaxed mb-8">{t(descKey)}</p>
                <button onClick={onClose} className="w-full bg-green-500 text-white font-black text-lg py-4 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all">
                    {t('got_it')}
                </button>
            </div>
        </div>
    );
};

// Ad Modal
export const AdModal: React.FC<{ onClose: () => void; t: (k: string) => string }> = ({ onClose, t }) => {
    const [timer, setTimer] = useState(5);
    useEffect(() => {
        const interval = setInterval(() => setTimer(p => p <= 1 ? 0 : p - 1), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 animate-fade-in">
            <div className="text-center">
                <h2 className="text-4xl font-black text-yellow-400 mb-2 animate-bounce-short">{t('watch_ad_title')}</h2>
                <p className="text-white text-lg mb-8">{t('watch_ad_desc')}</p>
                <div className="w-64 h-3 bg-gray-700 rounded-full overflow-hidden mx-auto">
                    <div className="h-full bg-yellow-400 transition-all duration-1000 ease-linear" style={{ width: `${(5 - timer) * 20}%` }} />
                </div>
            </div>
            <div className="mt-12">
                {timer > 0 ? (
                    <p className="text-slate-400 font-mono text-sm">{t('close')} {timer}s</p>
                ) : (
                    <button onClick={onClose} className="bg-white text-black font-bold px-8 py-3 rounded-full hover:scale-110 transition-transform">
                        {t('close')}
                    </button>
                )}
            </div>
        </div>
    );
};

// Rate Us Modal
export const RateUsModal: React.FC<{
    onRate: () => void;
    onLater: () => void;
    onNever: () => void;
    t: (k: string) => string;
}> = ({ onRate, onLater, onNever, t }) => {
    return (
        <div className="fixed inset-0 z-[160] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-indigo-900 w-full max-w-sm rounded-[2rem] border-4 border-indigo-700 shadow-2xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/10 to-transparent" />
                <div className="relative z-10 mb-6">
                    <div className="inline-block p-4 bg-indigo-800 rounded-full mb-4 shadow-lg animate-bounce-short">
                        <ThumbsUp size={48} className="text-yellow-400" fill="currentColor" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2">{t('rate_title')}</h2>
                    <p className="text-indigo-200 text-sm">{t('rate_desc')}</p>
                </div>
                <div className="flex flex-col gap-3 relative z-10">
                    <button onClick={onRate} className="w-full bg-green-500 text-white font-black py-4 rounded-2xl shadow-lg text-lg active:scale-95 transition-transform">
                        {t('rate_btn')}
                    </button>
                    <button onClick={onLater} className="w-full bg-indigo-800 text-indigo-200 font-bold py-3 rounded-2xl hover:bg-indigo-700 active:scale-95 transition-transform">
                        {t('rate_later')}
                    </button>
                    <button onClick={onNever} className="text-indigo-400 text-xs font-bold py-2 hover:text-white">
                        {t('rate_never')}
                    </button>
                </div>
            </div>
        </div>
    );
};
