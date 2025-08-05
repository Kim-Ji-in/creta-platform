// ===== 전역 변수 =====
let currentUser = null;
let currentPage = 'home';
let uploadStep = 1;
let selectedFile = null;
let currentCommunity = null;
let currentChatRoom = null;

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    // 로딩 화면 처리
    setTimeout(() => {
        hideLoading();
        checkAuthState();
    }, 2000);
}

function hideLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
}

function checkAuthState() {
    // Firebase auth 상태 확인
    if (window.auth && window.firebaseModules) {
        window.firebaseModules.onAuthStateChanged(window.auth, (user) => {
            if (user) {
                currentUser = user;
                showMainApp();
                loadInitialData();
            } else {
                showAuthModal();
            }
        });
    } else {
        // Firebase 로드 실패 시 메인 앱 표시
        showMainApp();
        loadInitialData();
    }
}

// ===== 이벤트 리스너 설정 =====
function setupEventListeners() {
    // 모달 외부 클릭 시 닫기
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            const modalId = e.target.id;
            if (modalId) {
                closeModal(modalId);
            }
        }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal-overlay[style*="flex"]');
            openModals.forEach(modal => {
                closeModal(modal.id);
            });
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
        dropZone.style.borderColor = '#1f2937';
        dropZone.style.background = '#f9fafb';
    });

    dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        dropZone.style.borderColor = '#d1d5db';
        dropZone.style.background = 'transparent';
    });

    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.style.borderColor = '#d1d5db';
        dropZone.style.background = 'transparent';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect({ target: { files: files } });
        }
    });
}

// ===== 인증 시스템 =====
function showAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
    document.body.classList.add('modal-open');
}

function showMainApp() {
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('mainApp').style.display = 'flex';
    document.body.classList.remove('modal-open');
    
    if (currentUser) {
        updateUserInterface();
    }
}

function updateUserInterface() {
    if (!currentUser) return;
    
    const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || '사용자';
    const userInitial = displayName.charAt(0).toUpperCase();
    
    // 사용자 정보 업데이트
    const elements = {
        userInitial: document.getElementById('userInitial'),
        welcomeName: document.getElementById('welcomeName'),
        profileName: document.getElementById('profileName'),
        profileHandle: document.getElementById('profileHandle'),
        profileAvatar: document.getElementById('profileAvatar'),
        settingsEmail: document.getElementById('settingsEmail')
    };
    
    if (elements.userInitial) elements.userInitial.textContent = userInitial;
    if (elements.welcomeName) elements.welcomeName.textContent = displayName;
    if (elements.profileName) elements.profileName.textContent = displayName;
    if (elements.profileHandle) elements.profileHandle.textContent = `@${displayName.toLowerCase()}`;
    if (elements.profileAvatar) elements.profileAvatar.textContent = userInitial;
    if (elements.settingsEmail) elements.settingsEmail.textContent = currentUser.email || '';
    
    // 로그아웃 버튼 표시
    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) logoutBtn.style.display = 'block';
}

