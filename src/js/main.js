/**
 * Keystone Notary Group LLC - Main JavaScript
 * Handles theme switching, forms, and booking system
 */

// Configuration constants
const SCROLL_THRESHOLD = 500;
const NAV_OFFSET = 80;
const LOADER_DELAY = 1000;
const ERROR_DURATION = 3000;
const SUCCESS_DURATION = 5000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const themeConfig = [
    { id: 'dark', icon: '🌙' },
    { id: 'neutral', icon: '🌗' },
    { id: 'light', icon: '☀️' }
];

/**
 * Apply theme to document and update UI
 * @param {string} theme - Theme ID ('dark', 'neutral', or 'light')
 */
function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }

    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        const config = themeConfig.find(option => option.id === theme);
        themeIcon.textContent = config ? config.icon : '🌙';
    }

    document.querySelectorAll('.theme-option').forEach(option => {
        const optionTheme = option.getAttribute('data-theme-option');
        option.classList.toggle('active', optionTheme === theme);
    });

    localStorage.setItem('theme', theme);
}

/**
 * Initialize theme from localStorage or default
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
}

function toggleThemePanel() {
    const panel = document.querySelector('.theme-panel');
    const toggle = document.querySelector('.theme-toggle');
    if (!panel || !toggle) return;

    const isOpen = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
}

function closeThemePanel() {
    const panel = document.querySelector('.theme-panel');
    const toggle = document.querySelector('.theme-toggle');
    if (!panel || !toggle) return;
    panel.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
}

function bindThemeControls() {
    const toggle = document.querySelector('.theme-toggle');
    const panel = document.querySelector('.theme-panel');
    if (!toggle || !panel) return;

    toggle.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleThemePanel();
    });

    panel.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme-option');
            applyTheme(theme);
            closeThemePanel();
        });
    });

    document.addEventListener('click', (event) => {
        if (!panel.contains(event.target) && !toggle.contains(event.target)) {
            closeThemePanel();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeThemePanel();
        }
    });
}

// Initialize theme after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        bindThemeControls();
    });
} else {
    initTheme();
    bindThemeControls();
}

// Mobile viewport height fix
function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVH();
window.addEventListener('resize', setVH);

// Loader
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, LOADER_DELAY);
    }
});

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinkElements = navLinks ? navLinks.querySelectorAll('a') : [];

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

navLinkElements.forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger && navLinks) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
});

// Section observer for active navigation
const sectionObserver = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const sectionId = entry.target.getAttribute('id');
            navLinkElements.forEach(link => {
                link.classList.toggle('is-active', link.getAttribute('data-nav') === sectionId);
            });
        });
    }, {
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0.1
    })
    : null;

if (sectionObserver) {
    document.querySelectorAll('section[id]').forEach(section => {
        sectionObserver.observe(section);
    });
}

// Scroll progress and back-to-top
const scrollProgress = document.querySelector('.scroll-progress');
const backToTop = document.querySelector('.back-to-top');

if (scrollProgress && backToTop) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
        scrollProgress.style.transform = `scaleX(${scrollPercent})`;

        if (scrollTop > SCROLL_THRESHOLD) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}





// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;

        window.scrollTo({ top: Math.max(target.offsetTop - NAV_OFFSET, 0), behavior: 'smooth' });
    });
});









// Form validation and submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        if (validateContactForm(data, contactForm)) {
            console.log('Form submitted:', data);
            showSuccessMessage();
            contactForm.reset();
        }
    });
}

/**
 * Validate contact form data
 * @param {Object} data - Form data object
 * @param {HTMLElement} formElement - Form element for error display
 * @returns {boolean} - Validation result
 */
function validateContactForm(data, formElement = document.getElementById('contactForm')) {
    if (!data.name || data.name.trim().length < 2) {
        showError('Please enter a valid name', formElement);
        return false;
    }

    if (!EMAIL_REGEX.test(data.email)) {
        showError('Please enter a valid email address', formElement);
        return false;
    }

    if (!data.message || data.message.trim().length < 10) {
        showError('Please enter a message (minimum 10 characters)', formElement);
        return false;
    }

    return true;
}

