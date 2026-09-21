/* =============================================
   PL ELECTRONICS - JavaScript Functionality
   ============================================= */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initPreloader();
    initMobileMenu();
    initStickyHeader();
    initSmoothScroll();
    initScrollReveal();
    initCountUp();
    initLightbox();
    initContactForm();
    initBackToTop();
    initActiveNav();
});

/* ---------------- Preloader ---------------- */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) {
        document.body.classList.add('loaded');
        startHeroStagger();
        return;
    }

    // Ensure hero animations trigger even if load event is delayed
    setTimeout(function () {
        preloader.classList.add('hidden');
        document.body.classList.add('loaded');
        startHeroStagger();
    }, 900);
}

function startHeroStagger() {
    document.querySelectorAll('[data-hero-stagger]').forEach(function (el, i) {
        el.style.setProperty('--stagger', i);
    });
}


/* ---- Mobile Menu ---- */
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'nav__overlay';
    document.body.appendChild(overlay);

    // Open menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close menu
    function closeMenu() {
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (navClose) {
        navClose.addEventListener('click', closeMenu);
    }

    overlay.addEventListener('click', closeMenu);

    // Close menu on link click
    navLinks.forEach(function(link) {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

/* ---- Sticky Header ---- */
function initStickyHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* ---- Smooth Scrolling ---- */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ---- Scroll Reveal ---- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        revealElements.forEach(function(el) {
            el.classList.add('revealed');
        });
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(function(el) {
        observer.observe(el);
    });
}

/* ---- Count Up Animation ---- */
function initCountUp() {
    const counters = document.querySelectorAll('[data-count]');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(function(counter) {
        observer.observe(counter);
    });
}

function animateCount(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(function() {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

/* ---- Lightbox ---- */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightbox-content');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery__item');

    let currentIndex = 0;
    let galleryData = [];

    // Collect gallery data
    galleryItems.forEach(function(item, index) {
        const label = item.querySelector('.gallery__label');
        const placeholder = item.querySelector('.gallery__placeholder');
        
        galleryData.push({
            label: label ? label.textContent : 'Gallery Image',
            content: placeholder ? placeholder.innerHTML : ''
        });

        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        currentIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxContent() {
        const data = galleryData[currentIndex];
        lightboxContent.innerHTML = data.content;
        lightboxCaption.textContent = data.label;
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % galleryData.length;
        updateLightboxContent();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
        updateLightboxContent();
    }

    // Event listeners
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', nextImage);
    lightboxPrev.addEventListener('click', prevImage);

    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
}

/* ---- Contact Form Validation ---- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (!form) return;

    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('name-error');
    const phoneError = document.getElementById('phone-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    // Real-time validation
    nameInput.addEventListener('blur', function() { validateName(); });
    phoneInput.addEventListener('blur', function() { validatePhone(); });
    emailInput.addEventListener('blur', function() { validateEmail(); });
    messageInput.addEventListener('blur', function() { validateMessage(); });

    // Clear error on input
    [nameInput, phoneInput, emailInput, messageInput].forEach(function(input) {
        input.addEventListener('input', function() {
            clearError(this);
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const isNameValid = validateName();
        const isPhoneValid = validatePhone();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();

        if (isNameValid && isPhoneValid && isEmailValid && isMessageValid) {
            // Show success message
            form.style.display = 'none';
            formSuccess.style.display = 'block';

            // Reset form after 5 seconds
            setTimeout(function() {
                form.reset();
                form.style.display = 'block';
                formSuccess.style.display = 'none';
            }, 5000);
        }
    });

    function validateName() {
        const value = nameInput.value.trim();
        if (!value) {
            showError(nameInput, nameError, 'Please enter your name');
            return false;
        }
        if (value.length < 2) {
            showError(nameInput, nameError, 'Name must be at least 2 characters');
            return false;
        }
        clearError(nameInput);
        return true;
    }

    function validatePhone() {
        const value = phoneInput.value.trim();
        if (!value) {
            showError(phoneInput, phoneError, 'Please enter your phone number');
            return false;
        }
        // Basic phone validation - allows digits, spaces, hyphens, parentheses, and plus sign
        const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
        if (!phoneRegex.test(value)) {
            showError(phoneInput, phoneError, 'Please enter a valid phone number');
            return false;
        }
        clearError(phoneInput);
        return true;
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        if (!value) {
            showError(emailInput, emailError, 'Please enter your email address');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(emailInput, emailError, 'Please enter a valid email address');
            return false;
        }
        clearError(emailInput);
        return true;
    }

    function validateMessage() {
        const value = messageInput.value.trim();
        if (!value) {
            showError(messageInput, messageError, 'Please enter your message');
            return false;
        }
        if (value.length < 10) {
            showError(messageInput, messageError, 'Message must be at least 10 characters');
            return false;
        }
        clearError(messageInput);
        return true;
    }

    function showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
    }

    function clearError(input) {
        input.classList.remove('error');
        const errorElement = input.parentElement.querySelector('.form__error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }
}

/* ---- Back to Top Button ---- */
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');

    if (!backToTop) return;

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ---- Active Navigation ---- */
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(function(section) {
        observer.observe(section);
    });
}

/* ---- Brands Auto Scroll ---- */
(function() {
    const brandsTrack = document.querySelector('.brands__track');
    if (!brandsTrack) return;

    // Clone items for infinite scroll
    const items = brandsTrack.innerHTML;
    brandsTrack.innerHTML = items + items;
})();
