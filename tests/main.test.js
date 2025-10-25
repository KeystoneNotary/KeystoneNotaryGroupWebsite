const main = require('../js/main.js');

const {
    applyTheme,
    initTheme,
    bindThemeControls,
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
} = main;

describe('Theme controls', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <button class="theme-toggle" aria-expanded="false"><span class="theme-icon"></span></button>
            <div class="theme-panel">
                <button class="theme-option" data-theme-option="dark"></button>
                <button class="theme-option" data-theme-option="neutral"></button>
                <button class="theme-option" data-theme-option="light"></button>
            </div>
        `;
        localStorage.clear();
    });

    test('applyTheme updates DOM and localStorage', () => {
        applyTheme('neutral');
        expect(document.documentElement.getAttribute('data-theme')).toBe('neutral');
        expect(localStorage.getItem('theme')).toBe('neutral');
        expect(document.querySelector('.theme-option.active').getAttribute('data-theme-option')).toBe('neutral');
    });

    test('initTheme applies stored preference', () => {
        localStorage.setItem('theme', 'light');
        initTheme();
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
        expect(document.querySelector('.theme-option.active').getAttribute('data-theme-option')).toBe('light');
    });

    test('bindThemeControls toggles panel and applies selection', () => {
        bindThemeControls();
        const toggle = document.querySelector('.theme-toggle');
        const panel = document.querySelector('.theme-panel');

        toggle.click();
        expect(panel.classList.contains('open')).toBe(true);

        panel.querySelector('[data-theme-option="neutral"]').click();
        expect(localStorage.getItem('theme')).toBe('neutral');
        expect(panel.classList.contains('open')).toBe(false);
    });
});

describe('Contact form helpers', () => {
    beforeEach(() => {
        document.body.innerHTML = '<form id="contactForm"></form>';
        localStorage.clear();
    });

    test('validateContactForm accepts valid payload', () => {
        const payload = {
            name: 'Jane Doe',
            email: 'jane@example.com',
            message: 'I need a notary for loan documents.'
        };
        expect(validateContactForm(payload)).toBe(true);
    });

    test('validateContactForm rejects invalid email and injects error message', () => {
        const payload = {
            name: 'Jane Doe',
            email: 'invalid-email',
            message: 'I need assistance.'
        };
        expect(validateContactForm(payload)).toBe(false);
        expect(document.querySelector('.form-message.error')).not.toBeNull();
    });

    test('showError inserts error element', () => {
        const form = document.getElementById('contactForm');
        showError('Test error', form);
        expect(form.querySelector('.form-message.error').textContent).toBe('Test error');
    });

    test('showSuccessMessage inserts success element', () => {
        const form = document.getElementById('contactForm');
        showSuccessMessage(form);
        expect(form.querySelector('.form-message.success').textContent).toContain('Thank you');
    });
});

describe('Booking workflow', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        document.body.innerHTML = `
            <div class="booking-steps"><span class="step"></span><span class="step"></span><span class="step"></span></div>
            <p id="bookingHint"></p>
            <p class="summary-placeholder"></p>
            <dd id="summaryDate">—</dd>
            <dd id="summaryTime">—</dd>
            <div id="bookingTimes"></div>
            <div id="bookingFormWrapper"></div>
            <div id="timeSlots"></div>
            <input type="hidden" id="selectedDate">
            <input type="hidden" id="selectedTime">
            <div id="calendarGrid"></div>
            <h3 id="currentMonth"></h3>
        `;
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    test('renderCalendar populates grid and month label', () => {
        renderCalendar();
        expect(document.getElementById('currentMonth').textContent.length).toBeGreaterThan(0);
        expect(document.getElementById('calendarGrid').children.length).toBeGreaterThan(0);
    });

    test('selectDate highlights day and reveals time slots', () => {
        renderCalendar();
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        document.body.appendChild(dayEl);

        selectDate(new Date(2099, 0, 15), dayEl);
        jest.runAllTimers();

        expect(dayEl.classList.contains('selected')).toBe(true);
        expect(document.querySelectorAll('.booking-steps .step')[1].classList.contains('active')).toBe(true);
        expect(document.getElementById('bookingTimes').classList.contains('visible')).toBe(true);
    });

    test('showTimeSlots populates available slots', () => {
        showTimeSlots();
        expect(document.getElementById('timeSlots').children.length).toBeGreaterThan(0);
    });

    test('selectTime stores hidden inputs and shows form wrapper', () => {
        const slotEl = document.createElement('div');
        slotEl.className = 'time-slot';
        document.getElementById('timeSlots').appendChild(slotEl);
        const fakeDate = new Date(2099, 0, 20);
        selectDate(fakeDate, document.createElement('div'));

        selectTime('10:00 AM', slotEl);
        jest.runAllTimers();

        expect(document.getElementById('selectedTime').value).toBe('10:00 AM');
        expect(document.getElementById('bookingFormWrapper').classList.contains('visible')).toBe(true);
        expect(document.querySelectorAll('.booking-steps .step')[2].classList.contains('active')).toBe(true);
    });

    test('hideForm clears time selection and summary', () => {
        document.getElementById('summaryTime').textContent = '10:00 AM';
        document.getElementById('bookingFormWrapper').classList.add('visible');
        hideForm();
        expect(document.getElementById('summaryTime').textContent).toBe('—');
        expect(document.getElementById('bookingFormWrapper').classList.contains('visible')).toBe(false);
    });

    test('resetCalendar clears selections and restores hint', () => {
        document.getElementById('bookingTimes').classList.add('visible');
        document.getElementById('bookingFormWrapper').classList.add('visible');
        document.getElementById('summaryDate').textContent = 'Jan 10';
        document.getElementById('summaryTime').textContent = '10:00 AM';
        document.querySelector('.summary-placeholder').classList.add('hidden');
        document.querySelectorAll('.booking-steps .step')[1].classList.add('active');

        resetCalendar();

        expect(document.getElementById('bookingTimes').classList.contains('visible')).toBe(false);
        expect(document.getElementById('bookingFormWrapper').classList.contains('visible')).toBe(false);
        expect(document.querySelector('.summary-placeholder').classList.contains('hidden')).toBe(false);
        expect(document.querySelectorAll('.booking-steps .step')[0].classList.contains('active')).toBe(true);
    });
});

describe('Utility helpers', () => {
    test('setActiveBookingStep activates specific index', () => {
        document.body.innerHTML = '<div class="booking-steps"><span class="step"></span><span class="step"></span></div>';
        setActiveBookingStep(1);
        const steps = document.querySelectorAll('.booking-steps .step');
        expect(steps[0].classList.contains('active')).toBe(false);
        expect(steps[1].classList.contains('active')).toBe(true);
    });

    test('updateBookingSummary writes date and time', () => {
        document.body.innerHTML = `
            <p class="summary-placeholder"></p>
            <dd id="summaryDate"></dd>
            <dd id="summaryTime"></dd>
        `;
        updateBookingSummary('Mon Jan 01', '10:30 AM');
        expect(document.getElementById('summaryDate').textContent).toBe('Mon Jan 01');
        expect(document.getElementById('summaryTime').textContent).toBe('10:30 AM');
        expect(document.querySelector('.summary-placeholder').classList.contains('hidden')).toBe(true);
    });

    test('formatSelectedDate returns short string', () => {
        const formatted = formatSelectedDate(new Date(2099, 0, 5));
        expect(formatted).toMatch(/Jan/);
    });
});
