import React, { useState } from 'react';
import { Achievement, AchievementCategory } from '../../types';
import { AchievementCard } from '../AchievementCard';
import { X, Trophy, Sparkles } from 'lucide-react';

interface AchievementsModalProps {
    achievements: Achievement[];
    onClose: () => void;
    t: (key: string) => string;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
    achievements,
    onClose,
    t
}) => {
    const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');

    const filteredAchievements = selectedCategory === 'all'
        ? achievements
        : achievements.filter(a => a.category === selectedCategory);

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;
    const progressPercent = (unlockedCount / totalCount) * 100;

    const categories = [
        { id: 'all', label: 'All', icon: '🎯' },
        { id: AchievementCategory.Levels, label: 'Levels', icon: '🎮' },
        { id: AchievementCategory.Score, label: 'Score', icon: '🏆' },
        { id: AchievementCategory.Combos, label: 'Combos', icon: '🔥' },
        { id: AchievementCategory.Stars, label: 'Stars', icon: '⭐' },
        { id: AchievementCategory.Collection, label: 'Collection', icon: '💎' },
        { id: AchievementCategory.PowerUps, label: 'Power-Ups', icon: '⚡' },
        { id: AchievementCategory.Quests, label: 'Quests', icon: '📋' }
    ];

    return (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 w-full max-w-6xl max-h-[90vh] rounded-[2rem] border-4 border-indigo-700/50 shadow-2xl overflow-hidden flex flex-col relative">
                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-75" />
                    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-150" />
                </div>

                {/* Header - Premium design */}
                <div className="relative p-6 border-b border-indigo-700/50 backdrop-blur-sm bg-gradient-to-r from-indigo-900/80 to-purple-900/80">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Trophy size={36} className="text-yellow-400 drop-shadow-lg" />
                                <Sparkles className="absolute -top-1 -right-1 text-yellow-300 animate-spin-slow" size={16} />
                            </div>
                            <h2 className="text-4xl font-black text-white drop-shadow-lg">
                                {t('achievements')}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-indigo-800/80 hover:bg-indigo-700 p-2.5 rounded-xl transition-all hover:scale-110 backdrop-blur-sm border border-indigo-600/50"
                        >
                            <X size={24} className="text-white" />
                        </button>
                    </div>

                    {/* Progress - Glassmorphism design */}
                    <div className="bg-indigo-950/50 backdrop-blur-md rounded-2xl p-4 border border-indigo-700/30 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-indigo-200 text-sm font-bold">
                                {unlockedCount} / {totalCount} Unlocked
                            </p>
                            <p className="text-yellow-400 font-black text-lg">
                                {Math.round(progressPercent)}%
                            </p>
                        </div>
                        <div className="bg-indigo-900/70 rounded-full h-4 overflow-hidden border border-indigo-700/50 shadow-inner">
                            <div
                                className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 h-full transition-all duration-500 ease-out relative overflow-hidden"
                                style={{ width: `${progressPercent}%` }}
                            >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Tabs - Responsive grid design */}
                <div className="relative px-4 py-3 border-b border-indigo-700/50 backdrop-blur-sm bg-indigo-900/30">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map(category => {
                            const isSelected = selectedCategory === category.id;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id as any)}
                                    className={`
                    px-3 py-2 rounded-xl font-bold text-xs transition-all duration-300
                    flex items-center gap-1.5 border-2 min-w-[44px] justify-center
                    ${isSelected
                                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-yellow-300 shadow-lg shadow-yellow-500/50 scale-105'
                                            : 'bg-indigo-800/50 text-indigo-200 hover:bg-indigo-800 border-indigo-700/50 backdrop-blur-sm'
                                        }
                  `}
                                    title={category.label}
                                >
                                    <span className="text-base">{category.icon}</span>
                                    <span className="hidden sm:inline">{category.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Achievement Grid - Premium layout */}
                <div className="relative flex-1 overflow-y-auto p-6">
                    {filteredAchievements.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <Trophy size={64} className="text-indigo-600 mb-4" />
                            <p className="text-indigo-300 text-lg font-bold">No achievements yet!</p>
                            <p className="text-indigo-400 text-sm">Keep playing to unlock achievements</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredAchievements.map(achievement => (
                                <AchievementCard
                                    key={achievement.id}
                                    achievement={achievement}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