function switchAuthTab(tab) {
    // 탭 버튼 상태 변경
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[onclick="switchAuthTab('${tab}')"]`).classList.add('active');
    
    // 폼 표시/숨김
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (tab === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
}

async function loginUser() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('이메일과 비밀번호를 입력해주세요.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('올바른 이메일 형식을 입력해주세요.', 'error');
        return;
    }
    
    try {
        if (window.firebaseModules && window.auth) {
            await window.firebaseModules.signInWithEmailAndPassword(window.auth, email, password);
            showNotification('로그인 성공! 🎉', 'success');
            closeModal('authModal');
        } else {
            // Firebase 없이도 작동하도록
            currentUser = { email, displayName: email.split('@')[0] };
            showMainApp();
            showNotification('데모 로그인 성공! 🎉', 'success');
        }
    } catch (error) {
        console.error('로그인 실패:', error);
        showNotification('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.', 'error');
    }
}

async function signupUser() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!name || !email || !password || !passwordConfirm) {
        showNotification('모든 필드를 입력해주세요.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('올바른 이메일 형식을 입력해주세요.', 'error');
        return;
    }
    
    if (password.length < 8) {
        showNotification('비밀번호는 8자 이상이어야 합니다.', 'error');
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
    
    try {
        if (window.firebaseModules && window.auth) {
            const userCredential = await window.firebaseModules.createUserWithEmailAndPassword(window.auth, email, password);
            await window.firebaseModules.updateProfile(userCredential.user, { displayName: name });
            showNotification('회원가입 성공! 🎉', 'success');
            closeModal('authModal');
        } else {
            // Firebase 없이도 작동하도록
            currentUser = { email, displayName: name };
            showMainApp();
            showNotification('데모 회원가입 성공! 🎉', 'success');
        }
    } catch (error) {
        console.error('회원가입 실패:', error);
        let errorMessage = '회원가입에 실패했습니다.';
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = '이미 사용 중인 이메일입니다.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = '비밀번호가 너무 약합니다.';
        }
        
        showNotification(errorMessage, 'error');
    }
}

async function logoutUser() {
    try {
        if (window.firebaseModules && window.auth) {
            await window.firebaseModules.signOut(window.auth);
        }
        
        currentUser = null;
        showAuthModal();
        showNotification('로그아웃되었습니다.', 'info');
        
        // UI 초기화
        document.querySelector('.logout').style.display = 'none';
        
    } catch (error) {
        console.error('로그아웃 실패:', error);
        showNotification('로그아웃 중 오류가 발생했습니다.', 'error');
    }
}

function socialLogin(provider) {
    showNotification(`${provider} 로그인 기능을 준비 중입니다.`, 'info');
}

function socialSignup(provider) {
    showNotification(`${provider} 회원가입 기능을 준비 중입니다.`, 'info');
}

// ===== 네비게이션 시스템 =====
function navigateTo(page) {
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
    }
}

function loadInitialData() {
    loadHomeData();
    loadSampleData();
}

// ===== 홈 페이지 =====
function loadHomeData() {
    loadLatestWorks();
    loadTrendingWorks();
    loadSteadyWorks();
}

function loadLatestWorks() {
    const container = document.getElementById('latestWorks');
    if (!container) return;
    
    const sampleWorks = generateSampleWorks(['하이큐!! 최신 팬아트', '원피스 1000화 기념작', '귀멸의칼날 일러스트']);
    container.innerHTML = sampleWorks;
}

function loadTrendingWorks() {
    const container = document.getElementById('trendingWorks');
    if (!container) return;
    
    const sampleWorks = generateSampleWorks(['진격의거인 최종화', '나루토 명장면', '하이큐 신작']);
    container.innerHTML = sampleWorks;
}

function loadSteadyWorks() {
    const container = document.getElementById('steadyWorks');
    if (!container) return;
    
    const sampleWorks = generateSampleWorks(['클래식 일러스트', '인기 소설', '스테디셀러 만화']);
    container.innerHTML = sampleWorks;
}

function generateSampleWorks(titles) {
    return titles.map((title, index) => `
        <div class="work-item" onclick="showWorkDetail('${title}')">
            <div class="work-thumbnail">🎨</div>
            <div class="work-content">
                <div class="work-title">${title}</div>
                <div class="work-author">샘플작가${index + 1}</div>
                <div class="work-stats">
                    <span>❤️ ${Math.floor(Math.random() * 1000)}</span>
                    <span>👀 ${Math.floor(Math.random() * 5000)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function showWorkDetail(title) {
    showNotification(`"${title}" 상세보기 기능을 준비 중입니다! 🎨`, 'info');
}

// ===== 탐색 페이지 =====
function loadExploreData() {
    setupSearchFeatures();
    loadExploreResults();
}

function setupSearchFeatures() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    // 검색 이벤트 리스너
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        if (query.length > 2) {
            updateSearchSuggestions(query);
        }
    });
}

function handleSearch(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
}

function performSearch() {
    const query = document.getElementById('searchInput')?.value.trim();
    if (!query) return;
    
    hideSearchSuggestions();
    showNotification(`"${query}" 검색 결과를 불러오는 중...`, 'info');
    
    // 실제 검색 구현
    setTimeout(() => {
        loadExploreResults(query);
    }, 500);
}

function showSearchSuggestions() {
    const panel = document.getElementById('searchSuggestions');
    if (panel) {
        panel.style.display = 'block';
        loadSearchSuggestions();
    }
}

