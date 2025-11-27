import React from 'react';
import { X, Coins, CreditCard, Video, Hammer, Shuffle, ShieldCheck } from 'lucide-react';
import { Inventory } from '../../types';

interface ShopModalProps {
    coins: number;
    inventory: Inventory;
    adsRemoved: boolean;
    dailyAdsWatched: number;
    onBuyItem: (item: string, cost: number) => void;
    onBuyIAP: (sku: string) => void;
    onWatchAd: () => void;
    onRestorePurchases: () => void;
    onClose: () => void;
    isProcessing: boolean;
    t: (k: string) => string;
}

export const ShopModal: React.FC<ShopModalProps> = ({
    coins,
    inventory,
    adsRemoved,
    dailyAdsWatched,
    onBuyItem,
    onBuyIAP,
    onWatchAd,
    onRestorePurchases,
    onClose,
    isProcessing,
    t
}) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
        <div className="bg-indigo-950 w-full max-w-md rounded-[2rem] border border-indigo-800 shadow-2xl flex flex-col h-[90dvh]">
            <div className="p-5 bg-indigo-900 border-b border-indigo-800 flex justify-between items-center rounded-t-[2rem]">
                <div className="text-yellow-400 font-black text-2xl italic">{t('shop')}</div>
                <button onClick={onClose} className="bg-indigo-800 p-2 rounded-full hover:bg-indigo-700"><X size={20} /></button>
            </div>
            <div className="p-4 bg-black/20 flex justify-between items-center text-white border-b border-indigo-900">
                <span className="text-xs font-bold text-indigo-300 uppercase">{t('your_coins')}</span>
                <span className="flex items-center gap-1 text-yellow-400 font-black text-xl">
                    {coins.toLocaleString()} <Coins size={20} fill="currentColor" />
                </span>
            </div>
            <div className="overflow-y-auto p-5 space-y-6 flex-1 scrollbar-hide">
                <div className="space-y-3">
                    <h3 className="text-pink-400 text-[10px] font-bold uppercase tracking-widest ml-1 flex items-center gap-1"><CreditCard size={12} /> {t('premium_shop')}</h3>
                    <div className={`p-4 rounded-2xl border flex items-center justify-between relative overflow-hidden ${adsRemoved ? 'bg-slate-800/50 border-slate-700' : 'bg-gradient-to-r from-indigo-900 to-purple-900 border-purple-500/50'}`}>
                        {adsRemoved && <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center font-black text-green-400 text-lg rotate-12 border-4 border-green-500 rounded-xl opacity-80">{t('owned')}</div>}
                        <div className="flex items-center gap-3 relative z-0">
                            <div className="bg-purple-500 p-3 rounded-xl text-white shadow-lg"><ShieldCheck size={24} /></div>
                            <div>
                                <div className="text-white font-bold text-sm">{t('remove_ads')}</div>
                                <div className="text-purple-200 text-[10px]">{t('remove_ads_desc')}</div>
                            </div>
                        </div>
                        <button onClick={() => onBuyIAP('remove_ads')} disabled={adsRemoved || isProcessing} className="bg-green-500 text-black font-bold px-4 py-2 rounded-xl text-sm active:scale-95 disabled:opacity-50 shadow-lg relative z-0">
                            {isProcessing ? '...' : '$4.99'}
                        </button>
                    </div>
                    <div className="bg-indigo-900/30 p-3 rounded-2xl border border-indigo-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-yellow-600 p-2 rounded-xl text-white"><Coins size={20} /></div>
                            <div>
                                <div className="text-white font-bold text-sm">{t('coin_pack_small')}</div>
                                <div className="text-indigo-300 text-[10px]">{t('coin_pack_small_desc')}</div>
                            </div>
                        </div>
                        <button onClick={() => onBuyIAP('coins_small')} disabled={isProcessing} className="bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-sm active:scale-95 disabled:opacity-50">
                            {isProcessing ? '...' : '$1.99'}
                        </button>
                    </div>
                    <div className="bg-indigo-900/30 p-3 rounded-2xl border border-indigo-800 flex items-center justify-between relative">
                        <div className="absolute -top-2 left-4 bg-yellow-500 text-black text-[8px] font-black px-2 rounded-full uppercase tracking-wide">Best Value</div>
                        <div className="flex items-center gap-3">
                            <div className="bg-yellow-500 p-2 rounded-xl text-black"><Coins size={20} fill="black" /></div>
                            <div>
                                <div className="text-white font-bold text-sm">{t('coin_pack_big')}</div>
                                <div className="text-indigo-300 text-[10px]">{t('coin_pack_big_desc')}</div>
                            </div>
                        </div>
                        <button onClick={() => onBuyIAP('coins_big')} disabled={isProcessing} className="bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-sm active:scale-95 disabled:opacity-50">
                            {isProcessing ? '...' : '$9.99'}
                        </button>
                    </div>
                </div>
                <div className="space-y-3">
                    <h3 className="text-yellow-400 text-[10px] font-bold uppercase tracking-widest ml-1 flex items-center gap-1"><Video size={12} /> {t('free_coins')}</h3>
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 border border-orange-400 p-4 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
                        <div>
                            <div className="text-white font-bold flex items-center gap-2 text-sm"><Video size={18} className="text-white" /> {t('free_coins')}</div>
                            <div className="text--[10px] text-orange-100 mt-0.5">{dailyAdsWatched}/5 {t('today')}</div>
                        </div>
                        <button onClick={onWatchAd} disabled={dailyAdsWatched >= 5} className="bg-white text-red-600 font-black px-4 py-3 rounded-xl text-sm flex items-center gap-1 shadow-lg active:scale-95 disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500">
                            {dailyAdsWatched >= 5 ? t('max') : '+100'} <Coins size={14} fill="currentColor" />
                        </button>
                    </div>
                </div>
                <div className="space-y-3">
                    <h3 className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest ml-1">{t('items')}</h3>
                    {[
                        { id: 'hammer', name: t('hammer'), desc: t('hammer_desc'), icon: <Hammer size={20} />, cost: 100, owned: inventory.hammers, color: 'text-red-400', bg: 'bg-red-500/20' },
                        { id: 'shuffle', name: t('shuffle'), desc: t('shuffle_desc'), icon: <Shuffle size={20} />, cost: 50, owned: inventory.shuffles, color: 'text-blue-400', bg: 'bg-blue-500/20' }
                    ].map(item => (
                        <div key={item.id} className="bg-indigo-900/50 p-3 rounded-2xl border border-indigo-800 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] animate-[shimmer_2s_infinite]" />
                            <div className="flex items-center gap-3 flex-1 relative z-10">
                                <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>{item.icon}</div>
                                <div>
                                    <div className="text-white font-bold text-sm">{item.name}</div>
                                    <div className="text-indigo-300 text-[10px]">{item.desc}</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 relative z-10">
                                <div className="text-xs text-indigo-400 font-bold">{t('owned')}: {item.owned}</div>
                                <button onClick={() => onBuyItem(item.id, item.cost)} className="bg-indigo-700 hover:bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-md active:translate-y-0.5 transition-all">
                                    {item.cost} <Coins size={10} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Boosters Section */}
                <div className="space-y-3">
                    <h3 className="text-purple-400 text-[10px] font-bold uppercase tracking-widest ml-1">{t('boosters')}</h3>
                    {[
                        { id: 'rockets', name: t('powerup_rocket'), desc: t('powerup_rocket_desc'), emoji: '🚀', cost: 200, owned: inventory.rockets, color: 'text-blue-400', bg: 'bg-blue-500/20' },
                        { id: 'bombs', name: t('powerup_bomb'), desc: t('powerup_bomb_desc'), emoji: '💣', cost: 250, owned: inventory.bombs, color: 'text-red-400', bg: 'bg-red-500/20' },
                        { id: 'discoBalls', name: t('powerup_disco'), desc: t('powerup_disco_desc'), emoji: '🪩', cost: 300, owned: inventory.discoBalls, color: 'text-purple-400', bg: 'bg-purple-500/20' }
                    ].map(item => (
                        <div key={item.id} className="bg-indigo-900/50 p-3 rounded-2xl border border-indigo-800 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] animate-[shimmer_2s_infinite]" />
                            <div className="flex items-center gap-3 flex-1 relative z-10">
                                <div className={`p-3 rounded-xl ${item.bg} ${item.color} text-2xl flex items-center justify-center`}>{item.emoji}</div>
                                <div>
                                    <div className="text-white font-bold text-sm">{item.name}</div>
                                    <div className="text-indigo-300 text-[10px]">{item.desc}</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 relative z-10">
                                <div className="text-xs text-indigo-400 font-bold">{t('owned')}: {item.owned}</div>
                                <button onClick={() => onBuyItem(item.id, item.cost)} className="bg-purple-700 hover:bg-purple-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-md active:translate-y-0.5 transition-all">
                                    {item.cost} <Coins size={10} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pt-4 text-center">
                    <button onClick={onRestorePurchases} className="text-indigo-400 text-xs font-bold hover:text-white underline">{t('restore_purchases')}</button>
                </div>
            </div>
        </div>
    </div>
);
