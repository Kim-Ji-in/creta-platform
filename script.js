// ===== 2025년 트렌드 반영: 모던 JavaScript 클래스 기반 아키텍처 =====

class CretaApp {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'home';
        this.aiAssistant = new AIAssistant();
        this.performanceMonitor = new PerformanceMonitor();
        this.themeManager = new ThemeManager();
        this.notificationSystem = new NotificationSystem();
        this.microInteractions = new MicroInteractions();
        this.uploadSystem = new UploadSystem();
        
        this.init();
    }

    async init() {
        await this.setupPerformanceMonitoring();
        await this.initializeTheme();
        this.setupEventListeners();
        this.initializeComponents();
        this.setupIntersectionObserver();
        this.initializeParticleSystem();
        await this.checkAuthState();
        
        console.log('🎨 CRETA 2025: AI 기반 창작 플랫폼 로드 완료');
    }

    // ===== 2025 트렌드: 성능 모니터링 =====
    async setupPerformanceMonitoring() {
        if ('performance' in window) {
            // Core Web Vitals 모니터링
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.trackWebVitals(entry);
                }
            });
            
            observer.observe({
                type: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'],
                buffered: true
            });
        }
    }

    trackWebVitals(entry) {
        const metrics = {
            'largest-contentful-paint': 'LCP',
            'first-input': 'FID', 
            'layout-shift': 'CLS',
            'first-contentful-paint': 'FCP'
        };

        if (metrics[entry.entryType]) {
            console.log(`${metrics[entry.entryType]}:`, entry.startTime || entry.value);
            this.performanceMonitor.record(metrics[entry.entryType], entry);
        }
    }

    // ===== 2025 트렌드: AI 통합 시스템 =====
    setupEventListeners() {
        // 모던 이벤트 위임 패턴
        document.addEventListener('click', this.handleGlobalClick.bind(this));
        document.addEventListener('keydown', this.handleGlobalKeydown.bind(this));
        document.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16)); // 60fps
        
        // ResizeObserver를 활용한 반응형 처리
        if ('ResizeObserver' in window) {
            const resizeObserver = new ResizeObserver(entries => {
                this.handleResize(entries);
            });
            resizeObserver.observe(document.body);
        }

        // 최신 브라우저 API 활용
        this.setupModernAPIs();
    }

    setupModernAPIs() {
        // View Transitions API (2025 최신 트렌드)
        if ('startViewTransition' in document) {
            this.viewTransition = true;
        }

        // Web Share API
        if ('share' in navigator) {
            this.shareAPI = true;
        }

        // Intersection Observer v2
        if ('IntersectionObserver' in window) {
            this.setupIntersectionObserver();
        }

        // File System Access API
        if ('showOpenFilePicker' in window) {
            this.modernFileAPI = true;
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.microInteractions.triggerAnimation(entry.target);
                    this.lazyLoadContent(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '50px',
            threshold: [0.1, 0.5, 1.0]
        });

        // 모든 애니메이션 대상 요소 관찰
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    // ===== 2025 트렌드: 마이크로 인터랙션 =====
    handleGlobalClick(event) {
        const target = event.target.closest('[data-action]');
        if (!target) return;

        const action = target.dataset.action;
        const actionMap = {
            'navigate': this.navigate.bind(this),
            'upload': this.openUpload.bind(this),
            'auth': this.toggleAuth.bind(this),
            'theme': this.themeManager.toggle.bind(this.themeManager),
            'search': this.handleSearch.bind(this),
            'ai-assist': this.aiAssistant.activate.bind(this.aiAssistant)
        };

        if (actionMap[action]) {
            // 마이크로 인터랙션 트리거
            this.microInteractions.ripple(target);
            actionMap[action](target);
        }
    }

    // ===== 2025 트렌드: 스무스 페이지 전환 =====
    async navigate(target) {
        const page = target.dataset.page || target.dataset.target;
        if (!page || page === this.currentPage) return;

        // View Transitions API 활용
        if (this.viewTransition) {
            document.startViewTransition(() => {
                this.changePage(page);
            });
        } else {
            await this.animatePageTransition(page);
        }
    }

    async changePage(page) {
        // 이전 페이지 숨기기
        const currentPageEl = document.querySelector('.page.active');
        if (currentPageEl) {
            currentPageEl.classList.remove('active');
        }

        // 네비게이션 상태 업데이트
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // 새 페이지 표시
        const newPageEl = document.getElementById(`${page}Page`);
        const newNavItem = document.querySelector(`[data-page="${page}"]`);

        if (newPageEl) {
            newPageEl.classList.add('active');
            this.currentPage = page;
            await this.loadPageData(page);
        }

        if (newNavItem) {
            newNavItem.classList.add('active');
        }

        // URL 업데이트 (SPA 방식)
        history.pushState({ page }, '', `#${page}`);
    }

    async animatePageTransition(page) {
        const timeline = new Animation([
            { opacity: 1, transform: 'translateX(0)' },
            { opacity: 0, transform: 'translateX(-100px)' }
        ], {
            duration: 300,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });

        await timeline.finished;
        this.changePage(page);
    }

    // ===== AI 검색 시스템 =====
    async handleSearch(target) {
        const query = target.value || target.closest('.search-container')?.querySelector('input')?.value;
        if (!query || query.length < 2) return;

        // AI 기반 검색 제안
        const suggestions = await this.aiAssistant.getSearchSuggestions(query);
        this.renderSearchSuggestions(suggestions);

        // 실시간 검색 결과
        const results = await this.performSearch(query);
        this.renderSearchResults(results);
    }

    async performSearch(query) {
        // 데이터베이스 검색 시뮬레이션
        const mockResults = await new Promise(resolve => {
            setTimeout(() => {
                const filtered = this.sampleWorks.filter(work => 
                    work.title.toLowerCase().includes(query.toLowerCase()) ||
                    work.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
                );
                resolve(filtered);
            }, 300);
        });

        return mockResults;
    }

    // ===== 2025 트렌드: 파티클 시스템 =====
    initializeParticleSystem() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const particles = [];
        
        // 캔버스 크기 설정
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // 파티클 생성
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        // 애니메이션 루프
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                // 파티클 이동
                particle.x += particle.vx;
                particle.y += particle.vy;

                // 경계 처리
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

                // 파티클 그리기
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(102, 126, 234, ${particle.opacity})`;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        animate();
    }

    // ===== 업로드 시스템 개선 =====
    openUpload() {
        this.navigate({ dataset: { page: 'upload' } });
    }

    // ===== 테마 관리자 =====
    async initializeTheme() {
        await this.themeManager.init();
    }

    // ===== 유틸리티 함수들 =====
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    debounce(func, wait) {
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

    // ===== 인증 시스템 =====
    async checkAuthState() {
        // 토큰 기반 인증 확인
        const token = localStorage.getItem('creta_token');
        if (token && this.validateToken(token)) {
            this.currentUser = await this.getUserFromToken(token);
            this.updateUI();
        } else {
            this.showAuth();
        }
    }

    validateToken(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } catch {
            return false;
        }
    }

    // ===== 페이지 데이터 로딩 =====
    async loadPageData(page) {
        const loaders = {
            home: this.loadHomeData.bind(this),
            explore: this.loadExploreData.bind(this),
            community: this.loadCommunityData.bind(this),
            messages: this.loadMessagesData.bind(this),
            profile: this.loadProfileData.bind(this),
            upload: this.loadUploadData.bind(this)
        };

        if (loaders[page]) {
            await loaders[page]();
        }
    }

    async loadHomeData() {
        // 홈 데이터 로딩 with lazy loading
        const worksContainer = document.getElementById('latestWorksGrid');
        if (worksContainer) {
            const works = await this.fetchWorks('latest');
            this.renderWorksGrid(works, worksContainer);
        }
    }

    // ===== 작품 렌더링 (3D 카드) =====
    renderWorksGrid(works, container) {
        container.innerHTML = '';
        
        works.forEach((work, index) => {
            const workCard = this.createWorkCard(work, index);
            container.appendChild(workCard);
        });
    }

    createWorkCard(work, index) {
        const card = document.createElement('div');
        card.className = 'work-card-3d';
        card.setAttribute('data-animate', 'fadeInUp');
        card.style.animationDelay = `${index * 100}ms`;
        
        card.innerHTML = `
            <div class="work-thumbnail-3d">${work.thumbnail}</div>
            <div class="work-content-3d">
                <h3 class="work-title-3d">${work.title}</h3>
                <p class="work-author-3d">${work.author}</p>
                <div class="work-stats-3d">
                    <span>❤️ ${work.likes}</span>
                    <span>👀 ${work.views}</span>
                </div>
                <div class="work-tags-3d">
                    ${work.tags.map(tag => `<span class="work-tag-3d">#${tag}</span>`).join('')}
                </div>
            </div>
        `;

        // 3D 호버 효과
        card.addEventListener('mouseenter', (e) => {
            this.microInteractions.tilt(e.target);
        });

        card.addEventListener('mouseleave', (e) => {
            this.microInteractions.resetTilt(e.target);
        });

        return card;
    }

    // ===== 샘플 데이터 =====
    sampleWorks = [
        {
            id: 'work1',
            title: '하이큐!! AI 생성 팬아트',
            author: 'AI창작자1',
            category: 'illustration', 
            likes: 1240,
            views: 5670,
            thumbnail: '🏐',
            tags: ['하이큐', 'AI아트', '스포츠', '2025트렌드']
        },
        {
            id: 'work2', 
            title: '원피스 메타버스 에디션',
            author: 'VR아티스트',
            category: 'animation',
            likes: 2890,
            views: 12450,
            thumbnail: '⚓',
            tags: ['원피스', '메타버스', 'VR', '3D애니메이션']
        },
        {
            id: 'work3',
            title: '귀멸의칼날 홀로그램 아트',
            author: '홀로크리에이터',
            category: 'hologram',
            likes: 1567,
            views: 8930,
            thumbnail: '⚔️',
            tags: ['귀멸의칼날', '홀로그램', 'AR', '미래기술']
        }
    ];
}

// ===== 2025 트렌드: AI 어시스턴트 클래스 =====
class AIAssistant {
    constructor() {
        this.isActive = false;
        this.context = [];
    }

    async activate() {
        this.isActive = !this.isActive;
        
        if (this.isActive) {
            this.showAIInterface();
        } else {
            this.hideAIInterface();
        }
    }

    async getSearchSuggestions(query) {
        // AI 기반 검색 제안 시뮬레이션
        const suggestions = [
            `${query} 최신 트렌드`,
            `${query} AI 생성`,
            `${query} 2025 스타일`,
            `${query} 메타버스 에디션`
        ];

        return suggestions;
    }

    showAIInterface() {
        const aiPanel = document.createElement('div');
        aiPanel.className = 'ai-assistant-panel glassmorphism';
        aiPanel.innerHTML = `
            <div class="ai-header">
                <h3>🤖 AI 어시스턴트</h3>
                <button onclick="app.aiAssistant.activate()">×</button>
            </div>
            <div class="ai-content">
                <p>안녕하세요! CRETA AI입니다. 무엇을 도와드릴까요?</p>
                <div class="ai-suggestions">
                    <button class="ai-suggestion-btn">작품 아이디어 제안</button>
                    <button class="ai-suggestion-btn">트렌드 분석</button>
                    <button class="ai-suggestion-btn">색상 팔레트 추천</button>
                </div>
            </div>
        `;

        document.body.appendChild(aiPanel);
    }

    hideAIInterface() {
        const panel = document.querySelector('.ai-assistant-panel');
        if (panel) {
            panel.remove();
        }
    }
}

// ===== 2025 트렌드: 마이크로 인터랙션 클래스 =====
class MicroInteractions {
    ripple(element) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    tilt(element) {
        element.style.transform = 'perspective(1000px) rotateX(5deg) rotateY(5deg) translateY(-8px)';
        element.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    resetTilt(element) {
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        element.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }

    triggerAnimation(element) {
        const animation = element.dataset.animate;
        if (animation) {
            element.classList.add('animate', animation);
        }
    }
}

// ===== 테마 관리자 =====
class ThemeManager {
    constructor() {
        this.currentTheme = 'dark';
        this.themes = ['light', 'dark', 'auto'];
    }

    async init() {
        const savedTheme = localStorage.getItem('creta-theme') || 'dark';
        await this.setTheme(savedTheme);
    }

    async toggle() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextTheme = this.themes[(currentIndex + 1) % this.themes.length];
        await this.setTheme(nextTheme);
    }

    async setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('creta-theme', theme);

        // 테마 아이콘 업데이트
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            const icons = { light: '☀️', dark: '🌙', auto: '🌗' };
            themeIcon.textContent = icons[theme];
        }
    }
}

// ===== 성능 모니터 =====
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
    }

    record(metric, value) {
        this.metrics[metric] = value;
        
        // 성능 임계값 체크
        if (metric === 'LCP' && value > 2500) {
            console.warn('LCP가 느립니다:', value);
        }
    }
}

// ===== 알림 시스템 =====
class NotificationSystem {
    constructor() {
        this.notifications = [];
    }

    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification-toast ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        // 자동 제거
        setTimeout(() => {
            notification.remove();
        }, duration);
    }
}

// ===== 업로드 시스템 =====
class UploadSystem {
    constructor() {
        this.supportedFormats = ['image/*', 'video/*', '.pdf', '.doc', '.docx'];
        this.maxSize = 100 * 1024 * 1024; // 100MB
    }

    async handleUpload(files) {
        for (const file of files) {
            if (file.size > this.maxSize) {
                app.notificationSystem.show('파일 크기가 너무 큽니다.', 'error');
                continue;
            }

            await this.processFile(file);
        }
    }

    async processFile(file) {
        // AI 기반 파일 분석
        const analysis = await this.analyzeFile(file);
        
        // 썸네일 생성
        const thumbnail = await this.generateThumbnail(file);
        
        // 메타데이터 추출
        const metadata = await this.extractMetadata(file);

        return { file, analysis, thumbnail, metadata };
    }

    async analyzeFile(file) {
        // AI 파일 분석 시뮬레이션
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    type: file.type,
                    quality: 'high',
                    suggestions: ['태그 추가', '설명 보완', '카테고리 확인']
                });
            }, 1000);
        });
    }

    async generateThumbnail(file) {
        if (file.type.startsWith('image/')) {
            return URL.createObjectURL(file);
        }
        return null;
    }

    async extractMetadata(file) {
        return {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
        };
    }
}

// ===== 앱 초기화 =====
let app;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 CRETA 2025: 로딩 시작...');
    
    // 로딩 화면 표시
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }

    // 메인 앱 초기화
    app = new CretaApp();

    // 로딩 완료 후 메인 앱 표시
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                document.getElementById('mainApp').style.display = 'flex';
            }, 300);
        }
    }, 2000);

    console.log('✨ CRETA 2025: 완전 로드 완료!');
});

// ===== 브라우저 호환성 체크 =====
if (!('IntersectionObserver' in window)) {
    console.warn('구형 브라우저 감지: 일부 기능이 제한됩니다.');
}

// ===== Service Worker 등록 (PWA 지원) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW 등록 성공:', registration);
            })
            .catch(registrationError => {
                console.log('SW 등록 실패:', registrationError);
            });
    });
}

// ===== 전역 에러 핸들링 =====
window.addEventListener('error', (event) => {
    console.error('전역 에러:', event.error);
    if (app && app.notificationSystem) {
        app.notificationSystem.show('예기치 않은 오류가 발생했습니다.', 'error');
    }
});

// ===== 전역 함수 노출 =====
window.app = app;
