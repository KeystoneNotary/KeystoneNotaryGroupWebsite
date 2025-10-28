/**
 * Configuration constants for Keystone Notary Group LLC Website
 * Centralized configuration to avoid magic numbers and improve maintainability
 */

// Scroll thresholds
export const SCROLL_THRESHOLD_BACK_TO_TOP = 500;
export const NAV_OFFSET = 80;

// Animation durations (milliseconds)
export const LOADER_HIDE_DELAY = 1000;
export const ERROR_MESSAGE_DURATION = 3000;
export const SUCCESS_MESSAGE_DURATION = 5000;

// Theme configuration
export const THEME_CONFIG = [
    { id: 'dark', icon: '🌙' },
    { id: 'neutral', icon: '🌗' },
    { id: 'light', icon: '☀️' }
];

export const DEFAULT_THEME = 'dark';

// Calendar configuration
export const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const AVAILABLE_TIME_SLOTS = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

// Validation patterns
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_NAME_LENGTH = 2;
export const MIN_MESSAGE_LENGTH = 10;

// Intersection Observer configuration
export const SECTION_OBSERVER_OPTIONS = {
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0.1
};

// GSAP animation configuration
export const GSAP_SCROLL_DURATION = 1.2;
export const GSAP_SCROLL_EASE = 'power3.inOut';
export const GSAP_BACK_TO_TOP_DURATION = 1.5;

// Business contact information
export const BUSINESS_PHONE = '(267) 309-9000';
export const BUSINESS_PHONE_LINK = 'tel:+12673099000';
export const BUSINESS_EMAIL = 'contact@keystonenotarygroup.com';
export const BUSINESS_DOMAIN = 'https://www.keystonenotarygroup.com';
export const BUSINESS_LOCATION = 'Hellertown, PA 18055';
export const SERVICE_RADIUS = '50-mile radius';
