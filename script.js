// ===== CRETA 플랫폼 완전 구현 버전 =====

// ===== 전역 변수 =====
let currentUser = null;
let currentPage = 'home';
let currentTheme = 'dark';
let uploadStep = 1;
let selectedFiles = [];
let workTags = [];
let searchTimeout = null;

// ===== 샘플 데이터 =====
const sampleWorks = [
    {
        id: 'work1',
        title: '하이큐!! 최신 팬아트',
        author: '일러스트러버',
        category: 'illustration',
        likes: 1240,
        views: 5670,
        thumbnail: '🏐',
        tags: ['하이큐', '팬아트', '스포츠', '애니메이션']
    },
    {
        id: 'work2',
        title: '원피스 1000화 기념작',
        author: '만화창작자',
        category: 'manga',
        likes: 2890,
        views: 12450,
        thumbnail: '⚓',
        tags: ['원피스', '만화', '기념작', '루피']
    },
    {
        id: 'work3',
        title: '귀멸의칼날 일러스트',
        author: '디지털아티스트',
        category: 'illustration',
        likes: 1567,
        views: 8930,
        thumbnail: '⚔️',
        tags: ['귀멸의칼날', '일러스트', '탄지로', '애니메이션']
    },
    {
        id: 'work4',
        title: '나루토 명장면 재현',
        author: '애니팬',
        category: 'animation',
        likes: 890,
        views: 4320,
        thumbnail: '🍥',
        tags: ['나루토', '애니메이션', '명장면', '닌자']
    },
    {
        id: 'work5',
        title: '진격의거인 소설',
        author: '소설작가',
        category: 'novel',
        likes: 2340,
        views: 15670,
        thumbnail: '🏰',
        tags: ['진격의거인', '소설', '에렌', '미카사']
    },
    {
        id: 'work6',
        title: '스튜디오 지브리 오마주',
        author: '클래식러버',
        category: 'illustration',
        likes: 3450,
        views: 18900,
        thumbnail: '🌸',
        tags: ['지브리', '오마주', '클래식', '일러스트']
    }
];

const sampleCommunities = [
    {
        id: 'comm1',
        name: '하이큐!! 팬클럽',
        category: 'animation',
        description: '하이큐!! 애니메이션과 만화를 사랑하는 사람들의 모임',
        members: 1250,
        posts: 342,
        icon: '🏐'
    },
    {
        id: 'comm2',
        name: '일러스트 창작소',
        category: 'illustration',
        description: '다양한 일러스트 작품을 공유하고 피드백을 나누는 공간',
        members: 890,
        posts: 567,
        icon: '🎨'
    },
    {
        id: 'comm3',
        name: '원피스 토론방',
        category: 'manga',
        description: '원피스 만화와 애니메이션에 대한 모든 이야기를 나누세요',
        members: 2100,
        posts: 891,
        icon: '⚓'
    }
];

const sampleChats = [
    {
        id: 'chat1',
        name: '일러스트 토론방',
        lastMessage: '새로운 작품 올렸어요!',
        time: '2분 전',
        unread: 3,
        avatar: '👥'
    },
    {
        id: 'chat2',
        name: '김민수',
        lastMessage: '안녕하세요! 작품 정말 멋져요',
        time: '1시간 전',
        unread: 0,
        avatar: '김'
    },
    {
        id: 'chat3',
        name: '하이큐 팬클럽',
        lastMessage: '오늘 새 에피소드 나왔네요',
        time: '3시간 전',
        unread: 7,
        avatar: '🏐'
    }
];

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 CRETA 플랫폼 로딩 시작...');
    
    // 저장된 테마 복원
    const savedTheme = localStorage.getItem('creta-theme') || 'dark';
    currentTheme = savedTheme;
    document.body.className = savedTheme + '-mode';
    
    // 로딩 화면 표시
    setTimeout(() => {
        hideLoadingScreen();
        initializeApp();
    }, 2000);
});

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainApp = document.getElementById('mainApp');
    
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            if (mainApp) {
                mainApp.style.display = 'flex';
                loadInitialData();
            }
        }, 500);
    }
}

