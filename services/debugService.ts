
import { BlockData, BlockType, LevelConfig } from "../types";
import { generateBoard, checkWinCondition, findConnectedBlocks, handleEnvironmentLogic, applyGravity, hasPossibleMoves, shuffleBoard } from "./gameLogic";
import { LEVELS } from "../constants";

export interface TestResult {
  level: number;
  status: 'PASSED' | 'STUCK' | 'FAILED_MOVES' | 'FAILED_TARGETS';
  movesUsed: number;
  movesLimit: number;
  reason?: string;
}

/**
 * Automated Bot that plays the game at high speed to verify levels.
 */
export const runLevelSimulation = (config: LevelConfig): TestResult => {
  // 1. Setup
  let board = generateBoard(config);
  let movesLeft = config.moves;
  let targetsLeft = { ...config.targets };
  let movesUsed = 0;
  let isWin = false;
  let shuffleCount = 0;

  // 2. Game Loop
  while (movesLeft > 0 && !isWin) {
    // Check for deadlock logic
    if (!hasPossibleMoves(board)) {
       let retries = 0;
       let foundMove = false;
       
       // Retry shuffling loop (Try up to 10 times to find a valid move)
       // In a real game, this happens automatically in the loop until valid
       while (retries < 10 && !foundMove) {
         board = shuffleBoard(board);
         shuffleCount++;
         retries++;
         if (hasPossibleMoves(board)) {
            foundMove = true;
         }
       }
       
       if (!foundMove) {
          // If still stuck after 10 consecutive shuffles, that's a real problem (board too crowded)
          return {
            level: config.levelNumber,
            status: 'STUCK',
            movesUsed,
            movesLimit: config.moves,
            reason: `Stuck even after ${shuffleCount} auto-shuffles (Board likely too crowded)`
          };
       }
       // Continue loop with new board without using a move
       continue;
    }

    // AI LOGIC: Find Best Move
    const rows = board.length;
    const cols = board[0].length;
    const visited = new Set<string>();
    let bestMove: { score: number, coords: {row: number, col: number} } | null = null;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const key = `${r},${c}`;
        if (visited.has(key)) continue;
        
        const block = board[r][c];
        if (block.type === BlockType.Empty || block.isFrozen || block.type.includes('STONE') || block.type.includes('CRATE') || block.type.includes('OBSIDIAN')) continue;

        const connected = findConnectedBlocks(board, { row: r, col: c });
        connected.forEach(co => visited.add(`${co.row},${co.col}`));

        if (connected.length >= 2) {
           let score = connected.length;
           // Prioritize Targets
           if (targetsLeft[block.type] && targetsLeft[block.type]! > 0) score += 5;
           
           if (!bestMove || score > bestMove.score) {
             bestMove = { score, coords: { row: r, col: c } };
           }
        }
      }
    }

    if (!bestMove) {
      return { level: config.levelNumber, status: 'STUCK', movesUsed, movesLimit: config.moves, reason: 'Logic error: No moves found despite hasPossibleMoves=true' };
    }

    // Execute Move
    const connected = findConnectedBlocks(board, bestMove.coords);
    const targetType = board[bestMove.coords.row][bestMove.coords.col].type;
    
    // 1. Remove Matched
    let workingBoard = board.map(row => row.map(b => ({ ...b }))); // Deepish copy
    connected.forEach(c => {
        workingBoard[c.row][c.col].type = BlockType.Empty;
    });
    const removedCount = connected.length;

    // 2. Environment
    const { board: envBoard } = handleEnvironmentLogic(workingBoard, connected, config.iceSpreadRate || 0);

    // 3. Gravity
    board = applyGravity(envBoard, config.colorsAvailable);

    movesLeft--;
    movesUsed++;

    // Update Progress
    if (targetsLeft[targetType]) {
      targetsLeft[targetType] = Math.max(0, (targetsLeft[targetType] || 0) - removedCount);
    }

    isWin = checkWinCondition({ targetsLeft }, config.targets);
  }

  if (isWin) {
    return { level: config.levelNumber, status: 'PASSED', movesUsed, movesLimit: config.moves };
  } else {
    return { level: config.levelNumber, status: 'FAILED_MOVES', movesUsed, movesLimit: config.moves, reason: 'Ran out of moves' };
  }
};

export const startBulkTest = async (
  onProgress: (current: number, result: TestResult) => void,
  shouldStop: () => boolean
) => {
  for (let i = 0; i < LEVELS.length; i++) {
     if (shouldStop()) break;
     
     // Yield to main thread
     await new Promise(resolve => setTimeout(resolve, 0));
     
     const result = runLevelSimulation(LEVELS[i]);
     onProgress(i + 1, result);
  }
};