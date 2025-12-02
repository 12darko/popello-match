import React from 'react';
import { Menu, BrainCircuit, Hammer, Shuffle, Loader2 } from 'lucide-react';
import { GameState, BlockType } from '../types';
import { PageTransition } from '../components/effects/PageTransition';
import { DynamicBackground } from '../components/effects/DynamicBackground';
import { EffectsLayer } from '../components/effects/EffectsLayer';
import { ComboCounter, ComboIndicator } from '../components/ComboCounter';
import { LivesIndicator } from '../components/LivesIndicator';
import { LevelGoal } from '../components/LevelGoal';
import { Block } from '../components/Block';
import { TutorialModal } from '../components/modals/TutorialModal';

export const GameScreen: React.FC<any> = ({
    gameState,
    setGameState,
    levelConfig,
    movesLeft,
    progress,
    score,
    targetsLeft,
    grid,
    combo,
    effects,
    canInteract,
    hint,
    isBotThinking,
    showTutorial,
    setShowTutorial,
    handleBlockClick,
    handleBotHint,
    setShowShop,
    t
}) => {
    if (!levelConfig) return null;
    const isWarning = movesLeft <= 3;

    return (
        <PageTransition animation="scale" className="h-full w-full relative flex flex-col">
            <DynamicBackground />
            <EffectsLayer effects={effects} />

            {/* Combo Counter Overlay */}
            <ComboCounter combo={combo} t={t} />

            {/* Header */}
            <div className="p-2 relative z-20 space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <button onClick={() => setGameState(GameState.Menu)} className="bg-indigo-800/80 p-2 rounded-xl border border-indigo-600/50 shadow-lg active:scale-95 transition-transform backdrop-blur-md">
                        <Menu size={20} className="text-indigo-100" />
                    </button>

                    <LivesIndicator
                        lives={progress.lives}
                        onBuyLives={() => setShowShop(true)}
                        t={t}
                        compact={true}
                    />

                    <ComboIndicator combo={combo} t={t} />

                    <div className={`bg-indigo-900/80 px-3 py-1.5 rounded-xl border border-indigo-700/50 shadow-lg flex flex-col items-center backdrop-blur-md transition-all duration-300 ${isWarning ? 'animate-pulse-fast border-red-500 bg-red-900/50' : ''}`}>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${isWarning ? 'text-red-200' : 'text-indigo-300'}`}>{t('moves')}</span>
                        <span className={`text-xl font-black leading-none ${isWarning ? 'text-red-100' : 'text-white'}`}>{movesLeft}</span>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="flex flex-col items-center bg-indigo-900/50 px-4 py-1 rounded-xl border border-indigo-700/30 backdrop-blur-sm">
                        <span className="text-indigo-300 text-[8px] font-black uppercase tracking-widest">{t('level')}</span>
                        <span className="text-2xl font-black text-white leading-none drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]">{levelConfig.levelNumber}</span>
                    </div>
                </div>
            </div>

            {/* Goals Bar */}
            <div className="px-2 mb-1 flex justify-center gap-2 relative z-20">
                {Object.entries(targetsLeft).map(([type, count]) => (
                    <LevelGoal key={type} type={type as BlockType} count={(count as number) || 0} isCompleted={count === 0} />
                ))}
            </div>

            {/* Game Board Area */}
            <div className="flex-1 relative flex items-center justify-center p-2 z-10">
                <div className="relative bg-indigo-950/60 p-2 rounded-[2rem] shadow-2xl border-4 border-indigo-900/50 backdrop-blur-sm w-full max-w-[95vw] aspect-[6/7]">
                    <div className="w-full h-full relative">
                        {grid.map((row: any[], r: number) =>
                            row.map((block, c) => (
                                <Block
                                    key={block.id}
                                    data={block}
                                    onClick={handleBlockClick}
                                    disabled={!canInteract}
                                    gridSize={levelConfig.gridSize}
                                    wiggle={false}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Tools */}
            <div className="p-2 pb-4 relative z-20 flex items-center justify-center gap-3">
                <button
                    onClick={() => handleBotHint(t('language_selector') === 'Dil' ? 'tr' : 'en')}
                    disabled={isBotThinking}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-2xl shadow-[0_4px_0_#3730a3] active:translate-y-1 active:shadow-none disabled:opacity-50 transition-all flex flex-col items-center gap-1"
                >
                    {isBotThinking ? <Loader2 size={24} className="animate-spin" /> : <BrainCircuit size={24} />}
                    <span className="text-xs font-black uppercase">{t('hint')}</span>
                </button>

                <div className="flex gap-2">
                    <button className="bg-indigo-800/50 p-4 rounded-2xl border border-indigo-700 flex flex-col items-center gap-1 relative opacity-50">
                        <Hammer size={20} className="text-red-400" />
                        <span className="text-[10px] font-bold">1</span>
                    </button>
                    <button className="bg-indigo-800/50 p-4 rounded-2xl border border-indigo-700 flex flex-col items-center gap-1 relative opacity-50">
                        <Shuffle size={20} className="text-blue-400" />
                        <span className="text-[10px] font-bold">1</span>
                    </button>
                </div>
            </div>

            {/* Hint Overlay */}
            {hint && (
                <div className="absolute bottom-32 left-0 right-0 flex justify-center z-30 px-6 animate-slide-up pointer-events-none">
                    <div className="bg-indigo-900/90 text-white px-6 py-3 rounded-full shadow-2xl border-2 border-indigo-400 text-center font-bold text-sm flex items-center gap-2 backdrop-blur-md">
                        <BrainCircuit size={16} className="text-yellow-400" />
                        {hint}
                    </div>
                </div>
            )}

            {/* Modals */}
            {showTutorial && <TutorialModal type={showTutorial} onClose={() => {
                setShowTutorial(null);
                const newSeen = { ...progress.seenTutorials, [showTutorial]: true };
                // setProgress handles update in parent
            }} t={t} />}
        </PageTransition>
    );
};
