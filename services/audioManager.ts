
// Simple Synthesizer for Game Sounds so we don't need external assets
class AudioManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private musicInterval: any = null;
  private isMusicPlaying: boolean = false;

  constructor() {
    try {
      // @ts-ignore
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
    } catch (e) {
      console.error("Web Audio API not supported");
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      if (this.ctx) this.ctx.suspend();
      this.stopMenuMusic();
    } else {
      if (this.ctx) this.ctx.resume();
      // We don't auto-restart music here to avoid logic conflicts, 
      // the app component will handle restart if needed via useEffect
    }
  }

  private playTone(freq: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle', duration: number, startTime: number = 0, vol: number = 0.1) {
    if (!this.enabled || !this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

    // Envelope for smoother sound
    gain.gain.setValueAtTime(0, this.ctx.currentTime + startTime);
    gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + startTime + 0.05); // Attack
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + startTime + duration); // Decay

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(this.ctx.currentTime + startTime);
    osc.stop(this.ctx.currentTime + startTime + duration);
  }

  // --- GENERATIVE MUSIC ---
  startMenuMusic() {
    if (!this.enabled || !this.ctx || this.isMusicPlaying) return;

    this.isMusicPlaying = true;
    let noteIndex = 0;

    // Cute Pentatonic Scale (C Majorish) - Soft and Bell-like
    const melody = [
      523.25, // C5
      659.25, // E5
      783.99, // G5
      987.77, // B5
      783.99, // G5
      659.25, // E5
    ];

    const bassLine = [
      261.63, // C4
      349.23, // F4
      392.00, // G4
      261.63  // C4
    ];

    // 120 BPM approx (500ms per beat)
    this.musicInterval = setInterval(() => {
      if (!this.enabled) return;

      // Melody (Sine wave for bell/chime sound)
      // Play every beat, rest occasionally
      if (noteIndex % 8 !== 7) {
        const freq = melody[noteIndex % melody.length];
        // Add slight random detune for "analog" feel
        this.playTone(freq + (Math.random() * 2 - 1), 'sine', 0.4, 0, 0.03);
      }

      // Bass (Triangle for warmth) - Slower
      if (noteIndex % 4 === 0) {
        const bassFreq = bassLine[(Math.floor(noteIndex / 4)) % bassLine.length];
        this.playTone(bassFreq, 'triangle', 0.8, 0, 0.02);
      }

      noteIndex++;
    }, 400);
  }

  stopMenuMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  // --- SFX ---

  playPop() {
    this.playTone(400 + Math.random() * 200, 'sine', 0.1, 0, 0.1);
    this.playTone(800 + Math.random() * 200, 'triangle', 0.05, 0.05, 0.05);
  }

  playIceCrack() {
    this.playTone(2000, 'sine', 0.05, 0, 0.05);
    this.playTone(2500, 'sine', 0.05, 0.02, 0.05);
  }

  playWin() {
    [0, 0.1, 0.2, 0.4, 0.5].forEach((t, i) => {
      this.playTone(440 * (1 + i * 0.25), 'square', 0.3, t, 0.1);
    });
  }

  playLose() {
    this.playTone(300, 'sawtooth', 0.4, 0, 0.1);
    this.playTone(250, 'sawtooth', 0.4, 0.3, 0.1);
    this.playTone(200, 'sawtooth', 0.6, 0.6, 0.1);
  }

  playClick() {
    this.playTone(800, 'sine', 0.05, 0, 0.05);
  }

  playPurchase() {
    this.playTone(1200, 'square', 0.1, 0, 0.1);
    this.playTone(2000, 'sine', 0.2, 0.1, 0.1);
  }

  // --- POWER-UP SOUNDS ---

  playRocket() {
    // Whoosh sound
    this.playTone(200, 'sawtooth', 0.3, 0, 0.15);
    this.playTone(150, 'sawtooth', 0.3, 0.05, 0.1);
    this.playTone(100, 'sawtooth', 0.2, 0.1, 0.05);
  }

  playBomb() {
    // Explosion sound
    this.playTone(100, 'sawtooth', 0.4, 0, 0.2);
    this.playTone(80, 'square', 0.3, 0.1, 0.15);
    this.playTone(60, 'triangle', 0.2, 0.2, 0.1);
  }

  playDiscoBall() {
    // Sparkle/magic sound
    [0, 0.05, 0.1, 0.15, 0.2].forEach((t, i) => {
      this.playTone(1000 + (i * 200), 'sine', 0.15, t, 0.08);
    });
  }

  playPowerUpCreated() {
    // Ascending chime
    this.playTone(800, 'sine', 0.1, 0, 0.1);
    this.playTone(1000, 'sine', 0.1, 0.08, 0.1);
    this.playTone(1200, 'sine', 0.15, 0.16, 0.12);
  }

  // --- COMBO SOUNDS ---

  playCombo(level: number) {
    // Higher pitch for higher combos
    const basePitch = 600 + (level * 100);
    this.playTone(basePitch, 'square', 0.15, 0, 0.1);
    this.playTone(basePitch * 1.5, 'sine', 0.1, 0.05, 0.08);
  }

  playComboBreak() {
    // Descending sad sound
    this.playTone(400, 'sine', 0.2, 0, 0.05);
    this.playTone(300, 'sine', 0.2, 0.1, 0.05);
  }

  // --- OBSTACLE SOUNDS ---

  playCrateBreak() {
    // Wood breaking sound
    this.playTone(300, 'square', 0.1, 0, 0.1);
    this.playTone(250, 'sawtooth', 0.15, 0.05, 0.08);
  }

  playStoneBreak() {
    // Rock cracking sound
    this.playTone(200, 'square', 0.2, 0, 0.12);
    this.playTone(180, 'sawtooth', 0.15, 0.08, 0.1);
  }

  playObsidianHit() {
    // Metallic clang
    this.playTone(1500, 'square', 0.08, 0, 0.1);
    this.playTone(1200, 'triangle', 0.1, 0.04, 0.08);
  }

  playBalloonPop() {
    // High pitched pop
    this.playTone(800, 'sine', 0.05, 0, 0.12);
    this.playTone(600, 'sine', 0.08, 0.03, 0.08);
  }

  playCageBreak() {
    // Metal breaking
    this.playTone(1000, 'square', 0.15, 0, 0.1);
    this.playTone(800, 'sawtooth', 0.12, 0.06, 0.08);
  }

  playChainBreak() {
    // Chain snapping
    this.playTone(600, 'square', 0.1, 0, 0.1);
    this.playTone(500, 'sawtooth', 0.12, 0.05, 0.08);
  }

  playHoneyClear() {
    // Sticky clearing sound
    this.playTone(400, 'sine', 0.15, 0, 0.08);
    this.playTone(500, 'triangle', 0.1, 0.08, 0.06);
  }

  // --- BOOSTER SOUNDS ---

  playHammer() {
    // Hammer hit
    this.playTone(300, 'square', 0.1, 0, 0.15);
    this.playTone(250, 'sawtooth', 0.08, 0.05, 0.1);
  }

  playShuffle() {
    // Shuffling/mixing sound
    [0, 0.05, 0.1, 0.15].forEach((t) => {
      this.playTone(400 + Math.random() * 200, 'sine', 0.08, t, 0.06);
    });
  }

  // --- UI SOUNDS ---

  playAchievementUnlock() {
    // Triumphant fanfare
    [0, 0.1, 0.2, 0.3].forEach((t, i) => {
      this.playTone(440 * (1 + i * 0.2), 'square', 0.2, t, 0.1);
    });
  }

  playQuestComplete() {
    // Success chime
    this.playTone(800, 'sine', 0.15, 0, 0.1);
    this.playTone(1000, 'sine', 0.2, 0.1, 0.12);
  }

  playLevelUnlock() {
    // Unlock sound
    this.playTone(600, 'sine', 0.1, 0, 0.08);
    this.playTone(900, 'sine', 0.15, 0.08, 0.1);
  }

  playModalOpen() {
    // Soft open sound
    this.playTone(600, 'sine', 0.1, 0, 0.05);
  }

  playModalClose() {
    // Soft close sound
    this.playTone(400, 'sine', 0.1, 0, 0.05);
  }
}

export const audioManager = new AudioManager();
