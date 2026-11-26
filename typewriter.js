// Motor de Máquina de Escribir estilo RPG con Voz Sintetizada (typewriter.js)
document.addEventListener('DOMContentLoaded', () => {
  // Seleccionamos los textos narrativos principales de cada pantalla
  const targets = document.querySelectorAll('.hero-bio, .contact-terminal p, .pillar-box p, .save-slot p');

  // Guardamos el HTML original de cada elemento para no perder etiquetas <strong>
  targets.forEach(el => {
    el.dataset.originalHtml = el.innerHTML.trim();
  });

  let activeTimers = [];

  function clearTypewriters() {
    activeTimers.forEach(id => clearInterval(id));
    activeTimers = [];
  }

  // Función que anima un bloque de texto respetando etiquetas HTML internas
  function typeElement(el, speedMs = 18, withVoice = true) {
    const fullHtml = el.dataset.originalHtml;
    if (!fullHtml) return;

    // Dividir el HTML en tokens: etiquetas (<...>) o caracteres individuales
    const tokens = fullHtml.match(/(<[^>]+>|[^<])/g) || [];
    el.innerHTML = '';
    el.classList.add('typing-active');

    let index = 0;
    let charCounter = 0;

    // Permitir saltar la animación haciendo clic en el texto
    const finishInstant = () => {
      clearInterval(timer);
      el.innerHTML = fullHtml;
      el.classList.remove('typing-active');
      el.removeEventListener('click', finishInstant);
    };
    el.addEventListener('click', finishInstant);

    const timer = setInterval(() => {
      if (index >= tokens.length) {
        finishInstant();
        return;
      }

      // Si el token es una etiqueta HTML (ej. <strong>), insertarla de golpe sin pausa
      while (index < tokens.length && tokens[index].startsWith('<')) {
        el.innerHTML += tokens[index];
        index++;
      }

      if (index < tokens.length) {
        const char = tokens[index];
        el.innerHTML += char;
        index++;

        // Reproducir blip cada 3 caracteres visibles (no en espacios) para que suene fluido
        if (withVoice && char.trim() !== '') {
          charCounter++;
          if (charCounter % 3 === 0 && typeof playVoiceBlip === 'function') {
            playVoiceBlip();
          }
        }
      }
    }, speedMs);

    activeTimers.push(timer);
  }

  // Dispara el efecto en todos los textos visibles de la pantalla activa
  window.triggerScreenTypewriter = function(panelElement) {
    clearTypewriters();
    if (!panelElement) return;

    const panelTargets = panelElement.querySelectorAll('[data-original-html]');
    panelTargets.forEach((el, idx) => {
      // Si hay varios párrafos (ej. tarjetas), solo el primero emite voz para evitar saturación
      const emitVoice = idx === 0;
      const speed = panelTargets.length > 1 ? 12 : 20;
      typeElement(el, speed, emitVoice);
    });
  };

  // Arrancar en la pantalla inicial al cargar
  const initialPanel = document.querySelector('.screen-panel.active');
  if (initialPanel) {
    window.triggerScreenTypewriter(initialPanel);
  }
});