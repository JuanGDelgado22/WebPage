// Consola Desplegable estilo Quake / SysAdmin CLI con Usuario Dinámico (terminal.js)
document.addEventListener('DOMContentLoaded', () => {
  const drawer = document.getElementById('cliDrawer');
  const toggleBtn = document.getElementById('cliToggle');
  const closeBtn = document.getElementById('cliClose');
  const output = document.getElementById('cliOutput');
  const input = document.getElementById('cliInput');
  const promptLabel = document.getElementById('cliPrompt');

  let commandHistory = [];
  let historyIndex = -1;

  // Recuperar usuario guardado o iniciar en modo selección
  let currentUser = localStorage.getItem('sys_os_visitor') || null;
  let awaitingUsername = !currentUser;

  function sanitizeUsername(raw) {
    const clean = raw.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    return clean.slice(0, 16) || 'guest';
  }

  function updatePromptUI() {
    if (awaitingUsername) {
      promptLabel.textContent = 'identidad>';
      input.placeholder = 'Escribe tu alias (o presiona Enter para "guest")...';
    } else {
      promptLabel.textContent = `${currentUser}@juan:~$`;
      input.placeholder = "Escribe 'help' y presiona Enter...";
    }
  }

  // Sonido sutil de tecla mecánica
  function playKeyTick() {
    if (typeof sfxEnabled !== 'undefined' && !sfxEnabled) return;
    if (typeof initAudio === 'function') initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(820 + Math.random() * 140, now);

    gain.gain.setValueAtTime(0.015, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  function printLine(text, type = 'normal') {
    const line = document.createElement('div');
    line.className = `cli-line cli-${type}`;
    line.innerHTML = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  }

  function toggleTerminal(forceState) {
    const isOpen = drawer.classList.contains('open');
    const nextState = typeof forceState === 'boolean' ? forceState : !isOpen;

    drawer.classList.toggle('open', nextState);
    toggleBtn.classList.toggle('active', nextState);

    if (typeof playSelectSound === 'function') playSelectSound();

    if (nextState) {
      setTimeout(() => input.focus(), 120);
    } else {
      input.blur();
    }
  }

  // Cambiar color del Alma en toda la interfaz
  function setSoulTheme(colorName) {
    const root = document.documentElement;
    const themes = {
      yellow: { hex: '#ffd800', glow: 'rgba(255, 216, 0, 0.30)', label: 'JUSTICIA (Amarillo)' },
      cyan:   { hex: '#38bdf8', glow: 'rgba(56, 189, 248, 0.30)', label: 'PACIENCIA (Cian)' },
      purple: { hex: '#c084fc', glow: 'rgba(192, 132, 252, 0.30)', label: 'PERSEVERANCIA (Púrpura)' },
      red:    { hex: '#f43f5e', glow: 'rgba(244, 63, 94, 0.30)', label: 'DETERMINACIÓN (Rojo)' },
      white:  { hex: '#f8fafc', glow: 'rgba(248, 250, 252, 0.25)', label: 'VASO / ALMA PURA (Blanco)' }
    };

    const chosen = themes[colorName];
    if (!chosen) return false;

    root.style.setProperty('--soul-yellow', chosen.hex);
    root.style.setProperty('--soul-glow', chosen.glow);

    const svgCore = document.querySelector('.pixel-emblem path:nth-child(2)');
    if (svgCore) svgCore.setAttribute('fill', chosen.hex);

    printLine(`* Resonancia cambiada a: <span class="hl">${chosen.label}</span>`, 'accent');
    return true;
  }

  // Procesador de comandos
  function executeCommand(rawCmd) {
    // Paso inicial: asignar nombre de usuario del visitante
    if (awaitingUsername) {
      const chosenUser = sanitizeUsername(rawCmd);
      currentUser = chosenUser;
      localStorage.setItem('sys_os_visitor', chosenUser);
      awaitingUsername = false;
      updatePromptUI();

      if (typeof playSelectSound === 'function') playSelectSound();
      printLine(`* Sesión iniciada como <span class="hl">${currentUser}@juan</span>.`, 'accent');
      printLine('* Escribe <span class="hl">help</span> para listar comandos o <span class="hl">user [nombre]</span> si deseas cambiar tu alias.');
      return;
    }

    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    commandHistory.unshift(trimmed);
    historyIndex = -1;

    printLine(`<span class="cli-prompt-echo">${currentUser}@juan:~$</span> ${escapeHtml(trimmed)}`, 'cmd');

    const parts = trimmed.toLowerCase().split(/\s+/);
    const cmd = parts[0];
    const arg = parts[1];

    switch (cmd) {
      case 'help':
      case '?':
        printLine('Comandos disponibles en <span class="hl">SYS_OS v1.1</span>:', 'accent');
        printLine('  <span class="hl">user [nombre]</span>   - Cambiar tu alias de visitante en la sesión');
        printLine('  <span class="hl">whoami</span>          - Perfil del anfitrión y estado de tu sesión');
        printLine('  <span class="hl">ls</span>              - Listar módulos y registros del sistema');
        printLine('  <span class="hl">cat [archivo]</span>   - Leer detalle (ej. cat slot01)');
        printLine('  <span class="hl">goto [vista]</span>    - Navegar a: perfil | gestion | archivos | senal');
        printLine('  <span class="hl">soul [color]</span>    - Cambiar color: yellow | cyan | purple | red | white');
        printLine('  <span class="hl">bgm [on|off]</span>    - Controlar música ambiental en Re Dórico');
        printLine('  <span class="hl">sfx [on|off]</span>    - Controlar efectos de sonido');
        printLine('  <span class="hl">check</span>           - Inspeccionar estadísticas del operador');
        printLine('  <span class="hl">clear</span>           - Limpiar la pantalla de la terminal');
        break;

      case 'user':
      case 'su':
      case 'name':
        if (!arg) {
          printLine('Uso: user [nuevo_alias] (ej. user neo)', 'error');
        } else {
          const newAlias = sanitizeUsername(arg);
          currentUser = newAlias;
          localStorage.setItem('sys_os_visitor', newAlias);
          updatePromptUI();
          printLine(`* Identidad actualizada a: <span class="hl">${currentUser}@juan</span>`, 'accent');
          if (typeof playSelectSound === 'function') playSelectSound();
        }
        break;

      case 'whoami':
        printLine(`Conectado como: <span class="hl">${currentUser}</span> (Visitante del Abismo)`);
        printLine('Anfitrión del nodo: <span class="hl">Juan García</span> — Administrador de Sistemas & Estratega de Recursos.');
        break;

      case 'ls':
        printLine('drwxr-xr-x  perfil.sys');
        printLine('drwxr-xr-x  gestion_arquitectura.mod');
        printLine('-rw-r--r--  <span class="hl">slot01.dat</span>  [VACÍO]');
        printLine('-rw-r--r--  <span class="hl">slot02.dat</span>  [VACÍO]');
        printLine('-rw-r--r--  <span class="hl">slot03.dat</span>  [VACÍO]');
        printLine('-rwxr-xr-x  audio_dorian_synth.bin');
        break;

      case 'cat':
        if (!arg) {
          printLine('Uso: cat [archivo] (ejemplo: cat slot01.dat)', 'error');
        } else if (arg.includes('slot01') || arg.includes('slot02') || arg.includes('slot03')) {
          printLine(`[${arg.toUpperCase()}]: Ranura de memoria íntegra. Esperando despliegue de documentación de proyecto.`);
          if (typeof playEmptySlotSound === 'function') playEmptySlotSound();
        } else if (arg.includes('perfil')) {
          executeCommand('whoami');
        } else {
          printLine(`cat: ${escapeHtml(arg)}: No existe el archivo o directorio`, 'error');
          if (typeof playEmptySlotSound === 'function') playEmptySlotSound();
        }
        break;

      case 'goto':
      case 'cd': {
        const routes = { 'perfil': 0, 'gestion': 1, 'archivos': 2, 'proyectos': 2, 'senal': 3, 'contacto': 3 };
        if (arg in routes && typeof activateScreen === 'function') {
          activateScreen(routes[arg], true);
          printLine(`* Módulo [ ${arg.toUpperCase()} ] cargado en pantalla principal.`, 'accent');
        } else {
          printLine('Destino inválido. Opciones: perfil, gestion, archivos, senal', 'error');
        }
        break;
      }

      case 'soul':
      case 'theme':
        if (!arg || !setSoulTheme(arg)) {
          printLine('Colores disponibles: yellow, cyan, purple, red, white', 'error');
        } else if (typeof playSelectSound === 'function') {
          playSelectSound();
        }
        break;

      case 'bgm':
        if (arg === 'on') {
          if (!bgmPlaying) document.getElementById('bgmToggle').click();
          printLine('* Sintetizador Re Dórico: ACTIVADO.', 'accent');
        } else if (arg === 'off') {
          if (bgmPlaying) document.getElementById('bgmToggle').click();
          printLine('* Sintetizador Re Dórico: SILENCIADO.');
        } else {
          printLine('Uso: bgm on | bgm off', 'error');
        }
        break;

      case 'sfx':
        if (arg === 'on') {
          if (!sfxEnabled) document.getElementById('sfxToggle').click();
          printLine('* Efectos de interfaz: ACTIVADOS.', 'accent');
        } else if (arg === 'off') {
          if (sfxEnabled) document.getElementById('sfxToggle').click();
          printLine('* Efectos de interfaz: SILENCIADOS.');
        } else {
          printLine('Uso: sfx on | sfx off', 'error');
        }
        break;

      case 'check':
        printLine('* JUAN GARCÍA — LV 99 SYSADMIN', 'accent');
        printLine('* ATK 85  DEF 95  — "Orquesta sistemas complejos y equipos con precisión."');
        break;

      case 'abyss':
      case 'hollow':
        printLine('* Sin costo demasiado alto. Sin mente para pensar... excepto cuando toca depurar en producción.', 'accent');
        break;

      case 'sudo':
        printLine(`Permiso denegado para '${currentUser}': este incidente será reportado al Abismo.`, 'error');
        if (typeof playEmptySlotSound === 'function') playEmptySlotSound();
        break;

      case 'clear':
      case 'cls':
        output.innerHTML = '';
        break;

      case 'exit':
      case 'quit':
        toggleTerminal(false);
        break;

      default:
        printLine(`Comando no reconocido: '${escapeHtml(cmd)}'. Escribe <span class="hl">help</span> para ver opciones.`, 'error');
        if (typeof playEmptySlotSound === 'function') playEmptySlotSound();
    }
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
  }

  toggleBtn.addEventListener('click', () => toggleTerminal());
  closeBtn.addEventListener('click', () => toggleTerminal(false));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(input.value);
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!awaitingUsername && historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!awaitingUsername) {
        if (historyIndex > 0) {
          historyIndex--;
          input.value = commandHistory[historyIndex];
        } else {
          historyIndex = -1;
          input.value = '';
        }
      }
    } else if (e.key === 'Escape') {
      toggleTerminal(false);
    } else if (e.key.length === 1) {
      playKeyTick();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Backquote') {
      e.preventDefault();
      toggleTerminal();
    } else if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleTerminal(false);
    }
  });

  // Inicialización de bienvenida según si es visitante nuevo o recurrente
  updatePromptUI();
  printLine('* SYS_OS Terminal v1.1 conectada al Abismo.', 'accent');
  if (awaitingUsername) {
    printLine('* <span class="hl">Nombra tu presencia:</span> escribe un alias para esta sesión (o presiona Enter para continuar como <span class="hl">guest</span>).');
  } else {
    printLine(`* Bienvenido de nuevo, <span class="hl">${currentUser}</span>. Escribe <span class="hl">help</span> para ver comandos.`);
  }
});