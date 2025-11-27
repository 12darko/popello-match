

import { BlockData, BlockType, Coordinates, LevelConfig, PowerUpType } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { shouldCreatePowerUp, determineRocketDirection } from './powerUpService';


const getRandomType = (allowed: BlockType[]): BlockType => {
  return allowed[Math.floor(Math.random() * allowed.length)];
};

// --- PROCEDURAL LEVEL GENERATOR ---
export const generateProceduralLevel = (levelNum: number): LevelConfig => {
  // IMPROVED PROGRESSION ALGORITHM FOR LEVELS 51+
  // Levels 1-50 are manually designed
  // This function generates levels 51+ with smooth difficulty curve

  const levelAbove50 = Math.max(0, levelNum - 50);
  const isHard = levelNum % 5 === 0;
  const isSuperHard = levelNum % 10 === 0;

  // Moves: Gradually decrease but maintain playability
  let moves = 50 - Math.floor(levelAbove50 / 5);
  if (moves < 35) moves = 35; // Minimum moves cap
  if (isHard) moves += 5;
  if (isSuperHard) moves += 10;

  // Grid Size: Max out at 10x9 (same as manual levels)
  const rows = 10;
  const cols = 9;

  // All 5 colors available for levels 51+
  const colorsAvailable = [BlockType.Fire, BlockType.Water, BlockType.Nature, BlockType.Electric, BlockType.Cosmic];

  // Target Generation: Increase difficulty over time
  const targets: Partial<Record<BlockType, number>> = {};
  const numTargets = 2 + (levelNum % 3); // 2-4 targets
  const baseTargetAmount = 40 + Math.floor(levelAbove50 / 2);

  for (let i = 0; i < numTargets; i++) {
    const targetType = colorsAvailable[i % colorsAvailable.length];
    targets[targetType] = baseTargetAmount + (i * 10);
  }

  // Add obstacle targets for variety
  if (levelNum % 3 === 0) {
    targets[BlockType.Crate] = Math.min(8, 4 + Math.floor(levelAbove50 / 10));
  }
  if (levelNum % 4 === 0) {
    targets[BlockType.Stone] = Math.min(7, 3 + Math.floor(levelAbove50 / 15));
  }
  if (levelNum % 5 === 0) {
    targets[BlockType.Obsidian] = Math.min(6, 2 + Math.floor(levelAbove50 / 20));
  }
  if (levelNum % 6 === 0) {
    targets[BlockType.Balloon] = Math.min(7, 3 + Math.floor(levelAbove50 / 12));
  }
  if (levelNum % 7 === 0) {
    targets[BlockType.Cage] = Math.min(6, 3 + Math.floor(levelAbove50 / 15));
  }
  if (levelNum % 8 === 0) {
    targets[BlockType.Honey] = Math.min(6, 3 + Math.floor(levelAbove50 / 15));
  }

  // Hazard Counts: Progressive introduction with caps
  const crateStartCount = Math.min(10, 5 + Math.floor(levelAbove50 / 3));
  const stoneStartCount = Math.min(8, 4 + Math.floor(levelAbove50 / 4));
  const obsidianStartCount = Math.min(6, 2 + Math.floor(levelAbove50 / 8));

  // Ice: Gradually increase spread rate
  const iceStartCount = Math.min(7, 3 + Math.floor(levelAbove50 / 5));
  const iceSpreadRate = Math.min(0.25, 0.15 + (levelAbove50 * 0.005));

  const chainStartCount = Math.min(7, 3 + Math.floor(levelAbove50 / 5));
  const balloonStartCount = Math.min(7, 3 + Math.floor(levelAbove50 / 5));
  const jellyStartCount = Math.min(6, 3 + Math.floor(levelAbove50 / 6));
  const cageStartCount = Math.min(6, 3 + Math.floor(levelAbove50 / 6));
  const honeyStartCount = Math.min(6, 2 + Math.floor(levelAbove50 / 7));
  const vortexStartCount = Math.min(4, 1 + Math.floor(levelAbove50 / 10));

  return {
    levelNumber: levelNum,
    gridSize: { rows, cols },
    moves,
    colorsAvailable,
    targets,
    crateStartCount,
    stoneStartCount,
    obsidianStartCount,
    iceStartCount,
    iceSpreadRate,
    chainStartCount,
    balloonStartCount,
    jellyStartCount,
    cageStartCount,
    honeyStartCount,
    vortexStartCount
  };
};

