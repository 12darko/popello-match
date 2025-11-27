import { BlockData, LevelConfig, BlockType, Coordinates, PowerUpType, PlayerProgress, ComboData } from '../types';
import { findConnectedBlocks, applyGravity, createPowerUpAtPosition, handleEnvironmentLogic } from '../services/gameLogic';
import { activateRocket, activateBomb, activateDiscoBall, shouldCreatePowerUp } from '../services/powerUpService';
import { detectCombination, activateCombination, findAdjacentPowerUp } from '../services/combinationService';
import { audioManager } from '../services/audioManager';
import { platformService } from '../services/platformService';
import { COMBO_CONFIG, BLOCK_STYLES } from '../constants';

interface BlockClickResult {
    newGrid: BlockData[][];
    scoreGain: number;
    newCombo: ComboData;
    shouldContinue: boolean;
}

export const handleBlockClick = async (
    row: number,
    col: number,
    grid: BlockData[][],
    levelConfig: LevelConfig,
    canInteract: boolean,
    progress: PlayerProgress,
    combo: ComboData,
    addEffect: (type: 'PARTICLE' | 'TEXT', x: number, y: number, content?: string, color?: string) => void,
    onGridUpdate?: (grid: BlockData[][]) => void
): Promise<BlockClickResult | null> => {
    if (!canInteract) return null;

    const clickedBlock = grid[row][col];
    if (clickedBlock.type === BlockType.Empty || clickedBlock.isFrozen) {
        audioManager.playClick();
        return null;
    }

    // Handle power-up click
    if (clickedBlock.powerUp) {
        let blocksToDestroy: Coordinates[] = [];
        let isCombo = false;

        const adjacent = findAdjacentPowerUp(grid, row, col);
        if (adjacent) {
            const comboType = detectCombination(clickedBlock.powerUp, adjacent.powerUp);
            if (comboType) {
                isCombo = true;
                audioManager.playBomb(); // Combo activation
                if (progress.hapticsEnabled) platformService.vibrate(50);
                blocksToDestroy = activateCombination(comboType, grid, row, col, clickedBlock.type);
                blocksToDestroy.push({ row, col });
                blocksToDestroy.push({ row: adjacent.row, col: adjacent.col });
            }
        }

        if (!isCombo) {
            if (progress.hapticsEnabled) platformService.vibrate(30);

            switch (clickedBlock.powerUp) {
                case PowerUpType.Rocket:
                    audioManager.playRocket();
                    blocksToDestroy = activateRocket(grid, row, col, clickedBlock.powerUpDirection || 'HORIZONTAL');
                    break;
                case PowerUpType.Bomb:
                    audioManager.playBomb();
                    blocksToDestroy = activateBomb(grid, row, col);
                    break;
                case PowerUpType.DiscoBall:
                    audioManager.playDiscoBall();
                    blocksToDestroy = activateDiscoBall(grid, clickedBlock.type);
                    break;
            }
        }

        const newGrid = grid.map(r => r.map(b => ({ ...b })));
        blocksToDestroy.forEach(pos => {
            newGrid[pos.row][pos.col].isDying = true;
        });

        // Handle environment logic for power-ups too (optional, but good for consistency)
        // For now, let's focus on the match logic as requested, but power-ups should also break boxes.
        // The current power-up logic destroys blocks directly. We might need to enhance this later.

        if (onGridUpdate) onGridUpdate(newGrid.map(r => r.map(b => ({ ...b }))));

        await new Promise(resolve => setTimeout(resolve, 400));

        blocksToDestroy.forEach(pos => {
            newGrid[pos.row][pos.col].type = BlockType.Empty;
            newGrid[pos.row][pos.col].isDying = false;
            newGrid[pos.row][pos.col].powerUp = undefined;
        });

        const gravityBoard = applyGravity(newGrid, levelConfig.colorsAvailable);
        const powerUpScore = blocksToDestroy.length * 15;

        return {
            newGrid: gravityBoard,
            scoreGain: powerUpScore,
            newCombo: combo,
            shouldContinue: true
        };
    }

    // Handle normal block click
    const connected = findConnectedBlocks(grid, { row, col });

    if (connected.length < 2) {
        audioManager.playClick();
        return null;
    }

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

    const newGrid = grid.map(r => r.map(b => ({ ...b })));
    let scoreGain = 0;
    const center = connected[0];

    // Mark matched blocks as dying
    connected.forEach(pos => {
        newGrid[pos.row][pos.col].isDying = true;
        scoreGain += 10;
    });
    scoreGain += (connected.length - 2) * 5;
    scoreGain = Math.floor(scoreGain * newCombo.multiplier);

    // Handle Environment Logic (Break Crates, etc.)
    const { changes } = handleEnvironmentLogic(newGrid, connected, levelConfig.iceSpreadRate || 0);

    // Apply environmental changes (animations first)
    changes.forEach(change => {
        const block = newGrid[change.row][change.col];
        if (change.isDying) {
            block.isDying = true;
            // Play obstacle-specific sound
            switch (block.type) {
                case BlockType.Crate:
                    audioManager.playCrateBreak();
                    break;
                case BlockType.Stone:
                    audioManager.playStoneBreak();
                    break;
                case BlockType.Obsidian:
                    if (change.health && change.health > 0) {
                        audioManager.playObsidianHit();
                    } else {
                        audioManager.playStoneBreak();
                    }
                    break;
                case BlockType.Balloon:
                    audioManager.playBalloonPop();
                    break;
                case BlockType.Cage:
                    audioManager.playCageBreak();
                    break;
                case BlockType.Honey:
                    audioManager.playHoneyClear();
                    break;
            }
            // Add effect for breaking obstacle
            const baseX = (change.col / levelConfig.gridSize.cols) * 100 + 5;
            const baseY = (change.row / levelConfig.gridSize.rows) * 100;
            const style = BLOCK_STYLES[block.type];
            if (style) {
                addEffect('PARTICLE', baseX, baseY, undefined, style.color);
            }
        }
        // Update other props like health or frozen state immediately for visual feedback if needed
        // But for 'isDying', we wait.
        if (change.health !== undefined) block.health = change.health;
        if (change.type !== undefined && !change.isDying) block.type = change.type; // Immediate type change if not dying (e.g. ice melt?)
        // Actually, for ice, we usually just remove the overlay. 
        // Let's trust the 'changes' object.
        if (change.type && change.type !== block.type && !change.isDying) {
            block.type = change.type;
        }
        // Update frozen state
        const originalBlock = grid[change.row][change.col];
        if (originalBlock.isFrozen && !change.isDying && change.type === originalBlock.type) {
            block.isFrozen = false; // It was frozen, now it's not (implied by handleEnvironmentLogic logic)
        }
    });

    if (onGridUpdate) onGridUpdate(newGrid.map(r => r.map(b => ({ ...b }))));

    // Effects for matched blocks
    addEffect('TEXT', (center.col / levelConfig.gridSize.cols) * 100 + 5, (center.row / levelConfig.gridSize.rows) * 100, `+${scoreGain}`);
    connected.forEach(pos => {
        const blockColor = BLOCK_STYLES[grid[pos.row][pos.col].type].color;
        const baseX = (pos.col / levelConfig.gridSize.cols) * 100 + 5;
        const baseY = (pos.row / levelConfig.gridSize.rows) * 100;

        for (let i = 0; i < 3; i++) {
            if (Math.random() > 0.2) {
                addEffect('PARTICLE', baseX, baseY, undefined, blockColor);
            }
        }
    });

    await new Promise(resolve => setTimeout(resolve, 300));

    const powerUpType = shouldCreatePowerUp(connected);
    let finalGrid = newGrid;

    // Apply final state changes (remove dying blocks)
    // First, remove matched blocks
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
            finalGrid[pos.row][pos.col].type = BlockType.Empty;
            finalGrid[pos.row][pos.col].isDying = false;
        });
    }

    // Apply environmental removals
    changes.forEach(change => {
        if (change.isDying) {
            finalGrid[change.row][change.col].type = BlockType.Empty;
            finalGrid[change.row][change.col].isDying = false;
        } else {
            // Apply other non-dying changes permanently
            Object.assign(finalGrid[change.row][change.col], change);
        }
    });

    const gravityBoard = applyGravity(finalGrid, levelConfig.colorsAvailable);

    return {
        newGrid: gravityBoard,
        scoreGain,
        newCombo,
        shouldContinue: true
    };
};
