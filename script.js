// 数字雨背景动画
class MatrixRain {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.letters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.fontSize = 14;
        this.columns = this.canvas.width / this.fontSize;
        this.drops = [];
        this.initDrops();
        this.animate();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = this.canvas.width / this.fontSize;
        this.initDrops();
    }
    
    initDrops() {
        this.drops = [];
        for (let x = 0; x < this.columns; x++) {
            this.drops[x] = 1;
        }
    }
    
    draw() {
        // 半透明黑色背景，创建轨迹效果
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绿色文字
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = this.fontSize + 'px monospace';
        
        // 绘制字符
        for (let i = 0; i < this.drops.length; i++) {
            // 随机字符
            const text = this.letters[Math.floor(Math.random() * this.letters.length)];
            
            // 绘制字符
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
            
            // 随机重置
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            
            // 下降
            this.drops[i]++;
        }
    }
    
    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// 导航栏切换
function initNavbar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // 动画效果
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `slideInUp 0.5s ease forwards ${index * 0.1}s`;
            }
        });
    });
    
    // 点击导航链接后关闭菜单
    const navLinkItems = document.querySelectorAll('.nav-link');
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// 滚动动画
function initScrollAnimations() {
    const animateOnScroll = (elements, animationClass) => {
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add(animationClass);
            }
        });
    };
    
    // 监听滚动事件
    window.addEventListener('scroll', () => {
        const blogCards = document.querySelectorAll('.blog-card');
        const projectCards = document.querySelectorAll('.project-card');
        const skillItems = document.querySelectorAll('.skill-item');
        const infoItems = document.querySelectorAll('.info-item');
        
        animateOnScroll(blogCards, 'animate-fade-in');
        animateOnScroll(projectCards, 'animate-fade-in');
        animateOnScroll(skillItems, 'animate-fade-in');
        animateOnScroll(infoItems, 'animate-fade-in');
    });
}

// 鼠标跟随效果
function initMouseFollow() {
    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // 交互元素效果
    const interactiveElements = document.querySelectorAll('a, button, .skill-item, .blog-card, .project-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-large');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-large');
        });
    });
}

// 按钮点击效果
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// 打字机效果
function initTypewriter() {
    const titleName = document.querySelector('.title-name');
    const text = titleName.textContent;
    titleName.textContent = '';
    
    let index = 0;
    function type() {
        if (index < text.length) {
            titleName.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        }
    }
    
    // 延迟开始打字效果
    setTimeout(type, 1000);
}

