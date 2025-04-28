// Accessibility Enhancements for Exotic Expenditures

document.addEventListener('DOMContentLoaded', () => {
    console.log('Accessibility enhancements loaded');
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Apply reduced motion settings if preferred
    if (prefersReducedMotion) {
        // Disable animations
        document.body.classList.add('reduced-motion');
        
        // Make all cards visible immediately
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'none';
            card.style.transition = 'none';
        });
        
        // Make all sections visible
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('visible');
        });
        
        // Disable custom cursor
        const cursor = document.querySelector('.cursor');
        if (cursor) {
            cursor.style.display = 'none';
        }
    }
    
    // Add accessibility enhancements to navigation
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle) {
        // Set initial ARIA attributes
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-controls', 'nav-menu');
        
        // Update ARIA attributes when menu is toggled
        const originalClickHandler = navToggle.onclick;
        navToggle.onclick = function(e) {
            // Call the original handler if it exists
            if (originalClickHandler) {
                originalClickHandler.call(this, e);
            }
            
            // Update ARIA expanded state
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        };
    }
    
    // Set active page indicators for ARIA
    const updateAriaCurrentPage = () => {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.classList.contains('active')) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    };
    
    // Call this function initially and when scroll is done
    updateAriaCurrentPage();
    window.addEventListener('scroll', function() {
        clearTimeout(window.scrollEndTimer);
        window.scrollEndTimer = setTimeout(updateAriaCurrentPage, 100);
    });
    
    // Enhanced keyboard support for navigation and interactive elements
    document.addEventListener('keydown', function(e) {
        // Handle ESC key to close mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.focus();
        }
        
        // Close any open lightboxes with ESC key
        const lightboxes = document.querySelectorAll('.adventure-lightbox[aria-hidden="false"], .gallery-lightbox[aria-hidden="false"], .rsvp-modal[aria-hidden="false"]');
        if (e.key === 'Escape' && lightboxes.length > 0) {
            lightboxes.forEach(lightbox => {
                // Find close button and trigger click
                const closeButton = lightbox.querySelector('.close-lightbox, .close-rsvp');
                if (closeButton) {
                    closeButton.click();
                } else {
                    // Fallback if no close button
                    lightbox.setAttribute('aria-hidden', 'true');
                }
            });
        }
    });
    
    // Accessible smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Add blur handler to remove focus after scrolling
        anchor.addEventListener('click', function() {
            // If reduced motion is preferred, make sure scrolling is instant
            if (prefersReducedMotion) {
                const targetId = this.getAttribute('href');
                if (targetId !== '#') {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        // Set focus to target for better accessibility
                        setTimeout(() => {
                            targetElement.setAttribute('tabindex', '-1');
                            targetElement.focus({ preventScroll: true });
                            // Remove tabindex after focus to not affect tab order
                            setTimeout(() => targetElement.removeAttribute('tabindex'), 100);
                        }, 10);
                    }
                }
            }
        });
    });
    
    // Handle focus management for modals and lightboxes
    const setupModalAccessibility = () => {
        // Get all modal/lightbox triggers
        const modalTriggers = document.querySelectorAll('.view-details, .gallery-view, .rsvp-button');
        
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                // Find the corresponding modal
                let modal;
                if (this.classList.contains('view-details')) {
                    modal = document.querySelector('.adventure-lightbox');
                } else if (this.classList.contains('gallery-view')) {
                    modal = document.querySelector('.gallery-lightbox');
                } else if (this.classList.contains('rsvp-button')) {
                    modal = document.querySelector('.rsvp-modal');
                }
                
                if (modal) {
                    // Set up focus trap within modal
                    setupFocusTrap(modal);
                    
                    // Store the element that had focus before opening modal
                    modal.dataset.previousFocus = document.activeElement.id || 'nav-toggle';
                    
                    // Set aria-hidden to false when opening
                    modal.setAttribute('aria-hidden', 'false');
                    
                    // Focus the first focusable element in the modal
                    setTimeout(() => {
                        const focusableElements = modal.querySelectorAll(
                            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                        );
                        if (focusableElements.length > 0) {
                            focusableElements[0].focus();
                        }
                    }, 100);
                }
            });
        });
        
        // Handle close buttons
        const closeButtons = document.querySelectorAll('.close-lightbox, .close-rsvp, .close-confirmation');
        closeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const modal = this.closest('[role="dialog"]');
                if (modal) {
                    // Set aria-hidden to true when closing
                    modal.setAttribute('aria-hidden', 'true');
                    
                    // Return focus to the element that opened the modal
                    const previousFocusId = modal.dataset.previousFocus;
                    if (previousFocusId) {
                        const previousFocusElement = document.getElementById(previousFocusId);
                        if (previousFocusElement) {
                            previousFocusElement.focus();
                        } else {
                            // Fallback if element not found
                            document.querySelector('a, button').focus();
                        }
                    }
                }
            });
        });
    };
    
    // Focus trap for modals - keeps tab focus within the modal
    const setupFocusTrap = (modal) => {
        // Ensure modal has an ID for ARIA purposes
        if (!modal.id) {
            modal.id = `modal-${Math.floor(Math.random() * 10000)}`;
        }
        
        // Add role="dialog" if not present
        if (!modal.hasAttribute('role')) {
            modal.setAttribute('role', 'dialog');
        }
        
        // Add aria-modal="true" for screen readers
        modal.setAttribute('aria-modal', 'true');
        
        // Ensure the modal has a title
        let modalTitle = modal.querySelector('h3, h2, h4');
        if (modalTitle && !modalTitle.id) {
            modalTitle.id = `${modal.id}-title`;
            modal.setAttribute('aria-labelledby', modalTitle.id);
        }
        
        modal.addEventListener('keydown', function(e) {
            // Handle Escape key to close modal
            if (e.key === 'Escape') {
                const closeButton = modal.querySelector('.close-lightbox, .close-rsvp, .close-confirmation');
                if (closeButton) {
                    closeButton.click();
                }
                return;
            }
            
            // Handle Tab key for focus trap
            if (e.key === 'Tab') {
                const focusableElements = Array.from(modal.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                )).filter(el => !el.hasAttribute('aria-hidden') && el.offsetParent !== null);
                
                if (focusableElements.length === 0) return;
                
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                // If shift+tab and on first element, wrap to last element
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
                // If tab and on last element, wrap to first element
                else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    };
    
    // Form validation accessibility enhancements
    const enhanceFormValidation = () => {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Add novalidate to handle validation with JavaScript
            form.setAttribute('novalidate', '');
            
            form.addEventListener('submit', function(e) {
                let hasError = false;
                
                // Check all required inputs
                const requiredInputs = form.querySelectorAll('input[required], textarea[required], select[required]');
                requiredInputs.forEach(input => {
                    const errorMessageElement = document.getElementById(`${input.id}-error`) || 
                                              input.nextElementSibling?.classList.contains('error-message') ? 
                                              input.nextElementSibling : null;
                    
                    // Clear previous error states
                    input.removeAttribute('aria-invalid');
                    if (errorMessageElement) errorMessageElement.textContent = '';
                    
                    // Check validity
                    if (!input.validity.valid) {
                        e.preventDefault();
                        hasError = true;
                        
                        // Add appropriate accessibility attributes
                        input.setAttribute('aria-invalid', 'true');
                        
                        // Set error message
                        if (errorMessageElement) {
                            let errorMessage = '';
                            
                            if (input.validity.valueMissing) {
                                errorMessage = `${input.labels[0]?.textContent || 'This field'} is required`;
                            } else if (input.validity.typeMismatch) {
                                errorMessage = `Please enter a valid ${input.type}`;
                            } else if (input.validity.patternMismatch) {
                                errorMessage = input.title || 'Please match the requested format';
                            } else {
                                errorMessage = input.validationMessage || 'This field is invalid';
                            }
                            
                            errorMessageElement.textContent = errorMessage;
                            errorMessageElement.setAttribute('role', 'alert');
                        }
                        
                        // Focus the first invalid input
                        if (document.querySelector('[aria-invalid="true"]') === input) {
                            input.focus();
                        }
                    }
                });
                
                // If no validation errors, handle successful submission
                if (!hasError && form.id === 'contact-form') {
                    e.preventDefault(); // Prevent actual submission for demo
                    const confirmation = document.getElementById('contact-confirmation');
                    if (confirmation) {
                        confirmation.setAttribute('aria-hidden', 'false');
                        confirmation.querySelector('button').focus();
                    }
                }
                
                if (!hasError && form.id === 'newsletter-form') {
                    e.preventDefault(); // Prevent actual submission for demo
                    const confirmation = document.getElementById('newsletter-confirmation');
                    if (confirmation) {
                        confirmation.setAttribute('aria-hidden', 'false');
                        confirmation.querySelector('button').focus();
                    }
                }
            });
        });
    };
    
    // Check images for alt text and enhance them
    const checkImagesForAltText = () => {
        // Check for missing alt attributes
        const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
        imagesWithoutAlt.forEach(img => {
            // First try to generate alt text from context
            let altText = '';
            
            // Check for parent figure with figcaption
            const figureParent = img.closest('figure');
            if (figureParent) {
                const figCaption = figureParent.querySelector('figcaption');
                if (figCaption) {
                    altText = figCaption.textContent.trim();
                }
            }
            
            // Check for nearby headings
            if (!altText) {
                const parentSection = img.closest('div, section, article');
                if (parentSection) {
                    const heading = parentSection.querySelector('h2, h3, h4');
                    if (heading) {
                        altText = heading.textContent.trim();
                    }
                }
            }
            
            // Check for image file name
            if (!altText) {
                const src = img.getAttribute('src');
                if (src) {
                    // Extract filename from path and convert dashes/underscores to spaces
                    const filename = src.split('/').pop().split('.')[0].replace(/[-_]/g, ' ');
                    if (filename) {
                        // Capitalize first letter of each word
                        altText = filename.replace(/\b\w/g, l => l.toUpperCase());
                    }
                }
            }
            
            // Apply derived alt text or mark as decorative
            if (altText) {
                img.setAttribute('alt', altText);
                img.style.outline = '3px dotted #FFCC00'; // Mark as auto-generated
                console.warn('Auto-generated alt text for image:', img);
            } else {
                // If it seems decorative (e.g., within a background, icon, etc.)
                const isLikelyDecorative = 
                    img.width < 50 || // Small icons
                    img.height < 50 || // Small icons
                    img.closest('.hero-background') || // Background images
                    img.closest('[aria-hidden="true"]') || // Hidden decorations
                    img.closest('.shape') || // Decorative shapes
                    img.classList.contains('decoration'); // Explicitly marked
                
                if (isLikelyDecorative) {
                    img.setAttribute('alt', ''); // Empty alt for decorative images
                    console.info('Marked image as decorative:', img);
                } else {
                    img.style.outline = '3px dashed #E01F54'; // Mark as needing attention
                    console.error('Image missing alt text:', img);
                }
            }
        });
        
        // Check for empty or insufficiently descriptive alt attributes
        const imagesWithAlt = document.querySelectorAll('img[alt]');
        imagesWithAlt.forEach(img => {
            const alt = img.getAttribute('alt');
            // Skip decorative images (empty alt is correct)
            if (alt === '') return;
            
            // Check for poor alt text
            if (!alt || alt.trim() === '') {
                img.style.outline = '3px dashed #E01F54';
                console.error('Image has empty alt text:', img);
            } else if (alt.length < 10 && !img.closest('[aria-hidden="true"]') && img.width > 100 && img.height > 100) {
                img.style.outline = '3px dotted #FFCC00';
                console.warn('Image likely has insufficiently descriptive alt text:', img, alt);
            }
        });
        
        // Add context for gallery images specifically
        document.querySelectorAll('.gallery-item img').forEach(img => {
            if (!img.alt || img.alt === '') {
                // Look for heading in the gallery item
                const galleryItem = img.closest('.gallery-item');
                if (galleryItem) {
                    const heading = galleryItem.querySelector('h3');
                    const paragraph = galleryItem.querySelector('p');
                    if (heading) {
                        let altText = heading.textContent.trim();
                        if (paragraph) {
                            altText += ` - ${paragraph.textContent.trim()}`;
                        }
                        img.setAttribute('alt', altText);
                        console.info('Added gallery context as alt text:', img);
                    }
                }
            }
        });
    };
    
    // Fix cookie consent accessibility
    const enhanceCookieConsent = () => {
        const cookieConsent = document.querySelector('.cookie-consent');
        if (cookieConsent) {
            cookieConsent.setAttribute('role', 'dialog');
            cookieConsent.setAttribute('aria-labelledby', 'cookie-title');
            
            // Add a heading for screen readers
            const cookieContent = cookieConsent.querySelector('.cookie-content');
            if (cookieContent && cookieContent.querySelector('p')) {
                const cookieText = cookieContent.querySelector('p').textContent;
                const heading = document.createElement('h2');
                heading.id = 'cookie-title';
                heading.classList.add('sr-only');
                heading.textContent = 'Cookie Consent';
                cookieContent.insertBefore(heading, cookieContent.firstChild);
            }
            
            // Ensure buttons have accessible names
            const buttons = cookieConsent.querySelectorAll('button');
            buttons.forEach(button => {
                if (!button.getAttribute('aria-label')) {
                    button.setAttribute('aria-label', button.textContent.trim());
                }
            });
        }
    };
    
    // Initialize all accessibility enhancements
    setupModalAccessibility();
    enhanceFormValidation();
    checkImagesForAltText();
    enhanceCookieConsent();
});