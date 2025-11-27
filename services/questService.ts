
import { Quest, QuestType, DailyQuests, BlockType, PowerUpType } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Quest templates with difficulty tiers
const QUEST_TEMPLATES = {
    easy: [
        {
            type: QuestType.CollectBlocks,
            description: '50 blok topla',
            target: 50,
            reward: { coins: 100 }
        },
        {
            type: QuestType.WinLevels,
            description: '2 level kazan',
            target: 2,
            reward: { coins: 150 }
        },
        {
            type: QuestType.UsePowerUps,
            description: '3 güç kullan',
            target: 3,
            reward: { coins: 100, rockets: 1 }
        }
    ],
    medium: [
        {
            type: QuestType.DestroyObstacles,
            description: '15 engel yok et',
            target: 15,
            reward: { coins: 200 }
        },
        {
            type: QuestType.GetStars,
            description: '5 yıldız topla',
            target: 5,
            reward: { coins: 250, bombs: 1 }
        },
        {
            type: QuestType.CreateCombos,
            description: '8 kombo yap',
            target: 8,
            reward: { coins: 300 }
        }
    ],
    hard: [
        {
            type: QuestType.WinLevels,
            description: '5 level kazan',
            target: 5,
            reward: { coins: 400, discoBalls: 1 }
        },
        {
            type: QuestType.ReachScore,
            description: 'Bir levelde 15,000 puan al',
            target: 15000,
            reward: { coins: 500 }
        },
        {
            type: QuestType.WinWithoutBoosters,
            description: 'Booster kullanmadan 3 level kazan',
            target: 3,
            reward: { coins: 450, rockets: 2, bombs: 1 }
        }
    ]
};

// Generate 3 daily quests (1 easy, 1 medium, 1 hard)
export function generateDailyQuests(): Quest[] {
    const quests: Quest[] = [];

    // Pick one from each difficulty
    const easyQuest = QUEST_TEMPLATES.easy[Math.floor(Math.random() * QUEST_TEMPLATES.easy.length)];
    const mediumQuest = QUEST_TEMPLATES.medium[Math.floor(Math.random() * QUEST_TEMPLATES.medium.length)];
    const hardQuest = QUEST_TEMPLATES.hard[Math.floor(Math.random() * QUEST_TEMPLATES.hard.length)];

    [easyQuest, mediumQuest, hardQuest].forEach(template => {
        quests.push({
            id: uuidv4(),
            type: template.type,
            description: template.description,
            target: template.target,
            progress: 0,
            reward: template.reward,
            completed: false,
            claimed: false
        });
    });

    return quests;
}

// Check if quests should refresh (new day)
export function shouldRefreshQuests(lastRefreshDate: string): boolean {
    const today = new Date().toDateString();
    const lastRefresh = new Date(lastRefreshDate).toDateString();
    return today !== lastRefresh;
}

// Update quest progress
export function updateQuestProgress(
    quests: Quest[],
    type: QuestType,
    amount: number = 1
): Quest[] {
    return quests.map(quest => {
        if (quest.type === type && !quest.completed) {
            const newProgress = Math.min(quest.progress + amount, quest.target);
            return {
                ...quest,
                progress: newProgress,
                completed: newProgress >= quest.target
            };
        }
        return quest;
    });
}

// Claim quest reward
export function claimQuestReward(quest: Quest): {
    coins: number;
    rockets: number;
    bombs: number;
    discoBalls: number;
} {
    return {
        coins: quest.reward.coins || 0,
        rockets: quest.reward.rockets || 0,
        bombs: quest.reward.bombs || 0,
        discoBalls: quest.reward.discoBalls || 0
    };
}

// Initialize daily quests
export function initializeDailyQuests(): DailyQuests {
    return {
        quests: generateDailyQuests(),
        lastRefreshDate: new Date().toISOString(),
        completedToday: 0
    };
}

// Refresh quests if needed
export function refreshQuestsIfNeeded(dailyQuests: DailyQuests): DailyQuests {
    if (shouldRefreshQuests(dailyQuests.lastRefreshDate)) {
        return {
            quests: generateDailyQuests(),
            lastRefreshDate: new Date().toISOString(),
            completedToday: 0
        };
    }
    return dailyQuests;
}
