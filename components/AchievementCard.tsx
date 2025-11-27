import React from 'react';
import { Achievement } from '../types';
import { Check, Lock } from 'lucide-react';

interface AchievementCardProps {
    achievement: Achievement;
    onClick?: () => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
    achievement,
    onClick
}) => {
    const progressPercent = Math.min(
        (achievement.progress / achievement.target) * 100,
        100
    );

    return (
        <div
            onClick={onClick}
            className={`
        relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer
        hover:scale-105 hover:shadow-2xl
        ${achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 border-yellow-300 shadow-lg shadow-yellow-500/50 animate-pulse-slow'
                    : 'bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border-indigo-700/50 backdrop-blur-md'
                }
      `}
        >
            {/* Glassmorphism overlay for unlocked */}
            {achievement.unlocked && (
                <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm" />
            )}

            {/* Content */}
            <div className="relative z-10">
                {/* Icon with glow effect */}
                <div className={`text-5xl mb-3 ${achievement.unlocked ? 'animate-bounce-slow' : ''}`}>
                    {achievement.icon}
                </div>

                {/* Title */}
                <h3 className={`font-black text-xl mb-2 ${achievement.unlocked ? 'text-white drop-shadow-lg' : 'text-indigo-100'
                    }`}>
                    {achievement.title}
                </h3>

                {/* Description */}
                <p className={`text-sm mb-3 leading-relaxed ${achievement.unlocked ? 'text-white/90' : 'text-indigo-300'
                    }`}>
                    {achievement.description}
                </p>

                {/* Progress Bar - Premium design */}
                {!achievement.unlocked && (
                    <div className="mb-3">
                        <div className="bg-indigo-950/70 rounded-full h-3 overflow-hidden border border-indigo-700/50 shadow-inner">
                            <div
                                className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 h-full transition-all duration-500 ease-out relative overflow-hidden"
                                style={{ width: `${progressPercent}%` }}
                            >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                            </div>
                        </div>
                        <p className="text-xs text-indigo-300 mt-1.5 font-bold">
                            {achievement.progress.toLocaleString()} / {achievement.target.toLocaleString()}
                        </p>
                    </div>
                )}

                {/* Reward - Vibrant display */}
                <div className={`flex items-center gap-2 text-sm font-black flex-wrap ${achievement.unlocked ? 'text-white' : 'text-yellow-400'
                    }`}>
                    <span className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-lg">
                        🪙 {achievement.reward.coins}
                    </span>
                    {achievement.reward.rockets && (
                        <span className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-lg">
                            🚀 {achievement.reward.rockets}
                        </span>
                    )}
                    {achievement.reward.bombs && (
                        <span className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-lg">
                            💣 {achievement.reward.bombs}
                        </span>
                    )}
                    {achievement.reward.discoBalls && (
                        <span className="flex items-center gap-1 bg-black/20 px-2 py-1 rounded-lg">
                            🪩 {achievement.reward.discoBalls}
                        </span>
                    )}
                </div>
            </div>

            {/* Status Icon - Premium styling */}
            <div className="absolute top-3 right-3 z-20">
                {achievement.unlocked ? (
                    <div className="bg-white rounded-full p-1.5 shadow-lg animate-scale-in">
                        <Check size={20} className="text-green-500" />
                    </div>
                ) : (
                    <div className="bg-indigo-800/50 backdrop-blur-sm rounded-full p-1.5 border border-indigo-600/50">
                        <Lock size={18} className="text-indigo-300" />
                    </div>
                )}
            </div>

            {/* Decorative elements for unlocked achievements */}
            {achievement.unlocked && (
                <>
                    <div className="absolute -top-2 -left-2 w-16 h-16 bg-yellow-300/30 rounded-full blur-xl animate-pulse" />
                    <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-pink-300/30 rounded-full blur-xl animate-pulse delay-75" />
                </>
            )}
        </div>
    );
};
