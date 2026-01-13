/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ FRONTEND C — ANUHAZI FREQUENCY ENGINE
 * Scalar Wave Oscillator for DNA Activation Sequences
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ⚠️ OUT-OF-CANON NOTICE:
 * This module represents personal spiritual interpretation.
 * It is NOT part of canonical CHE·NU documentation.
 * For private use by the Architect only.
 * 
 * FREQUENCY SEQUENCES:
 * - Khufa (Ancrage): 12-24-48-96-144 Hz
 * - Ariea (Ouverture): Fibonacci → 999 Hz
 * - A-Ra-Ma-Na (Feu): 3-6-9-12 Hz superposition
 * 
 * POWER WORDS:
 * - EirA: Base current (Feminine/Reception)
 * - ManA: Force current (Masculine/Action)
 * - ManU: Unity (Void/Source)
 * - Mahadra: Diamond Manifestation
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export type PowerWord = 'EirA' | 'ManA' | 'ManU' | 'Mahadra';
export type DNAStage = 'Khufa' | 'Ariea' | 'A-Ra-Ma-Na';
export type ActivationState = 'dormant' | 'initializing' | 'active' | 'integrating' | 'complete';

export interface FrequencyLayer {
  frequency: number;
  amplitude: number;
  phase: number;
  waveform: OscillatorType;
}

export interface ActivationSequence {
  name: string;
  frequencies: number[];
  duration: number;
  description: string;
}