function hideSearchSuggestions() {
    const panel = document.getElementById('searchSuggestions');
    if (panel) {
        panel.style.display = 'none';
    }
}

function loadSearchSuggestions() {
    const relatedKeywords = document.getElementById('relatedKeywords');
    const trendingKeywords = document.getElementById('trendingKeywords');
    
    if (relatedKeywords) {
        relatedKeywords.innerHTML = [
            '하이큐', '진격의거인', '원피스', '나루토', '귀멸의칼날'
        ].map(keyword => 
            `<div class="suggestion-item" onclick="searchKeyword('${keyword}')">${keyword}</div>`
        ).join('');
    }
    
    if (trendingKeywords) {
        trendingKeywords.innerHTML = [
            '탄지로', '카가야마', '루피', '에렌', '미카사'
        ].map((keyword, index) => 
            `<div class="trending-item" onclick="searchKeyword('${keyword}')">
                <span>${index + 1}. ${keyword}</span>
                <span style="color: #ef4444;">↑</span>
            </div>`
        ).join('');
    }
}

function searchKeyword(keyword) {
    document.getElementById('searchInput').value = keyword;
    performSearch();
}

function updateSearchSuggestions(query) {
    // 검색어에 따른 동적 제안 업데이트
    console.log('검색어 업데이트:', query);
}

function filterByCategory(category) {
    // 카테고리 버튼 상태 변경
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    showNotification(`${category} 카테고리로 필터링 중...`, 'info');
    loadExploreResults(null, category);
}

function sortBy(sortType) {
    // 정렬 버튼 상태 변경
    document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    showNotification(`${sortType} 순으로 정렬 중...`, 'info');
    loadExploreResults(null, null, sortType);
}

function loadExploreResults(query = '', category = '', sortType = '') {
    const container = document.getElementById('exploreResults');
    if (!container) return;
    
    // 로딩 상태
    container.innerHTML = '<div style="text-align: center; padding: 2rem; color: #6b7280;">검색 중...</div>';
    
    setTimeout(() => {
        const results = generateSampleWorks([
            '검색 결과 1', '검색 결과 2', '검색 결과 3', 
            '검색 결과 4', '검색 결과 5', '검색 결과 6'
        ]);
        container.innerHTML = results || '<div style="text-align: center; padding: 4rem; color: #6b7280;"><h3>검색 결과가 없습니다</h3><p>다른 키워드로 검색해보세요.</p></div>';
    }, 800);
}

// ===== 업로드 시스템 =====
function openUploadModal() {
    resetUploadForm();
    openModal('uploadModal');
    updateUploadStep();
}

function resetUploadForm() {
    uploadStep = 1;
    selectedFile = null;
    
    // 폼 필드 초기화
    const fields = ['workTitle', 'workDescription', 'workCategory', 'workTags'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) field.value = '';
    });
    
    // 파일 미리보기 초기화
    const preview = document.getElementById('filePreview');
    if (preview) preview.innerHTML = '';
    
    // 체크박스 초기화
    const checkboxes = document.querySelectorAll('#uploadModal input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    
    // 라디오 버튼 초기화
    const firstRadio = document.querySelector('#uploadModal input[type="radio"]');
    if (firstRadio) firstRadio.checked = true;
}

function nextStep() {
    if (validateCurrentStep()) {
        if (uploadStep < 3) {
            uploadStep++;
            updateUploadStep();
        }
    }
}

function previousStep() {
    if (uploadStep > 1) {
        uploadStep--;
        updateUploadStep();
    }
}

