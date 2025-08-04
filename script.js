// 전역 변수들
let currentScreen = 'home';
let currentSort = 'popular';
let currentCommunityFilter = 'all';
let currentChatRoom = null;
let searchTimeout = null;

// 샘플 데이터
let worksData = [
    {
        id: 1,
        title: '귀멸의 칼날 탄지로 만화',
        author: '만화가 정수현',
        avatar: '정',
        category: 'manga',
        thumbnail: 'https://via.placeholder.com/200x160/1f2937/f3f4f6?text=Demon+Slayer',
        image: 'https://via.placeholder.com/600x400/1f2937/f3f4f6?text=Tanjiro+Manga',
        description: '귀멸의 칼날 탄지로의 새로운 모험을 그린 단편 만화입니다.',
        tags: ['귀멸의칼날', '탄지로', '만화', '단편'],
        likes: 3421,
        views: 12567,
        comments: 445,
        timestamp: Date.now() - 12 * 60 * 60 * 1000,
        date: '12시간 전'
    }
];

let communitiesData = [
    {
        id: 1,
        name: '하이큐!! 팬클럽',
        category: 'animation',
        members: 1234,
        todayPosts: 15,
        description: '하이큐를 사랑하는 사람들이 모인 커뮤니티입니다.',
        icon: '🏐',
        tags: ['하이큐', '애니메이션', '배구']
    },
    {
        id: 2,
        name: '일러스트 갤러리',
        category: 'illustration',
        members: 2567,
        todayPosts: 23,
        description: '다양한 스타일의 일러스트를 공유하고 피드백을 주고받는 공간입니다.',
        icon: '🎨',
        tags: ['일러스트', '드로잉', '아트']
    }
];

let chatRoomsData = [
    {
        id: 1,
        name: '일러스트 토론방',
        lastMessage: '새로운 작업 공유했어요!',
        timestamp: Date.now() - 5 * 60 * 1000,
        unread: 2,
        avatar: '🎨',
        online: true
    },
    {
        id: 2,
        name: '창작자 모임',
        lastMessage: '다들 어떤 프로젝트 하고 계세요?',
        timestamp: Date.now() - 30 * 60 * 1000,
        unread: 0,
        avatar: '👥',
        online: false
    }
];

// 사용자 인증 함수들
function showAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
}

function hideAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

function showLogin() {
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
}

function showSignup() {
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

// 회원가입
async function signupUser() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    if (!name || !email || !password) {
        showNotification('모든 항목을 입력해주세요!');
        return;
    }
    
    if (password.length < 6) {
        showNotification('비밀번호는 6자 이상이어야 합니다!');
        return;
    }
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: name });
        
        await setDoc(doc(db, 'users', user.uid), {
            name: name,
            email: email,
            createdAt: serverTimestamp(),
            works: 0,
            followers: 0,
            following: 0
        });
        
        showNotification('회원가입이 완료되었습니다! 🎉');
    } catch (error) {
        console.error('회원가입 오류:', error);
        showNotification('회원가입 실패: ' + error.message);
    }
}

// 로그인
async function loginUser() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showNotification('이메일과 비밀번호를 입력해주세요!');
        return;
    }
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        showNotification('로그인되었습니다! 환영합니다! 👋');
    } catch (error) {
        console.error('로그인 오류:', error);
        showNotification('로그인 실패: ' + error.message);
    }
}

// 구글 로그인
async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        await setDoc(doc(db, 'users', user.uid), {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
            works: 0,
            followers: 0,
            following: 0
        }, { merge: true });
        
        showNotification('구글 로그인 성공! 🎉');
    } catch (error) {
        console.error('구글 로그인 오류:', error);
        showNotification('구글 로그인 실패: ' + error.message);
    }
}

// 로그아웃
async function logoutUser() {
    try {
        await signOut(auth);
        showNotification('로그아웃되었습니다. 안녕히 가세요! 👋');
    } catch (error) {
        console.error('로그아웃 오류:', error);
    }
}

// 화면 전환
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.getElementById(screenName).classList.add('active');
    document.querySelector(`[data-screen="${screenName}"]`).classList.add('active');
    
    currentScreen = screenName;
    
    if (screenName === 'explore') {
        loadExploreWorks();
    } else if (screenName === 'community') {
        loadCommunities();
    } else if (screenName === 'messages') {
        loadChatRooms();
    }
}

