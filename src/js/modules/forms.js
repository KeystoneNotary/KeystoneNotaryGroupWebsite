import { EMAIL_REGEX, ERROR_DURATION, SUCCESS_DURATION } from '../config.js';

function showError(message, formElement) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-message error';
    errorDiv.textContent = message;
    errorDiv.setAttribute('role', 'alert');
    
    const messagesContainer = formElement ? formElement.querySelector('[aria-live]') : null;
    const targetContainer = messagesContainer || formElement;
    
    if (targetContainer) {
        if (messagesContainer) {
            messagesContainer.innerHTML = ''; // Clear previous messages
            messagesContainer.appendChild(errorDiv);
        } else {
            targetContainer.insertBefore(errorDiv, targetContainer.firstChild);
        }
        setTimeout(() => errorDiv.remove(), ERROR_DURATION);
    }
}

function showSuccessMessage(message, formElement) {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-message success';
    successDiv.textContent = message;
    successDiv.setAttribute('role', 'status');
    
    const messagesContainer = formElement ? formElement.querySelector('[aria-live]') : null;
    const targetContainer = messagesContainer || formElement;
    
    if (targetContainer) {
        if (messagesContainer) {
            messagesContainer.innerHTML = ''; // Clear previous messages
            messagesContainer.appendChild(successDiv);
        } else {
            targetContainer.insertBefore(successDiv, targetContainer.firstChild);
        }
        setTimeout(() => successDiv.remove(), SUCCESS_DURATION);
    }
}

function validateContactForm(data, formElement) {
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


function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            if (validateContactForm(data, contactForm)) {
                console.log('Form submitted:', data);
                showSuccessMessage('Thank you! Your message has been sent. We will contact you shortly.', contactForm);
                contactForm.reset();
            }
        });
    }
}

export function initForms() {
    initContactForm();
}
