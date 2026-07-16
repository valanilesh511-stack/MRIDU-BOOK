/**
 * MRIDU BOOK STUDIO – Bootstrap / App Coordinator (Core)
 * Permanent startup coordinator. No business logic.
 * Depends on: EventBus, Storage, State, Constants
 */
window.MRIDU = window.MRIDU || {};
window.MRIDU.Core = window.MRIDU.Core || {};

(function () {
  'use strict';

  const EventBus = MRIDU.Core.EventBus;
  const Storage = MRIDU.Core.Storage;
  const State = MRIDU.Core.State;
  const VERSION = MRIDU.Core.Constants.APP_VERSION;
  const EVENTS = MRIDU.Core.Constants.EVENTS;

  /* ── DOM helpers ── */
  function getElement(id) {
    return document.getElementById(id);
  }

  function showLoading() {
    const el = getElement('loading-root');
    if (el) el.style.display = 'flex';
  }

  function hideLoading() {
    const el = getElement('loading-root');
    if (el) el.style.display = 'none';
  }

  /**
   * Renders a minimal fallback into #app-root if no module has
   * rendered anything by the time the app becomes visible.
   * This prevents a blank white screen when no UI module is
   * loaded yet (e.g. boot.json has an empty "modules" list).
   * Any module that renders real content into #app-root before
   * this runs will simply not be overwritten (we only act when
   * the container is still empty).
   */
  function ensureFallbackContent() {
    const app = getElement('app-root');
    if (!app) return;
    if (app.children.length > 0) return;

    app.style.display = 'flex';
    app.style.flexDirection = 'column';
    app.style.alignItems = 'center';
    app.style.justifyContent = 'center';
    app.style.textAlign = 'center';
    app.style.padding = '24px';
    app.style.gap = '8px';

    const heading = document.createElement('h1');
    heading.style.fontSize = '1.25rem';
    heading.style.fontWeight = '600';
    heading.textContent = 'MRIDU BOOK STUDIO';

    const subtitle = document.createElement('p');
    subtitle.style.opacity = '0.7';
    subtitle.style.fontSize = '0.95rem';
    subtitle.textContent = 'Core is ready. No modules are loaded yet.';

    app.appendChild(heading);
    app.appendChild(subtitle);
  }

  function showApplication() {
    const app = getElement('app-root');
    if (app) app.style.display = 'flex';
    hideLoading();
    ensureFallbackContent();
  }

  function showFatalError(message) {
    showLoading();
    const el = getElement('loading-root');
    if (el) el.textContent = message;
    EventBus.emit(EVENTS.APP_FATAL, { error: message });
  }

  function reportError(...args) {
    if (window.MRIDU?.Core?.Logger) {
      window.MRIDU.Core.Logger.error(...args);
    } else {
      console.error(...args);
    }
  }

  /* ── startup steps ── */
  const BOOT_STEPS = [
    {
      name: 'openStorage',
      run: async () => { await Storage.openDatabase(); }
    },
    {
      name: 'restoreState',
      run: async () => {
        try {
          const saved = await Storage.get('meta', 'appState');
          State.initialize(saved && saved.state ? saved.state : {});
        } catch (e) {
          State.initialize({});
        }
      }
    },
    {
      name: 'showUI',
      run: async () => { showApplication(); }
    }
  ];

  function emitLifecycle(eventName, payload) {
    try {
      EventBus.emit(eventName, payload || {});
    } catch (e) {
      reportError('Lifecycle event error:', eventName, e);
    }
  }

  let appReady = false;

  async function init() {
    try {
      emitLifecycle(EVENTS.APP_BOOTING, { version: VERSION });
      emitLifecycle(EVENTS.APP_INITIALIZING);

      for (const step of BOOT_STEPS) {
        await step.run();
      }

      appReady = true;
      emitLifecycle(EVENTS.APP_READY, { version: VERSION });

      // Lightweight tab-close event (best-effort)
      window.addEventListener('beforeunload', () => {
        try { EventBus.emit('app:beforeunload'); } catch(e) {}
      });

    } catch (fatalError) {
      reportError('Bootstrap init failed:', fatalError);
      showFatalError('Failed to start application. Please reload.');
      emitLifecycle(EVENTS.APP_FATAL, { error: fatalError.message || 'Unknown error' });
    }
  }

  async function shutdown() {
    if (!appReady) return;
    appReady = false;

    // 1. Close storage gracefully
    try { Storage.close(); } catch (e) { /* ignore */ }

    // 2. Emit shutdown event
    emitLifecycle('app:shutdown');

    // 3. Show loading screen
    showLoading();
  }

  // Public App object
  const App = {
    version: VERSION,
    init: init,
    shutdown: shutdown
  };

  // Lock the App namespace
  if (!Object.prototype.hasOwnProperty.call(MRIDU.Core, 'App')) {
    Object.defineProperty(MRIDU.Core, 'App', {
      value: Object.freeze(App),
      writable: false,
      configurable: false,
      enumerable: true
    });
  }

  // Auto-start
  init().catch(err => {
    showFatalError('Critical startup error.');
    console.error(err);
  });
})();