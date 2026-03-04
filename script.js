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
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = this.fontSize + 'px monospace';
        for (let i = 0; i < this.drops.length; i++) {
            const text = this.letters[Math.floor(Math.random() * this.letters.length)];
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
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
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `slideInUp 0.5s ease forwards ${index * 0.1}s`;
            }
        });
    });
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
    setTimeout(type, 1000);
}

// 粒子效果 (暂时禁用以提高加载速度)
function initParticles() {
    /*
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
    */
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
        
        /* 粒子画布 (暂时禁用) */
        /*
        .particles-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        }
        */
        
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
                <span class="logo-text">XiangQiu</span>
                <span class="logo-subtext">DEVELOPER</span>
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

// 新闻模块功能
function initNews() {
    console.log('Initializing news module...');
    
    // 获取新闻相关元素
    const newsGrid = document.getElementById('news-grid');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const loadMoreButton = document.getElementById('load-more-news');
    
    if (!newsGrid || !categoryButtons.length || !loadMoreButton) {
        console.error('News elements not found');
        return;
    }
    
    // 模拟新闻数据
    const newsData = [
        {
            id: 1,
            title: '全球科技巨头发布最新人工智能模型',
            description: '该模型在多项基准测试中表现出色，预计将推动AI技术的进一步发展。据报道，这一模型在自然语言处理、计算机视觉等多个领域都取得了突破性进展，有望在医疗、教育、金融等行业得到广泛应用。',
            source: '科技日报',
            date: '2026-03-04',
            category: 'technology',
            url: 'news-technology-1.html'
        },
        {
            id: 2,
            title: '全球经济增长预期上调',
            description: '国际货币基金组织最新报告显示，全球经济增长预期从3.2%上调至3.5%。报告指出，新兴市场和发展中经济体的增长表现超出预期，特别是亚洲地区的经济复苏势头强劲。',
            source: '经济时报',
            date: '2026-03-03',
            category: 'business',
            url: 'news-business-1.html'
        },
        {
            id: 3,
            title: '新型医疗技术在癌症治疗中取得突破',
            description: '研究人员开发出一种新的靶向治疗方法，显著提高了癌症患者的生存率。这项技术通过精准定位肿瘤细胞，减少对正常细胞的损伤，为癌症治疗带来了新的希望。',
            source: '健康报',
            date: '2026-03-02',
            category: 'health',
            url: 'news-health-1.html'
        },
        {
            id: 4,
            title: '世界杯冠军诞生',
            description: '经过激烈角逐，某国家队最终获得世界杯冠军，创造了历史。这是该国首次获得世界杯冠军，球员们的出色表现赢得了全球球迷的赞誉。',
            source: '体育周报',
            date: '2026-03-01',
            category: 'sports',
            url: 'news-sports-1.html'
        },
        {
            id: 5,
            title: '年度最受欢迎电影揭晓',
            description: '根据全球票房和观众评分，年度最受欢迎电影名单正式公布。科幻大片《星际穿越2》以超过10亿美元的票房位居榜首，成为年度最卖座电影。',
            source: '娱乐周刊',
            date: '2026-02-29',
            category: 'entertainment',
            url: 'news-entertainment-1.html'
        },
        {
            id: 6,
            title: '科学家发现新的行星系统',
            description: '天文学家使用詹姆斯·韦布太空望远镜发现了一个可能适合生命存在的行星系统。该系统距离地球约100光年，其中一颗行星位于宜居带内，可能存在液态水。',
            source: '科学前沿',
            date: '2026-02-28',
            category: 'science',
            url: 'news-science-1.html'
        },
        {
            id: 7,
            title: '国际领导人峰会召开',
            description: '各国领导人齐聚一堂，讨论全球气候变化和经济合作等重要议题。会议通过了多项决议，承诺共同应对气候变化挑战，促进全球经济可持续发展。',
            source: '环球时报',
            date: '2026-02-27',
            category: 'world',
            url: 'news-world-1.html'
        },
        {
            id: 8,
            title: '5G技术在全球范围内加速部署',
            description: '多个国家宣布将加快5G网络建设，推动数字经济发展。预计到2026年底，全球5G用户将突破30亿，5G网络覆盖将达到全球人口的70%以上。',
            source: '科技日报',
            date: '2026-02-26',
            category: 'technology',
            url: 'news-technology-2.html'
        },
        {
            id: 9,
            title: '中东局势最新发展：多国联合军事演习与地区安全',
            description: '中东地区近期局势紧张，多国举行联合军事演习以应对潜在安全威胁。据军事时报报道，美国、以色列、沙特等国在红海地区举行了代号为"沙漠盾牌"的联合军事演习，涵盖陆地、海上和空中多个领域。演习旨在提高各国军队的协同作战能力，应对胡塞武装的导弹袭击和海上威胁。同时，联合国特使正在积极斡旋，寻求通过外交途径解决地区冲突，避免局势进一步升级。分析人士认为，此次演习是对地区不稳定因素的有力回应，有助于维护红海航运安全和地区和平稳定。',
            source: '军事时报',
            date: '2026-03-04',
            category: 'military',
            url: 'news-military-1.html'
        }
    ];
    
    let currentCategory = 'all';
    let currentPage = 1;
    const newsPerPage = 4;
    
    // 渲染新闻卡片
    function renderNews(newsList) {
        newsGrid.innerHTML = '';
        
        if (newsList.length === 0) {
            newsGrid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 40px;">暂无新闻</div>';
            return;
        }
        
        newsList.forEach(news => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card animate-fade-in';
            
            // 分类标签映射
            const categoryMap = {
                technology: '科技',
                business: '商业',
                health: '健康',
                sports: '体育',
                entertainment: '娱乐',
                science: '科学',
                world: '国际',
                military: '军事'
            };
            
            newsCard.innerHTML = `
                <div class="news-card-header">
                    <span class="news-source">${news.source}</span>
                    <span class="news-date">${news.date}</span>
                </div>
                <h3 class="news-title">${news.title}</h3>
                <p class="news-description">${news.description}</p>
                <div class="news-card-footer">
                    <span class="news-category-tag">${categoryMap[news.category]}</span>
                    <a href="${news.url}" class="news-readmore" target="_blank">阅读全文</a>
                </div>
            `;
            
            newsGrid.appendChild(newsCard);
        });
    }
    
    // 加载新闻
    function loadNews() {
        let filteredNews = currentCategory === 'all' 
            ? newsData 
            : newsData.filter(news => news.category === currentCategory);
        
        const startIndex = (currentPage - 1) * newsPerPage;
        const endIndex = startIndex + newsPerPage;
        const paginatedNews = filteredNews.slice(startIndex, endIndex);
        
        if (currentPage === 1) {
            renderNews(paginatedNews);
        } else {
            // 加载更多时添加到现有内容
            paginatedNews.forEach(news => {
                const newsCard = document.createElement('div');
                newsCard.className = 'news-card animate-fade-in';
                
                const categoryMap = {
                    technology: '科技',
                    business: '商业',
                    health: '健康',
                    sports: '体育',
                    entertainment: '娱乐',
                    science: '科学',
                    world: '国际',
                    military: '军事'
                };
                
                newsCard.innerHTML = `
                    <div class="news-card-header">
                        <span class="news-source">${news.source}</span>
                        <span class="news-date">${news.date}</span>
                    </div>
                    <h3 class="news-title">${news.title}</h3>
                    <p class="news-description">${news.description}</p>
                    <div class="news-card-footer">
                        <span class="news-category-tag">${categoryMap[news.category]}</span>
                        <a href="${news.url}" class="news-readmore" target="_blank">阅读全文</a>
                    </div>
                `;
                
                newsGrid.appendChild(newsCard);
            });
        }
        
        // 检查是否还有更多新闻
        const totalNews = currentCategory === 'all' ? newsData.length : newsData.filter(news => news.category === currentCategory).length;
        if (endIndex >= totalNews) {
            loadMoreButton.textContent = '没有更多新闻';
            loadMoreButton.disabled = true;
            loadMoreButton.style.opacity = '0.5';
        } else {
            loadMoreButton.textContent = '加载更多';
            loadMoreButton.disabled = false;
            loadMoreButton.style.opacity = '1';
        }
    }
    
    // 分类切换
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 更新活动状态
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 更新当前分类和页码
            currentCategory = button.dataset.category;
            currentPage = 1;
            
            // 加载新闻
            loadNews();
        });
    });
    
    // 加载更多按钮
    loadMoreButton.addEventListener('click', () => {
        currentPage++;
        loadMoreNews();
    });
    
    // 加载更多新闻
    function loadMoreNews() {
        loadMoreButton.textContent = '加载中...';
        loadMoreButton.disabled = true;
        
        // 模拟加载延迟
        setTimeout(() => {
            loadNews();
        }, 500);
    }
    
    // 初始化加载
    loadNews();
    console.log('News module initialized successfully');
}

