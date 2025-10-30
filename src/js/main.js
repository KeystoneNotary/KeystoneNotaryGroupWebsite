import { initTheme } from './modules/theme.js';
import { initNavigation } from './modules/navigation.js';
import { initUI } from './modules/ui.js';
import { initForms } from './modules/forms.js';
import { initCalendar } from './modules/calendar.js';

function main() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initTheme();
            initNavigation();
            initUI();
            initForms();
            initCalendar();
        });
    } else {
        initTheme();
        initNavigation();
        initUI();
        initForms();
        initCalendar();
    }
}

main();