// --- BOARD GENERATION ---
export const generateBoard = (config: LevelConfig): BlockData[][] => {
  const { gridSize, colorsAvailable, crateStartCount, stoneStartCount, obsidianStartCount, iceStartCount, chainStartCount, balloonStartCount, jellyStartCount, cageStartCount, honeyStartCount, vortexStartCount } = config;
  const grid: BlockData[][] = [];

  // Initialize with random blocks
  for (let row = 0; row < gridSize.rows; row++) {
    grid[row] = [];
    for (let col = 0; col < gridSize.cols; col++) {
      grid[row][col] = {
        id: uuidv4(),
        type: getRandomType(colorsAvailable),
        row,
        col,
        isNew: false
      };
    }
  }

  // Place hazards
  const placeHazard = (type: BlockType, count: number, maxHealth?: number) => {
    let placed = 0;
    while (placed < count) {
      const row = Math.floor(Math.random() * gridSize.rows);
      const col = Math.floor(Math.random() * gridSize.cols);
      if (colorsAvailable.includes(grid[row][col].type)) {
        grid[row][col].type = type;
        if (maxHealth) {
          grid[row][col].health = maxHealth;
          grid[row][col].maxHealth = maxHealth;
        }
        placed++;
      }
    }
  };

  if (crateStartCount) placeHazard(BlockType.Crate, crateStartCount);
  if (stoneStartCount) placeHazard(BlockType.Stone, stoneStartCount);
  if (obsidianStartCount) placeHazard(BlockType.Obsidian, obsidianStartCount, 3);

  // Place ice
  if (iceStartCount) {
    let placed = 0;
    while (placed < iceStartCount) {
      const row = Math.floor(Math.random() * gridSize.rows);
      const col = Math.floor(Math.random() * gridSize.cols);
      if (colorsAvailable.includes(grid[row][col].type)) {
        grid[row][col].isFrozen = true;
        placed++;
      }
    }
  }

  // Place chains
  if (chainStartCount) {
    let placed = 0;
    while (placed < chainStartCount) {
      const row = Math.floor(Math.random() * gridSize.rows);
      const col = Math.floor(Math.random() * gridSize.cols);
      const block = grid[row][col];
      if (colorsAvailable.includes(block.type) && !block.isFrozen) {
        block.chainLevel = 2;
        placed++;
      }
    }
  }

  // Place balloons
  if (balloonStartCount) {
    // Helper for placing hazards
    const placeHazard = (type: BlockType, count: number) => {
      let placed = 0;
      while (placed < count) {
        const row = Math.floor(Math.random() * gridSize.rows);
        const col = Math.floor(Math.random() * gridSize.cols);
        if (colorsAvailable.includes(grid[row][col].type)) {
          grid[row][col].type = type;
          placed++;
        }
      }
    };
    placeHazard(BlockType.Balloon, balloonStartCount);
  }

  // Place jelly
  if (jellyStartCount) {
    let placed = 0;
    while (placed < jellyStartCount) {
      const row = Math.floor(Math.random() * gridSize.rows);
      const col = Math.floor(Math.random() * gridSize.cols);
      const block = grid[row][col];
      if (colorsAvailable.includes(block.type)) {
        block.jellyLevel = 1;
        placed++;
      }
    }
  }

  // Place chains
  if (chainStartCount) {
    let placed = 0;
    while (placed < chainStartCount) {
      const row = Math.floor(Math.random() * gridSize.rows);
      const col = Math.floor(Math.random() * gridSize.cols);
      const block = grid[row][col];
      if (colorsAvailable.includes(block.type) && !block.isFrozen) {
        block.chainLevel = 2;
        placed++;
      }
    }
  }

  // Place balloons
  if (balloonStartCount) {
    // Helper for placing hazards
    const placeHazard = (type: BlockType, count: number) => {
      let placed = 0;
      while (placed < count) {
        const row = Math.floor(Math.random() * gridSize.rows);
        const col = Math.floor(Math.random() * gridSize.cols);
        if (colorsAvailable.includes(grid[row][col].type)) {
          grid[row][col].type = type;
          placed++;
        }
      }
    };
    placeHazard(BlockType.Balloon, balloonStartCount);
  }

  // Place jelly
  if (jellyStartCount) {
    let placed = 0;
    while (placed < jellyStartCount) {
      const row = Math.floor(Math.random() * gridSize.rows);
      const col = Math.floor(Math.random() * gridSize.cols);
      const block = grid[row][col];
      if (colorsAvailable.includes(block.type)) {
        block.jellyLevel = 1;
        placed++;
      }
    }
  }

  // Place cages
  if (cageStartCount) {
    const placeHazard = (type: BlockType, count: number) => {
      let placed = 0;
      while (placed < count) {
        const row = Math.floor(Math.random() * gridSize.rows);
        const col = Math.floor(Math.random() * gridSize.cols);
        if (colorsAvailable.includes(grid[row][col].type)) {
          grid[row][col].type = type;
          placed++;
        }
      }
    };
    placeHazard(BlockType.Cage, cageStartCount);
  }

  // Place honey
  if (honeyStartCount) {
    const placeHazard = (type: BlockType, count: number) => {
      let placed = 0;
      while (placed < count) {
        const row = Math.floor(Math.random() * gridSize.rows);
        const col = Math.floor(Math.random() * gridSize.cols);
        if (colorsAvailable.includes(grid[row][col].type)) {
          grid[row][col].type = type;
          placed++;
        }
      }
    };
    placeHazard(BlockType.Honey, honeyStartCount);
  }

  // Place vortex
  if (vortexStartCount) {
    const placeHazard = (type: BlockType, count: number) => {
      let placed = 0;
      while (placed < count) {
        const row = Math.floor(Math.random() * gridSize.rows);
        const col = Math.floor(Math.random() * gridSize.cols);
        if (colorsAvailable.includes(grid[row][col].type)) {
          grid[row][col].type = type;
          placed++;
        }
      }
    };
    placeHazard(BlockType.Vortex, vortexStartCount);
  }

  return grid;
};

