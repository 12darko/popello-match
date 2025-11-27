import React from 'react';
import { ThumbsUp } from 'lucide-react';

interface RateUsModalProps {
    onRate: () => void;
    onLater: () => void;
    onNever: () => void;
    t: (k: string) => string;
}

export const RateUsModal: React.FC<RateUsModalProps> = ({ onRate, onLater, onNever, t }) => {
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
