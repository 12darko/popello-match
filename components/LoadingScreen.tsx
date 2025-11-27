import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[100] bg-[#2e1065] flex flex-col items-center justify-center animate-fade-in">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-50 animate-pulse-slow" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center transform rotate-12 animate-float">
                    <span className="text-5xl font-black text-white drop-shadow-md">P</span>
                </div>
            </div>

            <h1 className="text-3xl font-black text-white mb-2 tracking-tighter">POPELLO MATCH</h1>
            <div className="flex items-center gap-2 text-indigo-300 text-sm font-bold uppercase tracking-widest">
                <Loader2 className="animate-spin" size={16} />
                Loading...
            </div>
        </div>
    );
};
