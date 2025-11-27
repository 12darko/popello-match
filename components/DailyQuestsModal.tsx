
import React from 'react';
import { DailyQuests, Quest } from '../types';
import { QuestCard } from './QuestCard';
import { X, Target, Calendar } from 'lucide-react';
import { claimQuestReward } from '../services/questService';

interface DailyQuestsModalProps {
    dailyQuests: DailyQuests;
    onClose: () => void;
    onClaimQuest: (quest: Quest) => void;
}

export const DailyQuestsModal: React.FC<DailyQuestsModalProps> = ({
    dailyQuests,
    onClose,
    onClaimQuest
}) => {
    const completedCount = dailyQuests.quests.filter(q => q.completed).length;
    const claimedCount = dailyQuests.quests.filter(q => q.claimed).length;

    // Calculate time until refresh
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const hoursUntilRefresh = Math.floor((tomorrow.getTime() - now.getTime()) / (1000 * 60 * 60));

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gradient-to-b from-indigo-950 to-purple-950 rounded-3xl max-w-md w-full border-4 border-indigo-800 shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b-2 border-indigo-800 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-indigo-300 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>

                    <div className="flex items-center gap-3 mb-2">
                        <Target className="text-yellow-400" size={32} />
                        <h2 className="text-2xl font-black text-white">Günlük Görevler</h2>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-indigo-300" />
                            <span className="text-indigo-200">{hoursUntilRefresh} saat sonra yenilenir</span>
                        </div>
                        <div className="text-green-400 font-bold">
                            {completedCount}/3 Tamamlandı
                        </div>
                    </div>
                </div>

                {/* Quests */}
                <div className="p-6 space-y-4">
                    {dailyQuests.quests.map(quest => (
                        <QuestCard
                            key={quest.id}
                            quest={quest}
                            onClaim={onClaimQuest}
                        />
                    ))}
                </div>

                {/* Footer Message */}
                {completedCount === 3 && claimedCount === 3 && (
                    <div className="p-6 pt-0">
                        <div className="bg-green-900/30 border-2 border-green-400 rounded-xl p-4 text-center">
                            <p className="text-green-200 font-bold">🎉 Tüm görevleri tamamladın!</p>
                            <p className="text-green-300 text-sm mt-1">Yarın yeni görevler seni bekliyor!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
