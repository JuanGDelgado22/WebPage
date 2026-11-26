// Motor de Efectos SFX + Sintetizador Polifónico Dual (Re Dórico & Sol Lidio)
let audioCtx = null;
let masterGain = null;
let sfxEnabled = true;
let bgmPlaying = false;
let bgmTimer = null;
let currentTrack = 1; // 1 = Abismo (Re Dórico), 2 = Aldea (Sol Mayor/Lidio)

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.85, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// --- EFECTOS DE SONIDO (SFX) ---
function playCursorSound() {
  if (!sfxEnabled) return;
  initAudio();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(587.33, now);
  osc.frequency.setValueAtTime(783.99, now + 0.025);

  gain.gain.setValueAtTime(0.025, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);

  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.07);
}

function playSelectSound() {
  if (!sfxEnabled) return;
  initAudio();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(587.33, now);
  osc.frequency.setValueAtTime(880.00, now + 0.05);
  osc.frequency.setValueAtTime(987.77, now + 0.10);

  gain.gain.setValueAtTime(0.035, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.25);
}

function playEmptySlotSound() {
  if (!sfxEnabled) return;
  initAudio();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(196.00, now);
  osc.frequency.setValueAtTime(146.83, now + 0.08);

  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.23);
}

function playVoiceBlip() {
  if (!sfxEnabled) return;
  initAudio();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  const baseFreq = 165 + (Math.random() * 25 - 12);
  osc.frequency.setValueAtTime(baseFreq, now);

  gain.gain.setValueAtTime(0.035, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.05);
}

// --- TABLA DE FRECUENCIAS ---
const N = {
  D2: 73.42,  G2: 98.00,  A2: 110.00, B2: 123.47, C3: 130.81,
  D3: 146.83, E3: 164.81, F3: 174.61, Fs3: 185.00, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, Cs4: 277.18, D4: 293.66, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, Cs5: 554.37, D5: 587.33, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, A5: 880.00
};

// PISTA 1: "Ecos del Abismo" (Re Dórico - Melancólica pero esperanzadora)
const trackDorian = [
  { bass: N.D2, arp: N.D3, mel: N.A4, melDur: 1.4 },
  { bass: null, arp: N.A3, mel: null, melDur: 0 },
  { bass: null, arp: N.F4, mel: N.G4, melDur: 0.4 },
  { bass: null, arp: N.E4, mel: N.F4, melDur: 0.8 },
  { bass: N.A2, arp: N.D3, mel: null, melDur: 0 },
  { bass: null, arp: N.A3, mel: N.E4, melDur: 0.8 },
  { bass: null, arp: N.F4, mel: null, melDur: 0 },
  { bass: null, arp: N.A3, mel: N.D4, melDur: 0.8 },

  { bass: N.B2, arp: N.G3, mel: N.B4, melDur: 1.5 },
  { bass: null, arp: N.D4, mel: null, melDur: 0 },
  { bass: null, arp: N.G4, mel: null, melDur: 0 },
  { bass: null, arp: N.D4, mel: N.A4, melDur: 0.4 },
  { bass: N.G2, arp: N.B3, mel: N.G4, melDur: 1.1 },
  { bass: null, arp: N.D4, mel: null, melDur: 0 },
  { bass: null, arp: N.G4, mel: N.A4, melDur: 0.4 },
  { bass: null, arp: N.D4, mel: N.B4, melDur: 0.5 },

  { bass: N.C3, arp: N.G3, mel: N.D5, melDur: 1.5 },
  { bass: null, arp: N.E4, mel: null, melDur: 0 },
  { bass: null, arp: N.B4, mel: null, melDur: 0 },
  { bass: null, arp: N.G4, mel: N.C5, melDur: 0.4 },
  { bass: N.G2, arp: N.E4, mel: N.B4, melDur: 1.1 },
  { bass: null, arp: N.G4, mel: null, melDur: 0 },
  { bass: null, arp: N.E4, mel: N.A4, melDur: 0.4 },
  { bass: null, arp: N.G3, mel: N.G4, melDur: 0.5 },

  { bass: N.A2, arp: N.E3, mel: N.F4, melDur: 1.1 },
  { bass: null, arp: N.C4, mel: null, melDur: 0 },
  { bass: null, arp: N.G4, mel: N.E4, melDur: 0.7 },
  { bass: null, arp: N.E4, mel: null, melDur: 0 },
  { bass: N.D2, arp: N.D3, mel: N.E4, melDur: 1.4 },
  { bass: null, arp: N.A3, mel: null, melDur: 0 },
  { bass: null, arp: N.E4, mel: null, melDur: 0 },
  { bass: null, arp: N.A3, mel: null, melDur: 0 }
];