// 粒子效果
function initParticles() {
    const canvas = document.createElement('canvas');
    canvas.classList.add('particles-canvas');
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particlesArray = [];
    const particleCount = 100;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = `rgba(${Math.random() * 100 + 155}, ${Math.random() * 255}, ${Math.random() * 100 + 155}, ${Math.random() * 0.5 + 0.2})`;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width || this.x < 0) {
                this.speedX = -this.speedX;
            }
            
            if (this.y > canvas.height || this.y < 0) {
                this.speedY = -this.speedY;
            }
        }
    }
    
    function initParticlesArray() {
        for (let i = 0; i < particleCount; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].draw();
            particlesArray[i].update();
            
            // 连接粒子
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 255, 0, ${0.2 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    initParticlesArray();
    animateParticles();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// 添加额外的CSS样式
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 滚动动画 */
        .animate-fade-in {
            animation: fadeInUp 1s ease forwards;
            opacity: 0;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        /* 鼠标跟随 */
        .cursor {
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid var(--accent-1);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
            mix-blend-mode: difference;
        }
        
        .cursor-large {
            width: 40px;
            height: 40px;
            background-color: rgba(0, 255, 0, 0.2);
            border-color: var(--accent-1);
        }
        
        /* 按钮涟漪效果 */
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        /* 粒子画布 */
        .particles-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        }
        
        /* 数字雨效果增强 */
        #matrix-bg {
            filter: contrast(1.2) brightness(1.1);
        }
        
        /* 滚动条样式 */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: var(--bg-secondary);
        }
        
        ::-webkit-scrollbar-thumb {
            background: var(--accent-1);
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: var(--accent-3);
        }
        
        /* 返回顶部按钮 */
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--accent-1);
            color: var(--bg-primary);
            border: none;
            font-size: 20px;
            cursor: pointer;
            transition: var(--transition);
            opacity: 0;
            visibility: hidden;
            z-index: 999;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
        }
        
        .back-to-top.show {
            opacity: 1;
            visibility: visible;
        }
        
        .back-to-top:hover {
            transform: translateY(-5px);
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.6);
        }
        
        /* 导航栏高亮 */
        .nav-link.active {
            color: var(--accent-1);
            text-shadow: 0 0 10px var(--accent-1);
        }
        
        .nav-link.active::after {
            width: 100%;
        }
        
        /* 页面加载动画 */
        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--bg-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            transition: var(--transition);
        }
        
        .page-loader.fade-out {
            opacity: 0;
            visibility: hidden;
        }
        
        .loader-content {
            text-align: center;
        }
        
        .loader-logo {
            margin-bottom: 40px;
        }
        
        .loader-logo .logo-text {
            font-family: var(--font-primary);
            font-size: 48px;
            font-weight: 900;
            color: var(--accent-1);
            text-shadow: 0 0 20px var(--accent-1);
            display: block;
        }
        
        .loader-logo .logo-subtext {
            font-size: 18px;
            color: var(--text-secondary);
            letter-spacing: 3px;
            margin-top: 10px;
        }
        
        .loader-spinner {
            width: 60px;
            height: 60px;
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            border-top-color: var(--accent-1);
            animation: spin 1s ease-in-out infinite;
            margin: 0 auto;
        }
        
        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
        
        /* 英雄区域初始动画 */
        .hero-content {
            opacity: 0;
            transform: translateY(30px);
            transition: all 1s ease;
        }
        
        /* 表单提交按钮状态 */
        .btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none !important;
            box-shadow: none !important;
        }
    `;
    document.head.appendChild(style);
}

// 表单提交功能
function initFormSubmission() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // 表单验证
            const name = contactForm.querySelector('input[name="name"]').value;
            const email = contactForm.querySelector('input[name="email"]').value;
            const message = contactForm.querySelector('textarea[name="message"]').value;
            
            if (!name || !email || !message) {
                alert('请填写所有必填字段');
                e.preventDefault();
                return;
            }
            
            // 准备提交
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = '发送中...';
            submitButton.disabled = true;
            
            // 表单将通过Formspree提交，这里不需要阻止默认行为
            // Formspree会处理邮件发送并显示成功消息
        });
    }
}

// 平滑滚动
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 导航栏高亮
function initNavbarHighlight() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// 返回顶部按钮
function initBackToTop() {
    const backToTopButton = document.createElement('button');
    backToTopButton.classList.add('back-to-top');
    backToTopButton.innerHTML = '<i class="fa fa-arrow-up"></i>';
    document.body.appendChild(backToTopButton);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 页面加载动画
function initPageLoader() {
    const loader = document.createElement('div');
    loader.classList.add('page-loader');
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-logo">
                <span class="logo-text">NEO</span>
                <span class="logo-subtext">CODER</span>
            </div>
            <div class="loader-spinner"></div>
        </div>
    `;
    document.body.appendChild(loader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => {
                loader.remove();
            }, 1000);
        }, 1500);
    });
}

// 初始化所有功能
function initAll() {
    // 页面加载动画
    initPageLoader();
    
    // 数字雨背景
    new MatrixRain('matrix-bg');
    
    // 导航栏
    initNavbar();
    
    // 导航栏高亮
    initNavbarHighlight();
    
    // 滚动动画
    initScrollAnimations();
    
    // 平滑滚动
    initSmoothScroll();
    
    // 鼠标跟随
    initMouseFollow();
    
    // 按钮效果
    initButtonEffects();
    
    // 打字机效果
    initTypewriter();
    
    // 粒子效果
    initParticles();
    
    // 表单提交
    initFormSubmission();
    
    // 返回顶部按钮
    initBackToTop();
    
    // 动态样式
    addDynamicStyles();
    
    // 初始动画
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 500);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initAll);