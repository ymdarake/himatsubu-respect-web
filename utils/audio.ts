

let audioContext: AudioContext | null = null;
let whiteNoiseBuffer: AudioBuffer | null = null;
let isMutedGlobally = false;

const createAudioContext = () => {
  if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioContext) {
        const bufferSize = audioContext.sampleRate * 0.5; // 0.5 seconds is enough
        whiteNoiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = whiteNoiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
    }
  }
};

// Function to be called on first user interaction
// FIX: Ensure the function returns the promise from audioContext.resume()
export const resumeAudioContext = async () => {
  if (audioContext && audioContext.state === 'suspended') {
    return audioContext.resume();
  }
};

// Initialize on load, if in a browser environment
createAudioContext();

export const setMutedState = (muted: boolean) => {
    isMutedGlobally = muted;
    if (muted) {
        stopBGM();
    }
}

type SoundType = 'playerAttack' | 'enemyAttack' | 'playerHit' | 'enemyHit' | 'playerDeath' | 'levelUp';

export const playSound = (type: SoundType) => {
  if (isMutedGlobally || !audioContext || audioContext.state !== 'running') return;

  const gainNode = audioContext.createGain();
  gainNode.connect(audioContext.destination);
  
  const now = audioContext.currentTime;

  switch (type) {
    case 'playerAttack':
      if (!whiteNoiseBuffer) return;
      
      const source = audioContext.createBufferSource();
      source.buffer = whiteNoiseBuffer;

      const filter = audioContext.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 15;

      source.connect(filter);
      filter.connect(gainNode);
      
      const attackDuration = 0.15;

      // Pitch sweep for "swoosh"
      filter.frequency.setValueAtTime(4000, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + attackDuration);
      
      // Volume envelope for sharp attack
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + attackDuration);

      source.start(now);
      source.stop(now + attackDuration);
      break;

    case 'enemyAttack':
      const oscEA = audioContext.createOscillator();
      oscEA.connect(gainNode);
      gainNode.gain.setValueAtTime(0.08, now);
      oscEA.type = 'sawtooth';
      oscEA.frequency.setValueAtTime(220, now); // A3
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      oscEA.start(now);
      oscEA.stop(now + 0.3);
      break;

    case 'playerHit':
      const oscPH = audioContext.createOscillator();
      oscPH.connect(gainNode);
      gainNode.gain.setValueAtTime(0.08, now);
      oscPH.type = 'square';
      oscPH.frequency.setValueAtTime(110, now); // A2
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      oscPH.start(now);
      oscPH.stop(now + 0.25);
      break;

    case 'enemyHit':
      const oscEH = audioContext.createOscillator();
      oscEH.connect(gainNode);
      gainNode.gain.setValueAtTime(0.08, now);
      oscEH.type = 'sine';
      oscEH.frequency.setValueAtTime(330, now); // E4
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      oscEH.start(now);
      oscEH.stop(now + 0.15);
      break;
    
    case 'levelUp': {
      const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      const noteDuration = 0.2;
      const noteDelay = 0.1;

      notes.forEach((freq, index) => {
        const osc = audioContext.createOscillator();
        const oscGain = audioContext.createGain();
        osc.connect(oscGain);
        oscGain.connect(gainNode);

        const startTime = now + index * noteDelay;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        
        oscGain.gain.setValueAtTime(0, startTime);
        oscGain.gain.linearRampToValueAtTime(0.12, startTime + 0.01);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration);

        osc.start(startTime);
        osc.stop(startTime + noteDuration);
      });
      break;
    }
      
    case 'playerDeath':
      const oscPD = audioContext.createOscillator();
      oscPD.connect(gainNode);
      gainNode.gain.setValueAtTime(0.1, now);
      oscPD.type = 'sawtooth';
      oscPD.frequency.setValueAtTime(200, now);
      oscPD.frequency.exponentialRampToValueAtTime(50, now + 1.5);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
      oscPD.start(now);
      oscPD.stop(now + 1.5);
      break;
  }
};

// BGM
let currentBgmIndex: number | null = null;
let bgmInterval: number | undefined;

const NOTE_FREQ: Record<string, number> = {
    'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
    'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99,
};
const REST = null;

