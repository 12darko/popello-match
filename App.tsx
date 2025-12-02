


import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, BlockData, LevelConfig, LevelProgress, BlockType, PlayerProgress, Inventory, Effect, PowerUpType, ComboData, Coordinates } from './types';
import { LEVELS, BLOCK_STYLES, TRANSLATIONS, POWERUP_CONFIG, COMBO_CONFIG } from './constants';

import { generateBoard, findConnectedBlocks, applyGravity, checkWinCondition, handleEnvironmentLogic, hasPossibleMoves, shuffleBoard, calculateStarRating, generateProceduralLevel, createPowerUpAtPosition, placeBoosters } from './services/gameLogic';
import { activateRocket, activateBomb, activateDiscoBall, shouldCreatePowerUp } from './services/powerUpService';
import { detectCombination, activateCombination, findAdjacentPowerUp } from './services/combinationService';
import { calculateLives, useLive, canPlay, buyLives, addLives } from './services/livesService';
import { getStrategicHint } from './services/geminiService';
import { audioManager } from './services/audioManager';
import { platformService, DEFAULT_PROGRESS } from './services/platformService';
import { Block } from './components/Block';
import { LevelGoal } from './components/LevelGoal';
import { LivesIndicator, OutOfLivesModal } from './components/LivesIndicator';
import { ComboCounter, ComboIndicator } from './components/ComboCounter';
import { PreGameBoostersModal } from './components/PreGameBoostersModal';


import { RotateCcw, Play, Crown, BrainCircuit, Menu, Settings, ShoppingCart, Hammer, Shuffle, Coins, Gamepad2, X, Check, Star, Volume2, VolumeX, Zap, Trash2, Video, FlaskConical, Info, Bug, CreditCard, ShieldCheck, Calendar, Heart, Loader2, Smartphone, ExternalLink, ThumbsUp, Globe, Wrench } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Extracted components
import { EffectsLayer } from './components/effects/EffectsLayer';
import { DynamicBackground } from './components/effects/DynamicBackground';
import { Confetti } from './components/effects/Confetti';
import { TutorialModal } from './components/modals/TutorialModal';
import { AdModal } from './components/modals/AdModal';
import { RateUsModal } from './components/modals/RateUsModal';
import { ReviveModal } from './components/modals/ReviveModal';
import { DailyBonusModal } from './components/modals/DailyBonusModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { ShopModal } from './components/modals/ShopModal';
import { useLanguage } from './hooks/useLanguage';
import { DailyQuestsModal } from './components/DailyQuestsModal';
import { useQuestTracking } from './hooks/useQuestTracking';
import { AchievementsModal } from './components/modals/AchievementsModal';
import { useAchievementTracking } from './hooks/useAchievementTracking';
import { initializeAchievements } from './services/achievementService';
import { TournamentModal } from './components/modals/TournamentModal';
import { initializeTournament, shouldStartNewTournament } from './services/tournamentService';
import { checkForTutorials } from './services/tutorialService';
import { useBoosterMode } from './hooks/useBoosterMode';
import { MockAdModal } from './components/modals/MockAdModal';
import { MockPaymentModal } from './components/modals/MockPaymentModal';
import { PageTransition } from './components/effects/PageTransition';
import { LoadingScreen } from './components/LoadingScreen'; // NEW // NEW // NEW


