document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 2. Mobile Menu Toggle ---
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }

    // --- 3. Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. Number Counter Animation ---
    const stats = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    const startCounting = () => {
        stats.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60 FPS
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    // Format number with abbreviations (e.g. 2.5M, 15K)
                    stat.innerText = formatNumber(Math.ceil(current));
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.innerText = formatNumber(target) + (stat.innerText.includes('%') ? '%' : '+');
                }
            };
            updateCounter();
        });
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 10000) return (num / 1000).toFixed(0) + 'K';
        return num;
    };

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasCounted) {
                hasCounted = true;
                startCounting();
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // --- 5. FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Open clicked item if it wasn't already active
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // --- 6. Feedback Form & Star Rating ---
    const stars = document.querySelectorAll('.stars span');
    const ratingInput = document.getElementById('rating-value');
    const feedbackForm = document.getElementById('feedback-form');
    const formSuccess = document.getElementById('form-success');

    if (stars.length > 0) {
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                const value = e.target.getAttribute('data-value');
                ratingInput.value = value;
                
                stars.forEach(s => {
                    if (s.getAttribute('data-value') <= value) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
    }

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Validate rating
            if (!ratingInput.value) {
                alert("Please select a star rating!");
                return;
            }
            // Simulate form submission
            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                feedbackForm.reset();
                stars.forEach(s => s.classList.remove('active'));
                ratingInput.value = '';
                submitBtn.style.display = 'none';
                formSuccess.classList.remove('hidden');
            }, 1000);
        });
    }

    // --- 7. Interactive Floating Particles Background ---
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;
                if (this.y > height) this.y = 0;
                if (this.y < 0) this.y = height;
            }
            draw() {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            // Create fewer particles on smaller screens for performance
            const particleCount = window.innerWidth < 768 ? 40 : 80;
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                // Draw connecting lines between close particles
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 - distance/1200})`; // Purple tint
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }
});
