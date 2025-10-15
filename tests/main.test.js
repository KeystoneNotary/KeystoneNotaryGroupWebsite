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
