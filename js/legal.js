// JavaScript for legal pages (privacy policy, terms of service)

document.addEventListener('DOMContentLoaded', () => {
    // Back to top button functionality
    const backToTopButton = document.querySelector('.legal-back-to-top');
    
    if (backToTopButton) {
        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top when button is clicked
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Add active class to navigation links when scrolling to sections
    const legalSections = document.querySelectorAll('.legal-section');
    const navLinks = document.querySelectorAll('.legal-navigation a');
    
    if (legalSections.length > 0 && navLinks.length > 0) {
        const activateNavLink = () => {
            const scrollPosition = window.scrollY;
            
            legalSections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                const sectionBottom = sectionTop + section.offsetHeight;
                const sectionId = section.id;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        };
        
        window.addEventListener('scroll', activateNavLink);
        
        // Also run on initial load
        activateNavLink();
    }
    
    // PDF download functionality (would normally generate a proper PDF)
    const downloadPdfButton = document.getElementById('download-pdf');
    
    if (downloadPdfButton) {
        downloadPdfButton.addEventListener('click', () => {
            // In a real implementation, this would generate a PDF
            // For demo purposes, we'll just show an alert
            alert('In a production environment, this would generate and download a PDF of this document.');
        });
    }
    
    // Highlight navigation links when clicked
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Scroll to section
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add highlight to important sections
    const addLegalHighlights = () => {
        // Look for sections or elements that should be highlighted
        // For demo purposes, let's highlight elements containing key phrases
        const allParagraphs = document.querySelectorAll('.legal-section p');
        
        const keyPhrases = [
            'we do not sell',
            'your rights',
            'we protect',
            'security measures',
            'not responsible for'
        ];
        
        allParagraphs.forEach(paragraph => {
            const paragraphText = paragraph.textContent.toLowerCase();
            
            keyPhrases.forEach(phrase => {
                if (paragraphText.includes(phrase.toLowerCase()) && !paragraph.parentElement.classList.contains('legal-highlight')) {
                    // Create highlight wrapper
                    const highlightDiv = document.createElement('div');
                    highlightDiv.className = 'legal-highlight';
                    
                    // Replace the paragraph with our highlighted version
                    paragraph.parentNode.insertBefore(highlightDiv, paragraph);
                    highlightDiv.appendChild(paragraph.cloneNode(true));
                    paragraph.remove();
                }
            });
        });
    };
    
    // Run the highlight function
    addLegalHighlights();
    
    // Mobile menu toggle for legal pages
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksMenu = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinksMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Print friendly version - custom handling
    window.addEventListener('beforeprint', () => {
        // Add a class to the body for print-specific styles
        document.body.classList.add('printing');
        
        // Show a print header with date
        const printHeader = document.createElement('div');
        printHeader.className = 'print-header';
        printHeader.innerHTML = `
            <h1>Exotic Expenditures, LLC</h1>
            <p>Printed on: ${new Date().toLocaleDateString()}</p>
        `;
        document.body.insertBefore(printHeader, document.body.firstChild);
    });
    
    window.addEventListener('afterprint', () => {
        // Remove print-specific modifications
        document.body.classList.remove('printing');
        const printHeader = document.querySelector('.print-header');
        if (printHeader) {
            printHeader.remove();
        }
    });
});