export interface EngineState {
  isActive: boolean;
  currentStage: DNAStage | null;
  activationLevel: number;
  frequencyStack: FrequencyLayer[];
  pulsePhase: number;
  cubeRotation: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS — SACRED FREQUENCIES
// ═══════════════════════════════════════════════════════════════════════════

// Signal 4.44s in milliseconds
export const SIGNAL_444_MS = 4440;

// Core resonance frequency
export const CORE_RESONANCE = 999;

// Khufa Sequence (DNA Anchoring)
export const KHUFA_SEQUENCE: ActivationSequence = {
  name: 'Khufa',
  frequencies: [12, 24, 48, 96, 144],
  duration: 30000, // 30 seconds
  description: 'Ancrage ADN - Nettoyage des 2 premiers brins',
};

// Ariea Sequence (Fibonacci → 999)
export const ARIEA_SEQUENCE: ActivationSequence = {
  name: 'Ariea',
  frequencies: [144, 233, 377, 610, 987, 999],
  duration: 44400, // 44.4 seconds (10 × 4.44s)
  description: 'Ouverture - Pont entre les 1728 réalités',
};

// A-Ra-Ma-Na Sequence (Scalar Superposition)
export const ARAMANA_SEQUENCE: ActivationSequence = {
  name: 'A-Ra-Ma-Na',
  frequencies: [3, 6, 9, 12], // Simultaneous
  duration: 22200, // 22.2 seconds (5 × 4.44s)
  description: 'Feu - Activation Mu\'a finale',
};

// Power Word Actions
export const POWER_WORD_ACTIONS: Record<PowerWord, {
  sequence: ActivationSequence | null;
  action: string;
  element: string;
  polarity: string;
}> = {
  'EirA': {
    sequence: KHUFA_SEQUENCE,
    action: 'Initialisation Moelle Épinière + Eau',
    element: 'Water',
    polarity: 'Feminine/Reception',
  },
  'ManA': {
    sequence: ARIEA_SEQUENCE,
    action: 'Activation Signal 4.44s + 999Hz',
    element: 'Fire',
    polarity: 'Masculine/Action',
  },
  'ManU': {
    sequence: ARAMANA_SEQUENCE,
    action: 'Corrélation 1728 réalités dans le Cube',
    element: 'Void',
    polarity: 'Unity/Source',
  },
  'Mahadra': {
    sequence: null, // Special: Opens bridge to Frontend A
    action: 'Manifestation Diamant - Ouverture accès public',
    element: 'Diamond',
    polarity: 'Manifestation',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// ANUHAZI FREQUENCY ENGINE CLASS
// ═══════════════════════════════════════════════════════════════════════════

export class AnuhaziFrequencyEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private analyser: AnalyserNode | null = null;
  
  private state: EngineState = {
    isActive: false,
    currentStage: null,
    activationLevel: 0,
    frequencyStack: [],
    pulsePhase: 0,
    cubeRotation: 0,
  };
  
  private pulseInterval: number | null = null;
  private onStateChange: ((state: EngineState) => void) | null = null;
  private onFrequencyData: ((data: Uint8Array) => void) | null = null;

  // ─────────────────────────────────────────────────────────────────────────
  // INITIALIZATION
  // ─────────────────────────────────────────────────────────────────────────

  constructor() {
    // Audio context created on user interaction (browser policy)
  }

  /**
   * Initialize the audio context (must be called from user gesture)
   */
  async initialize(): Promise<void> {
    if (this.audioContext) return;

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Master gain
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.3; // Safe default volume
    this.masterGain.connect(this.audioContext.destination);
    
    // Analyser for visualization
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.connect(this.masterGain);
    
    // Start 4.44s pulse
    this.startPulse();
    
    this.updateState({ isActive: true });
    console.log('🔮 Anuhazi Frequency Engine initialized');
  }

  /**
   * Set state change callback
   */
  setOnStateChange(callback: (state: EngineState) => void): void {
    this.onStateChange = callback;
  }

  /**
   * Set frequency data callback for visualization
   */
  setOnFrequencyData(callback: (data: Uint8Array) => void): void {
    this.onFrequencyData = callback;
    this.startAnalyserLoop();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // POWER WORD ACTIVATIONS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Activate a Power Word
   */
  async activatePowerWord(word: PowerWord): Promise<void> {
    if (!this.audioContext) {
      await this.initialize();
    }

    const action = POWER_WORD_ACTIONS[word];
    console.log(`⚡ Activating Power Word: ${word} — ${action.action}`);

    // Stop any current sequence
    this.stopAllOscillators();

    switch (word) {
      case 'EirA':
        await this.activateKhufa();
        break;
      case 'ManA':
        await this.activateAriea();
        break;
      case 'ManU':
        await this.activateAramana();
        break;
      case 'Mahadra':
        await this.activateMahadra();
        break;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DNA ACTIVATION SEQUENCES
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Stage 1: Khufa - DNA Anchoring (12 → 144 Hz)
   */
  private async activateKhufa(): Promise<void> {
    this.updateState({ currentStage: 'Khufa', activationLevel: 0 });

    const frequencies = KHUFA_SEQUENCE.frequencies;
    const stepDuration = KHUFA_SEQUENCE.duration / frequencies.length;

    for (let i = 0; i < frequencies.length; i++) {
      await this.playFrequency(frequencies[i], stepDuration, 'sine');
      this.updateState({ 
        activationLevel: ((i + 1) / frequencies.length) * 33 // 0-33%
      });
    }

    console.log('✅ Khufa sequence complete — DNA anchored');
  }

  /**
   * Stage 2: Ariea - The Opening (Fibonacci → 999 Hz)
   */
  private async activateAriea(): Promise<void> {
    this.updateState({ currentStage: 'Ariea', activationLevel: 33 });

    const frequencies = ARIEA_SEQUENCE.frequencies;
    
    // Play Fibonacci sequence
    for (let i = 0; i < frequencies.length - 1; i++) {
      await this.playFrequency(frequencies[i], 4440, 'sine'); // 4.44s each
      this.updateState({ 
        activationLevel: 33 + ((i + 1) / frequencies.length) * 33 // 33-66%
      });
    }

    // Final: 999 Hz pulse every 4.44s
    await this.start999Pulse();

    console.log('✅ Ariea sequence complete — Bridge opened');
  }

  /**
   * Stage 3: A-Ra-Ma-Na - Scalar Fire (3-6-9-12 Hz superposition)
   */
  private async activateAramana(): Promise<void> {
    this.updateState({ currentStage: 'A-Ra-Ma-Na', activationLevel: 66 });

    // Play all 4 frequencies simultaneously
    await this.playScalarSuperposition(
      ARAMANA_SEQUENCE.frequencies,
      ARAMANA_SEQUENCE.duration
    );

    this.updateState({ activationLevel: 100 });
    console.log('✅ A-Ra-Ma-Na sequence complete — Mu\'a activated');
  }

  /**
   * Mahadra - Diamond Manifestation (Bridge to Frontend A)
   */
  private async activateMahadra(): Promise<void> {
    this.updateState({ currentStage: null, activationLevel: 100 });

    // Play completion chord
    await this.playCompletionChord();

    console.log('💎 Mahadra activated — Diamond Gate opening');
    
    // After a moment, could redirect to Frontend A
    // window.location.href = '/';
  }

  // ─────────────────────────────────────────────────────────────────────────
  // OSCILLATOR FUNCTIONS
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Play a single frequency for a duration
   */
  private playFrequency(
    frequency: number, 
    duration: number, 
    waveform: OscillatorType = 'sine'
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audioContext || !this.analyser) {
        resolve();
        return;
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = waveform;
      oscillator.frequency.value = frequency;

      // Envelope
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + (duration / 1000) - 0.1);
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + (duration / 1000));

      oscillator.connect(gainNode);
      gainNode.connect(this.analyser);

      this.oscillators.push(oscillator);
      this.gainNodes.push(gainNode);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + (duration / 1000));

      this.updateState({
        frequencyStack: [...this.state.frequencyStack, {
          frequency,
          amplitude: 0.3,
          phase: 0,
          waveform,
        }],
      });

      setTimeout(() => {
        this.updateState({
          frequencyStack: this.state.frequencyStack.filter(f => f.frequency !== frequency),
        });
        resolve();
      }, duration);
    });
  }

