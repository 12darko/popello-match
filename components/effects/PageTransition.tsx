import React from 'react';

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
    animation?: 'fade' | 'slide-up' | 'scale' | 'pop';
}

export const PageTransition: React.FC<PageTransitionProps> = ({
    children,
    className = "",
    animation = 'fade'
}) => {
    const getAnimationClass = () => {
        switch (animation) {
            case 'fade': return 'animate-fade-in';
            case 'slide-up': return 'animate-slide-up';
            case 'scale': return 'animate-bounce-in';
            case 'pop': return 'animate-pop';
            default: return 'animate-fade-in';
        }
    };

    return (
        <div className={`w-full h-full ${getAnimationClass()} ${className}`}>
            {children}
        </div>
    );
};