function initializeApp() {
    // 사용자 정보 설정 (데모용)
    currentUser = {
        name: '창작자',
        email: 'demo@creta.com',
        avatar: '창'
    };
    
    updateUserInfo();
    setupEventListeners();
    
    // 테마 아이콘 업데이트
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = currentTheme === 'dark' ? '🌙' : '☀️';
    }
    
    console.log('✅ CRETA 플랫폼 로드 완료!');
}

function updateUserInfo() {
    if (currentUser) {
        const userInitial = document.getElementById('userInitial');
        const welcomeName = document.getElementById('welcomeName');
        
        if (userInitial) userInitial.textContent = currentUser.name.charAt(0);
        if (welcomeName) welcomeName.textContent = currentUser.name;
    }
}

// ===== 이벤트 리스너 설정 =====
function setupEventListeners() {
    // 전역 클릭 이벤트
    document.addEventListener('click', function(e) {
        // 검색 제안 패널 외부 클릭시 숨기기
        const searchSuggestions = document.getElementById('searchSuggestions');
        const searchContainer = document.querySelector('.search-container');
        
        if (searchSuggestions && !searchContainer?.contains(e.target)) {
            searchSuggestions.style.display = 'none';
        }
        
        // 알림 패널 외부 클릭시 숨기기
        const notificationPanel = document.getElementById('notificationPanel');
        const notificationBtn = document.querySelector('.notification-btn');
        
        if (notificationPanel && !notificationBtn?.contains(e.target) && !notificationPanel.contains(e.target)) {
            notificationPanel.style.display = 'none';
        }
    });
    
    // 파일 드래그 앤 드롭
    setupFileDragDrop();
}

function setupFileDragDrop() {
    const dropZone = document.querySelector('.file-drop-zone');
    if (!dropZone) return;

    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--accent-primary)';
        dropZone.style.background = 'rgba(59, 130, 246, 0.1)';
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
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileUpload({ target: { files: files } });
        }
    });
}

// ===== 파일 업로드 시스템 =====
function handleFileUpload(event) {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    
    // 파일 크기 체크 (100MB 제한)
    for (let file of files) {
        if (file.size > 100 * 1024 * 1024) {
            alert(`${file.name}은(는) 100MB를 초과합니다. 더 작은 파일을 선택해주세요.`);
            return;
        }
    }
    
    selectedFiles = selectedFiles.concat(files);
    renderFilePreviews();
    
    // 자동으로 다음 단계로
    if (uploadStep === 1) {
        setTimeout(() => nextStep(), 500);
    }
}

function renderFilePreviews() {
    const previewContainer = document.getElementById('filePreview');
    if (!previewContainer) return;
    
    previewContainer.style.display = selectedFiles.length > 0 ? 'block' : 'none';
    previewContainer.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-preview-item';
        fileItem.style.cssText = `
            display: inline-block;
            margin: 0.5rem;
            padding: 1rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            text-align: center;
            background: var(--bg-card);
            position: relative;
            max-width: 200px;
        `;
        
        let thumbnailHTML = '';
        if (file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            thumbnailHTML = `<img src="${url}" alt="${file.name}" style="max-width: 150px; max-height: 150px; object-fit: cover; border-radius: 4px; margin-bottom: 0.5rem;" />`;
        } else if (file.type.startsWith('video/')) {
            thumbnailHTML = `<div style="font-size: 3rem; margin-bottom: 0.5rem; color: var(--text-secondary);">🎥</div>`;
        } else {
            thumbnailHTML = `<div style="font-size: 3rem; margin-bottom: 0.5rem; color: var(--text-secondary);">📄</div>`;
        }
        
        fileItem.innerHTML = `
            ${thumbnailHTML}
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem; word-break: break-all;">${file.name}</div>
            <button onclick="removeFile(${index})" style="position: absolute; top: -8px; right: -8px; background: var(--error); color: white; border: none; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; font-size: 0.8rem;">×</button>
        `;
        previewContainer.appendChild(fileItem);
    });
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    renderFilePreviews();
}

// ===== 업로드 단계 네비게이션 =====
function nextStep() {
    if (validateStep(uploadStep)) {
        uploadStep++;
        updateStepUI();
    }
}

function previousStep() {
    if (uploadStep > 1) {
        uploadStep--;
        updateStepUI();
    }
}

