import { monthNames, dayNames, availableSlots } from '../config.js';

let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;

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

function initAppointmentForm() {
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const bookingData = Object.fromEntries(formData);

            console.log('Booking submitted:', bookingData);

            alert(`Appointment requested for ${bookingData.date} at ${bookingData.time}. We\'ll confirm via email shortly.`);

            e.target.reset();
            resetCalendar();
        });
    }
}

export function initCalendar() {
    renderCalendar();

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
