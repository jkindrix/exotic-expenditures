// Main JavaScript file for Exotic Expenditures

document.addEventListener('DOMContentLoaded', () => {
    console.log('Exotic Expenditures website loaded');
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Navigation elements
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // Search functionality
    const searchToggle = document.getElementById('search-toggle');
    const searchForm = document.getElementById('search-form');
    const siteSearch = document.getElementById('siteSearch');
    
    // Toggle mobile menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.innerHTML = navMenu.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
            navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });
    }
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 992) {
                navMenu.classList.remove('active');
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // Toggle search form
    if (searchToggle && searchForm) {
        searchToggle.addEventListener('click', (e) => {
            e.preventDefault();
            searchForm.classList.toggle('active');
            if (searchForm.classList.contains('active')) {
                siteSearch.focus();
            }
        });
        
        // Close search form when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-search') && searchForm.classList.contains('active')) {
                searchForm.classList.remove('active');
            }
        });
        
        // Process search on enter key
        siteSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = siteSearch.value.trim();
                if (searchTerm) {
                    // For now, just redirect to the FAQ page with the search term
                    window.location.href = `faq.html?search=${encodeURIComponent(searchTerm)}`;
                }
            }
            
            // Close search on escape key
            if (e.key === 'Escape') {
                searchForm.classList.remove('active');
            }
        });
        
        // Search form submit button
        const searchSubmit = searchForm.querySelector('button[type="submit"]');
        if (searchSubmit) {
            searchSubmit.addEventListener('click', (e) => {
                e.preventDefault();
                const searchTerm = siteSearch.value.trim();
                if (searchTerm) {
                    window.location.href = `faq.html?search=${encodeURIComponent(searchTerm)}`;
                }
            });
        }
    }
    
    // Shrink navbar on scroll
    const shrinkNav = () => {
        if (window.scrollY > 100) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    };
    
    // Update active nav link based on scroll position
    const updateActiveNavLink = () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // 300px offset to trigger active state a bit earlier
            if (window.pageYOffset >= (sectionTop - 300)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Special case for home section
        if (window.pageYOffset < 300) {
            currentSection = 'home';
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' && currentSection === 'home') {
                link.classList.add('active');
            } else if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    };
    
    // Custom cursor effect
    const cursor = document.querySelector('.cursor');
    
    if (window.innerWidth > 991) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.opacity = '0.5';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.opacity = '1';
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            // Handle home link special case
            if (targetId === '#') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate offset considering fixed navbar
                const navHeight = mainNav.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight + 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Hero slideshow
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

    // Animation on scroll
    const animateOnScroll = () => {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
        const cards = document.querySelectorAll('.card');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.75) {
                section.classList.add('visible');
            }
        });
        
        // Animate new animation class elements
        animatedElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.85) {
                setTimeout(() => {
                    el.classList.add('active');
                }, 100 * Array.from(animatedElements).indexOf(el));
            }
        });
        
        // Maintain backward compatibility with old animation style
        cards.forEach(card => {
            // Skip cards that already use the new animation classes
            if (card.classList.contains('fade-in') || 
                card.classList.contains('slide-in-left') || 
                card.classList.contains('slide-in-right') || 
                card.classList.contains('scale-in')) {
                return;
            }
            
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (cardTop < windowHeight * 0.85) {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100 * Array.from(cards).indexOf(card));
            }
        });
        
        // Update navigation state
        shrinkNav();
        updateActiveNavLink();
    };
    
    // Animated stat counters
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
    
    // Initialize stat counters when visible
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(statsContainer);
    }
    
    // Set initial styles for animation, considering reduced motion preferences
    if (prefersReducedMotion) {
        // If user prefers reduced motion, skip animations
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
            el.classList.add('active');
        });
        
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    } else {
        // Set initial states for standard animations
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            // Skip cards that already use the new animation classes
            if (card.classList.contains('fade-in') || 
                card.classList.contains('slide-in-left') || 
                card.classList.contains('slide-in-right') || 
                card.classList.contains('scale-in')) {
                return;
            }
            
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
    }
    
    // Run animation on page load and scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // ===== INTERACTIVE ELEMENTS & FORMS =====
    
    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Expense Calculator
    const calculateBtn = document.getElementById('calculate-btn');
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            const adventureType = document.getElementById('adventure-type').value;
            const totalCost = parseFloat(document.getElementById('total-cost').value);
            const peopleCount = parseInt(document.getElementById('people-count').value);
            
            if (isNaN(totalCost) || isNaN(peopleCount) || peopleCount <= 0 || totalCost <= 0) {
                alert('Please enter valid numbers for cost and people count.');
                return;
            }
            
            // Calculate individual cost
            const individualCost = totalCost / peopleCount;
            
            // Calculate group savings (simplified model)
            let savingsPercentage;
            let savingsAmount;
            
            if (adventureType === 'trip') {
                savingsPercentage = 20 + (peopleCount * 2); // More people = more savings
                savingsPercentage = Math.min(savingsPercentage, 40); // Cap at 40%
            } else if (adventureType === 'experience') {
                savingsPercentage = 15 + (peopleCount * 1.5);
                savingsPercentage = Math.min(savingsPercentage, 35); // Cap at 35%
            } else { // rental
                savingsPercentage = 25 + (peopleCount * 2.5);
                savingsPercentage = Math.min(savingsPercentage, 50); // Cap at 50%
            }
            
            savingsAmount = (totalCost * savingsPercentage) / 100;
            
            // Update the results
            document.getElementById('individual-cost').textContent = `$${individualCost.toFixed(2)}`;
            document.getElementById('group-savings').textContent = `${savingsPercentage}% ($${savingsAmount.toFixed(2)})`;
            
            // Animate results
            const resultCards = document.querySelectorAll('.result-card');
            resultCards.forEach(card => {
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = 'fadeIn 0.5s';
                }, 10);
            });
        });
    }
    
    // Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Validate Name
            const nameInput = document.getElementById('name');
            if (!nameInput.value.trim()) {
                showError(nameInput, 'Name is required');
                isValid = false;
            } else {
                clearError(nameInput);
            }
            
            // Validate Email
            const emailInput = document.getElementById('email');
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError(emailInput);
            }
            
            // Validate Message
            const messageInput = document.getElementById('message');
            if (!messageInput.value.trim()) {
                showError(messageInput, 'Message is required');
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                showError(messageInput, 'Message must be at least 10 characters');
                isValid = false;
            } else {
                clearError(messageInput);
            }
            
            if (isValid) {
                // Simulate form submission (would be AJAX in production)
                contactForm.style.display = 'none';
                document.getElementById('form-success').style.display = 'block';
                
                // Reset form (for demo purposes we'll show the form again after 5 seconds)
                setTimeout(() => {
                    contactForm.reset();
                    contactForm.style.display = 'block';
                    document.getElementById('form-success').style.display = 'none';
                }, 5000);
            }
        });
    }
    
    // Newsletter Form Validation
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Validate Email
            const emailInput = document.getElementById('newsletter-email');
            if (!emailInput.value.trim()) {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError(emailInput);
            }
            
            if (isValid) {
                // Simulate form submission
                newsletterForm.style.display = 'none';
                document.getElementById('newsletter-success').style.display = 'block';
                
                // Reset form (for demo purposes)
                setTimeout(() => {
                    newsletterForm.reset();
                    newsletterForm.style.display = 'block';
                    document.getElementById('newsletter-success').style.display = 'none';
                }, 5000);
            }
        });
    }
    
    // Helper functions for form validation
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        
        input.classList.add('error');
        errorMessage.textContent = message;
    }
    
    function clearError(input) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        
        input.classList.remove('error');
        errorMessage.textContent = '';
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Adventure Map Interactions
    const mapPins = document.querySelectorAll('.map-pin');
    
    mapPins.forEach(pin => {
        pin.addEventListener('mouseenter', () => {
            // Add hover class to show tooltip
            pin.classList.add('hovered');
        });
        
        pin.addEventListener('mouseleave', () => {
            // Remove hover class
            pin.classList.remove('hovered');
        });
    });
    
    // Cookie consent
    const cookieConsent = document.querySelector('.cookie-consent');
    const acceptCookiesBtn = document.querySelector('.accept-cookies');
    const declineCookiesBtn = document.querySelector('.decline-cookies');
    
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookieConsent');
    
    if (!cookieChoice && cookieConsent) {
        // Show cookie consent after a short delay
        setTimeout(() => {
            cookieConsent.classList.add('active');
        }, 1000);
        
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieConsent.classList.remove('active');
        });
        
        declineCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieConsent.classList.remove('active');
        });
    }
    
    // ===== PAST ADVENTURES SECTION =====
    
    // Adventure filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const adventureItems = document.querySelectorAll('.adventure-item');
    
    if (filterButtons.length && adventureItems.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                
                // Filter items
                adventureItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    
                    if (filter === 'all' || filter === category) {
                        item.classList.add('fade-in');
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.classList.add('active');
                        }, 10);
                    } else {
                        item.classList.remove('active');
                        item.classList.remove('fade-in');
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Adventure lightbox functionality
    const viewButtons = document.querySelectorAll('.view-details');
    const lightbox = document.querySelector('.adventure-lightbox');
    const lightboxDetails = document.querySelector('.lightbox-details');
    const closeLightbox = document.querySelector('.close-lightbox');
    
    if (viewButtons.length && lightbox && lightboxDetails && closeLightbox) {
        // Adventure data (in a real application, this would come from a database)
        const adventureData = {
            'helicopter-camping': {
                title: 'Helicopter Mountain Camping',
                date: 'May 15-17, 2024',
                description: 'We chartered a private helicopter to take us to an exclusive camping spot at 8,000 feet elevation in the Rocky Mountains. The weekend included luxury camping accommodations, a private chef who prepared gourmet meals over an open fire, and guided hiking tours to pristine alpine lakes that few people ever get to see.',
                cost: '$4,200 per person',
                images: [
                    'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1465919292275-c60ba49da6ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                ],
                testimonial: 'The helicopter ride alone was worth the price! Seeing the sunset and sunrise from that elevation was an experience I'll never forget. - Sarah'
            },
            'zero-gravity': {
                title: 'Zero Gravity Flight',
                date: 'March 8, 2024',
                description: 'We booked a specialized aircraft that performs parabolic maneuvers to create 20-30 second periods of weightlessness. The flight included 15 parabolas, giving us approximately 8 minutes of total zero gravity experience - the same training environment used by astronauts. We floated, did somersaults in the air, and experienced what it feels like to be in space.',
                cost: '$5,800 per person',
                images: [
                    'https://images.unsplash.com/photo-1541417904950-b855846fe074?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1454789476662-53eb23ba5907?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                ],
                testimonial: 'I never thought I'd get to experience zero gravity without going to space. Absolutely mind-blowing! - David'
            },
            'chef-dinner': {
                title: 'Michelin Star Chef Dinner',
                date: 'February 14, 2024',
                description: 'We hired a renowned 3-Michelin star chef to create a custom 8-course tasting menu with wine pairings for our group. The experience took place in a private dining room with a view of the kitchen, allowing us to watch the master at work. Each course was explained personally by the chef, and the evening included rare wines not available to the general public.',
                cost: '$1,200 per person',
                images: [
                    'https://images.unsplash.com/photo-1563599175592-c58dc214deff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                ],
                testimonial: 'The food was art, the wine was divine, and having the chef explain each course made it educational as well as delicious. - Amara'
            },
            'private-island': {
                title: 'Private Island Getaway',
                date: 'December 10-17, 2023',
                description: 'We rented an entire private island in the Caribbean for a week. The island came with a staff of 8, including a chef, butler, housekeepers, and activities coordinator. We had complete privacy, a beautiful villa with 6 bedrooms, our own pristine beaches, and daily boat excursions for snorkeling and fishing.',
                cost: '$6,500 per person',
                images: [
                    'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1468413253725-0d5181091126?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                ],
                testimonial: 'I felt like a billionaire for a week. Having a whole island to ourselves was the ultimate luxury experience. - James'
            },
            'formula-one': {
                title: 'Formula 1 Driving Experience',
                date: 'October 5, 2023',
                description: 'We booked an exclusive Formula 1 driving experience at a professional racetrack. After a training session with professional drivers, each member of our group got to drive 20 laps in an actual F1 race car. The day also included a behind-the-scenes tour of the pit facilities, racing simulators, and a gourmet lunch with champagne.',
                cost: '$3,800 per person',
                images: [
                    'https://images.unsplash.com/photo-1672495630169-7c58f9471d8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1503945839639-aea48daa250f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                ],
                testimonial: 'The adrenaline rush was incredible. Controlling that much power and speed was both terrifying and exhilarating! - Marcus'
            },
            'wine-tour': {
                title: 'Private Winery Tour',
                date: 'September 20-24, 2023',
                description: 'We arranged a private tour of exclusive wineries in the Bordeaux region of France, including several estates that are not open to the public. We met with master winemakers, had private tastings of rare vintages, and even participated in the grape harvest and traditional foot pressing at one historic vineyard. Our accommodations were in a 16th-century chateau on a working vineyard.',
                cost: '$4,100 per person',
                images: [
                    'https://images.unsplash.com/photo-1615887588189-bacee4f8a033?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
                ],
                testimonial: 'Tasting wines that literally can't be bought anywhere, right where they're made, with the people who make them - priceless. - Elena'
            }
        };
        
        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const adventureId = button.getAttribute('data-adventure');
                const adventure = adventureData[adventureId];
                
                if (adventure) {
                    let content = `
                        <h2>${adventure.title}</h2>
                        <p class="adventure-date-large">${adventure.date}</p>
                        <div class="lightbox-gallery">
                    `;
                    
                    adventure.images.forEach(image => {
                        content += `<img src="${image}" alt="${adventure.title}">`;
                    });
                    
                    content += `
                        </div>
                        <div class="lightbox-info">
                            <p class="adventure-description">${adventure.description}</p>
                            <p class="adventure-cost"><strong>Cost:</strong> ${adventure.cost}</p>
                            <div class="adventure-testimonial">
                                <p class="testimonial-text">"${adventure.testimonial}"</p>
                            </div>
                        </div>
                    `;
                    
                    lightboxDetails.innerHTML = content;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                }
            });
        });
        
        closeLightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
        
        // Close lightbox when clicking outside the content
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // ===== UPCOMING EVENTS SECTION =====
    
    // Countdown timer for next event
    const countdownElement = {
        days: document.getElementById('countdown-days'),
        hours: document.getElementById('countdown-hours'),
        minutes: document.getElementById('countdown-minutes'),
        seconds: document.getElementById('countdown-seconds')
    };
    
    if (countdownElement.days && countdownElement.hours && countdownElement.minutes && countdownElement.seconds) {
        // Next event date (July 15, 2025)
        const nextEventDate = new Date('July 15, 2025 10:00:00').getTime();
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = nextEventDate - now;
            
            // Calculate time units
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Update the countdown
            countdownElement.days.textContent = days.toString().padStart(2, '0');
            countdownElement.hours.textContent = hours.toString().padStart(2, '0');
            countdownElement.minutes.textContent = minutes.toString().padStart(2, '0');
            countdownElement.seconds.textContent = seconds.toString().padStart(2, '0');
        }
        
        // Initial call and set interval
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // RSVP functionality
    const rsvpButtons = document.querySelectorAll('.rsvp-button');
    const rsvpModal = document.querySelector('.rsvp-modal');
    const closeRsvp = document.querySelector('.close-rsvp');
    const rsvpForm = document.getElementById('rsvp-form');
    const eventIdInput = document.getElementById('event-id');
    
    if (rsvpButtons.length && rsvpModal && closeRsvp && rsvpForm && eventIdInput) {
        rsvpButtons.forEach(button => {
            button.addEventListener('click', () => {
                const eventId = button.getAttribute('data-event');
                eventIdInput.value = eventId;
                
                rsvpModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
        });
        
        closeRsvp.addEventListener('click', () => {
            rsvpModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
        
        // Close modal when clicking outside the content
        rsvpModal.addEventListener('click', (e) => {
            if (e.target === rsvpModal) {
                rsvpModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Form submission
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // In a real application, this would send the form data to a server
            // For this demo, we'll just show a confirmation message
            const formData = new FormData(rsvpForm);
            let confirmationMessage = `
                <h3>Reservation Confirmed!</h3>
                <p class="confirmation-message">Thank you for your RSVP. We've sent a confirmation email to ${formData.get('email')} with all the details.</p>
                <p class="confirmation-message">We look forward to sharing this adventure with you!</p>
                <button class="close-confirmation">Close</button>
            `;
            
            const rsvpModalContent = document.querySelector('.rsvp-modal-content');
            rsvpModalContent.innerHTML = confirmationMessage;
            
            // Add event listener to close button
            document.querySelector('.close-confirmation').addEventListener('click', () => {
                rsvpModal.classList.remove('active');
                document.body.style.overflow = '';
                
                // Reset form after closing (for demo purposes)
                setTimeout(() => {
                    rsvpModalContent.innerHTML = `
                        <span class="close-rsvp">&times;</span>
                        <h3>Reserve Your Spot</h3>
                        <form id="rsvp-form">
                            <input type="hidden" id="event-id" name="event-id">
                            <div class="form-group">
                                <label for="name">Full Name</label>
                                <input type="text" id="name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="phone">Phone Number</label>
                                <input type="tel" id="phone" name="phone" required>
                            </div>
                            <div class="form-group">
                                <label for="guests">Number of Guests</label>
                                <select id="guests" name="guests">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="special-requests">Special Requests</label>
                                <textarea id="special-requests" name="special-requests"></textarea>
                            </div>
                            <button type="submit" class="submit-rsvp">Confirm Reservation</button>
                        </form>
                    `;
                    
                    // Re-initialize the form and close button
                    const newCloseBtn = document.querySelector('.close-rsvp');
                    const newRsvpForm = document.getElementById('rsvp-form');
                    
                    if (newCloseBtn) {
                        newCloseBtn.addEventListener('click', () => {
                            rsvpModal.classList.remove('active');
                            document.body.style.overflow = '';
                        });
                    }
                    
                    if (newRsvpForm) {
                        newRsvpForm.addEventListener('submit', (e) => e.preventDefault());
                    }
                }, 500);
            });
        });
    }
    
    // ===== TESTIMONIALS SECTION =====
    
    // Testimonial slider functionality
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevButton = document.querySelector('.testimonial-prev');
    const nextButton = document.querySelector('.testimonial-next');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    if (testimonialTrack && testimonialSlides.length && prevButton && nextButton && dots.length) {
        let currentSlide = 0;
        const slideCount = testimonialSlides.length;
        
        // Set up autoplay
        let autoplayInterval;
        
        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                goToSlide((currentSlide + 1) % slideCount);
            }, 5000); // Change slide every 5 seconds
        }
        
        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }
        
        function goToSlide(index) {
            testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentSlide = index;
        }
        
        // Event listeners
        prevButton.addEventListener('click', () => {
            stopAutoplay();
            goToSlide((currentSlide - 1 + slideCount) % slideCount);
            startAutoplay();
        });
        
        nextButton.addEventListener('click', () => {
            stopAutoplay();
            goToSlide((currentSlide + 1) % slideCount);
            startAutoplay();
        });
        
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                stopAutoplay();
                const index = parseInt(dot.getAttribute('data-index'));
                goToSlide(index);
                startAutoplay();
            });
        });
        
        // Touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        testimonialTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });
        
        testimonialTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoplay();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swiped left
                goToSlide((currentSlide + 1) % slideCount);
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swiped right
                goToSlide((currentSlide - 1 + slideCount) % slideCount);
            }
        }
        
        // Start autoplay
        startAutoplay();
    }

    // ===== CALCULATOR SECTION =====
    
    // Tabbed content functionality
    const calculatorTabs = document.querySelectorAll('.tab-button');
    const calculatorPanes = document.querySelectorAll('.tab-pane');
    
    if (calculatorTabs.length && calculatorPanes.length) {
        calculatorTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and panes
                calculatorTabs.forEach(t => t.classList.remove('active'));
                calculatorPanes.forEach(p => p.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding pane
                const targetId = tab.getAttribute('aria-controls');
                document.getElementById(targetId).classList.add('active');
                
                // Update ARIA attributes
                calculatorTabs.forEach(t => t.setAttribute('aria-selected', 'false'));
                tab.setAttribute('aria-selected', 'true');
            });
        });
    }
    
    // Expense Calculator functionality
    const experienceType = document.getElementById('experience-type');
    const groupSize = document.getElementById('group-size');
    const customCostGroup = document.getElementById('custom-cost-group');
    const customCost = document.getElementById('custom-cost');
    const contribution = document.getElementById('contribution');
    const calculateButton = document.getElementById('calculate-savings');
    
    if (experienceType && groupSize && customCostGroup && customCost && contribution && calculateButton) {
        // Show/hide custom cost field when experience type changes
        experienceType.addEventListener('change', () => {
            if (experienceType.value === 'custom') {
                customCostGroup.style.display = 'block';
            } else {
                customCostGroup.style.display = 'none';
            }
        });
        
        // Calculate savings when button is clicked
        calculateButton.addEventListener('click', () => {
            // Get adventure cost based on type
            let adventureCost;
            if (experienceType.value === 'custom') {
                adventureCost = parseInt(customCost.value);
            } else {
                // Predefined costs for each adventure type
                const costs = {
                    'helicopter': 8000,
                    'zerog': 12000,
                    'michelin': 4500,
                    'island': 15000
                };
                adventureCost = costs[experienceType.value];
            }
            
            // Get group size and monthly contribution
            const people = parseInt(groupSize.value);
            const monthlyContribution = parseInt(contribution.value);
            
            // Calculate individual cost without collective
            const individualCost = adventureCost;
            
            // Calculate cost with collective
            const collectiveCost = adventureCost / people;
            
            // Calculate months needed to fund
            const monthsNeeded = Math.ceil(collectiveCost / monthlyContribution);
            
            // Calculate savings percentage
            const savingsPercentage = Math.round(((individualCost - collectiveCost) / individualCost) * 100);
            
            // Update result values
            document.getElementById('total-cost').textContent = `$${adventureCost.toLocaleString()}`;
            document.getElementById('individual-cost').textContent = `$${individualCost.toLocaleString()}`;
            document.getElementById('collective-cost').textContent = `$${collectiveCost.toLocaleString()}`;
            document.getElementById('months-needed').textContent = monthsNeeded;
            document.getElementById('savings-percentage').textContent = `${savingsPercentage}%`;
            
            // Update savings bar
            document.querySelector('.savings-amount').style.width = `${savingsPercentage}%`;
            
            // Add animation effect to results
            const resultsContainer = document.querySelector('.calculator-results');
            resultsContainer.style.animation = 'none';
            // Trigger reflow
            void resultsContainer.offsetWidth;
            resultsContainer.style.animation = 'fadeIn 0.6s ease-out';
        });
    }
    
    // ===== NEWSLETTER & CONTACT FORMS =====
    
    // Newsletter form validation and submission
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterConfirmation = document.getElementById('newsletter-confirmation');
    const closeNewsletterConfirmation = document.getElementById('close-confirmation');
    
    if (newsletterForm && newsletterConfirmation && closeNewsletterConfirmation) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate email
            const emailInput = document.getElementById('newsletter-email');
            const emailError = document.getElementById('email-error');
            
            // Basic email validation
            if (!emailInput.value.trim()) {
                emailInput.parentElement.classList.add('error');
                emailError.textContent = 'Email address is required';
                emailError.style.display = 'block';
                return;
            } else if (!isValidEmail(emailInput.value)) {
                emailInput.parentElement.classList.add('error');
                emailError.textContent = 'Please enter a valid email address';
                emailError.style.display = 'block';
                return;
            } else {
                emailInput.parentElement.classList.remove('error');
                emailError.style.display = 'none';
            }
            
            // Simulate form submission (would be AJAX in production)
            newsletterConfirmation.setAttribute('aria-hidden', 'false');
            newsletterConfirmation.classList.add('active');
            
            // Clear form
            newsletterForm.reset();
        });
        
        // Close confirmation dialog
        closeNewsletterConfirmation.addEventListener('click', () => {
            newsletterConfirmation.classList.remove('active');
            newsletterConfirmation.setAttribute('aria-hidden', 'true');
        });
    }
    
    // Contact form validation and submission
    const contactForm = document.getElementById('contact-form');
    const contactConfirmation = document.getElementById('contact-confirmation');
    const closeContactConfirmation = document.getElementById('close-contact-confirmation');
    
    if (contactForm && contactConfirmation && closeContactConfirmation) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            
            // Validate name
            const nameInput = document.getElementById('contact-name');
            const nameError = document.getElementById('name-error');
            if (!nameInput.value.trim()) {
                nameInput.parentElement.classList.add('error');
                nameError.textContent = 'Name is required';
                nameError.style.display = 'block';
                isValid = false;
            } else {
                nameInput.parentElement.classList.remove('error');
                nameError.style.display = 'none';
            }
            
            // Validate email
            const emailInput = document.getElementById('contact-email');
            const emailError = document.getElementById('contact-email-error');
            if (!emailInput.value.trim()) {
                emailInput.parentElement.classList.add('error');
                emailError.textContent = 'Email address is required';
                emailError.style.display = 'block';
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                emailInput.parentElement.classList.add('error');
                emailError.textContent = 'Please enter a valid email address';
                emailError.style.display = 'block';
                isValid = false;
            } else {
                emailInput.parentElement.classList.remove('error');
                emailError.style.display = 'none';
            }
            
            // Validate message
            const messageInput = document.getElementById('contact-message');
            const messageError = document.getElementById('message-error');
            if (!messageInput.value.trim()) {
                messageInput.parentElement.classList.add('error');
                messageError.textContent = 'Message is required';
                messageError.style.display = 'block';
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                messageInput.parentElement.classList.add('error');
                messageError.textContent = 'Message must be at least 10 characters';
                messageError.style.display = 'block';
                isValid = false;
            } else {
                messageInput.parentElement.classList.remove('error');
                messageError.style.display = 'none';
            }
            
            // Validate privacy consent
            const privacyConsent = document.getElementById('privacy-consent');
            const privacyError = document.getElementById('privacy-error');
            if (!privacyConsent.checked) {
                privacyConsent.parentElement.classList.add('error');
                privacyError.textContent = 'You must agree to the privacy policy';
                privacyError.style.display = 'block';
                isValid = false;
            } else {
                privacyConsent.parentElement.classList.remove('error');
                privacyError.style.display = 'none';
            }
            
            if (isValid) {
                // Simulate form submission (would be AJAX in production)
                contactConfirmation.classList.add('active');
                contactConfirmation.style.display = 'block';
                
                // Clear form
                contactForm.reset();
            }
        });
        
        // Close confirmation message
        if (closeContactConfirmation) {
            closeContactConfirmation.addEventListener('click', () => {
                contactConfirmation.classList.remove('active');
                contactConfirmation.style.display = 'none';
            });
        }
    }
    
    // Email validation helper function
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});