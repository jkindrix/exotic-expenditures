/**
 * Enhanced Visual Animations - Agent 5
 * Adds rich animations and visual enhancements to the Exotic Expenditures website
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Hero slideshow functionality
    const initSlideshow = () => {
        const slides = document.querySelectorAll('.hero-slide');
        if (slides.length === 0) return;
        
        let currentSlide = 0;
        
        const showSlide = (index) => {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
        };
        
        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        };
        
        // Only run slideshow if user doesn't prefer reduced motion
        if (!prefersReducedMotion) {
            setInterval(nextSlide, 5000);
        }
    };
    
    // Initialize slideshow
    initSlideshow();
    
    // Animated statistics counter
    const animateStats = () => {
        const stats = document.querySelectorAll('.stat-value');
        if (stats.length === 0) return;
        
        stats.forEach(stat => {
            const targetValue = parseInt(stat.getAttribute('data-value'));
            if (isNaN(targetValue)) return;
            
            // If reduced motion is preferred, just set the value directly
            if (prefersReducedMotion) {
                stat.textContent = targetValue;
                return;
            }
            
            const duration = 2000; // ms
            const frameDuration = 1000 / 60; // 60fps
            const totalFrames = Math.round(duration / frameDuration);
            let frame = 0;
            
            const counter = setInterval(() => {
                frame++;
                const progress = frame / totalFrames;
                const currentValue = Math.round(targetValue * progress);
                
                stat.textContent = currentValue;
                
                if (frame === totalFrames) {
                    clearInterval(counter);
                }
            }, frameDuration);
        });
    };
    
    // Testimonial slider enhancements
    const enhanceTestimonialSlider = () => {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.testimonial-dot');
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');
        
        if (slides.length === 0) return;
        
        let currentSlide = 0;
        
        const showSlide = (index) => {
            slides.forEach(slide => {
                slide.classList.remove('active');
                slide.setAttribute('aria-hidden', 'true');
            });
            
            dots.forEach(dot => {
                dot.classList.remove('active');
                dot.setAttribute('aria-selected', 'false');
            });
            
            slides[index].classList.add('active');
            slides[index].setAttribute('aria-hidden', 'false');
            dots[index].classList.add('active');
            dots[index].setAttribute('aria-selected', 'true');
        };
        
        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        };
        
        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        };
        
        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
        
        // Auto rotation if not reduced motion
        if (!prefersReducedMotion) {
            const interval = setInterval(nextSlide, 8000);
            
            // Pause on hover or focus
            const sliderRegion = document.querySelector('.testimonial-slider');
            if (sliderRegion) {
                sliderRegion.addEventListener('mouseenter', () => clearInterval(interval));
                sliderRegion.addEventListener('focusin', () => clearInterval(interval));
            }
        }
    };
    
    // Adventure filter functionality
    const initAdventureFilters = () => {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const adventureItems = document.querySelectorAll('.adventure-item');
        
        if (filterButtons.length === 0 || adventureItems.length === 0) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                
                button.classList.add('active');
                button.setAttribute('aria-selected', 'true');
                
                const filter = button.getAttribute('data-filter');
                
                adventureItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        
                        // Add staggered animation
                        setTimeout(() => {
                            item.classList.add('fade-in');
                            item.classList.add('active');
                        }, 100 * Array.from(adventureItems).indexOf(item));
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('active');
                    }
                });
            });
        });
    };
    
    // Countdown timer functionality
    const initCountdown = () => {
        const daysEl = document.getElementById('countdown-days');
        const hoursEl = document.getElementById('countdown-hours');
        const minutesEl = document.getElementById('countdown-minutes');
        const secondsEl = document.getElementById('countdown-seconds');
        
        if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
        
        // Set target date to July 15, 2025
        const targetDate = new Date('July 15, 2025 00:00:00').getTime();
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            // Calculate time
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Update UI
            daysEl.textContent = days.toString().padStart(2, '0');
            hoursEl.textContent = hours.toString().padStart(2, '0');
            minutesEl.textContent = minutes.toString().padStart(2, '0');
            secondsEl.textContent = seconds.toString().padStart(2, '0');
            
            // Set ARIA value for accessibility
            const countdownEl = document.querySelector('[role="timer"]');
            if (countdownEl) {
                countdownEl.setAttribute('aria-label', `Countdown to next adventure: ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds remaining`);
            }
        };
        
        // Update the countdown every second
        updateCountdown();
        setInterval(updateCountdown, 1000);
    };
    
    // Enhanced scroll animations
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
        
        if (prefersReducedMotion) {
            // If user prefers reduced motion, skip animations
            animatedElements.forEach(el => {
                el.classList.add('active');
            });
            return;
        }
        
        const handleScroll = () => {
            animatedElements.forEach(el => {
                const elementTop = el.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight * 0.85) {
                    el.classList.add('active');
                }
            });
            
            // Check if stats section is visible to start counter animation
            const statsContainer = document.querySelector('.stats-container');
            if (statsContainer) {
                const statsTop = statsContainer.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (statsTop < windowHeight * 0.85 && !statsContainer.classList.contains('animated')) {
                    statsContainer.classList.add('animated');
                    animateStats();
                }
            }
        };
        
        // Run once on page load and then on scroll
        handleScroll();
        window.addEventListener('scroll', handleScroll);
    };
    
    // Run all functions
    initScrollAnimations();
    enhanceTestimonialSlider();
    initAdventureFilters();
    initCountdown();
});