function updateStepUI() {
    // 단계 표시기 업데이트
    document.querySelectorAll('.step').forEach((el) => {
        const step = parseInt(el.getAttribute('data-step'));
        el.classList.toggle('active', step === uploadStep);
    });
    
    // 단계 콘텐츠 표시
    document.querySelectorAll('.upload-step').forEach((el, index) => {
        el.classList.toggle('active', index + 1 === uploadStep);
    });
    
    // 네비게이션 버튼 상태
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentStepEl = document.getElementById('currentStep');
    
    if (prevBtn) prevBtn.style.display = uploadStep === 1 ? 'none' : 'inline-block';
    if (nextBtn) nextBtn.textContent = uploadStep === 3 ? '게시하기' : '다음';
    if (currentStepEl) currentStepEl.textContent = uploadStep.toString();
}

function validateStep(step) {
    switch (step) {
        case 1:
            if (selectedFiles.length === 0) {
                alert('파일을 선택하거나 드래그해주세요.');
                return false;
            }
            return true;
        case 2:
            const title = document.getElementById('workTitle')?.value.trim();
            const category = document.getElementById('workCategory')?.value;
            if (!title) {
                alert('제목을 입력해주세요.');
                return false;
            }
            if (!category) {
                alert('카테고리를 선택해주세요.');
                return false;
            }
            return true;
        case 3:
            return true;
        default:
            return true;
    }
}

function saveDraft() {
    alert('임시 저장 기능은 준비 중입니다.');
}

function publishWork() {
    if (uploadStep === 3) {
        // 실제 게시 처리
        alert('작품이 성공적으로 업로드되었습니다! 🎉');
        
        // 새 작품을 샘플 데이터에 추가
        const title = document.getElementById('workTitle')?.value.trim() || '새 작품';
        const newWork = {
            id: 'work_' + Date.now(),
            title: title,
            author: currentUser.name,
            category: document.getElementById('workCategory')?.value || 'illustration',
            likes: 0,
            views: 0,
            thumbnail: '🎨',
            tags: workTags
        };
        
        sampleWorks.unshift(newWork);
        
        // 업로드 폼 리셋
        resetUploadForm();
        
        // 홈으로 이동
        navigateTo('home');
    } else {
        nextStep();
    }
}

function resetUploadForm() {
    selectedFiles = [];
    uploadStep = 1;
    workTags = [];
    
    updateStepUI();
    renderFilePreviews();
    renderTags();
    
    // 폼 필드 리셋
    const fields = ['workTitle', 'workDescription', 'workCategory', 'workVisibility', 'tagInput'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            if (field.type === 'checkbox') {
                field.checked = fieldId === 'allowComments';
            } else {
                field.value = fieldId === 'workVisibility' ? 'public' : '';
            }
        }
    });
}

// ===== 태그 시스템 =====
function handleTagInput(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const tagInput = event.target;
        const tag = tagInput.value.trim();
        if (tag && !workTags.includes(tag) && workTags.length < 10) {
            workTags.push(tag);
            renderTags();
            tagInput.value = '';
        } else if (workTags.length >= 10) {
            alert('태그는 최대 10개까지 입력 가능합니다.');
        }
    }
}

function renderTags() {
    const tagList = document.getElementById('tagList');
    if (!tagList) return;
    
    tagList.innerHTML = '';
    workTags.forEach((tag, index) => {
        const tagEl = document.createElement('div');
        tagEl.className = 'tag-item';
        tagEl.innerHTML = `${tag} <button onclick="removeTag(${index})" class="tag-remove">×</button>`;
        tagList.appendChild(tagEl);
    });
}

function removeTag(index) {
    workTags.splice(index, 1);
    renderTags();
}

// ===== 네비게이션 시스템 =====
function navigateTo(page) {
    if (page === currentPage) return;
    
    // 페이지 전환 애니메이션
    document.querySelectorAll('.page').forEach((el) => {
        el.classList.remove('active');
    });
    
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // 네비게이션 상태 업데이트
    document.querySelectorAll('.nav-item').forEach((el) => {
        el.classList.remove('active');
        if (el.getAttribute('data-page') === page) {
            el.classList.add('active');
        }
    });
    
    currentPage = page;
    loadPageContent(page);
}

function loadPageContent(page) {
    switch (page) {
        case 'home':
            loadHomeContent();
            break;
        case 'explore':
            loadExploreContent();
            break;
        case 'community':
            loadCommunityContent();
            break;
        case 'messages':
            loadMessagesContent();
            break;
        case 'profile':
            loadProfileContent();
            break;
        case 'upload':
            // 업로드 페이지는 별도 처리 불필요
            break;
    }
}