// 学习模块椭圆旋转功能
function initLearningRotation() {
    const learningContent = document.querySelector('.learning-content');
    if (!learningContent) return;
    
    learningContent.style.height = '400px';
    learningContent.style.position = 'relative';
    learningContent.style.display = 'flex';
    learningContent.style.alignItems = 'center';
    learningContent.style.justifyContent = 'center';
    
    learningContent.innerHTML = '';
    
    const controls = document.createElement('div');
    controls.className = 'rotation-controls';
    controls.innerHTML = `
        <button class="rotation-btn left-btn" id="rotate-left">
            <i class="fa fa-chevron-left"></i>
        </button>
        <button class="rotation-btn right-btn" id="rotate-right">
            <i class="fa fa-chevron-right"></i>
        </button>
    `;
    learningContent.appendChild(controls);
    
    const rotationContainer = document.createElement('div');
    rotationContainer.className = 'rotation-container';
    rotationContainer.id = 'rotation-container';
    rotationContainer.style.position = 'absolute';
    rotationContainer.style.width = '100%';
    rotationContainer.style.height = '100%';
    rotationContainer.style.perspective = '1000px';
    rotationContainer.style.zIndex = '1';
    
    const rotationStage = document.createElement('div');
    rotationStage.className = 'rotation-stage';
    rotationStage.id = 'rotation-stage';
    rotationStage.style.position = 'relative';
    rotationStage.style.width = '100%';
    rotationStage.style.height = '100%';
    rotationStage.style.transformStyle = 'preserve-3d';
    
    const learningCards = [
        { title: 'C#', description: '微软开发的现代编程语言', page: 'learning-csharp.html' },
        { title: 'Java', description: '跨平台的面向对象编程语言', page: 'learning-java.html' },
        { title: 'Python', description: '简单易学的高级编程语言', page: 'learning-python.html' },
        { title: 'JavaScript', description: 'Web前端开发的核心语言', page: 'learning-javascript.html' },
        { title: 'HTML/CSS', description: 'Web前端开发的基础技术', page: 'learning-html-css.html' },
        { title: '数据结构与算法', description: '计算机科学的基础', page: 'learning-algorithms.html' },
        { title: '大模型', description: '大型语言模型技术', page: 'learning-llm.html' },
        { title: 'AI技术', description: '人工智能技术', page: 'learning-ai.html' },
        { title: '前沿技术', description: '探索未来技术趋势', page: 'learning-frontier.html' }
    ];
    
    learningCards.forEach((card, index) => {
        const item = document.createElement('div');
        item.className = 'rotation-item';
        item.dataset.index = index;
        
        item.style.display = 'block';
        item.style.position = 'absolute';
        item.style.width = '220px';
        item.style.height = '280px';
        item.style.left = '50%';
        item.style.top = '50%';
        item.style.marginLeft = '-110px';
        item.style.marginTop = '-140px';
        item.style.opacity = '1';
        item.style.zIndex = '10';
        item.style.backgroundColor = 'rgba(102, 0, 255, 0.9)';
        item.style.border = '2px solid #8a2be2';
        item.style.borderRadius = '12px';
        item.style.padding = '25px';
        item.style.transition = 'all 0.5s ease';
        item.style.boxShadow = '0 8px 16px rgba(102, 0, 255, 0.8)';
        item.style.fontFamily = 'Arial, sans-serif';
        item.style.textAlign = 'center';
        item.style.cursor = 'pointer';
        item.style.backfaceVisibility = 'hidden';
        
        item.innerHTML = `
            <div style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <h3 style="margin-bottom: 15px; font-size: 20px; font-weight: bold; color: #ffffff; text-shadow: 0 0 10px #ffffff;">${card.title}</h3>
                <p style="margin: 0; line-height: 1.4; color: #f0f0f0; text-shadow: 0 0 5px #f0f0f0;">${card.description}</p>
            </div>
        `;
        
        item.addEventListener('click', () => {
            window.location.href = card.page;
        });
        
        rotationStage.appendChild(item);
    });
    
    rotationContainer.appendChild(rotationStage);
    learningContent.appendChild(rotationContainer);
    
    const rotateLeftBtn = document.getElementById('rotate-left');
    const rotateRightBtn = document.getElementById('rotate-right');
    const rotationItems = document.querySelectorAll('.rotation-item');
    
    const itemCount = rotationItems.length;
    let currentIndex = 0;
    
    function rotate(direction) {
        currentIndex = (currentIndex + direction + itemCount) % itemCount;
        const radius = 200;
        
        rotationItems.forEach((item, index) => {
            const angle = (index - currentIndex) * (360 / itemCount) * Math.PI / 180;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius * 0.4;
            const scale = 0.7 + (Math.cos(angle) + 1) * 0.15;
            const opacity = 0.5 + (Math.cos(angle) + 1) * 0.25;
            
            item.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;
            item.style.opacity = opacity;
            item.style.zIndex = Math.floor(scale * 100);
        });
    }
    
    if (rotateLeftBtn) {
        rotateLeftBtn.addEventListener('click', () => rotate(-1));
    }
    
    if (rotateRightBtn) {
        rotateRightBtn.addEventListener('click', () => rotate(1));
    }
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    rotationContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    rotationContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            rotate(1);
        } else if (touchEndX > touchStartX + swipeThreshold) {
            rotate(-1);
        }
    }, false);
    
    rotationItems.forEach((item, index) => {
        const initialAngle = index * (360 / rotationItems.length) * Math.PI / 180;
        const initialX = Math.cos(initialAngle) * 200;
        const initialY = Math.sin(initialAngle) * 200 * 0.4;
        item.style.transform = `translate(-50%, -50%) translate(${initialX}px, ${initialY}px) scale(0.7)`;
        item.style.opacity = '0.7';
        item.style.zIndex = index;
    });
    
    setTimeout(() => {
        rotate(0);
        setInterval(() => {
            rotate(1);
        }, 4000);
    }, 100);
    
    window.addEventListener('resize', () => {
        const screenWidth = window.innerWidth;
        learningContent.style.height = screenWidth < 768 ? '350px' : '400px';
        rotate(0);
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
    
    // 学习模块旋转
    initLearningRotation();
    
    // 新闻模块
    initNews();
    
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