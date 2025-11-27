import { PowerUpType, BlockData, BlockType, Coordinates, Inventory } from '../types';
import { POWERUP_CONFIG, ECONOMY } from '../constants';

/**
 * Power-Up Service
 * Handles all power-up related logic
 */

/**
 * Determines if a power-up should be created based on matched blocks count
 */
export function shouldCreatePowerUp(matchedBlocks: Coordinates[]): PowerUpType | null {
    const count = matchedBlocks.length;

    if (count >= POWERUP_CONFIG[PowerUpType.DiscoBall].minBlocks) {
        return PowerUpType.DiscoBall;
    }
    if (count >= POWERUP_CONFIG[PowerUpType.Bomb].minBlocks &&
        count <= POWERUP_CONFIG[PowerUpType.Bomb].maxBlocks) {
        return PowerUpType.Bomb;
    }
    if (count === POWERUP_CONFIG[PowerUpType.Rocket].minBlocks) {
        return PowerUpType.Rocket;
    }
    if (count === POWERUP_CONFIG[PowerUpType.Rainbow].minBlocks) {
        return PowerUpType.Rainbow;
    }

    return null;
}

/**
 * Determines rocket direction based on match pattern
 */
export function determineRocketDirection(matchedBlocks: Coordinates[]): 'HORIZONTAL' | 'VERTICAL' {
    if (matchedBlocks.length < 2) return 'HORIZONTAL';

    // Check if blocks are more horizontal or vertical
    const rows = new Set(matchedBlocks.map(b => b.row));
    const cols = new Set(matchedBlocks.map(b => b.col));

    return cols.size > rows.size ? 'HORIZONTAL' : 'VERTICAL';
}

/**
 * Activates a rocket power-up
 */
export function activateRocket(
    grid: BlockData[][],
    row: number,
    col: number,
    direction: 'HORIZONTAL' | 'VERTICAL'
): Coordinates[] {
    const destroyed: Coordinates[] = [];

    if (direction === 'HORIZONTAL') {
        // Destroy entire row
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[row][c].type !== BlockType.Empty) {
                destroyed.push({ row, col: c });
            }
        }
    } else {
        // Destroy entire column
        for (let r = 0; r < grid.length; r++) {
            if (grid[r][col].type !== BlockType.Empty) {
                destroyed.push({ row: r, col });
            }
        }
    }

    return destroyed;
}

/**
 * Activates a bomb power-up
 */
export function activateBomb(
    grid: BlockData[][],
    row: number,
    col: number
): Coordinates[] {
    const destroyed: Coordinates[] = [];

    // Destroy 3x3 area
    for (let r = Math.max(0, row - 1); r <= Math.min(grid.length - 1, row + 1); r++) {
        for (let c = Math.max(0, col - 1); c <= Math.min(grid[0].length - 1, col + 1); c++) {
            if (grid[r][c].type !== BlockType.Empty) {
                destroyed.push({ row: r, col: c });
            }
        }
    }

    return destroyed;
}

/**
 * Activates a disco ball power-up
 */
export function activateDiscoBall(
    grid: BlockData[][],
    targetColor: BlockType
): Coordinates[] {
    const destroyed: Coordinates[] = [];

    // Destroy all blocks of the same color
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (grid[r][c].type === targetColor && targetColor !== BlockType.Empty) {
                destroyed.push({ row: r, col: c });
            }
        }
    }

    return destroyed;
}

/**
 * Checks if player has enough power-ups in inventory
 */
export function hasPowerUp(inventory: Inventory, type: PowerUpType): boolean {
    switch (type) {
        case PowerUpType.Rocket:
            return inventory.rockets > 0;
        case PowerUpType.Bomb:
            return inventory.bombs > 0;
        case PowerUpType.DiscoBall:
            return inventory.discoBalls > 0;
        case PowerUpType.Rainbow:
            return inventory.rainbows > 0;
        default:
            return false;
    }
}

/**
 * Uses a power-up from inventory
 */
export function usePowerUp(inventory: Inventory, type: PowerUpType): Inventory {
    const newInventory = { ...inventory };

    switch (type) {
        case PowerUpType.Rocket:
            newInventory.rockets = Math.max(0, newInventory.rockets - 1);
            break;
        case PowerUpType.Bomb:
            newInventory.bombs = Math.max(0, newInventory.bombs - 1);
            break;
        case PowerUpType.DiscoBall:
            newInventory.discoBalls = Math.max(0, newInventory.discoBalls - 1);
            break;
        case PowerUpType.Rainbow:
            newInventory.rainbows = Math.max(0, newInventory.rainbows - 1);
            break;
    }

    return newInventory;
}

/**
 * Buys a power-up with coins
 */
export function buyPowerUp(
    inventory: Inventory,
    coins: number,
    type: PowerUpType
): { success: boolean; newInventory: Inventory; newCoins: number } {
    const cost = ECONOMY.POWERUP_COSTS[type];

    if (coins < cost) {
        return { success: false, newInventory: inventory, newCoins: coins };
    }

    const newInventory = { ...inventory };

    switch (type) {
        case PowerUpType.Rocket:
            newInventory.rockets += 1;
            break;
        case PowerUpType.Bomb:
            newInventory.bombs += 1;
            break;
        case PowerUpType.DiscoBall:
            newInventory.discoBalls += 1;
            break;
        case PowerUpType.Rainbow:
            newInventory.rainbows += 1;
            break;
    }

    return {
        success: true,
        newInventory,
        newCoins: coins - cost
    };
}

/**
 * Calculates score bonus for power-up activation
 */
export function getPowerUpScore(type: PowerUpType, blocksDestroyed: number): number {
    const baseBonus = ECONOMY.POWERUP_COSTS[type] / 2; // Half the cost as bonus
    const blockBonus = blocksDestroyed * 15; // 15 points per block

    return Math.floor(baseBonus + blockBonus);
}
