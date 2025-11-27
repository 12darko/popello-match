
import { BlockData, BlockType } from "../types";
import { findConnectedBlocks } from "./gameLogic";
import { TRANSLATIONS, BLOCK_STYLES } from "../constants";

/**
 * LOCAL HINT ALGORITHM (Cost Free)
 * 
 * This replaces the Gemini API call with a client-side heuristic.
 * It analyzes the board to find the "Best" move based on:
 * 1. Group size (Larger is better)
 * 2. Target relevance (Does it help finish the level?)
 * 3. Hazard proximity (Does it break nearby crates/stones?)
 */

export const getStrategicHint = async (
  board: BlockData[][],
  targets: Partial<Record<BlockType, number>>,
  movesLeft: number, // Used for urgency calculation if needed
  language: string = 'en'
): Promise<string> => {
  
  // 1. Identify all possible moves
  const rows = board.length;
  const cols = board[0].length;
  const visited = new Set<string>();
  const possibleMoves: { 
    score: number; 
    coords: {r: number, c: number}; 
    type: BlockType; 
    count: number;
    breaksHazards: number;
  }[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r},${c}`;
      const block = board[r][c];

      if (visited.has(key) || 
          block.type === BlockType.Empty || 
          block.isFrozen ||
          block.type === BlockType.Stone ||
          block.type === BlockType.Crate ||
          block.type === BlockType.Obsidian) {
        continue;
      }

      const connected = findConnectedBlocks(board, { row: r, col: c });
      
      // Mark all as visited
      connected.forEach(co => visited.add(`${co.row},${co.col}`));

      if (connected.length >= 2) {
        // SCORING LOGIC
        let score = connected.length; // Base score = size

        // Bonus for Target Relevance
        if (targets[block.type] && targets[block.type]! > 0) {
          score += 5; 
        }

        // Bonus for Hazard Proximity (Breaking Crates, Stones, Ice)
        let hazardBonus = 0;
        const directions = [{ r: -1, c: 0 }, { r: 1, c: 0 }, { r: 0, c: -1 }, { r: 0, c: 1 }];
        
        // Check neighbors of the group
        const groupNeighbors = new Set<string>();
        connected.forEach(co => {
           directions.forEach(d => {
             const nR = co.row + d.r;
             const nC = co.col + d.c;
             if (nR >= 0 && nR < rows && nC >= 0 && nC < cols) {
                // If neighbor is not part of the group
                if (!connected.some(self => self.row === nR && self.col === nC)) {
                   const nBlock = board[nR][nC];
                   if (nBlock.isFrozen || nBlock.type === BlockType.Crate || nBlock.type === BlockType.Stone || nBlock.type === BlockType.Obsidian) {
                      const nKey = `${nR},${nC}`;
                      if (!groupNeighbors.has(nKey)) {
                        hazardBonus++;
                        groupNeighbors.add(nKey);
                      }
                   }
                }
             }
           });
        });

        score += (hazardBonus * 3); // Breaking stuff is very valuable

        possibleMoves.push({
          score,
          coords: { r, c }, // Use the first block as anchor
          type: block.type,
          count: connected.length,
          breaksHazards: hazardBonus
        });
      }
    }
  }

  // 2. Find Best Move
  if (possibleMoves.length === 0) {
    // No moves? usually game handles shuffle, but just in case
    const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
    return t['hint_fallback']; 
  }

  possibleMoves.sort((a, b) => b.score - a.score);
  const bestMove = possibleMoves[0];

  // 3. Construct Localized String
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
  
  // Get localized color name
  const style = BLOCK_STYLES[bestMove.type];
  const colorNameKey = style.nameKey || 'block_fire';
  const colorName = t[colorNameKey] || bestMove.type;

  // Format message based on context
  let message = "";
  
  if (bestMove.breaksHazards > 0) {
    // Hazard focus hint
    message = t['hint_hazard']
      .replace('{color}', colorName)
      .replace('{row}', bestMove.coords.r.toString())
      .replace('{col}', bestMove.coords.c.toString());
  } else {
    // Standard match hint
    message = t['hint_match']
      .replace('{count}', bestMove.count.toString())
      .replace('{color}', colorName)
      .replace('{row}', bestMove.coords.r.toString())
      .replace('{col}', bestMove.coords.c.toString());
  }

  // Fast response (100ms) to feel responsive but not glitchy
  await new Promise(resolve => setTimeout(resolve, 100));

  return message;
};
