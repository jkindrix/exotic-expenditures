// FAQ functionality for Exotic Expenditures

document.addEventListener('DOMContentLoaded', () => {
    // Check for search parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    
    // If there's a search parameter, focus on search and trigger search
    if (searchParam) {
        const faqSearch = document.getElementById('faqSearch');
        if (faqSearch) {
            faqSearch.value = searchParam;
            faqSearch.focus();
            // Trigger the input event to perform the search
            faqSearch.dispatchEvent(new Event('input'));
            
            // Scroll to search results area
            document.querySelector('.faq-search').scrollIntoView({ behavior: 'smooth' });
        }
    }
    // Toggle FAQ question/answer
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            // Toggle active class on the parent item
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Optional: close other open FAQs
            document.querySelectorAll('.faq-item.active').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    const icon = item.querySelector('.toggle-icon i');
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                }
            });
            
            // Toggle the clicked FAQ
            faqItem.classList.toggle('active');
            
            // Change the icon
            const icon = question.querySelector('.toggle-icon i');
            if (isActive) {
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            } else {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            }
        });
    });
    
    // Category filtering
    const categoryButtons = document.querySelectorAll('.category-button');
    const faqItems = document.querySelectorAll('.faq-item');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get the category to filter by
            const category = button.getAttribute('data-category');
            
            // Show/hide FAQ items based on category
            faqItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Mobile menu toggle for FAQ page
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Search functionality
    const faqSearch = document.getElementById('faqSearch');
    
    if (faqSearch) {
        faqSearch.addEventListener('input', () => {
            const searchTerm = faqSearch.value.toLowerCase().trim();
            const faqItems = document.querySelectorAll('.faq-item');
            
            if (searchTerm === '') {
                // If search is empty, restore category filtering
                const activeCategory = document.querySelector('.category-button.active');
                if (activeCategory) {
                    activeCategory.click();
                } else {
                    // Show all if no category is active
                    faqItems.forEach(item => {
                        item.style.display = 'block';
                    });
                }
                return;
            }
            
            // Reset category buttons
            document.querySelectorAll('.category-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            let resultsFound = false;
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = 'block';
                    
                    // Highlight the match
                    const questionText = item.querySelector('.faq-question h3');
                    const originalText = questionText.textContent;
                    
                    // Add a visual indicator that this is a search result
                    item.classList.add('search-result');
                    
                    // Auto-expand items that match the search
                    if (!item.classList.contains('active')) {
                        item.classList.add('active');
                        const icon = item.querySelector('.toggle-icon i');
                        icon.classList.remove('fa-plus');
                        icon.classList.add('fa-minus');
                    }
                    
                    resultsFound = true;
                } else {
                    item.style.display = 'none';
                    item.classList.remove('search-result');
                }
            });
            
            // Update search help text based on results
            const searchHelp = document.querySelector('.search-help');
            if (searchHelp) {
                if (resultsFound) {
                    searchHelp.textContent = `Showing results for "${searchTerm}"`;
                    searchHelp.classList.remove('no-results');
                } else {
                    searchHelp.textContent = `No results found for "${searchTerm}". Try different keywords.`;
                    searchHelp.classList.add('no-results');
                }
            }
        });
        
        // Add keyboard focus handling
        faqSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                faqSearch.value = '';
                // Trigger the input event to reset the view
                faqSearch.dispatchEvent(new Event('input'));
                faqSearch.blur();
            }
        });
    }
    
    // Add animations for FAQ items
    const animateFaqItems = () => {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animated');
            }, 100 * index);
        });
    };
    
    // Run animation on page load
    animateFaqItems();
    
    // Cookie consent for FAQ page
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