import React from 'react';
import { X, Volume2, VolumeX, Smartphone, Globe, ExternalLink, Trash2 } from 'lucide-react';
import { platformService } from '../../services/platformService';

interface SettingsModalProps {
    soundEnabled: boolean;
    hapticsEnabled: boolean;
    toggleSound: () => void;
    toggleHaptics: () => void;
    currentLang: string;
    setLanguage: (lang: string) => void;
    onDeleteData: () => void;
    onClose: () => void;
    t: (k: string) => string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    soundEnabled,
    hapticsEnabled,
    toggleSound,
    toggleHaptics,
    currentLang,
    setLanguage,
    onDeleteData,
    onClose,
    t
}) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-indigo-950 w-full max-w-xs rounded-3xl border border-indigo-700 shadow-2xl p-6 relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-white italic">{t('settings')}</h2>
                <button onClick={onClose} className="bg-indigo-900 p-2 rounded-full hover:bg-indigo-800"><X size={20} /></button>
            </div>
            <div className="space-y-3">
                <button onClick={toggleSound} className="w-full flex items-center justify-between bg-indigo-900 p-4 rounded-2xl active:scale-95 transition-transform border border-indigo-800">
                    <span className="font-bold text-indigo-200">{t('sound_fx')}</span>
                    {soundEnabled ? <Volume2 className="text-green-400" size={24} /> : <VolumeX className="text-red-400" size={24} />}
                </button>
                <button onClick={toggleHaptics} className="w-full flex items-center justify-between bg-indigo-900 p-4 rounded-2xl active:scale-95 transition-transform border border-indigo-800">
                    <span className="font-bold text-indigo-200">{t('haptics')}</span>
                    {hapticsEnabled ? <Smartphone className="text-green-400" size={24} /> : <Smartphone className="text-red-400" size={24} />}
                </button>
                <div className="bg-indigo-900 p-4 rounded-2xl border border-indigo-800">
                    <div className="flex items-center gap-2 font-bold text-indigo-200 mb-3">
                        <Globe size={16} /> {t('language_selector')}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {['en', 'tr', 'es', 'pt', 'de', 'fr', 'ja', 'ko'].map(lang => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                className={`p-2 rounded-lg text-xs font-bold uppercase transition-colors border ${currentLang === lang ? 'bg-pink-500 text-white border-pink-400 shadow-lg' : 'bg-indigo-800 text-indigo-300 border-indigo-700 hover:bg-indigo-700'}`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-6 pt-6 border-t border-indigo-900 space-y-2">
                <button onClick={() => platformService.openExternalLink('https://www.google.com/policies/privacy/')} className="w-full flex items-center justify-between text-indigo-400 hover:text-white text-xs font-bold py-2">
                    <span>{t('privacy_policy')}</span>
                    <ExternalLink size={12} />
                </button>

                <button onClick={() => { if (window.confirm(t('delete_confirm'))) onDeleteData(); }} className="w-full flex items-center justify-between text-red-400 hover:text-red-300 text-xs font-bold py-2 mt-2 bg-red-900/20 rounded-lg px-3">
                    <span>{t('delete_data')}</span>
                    <Trash2 size={12} />
                </button>
            </div>
            <div className="text-center mt-4 text-indigo-600 text-[10px] font-mono">Popello Match v1.0.1<br />ArcaneFlux Interactive</div>
        </div>
    </div>
);
