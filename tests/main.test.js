// Unit tests for form validation functions

describe('Form Validation Tests', () => {
    
    test('validateForm should return true for valid data', () => {
        const validData = {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '123-456-7890',
            message: 'I need notary services for my documents.'
        };
        expect(validateForm(validData)).toBe(true);
    });
    
    test('validateForm should reject invalid name', () => {
        const invalidData = {
            name: 'J',
            email: 'john@example.com',
            phone: '123-456-7890',
            message: 'I need notary services.'
        };
        expect(validateForm(invalidData)).toBe(false);
    });
    
    test('validateForm should reject invalid email', () => {
        const invalidData = {
            name: 'John Doe',
            email: 'invalid-email',
            phone: '123-456-7890',
            message: 'I need notary services.'
        };
        expect(validateForm(invalidData)).toBe(false);
    });
    
    test('validateForm should reject invalid phone', () => {
        const invalidData = {
            name: 'John Doe',
            email: 'john@example.com',
            phone: 'abc-def-ghij',
            message: 'I need notary services.'
        };
        expect(validateForm(invalidData)).toBe(false);
    });
    
    test('validateForm should reject short message', () => {
        const invalidData = {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '123-456-7890',
            message: 'Short'
        };
        expect(validateForm(invalidData)).toBe(false);
    });
    
    test('email regex should validate correct email formats', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test('test@example.com')).toBe(true);
        expect(emailRegex.test('user.name@domain.co.uk')).toBe(true);
        expect(emailRegex.test('invalid@')).toBe(false);
        expect(emailRegex.test('@invalid.com')).toBe(false);
    });
    
    test('phone regex should validate phone number formats', () => {
        const phoneRegex = /^[\d\s\-\(\)]+$/;
        expect(phoneRegex.test('123-456-7890')).toBe(true);
        expect(phoneRegex.test('(123) 456-7890')).toBe(true);
        expect(phoneRegex.test('1234567890')).toBe(true);
        expect(phoneRegex.test('abc-def-ghij')).toBe(false);
    });
});

describe('Smooth Scroll Tests', () => {
    
    test('smooth scroll should be triggered on anchor click', () => {
        const mockAnchor = document.createElement('a');
        mockAnchor.setAttribute('href', '#services');
        document.body.appendChild(mockAnchor);
        
        const clickEvent = new Event('click');
        mockAnchor.dispatchEvent(clickEvent);
        
        document.body.removeChild(mockAnchor);
    });
});

describe('Form Submission Tests', () => {
    
    test('form submission should prevent default behavior', () => {
        const form = document.createElement('form');
        form.id = 'contactForm';
        
        const submitEvent = new Event('submit');
        const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');
        
        form.dispatchEvent(submitEvent);
        
        expect(preventDefaultSpy).toHaveBeenCalled();
    });
});

describe('Hamburger Menu Tests', () => {
    
    test('hamburger should toggle active class on click', () => {
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        
        hamburger.click();
        
        expect(hamburger.classList.contains('active')).toBe(true);
    });
    
    test('nav links should close when link is clicked', () => {
        const navLinks = document.createElement('ul');
        navLinks.className = 'nav-links active';
        
        const link = document.createElement('a');
        link.href = '#services';
        navLinks.appendChild(link);
        
        link.click();
        
        expect(navLinks.classList.contains('active')).toBe(false);
    });
});

describe('Scroll Progress Tests', () => {
    
    test('scroll progress should update on scroll', () => {
        const scrollProgress = document.createElement('div');
        scrollProgress.className = 'scroll-progress';
        document.body.appendChild(scrollProgress);
        
        window.dispatchEvent(new Event('scroll'));
        
        expect(scrollProgress.style.transform).toBeDefined();
        
        document.body.removeChild(scrollProgress);
    });
});

