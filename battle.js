// Minijuego Oculto: Caja de Batalla / Evasión de Bugs (battle.js)
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('battleModal');
  const canvas = document.getElementById('battleCanvas');
  const ctx = canvas.getContext('2d');
  const hpText = document.getElementById('battleHp');
  const timerText = document.getElementById('battleTimer');
  const statusText = document.getElementById('battleStatus');
  const closeBtn = document.getElementById('battleClose');

  let animFrameId = null;
  let gameTimerId = null;
  let isRunning = false;

  const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 14,
    speed: 3.4,
    hp: 20,
    maxHp: 20,
    invulnFrames: 0
  };

  let bullets = [];
  let timeLeft = 15;
  const keys = {};

  function playHitSound() {
    if (typeof sfxEnabled !== 'undefined' && !sfxEnabled) return;
    if (typeof initAudio === 'function') initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.18);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.21);
  }

  function playVictorySound() {
    if (typeof sfxEnabled !== 'undefined' && !sfxEnabled) return;
    if (typeof initAudio === 'function') initAudio();
    if (!audioCtx) return;

    const notes = [587.33, 739.99, 880.00, 1174.66];
    notes.forEach((freq, idx) => {
      const now = audioCtx.currentTime + idx * 0.08;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.36);
    });
  }

  function drawPixelHeart(x, y, color) {
    const p = 2;
    const pattern = [
      "01100110",
      "11111111",
      "11111111",
      "11111111",
      "01111110",
      "00111100",
      "00011000"
    ];
    ctx.fillStyle = color;
    const offsetX = x - (8 * p) / 2;
    const offsetY = y - (7 * p) / 2;

    for (let r = 0; r < pattern.length; r++) {
      for (let c = 0; c < pattern[r].length; c++) {
        if (pattern[r][c] === '1') {
          ctx.fillRect(offsetX + c * p, offsetY + r * p, p, p);
        }
      }
    }
  }

  function spawnBug() {
    const labels = ['404', '500', 'BUG', 'LAG', 'ERR', 'NULL'];
    const label = labels[Math.floor(Math.random() * labels.length)];
    const side = Math.floor(Math.random() * 4);
    let x, y, vx, vy;
    const speed = 1.6 + Math.random() * 1.4;

    if (side === 0) {
      x = Math.random() * canvas.width;
      y = -10;
    } else if (side === 1) {
      x = canvas.width + 10;
      y = Math.random() * canvas.height;
    } else if (side === 2) {
      x = Math.random() * canvas.width;
      y = canvas.height + 10;
    } else {
      x = -10;
      y = Math.random() * canvas.height;
    }

    const angle = Math.atan2(player.y - y, player.x - x) + (Math.random() * 0.4 - 0.2);
    vx = Math.cos(angle) * speed;
    vy = Math.sin(angle) * speed;

    bullets.push({ x, y, vx, vy, label });
  }

  function updateHud() {
    hpText.textContent = `HP ${player.hp} / ${player.maxHp}`;
    timerText.textContent = `TIEMPO: ${timeLeft}s`;
  }

  function stopBattle(message) {
    isRunning = false;
    cancelAnimationFrame(animFrameId);
    clearInterval(gameTimerId);
    if (message) statusText.textContent = message;
  }

  function closeBattleModal() {
    stopBattle('');
    modal.classList.remove('open');
    if (typeof playSelectSound === 'function') playSelectSound();
  }

  function gameLoop() {
    if (!isRunning) return;

    if (keys['ArrowUp'] || keys['w'] || keys['W']) player.y -= player.speed;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) player.y += player.speed;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) player.x += player.speed;

    const pad = 12;
    player.x = Math.max(pad, Math.min(canvas.width - pad, player.x));
    player.y = Math.max(pad, Math.min(canvas.height - pad, player.y));

    if (player.invulnFrames > 0) player.invulnFrames--;

    if (Math.random() < 0.085) spawnBug();

    ctx.fillStyle = '#050608';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 11px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.x += b.vx;
      b.y += b.vy;

      if (b.x < -30 || b.x > canvas.width + 30 || b.y < -30 || b.y > canvas.height + 30) {
        bullets.splice(i, 1);
        continue;
      }

      ctx.fillStyle = '#f87171';
      ctx.fillText(b.label, b.x, b.y);

      const dist = Math.hypot(player.x - b.x, player.y - b.y);
      if (dist < 13 && player.invulnFrames === 0) {
        player.hp = Math.max(0, player.hp - 4);
        player.invulnFrames = 35;
        bullets.splice(i, 1);
        playHitSound();
        updateHud();

        if (player.hp <= 0) {
          stopBattle('* ¡EXCEPCIÓN CRÍTICA! El servidor cayó. Presiona [ESC] o [SALIR].');
          return;
        }
      }
    }

    const soulColor = getComputedStyle(document.documentElement).getPropertyValue('--soul-yellow').trim() || '#ffd800';
    if (player.invulnFrames % 6 < 3) {
      drawPixelHeart(player.x, player.y, soulColor);
    }

    animFrameId = requestAnimationFrame(gameLoop);
  }

  window.startSysBattle = function() {
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.hp = player.maxHp;
    player.invulnFrames = 0;
    bullets = [];
    timeLeft = 15;
    isRunning = true;

    statusText.textContent = '* ¡Un enjambre de Bugs en Producción bloquea el paso! Esquiva con [FLECHAS / WASD].';
    updateHud();
    modal.classList.add('open');

    clearInterval(gameTimerId);
    gameTimerId = setInterval(() => {
      if (!isRunning) return;
      timeLeft--;
      updateHud();
      if (timeLeft <= 0) {
        playVictorySound();
        stopBattle('* ¡DEPURACIÓN COMPLETADA! 99.99% Uptime asegurado. (+50 EXP)');
      }
    }, 1000);

    cancelAnimationFrame(animFrameId);
    gameLoop();
  };

  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (modal.classList.contains('open')) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'Escape') {
        closeBattleModal();
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });

  closeBtn.addEventListener('click', closeBattleModal);
});
