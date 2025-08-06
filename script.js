// ===== 전역 변수 =====
let currentUser = null;
let currentPage = 'home';
let uploadStep = 1;
let selectedFiles = [];
let currentCommunity = null;
let currentChatRoom = null;
let isDarkMode = false;
let notifications = [];
let workTags = [];
let sampleWorks = [];

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 CRETA 플랫폼 로딩 시작...');
    initializeApp();
    setupEventListeners();
    loadSampleData();
});

function initializeApp() {
    // 로딩 화면 숨기기
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
        checkAuthState();
    }, 2000);
    
    // 다크모드 설정 복원
    const savedTheme = localStorage.getItem('creta-theme');
    if (savedTheme === 'dark') {
        enableDarkMode();
    }
    
    // 업로드 단계 초기화
    updateUploadStepUI();
}

function checkAuthState() {
    // 데모용 사용자 설정
    currentUser = { 
        id: 'demo-user',
        name: '민나', 
        email: 'demo@creta.com',
        avatar: '민'
    };
    showMainApp();
    loadInitialData();
}

// ===== 이벤트 리스너 설정 =====
function setupEventListeners() {
    console.log('🔧 이벤트 리스너 설정 중...');
    
    // 전역 검색 이벤트
    const globalSearchInput = document.getElementById('globalSearchInput');
    if (globalSearchInput) {
        globalSearchInput.addEventListener('input', handleGlobalSearchInput);
        globalSearchInput.addEventListener('focus', showGlobalSearchSuggestions);
        globalSearchInput.addEventListener('blur', () => {
            setTimeout(hideGlobalSearchSuggestions, 200);
        });
    }
    
    // 파일 업로드 이벤트
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // 드래그 앤 드롭 설정
    setupFileDragDrop();
    
    // 작품 정보 입력 이벤트
    setupWorkFormEvents();
    
    // 채팅 검색 이벤트
    const chatSearchInput = document.getElementById('chatSearchInput');
    if (chatSearchInput) {
        chatSearchInput.addEventListener('input', searchChats);
    }
    
    // 모달 외부 클릭 이벤트
    document.addEventListener('click', handleModalOutsideClick);
    
    // ESC 키 이벤트
    document.addEventListener('keydown', handleEscapeKey);
    
    // 네비게이션 이벤트
    setupNavigationEvents();
    
    console.log('✅ 이벤트 리스너 설정 완료');
}

function setupNavigationEvents() {
    // 네비게이션 버튼들
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('data-page');
            if (page) {
                navigateTo(page);
            }
        });
    });
}

function setupWorkFormEvents() {
    // 제목 입력 이벤트
    const titleInput = document.getElementById('workTitle');
    if (titleInput) {
        titleInput.addEventListener('input', updateTitlePreview);
    }
    
    // 설명 입력 이벤트
    const descInput = document.getElementById('workDescription');
    if (descInput) {
        descInput.addEventListener('input', updateDescriptionPreview);
    }
    
    // 태그 입력 이벤트
    const tagInput = document.getElementById('tagInput');
    if (tagInput) {
        tagInput.addEventListener('keypress', handleTagInput);
    }
    
    // 카테고리 선택 이벤트
    const categorySelect = document.getElementById('workCategory');
    if (categorySelect) {
        categorySelect.addEventListener('change', updateCategoryPreview);
    }
}

function setupFileDragDrop() {
    const dropZone = document.querySelector('.file-drop-zone');
    if (!dropZone) return;

    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--accent-primary)';
        dropZone.style.background = 'rgba(59, 130, 246, 0.05)';
    });

    dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border-color)';
        dropZone.style.background = 'var(--bg-secondary)';
    });

    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--border-color)';
        dropZone.style.background = 'var(--bg-secondary)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload({ target: { files: files } });
        }
    });
}

function handleModalOutsideClick(e) {
    if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('auth-modal-overlay')) {
        const modal = e.target;
        closeModal(modal.id || 'authModal');
    }
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        // 열린 모달들 닫기
        const openModals = document.querySelectorAll('.modal-overlay[style*="flex"], .auth-modal-overlay[style*="flex"]');
        openModals.forEach(modal => {
            closeModal(modal.id);
        });
        
        // 검색 제안 패널 닫기
        hideGlobalSearchSuggestions();
    }
}

// ===== 샘플 데이터 로드 =====
function loadSampleData() {
    sampleWorks = [
        {
            id: 'work1',
            title: '하이큐!! 최신 팬아트',
            author: '일러스트작가1',
            category: 'illustration',
            likes: 342,
            views: 1205,
            thumbnail: '🏐',
            tags: ['하이큐', '팬아트', '스포츠']
        },
        {
            id: 'work2',
            title: '원피스 1000화 기념작',
            author: '만화작가2',
            category: 'manga',
            likes: 892,
            views: 3451,
            thumbnail: '⚓',
            tags: ['원피스', '만화', '기념작']
        },
        {
            id: 'work3',
            title: '귀멸의칼날 일러스트',
            author: '디지털아티스트',
            category: 'illustration',
            likes: 567,
            views: 2103,
            thumbnail: '⚔️',
            tags: ['귀멸의칼날', '일러스트', '애니']
        },
        {
            id: 'work4',
            title: '나루토 명장면 재현',
            author: '애니팬',
            category: 'animation',
            likes: 723,
            views: 2847,
            thumbnail: '🍥',
            tags: ['나루토', '애니메이션', '명장면']
        },
        {
            id: 'work5',
            title: '진격의거인 최종화',
            author: '스토리텔러',
            category: 'novel',
            likes: 1456,
            views: 8932,
            thumbnail: '🏰',
            tags: ['진격의거인', '소설', '최종화']
        },
        {
            id: 'work6',
            title: '클래식 일러스트 컬렉션',
            author: '베테랑작가',
            category: 'illustration',
            likes: 234,
            views: 1567,
            thumbnail: '🎨',
            tags: ['클래식', '컬렉션', '일러스트']
        }
    ];
    
    initializeSampleNotifications();
}

function initializeSampleNotifications() {
    notifications = [
        {
            id: 'notif1',
            type: 'like',
            message: '일러스트작가1님이 당신의 작품을 좋아합니다',
            time: '2분 전',
            read: false,
            icon: '❤️'
        },
        {
            id: 'notif2',
            type: 'comment',
            message: '만화작가2님이 댓글을 남겼습니다: "정말 멋진 작품이네요!"',
            time: '15분 전',
            read: false,
            icon: '💬'
        },
        {
            id: 'notif3',
            type: 'follow',
            message: '디지털아티스트님이 당신을 팔로우하기 시작했습니다',
            time: '1시간 전',
            read: false,
            icon: '👤'
        }
    ];
    
    updateNotificationBadge();
}

