import { useEffect, RefObject } from 'react';
import { PlayerProgress, GameState, ComboData } from '../types';
import { platformService } from '../services/platformService';
import { audioManager } from '../services/audioManager';
import { calculateLives } from '../services/livesService';
import { COMBO_CONFIG } from '../constants';

interface GameEffectsProps {
    progress: PlayerProgress;
    setProgress: (progress: PlayerProgress | ((prev: PlayerProgress) => PlayerProgress)) => void;
    gameState: GameState;
    combo: ComboData;
    setCombo: (combo: ComboData) => void;
    setShowDailyBonus: (show: boolean) => void;
    levelListRef: RefObject<HTMLDivElement>;
    maxLevelReached: number;
}

export const useGameEffects = ({
    progress,
    setProgress,
    gameState,
    combo,
    setCombo,
    setShowDailyBonus,
    levelListRef,
    maxLevelReached,
}: GameEffectsProps) => {
    // Initialization Effect
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

                // Show Bonus
                setTimeout(() => setShowDailyBonus(true), 1000);
            }

            // Calculate lives (regeneration)
            loadedData.lives = calculateLives(loadedData.lives);

            setProgress(loadedData);
            audioManager.setEnabled(loadedData.soundEnabled);
        };

        init();
        audioManager.startMenuMusic();

        return () => audioManager.stopMenuMusic();
    }, [setProgress, setShowDailyBonus]);

    // Save Loop Effect
    useEffect(() => {
        platformService.saveGameData(progress);
    }, [progress]);

    // Auto-scroll Effect
    useEffect(() => {
        if (gameState === GameState.LevelSelect && levelListRef.current) {
            setTimeout(() => {
                if (levelListRef.current) {
                    levelListRef.current.scrollTop = levelListRef.current.scrollHeight;
                }
            }, 100);
        }
    }, [maxLevelReached, gameState, levelListRef]);

    // Combo Timeout Effect
    useEffect(() => {
        if (combo.level > 0 && gameState === GameState.Playing) {
            const timeoutId = setTimeout(() => {
                setCombo({ level: 0, multiplier: 1, lastMatchTime: 0 });
            }, COMBO_CONFIG.TIMEOUT_MS);

            return () => clearTimeout(timeoutId);
        }
    }, [combo.lastMatchTime, combo.level, gameState, setCombo]);
};