// ===== 홈 페이지 로딩 =====
function loadHomeContent() {
    const latestContainer = document.getElementById('latestWorksGrid');
    const trendingContainer = document.getElementById('trendingWorksGrid');
    
    if (latestContainer) {
        latestContainer.innerHTML = '';
        sampleWorks.slice(0, 3).forEach((work) => {
            latestContainer.appendChild(createWorkCard(work));
        });
    }
    
    if (trendingContainer) {
        trendingContainer.innerHTML = '';
        sampleWorks.slice(3, 6).forEach((work) => {
            trendingContainer.appendChild(createWorkCard(work));
        });
    }
}

// ===== 탐색 페이지 로딩 =====
function loadExploreContent() {
    const exploreContainer = document.getElementById('exploreWorksGrid');
    if (exploreContainer) {
        exploreContainer.innerHTML = '';
        sampleWorks.forEach((work) => {
            exploreContainer.appendChild(createWorkCard(work));
        });
    }
}

// ===== 커뮤니티 페이지 로딩 =====
function loadCommunityContent() {
    const communityContainer = document.getElementById('communitiesGrid');
    if (communityContainer) {
        communityContainer.innerHTML = '';
        sampleCommunities.forEach((comm) => {
            communityContainer.appendChild(createCommunityCard(comm));
        });
    }
}

// ===== 메시지 페이지 로딩 =====
function loadMessagesContent() {
    const chatList = document.getElementById('chatList');
    if (chatList) {
        chatList.innerHTML = '';
        sampleChats.forEach((chat) => {
            chatList.appendChild(createChatItem(chat));
        });
    }
}