// ===== 인증 시스템 =====
function showMainApp() {
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('mainApp').style.display = 'flex';
    document.body.classList.remove('modal-open');
    
    if (currentUser) {
        updateUserInterface();
    }
}

function showAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
    document.body.classList.add('modal-open');
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
    document.body.classList.remove('modal-open');
}

function updateUserInterface() {
    if (!currentUser) return;
    
    const displayName = currentUser.name || currentUser.email?.split('@')[0] || '사용자';
    const userInitial = displayName.charAt(0).toUpperCase();
    
    // 사용자 정보 업데이트
    const userInitialEl = document.getElementById('userInitial');
    const welcomeNameEl = document.getElementById('welcomeName');
    
    if (userInitialEl) userInitialEl.textContent = userInitial;
    if (welcomeNameEl) welcomeNameEl.textContent = displayName;
}

function switchAuthTab(tab) {
    // 탭 버튼 상태 변경
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-tab').forEach(t => {
        if (t.getAttribute('data-tab') === tab) {
            t.classList.add('active');
        }
    });
    
    // 폼 표시/숨김
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
        if ((tab === 'login' && form.id === 'loginForm') || 
            (tab === 'signup' && form.id === 'signupForm')) {
            form.classList.add('active');
        }
    });
}

function loginUser() {
    const email = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value;
    
    if (!email || !password) {
        showNotification('이메일과 비밀번호를 입력해주세요.', 'error');
        return;
    }
    
    // 데모 로그인
    currentUser = { email, name: email.split('@')[0] };
    showMainApp();
    showNotification('로그인 성공! 🎉', 'success');
    loadInitialData();
}

function signupUser() {
    const name = document.getElementById('signupName')?.value.trim();
    const email = document.getElementById('signupEmail')?.value.trim();
    const password = document.getElementById('signupPassword')?.value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm')?.value;
    const agreeTerms = document.getElementById('agreeTerms')?.checked;
    
    if (!name || !email || !password || !passwordConfirm) {
        showNotification('모든 필드를 입력해주세요.', 'error');
        return;
    }
    
    if (password !== passwordConfirm) {
        showNotification('비밀번호가 일치하지 않습니다.', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('이용약관에 동의해주세요.', 'error');
        return;
    }
    
    // 데모 회원가입
    currentUser = { email, name };
    showMainApp();
    showNotification('회원가입 성공! 🎉', 'success');
    loadInitialData();
}

function logoutUser() {
    currentUser = null;
    showAuthModal();
    showNotification('로그아웃되었습니다.', 'info');
}

function socialLogin(provider) {
    showNotification(`${provider} 로그인 기능을 준비 중입니다.`, 'info');
}

function socialSignup(provider) {
    showNotification(`${provider} 회원가입 기능을 준비 중입니다.`, 'info');
}

// ===== 네비게이션 시스템 =====
function navigateTo(page) {
    console.log(`🧭 네비게이션: ${page} 페이지로 이동`);
    
    // 이전 페이지 숨기기
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    // 새 페이지 표시
    const targetPage = document.getElementById(`${page}Page`);
    const targetNav = document.querySelector(`[data-page="${page}"]`);
    
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = page;
    }
    
    if (targetNav) {
        targetNav.classList.add('active');
    }
    
    // 페이지별 데이터 로드
    loadPageData(page);
}

function navigateBack() {
    if (currentPage === 'upload') {
        navigateTo('home');
    } else {
        window.history.back();
    }
}

function loadPageData(page) {
    switch (page) {
        case 'home':
            loadHomeData();
            break;
        case 'explore':
            loadExploreData();
            break;
        case 'community':
            loadCommunityData();
            break;
        case 'messages':
            loadMessagesData();
            break;
        case 'profile':
            loadProfileData();
            break;
        case 'upload':
            resetUploadForm();
            break;
    }
}

function loadInitialData() {
    loadHomeData();
}

// ===== 홈 페이지 =====
function loadHomeData() {
    console.log('🏠 홈 데이터 로드 중...');
    loadCarouselData('latest');
    loadCarouselData('trending');
    loadCarouselData('steady');
}

function loadCarouselData(type) {
    const container = document.getElementById(`${type}WorksCarousel`);
    if (!container) return;
    
    container.innerHTML = '';
    
    // 타입별로 다른 작품들 선택
    let works = [];
    if (type === 'latest') {
        works = sampleWorks.slice(0, 3);
    } else if (type === 'trending') {
        works = sampleWorks.slice(3, 6);
    } else {
        works = sampleWorks.slice(0, 3).reverse();
    }
    
    // 캐러셀을 위해 작품들을 복제
    const allWorks = [...works, ...works, ...works];
    
    allWorks.forEach(work => {
        const workEl = createWorkElement(work);
        container.appendChild(workEl);
    });
}

function createWorkElement(work) {
    const div = document.createElement('div');
    div.className = 'work-item';
    div.innerHTML = `
        <div class="work-thumbnail">${work.thumbnail}</div>
        <div class="work-content">
            <div class="work-title">${work.title}</div>
            <div class="work-author">${work.author}</div>
            <div class="work-stats">
                <span>❤️ ${work.likes}</span>
                <span>👀 ${work.views}</span>
            </div>
        </div>
    `;
    div.addEventListener('click', () => showWorkDetail(work.id));
    return div;
}

function slideWorksCarousel(type, direction) {
    const container = document.getElementById(`${type}WorksCarousel`);
    if (container) {
        container.scrollBy({
            left: direction * 300,
            behavior: 'smooth'
        });
    }
}

function showWorkDetail(workId) {
    const work = sampleWorks.find(w => w.id === workId);
    if (work) {
        showNotification(`"${work.title}" 상세보기 기능을 준비 중입니다! 🎨`, 'info');
    }
}

// ===== 검색 시스템 =====
function handleGlobalSearchInput(event) {
    const query = event.target.value.trim();
    const clearBtn = document.querySelector('.search-clear');
    
    if (query.length > 0) {
        clearBtn.style.display = 'block';
        if (query.length > 2) {
            updateGlobalSearchSuggestions(query);
        }
    } else {
        clearBtn.style.display = 'none';
        hideGlobalSearchSuggestions();
    }
}

function handleGlobalSearch(event) {
    if (event.key === 'Enter') {
        performGlobalSearch();
    }
}

function performGlobalSearch() {
    const query = document.getElementById('globalSearchInput')?.value.trim();
    if (!query) return;
    
    hideGlobalSearchSuggestions();
    showNotification(`"${query}" 검색 결과를 불러오는 중...`, 'info');
    
    // 탐색 페이지로 이동하면서 검색 실행
    navigateTo('explore');
    setTimeout(() => {
        loadSearchResults(query);
    }, 300);
}

