import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const moduleMocks = vi.hoisted(() => ({
  initTheme: vi.fn(),
  initNavigation: vi.fn(),
  initUI: vi.fn(),
  initForms: vi.fn(),
  initCalendar: vi.fn(),
}));

vi.mock('../src/styles/main.css', () => ({}), { virtual: true });
vi.mock('../src/styles/ai-chat.css', () => ({}), { virtual: true });
vi.mock('../src/js/modules/theme.js', () => ({ initTheme: moduleMocks.initTheme }));
vi.mock('../src/js/modules/navigation.js', () => ({ initNavigation: moduleMocks.initNavigation }));
vi.mock('../src/js/modules/ui.js', () => ({ initUI: moduleMocks.initUI }));
vi.mock('../src/js/modules/forms.js', () => ({ initForms: moduleMocks.initForms }));
vi.mock('../src/js/modules/calendar.js', () => ({ initCalendar: moduleMocks.initCalendar }));
vi.mock('../src/js/ai-chat.js', () => ({}));

const listeners = new Map();

const setDocumentReadyState = (state) => {
  Object.defineProperty(document, 'readyState', {
    configurable: true,
    get: () => state,
  });
};

describe('src/main.js bootstrap', () => {
  beforeEach(() => {
    listeners.clear();
    vi.resetModules();
    vi.clearAllMocks();

    setDocumentReadyState('loading');

    vi.spyOn(document, 'addEventListener').mockImplementation((event, callback) => {
      listeners.set(event, callback);
    });

    vi.spyOn(document, 'removeEventListener').mockImplementation((event, callback) => {
      const stored = listeners.get(event);
      if (stored === callback) {
        listeners.delete(event);
      }
    });
  });

  afterEach(() => {
    listeners.forEach((callback, event) => {
      if (typeof callback === 'function') {
        document.removeEventListener(event, callback);
      }
    });
    listeners.clear();

    delete document.readyState;

    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('initializes core modules once DOM is ready', async () => {
    await import('../src/main.js');

    const domContentLoaded = listeners.get('DOMContentLoaded');
    expect(domContentLoaded).toBeTypeOf('function');

    domContentLoaded();

    expect(moduleMocks.initTheme).toHaveBeenCalledTimes(1);
    expect(moduleMocks.initNavigation).toHaveBeenCalledTimes(1);
    expect(moduleMocks.initUI).toHaveBeenCalledTimes(1);
    expect(moduleMocks.initForms).toHaveBeenCalledTimes(1);

    document.removeEventListener('DOMContentLoaded', domContentLoaded);
    setDocumentReadyState('complete');
  });
});