// Area 1: Grassland (Original)
const BGM_GRASSLAND = {
    tempo: 140,
    melody: [ 'G4', 'A4', 'B4', 'G4', 'A4', 'B4', 'C5', REST, 'E4', 'F4', 'G4', 'E4', 'F4', 'G4', 'A4', REST, 'G4', 'A4', 'B4', 'G4', 'A4', 'B4', 'C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'E4', 'C4', REST, ],
    bass: [ 'C3', REST, 'G3', REST, 'C3', REST, 'G3', REST, 'A3', REST, 'E3', REST, 'A3', REST, 'E3', REST, 'F3', REST, 'C3', REST, 'F3', REST, 'C3', REST, 'G3', REST, 'D3', REST, 'G3', 'F3', 'E3', 'D3', ],
};

// Area 2: Dark Forest
const BGM_FOREST = {
    tempo: 110,
    melody: [ 'A3', 'C4', 'B3', 'A3', 'E4', REST, 'D4', 'C4', 'B3', 'D4', 'C4', 'B3', 'F4', REST, 'E4', 'D4', 'G3', 'B3', 'A3', 'G3', 'D4', REST, 'C4', 'B3', 'A3', 'C4', 'B3', 'A3', 'E3', REST, REST, REST ],
    bass: [ 'F2', REST, REST, REST, 'C3', REST, REST, REST, 'G2', REST, REST, REST, 'D3', REST, REST, REST, 'F2', REST, REST, REST, 'C3', REST, REST, REST, 'G2', REST, REST, REST, 'A2', REST, REST, REST ],
};

// Area 3: Dusty Cave
const BGM_CAVE = {
    tempo: 120,
    melody: [ 'G3', REST, 'G3', 'A3', 'G3', REST, 'F3', REST, 'D3', REST, 'D3', 'F3', 'D3', REST, 'C3', REST, 'C4', REST, 'B3', 'A3', 'G3', REST, 'A3', 'B3', 'C4', REST, 'B3', 'A3', 'G3', 'F3', 'E3', REST ],
    bass: [ 'C2', REST, 'C2', REST, 'G2', REST, 'G2', REST, 'F2', REST, 'F2', REST, 'C2', REST, 'C2', REST, 'C2', 'G2', 'F2', 'C2', 'G2', 'F2', 'G2', 'C2', 'F2', 'G2', 'C2', 'F2', 'C2', REST, REST, REST ],
};

// Area 4: Volcano
const BGM_VOLCANO = {
    tempo: 160,
    melody: [ 'C4', 'C4', 'G4', 'G4', 'C4', 'D4', 'E4', REST, 'F4', 'F4', 'C4', 'C4', 'F4', 'G4', 'A4', REST, 'G4', 'E4', 'C4', 'E4', 'G4', 'E4', 'D4', 'B3', 'C4', 'A3', 'F3', 'A3', 'C4', REST, REST, REST ],
    bass: [ 'C3', 'C3', 'C3', 'C3', 'F3', 'F3', 'F3', 'F3', 'G3', 'G3', 'G3', 'G3', 'C3', 'C3', 'C3', 'C3', 'C3', 'F3', 'G3', 'C3', 'C3', 'F3', 'G3', 'C3', 'F3', 'G3', 'C3', 'F3', 'G3', 'C3', 'G3', 'C3' ],
};

// Area 5: Castle Gate
const BGM_CASTLE = {
    tempo: 120,
    melody: [ 'C4', 'E4', 'G4', REST, 'G4', 'A4', 'G4', 'F4', 'E4', 'D4', 'E4', 'C4', REST, REST, REST, REST, 'G4', 'A4', 'B4', REST, 'B4', 'C5', 'B4', 'A4', 'G4', 'F4', 'G4', 'E4', REST, REST, REST, REST ],
    bass: [ 'C3', REST, 'G3', REST, 'F3', REST, 'C3', REST, 'G3', REST, 'G3', REST, 'C3', REST, REST, REST, 'C3', REST, 'G3', REST, 'F3', REST, 'C3', REST, 'G3', REST, 'G3', REST, 'C3', REST, REST, REST ],
};

// Area 6: Throne Room
const BGM_THRONE = {
    tempo: 100,
    melody: [ 'G4', 'B4', 'D5', 'G5', 'F5', 'D5', 'B4', 'G4', 'A4', 'C5', 'E5', 'A5', 'G5', 'E5', 'C5', 'A4', 'F4', 'A4', 'C5', 'F5', 'E5', 'C5', 'A4', 'F4', 'G4', 'B4', 'D5', 'G4', 'G4', REST, REST, REST ],
    bass: [ 'G3', REST, REST, REST, 'A3', REST, REST, REST, 'F3', REST, REST, REST, 'G3', REST, 'C3', REST, 'G3', REST, REST, REST, 'A3', REST, REST, REST, 'D3', REST, REST, REST, 'G2', REST, REST, REST ],
};

// Gamblers Theme: Lucky & Upbeat
const BGM_GAMBLERS = {
    tempo: 180,
    melody: [ 'C5', 'E5', 'G5', 'E5', 'C5', 'D5', 'F5', 'D5', 'E5', 'G5', 'C5', 'E5', 'D5', 'F5', 'A4', 'C5', 'G5', 'E5', 'D5', 'C5', 'B4', 'A4', 'G4', 'A4', 'C5', 'E5', 'G5', 'E5', 'C5', 'D5', 'B4', 'C5' ],
    bass: [ 'C3', REST, 'E3', REST, 'G3', REST, 'C3', REST, 'F3', REST, 'A3', REST, 'F3', REST, 'C3', REST, 'C3', REST, 'E3', REST, 'G3', REST, 'C3', REST, 'F3', REST, 'A3', REST, 'F3', REST, 'G3', 'C3' ],
};

const ALL_BGM_SONGS = [BGM_GRASSLAND, BGM_FOREST, BGM_CAVE, BGM_VOLCANO, BGM_CASTLE, BGM_THRONE, BGM_GAMBLERS];

let noteIndex = 0;

export const playBGM = (areaIndex: number) => {
    if (isMutedGlobally || !audioContext || currentBgmIndex === areaIndex) return;
    if (audioContext.state !== 'running') {
      console.warn('AudioContext not running, cannot play BGM.');
      return;
    }

    stopBGM(); // Ensure any previous BGM is stopped before starting a new one.

    currentBgmIndex = areaIndex;
    const song = ALL_BGM_SONGS[areaIndex % ALL_BGM_SONGS.length];
    noteIndex = 0;
    const noteIntervalMs = (60 / song.tempo) * 1000 / 2; // Corresponds to 8th notes

    const playNote = () => {
        if (!audioContext) return;
        const melodyNoteName = song.melody[noteIndex % song.melody.length];
        const bassNoteName = song.bass[noteIndex % song.bass.length];

        const nextNoteTime = audioContext.currentTime + 0.05;

        // Play Melody
        if (melodyNoteName && NOTE_FREQ[melodyNoteName]) {
            const melodyOsc = audioContext.createOscillator();
            const melodyGain = audioContext.createGain();
            melodyOsc.connect(melodyGain);
            melodyGain.connect(audioContext.destination);

            melodyOsc.type = 'triangle';
            melodyOsc.frequency.setValueAtTime(NOTE_FREQ[melodyNoteName], nextNoteTime);
            melodyGain.gain.setValueAtTime(0, nextNoteTime);
            melodyGain.gain.linearRampToValueAtTime(0.09, nextNoteTime + 0.02); // Quick attack
            melodyGain.gain.exponentialRampToValueAtTime(0.0001, nextNoteTime + (noteIntervalMs / 1000) * 0.9);

            melodyOsc.start(nextNoteTime);
            melodyOsc.stop(nextNoteTime + noteIntervalMs / 1000);
        }

        // Play Bass
        if (bassNoteName && NOTE_FREQ[bassNoteName]) {
            const bassOsc = audioContext.createOscillator();
            const bassGain = audioContext.createGain();
            bassOsc.connect(bassGain);
            bassGain.connect(audioContext.destination);

            bassOsc.type = 'sine';
            bassOsc.frequency.setValueAtTime(NOTE_FREQ[bassNoteName], nextNoteTime);
            bassGain.gain.setValueAtTime(0, nextNoteTime);
            bassGain.gain.linearRampToValueAtTime(0.11, nextNoteTime + 0.02);
            bassGain.gain.exponentialRampToValueAtTime(0.0001, nextNoteTime + (noteIntervalMs / 1000) * 0.95);

            bassOsc.start(nextNoteTime);
            bassOsc.stop(nextNoteTime + noteIntervalMs / 1000);
        }

        noteIndex++;
    };

    bgmInterval = window.setInterval(playNote, noteIntervalMs);
};

export const stopBGM = () => {
    if (bgmInterval) {
        clearInterval(bgmInterval);
        bgmInterval = undefined;
    }
    currentBgmIndex = null;
};

// ギャンブラー専用BGM（インデックス6）を再生
export const playGamblersBGM = () => {
    playBGM(6); // BGM_GAMBLERSのインデックス
};

// 通常のエリアBGMに戻す
export const playAreaBGM = (areaIndex: number) => {
    playBGM(Math.min(areaIndex, 5)); // 通常のエリアBGM（0-5）
};