import { useState, useEffect } from 'react';
import { GameState, PlayerProgress, LevelConfig, BlockType } from '../types';
import { DEFAULT_PROGRESS, platformService } from '../services/platformService';
import { audioManager } from '../services/audioManager';
import { calculateLives } from '../services/livesService';

export const useGameState = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.Menu);
    const [progress, setProgress] = useState<PlayerProgress>(DEFAULT_PROGRESS);
    const [levelConfig, setLevelConfig] = useState<LevelConfig | null>(null);
    const [score, setScore] = useState(0);
    const [movesLeft, setMovesLeft] = useState(0);
    const [targetsLeft, setTargetsLeft] = useState<Partial<Record<BlockType, number>>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [combo, setCombo] = useState({ level: 0, multiplier: 1, lastMatchTime: 0 });

    // Initialization
    useEffect(() => {
        const init = async () => {
            const loadedData = await platformService.loadGameData();

            // Daily Login Check
            const today = new Date().toDateString();
            if (loadedData.lastLoginDate !== today) {
                const yesterday = new Date(Date.now() - 86400000).toDateString();
                if (loadedData.lastLoginDate === yesterday) {
                    loadedData.loginStreak += 1;
                } else {
                    loadedData.loginStreak = 1;
                }
                loadedData.lastLoginDate = today;
                loadedData.dailyAdWatchCount = 0;
            }

            // Sanitize lives
            let currentLives = loadedData.lives;
            if (typeof currentLives === 'object') {
                currentLives = (currentLives as any).current || 5;
            }
            loadedData.lives = calculateLives(currentLives, loadedData.lastLifeLostTime, loadedData.unlimitedLivesUntil);

            setProgress(loadedData);
            audioManager.setEnabled(loadedData.soundEnabled);

            setTimeout(() => setIsLoading(false), 1500);
        };
        init();
        audioManager.startMenuMusic();

        return () => audioManager.stopMenuMusic();
    }, []);

    // Save Loop
    useEffect(() => {
        if (progress !== DEFAULT_PROGRESS) {
            platformService.saveGameData(progress);
        }
    }, [progress]);

    return {
        gameState,
        setGameState,
        progress,
        setProgress,
        levelConfig,
        setLevelConfig,
        score,
        setScore,
        movesLeft,
        setMovesLeft,
        targetsLeft,
        setTargetsLeft,
        isLoading,
        setIsLoading,
        combo,
        setCombo
    };
};