// --- CONNECTED BLOCKS ---
export const findConnectedBlocks = (grid: BlockData[][], start: Coordinates): Coordinates[] => {
  const startBlock = grid[start.row][start.col];
  if (startBlock.type === BlockType.Empty || startBlock.isFrozen) return [];

  const visited = new Set<string>();
  const connected: Coordinates[] = [];
  const queue: Coordinates[] = [start];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const key = `${current.row},${current.col}`;

    if (visited.has(key)) continue;
    visited.add(key);

    const currentBlock = grid[current.row][current.col];
    if (currentBlock.type !== startBlock.type || currentBlock.isFrozen) continue;

    connected.push(current);

    // Check neighbors
    const neighbors = [
      { row: current.row - 1, col: current.col },
      { row: current.row + 1, col: current.col },
      { row: current.row, col: current.col - 1 },
      { row: current.row, col: current.col + 1 }
    ];

    for (const neighbor of neighbors) {
      if (neighbor.row >= 0 && neighbor.row < grid.length &&
        neighbor.col >= 0 && neighbor.col < grid[0].length) {
        queue.push(neighbor);
      }
    }
  }

  return connected;
};

// --- GRAVITY ---
export const applyGravity = (grid: BlockData[][], colorsAvailable: BlockType[]): BlockData[][] => {
  const rows = grid.length;
  const cols = grid[0].length;
  const newGrid: BlockData[][] = Array.from({ length: rows }, () => Array(cols).fill(null));

  for (let col = 0; col < cols; col++) {
    let writeRow = rows - 1;
    for (let row = rows - 1; row >= 0; row--) {
      if (grid[row][col].type !== BlockType.Empty) {
        newGrid[writeRow][col] = { ...grid[row][col], row: writeRow, col };
        writeRow--;
      }
    }

    while (writeRow >= 0) {
      newGrid[writeRow][col] = {
        id: uuidv4(),
        type: getRandomType(colorsAvailable),
        row: writeRow,
        col,
        isNew: true
      };
      writeRow--;
    }
  }

  return newGrid;
};

