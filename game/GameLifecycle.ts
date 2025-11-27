import { LevelConfig, PlayerProgress, GameState, BlockData } from '../types';
import { generateBoard, placeBoosters, calculateStarRating } from '../services/gameLogic';
import { audioManager } from '../services/audioManager';
import { platformService } from '../services/platformService';

export const startGame = (
    config: LevelConfig,
    boosters?: { rockets?: number; bombs?: number; discoBalls?: number },
    currentInventory?: { rockets: number; bombs: number; discoBalls: number; hammers: number; shuffles: number; rainbows: number }
): { newBoard: BlockData[][], updatedProgress?: Partial<PlayerProgress> } => {
    audioManager.stopMenuMusic();

    let newBoard = generateBoard(config);

    let updatedProgress: Partial<PlayerProgress> | undefined;

    if (boosters && currentInventory && (boosters.rockets || boosters.bombs || boosters.discoBalls)) {
        newBoard = placeBoosters(newBoard, boosters, config.colorsAvailable);

        // Deduct boosters from inventory
        updatedProgress = {
            inventory: {
                ...currentInventory,
                rockets: currentInventory.rockets - (boosters.rockets || 0),
                bombs: currentInventory.bombs - (boosters.bombs || 0),
                discoBalls: currentInventory.discoBalls - (boosters.discoBalls || 0)
            }
        };
    }

    return { newBoard, updatedProgress };
};

export const handleLevelComplete = async (
    finalScore: number,
    levelConfig: LevelConfig,
    progress: PlayerProgress
): Promise<PlayerProgress> => {
    audioManager.playWin();
    if (progress.hapticsEnabled) platformService.vibrate(100);

    const stars = calculateStarRating(finalScore, levelConfig);

    const newProgress = { ...progress };
    newProgress.levelScores[levelConfig.levelNumber] = Math.max(
        newProgress.levelScores[levelConfig.levelNumber] || 0,
        stars
    );
    newProgress.totalScore += finalScore;
    newProgress.coins += 50;

    if (levelConfig.levelNumber === newProgress.maxLevelReached) {
        newProgress.maxLevelReached = newProgress.maxLevelReached + 1;
    }

    platformService.saveGameData(newProgress);

    // Show Interstitial Ad
    if (!progress.adsRemoved && levelConfig.levelNumber % 3 === 0) {
        await platformService.showInterstitialAd(false);
    }

    return newProgress;
};
