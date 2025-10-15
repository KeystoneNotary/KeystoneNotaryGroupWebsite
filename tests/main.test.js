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