function showGlobalSearchSuggestions() {
    const panel = document.getElementById('globalSearchSuggestions');
    if (panel) {
        panel.style.display = 'block';
        loadGlobalSearchSuggestions();
    }
}

function hideGlobalSearchSuggestions() {
    const panel = document.getElementById('globalSearchSuggestions');
    if (panel) {
        panel.style.display = 'none';
    }
}

function loadGlobalSearchSuggestions() {
    const trendingContainer = document.getElementById('globalTrendingKeywords');
    const suggestedContainer = document.getElementById('globalSuggestedKeywords');
    
    if (trendingContainer) {
        trendingContainer.innerHTML = [
            '하이큐', '원피스', '귀멸의칼날', '나루토', '진격의거인'
        ].map((keyword, index) => 
            `<div class="trending-item" onclick="searchKeyword('${keyword}')">
                <span>${index + 1}. ${keyword}</span>
                <span style="color: var(--error);">↑</span>
            </div>`
        ).join('');
    }
    
    if (suggestedContainer) {
        suggestedContainer.innerHTML = [
            '팬아트', '일러스트', '애니메이션', '만화', '소설'
        ].map(keyword => 
            `<div class="suggestion-item" onclick="searchKeyword('${keyword}')">${keyword}</div>`
        ).join('');
    }
}

function updateGlobalSearchSuggestions(query) {
    // 실시간 검색 제안 업데이트 (추후 구현)
    console.log('검색어 업데이트:', query);
}

function searchKeyword(keyword) {
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
        searchInput.value = keyword;
        performGlobalSearch();
    }
}

function clearGlobalSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    const clearBtn = document.querySelector('.search-clear');
    
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
    if (clearBtn) {
        clearBtn.style.display = 'none';
    }
    hideGlobalSearchSuggestions();
}

// ===== 탐색 페이지 =====
function loadExploreData() {
    loadExploreResults();
}

