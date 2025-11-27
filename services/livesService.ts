
/**
 * Lives Service
 * Handles the lives/hearts system (like Candy Crush)
 * Simplified to work with number-based lives in PlayerProgress
 */

import { LIVES_CONFIG } from '../constants';

/**
 * Calculates current lives based on regeneration time
 */
export function calculateLives(currentLives: number, lastLifeLostTime: number = 0, unlimitedLivesUntil: number = 0): number {
    const now = Date.now();

    // Check for unlimited lives
    if (unlimitedLivesUntil > 0 && now < unlimitedLivesUntil) {
        return LIVES_CONFIG.MAX_LIVES;
    }

    // Already at max
    if (currentLives >= LIVES_CONFIG.MAX_LIVES) {
        return LIVES_CONFIG.MAX_LIVES;
    }

    // No regeneration if no lives were lost yet
    if (lastLifeLostTime === 0) {
        return currentLives;
    }

    const timePassed = now - lastLifeLostTime;
    const livesGained = Math.floor(timePassed / LIVES_CONFIG.REGEN_TIME_MS);

    if (livesGained === 0) {
        return currentLives;
    }

    return Math.min(currentLives + livesGained, LIVES_CONFIG.MAX_LIVES);
}

/**
 * Uses one life (when starting a level)
 */
export function useLive(currentLives: number): number {
    return Math.max(0, currentLives - 1);
}

/**
 * Adds lives (from purchase or reward)
 */
export function addLives(currentLives: number, count: number): number {
    return Math.min(currentLives + count, LIVES_CONFIG.MAX_LIVES);
}

/**
 * Buys lives with coins
 */
export function buyLives(
    currentLives: number,
    coins: number,
    count: number
): { success: boolean; newLives: number; newCoins: number } {
    const cost = count * LIVES_CONFIG.COST_PER_LIFE;

    if (coins < cost) {
        return { success: false, newLives: currentLives, newCoins: coins };
    }

    const newLives = addLives(currentLives, count);

    return {
        success: true,
        newLives,
        newCoins: coins - cost
    };
}

/**
 * Gets time remaining until next life regenerates (in milliseconds)
 */
export function getTimeUntilNextLife(currentLives: number, lastLifeLostTime: number): number {
    if (currentLives >= LIVES_CONFIG.MAX_LIVES || lastLifeLostTime === 0) {
        return 0;
    }

    const now = Date.now();
    const timeSinceLastLoss = now - lastLifeLostTime;
    const timeForOneLive = LIVES_CONFIG.REGEN_TIME_MS;
    const timeRemaining = timeForOneLive - (timeSinceLastLoss % timeForOneLive);

    return Math.max(0, timeRemaining);
}

/**
 * Formats time remaining as MM:SS
 */
export function formatTimeRemaining(ms: number): string {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Checks if player can play (has lives)
 */
export function canPlay(currentLives: number, unlimitedLivesUntil: number = 0): boolean {
    if (unlimitedLivesUntil > 0 && Date.now() < unlimitedLivesUntil) {
        return true;
    }
    return currentLives > 0;
}
