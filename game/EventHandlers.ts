import { LevelConfig, PlayerProgress, GameState } from '../types';
import { getStrategicHint } from '../services/geminiService';
import { LEVELS } from '../constants';
import { canPlay, useLive } from '../services/livesService';

export const handleRevive = (
    progress: PlayerProgress,
    setProgress: (p: PlayerProgress | ((prev: PlayerProgress) => PlayerProgress)) => void,
    setMovesLeft: (moves: number) => void,
    setGameState: (state: GameState) => void,
    setCanInteract: (can: boolean) => void
) => {
    const cost = 200;
    if (progress.coins >= cost) {
        setProgress(p => ({ ...p, coins: p.coins - cost }));
        setMovesLeft(5);
        setGameState(GameState.Playing);
        setCanInteract(true);
    }
};

export const handleBotHint = async (
    grid: any,
    targetsLeft: any,
    movesLeft: number,
    setIsBotThinking: (thinking: boolean) => void,
    setHint: (hint: string | null) => void
) => {
    setIsBotThinking(true);
    const hintText = await getStrategicHint(grid, targetsLeft, movesLeft);
    setHint(hintText || null);
    setIsBotThinking(false);
    setTimeout(() => setHint(null), 8000);
};

export const handleLevelSelect = (
    levelNum: number,
    progress: PlayerProgress,
    setPendingLevelConfig: (config: LevelConfig | null) => void,
    setShowPreGameBoosters: (show: boolean) => void,
    setShowOutOfLives: (show: boolean) => void,
    startGame: (config: LevelConfig) => void
) => {
    const config = LEVELS.find(l => l.levelNumber === levelNum);
    if (!config) return;

    if (!canPlay(progress.lives, progress.unlimitedLivesUntil)) {
        setShowOutOfLives(true);
        return;
    }

    setPendingLevelConfig(config);
    setShowPreGameBoosters(true);
};

export const confirmStartGame = (
    pendingLevelConfig: LevelConfig | null,
    boosters: any,
    progress: PlayerProgress,
    setProgress: (p: PlayerProgress | ((prev: PlayerProgress) => PlayerProgress)) => void,
    setShowPreGameBoosters: (show: boolean) => void,
    startGame: (config: LevelConfig, boosters?: any) => void
) => {
    if (!pendingLevelConfig) return;

    // Use a life and update lastLifeLostTime
    setProgress(p => ({
        ...p,
        lives: useLive(p.lives),
        lastLifeLostTime: Date.now()
    }));
    setShowPreGameBoosters(false);
    startGame(pendingLevelConfig, boosters);
};
