import React from 'react';
import { TournamentData } from '../../types';
import { Trophy, Crown, Medal, X, Clock, TrendingUp, Gift, Sparkles } from 'lucide-react';
import { getRewardForRank } from '../../services/tournamentService';

interface TournamentModalProps {
    tournament: TournamentData;
    onClose: () => void;
    onClaimReward: () => void;
    t: (key: string) => string;
}

export const TournamentModal: React.FC<TournamentModalProps> = ({
    tournament,
    onClose,
    onClaimReward,
    t
}) => {
    const timeRemaining = tournament.endTime - Date.now();
    const daysLeft = Math.floor(timeRemaining / (24 * 60 * 60 * 1000));
    const hoursLeft = Math.floor((timeRemaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

    const playerEntry = tournament.leaderboard.find(e => e.playerId === 'player');
    const canClaimReward = !tournament.hasClaimedReward && timeRemaining <= 0 && playerEntry && playerEntry.rank <= 100;

    const reward = playerEntry ? getRewardForRank(playerEntry.rank) : null;

    return (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-gradient-to-b from-purple-900 via-indigo-900 to-purple-950 w-full max-w-4xl max-h-[90vh] rounded-[2rem] border-4 border-purple-700/50 shadow-2xl overflow-hidden flex flex-col relative">
                {/* Decorative background particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-75" />
                    <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-150" />
                </div>

                {/* Header - Premium design */}
                <div className="relative p-6 border-b border-purple-700/50 backdrop-blur-sm bg-gradient-to-r from-purple-900/80 to-indigo-900/80">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Trophy size={36} className="text-yellow-400 drop-shadow-lg" />
                                <Sparkles className="absolute -top-1 -right-1 text-yellow-300 animate-spin-slow" size={16} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-white drop-shadow-lg">
                                    {tournament.name}
                                </h2>
                                <div className="flex items-center gap-2 text-purple-200 text-sm font-bold">
                                    <Clock size={16} />
                                    <span>
                                        {timeRemaining > 0
                                            ? `${daysLeft}d ${hoursLeft}h remaining`
                                            : 'Tournament Ended'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-purple-800/80 hover:bg-purple-700 p-2.5 rounded-xl transition-all hover:scale-110 backdrop-blur-sm border border-purple-600/50"
                        >
                            <X size={24} className="text-white" />
                        </button>
                    </div>

                    {/* Player Stats - Glassmorphism card */}
                    {playerEntry && (
                        <div className="bg-purple-950/50 backdrop-blur-md rounded-2xl p-4 border border-purple-700/30 shadow-lg">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-purple-300 text-sm mb-1 font-bold">Your Rank</p>
                                    <p className="text-4xl font-black text-yellow-400 drop-shadow-lg">
                                        #{playerEntry.rank}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-purple-300 text-sm mb-1 font-bold">Your Score</p>
                                    <p className="text-4xl font-black text-white drop-shadow-lg">
                                        {playerEntry.score.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Potential Reward Display */}
                            {reward && reward.coins > 0 && (
                                <div className="mt-3 pt-3 border-t border-purple-700/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Gift size={16} className="text-yellow-400" />
                                        <p className="text-purple-300 text-sm font-bold">
                                            {timeRemaining > 0 ? 'Potential Reward:' : 'Your Reward:'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="bg-yellow-500/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-yellow-400 font-black border border-yellow-500/30">
                                            🪙 {reward.coins}
                                        </span>
                                        {reward.rockets > 0 && (
                                            <span className="bg-blue-500/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-blue-400 font-black border border-blue-500/30">
                                                🚀 {reward.rockets}
                                            </span>
                                        )}
                                        {reward.bombs > 0 && (
                                            <span className="bg-red-500/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-red-400 font-black border border-red-500/30">
                                                💣 {reward.bombs}
                                            </span>
                                        )}
                                        {reward.discoBalls > 0 && (
                                            <span className="bg-purple-500/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-purple-400 font-black border border-purple-500/30">
                                                🪩 {reward.discoBalls}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Leaderboard - Scrollable list */}
                <div className="flex-1 overflow-y-auto p-6 relative">
                    <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                        <TrendingUp size={24} className="text-purple-400" />
                        Leaderboard
                    </h3>

                    <div className="space-y-2">
                        {tournament.leaderboard.slice(0, 50).map((entry) => {
                            const isPlayer = entry.playerId === 'player';
                            const rankIcon = entry.rank === 1 ? <Crown className="text-yellow-400" size={20} /> :
                                entry.rank === 2 ? <Medal className="text-gray-300" size={20} /> :
                                    entry.rank === 3 ? <Medal className="text-orange-400" size={20} /> : null;

                            return (
                                <div
                                    key={entry.playerId}
                                    className={`
                    p-3 rounded-xl border-2 transition-all duration-300
                    ${isPlayer
                                            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400/50 shadow-lg shadow-yellow-500/20 scale-105'
                                            : 'bg-purple-900/30 border-purple-700/30 hover:bg-purple-900/50 hover:scale-102'
                                        }
                  `}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 flex justify-center">
                                                {rankIcon || (
                                                    <span className={`font-black ${isPlayer ? 'text-yellow-400' : 'text-purple-300'}`}>
                                                        #{entry.rank}
                                                    </span>
                                                )}
                                            </div>
                                            <span className={`font-bold ${isPlayer ? 'text-yellow-400' : 'text-white'}`}>
                                                {entry.playerName}
                                            </span>
                                        </div>
                                        <span className={`font-black text-lg ${isPlayer ? 'text-yellow-400' : 'text-purple-200'}`}>
                                            {entry.score.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Claim Reward Button - Premium gradient */}
                {canClaimReward && (
                    <div className="p-6 border-t border-purple-700/50 bg-purple-900/50 backdrop-blur-sm">
                        <button
                            onClick={onClaimReward}
                            className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-black font-black text-lg py-4 rounded-2xl hover:scale-105 transition-all shadow-lg hover:shadow-2xl relative overflow-hidden"
                        >
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                            <span className="relative flex items-center justify-center gap-2">
                                <Trophy size={24} />
                                Claim Reward
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