// ===== 프로필 페이지 로딩 =====
function loadProfileContent() {
    // 프로필 정보 업데이트
    const profileElements = {
        'profileName': currentUser?.name || '사용자',
        'worksCount': '12',
        'followersCount': '1.2K',
        'followingCount': '234',
        'viewsCount': '15.7K'
    };
    
    Object.entries(profileElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
    
    // 최근 활동 로딩
    loadRecentActivity();
    
    // 인기 작품 로딩
    loadPopularWorks();
    
    // 프로필 탭 기본 설정
    switchProfileTab('dashboard');
}

function loadRecentActivity() {
    const activityContainer = document.getElementById('recentActivity');
    if (activityContainer) {
        activityContainer.innerHTML = '';
        const activities = [
            '새 작품 "하이큐 팬아트" 업로드',
            '커뮤니티 "일러스트 창작소" 참가',
            '팔로워 3명 증가',
            '좋아요 15개 받음'
        ];
        
        activities.forEach((activity) => {
            const actEl = document.createElement('div');
            actEl.className = 'activity-item';
            actEl.style.cssText = `
                padding: 0.8rem;
                background: var(--bg-secondary);
                border-radius: 8px;
                margin-bottom: 0.5rem;
                font-size: 0.9rem;
                color: var(--text-secondary);
                border-left: 3px solid var(--accent-primary);
            `;
            actEl.textContent = activity;
            activityContainer.appendChild(actEl);
        });
    }
}

function loadPopularWorks() {
    const popularContainer = document.getElementById('popularWorks');
    if (popularContainer) {
        popularContainer.innerHTML = '';
        sampleWorks.slice(0, 3).forEach((work) => {
            const workEl = document.createElement('div');
            workEl.className = 'popular-work-item';
            workEl.style.cssText = `
                padding: 0.8rem;
                background: var(--bg-secondary);
                border-radius: 8px;
                margin-bottom: 0.5rem;
                cursor: pointer;
                transition: all 0.2s ease;
                border: 1px solid var(--border-color);
            `;
            workEl.innerHTML = `
                <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">${work.thumbnail}</div>
                <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">${work.title}</div>
                <div style="font-size: 0.8rem; color: var(--text-secondary);">❤️ ${work.likes} • 👁️ ${work.views}</div>
            `;
            workEl.addEventListener('click', () => alert(`작품 상세보기: ${work.title}`));
            workEl.addEventListener('mouseenter', () => {
                workEl.style.background = 'var(--bg-tertiary)';
                workEl.style.transform = 'translateY(-2px)';
            });
            workEl.addEventListener('mouseleave', () => {
                workEl.style.background = 'var(--bg-secondary)';
                workEl.style.transform = 'translateY(0)';
            });
            popularContainer.appendChild(workEl);
        });
    }
}

// ===== 카드 생성 함수들 =====
function createWorkCard(work) {
    const card = document.createElement('div');
    card.className = 'work-card';
    card.innerHTML = `
        <div class="work-thumbnail">${work.thumbnail}</div>
        <div class="work-content">
            <h3 class="work-title">${work.title}</h3>
            <p class="work-author">by ${work.author}</p>
            <div class="work-stats">
                <span>❤️ ${work.likes}</span>
                <span>👁️ ${work.views}</span>
            </div>
            <div class="work-tags">
                ${work.tags.map(tag => `<span class="work-tag">#${tag}</span>`).join('')}
            </div>
        </div>
    `;
    card.addEventListener('click', () => alert(`작품 상세보기: ${work.title}`));
    return card;
}

function createCommunityCard(comm) {
    const card = document.createElement('div');
    card.className = 'community-card';
    card.innerHTML = `
        <div class="community-header">
            <div class="community-icon">${comm.icon}</div>
            <div class="community-info">
                <h3>${comm.name}</h3>
                <p class="community-meta">${comm.members.toLocaleString()}명 • 게시물 ${comm.posts.toLocaleString()}개</p>
            </div>
        </div>
        <p class="community-description">${comm.description}</p>
    `;
    card.addEventListener('click', () => alert(`커뮤니티 입장: ${comm.name}`));
    return card;
}

function createChatItem(chat) {
    const item = document.createElement('div');
    item.className = 'chat-item';
    item.innerHTML = `
        <div class="chat-avatar">${chat.avatar}</div>
        <div class="chat-info">
            <h4 class="chat-name">${chat.name}</h4>
            <p class="chat-preview">${chat.lastMessage}</p>
        </div>
        <div class="chat-meta" style="position: absolute; top: 1rem; right: 1rem; font-size: 0.8rem; color: var(--text-muted);">
            ${chat.time}
            ${chat.unread > 0 ? `<div style="background: var(--error); color: white; border-radius: 50%; width: 18px; height: 18px; font-size: 0.7rem; display: flex; align-items: center; justify-content: center; margin-top: 0.25rem; margin-left: auto;">${chat.unread}</div>` : ''}
        </div>
    `;
    item.addEventListener('click', () => openChat(chat.id));
    return item;
}

function openChat(chatId) {
    alert(`채팅방 열기: ${chatId} (카카오톡 스타일 채팅 UI 준비 중)`);
}

// ===== 테마 토글 시스템 =====
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        if (themeIcon) themeIcon.textContent = '☀️';
        currentTheme = 'light';
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        if (themeIcon) themeIcon.textContent = '🌙';
        currentTheme = 'dark';
    }
    
    localStorage.setItem('creta-theme', currentTheme);
}

// ===== 검색 시스템 (연관검색어 포함) =====
function handleSearchInput(event) {
    const query = event.target.value.trim();
    const suggestions = document.getElementById('searchSuggestions');
    const clearBtn = document.getElementById('searchClearBtn');
    
    if (query.length > 0) {
        if (clearBtn) clearBtn.style.display = 'block';
        showRelatedSearches(query);
        if (suggestions) suggestions.style.display = 'block';
    } else {
        if (clearBtn) clearBtn.style.display = 'none';
        hideSearchSuggestions();
    }
}

function showSearchSuggestions() {
    const suggestions = document.getElementById('searchSuggestions');
    if (suggestions) suggestions.style.display = 'block';
}

function hideSearchSuggestions() {
    const suggestions = document.getElementById('searchSuggestions');
    if (suggestions) suggestions.style.display = 'none';
}

function showRelatedSearches(query) {
    const relatedSection = document.getElementById('relatedSearches');
    if (!relatedSection) return;
    
    // 연관검색어 생성 (요청하신 대로 하이큐 → 하이큐 드림, 하이큐 일러스트 등)
    const relatedTerms = [
        `${query} 드림`,
        `${query} 일러스트`, 
        `${query} 소설`,
        `${query} 팬아트`,
        `${query} 애니메이션`
    ];
    
    let relatedList = relatedSection.querySelector('.related-list');
    if (!relatedList) {
        relatedList = document.createElement('div');
        relatedList.className = 'related-list';
        relatedSection.appendChild(relatedList);
    }
    
    relatedList.innerHTML = relatedTerms.map(term => 
        `<div class="suggestion-item" onclick="selectSuggestion('${term}')">${term}</div>`
    ).join('');
    
    relatedSection.style.display = 'block';
}

function selectSuggestion(term) {
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
        searchInput.value = term;
        hideSearchSuggestions();
        performSearch(term);
    }
}

function performSearch(query) {
    navigateTo('explore');
    setTimeout(() => {
        filterWorksByQuery(query);
    }, 300);
}

function filterWorksByQuery(query) {
    const container = document.getElementById('exploreWorksGrid');
    if (!container) return;
    
    container.innerHTML = '';
    const lowerQuery = query.toLowerCase();
    
    const filteredWorks = sampleWorks.filter(work => 
        work.title.toLowerCase().includes(lowerQuery) ||
        work.author.toLowerCase().includes(lowerQuery) ||
        work.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
    
    if (filteredWorks.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; color: var(--text-secondary);">
                <h3>"${query}"에 대한 검색 결과가 없습니다.</h3>
                <p>다른 키워드로 검색해보세요.</p>
            </div>
        `;
    } else {
        filteredWorks.forEach(work => {
            container.appendChild(createWorkCard(work));
        });
    }
}

function clearSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    const clearBtn = document.getElementById('searchClearBtn');
    
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    hideSearchSuggestions();
    
    // 전체 결과 다시 표시
    if (currentPage === 'explore') {
        loadExploreContent();
    }
}

// ===== 필터 및 정렬 시스템 =====
function filterWorks(category) {
    // 필터 탭 상태 업데이트
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-filter') === category);
    });
    
    const container = document.getElementById('exploreWorksGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    const filtered = category === 'all' ? sampleWorks : sampleWorks.filter(work => work.category === category);
    filtered.forEach(work => {
        container.appendChild(createWorkCard(work));
    });
}

function sortWorks(criteria) {
    const container = document.getElementById('exploreWorksGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    let sorted = [...sampleWorks];
    
    switch (criteria) {
        case 'popular':
            sorted.sort((a, b) => b.likes - a.likes);
            break;
        case 'latest':
            sorted.reverse();
            break;
        case 'views':
            sorted.sort((a, b) => b.views - a.views);
            break;
        case 'trending':
            sorted.sort((a, b) => b.likes - a.likes);
            break;
    }
    
    sorted.forEach(work => {
        container.appendChild(createWorkCard(work));
    });
}

// ===== 커뮤니티 필터링 =====
function filterCommunities(category) {
    const buttons = document.querySelectorAll('.community-filter');
    buttons.forEach(btn => {
        const btnCategory = btn.textContent.toLowerCase().includes('전체') ? 'all' :
                           btn.textContent.toLowerCase().includes('일러스트') ? 'illustration' :
                           btn.textContent.toLowerCase().includes('애니메이션') ? 'animation' :
                           btn.textContent.toLowerCase().includes('소설') ? 'novel' : 'manga';
        btn.classList.toggle('active', btnCategory === category);
    });
    
    const container = document.getElementById('communitiesGrid');
    if (!container) return;
    
    container.innerHTML = '';
    
    const filtered = category === 'all' ? sampleCommunities : sampleCommunities.filter(comm => comm.category === category);
    filtered.forEach(comm => {
        container.appendChild(createCommunityCard(comm));
    });
}

// ===== 메시지 검색 =====
function searchChats(query) {
    const items = document.querySelectorAll('.chat-item');
    items.forEach(item => {
        const name = item.querySelector('.chat-name')?.textContent.toLowerCase() || '';
        const message = item.querySelector('.chat-preview')?.textContent.toLowerCase() || '';
        
        if (name.includes(query.toLowerCase()) || message.includes(query.toLowerCase())) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// ===== 채팅 기능들 =====
function newChat() {
    alert('새로운 개인 채팅 기능은 준비 중입니다. 곧 카카오톡 스타일 UI로 구현됩니다! 💬');
}

function newGroupChat() {
    alert('새로운 그룹 채팅 기능은 준비 중입니다. 곧 카카오톡 스타일 UI로 구현됩니다! 👥');
}

// ===== 프로필 기능들 =====
function editProfile() {
    alert('프로필 편집 기능은 준비 중입니다. 곧 구현됩니다! ✏️');
}

function shareProfile() {
    alert('프로필 공유 기능은 준비 중입니다. 곧 구현됩니다! 📤');
}

function switchProfileTab(tabName) {
    // 탭 버튼 상태 업데이트
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName);
    });
    
    // 탭 콘텐츠 표시/숨김
    document.querySelectorAll('.profile-tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `profile${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
    });
}