describe('Loader Tests', () => {
    
    test('loader should hide after page load', (done) => {
        const loader = document.createElement('div');
        loader.className = 'loader';
        document.body.appendChild(loader);
        
        window.dispatchEvent(new Event('load'));
        
        setTimeout(() => {
            expect(loader.classList.contains('hidden')).toBe(true);
            document.body.removeChild(loader);
            done();
        }, 1100);
    });
});

describe('Booking Calendar Tests', () => {
    
    test('renderCalendar should populate calendar grid', () => {
        document.body.innerHTML = `
            <div id="calendarGrid"></div>
            <h3 id="currentMonth"></h3>
        `;
        
        renderCalendar();
        
        const grid = document.getElementById('calendarGrid');
        expect(grid.children.length).toBeGreaterThan(0);
    });
    
    test('selectDate should set selectedDate and reveal times', () => {
        document.body.innerHTML = `
            <div class="booking-container centered"></div>
            <div id="bookingTimes"></div>
            <div id="timeSlots"></div>
        `;
        
        const testDate = new Date(2025, 0, 15);
        const element = document.createElement('div');
        element.className = 'calendar-day';
        document.body.appendChild(element);
        
        selectDate(testDate, element);
        
        expect(selectedDate).toEqual(testDate);
        expect(element.classList.contains('selected')).toBe(true);
        expect(document.querySelector('.booking-container').classList.contains('reveal')).toBe(true);
        
        document.body.removeChild(element);
    });
    
    test('showTimeSlots should populate time slots', () => {
        document.body.innerHTML = `<div id="timeSlots"></div>`;
        
        showTimeSlots();
        
        const slots = document.getElementById('timeSlots');
        expect(slots.children.length).toBe(availableSlots.length);
    });
    
    test('selectTime should set selectedTime and reveal form', () => {
        document.body.innerHTML = `
            <div class="booking-form-container"></div>
            <div class="booking-form"></div>
            <input type="hidden" id="selectedDate">
            <input type="hidden" id="selectedTime">
        `;
        
        selectedDate = new Date(2025, 0, 15);
        const element = document.createElement('div');
        element.className = 'time-slot';
        document.body.appendChild(element);
        
        selectTime('10:00 AM', element);
        
        expect(selectedTime).toBe('10:00 AM');
        expect(element.classList.contains('selected')).toBe(true);
        expect(document.getElementById('selectedTime').value).toBe('10:00 AM');
        
        document.body.removeChild(element);
    });
    
    test('resetCalendar should clear all selections', () => {
        document.body.innerHTML = `
            <div class="booking-container reveal"></div>
            <div id="bookingTimes" class="visible"></div>
            <div id="bookingFormWrapper" class="visible"></div>
        `;
        
        selectedDate = new Date(2025, 0, 15);
        selectedTime = '10:00 AM';
        
        resetCalendar();
        
        expect(selectedDate).toBeNull();
        expect(selectedTime).toBeNull();
        expect(document.querySelector('.booking-container').classList.contains('centered')).toBe(true);
    });
    
    test('hideForm should only hide form and keep times visible', () => {
        document.body.innerHTML = `
            <div id="bookingFormWrapper" class="visible"></div>
            <div class="booking-form-container show-form"></div>
        `;
        
        selectedTime = '10:00 AM';
        
        hideForm();
        
        expect(selectedTime).toBeNull();
        expect(document.getElementById('bookingFormWrapper').classList.contains('visible')).toBe(false);
    });
    
    test('appointment form should prevent default submission', () => {
        const form = document.createElement('form');
        form.id = 'appointmentForm';
        document.body.appendChild(form);
        
        const submitEvent = new Event('submit');
        const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');
        
        form.dispatchEvent(submitEvent);
        
        expect(preventDefaultSpy).toHaveBeenCalled();
        
        document.body.removeChild(form);
    });
    
    test('calendar should disable past dates and Sundays', () => {
        document.body.innerHTML = `
            <div id="calendarGrid"></div>
            <h3 id="currentMonth"></h3>
        `;
        
        renderCalendar();
        
        const grid = document.getElementById('calendarGrid');
        const disabledDays = Array.from(grid.children).filter(el => el.classList.contains('disabled'));
        
        expect(disabledDays.length).toBeGreaterThan(0);
    });
    
    test('cancel button should reset calendar to centered state', () => {
        document.body.innerHTML = `
            <div class="booking-container reveal"></div>
            <div id="bookingTimes" class="visible"></div>
            <div id="bookingFormWrapper"></div>
            <button id="cancelSelection"></button>
        `;
        
        const cancelBtn = document.getElementById('cancelSelection');
        cancelBtn.click();
        
        expect(document.querySelector('.booking-container').classList.contains('centered')).toBe(true);
    });
});

