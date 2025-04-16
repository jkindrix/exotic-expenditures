/**
 * Gallery functionality for Exotic Expenditures website
 * Implements filtering, lightbox, and loading animations
 */

document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    
    // Check if we need to initialize cookie consent (if not already initialized in main.js)
    if (document.querySelector('.cookie-consent') && 
        !document.querySelector('.cookie-consent.active') &&
        !localStorage.getItem('cookieConsent')) {
        initCookieConsent();
    }
});

function initGallery() {
    const gallerySection = document.getElementById('gallery');
    if (!gallerySection) return;

    // Initialize components
    initGalleryFilters();
    initGalleryLightbox();
    initLoadMoreButton();
    initGalleryAnimations();
}

/**
 * Initialize category filtering functionality
 */
function initGalleryFilters() {
    const filters = document.querySelectorAll('.gallery-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Update active filter
            document.querySelector('.gallery-filter.active').classList.remove('active');
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.add('fade-in');
                    }, 50);
                } else {
                    item.classList.remove('fade-in');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Announce for screen readers
            const ariaLive = document.createElement('div');
            ariaLive.setAttribute('aria-live', 'polite');
            ariaLive.classList.add('sr-only');
            ariaLive.textContent = `Showing ${filterValue} photos`;
            document.body.appendChild(ariaLive);
            setTimeout(() => {
                document.body.removeChild(ariaLive);
            }, 1000);
        });
    });
}

/**
 * Initialize lightbox functionality
 */
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.gallery-lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeButton = lightbox.querySelector('.close-lightbox');
    const prevButton = lightbox.querySelector('.lightbox-prev');
    const nextButton = lightbox.querySelector('.lightbox-next');
    
    let currentIndex = 0;
    let galleryImages = [];
    
    // Collect all visible gallery items
    function updateGalleryImages() {
        galleryImages = Array.from(document.querySelectorAll('.gallery-item[style*="display: block"], .gallery-item:not([style*="display: none"])'));
    }
    
    // Open lightbox when clicking a gallery item view button
    galleryItems.forEach(item => {
        const viewButton = item.querySelector('.gallery-view');
        viewButton.addEventListener('click', function(e) {
            e.preventDefault();
            updateGalleryImages();
            
            // Find index of clicked item
            currentIndex = galleryImages.indexOf(item);
            
            // Load image and caption
            const img = item.querySelector('img');
            const imgSrc = img.getAttribute('src');
            const title = item.querySelector('h3').textContent;
            const description = item.querySelector('p').textContent;
            
            openLightbox(imgSrc, title, description);
        });
    });
    
    // Open the lightbox with image and caption
    function openLightbox(src, title, description) {
        lightboxImage.innerHTML = `<img src="${src}" alt="${title}">`;
        lightboxCaption.innerHTML = `<h3 id="lightbox-title">${title}</h3><p>${description}</p>`;
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Set focus on close button for accessibility
        setTimeout(() => {
            closeButton.focus();
        }, 100);
    }
    
    // Close the lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Navigate to previous image
    function showPrevImage() {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        navigateToImage(currentIndex);
    }
    
    // Navigate to next image
    function showNextImage() {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        navigateToImage(currentIndex);
    }
    
    // Load image at specified index
    function navigateToImage(index) {
        const item = galleryImages[index];
        const img = item.querySelector('img');
        const imgSrc = img.getAttribute('src');
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;
        
        // Fade effect
        lightboxImage.style.opacity = 0;
        lightboxCaption.style.opacity = 0;
        
        setTimeout(() => {
            lightboxImage.innerHTML = `<img src="${imgSrc}" alt="${title}">`;
            lightboxCaption.innerHTML = `<h3 id="lightbox-title">${title}</h3><p>${description}</p>`;
            
            lightboxImage.style.opacity = 1;
            lightboxCaption.style.opacity = 1;
        }, 300);
    }
    
    // Event listeners
    closeButton.addEventListener('click', closeLightbox);
    prevButton.addEventListener('click', showPrevImage);
    nextButton.addEventListener('click', showNextImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });
    
    // Close when clicking outside the content
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

/**
 * Initialize "Load More" button (simulated)
 */
function initLoadMoreButton() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Change button state to loading
            this.innerHTML = '<span>Loading...</span> <i class="fas fa-spinner fa-spin"></i>';
            this.disabled = true;
            
            // Simulate loading delay
            setTimeout(() => {
                // Here you would typically load more items via AJAX
                // For demo purposes, we'll just show a message
                this.innerHTML = 'No more photos to load';
                this.classList.add('disabled');
            }, 1500);
        });
    }
}

/**
 * Initialize fade-in animations for gallery items
 */
function initGalleryAnimations() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Initial animation on page load
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, index * 100); // Staggered effect
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    galleryItems.forEach(item => {
        observer.observe(item);
    });
}

/**
 * Cookie consent functionality
 */
function initCookieConsent() {
    const cookieConsent = document.querySelector('.cookie-consent');
    const acceptCookiesBtn = document.querySelector('.accept-cookies');
    const declineCookiesBtn = document.querySelector('.decline-cookies');
    
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookieConsent');
    
    if (!cookieChoice && cookieConsent) {
        // Show cookie consent after slight delay
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
}