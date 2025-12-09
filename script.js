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
                var file = e.target.files[0];
                var sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                fileName.textContent = file.name + ' (' + sizeMB + ' MB)';
                
                // Warn if file is too large (Basin limit is 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    fileName.textContent = file.name + ' - FILE TOO LARGE (max 10MB)';
                    fileName.style.color = '#f87171';
                } else {
                    fileName.style.color = '';
                }
            } else {
                fileName.textContent = 'STEP, IGES, DWG, DXF, PDF (max 10MB)';
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
    
    // Form submission handler with Basin AJAX
    const form = document.getElementById('rfq-form');
    const formStatus = document.getElementById('form-status');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check file size before submitting
            if (fileInput && fileInput.files.length > 0) {
                if (fileInput.files[0].size > 10 * 1024 * 1024) {
                    formStatus.className = 'mt-4 p-4 rounded-lg text-center bg-red-500/20 border border-red-500/50 text-red-400';
                    formStatus.textContent = '✗ File is too large. Maximum file size is 10MB. Please compress or use a cloud link.';
                    formStatus.classList.remove('hidden');
                    return;
                }
            }
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            const formData = new FormData(form);
            
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(function(response) {
                if (response.ok) {
                    return { success: true };
                } else {
                    return response.json().then(function(data) {
                        return { success: false, data: data };
                    }).catch(function() {
                        return { success: false, data: null };
                    });
                }
            })
            .then(function(result) {
                if (result.success) {
                    // Success
                    formStatus.className = 'mt-4 p-4 rounded-lg text-center bg-green-500/20 border border-green-500/50 text-green-400';
                    formStatus.textContent = '✓ Thank you! Your quote request has been submitted. We will contact you within 24 hours.';
                    formStatus.classList.remove('hidden');
                    form.reset();
                    // Reset file name display
                    if (fileName) {
                        fileName.textContent = 'STEP, IGES, DWG, DXF, PDF (max 10MB)';
                        fileName.style.color = '';
                    }
                } else {
                    // Handle Basin errors
                    var errorMsg = '✗ ';
                    if (result.data && result.data.error) {
                        errorMsg += result.data.error;
                    } else if (result.data && result.data.message) {
                        errorMsg += result.data.message;
                    } else {
                        errorMsg += 'Form submission failed. Please try again or email us directly.';
                    }
                    formStatus.className = 'mt-4 p-4 rounded-lg text-center bg-red-500/20 border border-red-500/50 text-red-400';
                    formStatus.textContent = errorMsg;
                    formStatus.classList.remove('hidden');
                }
            })
            .catch(function(error) {
                // Network error
                formStatus.className = 'mt-4 p-4 rounded-lg text-center bg-red-500/20 border border-red-500/50 text-red-400';
                formStatus.textContent = '✗ Network error. Please check your connection and try again.';
                formStatus.classList.remove('hidden');
            })
            .finally(function() {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
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
