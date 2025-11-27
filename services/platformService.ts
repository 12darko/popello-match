
import { PlayerProgress } from "../types";
import { initializeDailyQuests } from "./questService";

/**
 * PLATFORM SERVICE (The Bridge)
 * 
 * This file contains the connection logic for external SDKs.
 * (Google Play Games Services, AdMob, RevenueCat, Unity IAP, etc.)
 * 
 * INSTRUCTIONS:
 * Replace the mock implementations inside the 'try' blocks with your actual SDK calls.
 */

// Example imports for real implementation:
// import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
// import { Capacitor } from '@capacitor/core';
// import { GooglePlayGamesServices } from '@capacitor-community/google-play-games';

// Default initial state if no save is found
export const DEFAULT_PROGRESS: PlayerProgress = {
  lastSaveTimestamp: Date.now(),
  maxLevelReached: 1,
  levelScores: {},
  totalScore: 0,
  coins: 100,
  adsRemoved: false,
  inventory: {
    hammers: 1,
    shuffles: 1,
    rockets: 2,
    bombs: 2,
    discoBalls: 1,
    rainbows: 0
  },

  // Default Settings
  soundEnabled: true,
  hapticsEnabled: true,

  dailyAdWatchCount: 0,
  lastAdWatchDate: new Date().toDateString(),
  lastLoginDate: new Date(0).toDateString(),
  loginStreak: 0,

  // Daily Quests
  dailyQuests: initializeDailyQuests(),

  // Lives System
  lives: 5,
  lastLifeLostTime: 0,
  unlimitedLivesUntil: 0,

  // Stats
  comboRecord: 0,

  // Tutorial Tracking
  seenTutorials: {},

  // Achievements
  achievements: [],
  achievementProgress: {
    levelsCompleted: 0,
    totalScore: 0,
    maxCombo: 0,
    totalStars: 0,
    perfectLevels: 0,
    blocksDestroyed: 0,
    obstaclesDestroyed: 0,
    rocketsUsed: 0,
    bombsUsed: 0,
    discoBallsUsed: 0,
    totalPowerUpsUsed: 0,
    questsCompleted: 0,
    questStreak: 0,
    lastQuestDate: ''
  },

  // Tournament
  currentTournament: undefined,
  tournamentScore: 0
};

