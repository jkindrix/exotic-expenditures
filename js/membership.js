// Membership functionality for Exotic Expenditures

document.addEventListener('DOMContentLoaded', () => {
    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.benefit-item, .responsibility-item, .intro-card, .adventure-card, .timeline-step');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('animated');
            }
        });
    };
    
    // Add animated class for CSS transitions
    const addAnimatedClass = () => {
        const elements = document.querySelectorAll('.benefit-item, .responsibility-item, .intro-card, .adventure-card, .timeline-step');
        elements.forEach(element => {
            element.classList.add('to-animate');
        });
    };
    
    // Initialize animations
    addAnimatedClass();
    window.addEventListener('scroll', animateOnScroll);
    // Run once on load to animate elements already in view
    setTimeout(animateOnScroll, 100);
    
    // Smooth scroll for anchor links
    const smoothScrollToAnchor = () => {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                
                // Skip if it's just "#"
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    const headerOffset = 100; // Adjust based on your fixed header height
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };
    
    smoothScrollToAnchor();
    
    // Multi-step form handling
    const membershipForm = document.getElementById('membershipForm');
    
    if (membershipForm) {
        // Form steps navigation
        const formSteps = membershipForm.querySelectorAll('.form-step');
        const nextButtons = membershipForm.querySelectorAll('.next-button');
        const prevButtons = membershipForm.querySelectorAll('.prev-button');
        const stepIndicators = membershipForm.querySelectorAll('.step-indicator');
        const progressIndicator = document.getElementById('progressIndicator');
        
        let currentStep = 0;
        
        // Functions for multi-step form
        const updateProgressBar = (stepIndex) => {
            const progress = (stepIndex / (formSteps.length - 1)) * 100;
            progressIndicator.style.width = `${progress}%`;
        };
        
        const goToStep = (stepIndex) => {
            // Hide all steps
            formSteps.forEach((step, index) => {
                step.classList.remove('active');
                stepIndicators[index].classList.remove('active');
                stepIndicators[index].classList.remove('completed');
                
                // Mark previous steps as completed
                if (index < stepIndex) {
                    stepIndicators[index].classList.add('completed');
                }
            });
            
            // Show current step
            formSteps[stepIndex].classList.add('active');
            stepIndicators[stepIndex].classList.add('active');
            
            // Update progress bar
            updateProgressBar(stepIndex);
            
            // Scroll to top of form for better UX
            membershipForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            currentStep = stepIndex;
        };
        
        // Validation functions
        const validateEmail = (email) => {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        };
        
        const validatePhone = (phone) => {
            // Basic phone validation - allows various formats
            const re = /^[\d\s\+\-\(\)]{10,20}$/;
            return re.test(String(phone));
        };
        
        const showError = (field, message) => {
            field.classList.add('error');
            
            // Remove any existing error message
            const existingError = field.parentElement.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            // Create and append error message
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            
            // Insert after help-text if it exists, otherwise after the field
            const helpText = field.parentElement.querySelector('.help-text');
            if (helpText) {
                helpText.after(errorElement);
            } else {
                field.after(errorElement);
            }
        };
        
        const clearError = (field) => {
            field.classList.remove('error');
            const errorMessage = field.parentElement.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        };
        
        // Validation for each step
        const validateStep = (stepIndex) => {
            let isValid = true;
            
            // Step 1 validation: Personal Info
            if (stepIndex === 0) {
                // Validate name
                const nameField = document.getElementById('name');
                if (!nameField.value.trim()) {
                    showError(nameField, 'Please enter your full name');
                    isValid = false;
                } else if (nameField.value.trim().length < 3) {
                    showError(nameField, 'Name must be at least 3 characters');
                    isValid = false;
                } else {
                    clearError(nameField);
                }
                
                // Validate email
                const emailField = document.getElementById('email');
                if (!emailField.value.trim()) {
                    showError(emailField, 'Please enter your email address');
                    isValid = false;
                } else if (!validateEmail(emailField.value.trim())) {
                    showError(emailField, 'Please enter a valid email address');
                    isValid = false;
                } else {
                    clearError(emailField);
                }
                
                // Validate phone
                const phoneField = document.getElementById('phone');
                if (!phoneField.value.trim()) {
                    showError(phoneField, 'Please enter your phone number');
                    isValid = false;
                } else if (!validatePhone(phoneField.value.trim())) {
                    showError(phoneField, 'Please enter a valid phone number');
                    isValid = false;
                } else {
                    clearError(phoneField);
                }
                
                // Validate location
                const locationField = document.getElementById('location');
                if (!locationField.value.trim()) {
                    showError(locationField, 'Please enter your city and state');
                    isValid = false;
                } else {
                    clearError(locationField);
                }
            }
            
            // Step 2 validation: Experience and Interests
            else if (stepIndex === 1) {
                // Validate why join
                const whyJoinField = document.getElementById('why-join');
                if (!whyJoinField.value.trim()) {
                    showError(whyJoinField, 'Please tell us why you want to join');
                    isValid = false;
                } else if (whyJoinField.value.trim().length < 50) {
                    showError(whyJoinField, 'Please provide a more detailed response (at least 50 characters)');
                    isValid = false;
                } else {
                    clearError(whyJoinField);
                }
                
                // Validate dream experience
                const dreamExpField = document.getElementById('dream-experience');
                if (!dreamExpField.value.trim()) {
                    showError(dreamExpField, 'Please describe a dream experience');
                    isValid = false;
                } else if (dreamExpField.value.trim().length < 50) {
                    showError(dreamExpField, 'Please provide a more detailed description (at least 50 characters)');
                    isValid = false;
                } else {
                    clearError(dreamExpField);
                }
            }
            
            // Step 3 validation: Preferences
            else if (stepIndex === 2) {
                // Validate at least one interest is selected
                const interestChecks = document.querySelectorAll('input[name="interests"]:checked');
                if (interestChecks.length === 0) {
                    const interestSection = document.querySelector('.interest-selection');
                    showError(interestSection, 'Please select at least one interest');
                    isValid = false;
                }
                
                // Validate budget range
                const budgetField = document.getElementById('budget-range');
                if (!budgetField.value) {
                    showError(budgetField, 'Please select your budget range');
                    isValid = false;
                } else {
                    clearError(budgetField);
                }
                
                // Validate availability
                const availabilityField = document.getElementById('availability');
                if (!availabilityField.value) {
                    showError(availabilityField, 'Please select your availability');
                    isValid = false;
                } else {
                    clearError(availabilityField);
                }
            }
            
            // Step 4 validation: Confirmation
            else if (stepIndex === 3) {
                // Validate checkbox
                const commitmentCheck = document.getElementById('commitment');
                if (!commitmentCheck.checked) {
                    showError(commitmentCheck, 'You must acknowledge the financial commitment');
                    isValid = false;
                } else {
                    clearError(commitmentCheck);
                }
                
                const participationCheck = document.getElementById('participation');
                if (!participationCheck.checked) {
                    showError(participationCheck, 'You must commit to active participation');
                    isValid = false;
                } else {
                    clearError(participationCheck);
                }
                
                const valuesCheck = document.getElementById('values');
                if (!valuesCheck.checked) {
                    showError(valuesCheck, 'You must embrace our collective values');
                    isValid = false;
                } else {
                    clearError(valuesCheck);
                }
            }
            
            return isValid;
        };
        
        // Set up next button click handlers
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (validateStep(currentStep)) {
                    goToStep(currentStep + 1);
                }
            });
        });
        
        // Set up previous button click handlers
        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                goToStep(currentStep - 1);
            });
        });
        
        // Set up step indicator click handlers
        stepIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                // Only allow clicking on completed steps or the next immediate step
                if (index <= currentStep + 1) {
                    if (index > currentStep && !validateStep(currentStep)) {
                        return; // Don't proceed if current step isn't valid
                    }
                    goToStep(index);
                }
            });
        });
        
        // Form submission handler
        membershipForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateStep(currentStep)) {
                // Enhanced success message
                membershipForm.innerHTML = `
                    <div class="form-success">
                        <i class="fas fa-check-circle"></i>
                        <h3>Application Received!</h3>
                        <p>Thank you for your interest in Exotic Expenditures. We've received your application and will review it during our next monthly meeting on May 1st, 2025.</p>
                        <p>If selected for further consideration, you'll be contacted within 2-3 weeks to arrange a guest experience at an upcoming event.</p>
                        <p>In the meantime, feel free to explore our <a href="faq.html">FAQ section</a> to learn more about how our collective works.</p>
                    </div>
                `;
                
                // Scroll to the success message with slight delay for better UX
                setTimeout(() => {
                    membershipForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
                
                // Analytics tracking would go here in a real application
                console.log('Membership application submitted successfully');
            }
        });
        
        // Real-time validation on blur
        const validateOnBlur = () => {
            const fields = {
                'name': { validate: (val) => val.trim().length >= 3, message: 'Name must be at least 3 characters' },
                'email': { validate: validateEmail, message: 'Please enter a valid email address' },
                'phone': { validate: validatePhone, message: 'Please enter a valid phone number' },
                'location': { validate: (val) => val.trim().length > 0, message: 'Please enter your city and state' },
                'why-join': { validate: (val) => val.trim().length >= 50, message: 'Please provide a more detailed response' },
                'dream-experience': { validate: (val) => val.trim().length >= 50, message: 'Please provide a more detailed description' }
            };
            
            Object.keys(fields).forEach(fieldId => {
                const field = document.getElementById(fieldId);
                
                if (field) {
                    field.addEventListener('blur', () => {
                        if (field.value.trim()) {
                            if (!fields[fieldId].validate(field.value)) {
                                showError(field, fields[fieldId].message);
                            } else {
                                clearError(field);
                            }
                        }
                    });
                }
            });
        };
        
        validateOnBlur();
        
        // Clear error state on input focus
        const formInputs = membershipForm.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                clearError(input);
            });
        });
        
        // Handle interest checkboxes error clearing
        const interestCheckboxes = document.querySelectorAll('input[name="interests"]');
        interestCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const interestSection = document.querySelector('.interest-selection');
                clearError(interestSection);
            });
        });
        
        // Initialize form at first step
        goToStep(0);
    }
    
    // Adventure card hover effects
    const adventureCards = document.querySelectorAll('.adventure-card');
    adventureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('.adventure-image').style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('.adventure-image').style.transform = 'scale(1)';
        });
    });
    
    // Mobile menu toggle for membership page
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Cookie consent for membership page
    const cookieConsent = document.querySelector('.cookie-consent');
    const acceptCookiesBtn = document.querySelector('.accept-cookies');
    const declineCookiesBtn = document.querySelector('.decline-cookies');
    
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookieConsent');
    
    if (!cookieChoice && cookieConsent) {
        // Show after a slight delay for better UX
        setTimeout(() => {
            cookieConsent.classList.add('active');
        }, 1500);
        
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieConsent.classList.remove('active');
        });
        
        declineCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieConsent.classList.remove('active');
        });
    }
    
    // Add CSS animation class
    document.querySelectorAll('.benefit-item, .responsibility-item, .intro-card').forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animated');
        }, 100 * index);
    });
});