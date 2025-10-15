gsap.registerPlugin(ScrollTrigger);

// Theme toggle (dark → neutral → light)
const themeIcons = {
    dark: '🌙',
    neutral: '🌗',
    light: '☀️'
};

function getNextTheme(currentTheme) {
    if (currentTheme === 'dark') return 'neutral';
    if (currentTheme === 'neutral') return 'light';
    return 'dark';
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = themeIcons[theme];
    }
    localStorage.setItem('theme', theme);
}

function initTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(currentTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = getNextTheme(currentTheme);
    applyTheme(nextTheme);
}

// Initialize theme after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
    });
} else {
    initTheme();
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
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
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 1000);
});

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Scroll progress and back-to-top
const scrollProgress = document.querySelector('.scroll-progress');
const backToTop = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;
    scrollProgress.style.transform = `scaleX(${scrollPercent})`;
    
    if (scrollTop > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Hero parallax with overlay fade
const heroSection = document.querySelector('.hero-section');

gsap.to('.parallax-bg', {
    scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    },
    y: 300,
    scale: 1.2
});

gsap.to(heroSection, {
    scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
            heroSection.style.setProperty('--overlay-opacity', 0.5 - (self.progress * 0.5));
        }
    }
});

// Hero content fade in
gsap.from('.hero-logo', {
    opacity: 0,
    y: -50,
    duration: 1.5,
    ease: 'power3.out'
});

gsap.from('.hero-content h1', {
    opacity: 0,
    y: 30,
    duration: 1,
    delay: 0.3,
    ease: 'power3.out'
});

gsap.from('.hero-content p', {
    opacity: 0,
    y: 30,
    duration: 1,
    delay: 0.5,
    ease: 'power3.out'
});

gsap.from('.cta-button', {
    opacity: 0,
    y: 30,
    duration: 1,
    delay: 0.7,
    ease: 'power3.out'
});

// About section animation
gsap.from('.about-content-centered', {
    scrollTrigger: {
        trigger: '.about-section',
        start: 'top 70%',
        toggleActions: 'play reverse play reverse'
    },
    opacity: 0,
    y: 60,
    duration: 1,
    ease: 'power3.out'
});

gsap.from('.section-label', {
    scrollTrigger: {
        trigger: '.about-content',
        start: 'top 75%',
        toggleActions: 'play reverse play reverse'
    },
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power2.out'
});

gsap.from('.about-content h2', {
    scrollTrigger: {
        trigger: '.about-content',
        start: 'top 75%',
        toggleActions: 'play reverse play reverse'
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.2,
    ease: 'power3.out'
});

gsap.from('.about-content p', {
    scrollTrigger: {
        trigger: '.about-content',
        start: 'top 75%',
        toggleActions: 'play reverse play reverse'
    },
    opacity: 0,
    y: 20,
    stagger: 0.15,
    duration: 0.6,
    delay: 0.4,
    ease: 'power2.out'
});

// Services section animation
gsap.from('.service-block', {
    scrollTrigger: {
        trigger: '.services-section',
        start: 'top 70%',
        toggleActions: 'play reverse play reverse'
    },
    opacity: 0,
    y: 60,
    stagger: 0.3,
    duration: 1,
    ease: 'power3.out'
});

// Credentials section animation
gsap.from('.credentials-section h2', {
    scrollTrigger: {
        trigger: '.credentials-section',
        start: 'top 70%',
        toggleActions: 'play reverse play reverse'
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power3.out'
});

gsap.from('.cert-badge', {
    scrollTrigger: {
        trigger: '.credentials-section',
        start: 'top 70%',
        toggleActions: 'play reverse play reverse'
    },
    opacity: 0,
    scale: 0.8,
    duration: 1,
    delay: 0.3,
    ease: 'power3.out'
});

gsap.from('.credentials-list p', {
    scrollTrigger: {
        trigger: '.credentials-section',
        start: 'top 70%',
        toggleActions: 'play reverse play reverse'
    },
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.6,
    delay: 0.6,
    ease: 'power2.out'
});

// Contact section animation
gsap.from('.contact-form', {
    scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 70%',
        toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 60,
    duration: 1,
    ease: 'power3.out'
});

gsap.from('.contact-info', {
    scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 70%',
        toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 60,
    duration: 1,
    delay: 0.3,
    ease: 'power3.out'
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Floating CTA show/hide
const floatingCta = document.querySelector('.floating-cta');

gsap.from(floatingCta, {
    scrollTrigger: {
        trigger: '.services-section',
        start: 'top center',
        toggleActions: 'play reverse play reverse'
    },
    scale: 0,
    duration: 0.5,
    ease: 'back.out'
});

// Form validation and submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    if (validateContactForm(data)) {
        console.log('Form submitted:', data);
        showSuccessMessage();
        contactForm.reset();
    }
});

function validateContactForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!data.name || data.name.trim().length < 2) {
        showError('Please enter a valid name');
        return false;
    }
    
    if (!emailRegex.test(data.email)) {
        showError('Please enter a valid email address');
        return false;
    }
    
    if (!data.message || data.message.trim().length < 10) {
        showError('Please enter a message (minimum 10 characters)');
        return false;
    }
    
    return true;
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-message error';
    errorDiv.textContent = message;
    contactForm.insertBefore(errorDiv, contactForm.firstChild);
    setTimeout(() => errorDiv.remove(), 3000);
}

