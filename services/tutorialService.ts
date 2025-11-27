import { BlockType, LevelConfig } from '../types';

export const checkForTutorials = (
    levelConfig: LevelConfig,
    seenTutorials: Record<string, boolean>
): string | null => {
    // Check for Crates
    if ((levelConfig.crateStartCount || 0) > 0 && !seenTutorials[BlockType.Crate]) {
        return BlockType.Crate;
    }

    // Check for Stones
    if ((levelConfig.stoneStartCount || 0) > 0 && !seenTutorials[BlockType.Stone]) {
        return BlockType.Stone;
    }

    // Check for Ice
    if ((levelConfig.iceStartCount || 0) > 0 && !seenTutorials['ICE']) {
        return 'ICE';
    }

    // Check for Obsidian
    if ((levelConfig.obsidianStartCount || 0) > 0 && !seenTutorials[BlockType.Obsidian]) {
        return BlockType.Obsidian;
    }

    // Check for Chains
    if ((levelConfig.chainStartCount || 0) > 0 && !seenTutorials['CHAIN']) {
        return 'CHAIN'; // Using string key for now as BlockType might not have CHAIN directly mapped if it's an overlay
    }

    // Check for Balloons
    if ((levelConfig.balloonStartCount || 0) > 0 && !seenTutorials[BlockType.Balloon]) {
        return BlockType.Balloon;
    }

    // Check for Jelly
    if ((levelConfig.jellyStartCount || 0) > 0 && !seenTutorials['JELLY']) {
        return 'JELLY';
    }

    // Check for Cages
    if ((levelConfig.cageStartCount || 0) > 0 && !seenTutorials[BlockType.Cage]) {
        return BlockType.Cage;
    }

    // Check for Honey
    if ((levelConfig.honeyStartCount || 0) > 0 && !seenTutorials[BlockType.Honey]) {
        return BlockType.Honey;
    }

    // Check for Vortex
    if ((levelConfig.vortexStartCount || 0) > 0 && !seenTutorials[BlockType.Vortex]) {
        return BlockType.Vortex;
    }

    return null;
};
