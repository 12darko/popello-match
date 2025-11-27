import { Achievement, AchievementCategory, AchievementProgress } from '../types';

// Achievement definitions with premium design in mind
export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'unlocked' | 'progress' | 'unlockedAt'>[] = [
    // Level Achievements - Vibrant gradient rewards
    {
        id: 'first_steps',
        category: AchievementCategory.Levels,
        title: 'First Steps',
        description: 'Complete your first level',
        icon: '🎯',
        target: 1,
        reward: { coins: 50 }
    },
    {
        id: 'getting_started',
        category: AchievementCategory.Levels,
        title: 'Getting Started',
        description: 'Complete 5 levels',
        icon: '🚀',
        target: 5,
        reward: { coins: 100, rockets: 1 }
    },
    {
        id: 'progressing',
        category: AchievementCategory.Levels,
        title: 'Progressing',
        description: 'Complete 10 levels',
        icon: '⭐',
        target: 10,
        reward: { coins: 200, bombs: 1 }
    },
    {
        id: 'dedicated',
        category: AchievementCategory.Levels,
        title: 'Dedicated Player',
        description: 'Complete 25 levels',
        icon: '💎',
        target: 25,
        reward: { coins: 500, rockets: 2, bombs: 2 }
    },
    {
        id: 'master',
        category: AchievementCategory.Levels,
        title: 'Level Master',
        description: 'Complete 50 levels',
        icon: '👑',
        target: 50,
        reward: { coins: 1000, rockets: 3, bombs: 3, discoBalls: 1 }
    },

    // Score Achievements
    {
        id: 'score_hunter',
        category: AchievementCategory.Score,
        title: 'Score Hunter',
        description: 'Reach 10,000 total score',
        icon: '🎲',
        target: 10000,
        reward: { coins: 100 }
    },
    {
        id: 'score_master',
        category: AchievementCategory.Score,
        title: 'Score Master',
        description: 'Reach 50,000 total score',
        icon: '🏆',
        target: 50000,
        reward: { coins: 300, rockets: 1 }
    },
    {
        id: 'score_legend',
        category: AchievementCategory.Score,
        title: 'Score Legend',
        description: 'Reach 100,000 total score',
        icon: '💫',
        target: 100000,
        reward: { coins: 500, bombs: 2 }
    },
    {
        id: 'score_god',
        category: AchievementCategory.Score,
        title: 'Score God',
        description: 'Reach 500,000 total score',
        icon: '🌟',
        target: 500000,
        reward: { coins: 2000, rockets: 5, bombs: 5, discoBalls: 2 }
    },

    // Combo Achievements
    {
        id: 'combo_starter',
        category: AchievementCategory.Combos,
        title: 'Combo Starter',
        description: 'Achieve a 3x combo',
        icon: '🔥',
        target: 3,
        reward: { coins: 50 }
    },
    {
        id: 'combo_expert',
        category: AchievementCategory.Combos,
        title: 'Combo Expert',
        description: 'Achieve a 5x combo',
        icon: '⚡',
        target: 5,
        reward: { coins: 150, rockets: 1 }
    },
    {
        id: 'combo_master',
        category: AchievementCategory.Combos,
        title: 'Combo Master',
        description: 'Achieve a 10x combo',
        icon: '💥',
        target: 10,
        reward: { coins: 300, bombs: 2 }
    },
    {
        id: 'combo_legend',
        category: AchievementCategory.Combos,
        title: 'Combo Legend',
        description: 'Achieve a 15x combo',
        icon: '🌪️',
        target: 15,
        reward: { coins: 500, discoBalls: 1 }
    },

    // Star Achievements
    {
        id: 'star_collector',
        category: AchievementCategory.Stars,
        title: 'Star Collector',
        description: 'Earn 10 stars',
        icon: '⭐',
        target: 10,
        reward: { coins: 100 }
    },
    {
        id: 'star_hunter',
        category: AchievementCategory.Stars,
        title: 'Star Hunter',
        description: 'Earn 50 stars',
        icon: '🌠',
        target: 50,
        reward: { coins: 300, rockets: 2 }
    },
    {
        id: 'star_master',
        category: AchievementCategory.Stars,
        title: 'Star Master',
        description: 'Earn 100 stars',
        icon: '✨',
        target: 100,
        reward: { coins: 600, bombs: 3 }
    },
    {
        id: 'perfect_player',
        category: AchievementCategory.Stars,
        title: 'Perfect Player',
        description: 'Get 3 stars on 10 levels',
        icon: '💯',
        target: 10,
        reward: { coins: 500, discoBalls: 1 }
    },

    // Collection Achievements
    {
        id: 'block_breaker',
        category: AchievementCategory.Collection,
        title: 'Block Breaker',
        description: 'Destroy 1,000 blocks',
        icon: '🧱',
        target: 1000,
        reward: { coins: 200 }
    },
    {
        id: 'block_crusher',
        category: AchievementCategory.Collection,
        title: 'Block Crusher',
        description: 'Destroy 5,000 blocks',
        icon: '💪',
        target: 5000,
        reward: { coins: 500, rockets: 2 }
    },
    {
        id: 'block_destroyer',
        category: AchievementCategory.Collection,
        title: 'Block Destroyer',
        description: 'Destroy 10,000 blocks',
        icon: '💣',
        target: 10000,
        reward: { coins: 1000, bombs: 3 }
    },
    {
        id: 'obstacle_remover',
        category: AchievementCategory.Collection,
        title: 'Obstacle Remover',
        description: 'Destroy 500 obstacles',
        icon: '🛡️',
        target: 500,
        reward: { coins: 400, discoBalls: 1 }
    },

    // Power-Up Achievements
    {
        id: 'rocket_launcher',
        category: AchievementCategory.PowerUps,
        title: 'Rocket Launcher',
        description: 'Use 10 rockets',
        icon: '🚀',
        target: 10,
        reward: { coins: 100 }
    },
    {
        id: 'bomb_squad',
        category: AchievementCategory.PowerUps,
        title: 'Bomb Squad',
        description: 'Use 10 bombs',
        icon: '💣',
        target: 10,
        reward: { coins: 100 }
    },
    {
        id: 'disco_fever',
        category: AchievementCategory.PowerUps,
        title: 'Disco Fever',
        description: 'Use 10 disco balls',
        icon: '🪩',
        target: 10,
        reward: { coins: 150 }
    },
    {
        id: 'power_master',
        category: AchievementCategory.PowerUps,
        title: 'Power Master',
        description: 'Use 50 power-ups total',
        icon: '⚡',
        target: 50,
        reward: { coins: 500, rockets: 2, bombs: 2, discoBalls: 1 }
    },

    // Quest Achievements
    {
        id: 'quest_starter',
        category: AchievementCategory.Quests,
        title: 'Quest Starter',
        description: 'Complete 1 daily quest',
        icon: '📋',
        target: 1,
        reward: { coins: 50 }
    },
    {
        id: 'quest_hunter',
        category: AchievementCategory.Quests,
        title: 'Quest Hunter',
        description: 'Complete 10 daily quests',
        icon: '🎯',
        target: 10,
        reward: { coins: 200, rockets: 1 }
    },
    {
        id: 'quest_master',
        category: AchievementCategory.Quests,
        title: 'Quest Master',
        description: 'Complete 50 daily quests',
        icon: '🏅',
        target: 50,
        reward: { coins: 800, bombs: 3 }
    },
    {
        id: 'perfect_week',
        category: AchievementCategory.Quests,
        title: 'Perfect Week',
        description: 'Complete all quests for 7 days straight',
        icon: '🔥',
        target: 7,
        reward: { coins: 1000, rockets: 3, bombs: 3, discoBalls: 2 }
    }
];

