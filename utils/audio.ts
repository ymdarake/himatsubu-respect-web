let audioContext: AudioContext | null = null;
let whiteNoiseBuffer: AudioBuffer | null = null;

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
export const resumeAudioContext = async () => {
  if (audioContext && audioContext.state === 'suspended') {
    await audioContext.resume();
  }
};

// Initialize on load, if in a browser environment
createAudioContext();

type SoundType = 'playerAttack' | 'enemyAttack' | 'playerHit' | 'enemyHit' | 'playerDeath';

export const playSound = (type: SoundType) => {
  if (!audioContext || audioContext.state !== 'running') return;

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
let bgmPlaying = false;
let bgmInterval: number | undefined;

const NOTE_FREQ: Record<string, number> = {
    'C3': 130.81, 'D3': 146.83, 'E3': 164.81, 'F3': 174.61, 'G3': 196.00, 'A3': 220.00,
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
    'C5': 523.25,
};
const REST = null;

const BGM_SONG = {
    tempo: 140, // bpm
    melody: [
        'G4', 'A4', 'B4', 'G4', 'A4', 'B4', 'C5', REST,
        'E4', 'F4', 'G4', 'E4', 'F4', 'G4', 'A4', REST,
        'G4', 'A4', 'B4', 'G4', 'A4', 'B4', 'C5', 'B4',
        'A4', 'G4', 'F4', 'E4', 'D4', 'E4', 'C4', REST,
    ],
    bass: [
        'C3', REST, 'G3', REST, 'C3', REST, 'G3', REST,
        'A3', REST, 'E3', REST, 'A3', REST, 'E3', REST,
        'F3', REST, 'C3', REST, 'F3', REST, 'C3', REST,
        'G3', REST, 'D3', REST, 'G3', 'F3', 'E3', 'D3',
    ],
};

let noteIndex = 0;

export const playBGM = () => {
    if (!audioContext || bgmPlaying) return;
    if (audioContext.state !== 'running') {
      console.warn('AudioContext not running, cannot play BGM.');
      return;
    }

    bgmPlaying = true;
    noteIndex = 0;
    const noteIntervalMs = (60 / BGM_SONG.tempo) * 1000 / 2; // Corresponds to 8th notes

    const playNote = () => {
        if (!audioContext) return;
        const melodyNoteName = BGM_SONG.melody[noteIndex % BGM_SONG.melody.length];
        const bassNoteName = BGM_SONG.bass[noteIndex % BGM_SONG.bass.length];

        const nextNoteTime = audioContext.currentTime + 0.05;

        // Play Melody
        if (melodyNoteName !== REST) {
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
        if (bassNoteName !== REST) {
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
    bgmPlaying = false;
};