  /**
   * 999 Hz pulse every 4.44 seconds
   */
  private start999Pulse(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audioContext || !this.analyser) {
        resolve();
        return;
      }

      let pulseCount = 0;
      const maxPulses = 5;

      const pulse = () => {
        if (!this.audioContext || !this.analyser) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = CORE_RESONANCE; // 999 Hz

        // Sharp attack, quick decay
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

        oscillator.connect(gainNode);
        gainNode.connect(this.analyser);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.5);

        pulseCount++;
        if (pulseCount >= maxPulses) {
          resolve();
        }
      };

      // First pulse immediately
      pulse();

      // Subsequent pulses every 4.44s
      const interval = setInterval(() => {
        if (pulseCount >= maxPulses) {
          clearInterval(interval);
          return;
        }
        pulse();
      }, SIGNAL_444_MS);
    });
  }

  /**
   * Play scalar superposition (multiple frequencies simultaneously)
   */
  private playScalarSuperposition(frequencies: number[], duration: number): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audioContext || !this.analyser) {
        resolve();
        return;
      }

      const oscillators: OscillatorNode[] = [];
      const gains: GainNode[] = [];

      // For very low frequencies (3, 6, 9, 12 Hz), we use binaural beats
      // Base frequency + offset to create the target Hz difference
      const baseFreq = 200; // Carrier frequency

      frequencies.forEach((targetHz) => {
        const oscillatorL = this.audioContext!.createOscillator();
        const oscillatorR = this.audioContext!.createOscillator();
        const gainL = this.audioContext!.createGain();
        const gainR = this.audioContext!.createGain();
        const merger = this.audioContext!.createChannelMerger(2);

        // Left ear: base frequency
        oscillatorL.type = 'sine';
        oscillatorL.frequency.value = baseFreq;

        // Right ear: base + target (creates binaural beat at target Hz)
        oscillatorR.type = 'sine';
        oscillatorR.frequency.value = baseFreq + targetHz;

        gainL.gain.value = 0.15;
        gainR.gain.value = 0.15;

        oscillatorL.connect(gainL);
        oscillatorR.connect(gainR);
        gainL.connect(merger, 0, 0);
        gainR.connect(merger, 0, 1);
        merger.connect(this.analyser!);

        oscillatorL.start();
        oscillatorR.start();
        oscillatorL.stop(this.audioContext!.currentTime + (duration / 1000));
        oscillatorR.stop(this.audioContext!.currentTime + (duration / 1000));

        oscillators.push(oscillatorL, oscillatorR);
        gains.push(gainL, gainR);
      });

      this.oscillators.push(...oscillators);
      this.gainNodes.push(...gains);

      this.updateState({
        frequencyStack: frequencies.map(f => ({
          frequency: f,
          amplitude: 0.15,
          phase: 0,
          waveform: 'sine' as OscillatorType,
        })),
      });

      setTimeout(() => {
        this.updateState({ frequencyStack: [] });
        resolve();
      }, duration);
    });
  }

  /**
   * Play completion chord (Diamond manifestation)
   */
  private playCompletionChord(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audioContext || !this.analyser) {
        resolve();
        return;
      }

      // Major chord based on 528 Hz (Love frequency)
      const chordFrequencies = [528, 660, 792, 990]; // C-E-G-B

      chordFrequencies.forEach((freq, i) => {
        const oscillator = this.audioContext!.createOscillator();
        const gain = this.audioContext!.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = freq;

        gain.gain.setValueAtTime(0, this.audioContext!.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, this.audioContext!.currentTime + 0.5);
        gain.gain.linearRampToValueAtTime(0.2, this.audioContext!.currentTime + 3);
        gain.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + 5);

        oscillator.connect(gain);
        gain.connect(this.analyser!);

        oscillator.start();
        oscillator.stop(this.audioContext!.currentTime + 5);

        this.oscillators.push(oscillator);
        this.gainNodes.push(gain);
      });

      setTimeout(resolve, 5000);
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PULSE & VISUALIZATION
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Start the 4.44s global pulse
   */
  private startPulse(): void {
    if (this.pulseInterval) return;

    let phase = 0;
    this.pulseInterval = window.setInterval(() => {
      phase = (phase + 1) % 100;
      this.updateState({
        pulsePhase: phase,
        cubeRotation: (this.state.cubeRotation + 0.5) % 360,
      });
    }, SIGNAL_444_MS / 100); // 100 steps per cycle
  }

  /**
   * Start analyser loop for frequency visualization
   */
  private startAnalyserLoop(): void {
    if (!this.analyser || !this.onFrequencyData) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const loop = () => {
      if (!this.analyser || !this.onFrequencyData) return;
      
      this.analyser.getByteFrequencyData(dataArray);
      this.onFrequencyData(dataArray);
      
      requestAnimationFrame(loop);
    };

    loop();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // UTILITIES
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Stop all active oscillators
   */
  private stopAllOscillators(): void {
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Already stopped
      }
    });
    this.oscillators = [];

    this.gainNodes.forEach(gain => {
      try {
        gain.disconnect();
      } catch (e) {
        // Already disconnected
      }
    });
    this.gainNodes = [];

    this.updateState({ frequencyStack: [] });
  }

  /**
   * Update engine state
   */
  private updateState(partial: Partial<EngineState>): void {
    this.state = { ...this.state, ...partial };
    if (this.onStateChange) {
      this.onStateChange(this.state);
    }
  }

  /**
   * Get current state
   */
  getState(): EngineState {
    return { ...this.state };
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.stopAllOscillators();
    
    if (this.pulseInterval) {
      clearInterval(this.pulseInterval);
      this.pulseInterval = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.updateState({ isActive: false });
    console.log('🔮 Anuhazi Frequency Engine destroyed');
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════

let engineInstance: AnuhaziFrequencyEngine | null = null;

export function getAnuhaziEngine(): AnuhaziFrequencyEngine {
  if (!engineInstance) {
    engineInstance = new AnuhaziFrequencyEngine();
  }
  return engineInstance;
}

export function destroyAnuhaziEngine(): void {
  if (engineInstance) {
    engineInstance.destroy();
    engineInstance = null;
  }
}