const App: React.FC = () => {
  // STATE
  const [isLoading, setIsLoading] = useState(true); // NEW
  const [gameState, setGameState] = useState<GameState>(GameState.Menu);
  const [grid, setGrid] = useState<BlockData[][]>([]);
  const [progress, setProgress] = useState<PlayerProgress>(DEFAULT_PROGRESS);
  const [levelConfig, setLevelConfig] = useState<LevelConfig | null>(null);
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(0);
  const [targetsLeft, setTargetsLeft] = useState<Partial<Record<BlockType, number>>>({});
  const [selectedBlock, setSelectedBlock] = useState<{ row: number; col: number } | null>(null);
  const [canInteract, setCanInteract] = useState(true);
  const [hint, setHint] = useState<string | null>(null);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [effects, setEffects] = useState<Effect[]>([]);
  const [activeBooster, setActiveBooster] = useState<'HAMMER' | null>(null);

  // NEW: Combo System
  const [combo, setCombo] = useState<ComboData>({ level: 0, multiplier: 1, lastMatchTime: 0 });

  // Modals
  const [showSettings, setShowSettings] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showDailyBonus, setShowDailyBonus] = useState(false);
  const [showRateUs, setShowRateUs] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false); // NEW
  const [paymentSku, setPaymentSku] = useState<string | null>(null); // NEW
  const [showTutorial, setShowTutorial] = useState<string | null>(null);
  const [isProcessingIAP, setIsProcessingIAP] = useState(false);
  const [showOutOfLives, setShowOutOfLives] = useState(false); // NEW
  const [showPreGameBoosters, setShowPreGameBoosters] = useState(false);
  const [pendingLevelConfig, setPendingLevelConfig] = useState<LevelConfig | null>(null);
  const [showDailyQuests, setShowDailyQuests] = useState(false); // NEW: Daily Quests Modal
  const [showAchievements, setShowAchievements] = useState(false); // NEW: Achievements Modal
  const [showTournament, setShowTournament] = useState(false); // NEW: Tournament Modal
  const { lang, setLanguage, t } = useLanguage();
  const levelListRef = useRef<HTMLDivElement>(null);

  // NEW: Quest Tracking Hook - Temporarily disabled to fix crashes
  const questTracking = {
    handleClaimQuest: (questId: string) => {
      console.log('Quest claimed:', questId);
    }
  };

  // NEW: Booster Mode Hook
  const boosterMode = {
    activateHammer: () => {
      if (progress.inventory.hammers > 0) {
        setActiveBooster('HAMMER');
        // Optional: Show toast or visual cue
      }
    },
    activateShuffle: () => {
      if (progress.inventory.shuffles > 0 && levelConfig) {
        const shuffled = shuffleBoard(grid, levelConfig.colorsAvailable);
        setGrid(shuffled);
        audioManager.playPurchase();
        setProgress(p => ({
          ...p,
          inventory: { ...p.inventory, shuffles: p.inventory.shuffles - 1 }
        }));
      }
    }
  };

  // NEW: Achievement Tracking Hook - Temporarily disabled
  const achievementTracking = {
    trackProgress: () => { }
  };

  // Initialization
  useEffect(() => {
    const init = async () => {
      const loadedData = await platformService.loadGameData();

      // Daily Login Check
      const today = new Date().toDateString();
      if (loadedData.lastLoginDate !== today) {
        // Logic for streak
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (loadedData.lastLoginDate === yesterday) {
          loadedData.loginStreak += 1;
        } else {
          loadedData.loginStreak = 1;
        }
        loadedData.lastLoginDate = today;
        // Reset Ad Watch count
        loadedData.dailyAdWatchCount = 0;

        // Show Bonus
        setTimeout(() => setShowDailyBonus(true), 1000);
      }

      // NEW: Calculate lives (regeneration)
      // FIX: Sanitize lives data if it's corrupted (object instead of number)
      let currentLives = loadedData.lives;
      if (typeof currentLives === 'object') {
        currentLives = (currentLives as any).current || 5;
      }
      loadedData.lives = calculateLives(currentLives, loadedData.lastLifeLostTime, loadedData.unlimitedLivesUntil);

      setProgress(loadedData);
      audioManager.setEnabled(loadedData.soundEnabled);

      // Simulate a minimum loading time for the splash screen effect
      setTimeout(() => setIsLoading(false), 1500);
    };
    init();
    audioManager.startMenuMusic();

    return () => audioManager.stopMenuMusic();
  }, []);

  // Save Loop
  useEffect(() => {
    if (progress !== DEFAULT_PROGRESS) {
      platformService.saveGameData(progress);
    }
  }, [progress]);

  // Auto-scroll to new levels
  useEffect(() => {
    if (gameState === GameState.LevelSelect && levelListRef.current) {
      // Small delay to allow render
      setTimeout(() => {
        if (levelListRef.current) {
          levelListRef.current.scrollTop = levelListRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [progress.maxLevelReached, gameState]);

  // Lives Regeneration Timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (progress.lives < 5) {
        const newLives = calculateLives(progress.lives, progress.lastLifeLostTime, progress.unlimitedLivesUntil);
        if (newLives > progress.lives) {
          setProgress(p => ({ ...p, lives: newLives }));
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [progress.lives, progress.lastLifeLostTime, progress.unlimitedLivesUntil]);

  // Helper for effects
  // Helper for effects
  const addEffect = (type: 'TEXT' | 'PARTICLE', col: number, row: number, content?: string, color?: string) => {
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
  };

  // NEW: Combo timeout - reset combo after 3 seconds of inactivity
  useEffect(() => {
    if (combo.level > 0 && gameState === GameState.Playing) {
      const timeoutId = setTimeout(() => {
        setCombo({ level: 0, multiplier: 1, lastMatchTime: 0 });
      }, COMBO_CONFIG.TIMEOUT_MS);

      return () => clearTimeout(timeoutId);
    }
  }, [combo.level, combo.lastMatchTime, gameState]);

  // --- GAME LOOP ---
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
      setProgress(p => ({
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

  const handleBlockClick = async (row: number, col: number) => {
    if (!canInteract || !levelConfig) return;

    const clickedBlock = grid[row][col];
    if (clickedBlock.type === BlockType.Empty || clickedBlock.isFrozen) {
      audioManager.playClick();
      return;
    }

    // HAMMER LOGIC
    if (activeBooster === 'HAMMER') {
      audioManager.playPop(); // Smash sound
      if (progress.hapticsEnabled) platformService.vibrate(50);

      const newGrid = grid.map(r => r.map(b => ({ ...b })));
      newGrid[row][col].type = BlockType.Empty;

      // Apply gravity
      const gravityBoard = applyGravity(newGrid, levelConfig.colorsAvailable);
      setGrid(gravityBoard);

      // Deduct inventory
      setProgress(p => ({
        ...p,
        inventory: { ...p.inventory, hammers: p.inventory.hammers - 1 }
      }));

      setActiveBooster(null);
      return;
    }

    // NEW: Check if clicking a power-up
    if (clickedBlock.powerUp) {
      setCanInteract(false);

      let blocksToDestroy: Coordinates[] = [];
      let isCombo = false;

      // NEW: Check for combination
      const adjacent = findAdjacentPowerUp(grid, row, col);
      if (adjacent) {
        const combo = detectCombination(clickedBlock.powerUp, adjacent.powerUp);
        if (combo) {
          isCombo = true;
          audioManager.playPop(); // TODO: Add special combo sound
          if (progress.hapticsEnabled) platformService.vibrate(50);

          // Activate combination
          blocksToDestroy = activateCombination(combo, grid, row, col, clickedBlock.type);

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
        newGrid[pos.row][pos.col].isDying = true;
      });

      setGrid(newGrid);

      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 400));

      // Remove blocks
      blocksToDestroy.forEach(pos => {
        newGrid[pos.row][pos.col].type = BlockType.Empty;
        newGrid[pos.row][pos.col].isDying = false;
        newGrid[pos.row][pos.col].powerUp = undefined;
      });

      // Apply gravity
      const gravityBoard = applyGravity(newGrid, levelConfig.colorsAvailable);
      setGrid(gravityBoard);

      // Update score
      const powerUpScore = blocksToDestroy.length * 15;
      setScore(prev => prev + powerUpScore);

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

    // NEW: Update combo
    const now = Date.now();
    const timeSinceLastMatch = now - combo.lastMatchTime;
    let newCombo = { ...combo };

    if (timeSinceLastMatch < COMBO_CONFIG.TIMEOUT_MS && combo.level > 0) {
      // Continue combo
      newCombo.level = Math.min(newCombo.level + 1, COMBO_CONFIG.MULTIPLIERS.length - 1);
      newCombo.multiplier = COMBO_CONFIG.MULTIPLIERS[newCombo.level];
    } else {
      // Start new combo
      newCombo.level = 1;
      newCombo.multiplier = COMBO_CONFIG.MULTIPLIERS[1];
    }
    newCombo.lastMatchTime = now;
    setCombo(newCombo);

    // Play combo sound if level increased
    if (newCombo.level > 1) {
      audioManager.playCombo(newCombo.level);
    }

    // Update combo record
    if (newCombo.level > progress.comboRecord) {
      setProgress(p => ({ ...p, comboRecord: newCombo.level }));
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

    // NEW: Apply combo multiplier
    scoreGain = Math.floor(scoreGain * newCombo.multiplier);

    // FX
    addEffect('TEXT', (center.col / levelConfig.gridSize.cols) * 100 + 5, (center.row / levelConfig.gridSize.rows) * 100, `+${scoreGain}`);
    connected.forEach(pos => {
      if (Math.random() > 0.7) addEffect('PARTICLE', (pos.col / levelConfig.gridSize.cols) * 100 + 5, (pos.row / levelConfig.gridSize.rows) * 100, undefined, BLOCK_STYLES[grid[pos.row][pos.col].type].color);
    });

    setGrid(newGrid);
    setScore(prev => prev + scoreGain);

    // Wait for pop animation
    await new Promise(resolve => setTimeout(resolve, 300));

    // 2. Check if should create power-up
    const powerUpType = shouldCreatePowerUp(connected);
    let finalGrid = newGrid;

    if (powerUpType && connected.length >= 5) {
      // Create power-up at click position instead of removing
      finalGrid = createPowerUpAtPosition(newGrid, { row, col }, connected);

      // Remove other blocks but keep the power-up block
      connected.forEach(pos => {
        if (pos.row !== row || pos.col !== col) {
          finalGrid[pos.row][pos.col].type = BlockType.Empty;
          finalGrid[pos.row][pos.col].isDying = false;
        }
      });
    } else {
      // Normal removal
      connected.forEach(pos => {
        newGrid[pos.row][pos.col].type = BlockType.Empty;
        newGrid[pos.row][pos.col].isDying = false;
      });
    }

    const { board: envBoard, changes: envChanges } = handleEnvironmentLogic(finalGrid, connected, levelConfig.iceSpreadRate);

    // Play sound if any environment changes occurred (Ice crack, obstacle hit, etc.)
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
      // Also reduce hazards from targets if they were targets (like Obsidian)
      // NOTE: Complex logic omitted for brevity, assuming basic color targets mostly
    }
    setTargetsLeft(newTargets);

    setHint(null); // Clear hint

    // 5. Check Win/Loss

    // We check win immediately to prevent race conditions
    if (checkWinCondition({ targetsLeft: newTargets }, levelConfig.targets)) {
      setCanInteract(false); // Lock immediately
      setTimeout(() => handleLevelComplete(score + scoreGain), 600);
      return;
    }

    if (newMoves <= 0) {
      setCanInteract(false); // Lock immediately
      setTimeout(() => setGameState(GameState.OutOfMoves), 600);
      return;
    }

    // 6. Check for deadlocks (No moves possible)
    if (!hasPossibleMoves(gravityBoard)) {
      // Auto Shuffle
      setTimeout(async () => {
        // Toast "Shuffling..."
        const shuffled = shuffleBoard(gravityBoard, levelConfig.colorsAvailable);
        setGrid(shuffled);
        audioManager.playPurchase(); // Shuffle sound
      }, 1000);
    }

    setCanInteract(true);
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

    // FIX: Only unlock next level if beating a NEW level
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

  const handleRevive = () => {
    if (progress.coins >= 200) {
      setProgress(p => ({ ...p, coins: p.coins - 200 }));
      setMovesLeft(prev => prev + 5);
      setGameState(GameState.Playing);
      setCanInteract(true);
      audioManager.playPurchase();
    }
  };

  const handleBotHint = async () => {
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

  // Menus
  const handleLevelSelect = (levelNum: number) => {
    // Check if player has lives
    if (!canPlay(progress.lives, progress.unlimitedLivesUntil)) {
      setShowOutOfLives(true);
      return;
    }

    // Use predefined levels for 1-10, procedural for 11+
    const config = LEVELS[levelNum - 1] || generateProceduralLevel(levelNum);
    setPendingLevelConfig(config);
    setShowPreGameBoosters(true);
  };

  const renderWinScreen = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 animate-win-popup">
      <Confetti />
      <Crown size={80} className="text-yellow-400 mb-4 drop-shadow-lg" strokeWidth={1.5} fill="#facc15" />
      <h1 className="text-5xl font-black text-white italic mb-2 tracking-tighter stroke-black stroke-2">{t('victory')}</h1>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(i => {
          const stars = calculateStarRating(score, levelConfig!);
          return (
            <Star key={i}
              size={40}
              className={`${i <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'} transition-all duration-500`}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          );
        })}
      </div>

      <div className="bg-black/30 p-6 rounded-3xl w-full max-w-xs mb-8 border border-white/10 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-indigo-200 font-bold uppercase text-xs tracking-widest">{t('score')}</span>
          <span className="text-white font-black text-2xl">{score}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-indigo-200 font-bold uppercase text-xs tracking-widest">{t('earned')}</span>
          <div className="flex items-center gap-1 text-yellow-400 font-bold">
            +50 <Coins size={16} />
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-xs z-10">
        <button onClick={() => setGameState(GameState.Menu)} className="flex-1 bg-indigo-800 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all">
          {t('menu')}
        </button>
        <button onClick={() => handleLevelSelect(levelConfig!.levelNumber + 1)} className="flex-[2] bg-green-500 hover:bg-green-400 text-white font-black py-4 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2">
          {t('next_level')} <Play fill="currentColor" size={20} />
        </button>
      </div>
    </div>
  );

  // --- SCREENS ---

  if (isLoading) return <LoadingScreen />;

  if (gameState === GameState.Playing) {
    if (!levelConfig) return null;
    const isWarning = movesLeft <= 3;

    return (
      <PageTransition animation="scale" className="h-full w-full relative flex flex-col">
        <DynamicBackground />
        <EffectsLayer effects={effects} />

        {/* NEW: Combo Counter Overlay */}
        <ComboCounter combo={combo} t={t} />

        {/* Header - Compact 2-Row Layout */}
        <div className="p-2 relative z-20 space-y-2">
          {/* Top Row: Menu, Lives, Combo, Moves */}
          <div className="flex items-center justify-between gap-2">
            <button onClick={() => setGameState(GameState.Menu)} className="bg-indigo-800/80 p-2 rounded-xl border border-indigo-600/50 shadow-lg active:scale-95 transition-transform backdrop-blur-md">
              <Menu size={20} className="text-indigo-100" />
            </button>

            {/* Lives */}
            <LivesIndicator
              lives={progress.lives}
              onBuyLives={() => setShowShop(true)}
              t={t}
              compact={true}
            />

            {/* Combo */}
            <ComboIndicator combo={combo} t={t} />

            {/* Moves */}
            <div className={`bg-indigo-900/80 px-3 py-1.5 rounded-xl border border-indigo-700/50 shadow-lg flex flex-col items-center backdrop-blur-md transition-all duration-300 ${isWarning ? 'animate-pulse-fast border-red-500 bg-red-900/50' : ''}`}>
              <span className={`text-[8px] font-black uppercase tracking-widest ${isWarning ? 'text-red-200' : 'text-indigo-300'}`}>{t('moves')}</span>
              <span className={`text-xl font-black leading-none ${isWarning ? 'text-red-100' : 'text-white'}`}>{movesLeft}</span>
            </div>
          </div>

          {/* Bottom Row: Level Number (Centered) */}
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
            <LevelGoal key={type} type={type as BlockType} count={count || 0} isCompleted={count === 0} />
          ))}
        </div>

        {/* Game Board Area */}
        <div className="flex-1 relative flex items-center justify-center p-2 z-10">
          {/* Background Panel for Grid */}
          <div className="relative bg-indigo-950/60 p-2 rounded-[2rem] shadow-2xl border-4 border-indigo-900/50 backdrop-blur-sm w-full max-w-[95vw] aspect-[6/7]">
            {/* Grid */}
            <div className="w-full h-full relative">
              {grid.map((row, r) =>
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
            onClick={handleBotHint}
            disabled={isBotThinking}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-2xl shadow-[0_4px_0_#3730a3] active:translate-y-1 active:shadow-none disabled:opacity-50 transition-all flex flex-col items-center gap-1"
          >
            {isBotThinking ? <Loader2 size={24} className="animate-spin" /> : <BrainCircuit size={24} />}
            <span className="text-xs font-black uppercase">{t('hint')}</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={boosterMode.activateHammer}
              disabled={progress.inventory.hammers === 0}
              className={`bg-indigo-800/50 p-4 rounded-2xl border border-indigo-700 flex flex-col items-center gap-1 relative ${progress.inventory.hammers === 0 ? 'opacity-50' : 'active:scale-95 hover:bg-indigo-700/50'} ${activeBooster === 'HAMMER' ? 'ring-2 ring-yellow-400 bg-indigo-700 animate-pulse' : ''}`}
            >
              <Hammer size={20} className="text-red-400" />
              <span className="text-[10px] font-bold">{progress.inventory.hammers}</span>
            </button>
            <button
              onClick={boosterMode.activateShuffle}
              disabled={progress.inventory.shuffles === 0}
              className={`bg-indigo-800/50 p-4 rounded-2xl border border-indigo-700 flex flex-col items-center gap-1 relative ${progress.inventory.shuffles === 0 ? 'opacity-50' : 'active:scale-95 hover:bg-indigo-700/50'}`}
            >
              <Shuffle size={20} className="text-blue-400" />
              <span className="text-[10px] font-bold">{progress.inventory.shuffles}</span>
            </button>
          </div>
        </div>


        {/* Hint Overlay */}
        {
          hint && (
            <div className="absolute bottom-32 left-0 right-0 flex justify-center z-30 px-6 animate-slide-up pointer-events-none">
              <div className="bg-indigo-900/90 text-white px-6 py-3 rounded-full shadow-2xl border-2 border-indigo-400 text-center font-bold text-sm flex items-center gap-2 backdrop-blur-md">
                <BrainCircuit size={16} className="text-yellow-400" />
                {hint}
              </div>
            </div>
          )
        }

        {/* Modals */}
        {
          showTutorial && <TutorialModal type={showTutorial} onClose={() => {
            setShowTutorial(null);
            const newSeen = { ...progress.seenTutorials, [showTutorial]: true };
            setProgress(p => ({ ...p, seenTutorials: newSeen }));
          }} t={t} />
        }
      </PageTransition >
    );
  }

  // --- LEVEL SELECT & MENU ---
  return (
    <PageTransition animation="fade" className="h-full w-full bg-[#2e1065] relative overflow-hidden flex flex-col">
      <DynamicBackground />

      {/* Top Bar - Redesigned for better spacing */}
      <div className="p-3 relative z-20 space-y-2">
        {/* First Row: Level Info + Lives */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center shadow-lg">
              <span className="font-black text-white text-lg">P</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-indigo-300 font-bold uppercase">{t('level')}</span>
              <span className="text-white font-black text-sm leading-none">{progress.maxLevelReached}</span>
            </div>
          </div>

          {/* Lives Display */}
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-1.5 rounded-full shadow-lg">
            <span className="text-white font-black text-sm">❤️ {progress.lives}</span>
          </div>
        </div>

        {/* Second Row: Action Buttons */}
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setShowDailyQuests(true)} className="bg-purple-600 hover:bg-purple-500 active:scale-95 text-white p-2 rounded-xl shadow-md border border-purple-400/30 transition-transform">
            <Gamepad2 size={18} />
          </button>
          <button onClick={() => setShowAchievements(true)} className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-white p-2 rounded-xl shadow-md border border-amber-400/30 transition-transform">
            <Star size={18} />
          </button>
          <button onClick={() => setShowTournament(true)} className="bg-rose-600 hover:bg-rose-500 active:scale-95 text-white p-2 rounded-xl shadow-md border border-rose-400/30 transition-transform">
            <Crown size={18} />
          </button>
          <button onClick={() => setShowShop(true)} className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white p-2 rounded-xl shadow-md border border-indigo-400/30 relative transition-transform">
            <ShoppingCart size={18} />
            {progress.coins < 100 && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />}
          </button>
          <button onClick={() => setShowSettings(true)} className="bg-indigo-800 hover:bg-indigo-700 active:scale-95 text-indigo-200 p-2 rounded-xl shadow-md border border-indigo-600/30 transition-transform">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Coin Display - More Compact */}
      <div className="px-4 pb-2 relative z-20 flex justify-center">
        <div className="bg-indigo-900/50 border border-indigo-700 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg backdrop-blur-sm">
          <Coins className="text-yellow-400 drop-shadow-md" size={24} fill="currentColor" />
          <div className="flex flex-col">
            <span className="text-[9px] text-indigo-300 font-bold uppercase tracking-wide">{t('coins')}</span>
            <span className="text-xl font-black text-white leading-none">{progress.coins.toLocaleString()}</span>
          </div>
          <button onClick={() => setShowShop(true)} className="ml-1 bg-green-500 hover:bg-green-400 text-white p-1 rounded-lg shadow-sm active:scale-95 transition-transform">
            <RotateCcw size={14} className="rotate-45" />
          </button>
        </div>
      </div>

      {/* Level Grid */}
      <div ref={levelListRef} className="flex-1 overflow-y-auto p-6 pb-32 relative z-10 scrollbar-hide">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: progress.maxLevelReached }).map((_, i) => {
            const levelNum = i + 1;
            const stars = progress.levelScores[levelNum] || 0;
            const isCurrent = levelNum === progress.maxLevelReached;

            return (
              <button
                key={levelNum}
                onClick={() => handleLevelSelect(levelNum)}
                className={`
                   aspect-square rounded-2xl flex flex-col items-center justify-center relative
              transition-all duration-300
              ${isCurrent
                    ? 'bg-gradient-to-b from-pink-500 to-purple-600 border-b-4 border-purple-800 shadow-[0_0_20px_rgba(236,72,153,0.4)] scale-110 z-10 animate-pulse-fast'
                    : 'bg-indigo-800 border-b-4 border-indigo-950 hover:bg-indigo-700'
                  }
                 `}
              >
                <>
                  <span className={`text-xl font-black ${isCurrent ? 'text-white' : 'text-indigo-200'}`}>{levelNum}</span>
                  {stars > 0 && (
                    <div className="flex gap-0.5 absolute bottom-2">
                      {[1, 2, 3].map(s => (
                        <Star key={s} size={8} className={s <= stars ? "text-yellow-400 fill-yellow-400" : "text-black/30"} />
                      ))}
                    </div>
                  )}
                </>
              </button>
            );
          })}
        </div>
      </div>

      {/* Play Button (Quick Action) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#2e1065] via-[#2e1065] to-transparent z-30 flex justify-center pb-10">
        <button
          onClick={() => handleLevelSelect(progress.maxLevelReached)}
          className="w-full max-w-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl font-black py-5 rounded-[2rem] shadow-[0_8px_0_#166534] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3 group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
          <span className="drop-shadow-md relative z-10 uppercase tracking-wide">{t('play')}</span>
          <div className="bg-white/20 p-2 rounded-full relative z-10">
            <Play fill="currentColor" size={24} />
          </div>
        </button>
      </div>

      {/* Popups */}
      {
        gameState === GameState.Won && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center">
            {renderWinScreen()}
          </div>
        )
      }

      {
        gameState === GameState.OutOfMoves && (
          <ReviveModal
            coins={progress.coins}
            onRevive={handleRevive}
            onGiveUp={() => setGameState(GameState.Lost)}
            t={t}
          />
        )
      }

      {
        gameState === GameState.Lost && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
            <div className="bg-indigo-950 p-8 rounded-3xl border-2 border-red-900/50 text-center w-full max-w-xs animate-lose-shake">
              <div className="text-6xl mb-4">💔</div>
              <h2 className="text-3xl font-black text-white mb-6 uppercase italic">{t('failed')}</h2>
              <button onClick={() => handleLevelSelect(levelConfig!.levelNumber)} className="w-full bg-white text-indigo-900 font-black py-4 rounded-2xl shadow-lg hover:scale-105 transition-transform">
                {t('retry')}
              </button>
              <button onClick={() => setGameState(GameState.Menu)} className="mt-4 text-indigo-400 text-sm font-bold hover:text-white">
                {t('menu')}
              </button>
            </div>
          </div>
        )
      }

      {
        showSettings && <SettingsModal
          soundEnabled={progress.soundEnabled}
          hapticsEnabled={progress.hapticsEnabled}
          toggleSound={() => {
            const newVal = !progress.soundEnabled;
            setProgress(p => ({ ...p, soundEnabled: newVal }));
            audioManager.setEnabled(newVal);
          }}
          toggleHaptics={() => setProgress(p => ({ ...p, hapticsEnabled: !p.hapticsEnabled }))}
          currentLang={lang}
          setLanguage={setLanguage}
          onDeleteData={() => {
            localStorage.clear();
            window.location.reload();
          }}
          onClose={() => setShowSettings(false)}
          t={t}
        />
      }

      {
        showShop && <ShopModal
          coins={progress.coins}
          inventory={progress.inventory}
          adsRemoved={progress.adsRemoved}
          dailyAdsWatched={progress.dailyAdWatchCount}
          onBuyItem={(item, cost) => {
            if (progress.coins >= cost) {
              audioManager.playPurchase();
              setProgress(p => ({
                ...p,
                coins: p.coins - cost,
                inventory: { ...p.inventory, [item + 's']: (p.inventory as any)[item + 's'] + 1 }
              }));
            }
          }}
          onBuyIAP={(sku) => {
            setPaymentSku(sku);
            setShowPaymentModal(true);
            setShowShop(false); // Close shop to show payment clearly (optional, but cleaner)
          }}
          onWatchAd={async () => {
            setShowAdModal(true);
          }}
          onRestorePurchases={async () => {
            setIsProcessingIAP(true);
            await platformService.restorePurchases();
            setIsProcessingIAP(false);
            alert(t('purchased'));
          }}
          onClose={() => setShowShop(false)}
          isProcessing={isProcessingIAP}
          t={t}
        />
      }

      {
        showAdModal && <AdModal onClose={() => {
          setShowAdModal(false);
          setProgress(p => ({ ...p, coins: p.coins + 100, dailyAdWatchCount: p.dailyAdWatchCount + 1 }));
        }}
          t={t}
        />}
      {showPreGameBoosters && pendingLevelConfig && (
        <PreGameBoostersModal
          inventory={progress.inventory}
          onStart={(boosters) => {
            setShowPreGameBoosters(false);

            // Deduct life
            if (progress.unlimitedLivesUntil < Date.now()) {
              const newLives = useLive(progress.lives);
              setProgress(p => {
                const newP = { ...p, lives: newLives };
                // If we were at max lives, set the lost time to now to start regen timer
                if (p.lives === 5 && newLives < 5) {
                  newP.lastLifeLostTime = Date.now();
                }
                return newP;
              });
            }

            startGame(pendingLevelConfig, boosters);
          }}
          onSkip={() => {
            setShowPreGameBoosters(false);
            startGame(pendingLevelConfig!);
          }}
          t={t}
        />
      )}
      {/* NEW: Out of Lives Modal */}
      {showOutOfLives && <OutOfLivesModal
        lives={progress.lives}
        coins={progress.coins}
        onBuyLives={(count) => {
          const result = buyLives(progress.lives, progress.coins, count);
          if (result.success) {
            setProgress(p => ({ ...p, lives: result.newLives, coins: result.newCoins }));
            audioManager.playWin();
            setShowOutOfLives(false);
          } else {
            audioManager.playClick();
          }
        }}
        onWatchAd={async () => {
          setShowOutOfLives(false);
          const watched = await platformService.showRewardedAd();
          if (watched) {
            const newLives = addLives(progress.lives, 1);
            setProgress(p => ({ ...p, lives: newLives }));
            audioManager.playWin();
          }
        }}
        onWait={() => setShowOutOfLives(false)}
        t={t}
      />}

      {/* NEW: Daily Quests Modal */}
      {showDailyQuests && (
        <DailyQuestsModal
          quests={progress.dailyQuests}
          onClaim={(questId) => questTracking.handleClaimQuest(questId)}
          onClose={() => setShowDailyQuests(false)}
          t={t}
        />
      )}

      {/* NEW: Achievements Modal */}
      {showAchievements && (
        <AchievementsModal
          achievements={progress.achievements}
          onClose={() => setShowAchievements(false)}
          t={t}
        />
      )}

      {/* NEW: Mock Payment Modal */}
      {showPaymentModal && paymentSku && (
        <MockPaymentModal
          sku={paymentSku}
          onComplete={() => {
            audioManager.playWin();

            // Grant Rewards
            if (paymentSku === 'remove_ads') {
              setProgress(p => ({ ...p, adsRemoved: true, coins: p.coins + 500 }));
            }
            if (paymentSku === 'coins_small') {
              setProgress(p => ({ ...p, coins: p.coins + 1000 }));
            }
            if (paymentSku === 'coins_big') {
              setProgress(p => ({ ...p, coins: p.coins + 5000 }));
            }

            // Save
            // Note: We need to save the updated progress. Since setProgress is async, 
            // we should ideally use a useEffect or save the *calculated* new state.
            // For simplicity, we'll rely on the existing useEffect[progress] hook to save.

            setShowPaymentModal(false);
            setPaymentSku(null);
            setShowShop(true); // Re-open shop
          }}
          onClose={() => {
            setShowPaymentModal(false);
            setPaymentSku(null);
            setShowShop(true);
          }}
        />
      )}

      {/* NEW: Mock Ad Modal */}
      {showAdModal && (
        <MockAdModal
          onComplete={() => {
            // Reward the user
            const rewardAmount = 100;

            // Update stats
            const newCount = progress.dailyAdWatchCount + 1;
            const today = new Date().toDateString();

            setProgress(prev => ({
              ...prev,
              dailyAdWatchCount: newCount,
              lastAdWatchDate: today,
              coins: prev.coins + rewardAmount
            }));

            // Save
            platformService.saveGameData({
              ...progress,
              dailyAdWatchCount: newCount,
              lastAdWatchDate: today,
              coins: progress.coins + rewardAmount
            });

            // Close modal
            setShowAdModal(false);
          }}
          onClose={() => setShowAdModal(false)}
        />
      )}
      {/* NEW: Tournament Modal */}
      {showTournament && (
        <TournamentModal
          tournament={progress.currentTournament}
          onJoin={() => {
            const newTournament = initializeTournament();
            setProgress(p => ({ ...p, currentTournament: newTournament }));
          }}
          onClose={() => setShowTournament(false)}
          t={t}
        />
      )}
    </PageTransition>
  );
};

export default App;
