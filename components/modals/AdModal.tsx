import React, { useState, useEffect } from 'react';

interface AdModalProps {
    onClose: () => void;
    t: (k: string) => string;
}

export const AdModal: React.FC<AdModalProps> = ({ onClose, t }) => {
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