// 탐색 기능
function handleHeaderSearch(event) {
    if (event.key === 'Enter') {
        const query = event.target.value.trim();
        if (query) {
            showScreen('explore');
            searchWorks(query);
        }
    }
}

function handleExploreSearch(event) {
    if (event.key === 'Enter') {
        const query = event.target.value.trim();
        if (query) {
            searchWorks(query);
            hideSuggestions();
        }
    }
}

function searchWorks(query) {
    document.getElementById('exploreSearchInput').value = query;
    const results = worksData.filter(work => 
        work.title.toLowerCase().includes(query.toLowerCase()) ||
        work.author.toLowerCase().includes(query.toLowerCase()) ||
        work.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    displayExploreResults(results);
    document.getElementById('trendingSection').style.display = 'none';
}

function searchByTag(tag) {
    document.getElementById('exploreSearchInput').value = tag;
    searchWorks(tag);
}

function showSuggestions() {
    const input = document.getElementById('exploreSearchInput');
    const query = input.value.trim().toLowerCase();
    
    if (query.length > 0) {
        const suggestions = ['하이큐', '진격의거인', '원피스', '나루토', '귀멸의칼날', '팬아트', '일러스트']
            .filter(tag => tag.toLowerCase().includes(query))
            .slice(0, 5);
        
        if (suggestions.length > 0) {
            const dropdown = document.getElementById('suggestionsDropdown');
            const list = document.getElementById('suggestionsList');
            
            list.innerHTML = suggestions.map(suggestion => 
                `<div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">${suggestion}</div>`
            ).join('');
            
            dropdown.style.display = 'block';
        } else {
            hideSuggestions();
        }
    } else {
        hideSuggestions();
    }
}

function selectSuggestion(suggestion) {
    document.getElementById('exploreSearchInput').value = suggestion;
    searchWorks(suggestion);
    hideSuggestions();
}

function hideSuggestions() {
    document.getElementById('suggestionsDropdown').style.display = 'none';
}

function clearExploreSearch() {
    document.getElementById('exploreSearchInput').value = '';
    document.getElementById('search-clear').style.display = 'none';
    loadExploreWorks();
    document.getElementById('trendingSection').style.display = 'block';
}

function changeSortOrder(sortType) {
    document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-sort="${sortType}"]`).classList.add('active');
    
    currentSort = sortType;
    loadExploreWorks();
}

function loadExploreWorks() {
    let works = [...worksData];
    
    if (currentSort === 'popular') {
        works.sort((a, b) => b.likes - a.likes);
    } else if (currentSort === 'latest') {
        works.sort((a, b) => b.timestamp - a.timestamp);
    } else if (currentSort === 'trending') {
        works.sort((a, b) => (b.likes + b.views) - (a.likes + a.views));
    }
    
    displayExploreResults(works);
}

function displayExploreResults(works) {
    const container = document.getElementById('exploreResults');
    
    if (works.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <h3>검색 결과가 없어요</h3>
                <p>다른 키워드로 검색해보세요</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = works.map(work => `
        <div class="work-item" onclick="showWorkDetail(${work.id})">
            <img src="${work.thumbnail}" alt="${work.title}" class="work-thumbnail">
            <div class="work-content">
                <h3>${work.title}</h3>
                <div class="work-author">${work.author}</div>
                <div class="work-stats">
                    <span>❤️ ${work.likes}</span>
                    <span>👀 ${work.views}</span>
                </div>
                <div class="work-tags">
                    ${work.tags.slice(0, 2).map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// 커뮤니티 기능
function initializeCommunities() {
    loadCommunities();
}

function loadCommunities() {
    const container = document.getElementById('communitiesList');
    let communities = [...communitiesData];
    
    if (currentCommunityFilter !== 'all') {
        communities = communities.filter(c => c.category === currentCommunityFilter);
    }
    
    container.innerHTML = communities.map(community => `
        <div class="community-card" onclick="joinCommunity(${community.id})">
            <div class="community-header-info">
                <div class="community-icon">${community.icon}</div>
                <div class="community-info">
                    <h3>${community.name}</h3>
                    <div class="community-meta">${community.members}명 • 오늘 ${community.todayPosts}개 게시물</div>
                </div>
            </div>
            <div class="community-description">${community.description}</div>
        </div>
    `).join('');
}

function filterCommunities(category) {
    document.querySelectorAll('.community-filter').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-filter="${category}"]`).classList.add('active');
    
    currentCommunityFilter = category;
    loadCommunities();
}

function showCreateCommunityModal() {
    document.getElementById('createCommunityModal').style.display = 'flex';
}

function hideCreateCommunityModal() {
    document.getElementById('createCommunityModal').style.display = 'none';
    document.getElementById('communityName').value = '';
    document.getElementById('communityDescription').value = '';
}

async function createCommunity() {
    if (!auth.currentUser) {
        showNotification('로그인이 필요합니다!');
        return;
    }
    
    const name = document.getElementById('communityName').value.trim();
    const category = document.getElementById('communityCategory').value;
    const description = document.getElementById('communityDescription').value.trim();
    
    if (!name || !description) {
        showNotification('커뮤니티 이름과 소개를 입력해주세요!');
        return;
    }
    
    try {
        await addDoc(collection(db, 'communities'), {
            name: name,
            category: category,
            description: description,
            creatorId: auth.currentUser.uid,
            creatorName: auth.currentUser.displayName || auth.currentUser.email,
            createdAt: serverTimestamp(),
            members: 1,
            posts: 0
        });
        
        showNotification('커뮤니티가 생성되었습니다! 🎉');
        hideCreateCommunityModal();
        loadCommunities();
    } catch (error) {
        console.error('커뮤니티 생성 오류:', error);
        showNotification('커뮤니티 생성 실패: ' + error.message);
    }
}

function joinCommunity(communityId) {
    showNotification('커뮤니티 참여 기능 준비 중입니다! 👥');
}

// 채팅 기능 (실시간)
function initializeChatRooms() {
    loadChatRooms();
}

function loadChatRooms() {
    const container = document.getElementById('chatRoomsList');
    
    container.innerHTML = chatRoomsData.map(room => `
        <div class="chat-room ${currentChatRoom === room.id ? 'active' : ''}" onclick="selectChatRoom(${room.id})">
            <div class="chat-avatar">${room.avatar}</div>
            <div class="chat-user-info">
                <h3>${room.name}</h3>
                <div class="chat-preview">${room.lastMessage}</div>
            </div>
            ${room.unread > 0 ? `<div class="unread-badge">${room.unread}</div>` : ''}
        </div>
    `).join('');
}

function selectChatRoom(roomId) {
    currentChatRoom = roomId;
    const room = chatRoomsData.find(r => r.id === roomId);
    
    // UI 업데이트
    document.querySelectorAll('.chat-room').forEach(r => r.classList.remove('active'));
    document.querySelector(`[onclick="selectChatRoom(${roomId})"]`).classList.add('active');
    
    // 채팅방 헤더 업데이트
    document.querySelector('#chatTopBar .chat-user-info h3').textContent = room.name;
    document.querySelector('#chatTopBar .status').textContent = room.online ? '온라인' : '오프라인';
    
    // 환영 메시지 숨기기
    document.querySelector('.welcome-message').style.display = 'none';
    
    loadChatMessages(roomId);
}

function loadChatMessages(roomId) {
    const container = document.getElementById('chatMessages');
    
    // 샘플 메시지들
    const sampleMessages = [
        {
            id: 1,
            sender: 'other',
            content: '안녕하세요! 새로운 작업 공유해보려고 해요',
            timestamp: Date.now() - 10 * 60 * 1000,
            senderName: 'Artist'
        },
        {
            id: 2,
            sender: 'me',
            content: '네! 궁금해요. 어떤 작업인지 보여주세요!',
            timestamp: Date.now() - 5 * 60 * 1000,
            senderName: 'Me'
        }
    ];
    
    container.innerHTML = sampleMessages.map(message => `
        <div class="message ${message.sender === 'me' ? 'sent' : 'received'}">
            ${message.sender !== 'me' ? '<div class="message-avatar">🎨</div>' : ''}
            <div class="message-content">
                <div class="message-bubble">
                    ${message.content}
                </div>
                <div class="message-time">${formatTime(message.timestamp)}</div>
            </div>
        </div>
    `).join('');
    
    container.scrollTop = container.scrollHeight;
}

function handleMessageInput(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const content = input.value.trim();
    
    if (!content || !currentChatRoom) return;
    
    // UI에 즉시 메시지 추가
    const container = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message sent';
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-bubble">${content}</div>
            <div class="message-time">${formatTime(Date.now())}</div>
        </div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
    
    input.value = '';
    
    // 실제 Firebase 전송은 나중에 구현
    showNotification('메시지 전송됨! 💬');
}

function showNewChatModal() {
    showNotification('새 채팅 시작 기능 준비 중입니다! ✏️');
}

function searchChats() {
    // 채팅방 검색 기능
}

function attachFile() {
    showNotification('파일 첨부 기능 준비 중입니다! 📎');
}

function showEmojiPicker() {
    showNotification('이모지 선택 기능 준비 중입니다! 😊');
}

// 작품 업로드 모달
function showUploadModal() {
    if (!auth.currentUser) {
        showNotification('로그인이 필요합니다!');
        showAuthModal();
        return;
    }
    document.getElementById('uploadModal').style.display = 'flex';
}

function hideUploadModal() {
    document.getElementById('uploadModal').style.display = 'none';
    document.getElementById('workTitle').value = '';
    document.getElementById('workDescription').value = '';
    document.getElementById('workTags').value = '';
    document.getElementById('workImage').value = '';
    document.getElementById('imagePreview').innerHTML = '';
}

function previewImage() {
    const file = document.getElementById('workImage').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').innerHTML = 
                `<img src="${e.target.result}" alt="미리보기">`;
        };
        reader.readAsDataURL(file);
    }
}

async function uploadWork() {
    if (!auth.currentUser) {
        showNotification('로그인이 필요합니다!');
        return;
    }
    
    const title = document.getElementById('workTitle').value.trim();
    const description = document.getElementById('workDescription').value.trim();
    const category = document.getElementById('workCategory').value;
    const tags = document.getElementById('workTags').value.trim();
    const imageFile = document.getElementById('workImage').files[0];
    
    if (!title || !description) {
        showNotification('제목과 설명을 입력해주세요!');
        return;
    }
    
    try {
        let imageUrl = null;
        
        if (imageFile) {
            const imageRef = ref(storage, `works/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }
        
        await addDoc(collection(db, 'works'), {
            title: title,
            description: description,
            category: category,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            imageUrl: imageUrl,
            authorId: auth.currentUser.uid,
            authorName: auth.currentUser.displayName || auth.currentUser.email,
            createdAt: serverTimestamp(),
            likes: 0,
            views: 0,
            comments: 0
        });
        
        showNotification('작품이 성공적으로 업로드되었습니다! 🎉');
        hideUploadModal();
        
        if (window.loadWorks) {
            window.loadWorks();
        }
    } catch (error) {
        console.error('작품 업로드 오류:', error);
        showNotification('작품 업로드 실패: ' + error.message);
    }
}

// 프로필 표시
function showProfile() {
    showScreen('profile');
}

// 작품 상세보기
function showWorkDetail(workId) {
    showNotification('작품 상세보기 기능 준비 중입니다! 🎨');
}

// 유틸리티 함수들
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60 * 1000) {
        return '방금 전';
    } else if (diff < 60 * 60 * 1000) {
        return `${Math.floor(diff / (60 * 1000))}분 전`;
    } else if (diff < 24 * 60 * 60 * 1000) {
        return `${Math.floor(diff / (60 * 60 * 1000))}시간 전`;
    } else {
        return date.toLocaleDateString();
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, #1f2937, #374151);
        color: white;
        padding: 0.8rem 1.2rem;
        border-radius: 10px;
        box-shadow: 0 6px 25px rgba(31, 41, 55, 0.5);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
        max-width: 250px;
        font-size: 0.8rem;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(80px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(80px);
        }
    }
`;
document.head.appendChild(style);

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔥 CRETA 플랫폼이 Firebase와 함께 로드되었습니다!');
    
    // 외부 클릭시 드롭다운 숨기기
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.search-container')) {
            hideSuggestions();
        }
    });
});
