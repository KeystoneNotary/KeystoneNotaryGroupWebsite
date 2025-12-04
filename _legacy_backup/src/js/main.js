import '../styles/main.css';
import { initTheme } from './modules/theme.js';
import { initNavigation } from './modules/navigation.js';
import { initUI } from './modules/ui.js';
import { initForms } from './modules/forms.js';
import { initCalendar } from './modules/calendar.js';

function main() {
    const initializeApp = () => {
        initTheme();
        initNavigation();
        initUI();
        initForms();
        initCalendar();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
}

main();
