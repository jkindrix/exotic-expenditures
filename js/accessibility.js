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
    
    // Add keyboard support for navigation and interactive elements
    document.addEventListener('keydown', function(e) {
        // Handle ESC key to close mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.focus();
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
    
    // Check images for alt text and mark those without it
    const checkImagesForAltText = () => {
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            img.style.outline = '3px dashed #E01F54';
            console.warn('Image missing alt text:', img);
        });
    };
    
    checkImagesForAltText();
});