function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-message success';
    successDiv.textContent = 'Thank you! Your message has been sent. We will contact you shortly.';
    contactForm.insertBefore(successDiv, contactForm.firstChild);
    setTimeout(() => successDiv.remove(), 5000);
}

// Booking Calendar
let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const availableSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

function resetCalendar() {
    const container = document.querySelector('.booking-container');
    container.classList.remove('reveal');
    container.classList.add('centered');
    document.getElementById('bookingTimes').classList.remove('visible');
    document.getElementById('bookingFormWrapper').classList.remove('visible');
    document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
    selectedDate = null;
    selectedTime = null;
}

function hideForm() {
    document.getElementById('bookingFormWrapper').classList.remove('visible');
    document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
    selectedTime = null;
}

function selectTime(time, element) {
    selectedTime = time;
    
    document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    
    document.getElementById('selectedDate').value = selectedDate.toLocaleDateString();
    document.getElementById('selectedTime').value = selectedTime;
    
    setTimeout(() => {
        document.getElementById('bookingFormWrapper').classList.add('visible');
    }, 100);
}

function showTimeSlots() {
    const slotsContainer = document.getElementById('timeSlots');
    
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
    
    document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
    
    const container = document.querySelector('.booking-container');
    container.classList.remove('centered');
    container.classList.add('reveal');
    
    showTimeSlots();
    
    setTimeout(() => {
        document.getElementById('bookingTimes').classList.add('visible');
    }, 100);
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthLabel = document.getElementById('currentMonth');
    
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

document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

document.getElementById('appointmentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bookingData = Object.fromEntries(formData);
    
    console.log('Booking submitted:', bookingData);
    
    alert(`Appointment requested for ${bookingData.date} at ${bookingData.time}. We'll confirm via email shortly.`);
    
    e.target.reset();
    resetCalendar();
});

document.getElementById('cancelSelection').addEventListener('click', resetCalendar);

document.addEventListener('click', (e) => {
    const calendar = document.querySelector('.booking-calendar');
    const times = document.getElementById('bookingTimes');
    const formWrapper = document.getElementById('bookingFormWrapper');
    
    if (!calendar.contains(e.target) && !times.contains(e.target) && !formWrapper.contains(e.target)) {
        if (formWrapper.classList.contains('visible')) {
            hideForm();
        }
    }
});

document.querySelector('.booking-container').classList.add('centered');
renderCalendar();

// FAQ Accordion
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => toggleFAQ(button));
});
