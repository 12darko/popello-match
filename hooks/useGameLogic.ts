import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GameState, BlockData, LevelConfig, BlockType, PowerUpType, Coordinates, Effect } from '../types';
import { LEVELS, BLOCK_STYLES, COMBO_CONFIG } from '../constants';
import { generateBoard, findConnectedBlocks, applyGravity, checkWinCondition, handleEnvironmentLogic, hasPossibleMoves, shuffleBoard, calculateStarRating, generateProceduralLevel, createPowerUpAtPosition, placeBoosters } from '../services/gameLogic';
import { activateRocket, activateBomb, activateDiscoBall, shouldCreatePowerUp } from '../services/powerUpService';
import { detectCombination, activateCombination, findAdjacentPowerUp } from '../services/combinationService';
import { getStrategicHint } from '../services/geminiService';
import { audioManager } from '../services/audioManager';
import { platformService } from '../services/platformService';
import { checkForTutorials } from '../services/tutorialService';

export const useGameLogic = (gameStateProps: any) => {
    const {
        gameState, setGameState,
        progress, setProgress,
        levelConfig, setLevelConfig,
        score, setScore,
        movesLeft, setMovesLeft,
        targetsLeft, setTargetsLeft,
        combo, setCombo
    } = gameStateProps;

    const [grid, setGrid] = useState<BlockData[][]>([]);
    const [selectedBlock, setSelectedBlock] = useState<{ row: number; col: number } | null>(null);
    const [canInteract, setCanInteract] = useState(true);
    const [hint, setHint] = useState<string | null>(null);
    const [isBotThinking, setIsBotThinking] = useState(false);
    const [effects, setEffects] = useState<Effect[]>([]);
    const [showTutorial, setShowTutorial] = useState<string | null>(null);
    const [showRateUs, setShowRateUs] = useState(false);

    // Helper for effects
    const addEffect = useCallback((type: 'TEXT' | 'PARTICLE', col: number, row: number, content?: string, color?: string) => {
        const effectType = type === 'TEXT' ? 'score' : 'match';

        // Calculate position percentages
        const gridRows = levelConfig?.gridSize.rows || 8;
        const gridCols = levelConfig?.gridSize.cols || 8;
        const xPct = (col / gridCols) * 100 + (100 / gridCols) / 2;
        const yPct = (row / gridRows) * 100 + (100 / gridRows) / 2;

        if (type === 'TEXT') {
            const id = uuidv4();
            setEffects(prev => [...prev, {
                id,
                type: effectType,
                col,
                row,
                x: xPct,
                y: yPct,
                text: content,
                color
            }]);
            setTimeout(() => setEffects(prev => prev.filter(e => e.id !== id)), 1000);
        } else {
            // Particle Burst
            const particles = Array.from({ length: 8 }).map(() => ({
                id: uuidv4(),
                type: 'match' as const,
                col,
                row,
                x: xPct,
                y: yPct,
                dx: (Math.random() - 0.5) * 200, // Spread
                dy: (Math.random() - 0.5) * 200,
                color
            }));

            setEffects(prev => [...prev, ...particles]);

            // Cleanup particles
            setTimeout(() => {
                const ids = particles.map(p => p.id);
                setEffects(prev => prev.filter(e => !ids.includes(e.id)));
            }, 1000);
        }
    }, [levelConfig]);

    // Combo timeout
    useEffect(() => {
        if (combo.level > 0 && gameState === GameState.Playing) {
            const timeoutId = setTimeout(() => {
                setCombo({ level: 0, multiplier: 1, lastMatchTime: 0 });
            }, COMBO_CONFIG.TIMEOUT_MS);

            return () => clearTimeout(timeoutId);
        }
    }, [combo.level, combo.lastMatchTime, gameState, setCombo]);

    const startGame = (config: LevelConfig, boosters?: { rockets?: number; bombs?: number; discoBalls?: number }) => {
        audioManager.stopMenuMusic();
        setLevelConfig(config);
        setScore(0);
        setMovesLeft(config.moves);
        setTargetsLeft({ ...config.targets });
        setHint(null);
        setCanInteract(true);
        setCombo({ level: 0, multiplier: 1, lastMatchTime: 0 });
        setGameState(GameState.Playing);

        let newBoard = generateBoard(config);

        // Place boosters if any selected
        if (boosters && (boosters.rockets || boosters.bombs || boosters.discoBalls)) {
            newBoard = placeBoosters(newBoard, boosters, config.colorsAvailable);

            // Deduct from inventory
            setProgress((p: any) => ({
                ...p,
                inventory: {
                    ...p.inventory,
                    rockets: (p.inventory.rockets || 0) - (boosters.rockets || 0),
                    bombs: (p.inventory.bombs || 0) - (boosters.bombs || 0),
                    discoBalls: (p.inventory.discoBalls || 0) - (boosters.discoBalls || 0)
                }
            }));
        }

        setGrid(newBoard);

        // Check for Tutorials
        const tutorialType = checkForTutorials(config, progress.seenTutorials);
        if (tutorialType) {
            setShowTutorial(tutorialType);
        }
    };

    const handleLevelComplete = async (finalScore: number) => {
        if (!levelConfig) return;

        audioManager.playWin();
        if (progress.hapticsEnabled) platformService.vibrate(100);

        const stars = calculateStarRating(finalScore, levelConfig);

        // Update Progress
        const newProgress = { ...progress };
        newProgress.levelScores[levelConfig.levelNumber] = Math.max(
            newProgress.levelScores[levelConfig.levelNumber] || 0,
            stars
        );
        newProgress.totalScore += finalScore;
        newProgress.coins += 50; // Win bonus

        if (levelConfig.levelNumber === newProgress.maxLevelReached) {
            newProgress.maxLevelReached = newProgress.maxLevelReached + 1;
        }
        setProgress(newProgress);
        platformService.saveGameData(newProgress);

        setGameState(GameState.Won);

        // Rate Us logic
        if (levelConfig.levelNumber === 5 && !localStorage.getItem('popello_rated')) {
            setTimeout(() => setShowRateUs(true), 2000);
        }

        // Show Interstitial Ad (if not premium)
        if (!progress.adsRemoved && levelConfig.levelNumber % 3 === 0) {
            await platformService.showInterstitialAd(false);
        }
    };

    const handleBlockClick = async (row: number, col: number) => {
        if (!canInteract || !levelConfig) return;

        const clickedBlock = grid[row][col];
        if (clickedBlock.type === BlockType.Empty || clickedBlock.isFrozen) {
            audioManager.playClick();
            return;
        }

        // Check if clicking a power-up
        if (clickedBlock.powerUp) {
            setCanInteract(false);

            let blocksToDestroy: Coordinates[] = [];
            let isCombo = false;

            // Check for combination
            const adjacent = findAdjacentPowerUp(grid, row, col);
            if (adjacent) {
                const comboType = detectCombination(clickedBlock.powerUp, adjacent.powerUp);
                if (comboType) {
                    isCombo = true;
                    audioManager.playPop();
                    if (progress.hapticsEnabled) platformService.vibrate(50);

                    // Activate combination
                    blocksToDestroy = activateCombination(comboType, grid, row, col, clickedBlock.type);

                    // Ensure both power-ups are destroyed
                    blocksToDestroy.push({ row, col });
                    blocksToDestroy.push({ row: adjacent.row, col: adjacent.col });
                }
            }

            if (!isCombo) {
                audioManager.playPop();
                if (progress.hapticsEnabled) platformService.vibrate(30);

                // Activate power-up based on type
                switch (clickedBlock.powerUp) {
                    case PowerUpType.Rocket:
                        blocksToDestroy = activateRocket(grid, row, col, clickedBlock.powerUpDirection || 'HORIZONTAL');
                        break;
                    case PowerUpType.Bomb:
                        blocksToDestroy = activateBomb(grid, row, col);
                        break;
                    case PowerUpType.DiscoBall:
                        blocksToDestroy = activateDiscoBall(grid, clickedBlock.type);
                        break;
                }
            }

            // Mark blocks as dying
            const newGrid = grid.map(r => r.map(b => ({ ...b })));
            blocksToDestroy.forEach(pos => {
                if (newGrid[pos.row] && newGrid[pos.row][pos.col]) {
                    newGrid[pos.row][pos.col].isDying = true;
                }
            });

            setGrid(newGrid);

            // Wait for animation
            await new Promise(resolve => setTimeout(resolve, 400));

            // Remove blocks
            blocksToDestroy.forEach(pos => {
                if (newGrid[pos.row] && newGrid[pos.row][pos.col]) {
                    newGrid[pos.row][pos.col].type = BlockType.Empty;
                    newGrid[pos.row][pos.col].isDying = false;
                    newGrid[pos.row][pos.col].powerUp = undefined;
                }
            });

            // Apply gravity
            const gravityBoard = applyGravity(newGrid, levelConfig.colorsAvailable);
            setGrid(gravityBoard);

            // Update score
            const powerUpScore = blocksToDestroy.length * 15;
            setScore((prev: number) => prev + powerUpScore);

            setCanInteract(true);
            return;
        }

        const connected = findConnectedBlocks(grid, { row, col });

        if (connected.length < 2) {
            audioManager.playClick();
            return;
        }

        setCanInteract(false);
        audioManager.playPop();
        if (progress.hapticsEnabled) platformService.vibrate(15);

        // Update combo
        const now = Date.now();
        const timeSinceLastMatch = now - combo.lastMatchTime;
        let newCombo = { ...combo };

        if (timeSinceLastMatch < COMBO_CONFIG.TIMEOUT_MS && combo.level > 0) {
            newCombo.level = Math.min(newCombo.level + 1, COMBO_CONFIG.MULTIPLIERS.length - 1);
            newCombo.multiplier = COMBO_CONFIG.MULTIPLIERS[newCombo.level];
        } else {
            newCombo.level = 1;
            newCombo.multiplier = COMBO_CONFIG.MULTIPLIERS[1];
        }
        newCombo.lastMatchTime = now;
        setCombo(newCombo);

        if (newCombo.level > 1) {
            audioManager.playCombo(newCombo.level);
        }

        if (newCombo.level > progress.comboRecord) {
            setProgress((p: any) => ({ ...p, comboRecord: newCombo.level }));
        }

        // 1. Remove Blocks
        const newGrid = grid.map(r => r.map(b => ({ ...b })));
        let scoreGain = 0;
        const center = connected[0];

        connected.forEach(pos => {
            const block = newGrid[pos.row][pos.col];
            block.isDying = true;
            scoreGain += 10;
        });
        scoreGain += (connected.length - 2) * 5;

        // Apply combo multiplier
        scoreGain = Math.floor(scoreGain * newCombo.multiplier);

        // FX
        addEffect('TEXT', center.col, center.row, `+${scoreGain}`);
        connected.forEach(pos => {
            if (Math.random() > 0.7) addEffect('PARTICLE', pos.col, pos.row, undefined, BLOCK_STYLES[grid[pos.row][pos.col].type].color);
        });

        setGrid(newGrid);
        setScore((prev: number) => prev + scoreGain);

        // Wait for pop animation
        await new Promise(resolve => setTimeout(resolve, 300));

        // 2. Check if should create power-up
        const powerUpType = shouldCreatePowerUp(connected);
        let finalGrid = newGrid;

        if (powerUpType && connected.length >= 5) {
            finalGrid = createPowerUpAtPosition(newGrid, { row, col }, connected);

            connected.forEach(pos => {
                if (pos.row !== row || pos.col !== col) {
                    finalGrid[pos.row][pos.col].type = BlockType.Empty;
                    finalGrid[pos.row][pos.col].isDying = false;
                }
            });
        } else {
            connected.forEach(pos => {
                newGrid[pos.row][pos.col].type = BlockType.Empty;
                newGrid[pos.row][pos.col].isDying = false;
            });
        }

        const { board: envBoard, changes: envChanges } = handleEnvironmentLogic(finalGrid, connected, levelConfig.iceSpreadRate);

        if (envChanges.length > 0) {
            audioManager.playIceCrack();
            if (progress.hapticsEnabled) platformService.vibrate(30);
        }

        // 3. Gravity & Refill
        const gravityBoard = applyGravity(envBoard, levelConfig.colorsAvailable);
        setGrid(gravityBoard);

        // 4. Update Game State
        const newMoves = movesLeft - 1;
        setMovesLeft(newMoves);

        const newTargets = { ...targetsLeft };
        const targetType = grid[row][col].type;
        if (newTargets[targetType]) {
            newTargets[targetType] = Math.max(0, newTargets[targetType]! - connected.length);
        }
        setTargetsLeft(newTargets);

        setHint(null);

        // 5. Check Win/Loss
        if (checkWinCondition({ targetsLeft: newTargets }, levelConfig.targets)) {
            setCanInteract(false);
            setTimeout(() => handleLevelComplete(score + scoreGain), 600);
            return;
        }

        if (newMoves <= 0) {
            setCanInteract(false);
            setTimeout(() => setGameState(GameState.OutOfMoves), 600);
            return;
        }

        // 6. Check for deadlocks
        if (!hasPossibleMoves(gravityBoard)) {
            setTimeout(async () => {
                const shuffled = shuffleBoard(gravityBoard, levelConfig.colorsAvailable);
                setGrid(shuffled);
                audioManager.playPurchase();
            }, 1000);
        }

        setCanInteract(true);
    };

    const handleBotHint = async (lang: string) => {
        if (isBotThinking || hint) return;
        setIsBotThinking(true);

        try {
            const hintText = await getStrategicHint(grid, targetsLeft, movesLeft, lang);
            setHint(hintText);
        } catch (e) {
            setHint("Try matching at the bottom!");
        } finally {
            setIsBotThinking(false);
        }
    };

    const handleRevive = () => {
        if (progress.coins >= 200) {
            setProgress((p: any) => ({ ...p, coins: p.coins - 200 }));
            setMovesLeft((prev: number) => prev + 5);
            setGameState(GameState.Playing);
            setCanInteract(true);
            audioManager.playPurchase();
        }
    };

    return {
        grid, setGrid,
        selectedBlock, setSelectedBlock,
        canInteract, setCanInteract,
        hint, setHint,
        isBotThinking, setIsBotThinking,
        effects, setEffects,
        showTutorial, setShowTutorial,
        showRateUs, setShowRateUs,
        startGame,
        handleBlockClick,
        handleBotHint,
        handleRevive,
        addEffect
    };
};