// PISTA 2: "Mañana en el Valle" (Sol Mayor / Lidio - Cálida, acogedora estilo Stardew/Home)
const trackVillage = [
  // Gmaj7
  { bass: N.G2, arp: N.D3, mel: N.B4, melDur: 0.7 },
  { bass: null, arp: N.G3, mel: N.D5, melDur: 0.7 },
  { bass: null, arp: N.B3, mel: N.Fs5, melDur: 1.0 },
  { bass: null, arp: N.Fs4, mel: null, melDur: 0 },
  { bass: N.D3, arp: N.B3, mel: N.E5, melDur: 0.7 },
  { bass: null, arp: N.G3, mel: N.D5, melDur: 0.7 },
  { bass: null, arp: N.D4, mel: N.B4, melDur: 0.9 },
  { bass: null, arp: N.B3, mel: null, melDur: 0 },

  // Cmaj7 (#11 Lidio luminoso con Fa#)
  { bass: N.C3, arp: N.G3, mel: N.E5, melDur: 1.1 },
  { bass: null, arp: N.E4, mel: null, melDur: 0 },
  { bass: null, arp: N.B4, mel: N.Fs5, melDur: 0.5 },
  { bass: null, arp: N.E4, mel: N.G5, melDur: 0.8 },
  { bass: N.G2, arp: N.E4, mel: N.Fs5, melDur: 0.7 },
  { bass: null, arp: N.B3, mel: N.D5, melDur: 0.7 },
  { bass: null, arp: N.G3, mel: N.B4, melDur: 0.9 },
  { bass: null, arp: N.E3, mel: null, melDur: 0 },

  // Em7 -> Bm7
  { bass: N.E3, arp: N.B3, mel: N.G4, melDur: 0.7 },
  { bass: null, arp: N.G4, mel: N.A4, melDur: 0.7 },
  { bass: null, arp: N.D5, mel: N.B4, melDur: 1.0 },
  { bass: null, arp: N.G4, mel: null, melDur: 0 },
  { bass: N.B2, arp: N.Fs3, mel: N.D5, melDur: 0.7 },
  { bass: null, arp: N.D4, mel: N.B4, melDur: 0.7 },
  { bass: null, arp: N.A4, mel: N.A4, melDur: 0.9 },
  { bass: null, arp: N.Fs4, mel: null, melDur: 0 },

  // Am7 -> Dsus4 -> D
  { bass: N.A2, arp: N.E3, mel: N.G4, melDur: 0.8 },
  { bass: null, arp: N.C4, mel: N.E4, melDur: 0.8 },
  { bass: null, arp: N.G4, mel: N.Fs4, melDur: 0.8 },
  { bass: null, arp: N.C4, mel: N.G4, melDur: 0.8 },
  { bass: N.D3, arp: N.A3, mel: N.A4, melDur: 1.4 },
  { bass: null, arp: N.Fs4, mel: null, melDur: 0 },
  { bass: null, arp: N.D4, mel: null, melDur: 0 },
  { bass: null, arp: N.A3, mel: null, melDur: 0 }
];

let stepIndex = 0;

function triggerVoice(freq, type, peakGain, durationSec, filterFreq = 2000) {
  if (!freq || !audioCtx) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(filterFreq, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(peakGain, now + 0.035);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + durationSec + 0.05);
}

function playPolyStep() {
  const activeComp = currentTrack === 1 ? trackDorian : trackVillage;
  const event = activeComp[stepIndex];

  if (event.bass) triggerVoice(event.bass, 'sine', 0.11, 2.2, 420);
  if (event.arp)  triggerVoice(event.arp, 'triangle', 0.034, 0.5, 1600);
  if (event.mel)  triggerVoice(event.mel, 'square', 0.022, event.melDur, 1250);

  stepIndex = (stepIndex + 1) % activeComp.length;
}

window.switchBgmTrack = function(trackNum) {
  const target = trackNum ? Number(trackNum) : (currentTrack === 1 ? 2 : 1);
  if (target !== 1 && target !== 2) return false;

  currentTrack = target;
  stepIndex = 0;

  const trkLabel = document.getElementById('trkLabel');
  if (trkLabel) {
    trkLabel.textContent = currentTrack === 1 ? 'TRK: 01' : 'TRK: 02';
  }

  if (bgmPlaying) {
    clearInterval(bgmTimer);
    const tempo = currentTrack === 1 ? 340 : 300;
    playPolyStep();
    bgmTimer = setInterval(playPolyStep, tempo);
  }
  return currentTrack;
};

document.addEventListener('DOMContentLoaded', () => {
  const sfxBtn = document.getElementById('sfxToggle');
  const sfxLabel = document.getElementById('sfxLabel');
  const bgmBtn = document.getElementById('bgmToggle');
  const bgmLabel = document.getElementById('bgmLabel');
  const trkBtn = document.getElementById('trkToggle');

  sfxBtn.addEventListener('click', () => {
    sfxEnabled = !sfxEnabled;
    sfxBtn.classList.toggle('active', sfxEnabled);
    sfxLabel.textContent = sfxEnabled ? 'SFX: ON' : 'SFX: OFF';
    if (sfxEnabled) playSelectSound();
  });

  bgmBtn.addEventListener('click', () => {
    initAudio();
    if (!bgmPlaying) {
      bgmPlaying = true;
      bgmBtn.classList.add('active');
      bgmLabel.textContent = 'BGM: ON';
      const tempo = currentTrack === 1 ? 340 : 300;
      playPolyStep();
      bgmTimer = setInterval(playPolyStep, tempo);
      if (typeof window.companionSay === 'function') {
        window.companionSay(currentTrack === 1 ? '♪ Ecos del Abismo...' : '♪ Brisa del Valle...');
      }
    } else {
      bgmPlaying = false;
      clearInterval(bgmTimer);
      bgmBtn.classList.remove('active');
      bgmLabel.textContent = 'BGM: OFF';
    }
  });

  if (trkBtn) {
    trkBtn.addEventListener('click', () => {
      const next = window.switchBgmTrack();
      playSelectSound();
      if (typeof window.companionSay === 'function') {
        window.companionSay(next === 1 ? 'Pista 01: Re Dórico' : 'Pista 02: Sol Lidio');
      }
    });
  }
});