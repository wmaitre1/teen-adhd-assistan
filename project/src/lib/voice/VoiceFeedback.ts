interface SpeechOptions {
  pitch?: number;
  rate?: number;
  volume?: number;
}

export class VoiceFeedback {
  private static instance: VoiceFeedback;
  private audioContext: AudioContext | null = null;
  private audioQueue: Array<{
    text: string;
    options?: SpeechOptions;
    resolve: () => void;
    reject: (error: Error) => void;
  }> = [];
  private isProcessing: boolean = false;
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isInitialized: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  
  private constructor() {
    this.synthesis = window.speechSynthesis;
  }

  static getInstance(): VoiceFeedback {
    if (!VoiceFeedback.instance) {
      VoiceFeedback.instance = new VoiceFeedback();
    }
    return VoiceFeedback.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Create audio context with user interaction
      const resumeAudioContext = async () => {
        if (!this.audioContext) {
          this.audioContext = new AudioContext();
        }
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }
      };

      // Add event listener for user interaction
      const handleInteraction = async () => {
        await resumeAudioContext();
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('touchstart', handleInteraction);
      };

      document.addEventListener('click', handleInteraction);
      document.addEventListener('touchstart', handleInteraction);

      // Load voices
      await this.loadVoices();
      
      // Add window focus/blur handlers
      window.addEventListener('focus', this.handleWindowFocus);
      window.addEventListener('blur', this.handleWindowBlur);
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      throw error;
    }
  }

  private handleWindowFocus = () => {
    // Resume speaking if we were interrupted
    if (this.isSpeaking && this.currentUtterance) {
      this.synthesis.cancel(); // Clear any stuck utterances
      this.speak(this.currentUtterance.text, {
        rate: this.currentUtterance.rate,
        pitch: this.currentUtterance.pitch,
        volume: this.currentUtterance.volume
      });
    }
  };

  private handleWindowBlur = () => {
    // Remember we were speaking but don't cancel
    if (this.currentUtterance) {
      this.isSpeaking = true;
    }
  };

  private async loadVoices(): Promise<void> {
    // Wait for voices to be loaded
    if (this.synthesis.getVoices().length === 0) {
      await new Promise<void>((resolve) => {
        const handleVoicesChanged = () => {
          this.voices = this.synthesis.getVoices();
          this.selectedVoice = this.selectVoice(this.voices);
          this.synthesis.removeEventListener('voiceschanged', handleVoicesChanged);
          resolve();
        };
        this.synthesis.addEventListener('voiceschanged', handleVoicesChanged);
      });
    } else {
      this.voices = this.synthesis.getVoices();
      this.selectedVoice = this.selectVoice(this.voices);
    }
  }

  private selectVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice {
    // Prefer a female English voice for Eleanor
    const preferredVoices = voices.filter(voice => 
      voice.lang.startsWith('en') && 
      voice.name.toLowerCase().includes('female')
    );

    if (preferredVoices.length > 0) {
      return preferredVoices[0];
    }

    // Fallback to any English voice
    const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
    if (englishVoices.length > 0) {
      return englishVoices[0];
    }

    // Last resort: use the first available voice
    return voices[0];
  }

  async speak(text: string, options: SpeechOptions = {}): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      // Add to queue
      this.audioQueue.push({
        text,
        options,
        resolve,
        reject
      });

      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.audioQueue.length === 0) return;

    this.isProcessing = true;
    const { text, options, resolve, reject } = this.audioQueue[0];

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      utterance.volume = options.volume ?? 0.8;
      utterance.rate = options.rate ?? 0.9;
      utterance.pitch = options.pitch ?? 1.1;

      this.currentUtterance = utterance;
      this.isSpeaking = true;

      utterance.onend = () => {
        this.currentUtterance = null;
        this.isSpeaking = false;
        resolve();
        this.audioQueue.shift();
        this.isProcessing = false;
        this.processQueue();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        this.isSpeaking = false;
        
        // Only reject if it's not an interruption
        if (event.error !== 'interrupted') {
          reject(new Error(`Speech synthesis error: ${event.error}`));
        }
        
        this.audioQueue.shift();
        this.isProcessing = false;
        this.processQueue();
      };

      this.synthesis.speak(utterance);
    } catch (error) {
      this.currentUtterance = null;
      this.isSpeaking = false;
      reject(error);
      this.audioQueue.shift();
      this.isProcessing = false;
      this.processQueue();
    }
  }

  async announceError(message: string): Promise<void> {
    return this.speak(message, {
      rate: 1.1,
      pitch: 0.9,
      volume: 0.9
    });
  }

  cancel(): void {
    this.synthesis.cancel();
    this.currentUtterance = null;
    this.isSpeaking = false;
    this.audioQueue = [];
    this.isProcessing = false;
  }

  cleanup(): void {
    window.removeEventListener('focus', this.handleWindowFocus);
    window.removeEventListener('blur', this.handleWindowBlur);
    this.cancel();
  }
}