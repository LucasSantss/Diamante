// ========================================
// SCRIPT MELHORADO PARA DIAMANTE VIDRAÇARIA
// Baseado na análise do site real da empresa
// ========================================

// Configurações globais
const CONFIG = {
    parallaxIntensity: 0.05, // Reduzido para ser mais sutil
    animationDuration: 800,
    scrollThreshold: 0.15,
    debounceDelay: 16 // ~60fps
};

// Utilitário para debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// NAVEGAÇÃO SUAVE MELHORADA
// ========================================
function initSmoothNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // Calcular offset para navbar fixa
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Adicionar classe ativa temporariamente
                this.classList.add('active-link');
                setTimeout(() => {
                    this.classList.remove('active-link');
                }, 1000);
            }
        });
    });
}

// ========================================
// EFEITO PARALLAX OTIMIZADO
// ========================================
function initParallaxEffect() {
    let ticking = false;
    
    const parallaxElements = [
        { selector: '.hero-content', intensity: CONFIG.parallaxIntensity },
        { selector: '.organic-shape-1', intensity: CONFIG.parallaxIntensity * 0.5 },
        { selector: '.organic-shape-2', intensity: CONFIG.parallaxIntensity * 0.3 },
        { selector: '.organic-shape-3', intensity: CONFIG.parallaxIntensity * 0.7 }
    ];
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(({ selector, intensity }) => {
            const element = document.querySelector(selector);
            if (element) {
                const parallaxValue = scrolled * intensity;
                element.style.transform = `translateY(${parallaxValue}px)`;
            }
        });
        
        ticking = false;
    }
    
    const debouncedParallax = debounce(() => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, CONFIG.debounceDelay);
    
    window.addEventListener('scroll', debouncedParallax, { passive: true });
}

// ========================================
// ANIMAÇÕES DE ENTRADA MELHORADAS
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: CONFIG.scrollThreshold,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animar elementos filhos com delay escalonado
                const children = entry.target.querySelectorAll('.service-card, .contact-info p');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observar seções de conteúdo
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('animate-prepare');
        observer.observe(section);
    });
    
    // Observar cards de serviço individualmente
    document.querySelectorAll('.service-card').forEach(card => {
        card.classList.add('animate-prepare');
        observer.observe(card);
    });
}

// ========================================
// EFEITOS INTERATIVOS PARA CARDS
// ========================================
function initCardEffects() {
    document.querySelectorAll('.service-card').forEach(card => {
        // Efeito hover melhorado
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px rgba(242, 201, 201, 0.2)';
        });
        
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
        
        // Efeito de clique
        card.addEventListener('click', function () {
            this.style.animation = 'cardPulse 0.3s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    });
}

// MELHORIAS NO BOTÃO CTA
function initCTAEffects() {
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        // Efeito de clique melhorado
        ctaButton.addEventListener('click', function (e) {
            e.stopPropagation(); // Garante que o evento não se propague

            // Criar efeito ripple
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none; /* Permite que o clique passe para o elemento subjacente */
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
    }
}


// ========================================
// INDICADOR DE PROGRESSO DE SCROLL
// ========================================
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(45deg, #A69C94, #F2C9C9);
        z-index: 1000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    const updateProgress = debounce(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }, CONFIG.debounceDelay);
    
    window.addEventListener('scroll', updateProgress, { passive: true });
}

// ========================================
// NAVEGAÇÃO ATIVA
// ========================================
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(section => observer.observe(section));
}

// ========================================
// OTIMIZAÇÕES DE PERFORMANCE
// ========================================
function initPerformanceOptimizations() {
    // Lazy loading para imagens
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preload de recursos críticos
    const preloadLinks = [
        { href: '/images/logo.png', as: 'image' }
    ];
    
    preloadLinks.forEach(({ href, as }) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = as;
        document.head.appendChild(link);
    });
}

// ========================================
// ESTILOS CSS DINÂMICOS
// ========================================
function injectDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Animações melhoradas */
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes cardPulse {
            0% { transform: translateY(-15px) scale(1.02); }
            50% { transform: translateY(-15px) scale(1.08); }
            100% { transform: translateY(-15px) scale(1.02); }
        }
        
        /* Estados de animação */
        .animate-prepare {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity ${CONFIG.animationDuration}ms ease, 
                       transform ${CONFIG.animationDuration}ms ease;
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        /* Link ativo na navegação */
        .nav-menu a.active {
            color: #F2C9C9;
            transform: translateY(-2px);
        }
        
        .nav-menu a.active::after {
            width: 100%;
        }
        
        .nav-menu a.active-link {
            animation: linkPulse 0.5s ease;
        }
        
        @keyframes linkPulse {
            0%, 100% { transform: translateY(-2px); }
            50% { transform: translateY(-5px); }
        }
        
        /* Melhorias de acessibilidade */
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
        
        /* Otimizações para mobile */
        @media (max-width: 768px) {
            .scroll-progress {
                height: 2px;
            }
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// INTEGRAÇÃO COM WHATSAPP
// ========================================
function initWhatsAppIntegration() {
    // Detectar links do WhatsApp e adicionar analytics
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]');
    
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function () {
            // Analytics ou tracking podem ser adicionados aqui
            console.log('WhatsApp link clicked');
            
            // Efeito visual
            this.style.animation = 'pulse 0.3s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    });
}

// ========================================
// INICIALIZAÇÃO PRINCIPAL
// ========================================
function initializeWebsite() {
    console.log('🔷 Diamante Vidraçaria - Site carregado com sucesso!');
    
    // Adicionar classe para indicar que o JavaScript está ativo
    document.body.classList.add('js-loaded');
    
    // Inicializar todos os módulos
    initSmoothNavigation();
    initParallaxEffect();
    initScrollAnimations();
    initCardEffects();
    initCTAEffects();
    initScrollProgress();
    initActiveNavigation();
    initPerformanceOptimizations();
    initWhatsAppIntegration();
    
    // Injetar estilos dinâmicos
    injectDynamicStyles();
    
    console.log('✨ Todas as funcionalidades foram inicializadas!');
}

// ========================================
// EVENT LISTENERS
// ========================================
document.addEventListener('DOMContentLoaded', initializeWebsite);

// Cleanup ao sair da página
window.addEventListener('beforeunload', () => {
    console.log('🔷 Diamante Vidraçaria - Obrigado pela visita!');
});

//navbar @media
const menu_btn = document.querySelector('.nav-brand');
const nav = document.querySelector('.navbar');

menu_btn.addEventListener('click', () => {
    nav.classList.toggle('active');
})