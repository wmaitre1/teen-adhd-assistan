export class VoiceCommandManager {
  private static instance: VoiceCommandManager | null = null;
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;
  private voiceFeedback: VoiceFeedback;
  private isInitialized: boolean = false;
  private isGreetingPlayed: boolean = false;
  private config: Required<VoiceCommandManagerConfig>;
  private formManager: VoiceFormManager;

  // Event handlers
  public onCommand: ((result: CommandResult) => void) | null = null;
  public onTranscript: ((text: string, confidence: number) => void) | null = null;

  private constructor(config: VoiceCommandManagerConfig = {}) {
    this.config = {
      continuousListening: false,
      language: 'en-US',
      enableGreeting: true,
      ...config
    };
    this.voiceFeedback = VoiceFeedback.getInstance();
    this.formManager = VoiceFormManager.getInstance();
  }

  public static getInstance(config?: VoiceCommandManagerConfig): VoiceCommandManager {
    if (!VoiceCommandManager.instance) {
      VoiceCommandManager.instance = new VoiceCommandManager(config);
    }
    return VoiceCommandManager.instance;
  }

  public static resetInstance(): void {
    if (VoiceCommandManager.instance) {
      VoiceCommandManager.instance.cleanup();
      VoiceCommandManager.instance = null;
    }
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Check browser support
      if (!('webkitSpeechRecognition' in window)) {
        throw new Error('Speech recognition not supported in this browser');
      }

      // Initialize voice feedback
      await this.voiceFeedback.initialize();

      // Initialize speech recognition
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.setupRecognition();
      this.isInitialized = true;

      console.log('Voice command manager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize voice command manager:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  private setupRecognition(): void {
    if (!this.recognition) {
      throw new Error('Recognition not properly initialized');
    }

    this.recognition.continuous = this.config.continuousListening;
    this.recognition.interimResults = false;
    this.recognition.lang = this.config.language;

    this.recognition.onstart = () => {
      console.log('Voice recognition started');
      this.isListening = true;
    };

    this.recognition.onend = () => {
      console.log('Voice recognition ended');
      this.isListening = false;

      if (this.config.continuousListening && this.isInitialized) {
        console.log('Restarting recognition session...');
        setTimeout(() => {
          this.startListening().catch(error => {
            console.error('Failed to restart recognition:', error);
          });
        }, 100);
      }
    };

    this.recognition.onresult = async (event: SpeechRecognitionEvent) => {
      try {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        
        console.log('Transcript received:', transcript);
        console.log('Confidence:', confidence);

        if (this.onTranscript) {
          this.onTranscript(transcript, confidence);
        }

        const result = await CommandProcessor.processCommand(transcript);
        console.log('Command result:', result);

        if (this.onCommand) {
          this.onCommand(result);
        }

        if (result.feedback) {
          await this.voiceFeedback.speak(result.feedback);
        }
      } catch (error) {
        console.error('Error handling recognition result:', error);
        await this.voiceFeedback.announceError(
          "Something went wrong while processing your command."
        );
      }
    };

    this.recognition.onerror = async (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;

      const errorMessages: Record<string, string> = {
        'no-speech': "I didn't hear anything. Please try again.",
        'audio-capture': "I couldn't access your microphone. Please check your settings.",
        'not-allowed': "I need microphone permission to help you. Please enable it in your browser settings.",
        'network': "There seems to be a network issue. Please check your connection.",
        'aborted': "Voice recognition was interrupted. Please try again.",
        'service-not-allowed': "Voice recognition service is not available. Please try again later."
      };

      const errorMessage = errorMessages[event.error] || 
        "Sorry, there was a problem with voice recognition. Please try again.";
      
      await this.voiceFeedback.announceError(errorMessage);

      if (this.onCommand) {
        this.onCommand({
          type: 'error',
          error: errorMessage
        });
      }
    };
  }

  public async startListening(): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (this.isListening) {
        this.stopListening();
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (this.config.enableGreeting && !this.isGreetingPlayed) {
        await this.voiceFeedback.speak(
          "Hi! I'm Eleanor, your ADHD assistant. How can I help you?"
        );
        this.isGreetingPlayed = true;
      }

      await this.recognition?.start();
      console.log('Voice recognition started successfully');
    } catch (error) {
      console.error('Failed to start recognition:', error);
      this.isListening = false;
      throw error;
    }
  }

  public stopListening(): void {
    if (this.isListening && this.recognition) {
      try {
        this.recognition.stop();
        this.voiceFeedback.cancel();
        this.isListening = false;
      } catch (error) {
        console.error('Failed to stop recognition:', error);
      }
    }
  }

  public isRecognitionActive(): boolean {
    return this.isListening && this.isInitialized;
  }

  public resetGreeting(): void {
    this.isGreetingPlayed = false;
  }

  public cleanup(): void {
    this.stopListening();
    this.voiceFeedback.cleanup();
    this.isInitialized = false;
    this.isGreetingPlayed = false;
    this.onCommand = null;
    this.onTranscript = null;
  }
}