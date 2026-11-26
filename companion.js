// Espíritu Compañero del HUD + Inventario de Artefactos (companion.js)
document.addEventListener('DOMContentLoaded', () => {
  const companion = document.getElementById('abyssCompanion');
  const bubble = document.getElementById('companionBubble');
  let bubbleTimer = null;

  const idleQuotes = [
    '* Todos los servicios operando al 100%.',
    '* ¿Ya probaste escribir "battle" en el CLI?',
    '* Un buen café evita reinicios en viernes.',
    '* El Abismo observa tus commits...',
    '* Tip: Puedes cambiar el color del Alma con "soul cyan".',
    '* Sincronizando nodos y personas...'
  ];

  // Función global para que otros módulos hagan hablar al compañero
  window.companionSay = function(text, durationMs = 3600) {
    if (!bubble || !companion) return;
    bubble.textContent = text;
    bubble.classList.add('visible');
    companion.classList.add('hopping');

    setTimeout(() => companion.classList.remove('hopping'), 400);

    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => {
      bubble.classList.remove('visible');
    }, durationMs);
  };

  if (companion) {
    companion.addEventListener('click', () => {
      if (typeof playCursorSound === 'function') playCursorSound();
      const quote = idleQuotes[Math.floor(Math.random() * idleQuotes.length)];
      window.companionSay(quote);
    });
  }

  // --- INVENTARIO EQUIPABLE EN LA PESTAÑA GESTIÓN ---
  const itemButtons = document.querySelectorAll('.inv-item');
  const itemTitle = document.getElementById('invItemTitle');
  const itemStat = document.getElementById('invItemStat');
  const itemDesc = document.getElementById('invItemDesc');

  const inventoryData = {
    coffee: {
      title: 'Taza de Café Negro (Guardia 03:00 AM)',
      stat: '[ +25 VELOCIDAD DE DIAGNÓSTICO // -10 SUEÑO ]',
      desc: 'Artefacto legendario indispensable durante ventanas de mantenimiento y migraciones críticas.'
    },
    ssh: {
      title: 'Llave Maestra SSH (RSA-4096)',
      stat: '[ +40 ACCESO SEGURO // INMUNIDAD A CONTRASEÑAS ]',
      desc: 'Permite abrir túneles cifrados hacia cualquier servidor remoto sin dejar rastros en texto plano.'
    },
    sla: {
      title: 'Grimorio de Acuerdos SLA & Procesos',
      stat: '[ +35 ARMONÍA DE EQUIPO // +20 CLARIDAD ]',
      desc: 'Transforma solicitudes caóticas en flujos ordenados donde cada especialista sabe su misión.'
    },
    script: {
      title: 'Script de Automatización Silenciosa',
      stat: '[ +50 EFICIENCIA // AHORRA 4 HORAS DIARIAS ]',
      desc: 'Pequeño fragmento de código que ejecuta tareas repetitivas mientras tú te enfocas en la estrategia.'
    }
  };

  itemButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.item;
      const data = inventoryData[key];
      if (!data) return;

      itemButtons.forEach(b => b.classList.remove('equipped'));
      btn.classList.add('equipped');

      itemTitle.textContent = data.title;
      itemStat.textContent = data.stat;
      itemDesc.textContent = data.desc;

      if (typeof playSelectSound === 'function') playSelectSound();
      window.companionSay(`* Equipado: ${btn.textContent.trim()}`);
    });
  });
});