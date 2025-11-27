import { useState } from 'react';
import { GameState, BlockData, LevelConfig, BlockType, ComboData } from '../types';

interface GameStateReturn {
    // State
    gameState: GameState;
    grid: BlockData[][];
    levelConfig: LevelConfig | null;
    score: number;
    movesLeft: number;
    targetsLeft: Partial<Record<BlockType, number>>;
    selectedBlock: { row: number; col: number } | null;
    canInteract: boolean;
    hint: string | null;
    isBotThinking: boolean;
    combo: ComboData;

    // Setters
    setGameState: (state: GameState) => void;
    setGrid: (grid: BlockData[][]) => void;
    setLevelConfig: (config: LevelConfig | null) => void;
    setScore: (score: number | ((prev: number) => number)) => void;
    setMovesLeft: (moves: number) => void;
    setTargetsLeft: (targets: Partial<Record<BlockType, number>>) => void;
    setSelectedBlock: (block: { row: number; col: number } | null) => void;
    setCanInteract: (canInteract: boolean) => void;
    setHint: (hint: string | null) => void;
    setIsBotThinking: (thinking: boolean) => void;
    setCombo: (combo: ComboData | ((prev: ComboData) => ComboData)) => void;

    // Helper functions
    resetGameState: () => void;
    initializeLevel: (config: LevelConfig) => void;
}

export const useGameState = (): GameStateReturn => {
    const [gameState, setGameState] = useState<GameState>(GameState.Menu);
    const [grid, setGrid] = useState<BlockData[][]>([]);
    const [levelConfig, setLevelConfig] = useState<LevelConfig | null>(null);
    const [score, setScore] = useState(0);
    const [movesLeft, setMovesLeft] = useState(0);
    const [targetsLeft, setTargetsLeft] = useState<Partial<Record<BlockType, number>>>({});
    const [selectedBlock, setSelectedBlock] = useState<{ row: number; col: number } | null>(null);
    const [canInteract, setCanInteract] = useState(true);
    const [hint, setHint] = useState<string | null>(null);
    const [isBotThinking, setIsBotThinking] = useState(false);
    const [combo, setCombo] = useState<ComboData>({ level: 0, multiplier: 1, lastMatchTime: 0 });

    const resetGameState = () => {
        setScore(0);
        setMovesLeft(0);
        setTargetsLeft({});
        setSelectedBlock(null);
        setCanInteract(true);
        setHint(null);
        setCombo({ level: 0, multiplier: 1, lastMatchTime: 0 });
    };

    const initializeLevel = (config: LevelConfig) => {
        setLevelConfig(config);
        setScore(0);
        setMovesLeft(config.moves);
        setTargetsLeft({ ...config.targets });
        setHint(null);
        setCanInteract(true);
        setCombo({ level: 0, multiplier: 1, lastMatchTime: 0 });
        setGameState(GameState.Playing);
    };

    return {
        gameState,
        grid,
        levelConfig,
        score,
        movesLeft,
        targetsLeft,
        selectedBlock,
        canInteract,
        hint,
        isBotThinking,
        combo,
        setGameState,
        setGrid,
        setLevelConfig,
        setScore,
        setMovesLeft,
        setTargetsLeft,
        setSelectedBlock,
        setCanInteract,
        setHint,
        setIsBotThinking,
        setCombo,
        resetGameState,
        initializeLevel,
    };
};
