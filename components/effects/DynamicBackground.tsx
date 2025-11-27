import React from 'react';

export const DynamicBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
            {/* Moving Blobs */}
            <div className="absolute top-0 left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" />
            <div className="absolute top-0 right-[-10%] w-96 h-96 bg-yellow-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" style={{ animationDelay: '2s' }} />
            <div className="absolute -bottom-8 left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob" style={{ animationDelay: '4s' }} />

            {/* Fireflies */}
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_4px_white]"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `110%`,
                        animation: `firefly ${10 + Math.random() * 15}s linear infinite`,
                        animationDelay: `${Math.random() * 15}s`,
                        opacity: 0
                    }}
                />
            ))}
        </div>
    );
};
