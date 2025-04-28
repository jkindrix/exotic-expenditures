/**
 * JavaScript fixes for Exotic Expenditures website
 * Addresses ID reference issues and other compatibility problems
 */

document.addEventListener('DOMContentLoaded', () => {
    // Fix potentially missing elements referenced in main.js
    fixElementReferences();
    
    // Fix duplicate functionality
    preventDuplicateInitialization();
});

/**
 * Creates compatibility references for elements that might be missing
 * or have ID mismatches between HTML and JavaScript
 */
function fixElementReferences() {
    // Form success elements
    if (!document.getElementById('form-success') && document.getElementById('contact-confirmation')) {
        const formSuccessRef = document.getElementById('contact-confirmation');
        formSuccessRef.id = 'form-success';
    }
    
    // Newsletter elements
    if (!document.getElementById('newsletter-success') && document.getElementById('newsletter-confirmation')) {
        const newsletterSuccessRef = document.getElementById('newsletter-confirmation');
        newsletterSuccessRef.id = 'newsletter-success';
    }
    
    // Calculate button
    if (!document.getElementById('calculate-btn') && document.getElementById('calculate-savings')) {
        const calculateBtnRef = document.getElementById('calculate-savings');
        calculateBtnRef.classList.add('calculate-btn');
        // Add ID reference without changing the existing ID
        calculateBtnRef.setAttribute('data-alt-id', 'calculate-btn');
    }
}

/**
 * Prevents duplicate initialization of functionality that might be 
 * present in multiple script files
 */
function preventDuplicateInitialization() {
    // Track which functionality has been initialized
    if (!window.exoticExpInitialized) {
        window.exoticExpInitialized = {
            testimonialSlider: false,
            cookieConsent: false,
            adventureFilters: false
        };
    }
    
    // Create a publish-subscribe system for initialization events
    if (!window.exoticExpEvents) {
        window.exoticExpEvents = {
            subscribers: {},
            
            subscribe: function(event, callback) {
                if (!this.subscribers[event]) {
                    this.subscribers[event] = [];
                }
                this.subscribers[event].push(callback);
            },
            
            publish: function(event, data) {
                if (!this.subscribers[event]) {
                    return;
                }
                
                this.subscribers[event].forEach(callback => {
                    callback(data);
                });
            }
        };
    }
}

// Intercept testimonial slider initialization
window.exoticExpEvents.subscribe('beforeTestimonialInit', () => {
    if (window.exoticExpInitialized.testimonialSlider) {
        return false; // Prevent duplicate initialization
    }
    window.exoticExpInitialized.testimonialSlider = true;
    return true; // Allow initialization
});

// Intercept cookie consent initialization
window.exoticExpEvents.subscribe('beforeCookieConsentInit', () => {
    if (window.exoticExpInitialized.cookieConsent) {
        return false; // Prevent duplicate initialization
    }
    window.exoticExpInitialized.cookieConsent = true;
    return true; // Allow initialization
});

// Patch for main.js element selection
// This ensures backward compatibility with older code
if (typeof Element.prototype.realQuerySelector === 'undefined') {
    Element.prototype.realQuerySelector = Element.prototype.querySelector;
    Element.prototype.querySelector = function(selector) {
        // First try the regular query
        const result = this.realQuerySelector(selector);
        if (result) return result;
        
        // If no result and looking for an ID, try data-alt-id
        if (selector.startsWith('#')) {
            const altId = selector.substring(1);
            return this.realQuerySelector(`[data-alt-id="${altId}"]`);
        }
        
        return null;
    };
}