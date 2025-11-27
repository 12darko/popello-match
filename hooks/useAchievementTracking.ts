import { useState, useCallback, useEffect } from 'react';
import { Achievement, AchievementProgress, PlayerProgress } from '../types';
import { checkAchievements, updateAchievementProgress } from '../services/achievementService';

export const useAchievementTracking = (initialProgress: PlayerProgress) => {
    const [achievements, setAchievements] = useState<Achievement[]>(
        initialProgress.achievements
    );
    const [achievementProgress, setAchievementProgress] = useState<AchievementProgress>(
        initialProgress.achievementProgress
    );
    const [newUnlocks, setNewUnlocks] = useState<Achievement[]>([]);

    // Check achievements whenever progress changes
    useEffect(() => {
        const { updatedAchievements, newlyUnlocked } = checkAchievements(
            achievements,
            achievementProgress
        );

        if (newlyUnlocked.length > 0) {
            setAchievements(updatedAchievements);
            setNewUnlocks(prev => [...prev, ...newlyUnlocked]);
        }
    }, [achievementProgress]);

    // Track level completion
    const trackLevelComplete = useCallback((stars: number) => {
        setAchievementProgress(prev => updateAchievementProgress(prev, {
            levelsCompleted: prev.levelsCompleted + 1,
            totalStars: prev.totalStars + stars,
            perfectLevels: stars === 3 ? prev.perfectLevels + 1 : prev.perfectLevels
        }));
    }, []);

    // Track score
    const trackScore = useCallback((score: number) => {
        setAchievementProgress(prev => updateAchievementProgress(prev, {
            totalScore: prev.totalScore + score
        }));
    }, []);

    // Track combo
    const trackCombo = useCallback((combo: number) => {
        setAchievementProgress(prev => updateAchievementProgress(prev, {
            maxCombo: Math.max(prev.maxCombo, combo)
        }));
    }, []);

    // Track blocks destroyed
    const trackBlocksDestroyed = useCallback((count: number) => {
        setAchievementProgress(prev => updateAchievementProgress(prev, {
            blocksDestroyed: prev.blocksDestroyed + count
        }));
    }, []);

    // Track obstacles destroyed
    const trackObstaclesDestroyed = useCallback((count: number) => {
        setAchievementProgress(prev => updateAchievementProgress(prev, {
            obstaclesDestroyed: prev.obstaclesDestroyed + count
        }));
    }, []);

    // Track power-up usage
    const trackPowerUpUsage = useCallback((type: 'rocket' | 'bomb' | 'discoBall') => {
        setAchievementProgress(prev => {
            const updates: Partial<AchievementProgress> = {
                totalPowerUpsUsed: prev.totalPowerUpsUsed + 1
            };

            if (type === 'rocket') updates.rocketsUsed = prev.rocketsUsed + 1;
            if (type === 'bomb') updates.bombsUsed = prev.bombsUsed + 1;
            if (type === 'discoBall') updates.discoBallsUsed = prev.discoBallsUsed + 1;

            return updateAchievementProgress(prev, updates);
        });
    }, []);

    // Track quest completion
    const trackQuestComplete = useCallback(() => {
        setAchievementProgress(prev => {
            const today = new Date().toDateString();
            const isStreak = prev.lastQuestDate === new Date(Date.now() - 86400000).toDateString();

            return updateAchievementProgress(prev, {
                questsCompleted: prev.questsCompleted + 1,
                questStreak: isStreak ? prev.questStreak + 1 : 1,
                lastQuestDate: today
            });
        });
    }, []);

    // Clear new unlocks
    const clearNewUnlocks = useCallback(() => {
        setNewUnlocks([]);
    }, []);

    return {
        achievements,
        achievementProgress,
        newUnlocks,
        trackLevelComplete,
        trackScore,
        trackCombo,
        trackBlocksDestroyed,
        trackObstaclesDestroyed,
        trackPowerUpUsage,
        trackQuestComplete,
        clearNewUnlocks
    };
};
