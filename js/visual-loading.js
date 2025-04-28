/**
 * Visual Loading Effects - Agent 5
 * Implements loading animations, lazy loading, and smooth transitions for Exotic Expenditures website
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    /**
     * Page Loading Animation
     * Shows a loading screen until all critical content is loaded
     */
    const initPageLoading = () => {
        const pageTransition = document.createElement('div');
        pageTransition.className = 'page-transition';
        
        // Skip animation for reduced motion preference
        if (prefersReducedMotion) {
            pageTransition.style.display = 'none';
            return;
        }
        
        const loadingLogo = document.createElement('div');
        loadingLogo.className = 'loading-logo';
        
        const loadingBar = document.createElement('div');
        loadingBar.className = 'loading-bar';
        
        const loadingProgress = document.createElement('div');
        loadingProgress.className = 'loading-progress';
        
        loadingBar.appendChild(loadingProgress);
        pageTransition.appendChild(loadingLogo);
        pageTransition.appendChild(loadingBar);
        
        document.body.appendChild(pageTransition);
        
        // Simulate loading progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 100) progress = 100;
            
            loadingProgress.style.width = `${progress}%`;
            
            if (progress === 100) {
                clearInterval(interval);
                
                // Wait a bit before removing the loading screen
                setTimeout(() => {
                    pageTransition.classList.add('loaded');
                    
                    // Remove from DOM after animation completes
                    setTimeout(() => {
                        pageTransition.remove();
                    }, 1000);
                }, 500);
            }
        }, 200);
    };
    
    /**
     * Lazy Loading Images
     * Handles loading images only when they're about to enter the viewport
     */
    const initLazyLoading = () => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (lazyImages.length === 0) return;
        
        const lazyLoadImage = (image) => {
            if (!image.dataset.src) return;
            
            // Create wrapper if not already wrapped
            if (!image.parentElement.classList.contains('lazy-load-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'lazy-load-wrapper';
                image.parentNode.insertBefore(wrapper, image);
                wrapper.appendChild(image);
            }
            
            // Add lazy-image class if not present
            if (!image.classList.contains('lazy-image')) {
                image.classList.add('lazy-image');
            }
            
            const img = new Image();
            
            img.onload = () => {
                image.src = image.dataset.src;
                image.classList.add('loaded');
                image.parentElement.classList.add('loaded');
                delete image.dataset.src;
            };
            
            img.src = image.dataset.src;
        };
        
        // If Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        lazyLoadImage(entry.target);
                        lazyImageObserver.unobserve(entry.target);
                    }
                });
            });
            
            lazyImages.forEach(image => {
                lazyImageObserver.observe(image);
            });
        } else {
            // Fallback for browsers that don't support Intersection Observer
            lazyImages.forEach(image => {
                lazyLoadImage(image);
            });
        }
    };
    
    /**
     * Section Transitions
     * Animates sections as they enter the viewport
     */
    const initSectionTransitions = () => {
        const sections = document.querySelectorAll('section');
        
        if (sections.length === 0 || prefersReducedMotion) return;
        
        sections.forEach(section => {
            section.classList.add('section-entering');
        });
        
        // If Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('section-visible');
                        sectionObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1
            });
            
            sections.forEach(section => {
                sectionObserver.observe(section);
            });
        } else {
            // Fallback for browsers that don't support Intersection Observer
            sections.forEach(section => {
                section.classList.add('section-visible');
            });
        }
    };
    
    /**
     * Add skeleton loading screens for content
     * Simulates content layout while actual content is loading
     */
    const addSkeletonLoaders = () => {
        // Skip for reduced motion preference
        if (prefersReducedMotion) return;
        
        // Example - replace with actual implementation based on page structure
        const addAdventureSkeletons = () => {
            const adventuresGrid = document.querySelector('.adventures-grid');
            if (!adventuresGrid) return;
            
            // Check if content is already loaded
            if (adventuresGrid.children.length > 0) return;
            
            // Add skeleton loaders
            for (let i = 0; i < 6; i++) {
                const skeleton = document.createElement('div');
                skeleton.className = 'adventure-item skeleton-loading skeleton-card';
                adventuresGrid.appendChild(skeleton);
            }
        };
        
        const addTestimonialSkeletons = () => {
            const testimonialTrack = document.querySelector('.testimonial-track');
            if (!testimonialTrack) return;
            
            // Check if content is already loaded
            if (testimonialTrack.children.length > 0) return;
            
            // Add skeleton loaders
            for (let i = 0; i < 3; i++) {
                const skeleton = document.createElement('div');
                skeleton.className = 'testimonial-slide';
                skeleton.innerHTML = `
                    <div class="testimonial-content">
                        <div class="skeleton-loading skeleton-circle"></div>
                        <div class="testimonial-quote">
                            <div class="skeleton-loading skeleton-text"></div>
                            <div class="skeleton-loading skeleton-text"></div>
                            <div class="skeleton-loading skeleton-text"></div>
                        </div>
                    </div>
                `;
                testimonialTrack.appendChild(skeleton);
            }
        };
        
        // Add skeletons for various sections
        addAdventureSkeletons();
        addTestimonialSkeletons();
        
        // Remove skeletons after a timeout
        setTimeout(() => {
            document.querySelectorAll('.skeleton-loading').forEach(skeleton => {
                skeleton.style.opacity = 0;
                setTimeout(() => {
                    if (skeleton.parentNode) {
                        skeleton.parentNode.removeChild(skeleton);
                    }
                }, 500);
            });
        }, 1500);
    };
    
    // Convert existing images to lazy load format
    const convertToLazyImages = () => {
        const images = document.querySelectorAll('img:not([data-src])');
        
        images.forEach(img => {
            // Skip images that already have data-src, small icons, or SVGs
            if (img.dataset.src || 
                img.src.includes('data:image') ||
                img.src.includes('.svg') ||
                img.naturalWidth < 50) {
                return;
            }
            
            // Only process images that are below the fold
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                return;
            }
            
            // Set data-src and replace src with placeholder
            img.dataset.src = img.src;
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
            img.classList.add('lazy-image');
            
            // Wrap in lazy-load-wrapper if not already wrapped
            if (!img.parentElement.classList.contains('lazy-load-wrapper')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'lazy-load-wrapper';
                img.parentNode.insertBefore(wrapper, img);
                wrapper.appendChild(img);
            }
        });
    };
    
    // Initialize all visual loading features
    const init = () => {
        initPageLoading();
        convertToLazyImages();
        initLazyLoading();
        initSectionTransitions();
        addSkeletonLoaders();
    };
    
    // Run initialization
    init();
});