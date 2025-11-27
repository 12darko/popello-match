
import { useState, useCallback } from 'react';
import { DailyQuests, Quest, QuestType, PlayerProgress } from '../types';
import {
    initializeDailyQuests,
    refreshQuestsIfNeeded,
    updateQuestProgress,
    claimQuestReward
} from '../services/questService';

export const useQuestTracking = (initialProgress: PlayerProgress) => {
    const [dailyQuests, setDailyQuests] = useState<DailyQuests>(() => {
        // Initialize or refresh quests
        if (initialProgress.dailyQuests) {
            return refreshQuestsIfNeeded(initialProgress.dailyQuests);
        }
        return initializeDailyQuests();
    });

    // Track block collection
    const trackBlockCollection = useCallback((count: number = 1) => {
        setDailyQuests(prev => ({
            ...prev,
            quests: updateQuestProgress(prev.quests, QuestType.CollectBlocks, count)
        }));
    }, []);

    // Track obstacle destruction
    const trackObstacleDestruction = useCallback((count: number = 1) => {
        setDailyQuests(prev => ({
            ...prev,
            quests: updateQuestProgress(prev.quests, QuestType.DestroyObstacles, count)
        }));
    }, []);

    // Track power-up usage
    const trackPowerUpUsage = useCallback((count: number = 1) => {
        setDailyQuests(prev => ({
            ...prev,
            quests: updateQuestProgress(prev.quests, QuestType.UsePowerUps, count)
        }));
    }, []);

    // Track level win
    const trackLevelWin = useCallback(() => {
        setDailyQuests(prev => ({
            ...prev,
            quests: updateQuestProgress(prev.quests, QuestType.WinLevels, 1)
        }));
    }, []);

    // Track stars
    const trackStars = useCallback((stars: number) => {
        setDailyQuests(prev => ({
            ...prev,
            quests: updateQuestProgress(prev.quests, QuestType.GetStars, stars)
        }));
    }, []);

    // Track combos
    const trackCombo = useCallback(() => {
        setDailyQuests(prev => ({
            ...prev,
            quests: updateQuestProgress(prev.quests, QuestType.CreateCombos, 1)
        }));
    }, []);

    // Track score
    const trackScore = useCallback((score: number) => {
        setDailyQuests(prev => ({
            ...prev,
            quests: prev.quests.map(quest => {
                if (quest.type === QuestType.ReachScore && !quest.completed) {
                    // For score quests, we check if the score reaches the target
                    if (score >= quest.target) {
                        return { ...quest, progress: quest.target, completed: true };
                    }
                }
                return quest;
            })
        }));
    }, []);

    // Track win without boosters
    const trackWinWithoutBoosters = useCallback(() => {
        setDailyQuests(prev => ({
            ...prev,
            quests: updateQuestProgress(prev.quests, QuestType.WinWithoutBoosters, 1)
        }));
    }, []);

    // Claim quest reward
    const handleClaimQuest = useCallback((quest: Quest, onReward: (coins: number, rockets: number, bombs: number, discoBalls: number) => void) => {
        if (!quest.completed || quest.claimed) return;

        const reward = claimQuestReward(quest);

        // Mark as claimed
        setDailyQuests(prev => ({
            ...prev,
            quests: prev.quests.map(q =>
                q.id === quest.id ? { ...q, claimed: true } : q
            ),
            completedToday: prev.completedToday + 1
        }));

        // Give rewards
        onReward(reward.coins, reward.rockets, reward.bombs, reward.discoBalls);
    }, []);

    return {
        dailyQuests,
        trackBlockCollection,
        trackObstacleDestruction,
        trackPowerUpUsage,
        trackLevelWin,
        trackStars,
        trackCombo,
        trackScore,
        trackWinWithoutBoosters,
        handleClaimQuest
    };
};
