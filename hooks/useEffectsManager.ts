import { useState, useCallback } from 'react';
import { Effect } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface EffectsManagerReturn {
    effects: Effect[];
    addEffect: (type: 'PARTICLE' | 'TEXT', x: number, y: number, content?: string, color?: string) => void;
    clearEffects: () => void;
}

export const useEffectsManager = (): EffectsManagerReturn => {
    const [effects, setEffects] = useState<Effect[]>([]);

    const addEffect = useCallback((
        type: 'PARTICLE' | 'TEXT',
        x: number,
        y: number,
        content?: string,
        color?: string
    ) => {
        const id = uuidv4();
        const dx = (Math.random() - 0.5) * 100;
        const dy = -50 - Math.random() * 100;

        setEffects(prev => [...prev, { id, type, x, y, content, color, dx, dy }]);

        // Auto-remove after animation
        setTimeout(() => {
            setEffects(prev => prev.filter(e => e.id !== id));
        }, 1000);
    }, []);

    const clearEffects = useCallback(() => {
        setEffects([]);
    }, []);

    return {
        effects,
        addEffect,
        clearEffects,
    };
};
