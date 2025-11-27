import { useState } from 'react';
import { LevelConfig } from '../types';

interface ModalStateReturn {
    // Modal visibility states
    showSettings: boolean;
    showShop: boolean;
    showDailyBonus: boolean;
    showRateUs: boolean;
    showAdModal: boolean;
    showTutorial: string | null;
    showOutOfLives: boolean;
    showPreGameBoosters: boolean;
    isProcessingIAP: boolean;
    pendingLevelConfig: LevelConfig | null;

    // Setters
    setShowSettings: (show: boolean) => void;
    setShowShop: (show: boolean) => void;
    setShowDailyBonus: (show: boolean) => void;
    setShowRateUs: (show: boolean) => void;
    setShowAdModal: (show: boolean) => void;
    setShowTutorial: (type: string | null) => void;
    setShowOutOfLives: (show: boolean) => void;
    setShowPreGameBoosters: (show: boolean) => void;
    setIsProcessingIAP: (processing: boolean) => void;
    setPendingLevelConfig: (config: LevelConfig | null) => void;

    // Helper functions
    closeAllModals: () => void;
    openModal: (modalName: string) => void;
}

export const useModalState = (): ModalStateReturn => {
    const [showSettings, setShowSettings] = useState(false);
    const [showShop, setShowShop] = useState(false);
    const [showDailyBonus, setShowDailyBonus] = useState(false);
    const [showRateUs, setShowRateUs] = useState(false);
    const [showAdModal, setShowAdModal] = useState(false);
    const [showTutorial, setShowTutorial] = useState<string | null>(null);
    const [showOutOfLives, setShowOutOfLives] = useState(false);
    const [showPreGameBoosters, setShowPreGameBoosters] = useState(false);
    const [isProcessingIAP, setIsProcessingIAP] = useState(false);
    const [pendingLevelConfig, setPendingLevelConfig] = useState<LevelConfig | null>(null);

    const closeAllModals = () => {
        setShowSettings(false);
        setShowShop(false);
        setShowDailyBonus(false);
        setShowRateUs(false);
        setShowAdModal(false);
        setShowTutorial(null);
        setShowOutOfLives(false);
        setShowPreGameBoosters(false);
    };

    const openModal = (modalName: string) => {
        closeAllModals();
        switch (modalName) {
            case 'settings':
                setShowSettings(true);
                break;
            case 'shop':
                setShowShop(true);
                break;
            case 'dailyBonus':
                setShowDailyBonus(true);
                break;
            case 'rateUs':
                setShowRateUs(true);
                break;
            case 'ad':
                setShowAdModal(true);
                break;
            case 'outOfLives':
                setShowOutOfLives(true);
                break;
            case 'preGameBoosters':
                setShowPreGameBoosters(true);
                break;
        }
    };

    return {
        showSettings,
        showShop,
        showDailyBonus,
        showRateUs,
        showAdModal,
        showTutorial,
        showOutOfLives,
        showPreGameBoosters,
        isProcessingIAP,
        pendingLevelConfig,
        setShowSettings,
        setShowShop,
        setShowDailyBonus,
        setShowRateUs,
        setShowAdModal,
        setShowTutorial,
        setShowOutOfLives,
        setShowPreGameBoosters,
        setIsProcessingIAP,
        setPendingLevelConfig,
        closeAllModals,
        openModal,
    };
};
