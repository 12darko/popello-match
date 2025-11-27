
export enum BlockType {
  Fire = 'FIRE',
  Water = 'WATER',
  Nature = 'NATURE',
  Electric = 'ELECTRIC',
  Cosmic = 'COSMIC',
  Stone = 'STONE',     // Hard obstacle, 1 hit (but doesn't match)
  Crate = 'CRATE',     // Weak obstacle, 1 hit
  Obsidian = 'OBSIDIAN', // Very hard obstacle, multiple hits
  Balloon = 'BALLOON', // Floats up, pops on match
  Cage = 'CAGE',       // Releases block when broken
  Honey = 'HONEY',     // Slows blocks, sticky
  Vortex = 'VORTEX',   // Teleports blocks
  Empty = 'EMPTY'
}

export enum PowerUpType {
  Rocket = 'ROCKET',      // Destroys entire row or column
  Bomb = 'BOMB',          // Destroys 3x3 area
  DiscoBall = 'DISCO_BALL', // Destroys all blocks of same color
  Rainbow = 'RAINBOW'     // Matches with any color
}

export enum PowerUpCombination {
  CrossBlast = 'CROSS_BLAST',       // Rocket + Rocket
  TripleLine = 'TRIPLE_LINE',       // Rocket + Bomb
  ColorRockets = 'COLOR_ROCKETS',   // Rocket + Disco
  MegaBomb = 'MEGA_BOMB',           // Bomb + Bomb
  ColorBombs = 'COLOR_BOMBS',       // Bomb + Disco
  BoardClear = 'BOARD_CLEAR'        // Disco + Disco
}

export enum QuestType {
  CollectBlocks = 'COLLECT_BLOCKS',
  DestroyObstacles = 'DESTROY_OBSTACLES',
  WinLevels = 'WIN_LEVELS',
  UsePowerUps = 'USE_POWERUPS',
  ReachScore = 'REACH_SCORE',
  CreateCombos = 'CREATE_COMBOS',
  GetStars = 'GET_STARS',
  WinWithoutBoosters = 'WIN_WITHOUT_BOOSTERS',
  CompleteInMoves = 'COMPLETE_IN_MOVES'
}

export enum AchievementCategory {
  Levels = 'LEVELS',
  Combos = 'COMBOS',
  PowerUps = 'POWERUPS',
  Collection = 'COLLECTION',
  Score = 'SCORE',
  Stars = 'STARS',
  Quests = 'QUESTS'
}

export interface BlockData {
  id: string;
  type: BlockType;
  row: number;
  col: number;
  isNew?: boolean;
  isDying?: boolean;
  isFrozen?: boolean; // Ice mechanic
  chainLevel?: number; // 0 = no chain, 1 = single, 2 = double
  jellyLevel?: number; // 0 = no jelly, 1 = single, 2 = double
  health?: number;    // For Obsidian (starts at 3)
  maxHealth?: number;
  powerUp?: PowerUpType; // This block is a power-up
  powerUpDirection?: 'HORIZONTAL' | 'VERTICAL'; // For Rocket
}

export interface LevelConfig {
  levelNumber: number;
  moves: number;
  targets: Partial<Record<BlockType, number>>;
  gridSize: { rows: number; cols: number };
  colorsAvailable: BlockType[];
  iceStartCount?: number;
  iceSpreadRate?: number;
  stoneStartCount?: number;
  crateStartCount?: number;
  obsidianStartCount?: number;
  chainStartCount?: number;
  balloonStartCount?: number;
  jellyStartCount?: number;
  cageStartCount?: number;
  honeyStartCount?: number;
  vortexStartCount?: number;
}

export enum GameState {
  Menu = 'MENU',
  LevelSelect = 'LEVEL_SELECT',
  Settings = 'SETTINGS',
  Shop = 'SHOP',
  Playing = 'PLAYING',
  OutOfMoves = 'OUT_OF_MOVES', // New State: Revive Opportunity
  Won = 'WON',
  Lost = 'LOST'
}

