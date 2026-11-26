// Motor de Efectos SFX + Sintetizador Polifónico en Re Dórico (3 Canales)
let audioCtx = null;
let masterGain = null;
let sfxEnabled = true;
let bgmPlaying = false;
let bgmTimer = null;

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
  osc.frequency.setValueAtTime(587.33, now);       // Re5
  osc.frequency.setValueAtTime(783.99, now + 0.025); // Sol5

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

// --- MOTOR POLIFÓNICO EN RE DÓRICO ---
const N = {
  D2: 73.42,  G2: 98.00,  A2: 110.00, B2: 123.47, C3: 130.81,
  D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00
};

const composition = [
  // Compás 1: Dm9
  { bass: N.D2, arp: N.D3, mel: N.A4, melDur: 1.4 },
  { bass: null, arp: N.A3, mel: null, melDur: 0 },
  { bass: null, arp: N.F4, mel: N.G4, melDur: 0.4 },
  { bass: null, arp: N.E4, mel: N.F4, melDur: 0.8 },
  { bass: N.A2, arp: N.D3, mel: null, melDur: 0 },
  { bass: null, arp: N.A3, mel: N.E4, melDur: 0.8 },
  { bass: null, arp: N.F4, mel: null, melDur: 0 },
  { bass: null, arp: N.A3, mel: N.D4, melDur: 0.8 },

  // Compás 2: G/B (Giro Dórico luminoso con Si natural)
  { bass: N.B2, arp: N.G3, mel: N.B4, melDur: 1.5 },
  { bass: null, arp: N.D4, mel: null, melDur: 0 },
  { bass: null, arp: N.G4, mel: null, melDur: 0 },
  { bass: null, arp: N.D4, mel: N.A4, melDur: 0.4 },
  { bass: N.G2, arp: N.B3, mel: N.G4, melDur: 1.1 },
  { bass: null, arp: N.D4, mel: null, melDur: 0 },
  { bass: null, arp: N.G4, mel: N.A4, melDur: 0.4 },
  { bass: null, arp: N.D4, mel: N.B4, melDur: 0.5 },

  // Compás 3: Cmaj7
  { bass: N.C3, arp: N.G3, mel: N.D5, melDur: 1.5 },
  { bass: null, arp: N.E4, mel: null, melDur: 0 },
  { bass: null, arp: N.B4, mel: null, melDur: 0 },
  { bass: null, arp: N.G4, mel: N.C5, melDur: 0.4 },
  { bass: N.G2, arp: N.E4, mel: N.B4, melDur: 1.1 },
  { bass: null, arp: N.G4, mel: null, melDur: 0 },
  { bass: null, arp: N.E4, mel: N.A4, melDur: 0.4 },
  { bass: null, arp: N.G3, mel: N.G4, melDur: 0.5 },

  // Compás 4: Am7 -> Resolución suspendida
  { bass: N.A2, arp: N.E3, mel: N.F4, melDur: 1.1 },
  { bass: null, arp: N.C4, mel: null, melDur: 0 },
  { bass: null, arp: N.G4, mel: N.E4, melDur: 0.7 },
  { bass: null, arp: N.E4, mel: null, melDur: 0 },
  { bass: N.D2, arp: N.D3, mel: N.E4, melDur: 1.4 },
  { bass: null, arp: N.A3, mel: null, melDur: 0 },
  { bass: null, arp: N.E4, mel: null, melDur: 0 },
  { bass: null, arp: N.A3, mel: null, melDur: 0 }
];

let stepIndex = 0;
const stepTimeMs = 340;

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
  gain.gain.linearRampToValueAtTime(peakGain, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + durationSec + 0.05);
}

function playPolyStep() {
  const event = composition[stepIndex];
  if (event.bass) triggerVoice(event.bass, 'sine', 0.11, 2.4, 400);
  if (event.arp)  triggerVoice(event.arp, 'triangle', 0.032, 0.55, 1400);
  if (event.mel)  triggerVoice(event.mel, 'square', 0.022, event.melDur, 1100);
  stepIndex = (stepIndex + 1) % composition.length;
}

// Controles vinculados al DOM
document.addEventListener('DOMContentLoaded', () => {
  const sfxBtn = document.getElementById('sfxToggle');
  const sfxLabel = document.getElementById('sfxLabel');
  const bgmBtn = document.getElementById('bgmToggle');
  const bgmLabel = document.getElementById('bgmLabel');

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
      playPolyStep();
      bgmTimer = setInterval(playPolyStep, stepTimeMs);
    } else {
      bgmPlaying = false;
      clearInterval(bgmTimer);
      bgmBtn.classList.remove('active');
      bgmLabel.textContent = 'BGM: OFF';
    }
  });
});