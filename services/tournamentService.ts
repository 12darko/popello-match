import { TournamentData, LeaderboardEntry, TournamentReward } from '../types';

// Generate mock leaderboard data
export function generateMockLeaderboard(playerScore: number, playerName: string): LeaderboardEntry[] {
    const entries: LeaderboardEntry[] = [];

    // Generate 100 mock players with realistic scores
    const mockNames = [
        'DragonSlayer', 'PixelMaster', 'GameChamp', 'ProPlayer', 'EliteGamer',
        'StarHunter', 'ComboKing', 'BlockBuster', 'ScoreLegend', 'TopShooter',
        'MegaPlayer', 'UltraGamer', 'SuperStar', 'ChampionX', 'VictoryKing'
    ];

    for (let i = 0; i < 100; i++) {
        const baseName = mockNames[i % mockNames.length];
        entries.push({
            rank: i + 1,
            playerName: `${baseName}${Math.floor(Math.random() * 999)}`,
            playerId: `mock_${i}`,
            score: Math.floor(Math.random() * 150000) + 50000, // 50k-200k range
            avatarUrl: undefined
        });
    }

    // Sort by score descending
    entries.sort((a, b) => b.score - a.score);

    // Insert player
    const playerEntry: LeaderboardEntry = {
        rank: 0,
        playerName,
        playerId: 'player',
        score: playerScore,
        avatarUrl: undefined
    };

    // Find player's rank
    let insertIndex = entries.findIndex(e => playerScore > e.score);
    if (insertIndex === -1) insertIndex = entries.length;

    entries.splice(insertIndex, 0, playerEntry);

    // Update ranks
    entries.forEach((entry, index) => {
        entry.rank = index + 1;
    });

    return entries.slice(0, 100);
}

// Get start of current week (Monday 00:00)
function getStartOfWeek(timestamp: number): number {
    const date = new Date(timestamp);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday.getTime();
}

// Initialize new tournament
export function initializeTournament(): TournamentData {
    const now = Date.now();
    const startOfWeek = getStartOfWeek(now);
    const endOfWeek = startOfWeek + 7 * 24 * 60 * 60 * 1000;

    return {
        id: `tournament_${startOfWeek}`,
        name: 'Weekly Championship',
        startTime: startOfWeek,
        endTime: endOfWeek,
        playerScore: 0,
        playerRank: 0,
        leaderboard: [],
        hasClaimedReward: false
    };
}

// Check if tournament is active
export function isTournamentActive(tournament: TournamentData): boolean {
    return Date.now() < tournament.endTime;
}

// Check if need to start new tournament
export function shouldStartNewTournament(tournament?: TournamentData): boolean {
    if (!tournament) return true;
    return Date.now() >= tournament.endTime;
}

// Get reward for rank
export function getRewardForRank(rank: number): TournamentReward {
    if (rank === 1) {
        return { coins: 5000, rockets: 10, bombs: 10, discoBalls: 5 };
    } else if (rank <= 3) {
        return { coins: 3000, rockets: 5, bombs: 5, discoBalls: 3 };
    } else if (rank <= 10) {
        return { coins: 2000, rockets: 3, bombs: 3, discoBalls: 2 };
    } else if (rank <= 50) {
        return { coins: 1000, rockets: 2, bombs: 2, discoBalls: 1 };
    } else if (rank <= 100) {
        return { coins: 500, rockets: 1, bombs: 1, discoBalls: 0 };
    }
    return { coins: 0, rockets: 0, bombs: 0, discoBalls: 0 };
}

// Update tournament score
export function updateTournamentScore(
    tournament: TournamentData,
    scoreToAdd: number,
    playerName: string
): TournamentData {
    const newScore = tournament.playerScore + scoreToAdd;
    const newLeaderboard = generateMockLeaderboard(newScore, playerName);
    const playerEntry = newLeaderboard.find(e => e.playerId === 'player');

    return {
        ...tournament,
        playerScore: newScore,
        playerRank: playerEntry?.rank || 0,
        leaderboard: newLeaderboard
    };
}

// Claim tournament reward
export function claimTournamentReward(tournament: TournamentData): TournamentReward {
    return getRewardForRank(tournament.playerRank);
}