function showError(message, formElement = contactForm) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-message error';
    errorDiv.textContent = message;
    errorDiv.setAttribute('role', 'alert');
    
    const messagesContainer = formElement ? formElement.querySelector('[aria-live]') : null;
    const targetContainer = messagesContainer || formElement;
    
    if (targetContainer) {
        if (messagesContainer) {
            messagesContainer.appendChild(errorDiv);
        } else {
            targetContainer.insertBefore(errorDiv, targetContainer.firstChild);
        }
        setTimeout(() => errorDiv.remove(), ERROR_DURATION);
    }
}

function showSuccessMessage(formElement = contactForm) {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-message success';
    successDiv.textContent = 'Thank you! Your message has been sent. We will contact you shortly.';
    successDiv.setAttribute('role', 'status');
    
    const messagesContainer = formElement ? formElement.querySelector('[aria-live]') : null;
    const targetContainer = messagesContainer || formElement;
    
    if (targetContainer) {
        if (messagesContainer) {
            messagesContainer.appendChild(successDiv);
        } else {
            targetContainer.insertBefore(successDiv, targetContainer.firstChild);
        }
        setTimeout(() => successDiv.remove(), SUCCESS_DURATION);
    }
}

// Booking Calendar
let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;

// Calendar configuration
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const availableSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
function setActiveBookingStep(index) {
    document.querySelectorAll('.booking-steps .step').forEach((step, stepIndex) => {
        step.classList.toggle('active', stepIndex === index);
    });
}

function updateBookingSummary(dateText, timeText) {
    const summaryDateEl = document.getElementById('summaryDate');
    const summaryTimeEl = document.getElementById('summaryTime');
    const summaryPlaceholder = document.querySelector('.summary-placeholder');

    if (summaryDateEl) {
        summaryDateEl.textContent = dateText || '—';
    }
    if (summaryTimeEl) {
        summaryTimeEl.textContent = timeText || '—';
    }

    if (summaryPlaceholder) {
        const hasSelection = Boolean(dateText || timeText);
        summaryPlaceholder.classList.toggle('hidden', hasSelection);
    }
}

function formatSelectedDate(date) {
    if (!date) return '';
    return date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
}

function resetCalendar() {
    const bookingTimes = document.getElementById('bookingTimes');
    const bookingFormWrapper = document.getElementById('bookingFormWrapper');
    const bookingHint = document.getElementById('bookingHint');

    if (bookingTimes) {
        bookingTimes.classList.remove('visible');
    }
    if (bookingFormWrapper) {
        bookingFormWrapper.classList.remove('visible');
    }

    document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
    selectedDate = null;
    selectedTime = null;
    setActiveBookingStep(0);
    updateBookingSummary('', '');
    if (bookingHint) {
        bookingHint.textContent = 'Select an available date to reveal appointment slots.';
    }
}

function hideForm() {
    const bookingFormWrapper = document.getElementById('bookingFormWrapper');
    const bookingHint = document.getElementById('bookingHint');

    if (bookingFormWrapper) {
        bookingFormWrapper.classList.remove('visible');
    }

    document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
    selectedTime = null;
    updateBookingSummary(formatSelectedDate(selectedDate), '');
    setActiveBookingStep(selectedDate ? 1 : 0);
    if (bookingHint) {
        bookingHint.textContent = selectedDate ? 'Choose an available time slot to continue.' : 'Select an available date to reveal appointment slots.';
    }
}

