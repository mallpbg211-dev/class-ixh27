// Text-to-Speech Helper using Browser Native Web Speech API
// Runs 100% locally on device, zero latency, zero bandwidth, works offline on Android & Desktop.

class TtsHelper {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState: boolean = false;
  private onStateChangeListeners: Array<(isSpeaking: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isSupported(): boolean {
    return this.synth !== null;
  }

  public subscribeStateChange(listener: (isSpeaking: boolean) => void): () => void {
    this.onStateChangeListeners.push(listener);
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter((l) => l !== listener);
    };
  }

  private notifyState(speaking: boolean) {
    this.isSpeakingState = speaking;
    this.onStateChangeListeners.forEach((l) => l(speaking));
  }

  public speak(text: string, lang: string = 'en-US', rate: number = 0.9): void {
    if (!this.synth) {
      console.warn('Speech synthesis is not supported on this browser.');
      return;
    }

    // Cancel any ongoing speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate; // slightly slower for clear comprehension test
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = this.synth.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.default)
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      this.notifyState(true);
    };

    utterance.onend = () => {
      this.notifyState(false);
      this.currentUtterance = null;
    };

    utterance.onerror = () => {
      this.notifyState(false);
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.notifyState(false);
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }
}

export const ttsHelper = new TtsHelper();
