/**
 * Visual Effects - Agent 5
 * Implements advanced visual effects and interactions for Exotic Expenditures website
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    /**
     * 3D Tilt Effect
     * Adds subtle 3D tilt effect to cards on mouse movement
     */
    const initTiltEffect = () => {
        const tiltCards = document.querySelectorAll('.tilt-card');
        
        if (tiltCards.length === 0 || prefersReducedMotion) return;
        
        tiltCards.forEach(card => {
            // Create shine overlay if it doesn't exist
            if (!card.querySelector('.tilt-card-shine')) {
                const shine = document.createElement('div');
                shine.className = 'tilt-card-shine';
                card.appendChild(shine);
            }
            
            // Add inner wrapper if it doesn't exist
            if (!card.querySelector('.tilt-card-inner')) {
                const children = Array.from(card.childNodes);
                const inner = document.createElement('div');
                inner.className = 'tilt-card-inner';
                
                // Move all child nodes to inner wrapper
                children.forEach(child => {
                    if (child !== card.querySelector('.tilt-card-shine')) {
                        inner.appendChild(child);
                    }
                });
                
                card.appendChild(inner);
            }
            
            // Handle mouse movement
            card.addEventListener('mousemove', e => {
                const cardRect = card.getBoundingClientRect();
                const cardInner = card.querySelector('.tilt-card-inner');
                const cardShine = card.querySelector('.tilt-card-shine');
                
                // Calculate mouse position relative to card
                const x = e.clientX - cardRect.left;
                const y = e.clientY - cardRect.top;
                
                // Calculate rotation values
                const rotateY = ((x / cardRect.width) - 0.5) * 10; // Max 5 degrees
                const rotateX = ((y / cardRect.height) - 0.5) * -10; // Max 5 degrees
                
                // Apply transforms
                cardInner.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
                
                // Adjust shine effect
                cardShine.style.opacity = '0.2';
                cardShine.style.transform = `translateX(${(x / cardRect.width) * 100}%)`;
            });
            
            // Reset on mouse leave
            card.addEventListener('mouseleave', () => {
                const cardInner = card.querySelector('.tilt-card-inner');
                const cardShine = card.querySelector('.tilt-card-shine');
                
                cardInner.style.transform = 'rotateY(0deg) rotateX(0deg)';
                cardShine.style.opacity = '0';
            });
        });
    };
    
    /**
     * Parallax Effect
     * Creates a parallax scrolling effect for backgrounds
     */
    const initParallaxEffect = () => {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (parallaxElements.length === 0 || prefersReducedMotion) return;
        
        const handleParallax = () => {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.2;
                const offset = scrollTop * speed;
                
                element.style.transform = `translateY(${offset}px)`;
            });
        };
        
        window.addEventListener('scroll', handleParallax);
        handleParallax(); // Initial call
    };
    
    /**
     * Reveal Text Animation
     * Animates text reveal for headings when they enter the viewport
     */
    const initRevealText = () => {
        const revealElements = document.querySelectorAll('.reveal-text');
        
        if (revealElements.length === 0 || prefersReducedMotion) return;
        
        // If Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1
            });
            
            revealElements.forEach(element => {
                revealObserver.observe(element);
            });
        } else {
            // Fallback
            revealElements.forEach(element => {
                element.classList.add('animate');
            });
        }
    };
    
    /**
     * Image Filter Effects
     * Applies visual filters to images based on data attributes
     */
    const initImageFilters = () => {
        // Apply duotone effect
        const duotoneImages = document.querySelectorAll('[data-filter="duotone"]');
        duotoneImages.forEach(img => {
            if (!img.classList.contains('duotone-image')) {
                img.classList.add('duotone-image');
            }
        });
        
        // Apply grayscale hover effect
        const grayscaleImages = document.querySelectorAll('[data-filter="grayscale"]');
        grayscaleImages.forEach(img => {
            if (!img.classList.contains('grayscale-hover')) {
                img.classList.add('grayscale-hover');
            }
        });
        
        // Apply sharpen focus effect
        const sharpenImages = document.querySelectorAll('[data-filter="sharpen"]');
        sharpenImages.forEach(img => {
            if (!img.classList.contains('sharpen-focus')) {
                img.classList.add('sharpen-focus');
            }
        });
    };
    
    /**
     * Add texture overlays to sections
     */
    const addTextureOverlays = () => {
        const sectionsWithTexture = document.querySelectorAll('[data-texture]');
        
        sectionsWithTexture.forEach(section => {
            const textureType = section.dataset.texture;
            const textureOverlay = document.createElement('div');
            
            switch(textureType) {
                case 'noise':
                    textureOverlay.className = 'texture-overlay';
                    break;
                case 'dots':
                    textureOverlay.className = 'dot-pattern';
                    break;
                default:
                    textureOverlay.className = 'texture-overlay';
            }
            
            // Add overlay as first child to keep it behind content
            section.insertBefore(textureOverlay, section.firstChild);
        });
    };
    
    /**
     * Add section dividers
     */
    const addSectionDividers = () => {
        const sectionsWithDivider = document.querySelectorAll('[data-divider]');
        
        sectionsWithDivider.forEach(section => {
            const dividerType = section.dataset.divider;
            const dividerOverlay = document.createElement('div');
            
            switch(dividerType) {
                case 'wave':
                    dividerOverlay.className = 'wave-divider';
                    break;
                case 'diagonal':
                    dividerOverlay.className = 'diagonal-divider';
                    break;
                case 'wave-dark':
                    dividerOverlay.className = 'wave-divider dark';
                    break;
                case 'diagonal-dark':
                    dividerOverlay.className = 'diagonal-divider dark';
                    break;
                default:
                    dividerOverlay.className = 'wave-divider';
            }
            
            section.appendChild(dividerOverlay);
        });
    };
    
    /**
     * Apply text effects
     */
    const applyTextEffects = () => {
        // Apply gradient text effect
        const gradientTextElements = document.querySelectorAll('[data-text-effect="gradient"]');
        gradientTextElements.forEach(element => {
            if (!element.classList.contains('gradient-text')) {
                element.classList.add('gradient-text');
            }
        });
        
        // Apply alternate gradient
        const altGradientTextElements = document.querySelectorAll('[data-text-effect="gradient-alt"]');
        altGradientTextElements.forEach(element => {
            if (!element.classList.contains('gradient-text') || !element.classList.contains('alt')) {
                element.classList.add('gradient-text', 'alt');
            }
        });
        
        // Apply highlight text effect
        const highlightTextElements = document.querySelectorAll('[data-text-effect="highlight"]');
        highlightTextElements.forEach(element => {
            if (!element.classList.contains('highlight-text')) {
                element.classList.add('highlight-text');
            }
        });
        
        // Apply blur text effect
        const blurTextElements = document.querySelectorAll('[data-text-effect="blur"]');
        blurTextElements.forEach(element => {
            if (!element.classList.contains('blur-text')) {
                element.classList.add('blur-text');
            }
        });
    };
    
    /**
     * Apply glass morphism effect
     */
    const applyGlassMorphism = () => {
        const glassElements = document.querySelectorAll('[data-glass]');
        
        glassElements.forEach(element => {
            const glassType = element.dataset.glass;
            
            switch(glassType) {
                case 'light':
                    element.classList.add('glass-card');
                    break;
                case 'dark':
                    element.classList.add('glass-card', 'dark');
                    break;
                default:
                    element.classList.add('glass-card');
            }
        });
    };
    
    // Initialize all visual effects
    const init = () => {
        addTextureOverlays();
        addSectionDividers();
        initTiltEffect();
        initParallaxEffect();
        initRevealText();
        initImageFilters();
        applyTextEffects();
        applyGlassMorphism();
    };
    
    // Run initialization
    init();
});