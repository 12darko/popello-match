
import { useState, useCallback } from 'react';

export type BoosterMode = 'HAMMER' | 'SHUFFLE' | null;

export const useBoosterMode = () => {
    const [activeMode, setActiveMode] = useState<BoosterMode>(null);

    const activateHammer = useCallback(() => {
        setActiveMode('HAMMER');
    }, []);

    const activateShuffle = useCallback(() => {
        setActiveMode('SHUFFLE');
    }, []);

    const cancelMode = useCallback(() => {
        setActiveMode(null);
    }, []);

    return {
        activeMode,
        activateHammer,
        activateShuffle,
        cancelMode
    };
};
