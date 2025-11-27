
import React from 'react';
import { Quest } from '../types';
import { claimQuestReward } from '../services/questService';
import { CheckCircle2, Circle, Gift, Coins } from 'lucide-react';

interface QuestCardProps {
    quest: Quest;
    onClaim: (quest: Quest) => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, onClaim }) => {
    const progressPercent = Math.min((quest.progress / quest.target) * 100, 100);
    const isCompleted = quest.completed;
    const isClaimed = quest.claimed;

    return (
        <div className={`
      bg-gradient-to-br from-indigo-900/80 to-purple-900/80 
      border-2 ${isCompleted ? 'border-green-400' : 'border-indigo-600'} 
      rounded-2xl p-4 backdrop-blur-sm
      ${isCompleted && !isClaimed ? 'animate-pulse-slow shadow-[0_0_20px_rgba(34,197,94,0.3)]' : ''}
    `}>
            {/* Quest Description */}
            <div className="flex items-start gap-3 mb-3">
                {isCompleted ? (
                    <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={24} />
                ) : (
                    <Circle className="text-indigo-400 flex-shrink-0 mt-1" size={24} />
                )}
                <div className="flex-1">
                    <p className="text-white font-bold text-sm">{quest.description}</p>
                    <p className="text-indigo-300 text-xs mt-1">
                        {quest.progress} / {quest.target}
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-indigo-950/50 rounded-full h-2 mb-3 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-400' : 'bg-indigo-400'
                        }`}
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Rewards & Claim Button */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Gift size={16} className="text-yellow-400" />
                    {quest.reward.coins && (
                        <div className="flex items-center gap-1 bg-yellow-900/30 px-2 py-1 rounded-lg">
                            <Coins size={14} className="text-yellow-400" fill="currentColor" />
                            <span className="text-yellow-200 text-xs font-bold">{quest.reward.coins}</span>
                        </div>
                    )}
                    {quest.reward.rockets && (
                        <div className="bg-orange-900/30 px-2 py-1 rounded-lg">
                            <span className="text-orange-200 text-xs font-bold">🚀 {quest.reward.rockets}</span>
                        </div>
                    )}
                    {quest.reward.bombs && (
                        <div className="bg-red-900/30 px-2 py-1 rounded-lg">
                            <span className="text-red-200 text-xs font-bold">💣 {quest.reward.bombs}</span>
                        </div>
                    )}
                    {quest.reward.discoBalls && (
                        <div className="bg-purple-900/30 px-2 py-1 rounded-lg">
                            <span className="text-purple-200 text-xs font-bold">✨ {quest.reward.discoBalls}</span>
                        </div>
                    )}
                </div>

                {isCompleted && !isClaimed && (
                    <button
                        onClick={() => onClaim(quest)}
                        className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
                    >
                        Al!
                    </button>
                )}
            </div>
        </div>
    );
};
