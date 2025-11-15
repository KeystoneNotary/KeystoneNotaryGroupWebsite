import { monthNames, dayNames, availableSlots } from '../constants.js';
import { showError as showFormError, showSuccessMessage as showFormSuccessMessage } from './forms.js';

const currentDate = new Date();
let selectedDate = null;
let selectedTime = null;
let selectedDateInputEl = null;
let selectedTimeInputEl = null;

function getSelectedDateInput() {
    if (!selectedDateInputEl || !document.body.contains(selectedDateInputEl)) {
        selectedDateInputEl = document.getElementById('selectedDate');
    }
    return selectedDateInputEl;
}

function getSelectedTimeInput() {
    if (!selectedTimeInputEl || !document.body.contains(selectedTimeInputEl)) {
        selectedTimeInputEl = document.getElementById('selectedTime');
    }
    return selectedTimeInputEl;
}

export function setActiveBookingStep(index) {
    document.querySelectorAll('.booking-steps .step').forEach((step, stepIndex) => {
        step.classList.toggle('active', stepIndex === index);
    });
}

export function updateBookingSummary(dateText, timeText) {
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

export function formatSelectedDate(date) {
    if (!date) return '';
    return date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
}

export function resetCalendar() {
    const bookingTimes = document.getElementById('bookingTimes');
    const bookingFormWrapper = document.getElementById('bookingFormWrapper');
    const bookingHint = document.getElementById('bookingHint');
    const selectedDateInput = getSelectedDateInput();
    const selectedTimeInput = getSelectedTimeInput();

    if (bookingTimes) {
        bookingTimes.classList.remove('visible');
    }
    if (bookingFormWrapper) {
        bookingFormWrapper.classList.remove('visible');
    }

    document.querySelectorAll('.calendar-day').forEach(el => {
        if (el instanceof HTMLButtonElement) {
            el.classList.remove('selected');
            el.setAttribute('aria-pressed', 'false');
            el.removeAttribute('aria-selected');
        }
    });
    document.querySelectorAll('.time-slot').forEach(el => {
        el.classList.remove('selected');
        el.setAttribute('aria-selected', 'false');
    });
    selectedDate = null;
    selectedTime = null;
    if (selectedDateInput) {
        selectedDateInput.value = '';
    }
    if (selectedTimeInput) {
        selectedTimeInput.value = '';
    }
    setActiveBookingStep(0);
    updateBookingSummary('', '');
    if (bookingHint) {
        bookingHint.textContent = 'Select an available date to reveal appointment slots.';
    }
}

export function hideForm() {
    const bookingFormWrapper = document.getElementById('bookingFormWrapper');
    const bookingHint = document.getElementById('bookingHint');

    if (bookingFormWrapper) {
        bookingFormWrapper.classList.remove('visible');
    }

    document.querySelectorAll('.time-slot').forEach(el => {
        el.classList.remove('selected');
        el.setAttribute('aria-selected', 'false');
    });
    selectedTime = null;
    updateBookingSummary(formatSelectedDate(selectedDate), '');
    setActiveBookingStep(selectedDate ? 1 : 0);
    if (bookingHint) {
        bookingHint.textContent = selectedDate ? 'Choose an available time slot to continue.' : 'Select an available date to reveal appointment slots.';
    }
}

export function selectTime(time, element) {
    selectedTime = time;

    document.querySelectorAll('.time-slot').forEach(el => {
        el.classList.remove('selected');
        el.setAttribute('aria-selected', 'false');
    });
    element.classList.add('selected');
    element.setAttribute('aria-selected', 'true');

    const selectedDateInput = getSelectedDateInput();
    const selectedTimeInput = getSelectedTimeInput();
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

export function showTimeSlots() {
    const slotsContainer = document.getElementById('timeSlots');

    if (!slotsContainer) return;

    slotsContainer.innerHTML = '';

    availableSlots.forEach(slot => {
        const slotEl = document.createElement('button');
        slotEl.type = 'button';
        slotEl.className = 'time-slot';
        slotEl.textContent = slot;
        slotEl.setAttribute('role', 'option');
        slotEl.setAttribute('aria-selected', 'false');
        slotEl.addEventListener('click', () => selectTime(slot, slotEl));
        slotsContainer.appendChild(slotEl);
    });

    const firstSlot = slotsContainer.querySelector('.time-slot');
    if (firstSlot) {
        requestAnimationFrame(() => firstSlot.focus());
    }
}

export function selectDate(date, element) {
    selectedDate = date;

    const bookingHint = document.getElementById('bookingHint');
    const bookingTimes = document.getElementById('bookingTimes');

    if (!element) return;

    document.querySelectorAll('.calendar-day').forEach(el => {
        if (el instanceof HTMLButtonElement) {
            el.classList.remove('selected');
            el.setAttribute('aria-pressed', 'false');
            el.removeAttribute('aria-selected');
        }
    });
    element.classList.add('selected');
    element.setAttribute('aria-pressed', 'true');
    element.setAttribute('aria-selected', 'true');

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

export function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthLabel = document.getElementById('currentMonth');

    if (!grid || !monthLabel) return;

    monthLabel.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    grid.innerHTML = '';
    
    dayNames.forEach(day => {
        const label = document.createElement('div');
        label.className = 'calendar-day day-label';
        label.textContent = day;
        label.setAttribute('role', 'columnheader');
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
        const dayEl = document.createElement('button');
        dayEl.type = 'button';
        dayEl.className = 'calendar-day';
        dayEl.textContent = day;
        dayEl.setAttribute('role', 'gridcell');
        dayEl.setAttribute('aria-pressed', 'false');

        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        dayDate.setHours(0, 0, 0, 0);

        if (dayDate < today || dayDate.getDay() === 0) {
            dayEl.classList.add('disabled');
            dayEl.setAttribute('aria-disabled', 'true');
            dayEl.disabled = true;
        } else {
            dayEl.addEventListener('click', () => selectDate(dayDate, dayEl));
        }

        grid.appendChild(dayEl);
    }
}

function initAppointmentForm() {
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const bookingData = Object.fromEntries(formData);

            if (!bookingData.date || !bookingData.time) {
                showFormError('Please select an appointment date and time before submitting.', appointmentForm);
                return;
            }

            console.log('Booking submitted:', bookingData);

            showFormSuccessMessage(
                `Appointment requested for ${bookingData.date} at ${bookingData.time}. We'll confirm via email shortly.`,
                appointmentForm
            );

            e.target.reset();
            resetCalendar();
        });
    }
}

export function initCalendar() {
    renderCalendar();

    selectedDateInputEl = getSelectedDateInput();
    selectedTimeInputEl = getSelectedTimeInput();

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

    initAppointmentForm();
}