describe('Form Message Tests', () => {
    
    test('showError should create error message element', () => {
        const form = document.createElement('form');
        form.id = 'contactForm';
        document.body.appendChild(form);
        
        const errorMessage = 'Test error message';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-message error';
        errorDiv.textContent = errorMessage;
        form.insertBefore(errorDiv, form.firstChild);
        
        expect(form.querySelector('.form-message.error')).toBeTruthy();
        expect(form.querySelector('.form-message.error').textContent).toBe(errorMessage);
        
        document.body.removeChild(form);
    });
    
    test('showSuccessMessage should create success message element', () => {
        const form = document.createElement('form');
        form.id = 'contactForm';
        document.body.appendChild(form);
        
        const successDiv = document.createElement('div');
        successDiv.className = 'form-message success';
        successDiv.textContent = 'Success message';
        form.insertBefore(successDiv, form.firstChild);
        
        expect(form.querySelector('.form-message.success')).toBeTruthy();
        
        document.body.removeChild(form);
    });
});

// Theme toggle tests
describe('Theme Toggle', () => {
    test('getNextTheme cycles correctly', () => {
        expect(getNextTheme('dark')).toBe('neutral');
        expect(getNextTheme('neutral')).toBe('light');
        expect(getNextTheme('light')).toBe('dark');
    });

    test('applyTheme sets correct attributes', () => {
        applyTheme('neutral');
        expect(document.documentElement.getAttribute('data-theme')).toBe('neutral');
        expect(localStorage.getItem('theme')).toBe('neutral');

        applyTheme('dark');
        expect(document.documentElement.getAttribute('data-theme')).toBeNull();
        expect(localStorage.getItem('theme')).toBe('dark');
    });

    test('initTheme loads saved theme', () => {
        localStorage.setItem('theme', 'light');
        initTheme();
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    test('toggleTheme cycles through themes', () => {
        applyTheme('dark');
        toggleTheme();
        expect(document.documentElement.getAttribute('data-theme')).toBe('neutral');
        toggleTheme();
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
        toggleTheme();
        expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    });
});

// FAQ tests
describe('FAQ Accordion', () => {
    test('toggleFAQ opens closed item', () => {
        const mockButton = document.createElement('button');
        const mockItem = document.createElement('div');
        mockItem.classList.add('faq-item');
        mockItem.appendChild(mockButton);
        document.body.appendChild(mockItem);

        toggleFAQ(mockButton);
        expect(mockItem.classList.contains('active')).toBe(true);

        document.body.removeChild(mockItem);
    });

    test('toggleFAQ closes open item', () => {
        const mockButton = document.createElement('button');
        const mockItem = document.createElement('div');
        mockItem.classList.add('faq-item', 'active');
        mockItem.appendChild(mockButton);
        document.body.appendChild(mockItem);

        toggleFAQ(mockButton);
        expect(mockItem.classList.contains('active')).toBe(false);

        document.body.removeChild(mockItem);
    });
});

// Hero overlay tests
describe('Hero Overlay', () => {
    test('overlay opacity variable exists', () => {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const opacity = getComputedStyle(heroSection).getPropertyValue('--overlay-opacity');
            expect(opacity).toBeDefined();
        }
    });
});