// --- ENVIRONMENT LOGIC ---
export const handleEnvironmentLogic = (
  grid: BlockData[][],
  matchedPositions: Coordinates[],
  iceSpreadRate: number
): { board: BlockData[][], changes: { row: number, col: number, type: BlockType, isDying: boolean, health?: number }[] } => {
  const newGrid = grid.map(r => r.map(b => ({ ...b })));
  const changes: { row: number, col: number, type: BlockType, isDying: boolean, health?: number }[] = [];

  matchedPositions.forEach(pos => {
    // Check Jelly on current block (Jelly is UNDER the block, so it takes damage when block is cleared)
    const currentBlock = newGrid[pos.row][pos.col];
    if (currentBlock.jellyLevel && currentBlock.jellyLevel > 0) {
      currentBlock.jellyLevel--;
      changes.push({ ...currentBlock, isDying: false }); // Update, not dying
    }

    const neighbors = [
      { row: pos.row - 1, col: pos.col },
      { row: pos.row + 1, col: pos.col },
      { row: pos.row, col: pos.col - 1 },
      { row: pos.row, col: pos.col + 1 }
    ];

    neighbors.forEach(n => {
      if (n.row >= 0 && n.row < grid.length && n.col >= 0 && n.col < grid[0].length) {
        const block = newGrid[n.row][n.col];
        let changed = false;

        if (block.isFrozen) {
          block.isFrozen = false;
          changed = true;
        }

        if (block.chainLevel && block.chainLevel > 0) {
          block.chainLevel--;
          changed = true;
        }

        if (block.type === BlockType.Crate) {
          block.isDying = true; // Mark as dying for animation
          // We don't set to Empty yet, the caller will do that after animation
          changed = true;
        }

        if (block.type === BlockType.Stone) {
          block.isDying = true;
          changed = true;
        }

        if (block.type === BlockType.Balloon) {
          block.isDying = true;
          changed = true;
        }

        if (block.type === BlockType.Cage) {
          block.isDying = true;
          changed = true;
        }

        if (block.type === BlockType.Honey) {
          block.isDying = true;
          changed = true;
        }

        if (block.type === BlockType.Vortex) {
          block.isDying = true;
          changed = true;
        }

        if (block.type === BlockType.Obsidian && block.health) {
          block.health--;
          changed = true;
          if (block.health <= 0) {
            block.isDying = true;
          }
        }

        if (changed) {
          changes.push({
            row: n.row,
            col: n.col,
            type: block.type,
            isDying: block.isDying || false,
            health: block.health
          });
        }
      }
    });
  });

  if (iceSpreadRate > 0 && Math.random() < iceSpreadRate) {
    const unfrozenBlocks: Coordinates[] = [];
    newGrid.forEach((row, r) => {
      row.forEach((block, c) => {
        if (!block.isFrozen && block.type !== BlockType.Empty) {
          unfrozenBlocks.push({ row: r, col: c });
        }
      });
    });

    if (unfrozenBlocks.length > 0) {
      const randomBlock = unfrozenBlocks[Math.floor(Math.random() * unfrozenBlocks.length)];
      newGrid[randomBlock.row][randomBlock.col].isFrozen = true;
      changes.push({
        row: randomBlock.row,
        col: randomBlock.col,
        type: newGrid[randomBlock.row][randomBlock.col].type,
        isDying: false
      });
    }
  }

  return { board: newGrid, changes };
};

// --- POSSIBLE MOVES ---
export const hasPossibleMoves = (grid: BlockData[][]): boolean => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const connected = findConnectedBlocks(grid, { row, col });
      if (connected.length >= 2) return true;
    }
  }
  return false;
};

// --- SHUFFLE ---
export const shuffleBoard = (grid: BlockData[][], colorsAvailable: BlockType[]): BlockData[][] => {
  const flatBlocks: BlockType[] = [];
  grid.forEach(row => {
    row.forEach(block => {
      if (colorsAvailable.includes(block.type)) {
        flatBlocks.push(block.type);
      }
    });
  });

  for (let i = flatBlocks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flatBlocks[i], flatBlocks[j]] = [flatBlocks[j], flatBlocks[i]];
  }

  const newGrid = grid.map(r => r.map(b => ({ ...b })));
  let flatIndex = 0;

  for (let row = 0; row < newGrid.length; row++) {
    for (let col = 0; col < newGrid[0].length; col++) {
      if (colorsAvailable.includes(newGrid[row][col].type)) {
        newGrid[row][col].type = flatBlocks[flatIndex++];
        newGrid[row][col].id = uuidv4();
      }
    }
  }

  return newGrid;
};