function selectTime(time, element) {
    selectedTime = time;

    document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    const selectedDateInput = document.getElementById('selectedDate');
    const selectedTimeInput = document.getElementById('selectedTime');
    const bookingFormWrapper = document.getElementById('bookingFormWrapper');
    const bookingHint = document.getElementById('bookingHint');

    if (selectedDateInput) {
        selectedDateInput.value = selectedDate ? selectedDate.toLocaleDateString() : '';
    }
    if (selectedTimeInput) {
        selectedTimeInput.value = selectedTime || '';
    }

    updateBookingSummary(formatSelectedDate(selectedDate), selectedTime);
    setActiveBookingStep(2);
    if (bookingHint) {
        bookingHint.textContent = 'Complete the form to confirm your appointment.';
    }

    if (bookingFormWrapper) {
        setTimeout(() => {
            bookingFormWrapper.classList.add('visible');
        }, 100);
    }
}

function showTimeSlots() {
    const slotsContainer = document.getElementById('timeSlots');

    if (!slotsContainer) return;

    slotsContainer.innerHTML = '';

    availableSlots.forEach(slot => {
        const slotEl = document.createElement('div');
        slotEl.className = 'time-slot';
        slotEl.textContent = slot;
        slotEl.addEventListener('click', () => selectTime(slot, slotEl));
        slotsContainer.appendChild(slotEl);
    });
}

function selectDate(date, element) {
    selectedDate = date;

    const bookingHint = document.getElementById('bookingHint');
    const bookingTimes = document.getElementById('bookingTimes');

    if (!element) return;

    document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');

    updateBookingSummary(formatSelectedDate(selectedDate), '');
    setActiveBookingStep(1);
    if (bookingHint) {
        bookingHint.textContent = 'Choose an available time slot to continue.';
    }

    showTimeSlots();

    if (bookingTimes) {
        setTimeout(() => {
            bookingTimes.classList.add('visible');
        }, 100);
    }
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthLabel = document.getElementById('currentMonth');

    if (!grid || !monthLabel) return;

    monthLabel.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    grid.innerHTML = '';
    
    dayNames.forEach(day => {
        const label = document.createElement('div');
        label.className = 'calendar-day day-label';
        label.textContent = day;
        grid.appendChild(label);
    });
    
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'calendar-day disabled';
        grid.appendChild(empty);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = day;
        
        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        dayDate.setHours(0, 0, 0, 0);
        
        if (dayDate < today || dayDate.getDay() === 0) {
            dayEl.classList.add('disabled');
        } else {
            dayEl.addEventListener('click', () => selectDate(dayDate, dayEl));
        }
        
        grid.appendChild(dayEl);
    }
}

const prevMonthButton = document.getElementById('prevMonth');
if (prevMonthButton) {
    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
}

const nextMonthButton = document.getElementById('nextMonth');
if (nextMonthButton) {
    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
}

const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const bookingData = Object.fromEntries(formData);

        console.log('Booking submitted:', bookingData);

        alert(`Appointment requested for ${bookingData.date} at ${bookingData.time}. We'll confirm via email shortly.`);

        e.target.reset();
        resetCalendar();
    });
}

const cancelButton = document.getElementById('cancelSelection');
if (cancelButton) {
    cancelButton.addEventListener('click', resetCalendar);
}

document.addEventListener('click', (e) => {
    const calendar = document.querySelector('.booking-calendar');
    const times = document.getElementById('bookingTimes');
    const formWrapper = document.getElementById('bookingFormWrapper');

    if (!calendar || !times || !formWrapper) {
        return;
    }

    if (!calendar.contains(e.target) && !times.contains(e.target) && !formWrapper.contains(e.target)) {
        if (formWrapper.classList.contains('visible')) {
            hideForm();
        }
    }
});

renderCalendar();

// FAQ Accordion
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const trigger = item.querySelector('.faq-question');
        if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
        }
    });

    if (!isActive) {
        faqItem.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
    } else {
        button.setAttribute('aria-expanded', 'false');
    }
}

document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => toggleFAQ(button));
});
export {
    applyTheme,
    initTheme,
    bindThemeControls,
    toggleThemePanel,
    closeThemePanel,
    validateContactForm,
    showError,
    showSuccessMessage,
    setActiveBookingStep,
    updateBookingSummary,
    formatSelectedDate,
    resetCalendar,
    hideForm,
    selectTime,
    showTimeSlots,
    selectDate,
    renderCalendar
};