export interface LevelProgress {
  score: number;
  movesLeft: number;
  targetsLeft: Partial<Record<BlockType, number>>;
}

export interface Inventory {
  hammers: number;
  shuffles: number;
  // Power-ups
  rockets: number;
  bombs: number;
  discoBalls: number;
  rainbows: number;
}

export interface PlayerProgress {
  // Cloud Sync Metadata
  lastSaveTimestamp: number; // Critical for conflict resolution (Local vs Cloud)

  maxLevelReached: number;
  levelScores: Record<number, number>;
  totalScore: number;
  coins: number;
  adsRemoved: boolean;
  inventory: Inventory;

  // Settings Persistence
  soundEnabled: boolean;
  hapticsEnabled: boolean;

  googleProfile?: {
    name: string;
    avatarUrl: string;
    id: string;
  };
  // Daily Rewards / Limits
  dailyAdWatchCount: number;
  lastAdWatchDate: string; // ISO Date string

  // Daily Bonus
  lastLoginDate: string; // ISO Date string
  loginStreak: number; // 0-6 (Day 1 to Day 7)

  // Daily Quests
  dailyQuests: DailyQuests;

  // Lives System
  lives: number;
  lastLifeLostTime: number; // Timestamp
  unlimitedLivesUntil: number; // Timestamp

  // Stats
  comboRecord: number;

  // Tutorial Tracking
  seenTutorials: Record<string, boolean>;

  // Achievements
  achievements: Achievement[];
  achievementProgress: AchievementProgress;

  // Tournament
  currentTournament?: TournamentData;
  tournamentScore: number;
}

export interface Coordinates {
  row: number;
  col: number;
}

export interface Effect {
  id: string;
  type: 'score' | 'combo' | 'match';
  text?: string;
  row: number;
  col: number;
  color?: string;
}

export interface ComboData {
  level: number; // 0 = no combo, 1 = Nice, 2 = Great, 3 = Awesome
  multiplier: number;
  lastMatchTime: number;
}

export interface Quest {
  id: string;
  type: QuestType;
  description: string;
  target: number;
  progress: number;
  reward: {
    coins?: number;
    rockets?: number;
    bombs?: number;
    discoBalls?: number;
  };
  completed: boolean;
  claimed: boolean;
}

export interface DailyQuests {
  quests: Quest[];
  lastRefreshDate: string; // ISO date string
  completedToday: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  playerId: string;
  score: number;
  avatarUrl?: string;
}

export interface TournamentReward {
  coins: number;
  rockets: number;
  bombs: number;
  discoBalls: number;
}

export interface TournamentData {
  id: string;
  name: string;
  startTime: number; // Timestamp
  endTime: number; // Timestamp
  playerScore: number;
  playerRank: number;
  leaderboard: LeaderboardEntry[];
  hasClaimedReward: boolean;
}

export interface SelectedBoosters {
  rockets?: number;
  bombs?: number;
  discoBalls?: number;
}

export interface Achievement {
  id: string;
  category: AchievementCategory;
  title: string;
  description: string;
  icon: string; // Emoji
  target: number;
  reward: {
    coins: number;
    rockets?: number;
    bombs?: number;
    discoBalls?: number;
  };
  unlocked: boolean;
  progress: number;
  unlockedAt?: number; // Timestamp
}

export interface AchievementProgress {
  // Level achievements
  levelsCompleted: number;

  // Score achievements
  totalScore: number;

  // Combo achievements
  maxCombo: number;

  // Star achievements
  totalStars: number;
  perfectLevels: number; // 3-star levels

  // Collection achievements
  blocksDestroyed: number;
  obstaclesDestroyed: number;

  // Power-up achievements
  rocketsUsed: number;
  bombsUsed: number;
  discoBallsUsed: number;
  totalPowerUpsUsed: number;

  // Quest achievements
  questsCompleted: number;
  questStreak: number;
  lastQuestDate: string;
}