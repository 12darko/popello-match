import React from 'react';
import { BlockType } from '../../types';
import { BLOCK_STYLES } from '../../constants';

interface TutorialModalProps {
    type: string;
    onClose: () => void;
    t: (k: string) => string;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ type, onClose, t }) => {
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
        case BlockType.Balloon:
            titleKey = "tut_balloon_title";
            descKey = "tut_balloon_desc";
            Icon = BLOCK_STYLES[BlockType.Balloon].icon;
            break;
        case 'CHAIN':
            titleKey = "tut_chain_title";
            descKey = "tut_chain_desc";
            Icon = null; // Chains are usually overlays, might need a specific icon or just generic lock
            break;
        case 'JELLY':
            titleKey = "tut_jelly_title";
            descKey = "tut_jelly_desc";
            Icon = null;
            break;
        case BlockType.Cage:
            titleKey = "tut_cage_title";
            descKey = "tut_cage_desc";
            Icon = BLOCK_STYLES[BlockType.Cage].icon;
            break;
        case BlockType.Honey:
            titleKey = "tut_honey_title";
            descKey = "tut_honey_desc";
            Icon = BLOCK_STYLES[BlockType.Honey].icon;
            break;
        case BlockType.Vortex:
            titleKey = "tut_vortex_title";
            descKey = "tut_vortex_desc";
            Icon = BLOCK_STYLES[BlockType.Vortex].icon;
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
                        <div className="w-full h-full bg-cyan-400 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                            {/* Icon rendering here if needed */}
                        </div>
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
