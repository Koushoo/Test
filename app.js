// Celestia - Premium Apple-inspired Website with Light/Dark Mode
// Made by Koushoo

class CelestiaApp {
    constructor() {
        this.targetDate = new Date('2025-10-01T00:00:00').getTime();
        this.particles = [];
        this.currentTheme = 'dark';
        this.mouseTrail = document.getElementById('mouseTrail');
        this.particlesContainer = document.getElementById('particlesContainer');
        this.themeToggle = document.getElementById('themeToggle');
        this.body = document.body;
        
        this.init();
    }

    init() {
        this.loadTheme();
        this.setupEventListeners();
        this.startCountdown();
        this.createParticleSystem();
        this.setupMouseTrail();
        this.setupNotificationForm();
        this.setupScrollAnimations();
        this.addInteractiveEffects();
        
        // Initialize with fade-in effect
        setTimeout(() => {
            this.body.style.opacity = '1';
        }, 100);
    }

    // Theme Management
    loadTheme() {
        const savedTheme = localStorage.getItem('celestia-theme') || 'dark';
        this.setTheme(savedTheme, false);
    }

    setTheme(theme, animate = true) {
        this.currentTheme = theme;
        
        if (animate) {
            this.body.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }
        
        this.body.className = `theme-${theme}`;
        localStorage.setItem('celestia-theme', theme);
        
        // Update particles color based on theme
        this.updateParticlesColor();
        
        // Reset transition after animation
        if (animate) {
            setTimeout(() => {
                this.body.style.transition = '';
            }, 300);
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Add a subtle scale animation to the toggle button
        this.themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1)';
        }, 150);
    }

    // Event Listeners
    setupEventListeners() {
        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Mouse movement for trail
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Scroll events for animations
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleKeyboardShortcuts(e) {
        switch(e.key.toLowerCase()) {
            case 't':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.toggleTheme();
                }
                break;
            case ' ':
                if (e.target.tagName !== 'INPUT') {
                    e.preventDefault();
                    this.createSparkleEffect();
                }
                break;
        }
    }

    // Countdown Timer
    startCountdown() {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = this.targetDate - now;
            
            if (distance < 0) {
                this.displayLaunchMessage();
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('days').textContent = String(days).padStart(3, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    displayLaunchMessage() {
        const countdownElement = document.getElementById('countdown');
        countdownElement.innerHTML = `
            <div style="text-align: center; animation: launchPulse 2s ease-in-out infinite;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🚀</div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--accent);">LAUNCHED!</div>
            </div>
        `;
    }

    // Particle System
    createParticleSystem() {
        // Create initial particles
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                this.createParticle();
            }, Math.random() * 3000);
        }
        
        // Continuous particle generation
        setInterval(() => {
            if (this.particles.length < 25) {
                this.createParticle();
            }
        }, 2000);
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 3 + 1;
        const startX = Math.random() * window.innerWidth;
        const duration = Math.random() * 10 + 15;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${startX}px`;
        particle.style.bottom = '-10px';
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.opacity = Math.random() * 0.6 + 0.2;
        
        this.particlesContainer.appendChild(particle);
        this.particles.push(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                this.particles = this.particles.filter(p => p !== particle);
            }
        }, (duration + delay + 2) * 1000);
    }

    updateParticlesColor() {
        // Update existing particles to match theme
        this.particles.forEach(particle => {
            particle.style.background = this.currentTheme === 'light' ? '#007AFF' : '#0A84FF';
        });
    }

    // Mouse Trail
    setupMouseTrail() {
        let mouseX = 0, mouseY = 0;
        let trailX = 0, trailY = 0;
        let isMoving = false;
        let hideTimeout;
        
        const animateTrail = () => {
            const dx = mouseX - trailX;
            const dy = mouseY - trailY;
            
            trailX += dx * 0.1;
            trailY += dy * 0.1;
            
            this.mouseTrail.style.left = `${trailX - 10}px`;
            this.mouseTrail.style.top = `${trailY - 10}px`;
            
            requestAnimationFrame(animateTrail);
        };
        
        animateTrail();
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!isMoving) {
                this.mouseTrail.style.opacity = '0.6';
                isMoving = true;
            }
            
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                this.mouseTrail.style.opacity = '0';
                isMoving = false;
            }, 1000);
        });
    }

    handleMouseMove(e) {
        // Create occasional sparkles on mouse movement
        if (Math.random() < 0.005) {
            this.createSparkleAt(e.clientX, e.clientY);
        }
    }

    // Interactive Effects
    addInteractiveEffects() {
        // Add hover effects to feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.addEventListener('mouseenter', () => {
                this.createGlowEffect(card);
            });
        });
        
        // Add click effects to buttons
        const buttons = document.querySelectorAll('.notification-btn, .theme-toggle');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e);
            });
        });
        
        // Add parallax effect to hero section
        this.setupParallaxEffect();
    }

    setupParallaxEffect() {
        const hero = document.querySelector('.hero');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (hero) {
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    createSparkleEffect() {
        const colors = this.currentTheme === 'light' ? ['#007AFF', '#34C759', '#FF9500'] : ['#0A84FF', '#64D2FF', '#FFD60A'];
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.style.position = 'fixed';
                sparkle.style.width = '4px';
                sparkle.style.height = '4px';
                sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                sparkle.style.borderRadius = '50%';
                sparkle.style.left = Math.random() * window.innerWidth + 'px';
                sparkle.style.top = Math.random() * window.innerHeight + 'px';
                sparkle.style.pointerEvents = 'none';
                sparkle.style.zIndex = '1000';
                sparkle.style.animation = 'sparkleAnimation 1s ease-out forwards';
                
                document.body.appendChild(sparkle);
                
                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                    }
                }, 1000);
            }, i * 100);
        }
    }

    createSparkleAt(x, y) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.width = '3px';
        sparkle.style.height = '3px';
        sparkle.style.backgroundColor = this.currentTheme === 'light' ? '#007AFF' : '#0A84FF';
        sparkle.style.borderRadius = '50%';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        sparkle.style.animation = 'sparkleAnimation 0.8s ease-out forwards';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 800);
    }

    createGlowEffect(element) {
        const glow = document.createElement('div');
        glow.style.position = 'absolute';
        glow.style.top = '0';
        glow.style.left = '0';
        glow.style.right = '0';
        glow.style.bottom = '0';
        glow.style.background = `radial-gradient(circle, ${this.currentTheme === 'light' ? 'rgba(0, 122, 255, 0.1)' : 'rgba(10, 132, 255, 0.1)'} 0%, transparent 70%)`;
        glow.style.borderRadius = '20px';
        glow.style.opacity = '0';
        glow.style.transition = 'opacity 0.3s ease';
        glow.style.pointerEvents = 'none';
        
        element.style.position = 'relative';
        element.appendChild(glow);
        
        setTimeout(() => {
            glow.style.opacity = '1';
        }, 10);
        
        element.addEventListener('mouseleave', () => {
            glow.style.opacity = '0';
            setTimeout(() => {
                if (glow.parentNode) {
                    glow.parentNode.removeChild(glow);
                }
            }, 300);
        }, { once: true });
    }

    createRippleEffect(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'rippleAnimation 0.6s ease-out';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.pointerEvents = 'none';
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    // Form Handling
    setupNotificationForm() {
        const form = document.getElementById('notificationForm');
        const input = form.querySelector('.notification-input');
        const button = form.querySelector('.notification-btn');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = input.value.trim();
            if (this.isValidEmail(email)) {
                this.handleNotificationSignup(email, button);
            } else {
                this.showFormError('Please enter a valid email address');
            }
        });
        
        // Add focus effects
        input.addEventListener('focus', () => {
            input.parentNode.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', () => {
            input.parentNode.style.transform = 'scale(1)';
        });
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    handleNotificationSignup(email, button) {
        const originalText = button.textContent;
        button.textContent = 'Subscribing...';
        button.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            button.textContent = '✓ Subscribed!';
            button.style.background = '#34C759';
            
            // Create success sparkles
            this.createSparkleEffect();
            
            // Show success message
            this.showSuccessMessage('You\'ll be notified when Celestia launches!');
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                button.style.background = '';
                document.getElementById('notificationForm').reset();
            }, 3000);
        }, 1500);
    }

    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '100px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.background = 'var(--glass-bg)';
        notification.style.backdropFilter = 'blur(20px)';
        notification.style.border = '1px solid var(--glass-border)';
        notification.style.borderRadius = '16px';
        notification.style.padding = '16px 24px';
        notification.style.color = 'var(--text-primary)';
        notification.style.zIndex = '10000';
        notification.style.animation = 'slideDown 0.3s ease-out forwards';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    showFormError(message) {
        // Similar to success message but with error styling
        console.error(message);
    }

    // Scroll Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
                }
            });
        }, observerOptions);
        
        // Observe feature cards
        document.querySelectorAll('.feature-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            observer.observe(card);
        });
        
        // Observe other sections
        document.querySelectorAll('.notification-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            observer.observe(card);
        });
    }

    handleScroll() {
        // Add subtle parallax effects
        const scrolled = window.pageYOffset;
        const features = document.querySelector('.features');
        
        if (features) {
            features.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    }

    handleResize() {
        // Update particle positions on resize
        this.particles.forEach(particle => {
            if (parseFloat(particle.style.left) > window.innerWidth) {
                particle.style.left = '0px';
            }
        });
    }
}

// Custom CSS animations for effects
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleAnimation {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: scale(2) rotate(180deg);
            opacity: 0;
        }
    }
    
    @keyframes rippleAnimation {
        0% {
            transform: scale(0);
            opacity: 0.3;
        }
        100% {
            transform: scale(1);
            opacity: 0;
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(40px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes launchPulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
`;
document.head.appendChild(style);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new CelestiaApp();
    
    // Add some fun console messages
    console.log(`
🌟 CELESTIA - Premium Apple-inspired Experience 🌟
Made by Koushoo

✨ Interactive Features:
• Light/Dark mode toggle (click the toggle or press Ctrl/Cmd+T)
• Press Space for sparkle effects
• Hover over feature cards for glow effects
• Mouse trail and particle system
• Smooth countdown timer
• Responsive design with premium animations

🎨 Theme Support:
• Automatic theme persistence
• Smooth transitions between modes
• Optimized cosmic background for both themes

Enjoy the premium experience! 🚀
    `);
    
    // Add a subtle welcome effect
    setTimeout(() => {
        app.createSparkleEffect();
    }, 2000);
});

// Prevent right-click context menu for cleaner experience
document.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.hero, .countdown-glass-card')) {
        e.preventDefault();
    }
});

// Add smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CelestiaApp;
}
