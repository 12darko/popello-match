import React from 'react';
import { DynamicBackground } from '../effects/DynamicBackground';
import { Confetti } from '../effects/Confetti';
import { Play, Crown, Settings, ShoppingCart, Target } from 'lucide-react';

interface MainMenuProps {
    onPlayClick: () => void;
    onSettingsClick: () => void;
    onShopClick: () => void;
    onQuestsClick: () => void;
    t: (key: string) => string;
}

export const MainMenu: React.FC<MainMenuProps> = ({
    onPlayClick,
    onSettingsClick,
    onShopClick,
    onQuestsClick,
    t
}) => {
    return (
        <div className="h-full w-full relative flex flex-col items-center justify-center p-6">
            <DynamicBackground />
            <Confetti />

            <div className="text-center mb-12 relative z-10">
                <Crown size={80} className="text-yellow-400 mx-auto mb-4 drop-shadow-lg animate-bounce-short" fill="#facc15" />
                <h1 className="text-6xl font-black text-white italic mb-2 tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                    Popello
                </h1>
                <p className="text-indigo-200 text-sm uppercase tracking-widest font-bold">Match & Blast</p>
            </div>

            <div className="w-full max-w-xs space-y-4 relative z-10">
                <button
                    onClick={onPlayClick}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black text-xl py-5 rounded-2xl shadow-[0_6px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 border-b-4 border-green-700"
                >
                    <Play fill="currentColor" size={28} />
                    {t('play')}
                </button>

                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={onQuestsClick}
                        className="bg-indigo-800 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform flex flex-col items-center justify-center gap-1 border border-indigo-600"
                    >
                        <Target size={24} />
                        <span className="text-xs">{t('quests')}</span>
                    </button>

                    <button
                        onClick={onShopClick}
                        className="bg-indigo-800 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform flex flex-col items-center justify-center gap-1 border border-indigo-600"
                    >
                        <ShoppingCart size={24} />
                        <span className="text-xs">{t('shop')}</span>
                    </button>

                    <button
                        onClick={onSettingsClick}
                        className="bg-indigo-800 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform flex flex-col items-center justify-center gap-1 border border-indigo-600"
                    >
                        <Settings size={24} />
                        <span className="text-xs">{t('settings')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
