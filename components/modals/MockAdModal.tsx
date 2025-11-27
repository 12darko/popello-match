import React, { useState, useEffect } from 'react';
import { X, Play, Volume2, VolumeX } from 'lucide-react';

interface MockAdModalProps {
    onComplete: () => void;
    onClose: () => void;
}

export const MockAdModal: React.FC<MockAdModalProps> = ({ onComplete, onClose }) => {
    const [timeLeft, setTimeLeft] = useState(5);
    const [canClose, setCanClose] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanClose(true);
                    onComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-fade-in">
            {/* Ad Content Container */}
            <div className="relative w-full h-full max-w-md bg-gray-900 flex flex-col">

                {/* Top Bar */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/50 to-transparent">
                    <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold border border-white/10">
                        {canClose ? 'Reward Granted' : `Reward in ${timeLeft}s`}
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => setIsMuted(!isMuted)} className="text-white/80 hover:text-white">
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        {canClose && (
                            <button
                                onClick={onClose}
                                className="bg-white/20 hover:bg-white/40 p-1 rounded-full backdrop-blur-md transition-all"
                            >
                                <X size={24} className="text-white" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Fake Video Content */}
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 relative overflow-hidden">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0">
                        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-yellow-400/10 rounded-full animate-pulse" />
                    </div>

                    <div className="text-center z-10 p-8">
                        <div className="mb-6 inline-block p-6 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl animate-bounce-short">
                            <Play size={48} className="text-white fill-white" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2 drop-shadow-lg">SUPER GAME 3000</h2>
                        <p className="text-blue-100 text-lg font-medium mb-8">Play Now for FREE!</p>

                        <button className="bg-green-500 hover:bg-green-400 text-white font-black text-xl px-8 py-4 rounded-full shadow-xl transform transition-all hover:scale-105 active:scale-95 animate-pulse">
                            INSTALL NOW
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                        <div
                            className="h-full bg-white transition-all duration-1000 ease-linear"
                            style={{ width: `${((5 - timeLeft) / 5) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Bottom Banner */}
                <div className="bg-white p-3 flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xs">
                        ICON
                    </div>
                    <div className="flex-1">
                        <div className="font-bold text-gray-900">Super Game 3000</div>
                        <div className="text-xs text-gray-500">Contains ads • In-app purchases</div>
                    </div>
                    <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">
                        OPEN
                    </div>
                </div>
            </div>
        </div>
    );
};