// --- POWER-UP CREATION ---
export const createPowerUpAtPosition = (
  grid: BlockData[][],
  position: Coordinates,
  connectedBlocks: Coordinates[]
): BlockData[][] => {
  const newGrid = grid.map(r => r.map(b => ({ ...b })));
  const powerUpType = shouldCreatePowerUp(connectedBlocks);

  if (powerUpType) {
    const block = newGrid[position.row][position.col];
    block.powerUp = powerUpType;
    block.isDying = false;

    if (powerUpType === PowerUpType.Rocket) {
      block.powerUpDirection = determineRocketDirection(connectedBlocks);
    }
  }

  return newGrid;
};

// --- WIN CONDITION ---
export const checkWinCondition = (progress: any, targets: any): boolean => {
  for (const type of Object.keys(targets)) {
    const key = type as BlockType;
    if ((progress.targetsLeft[key] || 0) > 0) {
      return false;
    }
  }
  return true;
};

export const calculateStarRating = (score: number, config: LevelConfig): number => {
  let baseTargetCount = 0;
  if (config.targets) {
    Object.values(config.targets).forEach(val => baseTargetCount += (val || 0));
  }
  const minPassScore = baseTargetCount * 10;
  if (score >= minPassScore * 1.5) return 3;
  if (score >= minPassScore * 1.2) return 2;
  return 1;
};

// --- PRE-GAME BOOSTERS ---
export const placeBoosters = (
  grid: BlockData[][],
  boosters: { rockets?: number; bombs?: number; discoBalls?: number },
  colorsAvailable: BlockType[]
): BlockData[][] => {
  const newGrid = grid.map(r => r.map(b => ({ ...b })));
  const rows = newGrid.length;
  const cols = newGrid[0].length;

  // Place rockets (top corners and edges)
  if (boosters.rockets) {
    const rocketPositions = [
      { row: 0, col: 0 }, // Top-left
      { row: 0, col: cols - 1 }, // Top-right
      { row: Math.floor(rows / 2), col: 0 }, // Mid-left
      { row: Math.floor(rows / 2), col: cols - 1 } // Mid-right
    ];

    for (let i = 0; i < Math.min(boosters.rockets, rocketPositions.length); i++) {
      const pos = rocketPositions[i];
      if (newGrid[pos.row] && newGrid[pos.row][pos.col]) {
        const block = newGrid[pos.row][pos.col];
        // Only place on normal blocks
        if (colorsAvailable.includes(block.type)) {
          block.powerUp = PowerUpType.Rocket;
          block.powerUpDirection = i % 2 === 0 ? 'HORIZONTAL' : 'VERTICAL';
        }
      }
    }
  }

  // Place bombs (center area)
  if (boosters.bombs) {
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);
    const bombPositions = [
      { row: centerRow, col: centerCol },
      { row: centerRow - 1, col: centerCol },
      { row: centerRow + 1, col: centerCol },
      { row: centerRow, col: centerCol - 1 }
    ];

    for (let i = 0; i < Math.min(boosters.bombs, bombPositions.length); i++) {
      const pos = bombPositions[i];
      if (newGrid[pos.row] && newGrid[pos.row][pos.col]) {
        const block = newGrid[pos.row][pos.col];
        if (colorsAvailable.includes(block.type) && !block.powerUp) {
          block.powerUp = PowerUpType.Bomb;
        }
      }
    }
  }

  // Place disco balls (random positions)
  if (boosters.discoBalls) {
    let placed = 0;
    let attempts = 0;
    const maxAttempts = 50;

    while (placed < boosters.discoBalls && attempts < maxAttempts) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      const block = newGrid[row][col];

      if (colorsAvailable.includes(block.type) && !block.powerUp) {
        block.powerUp = PowerUpType.DiscoBall;
        placed++;
      }
      attempts++;
    }
  }

  return newGrid;
};
