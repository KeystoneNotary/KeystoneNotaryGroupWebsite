
import { describe, test, beforeEach, afterEach, expect, vi } from 'vitest';
import {
    renderCalendar,
    selectDate,
    showTimeSlots,
    selectTime,
    hideForm,
    resetCalendar,
    setActiveBookingStep,
    updateBookingSummary,
    formatSelectedDate
} from '../../src/js/modules/calendar.js';

// Mock constants used by the calendar module
vi.mock('../../src/js/constants.js', () => ({
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    dayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    availableSlots: ['9:00 AM', '10:00 AM']
}));

describe('Booking workflow', () => {
    beforeEach(() => {
        vi.useFakeTimers();
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
        vi.runOnlyPendingTimers();
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    test('renderCalendar populates grid and month label', () => {
        renderCalendar();
        expect(document.getElementById('currentMonth').textContent.length).toBeGreaterThan(0);
        expect(document.getElementById('calendarGrid').children.length).toBeGreaterThan(0);
    });

    test('selectDate highlights day and reveals time slots', () => {
        renderCalendar();
        const dayEl = document.createElement('button');
        dayEl.type = 'button';
        dayEl.className = 'calendar-day';
        document.body.appendChild(dayEl);

        selectDate(new Date(2099, 0, 15), dayEl);
        vi.runAllTimers();

        expect(dayEl.classList.contains('selected')).toBe(true);
        expect(dayEl.getAttribute('aria-pressed')).toBe('true');
        expect(document.querySelectorAll('.booking-steps .step')[1].classList.contains('active')).toBe(true);
        expect(document.getElementById('bookingTimes').classList.contains('visible')).toBe(true);
    });

    test('showTimeSlots populates available slots', () => {
        showTimeSlots();
        const slots = document.getElementById('timeSlots').children;
        expect(slots.length).toBeGreaterThan(0);
        expect(slots[0].tagName).toBe('BUTTON');
    });

    test('selectTime stores hidden inputs and shows form wrapper', () => {
        const slotEl = document.createElement('button');
        slotEl.type = 'button';
        slotEl.className = 'time-slot';
        document.getElementById('timeSlots').appendChild(slotEl);
        const fakeDate = new Date(2099, 0, 20);
        const fakeDay = document.createElement('button');
        fakeDay.className = 'calendar-day';
        document.body.appendChild(fakeDay);
        selectDate(fakeDate, fakeDay);

        selectTime('10:00 AM', slotEl);
        vi.runAllTimers();

        expect(document.getElementById('selectedTime').value).toBe('10:00 AM');
        expect(document.getElementById('bookingFormWrapper').classList.contains('visible')).toBe(true);
        expect(document.querySelectorAll('.booking-steps .step')[2].classList.contains('active')).toBe(true);
        expect(slotEl.getAttribute('aria-selected')).toBe('true');
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
        const dateInput = document.getElementById('selectedDate');
        const timeInput = document.getElementById('selectedTime');
        dateInput.value = '01/10/2099';
        timeInput.value = '10:00 AM';

        resetCalendar();

        expect(document.getElementById('bookingTimes').classList.contains('visible')).toBe(false);
        expect(document.getElementById('bookingFormWrapper').classList.contains('visible')).toBe(false);
        expect(document.querySelector('.summary-placeholder').classList.contains('hidden')).toBe(false);
        expect(document.querySelectorAll('.booking-steps .step')[0].classList.contains('active')).toBe(true);
        expect(dateInput.value).toBe('');
        expect(timeInput.value).toBe('');
    });
});

describe('Calendar Utility helpers', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div class="booking-steps"><span class="step"></span><span class="step"></span></div>
            <p class="summary-placeholder"></p>
            <dd id="summaryDate"></dd>
            <dd id="summaryTime"></dd>
        `;
    });

    test('setActiveBookingStep activates specific index', () => {
        setActiveBookingStep(1);
        const steps = document.querySelectorAll('.booking-steps .step');
        expect(steps[0].classList.contains('active')).toBe(false);
        expect(steps[1].classList.contains('active')).toBe(true);
    });

    test('updateBookingSummary writes date and time', () => {
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
