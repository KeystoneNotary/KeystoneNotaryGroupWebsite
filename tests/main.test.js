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

let readyStateGetter;

const setDocumentReadyState = (state) => {
  if (!readyStateGetter) {
    throw new Error('readyStateGetter is not initialized');
  }

  readyStateGetter.mockReturnValue(state);
};

describe('src/main.js bootstrap', () => {
  beforeEach(() => {
    listeners.clear();
    readyStateGetter = vi.spyOn(document, 'readyState', 'get');
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
    listeners.clear();
    vi.resetModules();
    readyStateGetter?.mockRestore();
    readyStateGetter = undefined;
  });

  it('initializes core modules once DOM is ready', async () => {
    vi.resetModules();
    await import('../src/main.js');

    const domContentLoaded = listeners.get('DOMContentLoaded');
    expect(domContentLoaded).toBeTypeOf('function');

    domContentLoaded();

    expect(moduleMocks.initTheme).toHaveBeenCalledTimes(1);
    expect(moduleMocks.initNavigation).toHaveBeenCalledTimes(1);
    expect(moduleMocks.initUI).toHaveBeenCalledTimes(1);
    expect(moduleMocks.initForms).toHaveBeenCalledTimes(1);
    expect(moduleMocks.initCalendar).toHaveBeenCalledTimes(1);
  });

  it('initializes core modules immediately when DOM is already ready', async () => {
    setDocumentReadyState('complete');

    vi.resetModules();
    await import('../src/main.js');

    expect(listeners.has('DOMContentLoaded')).toBe(false);
    expect(moduleMocks.initTheme).toHaveBeenCalledTimes(1);
    expect(moduleMocks.initNavigation).toHaveBeenCalledTimes(1);
    expect(moduleMocks.initUI).toHaveBeenCalledTimes(1);
    expect(moduleMocks.initForms).toHaveBeenCalledTimes(1);
    expect(moduleMocks.initCalendar).toHaveBeenCalledTimes(1);
  });
});