// Initialize achievements
export function initializeAchievements(): Achievement[] {
    return ACHIEVEMENT_DEFINITIONS.map(def => ({
        ...def,
        unlocked: false,
        progress: 0
    }));
}

// Initialize achievement progress
export function initializeAchievementProgress(): AchievementProgress {
    return {
        levelsCompleted: 0,
        totalScore: 0,
        maxCombo: 0,
        totalStars: 0,
        perfectLevels: 0,
        blocksDestroyed: 0,
        obstaclesDestroyed: 0,
        rocketsUsed: 0,
        bombsUsed: 0,
        discoBallsUsed: 0,
        totalPowerUpsUsed: 0,
        questsCompleted: 0,
        questStreak: 0,
        lastQuestDate: ''
    };
}

// Check and unlock achievements
export function checkAchievements(
    achievements: Achievement[],
    progress: AchievementProgress
): {
    updatedAchievements: Achievement[];
    newlyUnlocked: Achievement[];
} {
    const updatedAchievements = [...achievements];
    const newlyUnlocked: Achievement[] = [];

    updatedAchievements.forEach(achievement => {
        if (achievement.unlocked) return;

        let currentProgress = 0;

        // Calculate progress based on category and achievement ID
        switch (achievement.category) {
            case AchievementCategory.Levels:
                currentProgress = progress.levelsCompleted;
                break;
            case AchievementCategory.Score:
                currentProgress = progress.totalScore;
                break;
            case AchievementCategory.Combos:
                currentProgress = progress.maxCombo;
                break;
            case AchievementCategory.Stars:
                if (achievement.id === 'perfect_player') {
                    currentProgress = progress.perfectLevels;
                } else {
                    currentProgress = progress.totalStars;
                }
                break;
            case AchievementCategory.Collection:
                if (achievement.id === 'obstacle_remover') {
                    currentProgress = progress.obstaclesDestroyed;
                } else {
                    currentProgress = progress.blocksDestroyed;
                }
                break;
            case AchievementCategory.PowerUps:
                if (achievement.id === 'rocket_launcher') {
                    currentProgress = progress.rocketsUsed;
                } else if (achievement.id === 'bomb_squad') {
                    currentProgress = progress.bombsUsed;
                } else if (achievement.id === 'disco_fever') {
                    currentProgress = progress.discoBallsUsed;
                } else {
                    currentProgress = progress.totalPowerUpsUsed;
                }
                break;
            case AchievementCategory.Quests:
                if (achievement.id === 'perfect_week') {
                    currentProgress = progress.questStreak;
                } else {
                    currentProgress = progress.questsCompleted;
                }
                break;
        }

        achievement.progress = currentProgress;

        // Check if unlocked
        if (currentProgress >= achievement.target && !achievement.unlocked) {
            achievement.unlocked = true;
            achievement.unlockedAt = Date.now();
            newlyUnlocked.push(achievement);
        }
    });

    return { updatedAchievements, newlyUnlocked };
}

// Update achievement progress
export function updateAchievementProgress(
    current: AchievementProgress,
    updates: Partial<AchievementProgress>
): AchievementProgress {
    return {
        ...current,
        ...updates
    };
}

// Get achievement reward
export function getAchievementReward(achievement: Achievement) {
    return achievement.reward;
}