function loadSearchResults(query) {
    const container = document.getElementById('exploreResults');
    if (!container) return;
    
    // 로딩 상태
    container.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-secondary);">검색 중...</div>';
    
    setTimeout(() => {
        let results = sampleWorks.filter(work => 
            work.title.toLowerCase().includes(query.toLowerCase()) ||
            work.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        
        if (results.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 4rem; color: var(--text-secondary);">
                    <h3>검색 결과가 없습니다</h3>
                    <p>"${query}"에 대한 검색 결과를 찾을 수 없습니다.</p>
                </div>
            `;
        } else {
            container.innerHTML = '';
            results.forEach(work => {
                const workEl = createWorkElement(work);
                container.appendChild(workEl);
            });
        }
    }, 800);
}

function loadExploreResults() {
    const container = document.getElementById('exploreResults');
    if (!container) return;
    
    container.innerHTML = '';
    sampleWorks.forEach(work => {
        const workEl = createWorkElement(work);
        container.appendChild(workEl);
    });
}

function filterByCategory(category) {
    // 필터 버튼 상태 변경
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const container = document.getElementById('exploreResults');
    if (!container) return;
    
    let filteredWorks = category === 'all' ? sampleWorks : sampleWorks.filter(work => work.category === category);
    
    container.innerHTML = '';
    filteredWorks.forEach(work => {
        const workEl = createWorkElement(work);
        container.appendChild(workEl);
    });
    
    showNotification(`${category} 카테고리로 필터링 완료`, 'success');
}

function sortWorks(sortType) {
    const container = document.getElementById('exploreResults');
    if (!container) return;
    
    let sortedWorks = [...sampleWorks];
    
    if (sortType === 'popular') {
        sortedWorks.sort((a, b) => b.likes - a.likes);
    } else if (sortType === 'latest') {
        sortedWorks.reverse();
    } else if (sortType === 'views') {
        sortedWorks.sort((a, b) => b.views - a.views);
    }
    
    container.innerHTML = '';
    sortedWorks.forEach(work => {
        const workEl = createWorkElement(work);
        container.appendChild(workEl);
    });
    
    showNotification(`${sortType} 순으로 정렬 완료`, 'success');
}

// ===== 작품 업로드 페이지 =====
function resetUploadForm() {
    uploadStep = 1;
    selectedFiles = [];
    workTags = [];
    
    // 폼 초기화
    const fields = ['workTitle', 'workDescription', 'workCategory', 'tagInput'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) field.value = '';
    });
    
    // 파일 미리보기 초기화
    const preview = document.getElementById('filePreview');
    if (preview) preview.innerHTML = '';
    
    // 태그 리스트 초기화
    updateTagDisplay();
    
    // UI 업데이트
    updateUploadStepUI();
}

function updateUploadStepUI() {
    // 단계 표시기 업데이트
    document.querySelectorAll('.step-item').forEach((step, index) => {
        if (index + 1 === uploadStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // 단계 콘텐츠 표시
    document.querySelectorAll('.upload-step').forEach((step, index) => {
        if (index + 1 === uploadStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // 네비게이션 버튼 상태
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');
    
    if (prevBtn) prevBtn.style.display = uploadStep > 1 ? 'inline-flex' : 'none';
    if (nextBtn) nextBtn.style.display = uploadStep < 3 ? 'inline-flex' : 'none';
    
    // 진행률 바 업데이트
    const progressBar = document.getElementById('uploadProgressBar');
    const progressText = document.getElementById('uploadProgressText');
    
    if (progressBar) progressBar.style.width = `${(uploadStep / 3) * 100}%`;
    if (progressText) progressText.textContent = `${uploadStep}/3 단계`;
    
    // 게시 버튼 상태
    updatePublishButton();
}

function nextUploadStep() {
    if (validateCurrentUploadStep()) {
        if (uploadStep < 3) {
            uploadStep++;
            updateUploadStepUI();
        }
    }
}

function previousUploadStep() {
    if (uploadStep > 1) {
        uploadStep--;
        updateUploadStepUI();
    }
}

function validateCurrentUploadStep() {
    if (uploadStep === 1) {
        if (selectedFiles.length === 0) {
            showNotification('파일을 선택해주세요.', 'error');
            return false;
        }
    } else if (uploadStep === 2) {
        const title = document.getElementById('workTitle')?.value.trim();
        const category = document.getElementById('workCategory')?.value;
        
        if (!title) {
            showNotification('작품 제목을 입력해주세요.', 'error');
            return false;
        }
        
        if (!category) {
            showNotification('카테고리를 선택해주세요.', 'error');
            return false;
        }
    }
    
    return true;
}

function handleFileUpload(event) {
    const files = Array.from(event.target.files || event.dataTransfer?.files || []);
    if (files.length === 0) return;
    
    // 파일 유효성 검사
    for (const file of files) {
        if (file.size > 100 * 1024 * 1024) { // 100MB 제한
            showNotification('파일 크기는 100MB 이하여야 합니다.', 'error');
            return;
        }
    }
    
    selectedFiles = files;
    displayFilePreview();
    
    // 자동으로 다음 단계로
    setTimeout(() => {
        if (uploadStep === 1) {
            nextUploadStep();
        }
    }, 500);
}

function displayFilePreview() {
    const preview = document.getElementById('filePreview');
    if (!preview || selectedFiles.length === 0) return;
    
    preview.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'file-preview-item';
        previewItem.style.cssText = `
            display: inline-block;
            margin: 0.5rem;
            padding: 1rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            text-align: center;
            background: var(--bg-primary);
        `;
        
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.style.cssText = `
                max-width: 150px;
                max-height: 150px;
                object-fit: cover;
                border-radius: 4px;
                margin-bottom: 0.5rem;
            `;
            img.onload = () => URL.revokeObjectURL(img.src);
            img.src = URL.createObjectURL(file);
            previewItem.appendChild(img);
        } else {
            const icon = document.createElement('div');
            icon.style.cssText = `
                font-size: 3rem;
                margin-bottom: 0.5rem;
                color: var(--text-secondary);
            `;
            icon.textContent = '📁';
            previewItem.appendChild(icon);
        }
        
        const fileName = document.createElement('div');
        fileName.style.cssText = `
            font-size: 0.8rem;
            color: var(--text-secondary);
            margin-top: 0.5rem;
        `;
        fileName.textContent = file.name;
        previewItem.appendChild(fileName);
        
        preview.appendChild(previewItem);
    });
}

function updateTitlePreview() {
    const title = document.getElementById('workTitle')?.value || '제목을 입력하세요';
    const previewTitle = document.querySelector('.preview-title');
    if (previewTitle) {
        previewTitle.textContent = title;
    }
    
    updatePublishButton();
}

function updateDescriptionPreview() {
    // 설명 미리보기 업데이트 (필요시 구현)
    updatePublishButton();
}

function updateCategoryPreview() {
    updatePublishButton();
}

function handleTagInput(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const input = event.target;
        const tag = input.value.trim();
        
        if (tag && !workTags.includes(tag) && workTags.length < 10) {
            workTags.push(tag);
            input.value = '';
            updateTagDisplay();
            updatePublishButton();
        }
    }
}

function addTag(tag) {
    if (tag && !workTags.includes(tag) && workTags.length < 10) {
        workTags.push(tag);
        updateTagDisplay();
        updatePublishButton();
    }
}

function removeTag(index) {
    workTags.splice(index, 1);
    updateTagDisplay();
    updatePublishButton();
}

function updateTagDisplay() {
    const container = document.getElementById('tagList');
    if (!container) return;
    
    container.innerHTML = '';
    workTags.forEach((tag, index) => {
        const tagEl = document.createElement('div');
        tagEl.className = 'tag-item';
        tagEl.innerHTML = `
            ${tag}
            <button class="tag-remove" onclick="removeTag(${index})">×</button>
        `;
        container.appendChild(tagEl);
    });
}

function updatePublishButton() {
    // 체크리스트 업데이트
    const checkTitle = document.getElementById('checkTitle');
    const checkFile = document.getElementById('checkFile');
    const checkCategory = document.getElementById('checkCategory');
    
    const title = document.getElementById('workTitle')?.value.trim();
    const category = document.getElementById('workCategory')?.value;
    
    if (checkTitle) {
        checkTitle.innerHTML = title ? 
            '<span class="check-icon">✅</span>제목 입력' : 
            '<span class="check-icon">⏳</span>제목 입력';
        checkTitle.classList.toggle('completed', !!title);
    }
    
    if (checkFile) {
        checkFile.innerHTML = selectedFiles.length > 0 ? 
            '<span class="check-icon">✅</span>파일 업로드' : 
            '<span class="check-icon">⏳</span>파일 업로드';
        checkFile.classList.toggle('completed', selectedFiles.length > 0);
    }
    
    if (checkCategory) {
        checkCategory.innerHTML = category ? 
            '<span class="check-icon">✅</span>카테고리 선택' : 
            '<span class="check-icon">⏳</span>카테고리 선택';
        checkCategory.classList.toggle('completed', !!category);
    }
}

function publishWork() {
    if (!validateCurrentUploadStep()) return;
    
    const workData = {
        title: document.getElementById('workTitle')?.value.trim(),
        description: document.getElementById('workDescription')?.value.trim(),
        category: document.getElementById('workCategory')?.value,
        tags: workTags,
        visibility: document.querySelector('input[name="visibility"]:checked')?.value || 'public',
        allowComments: document.getElementById('allowComments')?.checked,
        allowLikes: document.getElementById('allowLikes')?.checked,
        allowDownload: document.getElementById('allowDownload')?.checked,
        files: selectedFiles
    };
    
    // 게시 시뮬레이션
    showNotification('작품을 게시하는 중...', 'info');
    
    setTimeout(() => {
        // 새 작품을 샘플 데이터에 추가
        const newWork = {
            id: 'work_' + Date.now(),
            title: workData.title,
            author: currentUser?.name || '사용자',
            category: workData.category,
            likes: 0,
            views: 0,
            thumbnail: getCategoryThumbnail(workData.category),
            tags: workData.tags
        };
        
        sampleWorks.unshift(newWork);
        
        showNotification('작품이 성공적으로 게시되었습니다! 🎉', 'success');
        navigateTo('home');
    }, 2000);
}

function getCategoryThumbnail(category) {
    const thumbnails = {
        'illustration': '🎨',
        'animation': '🎬',
        'novel': '📚',
        'manga': '📖',
        'music': '🎵',
        'game': '🎮'
    };
    return thumbnails[category] || '🎨';
}

function saveDraft() {
    showNotification('임시저장 기능을 준비 중입니다! 💾', 'info');
}

// ===== 커뮤니티 시스템 =====
function loadCommunityData() {
    const container = document.getElementById('communitiesList');
    if (!container) return;
    
    const sampleCommunities = [
        {
            id: 'community1',
            name: '하이큐!! 팬클럽',
            category: 'animation',
            description: '하이큐!! 애니메이션과 만화를 사랑하는 사람들의 모임입니다.',
            members: 1250,
            posts: 342,
            icon: '🏐'
        },
        {
            id: 'community2',
            name: '일러스트 창작소',
            category: 'illustration',
            description: '다양한 일러스트 작품을 공유하고 피드백을 나누는 공간입니다.',
            members: 890,
            posts: 567,
            icon: '🎨'
        },
        {
            id: 'community3',
            name: '원피스 토론방',
            category: 'manga',
            description: '원피스 만화와 애니메이션에 대한 모든 이야기를 나누세요.',
            members: 2100,
            posts: 891,
            icon: '⚓'
        }
    ];
    
    container.innerHTML = '';
    sampleCommunities.forEach(community => {
        const communityEl = createCommunityElement(community);
        container.appendChild(communityEl);
    });
}

function createCommunityElement(community) {
    const div = document.createElement('div');
    div.className = 'community-card';
    div.innerHTML = `
        <div class="community-info">
            <div class="community-icon">${community.icon}</div>
            <div class="community-details">
                <h3>${community.name}</h3>
                <div class="community-meta">${community.members}명 • ${community.posts}개 게시물</div>
            </div>
        </div>
        <div class="community-description">${community.description}</div>
    `;
    div.addEventListener('click', () => openCommunityDetail(community.id));
    return div;
}

function openCommunityDetail(communityId) {
    // 커뮤니티 상세 페이지로 이동
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('communityDetailPage').classList.add('active');
    
    // 커뮤니티 정보 로드 (데모 데이터)
    loadCommunityDetailData(communityId);
}

function loadCommunityDetailData(communityId) {
    // 데모 커뮤니티 데이터
    const communities = {
        'community1': {
            name: '하이큐!! 팬클럽',
            icon: '🏐',
            members: 1250,
            posts: 342,
            description: '하이큐!! 애니메이션과 만화를 사랑하는 사람들의 모임입니다.'
        },
        'community2': {
            name: '일러스트 창작소',
            icon: '🎨',
            members: 890,
            posts: 567,
            description: '다양한 일러스트 작품을 공유하고 피드백을 나누는 공간입니다.'
        },
        'community3': {
            name: '원피스 토론방',
            icon: '⚓',
            members: 2100,
            posts: 891,
            description: '원피스 만화와 애니메이션에 대한 모든 이야기를 나누세요.'
        }
    };
    
    const community = communities[communityId];
    if (!community) return;
    
    // 헤더 정보 업데이트
    document.getElementById('currentCommunityAvatar').textContent = community.icon;
    document.getElementById('currentCommunityName').textContent = community.name;
    document.getElementById('currentCommunityMembers').textContent = `${community.members}명`;
    document.getElementById('currentCommunityPosts').textContent = `게시물 ${community.posts}개`;
    
    // 기본 탭 활성화
    switchCommunityTab('posts');
    loadCommunityPosts(communityId);
}

function switchCommunityTab(tab) {
    // 탭 상태 변경
    document.querySelectorAll('.community-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.community-tab').forEach(t => {
        if (t.getAttribute('data-tab') === tab) {
            t.classList.add('active');
        }
    });
    
    // 탭 콘텐츠 표시
    document.querySelectorAll('.community-tab-content').forEach(content => content.classList.remove('active'));
    const targetContent = document.getElementById(`community${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

function loadCommunityPosts(communityId) {
    const container = document.getElementById('communityPostsList');
    if (!container) return;
    
    // 데모 게시물 데이터
    const samplePosts = [
        {
            id: 'post1',
            title: '새로운 하이큐 시즌에 대한 기대',
            author: '팬아트러버',
            time: '2시간 전',
            content: '새로운 시즌이 정말 기대되네요! 여러분은 어떤 장면이 가장 기대되시나요?',
            likes: 15,
            comments: 8
        },
        {
            id: 'post2',
            title: '카게야마 팬아트 그려봤어요',
            author: '일러작가',
            time: '5시간 전',
            content: '오랜만에 카게야마 그려봤습니다. 피드백 부탁드려요!',
            likes: 32,
            comments: 12
        }
    ];
    
    container.innerHTML = '';
    samplePosts.forEach(post => {
        const postEl = createPostElement(post);
        container.appendChild(postEl);
    });
}

function createPostElement(post) {
    const div = document.createElement('div');
    div.className = 'community-post';
    div.style.cssText = `
        background: var(--bg-secondary);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 1rem;
        border: 1px solid var(--border-color);
    `;
    
    div.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 1rem;">
            <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(45deg, var(--accent-primary), var(--accent-secondary)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; margin-right: 1rem;">${post.author[0]}</div>
            <div>
                <h4 style="margin: 0; color: var(--text-primary);">${post.title}</h4>
                <p style="margin: 0; font-size: 0.8rem; color: var(--text-secondary);">${post.author} • ${post.time}</p>
            </div>
        </div>
        <p style="margin-bottom: 1rem; color: var(--text-secondary); line-height: 1.5;">${post.content}</p>
        <div style="display: flex; gap: 1rem; font-size: 0.8rem; color: var(--text-muted);">
            <span style="cursor: pointer;" onclick="likePost('${post.id}')">❤️ ${post.likes}</span>
            <span style="cursor: pointer;" onclick="showComments('${post.id}')">💬 ${post.comments}</span>
        </div>
    `;
    
    return div;
}

function likePost(postId) {
    showNotification('게시물을 좋아요했습니다! ❤️', 'success');
}

function showComments(postId) {
    showNotification('댓글 기능을 준비 중입니다! 💬', 'info');
}

function toggleJoinCommunity() {
    const btn = document.getElementById('joinBtn');
    if (btn.textContent === '참여하기') {
        btn.textContent = '참여 취소';
        btn.style.background = 'var(--bg-secondary)';
        btn.style.color = 'var(--text-primary)';
        showNotification('커뮤니티에 참여했습니다! 🎉', 'success');
    } else {
        btn.textContent = '참여하기';
        btn.style.background = 'var(--accent-primary)';
        btn.style.color = 'white';
        showNotification('커뮤니티 참여를 취소했습니다.', 'info');
    }
}

function shareCommunity() {
    showNotification('커뮤니티 공유 기능을 준비 중입니다! 📤', 'info');
}

function openCreateCommunityModal() {
    openModal('createCommunityModal');
}

function createCommunity() {
    const name = document.getElementById('communityName')?.value.trim();
    const category = document.getElementById('communityCategory')?.value;
    const description = document.getElementById('communityDescription')?.value.trim();
    
    if (!name) {
        showNotification('커뮤니티 이름을 입력해주세요.', 'error');
        return;
    }
    
    if (!category) {
        showNotification('카테고리를 선택해주세요.', 'error');
        return;
    }
    
    showNotification('커뮤니티가 생성되었습니다! 🎉', 'success');
    closeModal('createCommunityModal');
    
    // 폼 초기화
    document.getElementById('communityName').value = '';
    document.getElementById('communityCategory').value = '';
    document.getElementById('communityDescription').value = '';
}

function filterCommunities(category) {
    // 필터 버튼 상태 변경
    document.querySelectorAll('.community-filter').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    showNotification(`${category} 커뮤니티로 필터링 중...`, 'info');
    loadCommunityData(); // 실제로는 필터된 결과 로드
}

function openCreatePostModal() {
    showNotification('게시물 작성 기능을 준비 중입니다! ✏️', 'info');
}

// ===== 메시지 시스템 =====
function loadMessagesData() {
    loadChatRoomsList();
}

function loadChatRoomsList() {
    const container = document.getElementById('chatRoomsList');
    if (!container) return;
    
    const sampleRooms = [
        {
            id: 'room1',
            name: '일러스트 토론방',
            lastMessage: '새로운 작품 올렸어요!',
            time: '2분 전',
            unread: 3,
            type: 'group',
            avatar: '👥'
        },
        {
            id: 'room2',
            name: '김민수',
            lastMessage: '안녕하세요! 작품 정말 멋져요',
            time: '1시간 전',
            unread: 0,
            type: 'personal',
            avatar: '김'
        },
        {
            id: 'room3',
            name: '하이큐 팬클럽',
            lastMessage: '오늘 새 에피소드 나왔네요',
            time: '3시간 전',
            unread: 7,
            type: 'group',
            avatar: '🏐'
        }
    ];
    
    container.innerHTML = '';
    sampleRooms.forEach(room => {
        const roomEl = createChatRoomElement(room);
        container.appendChild(roomEl);
    });
}

function createChatRoomElement(room) {
    const div = document.createElement('div');
    div.className = 'chat-room';
    if (room.id === currentChatRoom?.id) {
        div.classList.add('active');
    }
    
    div.innerHTML = `
        <div class="chat-avatar">${room.avatar}</div>
        <div class="chat-user-info">
            <h4>${room.name}</h4>
            <div class="chat-preview">${room.lastMessage}</div>
        </div>
        <div style="position: absolute; top: 1rem; right: 1rem; font-size: 0.7rem; color: var(--text-muted);">${room.time}</div>
        ${room.unread > 0 ? `<div style="position: absolute; top: 0.8rem; right: 0.8rem; background: var(--error); color: white; border-radius: 50%; width: 18px; height: 18px; font-size: 0.7rem; display: flex; align-items: center; justify-content: center;">${room.unread}</div>` : ''}
    `;
    
    div.addEventListener('click', () => selectChatRoom(room.id, room));
    return div;
}

function selectChatRoom(roomId, roomData) {
    currentChatRoom = { id: roomId, ...roomData };
    loadChatRoomsList(); // 활성 상태 업데이트
    showChatRoomInterface(roomData);
}

function showChatRoomInterface(roomData) {
    const chatMain = document.getElementById('chatMain');
    if (!chatMain) return;
    
    chatMain.innerHTML = `
        <div style="display: flex; flex-direction: column; height: 100%;">
            <div style="padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-color); background: var(--bg-primary); display: flex; align-items: center; gap: 1rem;">
                <button style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--text-secondary);" onclick="closeChatRoom()">←</button>
                <div class="chat-avatar" style="width: 40px; height: 40px; margin: 0;">${roomData.avatar}</div>
                <div>
                    <h3 style="margin: 0; font-size: 1.1rem; color: var(--text-primary);">${roomData.name}</h3>
                    <span style="font-size: 0.8rem; color: var(--success);">온라인</span>
                </div>
            </div>
            
            <div style="flex: 1; padding: 1rem; overflow-y: auto; background: var(--bg-secondary);" id="messagesContainer">
                ${generateSampleMessages()}
            </div>
            
            <div style="padding: 1rem 1.5rem; border-top: 1px solid var(--border-color); background: var(--bg-primary);">
                <div style="display: flex; gap: 0.8rem; align-items: flex-end;">
                    <button style="background: var(--bg-tertiary); border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; color: var(--text-secondary);" onclick="openAttachmentMenu()">📎</button>
                    <div style="flex: 1; position: relative;">
                        <input type="text" id="messageInput" placeholder="메시지를 입력하세요..." style="width: 100%; padding: 0.8rem 3rem 0.8rem 1rem; border: 1px solid var(--border-color); border-radius: 20px; outline: none; background: var(--bg-primary); color: var(--text-primary);" onkeypress="handleMessageInput(event)">
                        <button style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 0.5rem; color: var(--text-secondary);" onclick="showEmojiPicker()">😊</button>
                    </div>
                    <button style="background: var(--accent-primary); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 1.2rem;" onclick="sendMessage()">➤</button>
                </div>
            </div>
        </div>
    `;
}

function generateSampleMessages() {
    return `
        <div style="margin-bottom: 1rem;">
            <div style="display: flex; margin-bottom: 0.5rem;">
                <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--accent-primary); display: flex; align-items: center; justify-content: center; color: white; margin-right: 0.8rem; font-size: 0.8rem; font-weight: 600;">👤</div>
                <div>
                    <div style="background: var(--bg-primary); padding: 0.8rem; border-radius: 12px; border-top-left-radius: 4px; box-shadow: var(--shadow-sm); border: 1px solid var(--border-color); color: var(--text-primary);">
                        안녕하세요! 잘 지내시나요?
                    </div>
                    <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.3rem;">오후 2:30</div>
                </div>
            </div>
        </div>
        
        <div style="margin-bottom: 1rem; display: flex; justify-content: flex-end;">
            <div>
                <div style="background: var(--accent-primary); color: white; padding: 0.8rem; border-radius: 12px; border-top-right-radius: 4px; max-width: 300px;">
                    네! 잘 지내고 있어요. 새 작품도 올렸답니다 😊
                </div>
                <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.3rem; text-align: right;">오후 2:32</div>
            </div>
        </div>
    `;
}

function closeChatRoom() {
    currentChatRoom = null;
    const chatMain = document.getElementById('chatMain');
    if (chatMain) {
        chatMain.innerHTML = `
            <div class="chat-welcome">
                <div class="welcome-icon">💬</div>
                <h3>채팅을 시작해보세요!</h3>
                <p>친구들과 실시간으로 소통하고 아이디어를 나눠보세요</p>
                <button class="start-chat-btn" onclick="openNewChatModal()">새 채팅 시작하기</button>
            </div>
        `;
    }
    loadChatRoomsList();
}

function handleMessageInput(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // 메시지를 채팅에 추가
    addMessageToChat(message, true);
    input.value = '';
    
    // 자동 응답 (데모용)
    setTimeout(() => {
        const responses = [
            '좋은 아이디어네요!',
            '정말 멋진 작품이에요 👏',
            '저도 그렇게 생각해요',
            '다음에 함께 작업해보아요!',
            '감사합니다 😊'
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessageToChat(randomResponse, false);
    }, 1000);
}

function addMessageToChat(message, isOwn) {
    const container = document.getElementById('messagesContainer');
    if (!container) return;
    
    const messageEl = document.createElement('div');
    messageEl.style.cssText = `
        margin-bottom: 1rem;
        display: flex;
        justify-content: ${isOwn ? 'flex-end' : 'flex-start'};
    `;
    
    messageEl.innerHTML = `
        ${!isOwn ? '<div style="width: 32px; height: 32px; border-radius: 50%; background: var(--accent-primary); display: flex; align-items: center; justify-content: center; color: white; margin-right: 0.8rem; font-size: 0.8rem; font-weight: 600;">👤</div>' : ''}
        <div>
            <div style="background: ${isOwn ? 'var(--accent-primary)' : 'var(--bg-primary)'}; color: ${isOwn ? 'white' : 'var(--text-primary)'}; padding: 0.8rem; border-radius: 12px; ${isOwn ? 'border-top-right-radius: 4px' : 'border-top-left-radius: 4px'}; max-width: 300px; ${!isOwn ? 'box-shadow: var(--shadow-sm); border: 1px solid var(--border-color);' : ''}">
                ${message}
            </div>
            <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 0.3rem; text-align: ${isOwn ? 'right' : 'left'};">방금 전</div>
        </div>
    `;
    
    container.appendChild(messageEl);
    container.scrollTop = container.scrollHeight;
}

function searchChats() {
    const query = document.getElementById('chatSearchInput')?.value.toLowerCase();
    const chatRooms = document.querySelectorAll('.chat-room');
    
    chatRooms.forEach(room => {
        const name = room.querySelector('h4')?.textContent.toLowerCase();
        const message = room.querySelector('.chat-preview')?.textContent.toLowerCase();
        
        if (!query || name?.includes(query) || message?.includes(query)) {
            room.style.display = 'flex';
        } else {
            room.style.display = 'none';
        }
    });
}

function switchChatTab(tab) {
    // 탭 상태 변경
    document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    showNotification(`${tab} 채팅방을 불러오는 중...`, 'info');
    loadChatRoomsList(); // 실제로는 탭에 따른 필터링
}

function openNewChatModal() {
    showNotification('새 채팅 기능을 준비 중입니다! 💬', 'info');
}

function openGroupChatModal() {
    showNotification('단체채팅 생성 기능을 준비 중입니다! 👥', 'info');
}

function openAttachmentMenu() {
    showNotification('파일 첨부 기능을 준비 중입니다! 📎', 'info');
}

function showEmojiPicker() {
    showNotification('이모지 선택 기능을 준비 중입니다! 😊', 'info');
}

// ===== 프로필 시스템 =====
function loadProfileData() {
    updateProfileStats();
    switchProfileTab('overview');
}

function updateProfileStats() {
    const stats = {
        statsWorks: Math.floor(Math.random() * 50) + 10,
        statsFollowers: Math.floor(Math.random() * 1000) + 100,
        statsFollowing: Math.floor(Math.random() * 200) + 50,
        statsViews: Math.floor(Math.random() * 10000) + 1000
    };
    
    Object.entries(stats).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value.toLocaleString();
        }
    });
}

function switchProfileTab(tab) {
    // 탭 상태 변경
    document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    // 탭 콘텐츠 표시
    document.querySelectorAll('.profile-tab-content').forEach(content => content.classList.remove('active'));
    const targetContent = document.getElementById(`profile${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    loadProfileTabData(tab);
}

function loadProfileTabData(tab) {
    switch (tab) {
        case 'overview':
            loadRecentActivity();
            loadPopularWorks();
            break;
        case 'works':
            loadUserWorks();
            break;
        case 'collections':
            loadUserCollections();
            break;
        case 'communities':
            loadJoinedCommunities();
            break;
    }
}

function loadRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
    const activities = [
        '새 작품 "하이큐 팬아트" 업로드',
        '커뮤니티 "일러스트 창작소"에 참여',
        '작품에 좋아요 15개 받음',
        '새 팔로워 3명 증가'
    ];
    
    container.innerHTML = activities.map(activity => 
        `<div style="padding: 0.8rem; background: var(--bg-secondary); border-radius: 8px; margin-bottom: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">${activity}</div>`
    ).join('');
}

function loadPopularWorks() {
    const container = document.getElementById('popularWorks');
    if (!container) return;
    
    const works = sampleWorks.slice(0, 3);
    container.innerHTML = works.map(work => 
        `<div style="padding: 0.8rem; background: var(--bg-secondary); border-radius: 8px; margin-bottom: 0.5rem; font-size: 0.9rem; cursor: pointer; color: var(--text-secondary);" onclick="showWorkDetail('${work.id}')">${work.title}</div>`
    ).join('');
}

function loadUserWorks() {
    const container = document.getElementById('userWorksGrid');
    if (!container) return;
    
    container.innerHTML = '';
    sampleWorks.slice(0, 6).forEach(work => {
        const workEl = createWorkElement(work);
        container.appendChild(workEl);
    });
}

function loadUserCollections() {
    const container = document.getElementById('collectionsGrid');
    if (!container) return;
    
    container.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
            <h3 style="color: var(--text-primary);">컬렉션이 없습니다</h3>
            <p>첫 번째 컬렉션을 만들어보세요!</p>
            <button class="create-btn" onclick="createCollection()" style="margin-top: 1rem; background: var(--accent-primary); color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 25px; cursor: pointer;">컬렉션 만들기</button>
        </div>
    `;
}

function loadJoinedCommunities() {
    const container = document.getElementById('joinedCommunities');
    if (!container) return;
    
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
            <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--border-color);">
                <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                    <div style="width: 40px; height: 40px; border-radius: 8px; background: linear-gradient(45deg, var(--accent-primary), var(--accent-secondary)); display: flex; align-items: center; justify-content: center; margin-right: 1rem; color: white; font-size: 1.2rem;">🎨</div>
                    <div>
                        <h4 style="margin: 0; color: var(--text-primary);">일러스트 창작소</h4>
                        <p style="margin: 0; font-size: 0.8rem; color: var(--text-secondary);">890명</p>
                    </div>
                </div>
                <p style="margin: 0; font-size: 0.9rem; color: var(--text-secondary);">일러스트 작품 공유 커뮤니티</p>
            </div>
        </div>
    `;
}

function createCollection() {
    showNotification('컬렉션 생성 기능을 준비 중입니다! 📚', 'info');
}

function editProfile() {
    showNotification('프로필 편집 기능을 준비 중입니다! ✏️', 'info');
}

function shareProfile() {
    showNotification('프로필 공유 기능을 준비 중입니다! 📤', 'info');
}

function goToProfile() {
    navigateTo('profile');
}

// ===== 다크모드 시스템 =====
function toggleDarkMode() {
    if (isDarkMode) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    isDarkMode = true;
    localStorage.setItem('creta-theme', 'dark');
    
    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) {
        themeBtn.textContent = '☀️';
        themeBtn.title = '라이트 모드로 전환';
    }
    
    showNotification('다크 모드가 활성화되었습니다 🌙', 'info');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    isDarkMode = false;
    localStorage.setItem('creta-theme', 'light');
    
    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) {
        themeBtn.textContent = '🌙';
        themeBtn.title = '다크 모드로 전환';
    }
    
    showNotification('라이트 모드가 활성화되었습니다 ☀️', 'info');
}

// ===== 알림 시스템 =====
function openNotifications() {
    const panel = document.getElementById('notificationsPanel');
    if (!panel) {
        createNotificationsPanel();
    } else {
        const isVisible = panel.style.display === 'block';
        if (isVisible) {
            hideNotificationsPanel();
        } else {
            showNotificationsPanel();
        }
    }
}

function createNotificationsPanel() {
    const notificationBtn = document.querySelector('.notification-btn');
    
    const panel = document.createElement('div');
    panel.id = 'notificationsPanel';
    panel.className = 'notifications-panel';
    panel.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        width: 350px;
        max-height: 500px;
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        box-shadow: var(--shadow-xl);
        z-index: 1000;
        overflow: hidden;
        animation: slideDown 0.3s ease;
        display: none;
    `;
    
    panel.innerHTML = `
        <div style="padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-color); background: var(--bg-secondary); display: flex; justify-content: space-between; align-items: center;">
            <h3 style="font-size: 1.1rem; font-weight: 600; color: var(--text-primary); margin: 0;">🔔 알림</h3>
            <button onclick="markAllNotificationsRead()" style="background: none; border: none; color: var(--accent-primary); cursor: pointer; font-size: 0.85rem; font-weight: 500; padding: 0.5rem; border-radius: 6px; transition: all 0.2s ease;">모두 읽기</button>
        </div>
        <div style="max-height: 400px; overflow-y: auto;" id="notificationsList">
            ${renderNotifications()}
        </div>
    `;
    
    notificationBtn.style.position = 'relative';
    notificationBtn.appendChild(panel);
    
    showNotificationsPanel();
}

function renderNotifications() {
    if (notifications.length === 0) {
        return `
            <div style="padding: 3rem 1.5rem; text-align: center; color: var(--text-secondary);">
                <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">새로운 알림이 없습니다</h4>
                <p>활동이 있으면 여기에 알림이 표시됩니다</p>
            </div>
        `;
    }
    
    return notifications.map(notification => `
        <div onclick="markNotificationRead('${notification.id}')" style="padding: 1rem 1.5rem; border-bottom: 1px solid var(--border-color); cursor: pointer; transition: all 0.2s ease; display: flex; align-items: flex-start; gap: 0.8rem; ${!notification.read ? 'background: rgba(59, 130, 246, 0.03); border-left: 3px solid var(--accent-primary);' : ''}" onmouseover="this.style.background='var(--bg-secondary)'" onmouseout="this.style.background='${!notification.read ? 'rgba(59, 130, 246, 0.03)' : 'transparent'}'">
            <div style="width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; flex-shrink: 0; background: ${getNotificationColor(notification.type)}; color: white;">${notification.icon}</div>
            <div style="flex: 1;">
                <div style="font-size: 0.9rem; color: var(--text-primary); line-height: 1.4; margin-bottom: 0.25rem;">${notification.message}</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">${notification.time}</div>
            </div>
        </div>
    `).join('');
}

function getNotificationColor(type) {
    const colors = {
        like: 'linear-gradient(45deg, #ef4444, #dc2626)',
        comment: 'linear-gradient(45deg, #10b981, #059669)',
        follow: 'linear-gradient(45deg, #3b82f6, #2563eb)',
        subscribe: 'linear-gradient(45deg, #f59e0b, #d97706)'
    };
    return colors[type] || colors.subscribe;
}

function showNotificationsPanel() {
    const panel = document.getElementById('notificationsPanel');
    if (panel) {
        panel.style.display = 'block';
        
        const listContainer = document.getElementById('notificationsList');
        if (listContainer) {
            listContainer.innerHTML = renderNotifications();
        }
    }
}

function hideNotificationsPanel() {
    const panel = document.getElementById('notificationsPanel');
    if (panel) {
        panel.style.display = 'none';
    }
}

function markNotificationRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.read = true;
        updateNotificationBadge();
        showNotificationsPanel();
    }
}

function markAllNotificationsRead() {
    notifications.forEach(notification => {
        notification.read = true;
    });
    updateNotificationBadge();
    showNotificationsPanel();
    showNotification('모든 알림을 읽음으로 표시했습니다 ✅', 'success');
}

function updateNotificationBadge() {
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = document.querySelector('.notification-btn .badge');
    
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

function addNotification(type, message, icon = '🔔') {
    const newNotification = {
        id: 'notif_' + Date.now(),
        type: type,
        message: message,
        time: '방금 전',
        read: false,
        icon: icon
    };
    
    notifications.unshift(newNotification);
    updateNotificationBadge();
}

// ===== 모달 시스템 =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

// ===== 사이드바 토글 =====
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

// ===== 알림 토스트 시스템 =====
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.toast-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    
    const colors = {
        success: '#10b981',
        error: '#ef4444', 
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow-xl);
        z-index: 10001;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
        word-wrap: break-word;
        backdrop-filter: blur(10px);
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 3000);
}

// ===== CSS 애니메이션 추가 =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ===== 에디터 기능 =====
function formatText(command) {
    showNotification('텍스트 서식 기능을 준비 중입니다!', 'info');
}

function insertEmoji() {
    showNotification('이모지 삽입 기능을 준비 중입니다! 😊', 'info');
}

function insertLink() {
    showNotification('링크 삽입 기능을 준비 중입니다! 🔗', 'info');
}

// ===== 초기화 완료 =====
console.log('🎨 CRETA 플랫폼 JavaScript 완전 로드 완료!');
console.log('✅ 모든 기능이 활성화되었습니다:');
console.log('  🏠 홈페이지 - 캐러셀과 작품 표시');
console.log('  📤 작품 업로드 - 3단계 시스템');
console.log('  👥 커뮤니티 - 목록 및 상세 페이지');
console.log('  💬 메시지 - 카카오톡 스타일 채팅');
console.log('  👤 프로필 - 통계 및 탭 시스템');
console.log('  🔔 알림 - 배지와 패널 시스템');
console.log('  🌙 다크모드 - 테마 전환');
console.log('  🔍 검색 - 전역 검색과 제안');