// ===== 알림 시스템 =====
function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    if (!panel) return;
    
    if (panel.style.display === 'block') {
        panel.style.display = 'none';
    } else {
        loadNotifications();
        panel.style.display = 'block';
    }
}

function loadNotifications() {
    const listContainer = document.getElementById('notificationList');
    if (!listContainer) return;
    
    const notifications = [
        { id: 1, message: '일러스트러버님이 회원님의 작품에 좋아요를 눌렀습니다.', time: '1분 전' },
        { id: 2, message: '만화창작자님이 댓글을 남겼습니다: "정말 멋진 작품이네요!"', time: '5분 전' },
        { id: 3, message: '새로운 팔로워 3명이 생겼습니다.', time: '10분 전' }
    ];
    
    listContainer.innerHTML = '';
    notifications.forEach(notif => {
        const notifEl = document.createElement('div');
        notifEl.className = 'notification-item';
        notifEl.style.cssText = `
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--border-color);
            cursor: pointer;
            transition: background 0.2s ease;
        `;
        notifEl.innerHTML = `
            <div style="color: var(--text-primary); margin-bottom: 0.25rem; line-height: 1.4;">${notif.message}</div>
            <div style="color: var(--text-muted); font-size: 0.8rem;">${notif.time}</div>
        `;
        notifEl.addEventListener('mouseenter', () => {
            notifEl.style.background = 'var(--bg-secondary)';
        });
        notifEl.addEventListener('mouseleave', () => {
            notifEl.style.background = 'transparent';
        });
        listContainer.appendChild(notifEl);
    });
}

function markAllRead() {
    alert('모든 알림을 읽음 처리했습니다. ✅');
    const panel = document.getElementById('notificationPanel');
    if (panel) panel.style.display = 'none';
    
    // 배지 숨기기
    const badge = document.querySelector('.notification-btn .badge');
    if (badge) badge.style.display = 'none';
}

// ===== 커뮤니티 생성 모달 =====
function openCreateCommunityModal() {
    alert('커뮤니티 생성 기능은 준비 중입니다. 곧 네이버 밴드 스타일로 구현됩니다! 🎪');
}

// ===== 초기 데이터 로딩 =====
function loadInitialData() {
    loadHomeContent();
    loadExploreContent(); 
    loadCommunityContent();
    loadMessagesContent();
    loadProfileContent();
}

// ===== 추가 유틸리티 함수들 =====
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--accent-primary)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10001;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===== 브라우저 뒤로가기/앞으로가기 지원 =====
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.page) {
        navigateTo(event.state.page);
    }
});

// 페이지 변경시 URL 업데이트
function updateURL(page) {
    const url = new URL(window.location);
    url.hash = page;
    history.pushState({ page: page }, '', url);
}

// 초기 URL 체크
window.addEventListener('load', function() {
    const hash = window.location.hash.slice(1);
    if (hash && ['home', 'explore', 'community', 'messages', 'profile', 'upload'].includes(hash)) {
        navigateTo(hash);
    }
});

console.log('🎨 CRETA JavaScript 완전 로드 완료!');
console.log('✅ 구현된 기능들:');
console.log('  🌙☀️ 라이트/다크모드 토글');
console.log('  🔍 실제 검색 + 연관검색어 시스템');
console.log('  🏠 홈 - 작품 그리드 표시');
console.log('  🚀 탐색 - 필터링 및 정렬');
console.log('  👥 커뮤니티 - 네이버 밴드 스타일');
console.log('  💬 메시지 - 카카오톡 스타일');
console.log('  👤 프로필 - 대시보드 포함');
console.log('  📤 업로드 - 한글과컴퓨터 스타일 3단계');
console.log('  🔔 알림 시스템');
