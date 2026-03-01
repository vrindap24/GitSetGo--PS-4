
export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private onDataAvailable: (base64Data: string, volume: number) => void;

  constructor(onDataAvailable: (base64Data: string, volume: number) => void) {
    this.onDataAvailable = onDataAvailable;
  }

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Try to create context with 16kHz
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: 16000,
        });
      } catch (e) {
        // Fallback to default sample rate
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      this.source = this.audioContext.createMediaStreamSource(this.stream);
      
      // Buffer size 4096
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Calculate volume (RMS)
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
            sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        const volume = Math.min(1, rms * 5); // Amplify a bit for visualizer

        // Resample if necessary
        let pcmData: Int16Array;
        if (this.audioContext!.sampleRate !== 16000) {
            pcmData = this.downsampleTo16k(inputData, this.audioContext!.sampleRate);
        } else {
            pcmData = this.floatTo16BitPCM(inputData);
        }

        const base64Data = this.arrayBufferToBase64(pcmData.buffer);
        this.onDataAvailable(base64Data, volume);
      };

      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    } catch (error) {
      console.error('Error starting audio recording:', error);
      throw error;
    }
  }

  stop() {
    if (this.processor && this.source) {
      this.source.disconnect();
      this.processor.disconnect();
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    
    this.stream = null;
    this.audioContext = null;
    this.source = null;
    this.processor = null;
  }

  private downsampleTo16k(input: Float32Array, sampleRate: number): Int16Array {
      if (sampleRate === 16000) {
          return this.floatTo16BitPCM(input);
      }
      const ratio = sampleRate / 16000;
      const newLength = Math.round(input.length / ratio);
      const result = new Int16Array(newLength);
      let offsetResult = 0;
      let offsetInput = 0;
      while (offsetResult < result.length) {
          const nextOffsetInput = Math.round((offsetResult + 1) * ratio);
          let accum = 0, count = 0;
          for (let i = offsetInput; i < nextOffsetInput && i < input.length; i++) {
              accum += input[i];
              count++;
          }
          const s = Math.max(-1, Math.min(1, accum / count));
          result[offsetResult] = s < 0 ? s * 0x8000 : s * 0x7FFF;
          offsetResult++;
          offsetInput = nextOffsetInput;
      }
      return result;
  }

  private floatTo16BitPCM(input: Float32Array): Int16Array {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      let s = Math.max(-1, Math.min(1, input[i]));
      s = s < 0 ? s * 0x8000 : s * 0x7FFF;
      output[i] = s;
    }
    return output;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}

export class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private nextStartTime: number = 0;
  private queue: string[] = [];
  private isProcessing: boolean = false;

  constructor() {
    // Initialize lazily on first play to respect autoplay policies
  }

  async play(base64Data: string) {
    this.queue.push(base64Data);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    
    if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Resume context if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
    }

    const base64Data = this.queue.shift()!;
    
    try {
        const audioBuffer = this.base64ToAudioBuffer(base64Data);
        
        if (audioBuffer) {
            const source = this.audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(this.audioContext.destination);
            
            const currentTime = this.audioContext.currentTime;
            // Schedule slightly in the future to avoid glitches
            // If nextStartTime is in the past, reset it to currentTime
            if (this.nextStartTime < currentTime) {
                this.nextStartTime = currentTime;
            }
            
            source.start(this.nextStartTime);
            this.nextStartTime += audioBuffer.duration;
        }
    } catch (e) {
        console.error("Error playing audio chunk", e);
    }

    // Process next chunk immediately - we are scheduling them, not waiting for them to finish playing
    // However, we should probably yield a bit to not block the thread if queue is huge, 
    // but for real-time it should be fine.
    // Actually, we want to schedule them as fast as they come.
    this.processQueue();
  }

  private base64ToAudioBuffer(base64: string): AudioBuffer | null {
    if (!this.audioContext) return null;

    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const int16Data = new Int16Array(bytes.buffer);
    const float32Data = new Float32Array(int16Data.length);
    
    for (let i = 0; i < int16Data.length; i++) {
        float32Data[i] = int16Data[i] / 32768.0;
    }

    // Gemini 2.5 Flash Native output is 24kHz
    const audioBuffer = this.audioContext.createBuffer(1, float32Data.length, 24000);
    audioBuffer.getChannelData(0).set(float32Data);
    
    return audioBuffer;
  }

  stop() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.queue = [];
    this.isProcessing = false;
    this.nextStartTime = 0;
  }
}
