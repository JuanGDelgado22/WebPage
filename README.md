# * JUAN.GARCIA // SYS_OS

> *"El silencio del Abismo también es código."*

Portafolio web interactivo y laboratorio personal de **Juan García**, Administrador de Sistemas especializado en gestión estratégica de recursos tecnológicos y coordinación de equipos multidisciplinarios.

Diseñado sin frameworks ni dependencias pesadas: **HTML5, CSS3 y Vanilla JavaScript puro**, inspirado en la estética minimalista retro de *Undertale* y la atmósfera abisal de *Hollow Knight*.

🌐 **En vivo:** [https://juanra-gardel.juanra-gardel.workers.dev](https://juanra-gardel.juanra-gardel.workers.dev)

---

## ✨ Características Principales

* **Navegación estilo RPG:** Interfaz dinámica por módulos (`PERFIL`, `GESTIÓN`, `ARCHIVOS`, `SEÑAL`) navegable con cursor de ratón o flechas del teclado (`←` / `→`).
* **Consola Desplegable estilo Quake (`>_ CLI`):** Terminal interactiva integrada invocable desde cualquier vista mediante la tecla `` ` `` (Backquote) o el botón superior, y cerrable con `ESC`.
* **Sintetizador Polifónico 8-Bit (Web Audio API):** Motor de sonido nativo de 3 canales (bajo senoidal, arpegio triangular y melodía cuadrada filtrada) compuesto en **Re Dórico** para equilibrar melancolía y luminosidad, más efectos de sonido (SFX) independientes.
* **Temas de Resonancia Dinámicos:** Cambio en tiempo real de la paleta del "Alma" (Justicia, Paciencia, Perseverancia, Determinación, Vaso Puro) mediante variables CSS.

---

## 🗂️ Arquitectura del Proyecto

```text
WebPage/
├── index.html      # Estructura semántica, HUD, menú RPG y vistas modulares
├── style.css       # Estética abisal, bordes etéreos, animaciones y consola CLI
├── audio.js        # Motor SFX y sintetizador polifónico de 3 canales en Re Dórico
├── terminal.js     # Intérprete de comandos CLI, historial y cambio de temas
└── README.md       # Documentación del repositorio