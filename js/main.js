/**
 * SITEF Ingénierie - Main JavaScript
 * Site vitrine professionnel
 */

(function() {
    'use strict';

    // ========================================
    // DOM Elements
    // ========================================
    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const backToTopBtn = document.getElementById('back-to-top');
    const contactForm = document.getElementById('contact-form');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    // ========================================
    // Header Scroll Effect
    // ========================================
    function handleScroll() {
        const scrollY = window.scrollY;

        // Add shadow to header on scroll
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Show/hide back to top button
        if (scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Update active nav link based on scroll position
        updateActiveNavLink();
    }

    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // ========================================
    // Mobile Menu Toggle
    // ========================================
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isOpen = !mobileMenu.classList.contains('hidden');

            if (isOpen) {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                // Reset icon to hamburger
                mobileMenuBtn.innerHTML = `
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                `;
            } else {
                mobileMenu.classList.remove('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
                // Change icon to X
                mobileMenuBtn.innerHTML = `
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                `;
            }
        });

        // Close mobile menu when clicking a link
        const mobileNavLinks = mobileMenu.querySelectorAll('a');
        mobileNavLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.innerHTML = `
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                `;
            });
        });
    }

    // ========================================
    // Active Navigation Link
    // ========================================
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 100;

        sections.forEach(function(section) {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ========================================
    // Smooth Scroll for Navigation
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Back to Top Button
    // ========================================
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // Contact Form Handling
    // ========================================
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            // Basic validation
            if (!data.name || !data.phone || !data.email || !data.message) {
                e.preventDefault();
                showToast('Veuillez remplir tous les champs obligatoires.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                e.preventDefault();
                showToast('Veuillez entrer une adresse email valide.', 'error');
                return;
            }

            // Show loading state on button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<svg class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Envoi en cours...';
            submitBtn.disabled = true;

            // Le formulaire s'envoie via FormSubmit.co
        });
    }

    // ========================================
    // Toast Notifications
    // ========================================
    function showToast(message, type = 'success') {
        // Remove existing toasts
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Show toast
        setTimeout(function() {
            toast.classList.add('show');
        }, 100);

        // Hide toast after 5 seconds
        setTimeout(function() {
            toast.classList.remove('show');
            setTimeout(function() {
                toast.remove();
            }, 300);
        }, 5000);
    }

    // ========================================
    // Intersection Observer for Animations
    // ========================================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .fade-in-up');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(function(el) {
                observer.observe(el);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            animatedElements.forEach(function(el) {
                el.classList.add('visible');
            });
        }
    }

    // ========================================
    // Service Cards Counter Animation
    // ========================================
    function animateCounters() {
        const counters = document.querySelectorAll('[data-count]');

        counters.forEach(function(counter) {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = function() {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }

    // ========================================
    // Lazy Loading Images
    // ========================================
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(function(img) {
                imageObserver.observe(img);
            });
        } else {
            // Fallback
            images.forEach(function(img) {
                img.src = img.dataset.src;
            });
        }
    }

    // ========================================
    // Map Markers Interaction
    // ========================================
    function initMapInteractions() {
        const cityMarkers = document.querySelectorAll('.city-marker');

        cityMarkers.forEach(function(marker) {
            marker.addEventListener('mouseenter', function() {
                const city = this.getAttribute('data-city');
                // Could show a tooltip or highlight related content
                console.log('Hovering:', city);
            });
        });
    }

    // ========================================
    // Phone Number Formatting
    // ========================================
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            // Format for Moroccan phone numbers
            if (value.startsWith('212')) {
                value = '+' + value;
            } else if (value.startsWith('0')) {
                // Keep as is
            } else if (value.length > 0 && !value.startsWith('+')) {
                value = '+212' + value;
            }

            // Limit length
            if (value.length > 15) {
                value = value.substring(0, 15);
            }

            e.target.value = value;
        });
    }

    // ========================================
    // Initialize Everything
    // ========================================
    function init() {
        // Initial scroll check
        handleScroll();

        // Initialize animations
        initScrollAnimations();

        // Initialize lazy loading
        initLazyLoading();

        // Initialize map interactions
        initMapInteractions();

        // Add loaded class to body for CSS transitions
        document.body.classList.add('loaded');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ========================================
    // Service Worker Registration (PWA)
    // ========================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            // Uncomment when you have a service worker file
            // navigator.serviceWorker.register('/sw.js')
            //     .then(function(registration) {
            //         console.log('ServiceWorker registered:', registration.scope);
            //     })
            //     .catch(function(error) {
            //         console.log('ServiceWorker registration failed:', error);
            //     });
        });
    }

})();