export const platformService = {

  // --- 1. CLOUD SAVE SYSTEM ---

  /**
   * Loads game data. Prioritizes Cloud, falls back to LocalStorage.
   */
  loadGameData: async (): Promise<PlayerProgress> => {
    console.log("PLATFORM: Loading game data...");

    // 1. Try Local Storage First (Fastest)
    let localData: PlayerProgress | null = null;
    try {
      const saved = localStorage.getItem('popelloProgress_v2');
      if (saved) localData = JSON.parse(saved);
    } catch (e) { console.error("Local Load Error", e); }

    // 2. Try Cloud Storage (Async)
    // REAL IMPLEMENTATION EXAMPLE:
    /*
    let cloudData: PlayerProgress | null = null;
    if (Capacitor.getPlatform() === 'android') {
       try {
          await GooglePlayGamesServices.login();
          const { data } = await GooglePlayGamesServices.loadSnapshot({ name: 'popello_save' });
          if (data) cloudData = JSON.parse(data);
       } catch (e) { console.error("Cloud Load Fail", e); }
    }
    */
    // MOCK for now:
    let cloudData: PlayerProgress | null = null;

    // 3. Conflict Resolution (Newest Wins)
    if (localData && cloudData) {
      // @ts-ignore
      if (cloudData.lastSaveTimestamp > localData.lastSaveTimestamp) {
        console.log("PLATFORM: Cloud save is newer, using cloud.");
        localStorage.setItem('popelloProgress_v2', JSON.stringify(cloudData)); // Sync back to local
        return cloudData;
      }
    }

    if (cloudData) return cloudData;
    if (localData) return { ...DEFAULT_PROGRESS, ...localData }; // Merge to ensure new fields like haptics are present

    return DEFAULT_PROGRESS;
  },

  /**
   * Saves game data to both Local and Cloud.
   */
  saveGameData: async (progress: PlayerProgress): Promise<void> => {
    // Update timestamp
    const dataToSave = { ...progress, lastSaveTimestamp: Date.now() };

    // 1. Save Local
    try {
      localStorage.setItem('popelloProgress_v2', JSON.stringify(dataToSave));
    } catch (e) { console.error("Local Save Error", e); }

    // 2. Save Cloud
    // REAL IMPLEMENTATION EXAMPLE:
    /*
    if (Capacitor.getPlatform() === 'android') {
       try {
          await GooglePlayGamesServices.saveSnapshot({ 
            name: 'popello_save', 
            data: JSON.stringify(dataToSave), 
            description: 'Level ' + dataToSave.maxLevelReached 
          });
       } catch (e) { console.error("Cloud Save Fail", e); }
    }
    */
    console.log("PLATFORM: Data synced to cloud (Mock)");
  },

  // --- 2. MONETIZATION (IAP) ---

  /**
   * Initializes the Store SDK (RevenueCat, Unity IAP, Google Play Billing)
   */
  initializeStore: async () => {
    // TODO: Initialize your Billing SDK
    console.log("PLATFORM: Store Initialized");
  },

  /**
   * Purchase a product.
   * @param sku The product ID (e.g., 'remove_ads', 'coins_small')
   */
  purchaseItem: async (sku: string): Promise<{ success: boolean; reward?: string }> => {
    console.log(`PLATFORM: Requesting purchase for ${sku}`);

    return new Promise((resolve) => {
      // TODO: Call your Billing SDK here
      // GooglePlayBilling.purchase(sku).then(...)

      // Mock Response
      setTimeout(() => {
        // Verify the purchase token on your backend here if needed
        console.log("PLATFORM: Purchase Successful (Mock)");
        resolve({ success: true });
      }, 1500);
    });
  },

  /**
   * Restore Purchases (Required for iOS/Android compliance)
   * Checks for non-consumable items like 'Remove Ads' and restores them.
   */
  restorePurchases: async (): Promise<void> => {
    console.log("PLATFORM: Restoring purchases...");

    return new Promise((resolve) => {
      // TODO: Call Store.restoreTransactions() logic here
      setTimeout(() => {
        console.log("PLATFORM: Purchases Restored (Mock)");
        resolve();
      }, 2000);
    });
  },

  // --- 3. ADVERTISING ---

  /**
   * Show a Rewarded Video Ad (User chooses to watch)
   */
  showRewardedAd: async (): Promise<boolean> => {
    console.log("PLATFORM: Showing Rewarded Ad...");

    return new Promise((resolve) => {
      // TODO: Call AdMob / Unity Ads here
      // AdMob.showRewarded().then((result) => resolve(result.rewarded));

      setTimeout(() => {
        console.log("PLATFORM: Ad Completed (Mock)");
        resolve(true); // True if user watched til end
      }, 2000);
    });
  },

  /**
   * Show an Interstitial Ad (Forced between levels)
   * Checks 'adsRemoved' flag before showing.
   */
  showInterstitialAd: async (adsRemoved: boolean): Promise<void> => {
    if (adsRemoved) return;

    console.log("PLATFORM: Showing Interstitial Ad...");
    // TODO: Call AdMob / Unity Ads here
  },

  // --- 4. SOCIAL / AUTH ---

  loginToGooglePlay: async (): Promise<{ name: string; id: string; avatar: string } | null> => {
    console.log("PLATFORM: Logging into Google Play Games...");

    return new Promise((resolve) => {
      // REAL IMPLEMENTATION EXAMPLE:
      /*
      if (Capacitor.getPlatform() === 'android') {
          const result = await GooglePlayGamesServices.login();
          // Map result to user object
      }
      */

      // MOCK
      setTimeout(() => {
        resolve({
          name: "Player_" + Math.floor(Math.random() * 1000),
          id: "gpg_123456",
          avatar: ""
        });
      }, 1000);
    });
  },

  // --- 5. DEVICE CAPABILITIES ---

  /**
   * Trigger Haptic Feedback
   * @param ms Duration in milliseconds
   */
  vibrate: (ms: number = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch (e) {
        // Ignore errors on unsupported devices
      }
    }
  },

  /**
   * Opens an external URL in the default browser (System intent)
   */
  openExternalLink: (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  }
};
