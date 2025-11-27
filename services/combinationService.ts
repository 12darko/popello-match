import { PowerUpType, PowerUpCombination, BlockData, BlockType, Coordinates } from '../types';
import { activateRocket, activateBomb, activateDiscoBall } from './powerUpService';

/**
 * Power-Up Combination Service
 * Handles detection and activation of power-up combinations
 */

/**
 * Detects what combination would be created from two power-ups
 */
export function detectCombination(
    type1: PowerUpType | undefined,
    type2: PowerUpType | undefined
): PowerUpCombination | null {
    if (!type1 || !type2) return null;

    // Rocket + Rocket = Cross Blast
    if (type1 === PowerUpType.Rocket && type2 === PowerUpType.Rocket) {
        return PowerUpCombination.CrossBlast;
    }
    // Rocket + Bomb = Triple Line
    if ((type1 === PowerUpType.Rocket && type2 === PowerUpType.Bomb) ||
        (type1 === PowerUpType.Bomb && type2 === PowerUpType.Rocket)) {
        return PowerUpCombination.TripleLine;
    }
    // Rocket + Disco = Color Rockets
    if ((type1 === PowerUpType.Rocket && type2 === PowerUpType.DiscoBall) ||
        (type1 === PowerUpType.DiscoBall && type2 === PowerUpType.Rocket)) {
        return PowerUpCombination.ColorRockets;
    }
    // Bomb + Bomb = Mega Bomb
    if (type1 === PowerUpType.Bomb && type2 === PowerUpType.Bomb) {
        return PowerUpCombination.MegaBomb;
    }
    // Bomb + Disco = Color Bombs
    if ((type1 === PowerUpType.Bomb && type2 === PowerUpType.DiscoBall) ||
        (type1 === PowerUpType.DiscoBall && type2 === PowerUpType.Bomb)) {
        return PowerUpCombination.ColorBombs;
    }
    // Disco + Disco = Board Clear
    if (type1 === PowerUpType.DiscoBall && type2 === PowerUpType.DiscoBall) {
        return PowerUpCombination.BoardClear;
    }

    return null;
}

/**
 * Activates a power-up combination
 */
export function activateCombination(
    combination: PowerUpCombination,
    grid: BlockData[][],
    row: number,
    col: number,
    targetColor?: BlockType
): Coordinates[] {
    const destroyed: Coordinates[] = [];

    switch (combination) {
        case PowerUpCombination.CrossBlast:
            // Rocket + Rocket: Destroy entire row AND column
            destroyed.push(...activateRocket(grid, row, col, 'HORIZONTAL'));
            destroyed.push(...activateRocket(grid, row, col, 'VERTICAL'));
            break;

        case PowerUpCombination.MegaBomb:
            // Bomb + Bomb: Destroy 5x5 area
            for (let r = Math.max(0, row - 2); r <= Math.min(grid.length - 1, row + 2); r++) {
                for (let c = Math.max(0, col - 2); c <= Math.min(grid[0].length - 1, col + 2); c++) {
                    if (grid[r][c].type !== BlockType.Empty) {
                        destroyed.push({ row: r, col: c });
                    }
                }
            }
            break;

        case PowerUpCombination.BoardClear:
            // Disco + Disco: Clear entire board
            for (let r = 0; r < grid.length; r++) {
                for (let c = 0; c < grid[0].length; c++) {
                    if (grid[r][c].type !== BlockType.Empty) {
                        destroyed.push({ row: r, col: c });
                    }
                }
            }
            break;

        case PowerUpCombination.TripleLine:
            // Rocket + Bomb: 3 horizontal rows
            destroyed.push(...activateRocket(grid, row, col, 'HORIZONTAL'));
            if (row > 0) {
                destroyed.push(...activateRocket(grid, row - 1, col, 'HORIZONTAL'));
            }
            if (row < grid.length - 1) {
                destroyed.push(...activateRocket(grid, row + 1, col, 'HORIZONTAL'));
            }
            break;

        case PowerUpCombination.ColorRockets:
            // Rocket + Disco: All blocks of target color become rockets
            if (targetColor) {
                for (let r = 0; r < grid.length; r++) {
                    for (let c = 0; c < grid[0].length; c++) {
                        if (grid[r][c].type === targetColor) {
                            // Activate rocket from each position (alternating directions)
                            const direction = (r + c) % 2 === 0 ? 'HORIZONTAL' : 'VERTICAL';
                            destroyed.push(...activateRocket(grid, r, c, direction));
                        }
                    }
                }
            }
            break;

        case PowerUpCombination.ColorBombs:
            // Bomb + Disco: All blocks of target color explode
            if (targetColor) {
                for (let r = 0; r < grid.length; r++) {
                    for (let c = 0; c < grid[0].length; c++) {
                        if (grid[r][c].type === targetColor) {
                            destroyed.push(...activateBomb(grid, r, c));
                        }
                    }
                }
            }
            break;
    }

    // Remove duplicates
    const unique = destroyed.filter((coord, index, self) =>
        index === self.findIndex(c => c.row === coord.row && c.col === coord.col)
    );

    return unique;
}

/**
 * Finds adjacent power-up to a given position
 */
export function findAdjacentPowerUp(
    grid: BlockData[][],
    row: number,
    col: number
): { row: number; col: number; powerUp: PowerUpType } | null {
    const neighbors = [
        { row: row - 1, col },
        { row: row + 1, col },
        { row, col: col - 1 },
        { row, col: col + 1 }
    ];

    for (const neighbor of neighbors) {
        if (neighbor.row >= 0 && neighbor.row < grid.length &&
            neighbor.col >= 0 && neighbor.col < grid[0].length) {
            const block = grid[neighbor.row][neighbor.col];
            if (block.powerUp) {
                return {
                    row: neighbor.row,
                    col: neighbor.col,
                    powerUp: block.powerUp
                };
            }
        }
    }

    return null;
}