function validateCurrentStep() {
    if (uploadStep === 1) {
        if (!selectedFile) {
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

function updateUploadStep() {
    // 단계 표시 업데이트
    document.querySelectorAll('.step').forEach((step, index) => {
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
    
    // 버튼 표시
    const prevBtn = document.getElementById('uploadPrevBtn');
    const nextBtn = document.getElementById('uploadNextBtn');
    const submitBtn = document.getElementById('uploadSubmitBtn');
    
    if (prevBtn) prevBtn.style.display = uploadStep > 1 ? 'inline-block' : 'none';
    if (nextBtn) nextBtn.style.display = uploadStep < 3 ? 'inline-block' : 'none';
    if (submitBtn) submitBtn.style.display = uploadStep === 3 ? 'inline-block' : 'none';
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    selectedFile = file;
    
    // 파일 유효성 검사
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
        showNotification('파일 크기는 50MB 이하여야 합니다.', 'error');
        return;
    }
    
    // 미리보기 생성
    displayFilePreview(file);
    
    // 자동으로 다음 단계로
    setTimeout(() => {
        nextStep();
    }, 500);
}

function displayFilePreview(file) {
    const preview = document.getElementById('filePreview');
    if (!preview) return;
    
    const fileType = file.type;
    let previewHTML = '';
    
    if (fileType.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewHTML = `
                <div style="text-align: center; margin-top: 1rem;">
                    <img src="${e.target.result}" alt="미리보기" style="max-width: 200px; max-height: 200px; border-radius: 8px; object-fit: cover;">
                    <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #6b7280;">${file.name}</p>
                </div>
            `;
            preview.innerHTML = previewHTML;
        };
        reader.readAsDataURL(file);
    } else {
        previewHTML = `
            <div style="text-align: center; margin-top: 1rem; padding: 1rem; background: #f9fafb; border-radius: 8px;">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">📁</div>
                <p style="font-weight: 600; margin-bottom: 0.25rem;">${file.name}</p>
                <p style="font-size: 0.8rem; color: #6b7280;">${formatFileSize(file.size)}</p>
            </div>
        `;
        preview.innerHTML = previewHTML;
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function submitUpload() {
    if (!validateCurrentStep()) return;
    
    const workData = {
        title: document.getElementById('workTitle').value.trim(),
        description: document.getElementById('workDescription').value.trim(),
        category: document.getElementById('workCategory').value,
        tags: document.getElementById('workTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
        visibility: document.querySelector('input[name="visibility"]:checked').value,
        allowComments: document.getElementById('allowComments').checked,
        allowDownload: document.getElementById('allowDownload').checked,
        file: selectedFile
    };
    
    try {
        showUploadProgress(0);
        
        if (window.storage && window.firebaseModules) {
            // Firebase로 업로드
            await uploadToFirebase(workData);
        } else {
            // 데모 업로드
            await demoUpload(workData);
        }
        
        showUploadProgress(100);
        showNotification('작품이 성공적으로 업로드되었습니다! 🎉', 'success');
        closeModal('uploadModal');
        
        // 홈 페이지 새로고침
        if (currentPage === 'home') {
            loadHomeData();
        }
        
    } catch (error) {
        console.error('업로드 실패:', error);
        showNotification('업로드 중 오류가 발생했습니다.', 'error');
    }
}

async function uploadToFirebase(workData) {
    const { file, ...metadata } = workData;
    
    // 파일 업로드
    showUploadProgress(25);
    const imageRef = window.firebaseModules.ref(window.storage, `works/${Date.now()}_${file.name}`);
    const snapshot = await window.firebaseModules.uploadBytes(imageRef, file);
    
    showUploadProgress(75);
    const imageUrl = await window.firebaseModules.getDownloadURL(snapshot.ref);
    
    // 메타데이터 저장
    const workDoc = {
        ...metadata,
        imageUrl,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || currentUser.email,
        createdAt: window.firebaseModules.serverTimestamp(),
        likes: 0,
        views: 0
    };
    
    await window.firebaseModules.addDoc(window.firebaseModules.collection(window.db, 'works'), workDoc);
}

async function demoUpload(workData) {
    // 데모 업로드 (Firebase 없이)
    for (let i = 0; i <= 100; i += 10) {
        showUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

function showUploadProgress(percent) {
    const progressContainer = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressContainer) progressContainer.style.display = 'block';
    if (progressFill) progressFill.style.width = percent + '%';
    if (progressText) progressText.textContent = percent + '%';
    
    if (percent === 100) {
        setTimeout(() => {
            if (progressContainer) progressContainer.style.display = 'none';
        }, 1000);
    }
}

// ===== 커뮤니티 시스템 =====
function loadCommunityData() {
    loadCommunityList();
}

function loadCommunityList() {
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
    
    container.innerHTML = sampleCommunities.map(community => `
        <div class="community-card" onclick="joinCommunity('${community.id}')">
            <div class="community-info">
                <div class="community-icon">${community.icon}</div>
                <div class="community-details">
                    <h3>${community.name}</h3>
                    <div class="community-meta">${community.members}명 • ${community.posts}개 게시물</div>
                </div>
            </div>
            <div class="community-description">${community.description}</div>
        </div>
    `).join('');
}

function openCreateCommunityModal() {
    openModal('createCommunityModal');
}

async function createCommunity() {
    const name = document.getElementById('communityName')?.value.trim();
    const category = document.getElementById('communityCategory')?.value;
    const description = document.getElementById('communityDescription')?.value.trim();
    const privacy = document.querySelector('input[name="communityPrivacy"]:checked')?.value;
    
    if (!name) {
        showNotification('커뮤니티 이름을 입력해주세요.', 'error');
        return;
    }
    
    if (!category) {
        showNotification('카테고리를 선택해주세요.', 'error');
        return;
    }
    
    if (!description) {
        showNotification('커뮤니티 소개를 입력해주세요.', 'error');
        return;
    }
    
    try {
        const communityData = {
            name,
            category,
            description,
            privacy: privacy || 'public',
            creatorId: currentUser?.uid || 'demo-user',
            creatorName: currentUser?.displayName || '데모 사용자',
            members: [currentUser?.uid || 'demo-user'],
            memberCount: 1,
            postCount: 0,
            createdAt: new Date()
        };
        
        if (window.firebaseModules && window.db) {
            await window.firebaseModules.addDoc(window.firebaseModules.collection(window.db, 'communities'), communityData);
        }
        
        showNotification('커뮤니티가 생성되었습니다! 🎉', 'success');
        closeModal('createCommunityModal');
        loadCommunityList();
        
    } catch (error) {
        console.error('커뮤니티 생성 실패:', error);
        showNotification('커뮤니티 생성 중 오류가 발생했습니다.', 'error');
    }
}

function joinCommunity(communityId) {
    showNotification('커뮤니티에 참여했습니다! 🎉', 'success');
    // 실제로는 커뮤니티 상세 페이지로 이동
    showCommunityDetail(communityId);
}

function showCommunityDetail(communityId) {
    showNotification(`커뮤니티 상세 페이지 기능을 준비 중입니다! (ID: ${communityId})`, 'info');
}

function filterCommunities(category) {
    // 필터 버튼 상태 변경
    document.querySelectorAll('.community-filters .filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    showNotification(`${category} 커뮤니티로 필터링 중...`, 'info');
    loadCommunityList(); // 실제로는 필터된 결과 로드
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
            avatar: '👤'
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
    
    container.innerHTML = sampleRooms.map(room => `
        <div class="chat-room ${room.id === currentChatRoom?.id ? 'active' : ''}" onclick="selectChatRoom('${room.id}')">
            <div class="chat-avatar">${room.avatar}</div>
            <div class="chat-user-info">
                <h4>${room.name}</h4>
                <div class="chat-preview">${room.lastMessage}</div>
            </div>
            <div style="position: absolute; top: 1rem; right: 1rem; font-size: 0.7rem; color: #9ca3af;">${room.time}</div>
            ${room.unread > 0 ? `<div style="position: absolute; top: 0.8rem; right: 0.8rem; background: #ef4444; color: white; border-radius: 50%; width: 18px; height: 18px; font-size: 0.7rem; display: flex; align-items: center; justify-content: center;">${room.unread}</div>` : ''}
        </div>
    `).join('');
}

function selectChatRoom(roomId) {
    currentChatRoom = { id: roomId };
    loadChatRoomsList(); // 활성 상태 업데이트
    showChatRoomMessages(roomId);
}

function showChatRoomMessages(roomId) {
    const chatMain = document.getElementById('chatMain');
    if (!chatMain) return;
    
    // 채팅 인터페이스 표시
    chatMain.innerHTML = `
        <div style="display: flex; flex-direction: column; height: 100%;">
            <div style="padding: 1rem; border-bottom: 1px solid #e5e7eb; background: white;">
                <h3>채팅방 ${roomId}</h3>
                <span style="font-size: 0.8rem; color: #6b7280;">온라인</span>
            </div>
            
            <div style="flex: 1; padding: 1rem; overflow-y: auto; background: #f9fafb;" id="messagesContainer">
                <div style="margin-bottom: 1rem;">
                    <div style="display: flex; margin-bottom: 0.5rem;">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: #1f2937; display: flex; align-items: center; justify-content: center; color: white; margin-right: 0.8rem; font-size: 0.8rem;">👤</div>
                        <div>
                            <div style="background: white; padding: 0.8rem; border-radius: 12px; border-top-left-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                안녕하세요! 잘 지내시나요?
                            </div>
                            <div style="font-size: 0.7rem; color: #9ca3af; margin-top: 0.3rem;">오후 2:30</div>
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 1rem; display: flex; justify-content: flex-end;">
                    <div>
                        <div style="background: linear-gradient(45deg, #1f2937, #374151); color: white; padding: 0.8rem; border-radius: 12px; border-top-right-radius: 4px;">
                            네! 잘 지내고 있어요. 새 작품도 올렸답니다 😊
                        </div>
                        <div style="font-size: 0.7rem; color: #9ca3af; margin-top: 0.3rem; text-align: right;">오후 2:32</div>
                    </div>
                </div>
            </div>
            
            <div style="padding: 1rem; border-top: 1px solid #e5e7eb; background: white;">
                <div style="display: flex; gap: 0.8rem; align-items: flex-end;">
                    <button style="background: #f3f4f6; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer;" onclick="openAttachmentMenu()">📎</button>
                    <div style="flex: 1; position: relative;">
                        <input type="text" id="messageInput" placeholder="메시지를 입력하세요..." style="width: 100%; padding: 0.8rem 3rem 0.8rem 1rem; border: 1px solid #e5e7eb; border-radius: 20px; outline: none;" onkeypress="handleMessageInput(event)">
                        <button style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 0.5rem;" onclick="showEmojiPicker()">😊</button>
                    </div>
                    <button style="background: linear-gradient(45deg, #1f2937, #374151); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer;" onclick="sendMessage()">➤</button>
                </div>
            </div>
        </div>
    `;
}

function openNewChatModal() {
    showNotification('새 채팅 기능을 준비 중입니다! 💬', 'info');
}

function openGroupChatModal() {
    showNotification('단체채팅 생성 기능을 준비 중입니다! 👥', 'info');
}

function switchChatTab(tab) {
    // 탭 상태 변경
    document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    showNotification(`${tab} 채팅방을 불러오는 중...`, 'info');
    loadChatRoomsList(); // 실제로는 탭에 따른 필터링
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
    
    // 메시지 전송
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
    
    const messageHTML = `
        <div style="margin-bottom: 1rem; display: flex; justify-content: ${isOwn ? 'flex-end' : 'flex-start'};">
            ${!isOwn ? '<div style="width: 32px; height: 32px; border-radius: 50%; background: #1f2937; display: flex; align-items: center; justify-content: center; color: white; margin-right: 0.8rem; font-size: 0.8rem;">👤</div>' : ''}
            <div>
                <div style="background: ${isOwn ? 'linear-gradient(45deg, #1f2937, #374151)' : 'white'}; color: ${isOwn ? 'white' : '#374151'}; padding: 0.8rem; border-radius: 12px; ${isOwn ? 'border-top-right-radius: 4px' : 'border-top-left-radius: 4px'}; ${!isOwn ? 'box-shadow: 0 1px 3px rgba(0,0,0,0.1);' : ''}">
                    ${message}
                </div>
                <div style="font-size: 0.7rem; color: #9ca3af; margin-top: 0.3rem; text-align: ${isOwn ? 'right' : 'left'};">방금 전</div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', messageHTML);
    container.scrollTop = container.scrollHeight;
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
    loadProfileTabs();
}

function updateProfileStats() {
    // 통계 업데이트
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

function loadProfileTabs() {
    loadRecentActivity();
    loadPopularWorks();
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
        `<div style="padding: 0.8rem; background: #f9fafb; border-radius: 8px; margin-bottom: 0.5rem; font-size: 0.9rem;">${activity}</div>`
    ).join('');
}

function loadPopularWorks() {
    const container = document.getElementById('popularWorks');
    if (!container) return;
    
    const works = ['인기작 1', '인기작 2', '인기작 3'];
    container.innerHTML = works.map(work => 
        `<div style="padding: 0.8rem; background: #f9fafb; border-radius: 8px; margin-bottom: 0.5rem; font-size: 0.9rem; cursor: pointer;" onclick="showWorkDetail('${work}')">${work}</div>`
    ).join('');
}

function loadUserWorks() {
    const container = document.getElementById('userWorksGrid');
    if (!container) return;
    
    container.innerHTML = generateSampleWorks(['내 작품 1', '내 작품 2', '내 작품 3']);
}

function loadUserCollections() {
    const container = document.getElementById('collectionsGrid');
    if (!container) return;
    
    container.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: #6b7280;">
            <h3>컬렉션이 없습니다</h3>
            <p>첫 번째 컬렉션을 만들어보세요!</p>
            <button class="create-btn" onclick="createCollection()" style="margin-top: 1rem;">컬렉션 만들기</button>
        </div>
    `;
}

function loadJoinedCommunities() {
    const container = document.getElementById('joinedCommunities');
    if (!container) return;
    
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem;">
            <div style="background: white; padding: 1.5rem; border-radius: 12px; border: 1px solid #e5e7eb;">
                <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                    <div style="width: 40px; height: 40px; border-radius: 8px; background: linear-gradient(45deg, #1f2937, #374151); display: flex; align-items: center; justify-content: center; margin-right: 1rem;">🎨</div>
                    <div>
                        <h4>일러스트 창작소</h4>
                        <p style="font-size: 0.8rem; color: #6b7280;">890명</p>
                    </div>
                </div>
                <p style="font-size: 0.9rem; color: #374151;">일러스트 작품 공유 커뮤니티</p>
            </div>
        </div>
    `;
}

function filterUserWorks(category) {
    document.querySelectorAll('.works-filters .filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    showNotification(`${category} 작품으로 필터링 중...`, 'info');
    loadUserWorks();
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

// ===== 알림 시스템 =====
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    
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
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
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

function openNotifications() {
    showNotification('알림 센터 기능을 준비 중입니다! 🔔', 'info');
}

// ===== 샘플 데이터 로드 =====
function loadSampleData() {
    // 홈페이지 데이터 로드
    loadHomeData();
    
    // 검색 제안 데이터 로드
    loadSearchSuggestions();
    
    console.log('CRETA 플랫폼이 성공적으로 로드되었습니다! 🎨');
}

// ===== 유틸리티 함수 =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

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

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatDate(date) {
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// CSS 애니메이션 추가
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
`;
document.head.appendChild(style);

// 전역 함수 등록 (HTML에서 호출할 수 있도록)
window.navigateTo = navigateTo;
window.switchAuthTab = switchAuthTab;
window.loginUser = loginUser;
window.signupUser = signupUser;
window.logoutUser = logoutUser;
window.socialLogin = socialLogin;
window.socialSignup = socialSignup;
window.openUploadModal = openUploadModal;
window.closeModal = closeModal;
window.nextStep = nextStep;
window.previousStep = previousStep;
window.submitUpload = submitUpload;
window.handleFileSelect = handleFileSelect;
window.openCreateCommunityModal = openCreateCommunityModal;
window.createCommunity = createCommunity;
window.joinCommunity = joinCommunity;
window.filterCommunities = filterCommunities;
window.openNewChatModal = openNewChatModal;
window.openGroupChatModal = openGroupChatModal;
window.switchChatTab = switchChatTab;
window.selectChatRoom = selectChatRoom;
window.sendMessage = sendMessage;
window.handleMessageInput = handleMessageInput;
window.switchProfileTab = switchProfileTab;
window.filterUserWorks = filterUserWorks;
window.createCollection = createCollection;
window.editProfile = editProfile;
window.shareProfile = shareProfile;
window.goToProfile = goToProfile;
window.showWorkDetail = showWorkDetail;
window.filterByCategory = filterByCategory;
window.sortBy = sortBy;
window.performSearch = performSearch;
window.handleSearch = handleSearch;
window.showSearchSuggestions = showSearchSuggestions;
window.searchKeyword = searchKeyword;
window.openNotifications = openNotifications;
window.openAttachmentMenu = openAttachmentMenu;
window.showEmojiPicker = showEmojiPicker;

console.log('🎨 CRETA 플랫폼 JavaScript 로드 완료!');

