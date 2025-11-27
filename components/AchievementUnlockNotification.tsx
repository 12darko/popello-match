import React, { useEffect } from 'react';
import { Achievement } from '../types';
import { Trophy, Sparkles } from 'lucide-react';

interface AchievementUnlockNotificationProps {
    achievement: Achievement;
    onClose: () => void;
}

export const AchievementUnlockNotification: React.FC<AchievementUnlockNotificationProps> = ({
    achievement,
    onClose
}) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[300] animate-slide-down">
            <div className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-2xl p-5 shadow-2xl border-4 border-white/40 min-w-[320px] max-w-md backdrop-blur-xl overflow-hidden">
                {/* Animated background particles */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-20 h-20 bg-white/20 rounded-full blur-xl animate-float" />
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-yellow-300/20 rounded-full blur-xl animate-float delay-75" />
                    <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-pink-300/20 rounded-full blur-xl animate-pulse" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex items-center gap-4">
                    {/* Trophy icon with glow */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-yellow-200 rounded-full blur-lg animate-pulse" />
                        <div className="relative bg-white rounded-full p-3 shadow-lg">
                            <Trophy size={32} className="text-yellow-500" />
                        </div>
                        {/* Sparkles */}
                        <Sparkles className="absolute -top-1 -right-1 text-white animate-spin-slow" size={16} />
                    </div>

                    {/* Text content */}
                    <div className="flex-1">
                        <p className="text-white/90 text-xs font-black uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Sparkles size={12} />
                            Achievement Unlocked!
                        </p>
                        <h3 className="text-white font-black text-lg leading-tight mb-1 drop-shadow-lg">
                            {achievement.icon} {achievement.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-lg text-white text-sm font-bold flex items-center gap-1">
                                +{achievement.reward.coins} 🪙
                            </span>
                            {achievement.reward.rockets && (
                                <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-lg text-white text-sm font-bold">
                                    +{achievement.reward.rockets} 🚀
                                </span>
                            )}
                            {achievement.reward.bombs && (
                                <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-lg text-white text-sm font-bold">
                                    +{achievement.reward.bombs} 💣
                                </span>
                            )}
                            {achievement.reward.discoBalls && (
                                <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-lg text-white text-sm font-bold">
                                    +{achievement.reward.discoBalls} 🪩
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Shimmer effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none" />
            </div>
        </div>
    );
};
