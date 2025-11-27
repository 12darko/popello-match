import React from 'react';
import { GameState, LevelConfig, BlockData, BlockType, Effect, ComboData } from '../../types';
import { DynamicBackground } from '../effects/DynamicBackground';
import { EffectsLayer } from '../effects/EffectsLayer';
import { ComboCounter, ComboIndicator } from '../ComboCounter';
import { LevelGoal } from '../LevelGoal';
import { LivesIndicator } from '../LivesIndicator';
import { Block } from '../Block';
import { Menu, Heart, BrainCircuit, Hammer, Shuffle, Zap } from 'lucide-react';

interface PlayingScreenProps {
    levelConfig: LevelConfig;
    grid: BlockData[][];
    effects: Effect[];
    combo: ComboData;
    movesLeft: number;
    score: number;
    targetsLeft: Partial<Record<BlockType, number>>;
    lives: number;
    lastLifeLostTime: number;
    unlimitedLivesUntil: number;
    canInteract: boolean;
    hint: string | null;
    isBotThinking: boolean;
    onBlockClick: (row: number, col: number) => void;
    onMenuClick: () => void;
    onBotHint: () => void;
    onUseHammer: () => void;
    onUseShuffle: () => void;
    t: (key: string) => string;
}

export const PlayingScreen: React.FC<PlayingScreenProps> = ({
    levelConfig,
    grid,
    effects,
    combo,
    movesLeft,
    score,
    targetsLeft,
    lives,
    lastLifeLostTime,
    unlimitedLivesUntil,
    canInteract,
    hint,
    isBotThinking,
    onBlockClick,
    onMenuClick,
    onBotHint,
    onUseHammer,
    onUseShuffle,
    t
}) => {
    const isWarning = movesLeft <= 3;

    return (
        <div className="h-full w-full relative flex flex-col">
            <DynamicBackground />
            <EffectsLayer effects={effects} />
            <ComboCounter combo={combo} t={t} />

            {/* Header */}
            <div className="p-2 relative z-20 space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <button onClick={onMenuClick} className="bg-indigo-800/80 p-2 rounded-xl border border-indigo-600/50 shadow-lg active:scale-95 transition-transform backdrop-blur-md">
                        <Menu size={20} className="text-white" />
                    </button>

                    <LivesIndicator
                        lives={lives}
                        lastLifeLostTime={lastLifeLostTime}
                        unlimitedLivesUntil={unlimitedLivesUntil}
                        t={t}
                        compact={false}
                    />
                    <ComboIndicator combo={combo} />

                    <div className={`px-3 py-1.5 rounded-xl font-black text-sm border-2 backdrop-blur-md ${isWarning ? 'bg-red-500/80 border-red-400 text-white animate-pulse' : 'bg-indigo-800/80 border-indigo-600/50 text-white'}`}>
                        {movesLeft} {t('moves')}
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <LevelGoal targets={levelConfig.targets} current={targetsLeft} t={t} />
                    <div className="bg-black/30 px-3 py-1.5 rounded-xl font-black text-white text-sm backdrop-blur-md border border-white/10">
                        {score.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Game Board */}
            <div className="flex-1 flex items-center justify-center p-2 relative z-10">
                <div className="grid gap-1 p-2 bg-black/20 rounded-3xl border-2 border-white/10 backdrop-blur-sm shadow-2xl"
                    style={{
                        gridTemplateColumns: `repeat(${levelConfig.gridSize.cols}, 1fr)`,
                        maxWidth: '400px',
                        aspectRatio: `${levelConfig.gridSize.cols}/${levelConfig.gridSize.rows}`
                    }}>
                    {grid.map((row, r) => row.map((block, c) => (
                        <Block
                            key={`${r}-${c}`}
                            block={block}
                            onClick={() => onBlockClick(r, c)}
                            disabled={!canInteract}
                        />
                    )))}
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-2 flex gap-2 relative z-20">
                <button onClick={onBotHint} disabled={isBotThinking} className="flex-1 bg-purple-600/80 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all disabled:opacity-50 backdrop-blur-md border border-purple-500/50">
                    <BrainCircuit size={20} />
                    {isBotThinking ? t('thinking') : t('hint')}
                </button>
                <button onClick={onUseHammer} className="bg-red-500/80 p-3 rounded-2xl shadow-lg active:scale-95 transition-transform backdrop-blur-md border border-red-400/50">
                    <Hammer size={20} className="text-white" />
                </button>
                <button onClick={onUseShuffle} className="bg-blue-500/80 p-3 rounded-2xl shadow-lg active:scale-95 transition-transform backdrop-blur-md border border-blue-400/50">
                    <Shuffle size={20} className="text-white" />
                </button>
            </div>

            {hint && (
                <div className="absolute bottom-20 left-4 right-4 bg-purple-900/95 p-4 rounded-2xl border-2 border-purple-500 shadow-2xl z-30 animate-fade-in backdrop-blur-md">
                    <div className="flex items-start gap-3">
                        <Zap size={24} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                        <p className="text-white text-sm leading-relaxed">{hint}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
