// Membership functionality for Exotic Expenditures

document.addEventListener('DOMContentLoaded', () => {
    // Membership form handling
    const membershipForm = document.getElementById('membershipForm');
    
    if (membershipForm) {
        membershipForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Form validation
            let isValid = true;
            const requiredFields = membershipForm.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (isValid) {
                // In a real application, you would send this data to your server
                // For demonstration, we'll show a success message
                membershipForm.innerHTML = `
                    <div class="form-success">
                        <i class="fas fa-check-circle"></i>
                        <h3>Application Received!</h3>
                        <p>Thank you for your interest in Exotic Expenditures. We've received your application and will review it during our next monthly meeting.</p>
                        <p>If selected for further consideration, you'll be contacted within 2-3 weeks.</p>
                    </div>
                `;
                
                // Scroll to the success message
                membershipForm.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        // Clear error state on input
        const formInputs = membershipForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.classList.remove('error');
                }
            });
        });
    }
    
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
        cookieConsent.classList.add('active');
        
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieConsent.classList.remove('active');
        });
        
        declineCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieConsent.classList.remove('active');
        });
    }
});