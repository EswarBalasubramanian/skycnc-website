// SKY CNC Website JavaScript
// Deferred execution to prevent main thread blocking

(function() {
    'use strict';

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }
    
    // File upload name display
    const fileInput = document.getElementById('cad-file');
    const fileName = document.getElementById('file-name');
    
    if (fileInput && fileName) {
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                fileName.textContent = e.target.files[0].name;
            } else {
                fileName.textContent = 'STEP, IGES, DWG, DXF, PDF';
            }
        });
    }
    
    // Smooth scrolling for anchor links (passive event for better performance)
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Form submission handler
    const form = document.getElementById('rfq-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your quote request! We will contact you within 24 hours.');
            form.reset();
            if (fileName) {
                fileName.textContent = 'STEP, IGES, DWG, DXF, PDF';
            }
        });
    }
    
    // Header scroll effect with passive listener for better scroll performance
    const header = document.querySelector('header');
    if (header) {
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    if (window.scrollY > 50) {
                        header.classList.add('shadow-lg');
                    } else {
                        header.classList.remove('shadow-lg');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
})();
