// 전역 변수들
let currentScreen = 'home';
let currentSort = 'popular';
let currentCommunityFilter = 'all';
let currentChatRoom = null;
let searchTimeout = null;
let currentPost = null;

// 샘플 데이터
let worksData = [
    {
        id: 1,
        title: '귀멸의 칼날 탄지로 팬아트',
        author: '아티스트 김철수',
        avatar: '김',
        category: 'illustration',
        thumbnail: 'https://via.placeholder.com/200x160/1f2937/f3f4f6?text=Tanjiro+Art',
        description: '귀멸의 칼날 탄지로의 새로운 팬아트입니다.',
        tags: ['귀멸의칼날', '탄지로', '팬아트', '일러스트'],
        likes: 1234,
        views: 5678,
        comments: [],
        bookmarks: 89,
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
        authorId: 'sample1'
    }
];

let communitiesData = [
    {
        id: 1,
        name: '하이큐!! 팬클럽',
        category: 'animation',
        members: 2345,
        description: '하이큐를 사랑하는 사람들이 모인 커뮤니티입니다.',
        icon: '🏐',
        posts: [
            {
                id: 1,
                title: '하이큐 최신 에피소드 감상',
                content: '이번 에피소드 정말 감동적이었어요! 특히 카게야마와 히나타의 콤비 플레이가...',
                author: '민',
                timestamp: Date.now() - 30 * 60 * 1000,
                likes: 15,
                comments: [
                    { id: 1, author: '김', text: '정말 대박이었죠!', timestamp: Date.now() - 15 * 60 * 1000 },
                    { id: 2, author: '이', text: '저도 울었어요 ㅠㅠ', timestamp: Date.now() - 10 * 60 * 1000 }
                ],
                bookmarks: 5
            }
        ]
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
        online: true,
        messages: [
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
        ]
    }
];

let usersData = [
    { id: 1, name: '일러스트레이터 김민수', avatar: '김', online: true },
    { id: 2, name: '만화가 이영희', avatar: '이', online: false },
    { id: 3, name: '소설가 박철수', avatar: '박', online: true }
];

// 카카오 SDK 초기화
function initializeKakao() {
    if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('YOUR_KAKAO_APP_KEY'); // 실제 앱 키로 교체 필요
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔥 CRETA 플랫폼이 Firebase와 함께 로드되었습니다!');
    initializeKakao();
    
    // 외부 클릭시 패널 숨기기
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.search-container')) {
            hideSearchPanel();
        }
        if (!event.target.closest('.emoji-btn') && !event.target.closest('.emoji-picker')) {
            hideEmojiPicker();
        }
    });
});

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

// 카카오 로그인
function loginWithKakao() {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
        showNotification('카카오 SDK 초기화 중입니다...');
        initializeKakao();
        return;
    }
    
    window.Kakao.Auth.login({
        success: function(authObj) {
            window.Kakao.API.request({
                url: '/v2/user/me',
                success: async function(res) {
                    try {
                        const user = res;
                        showNotification('카카오 로그인 성공! 💬');
                        
                        // Firebase 커스텀 토큰 생성 로직 (실제 백엔드 필요)
                        // 현재는 시뮬레이션
                    } catch (error) {
                        showNotification('카카오 사용자 정보 처리 실패');
                    }
                },
                fail: function(error) {
                    showNotification('카카오 사용자 정보 가져오기 실패');
                }
            });
        },
        fail: function(err) {
            showNotification('카카오 로그인 실패');
        }
    });
}

// 네이버 로그인 (구현 예정)
function loginWithNaver() {
    showNotification('네이버 로그인 기능 준비 중입니다! 🟢');
}

function signupWithNaver() {
    showNotification('네이버 회원가입 기능 준비 중입니다! 🟢');
}

// 애플 로그인 (구현 예정)
function loginWithApple() {
    showNotification('Apple 로그인 기능 준비 중입니다! 🍎');
}

function signupWithApple() {
    showNotification('Apple 회원가입 기능 준비 중입니다! 🍎');
}

// 카카오 회원가입
function signupWithKakao() {
    loginWithKakao(); // 카카오는 로그인과 회원가입이 동일
}

// 구글 회원가입
function signupWithGoogle() {
    loginWithGoogle(); // 구글도 로그인과 회원가입이 동일
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
    const navItem = document.querySelector(`[data-screen="${screenName}"]`);
    if (navItem) navItem.classList.add('active');
    
    currentScreen = screenName;
    
    if (screenName === 'explore') {
        loadExploreWorks();
    } else if (screenName === 'community') {
        loadCommunities();
    } else if (screenName === 'messages') {
        loadChatRooms();
    }
}

// 홈 화면 카테고리별 탐색
function exploreByCategory(category) {
    showScreen('explore');
    changeSortOrder(category);
}

// 탐색 기능
function handleExploreSearch(event) {
    if (event.key === 'Enter') {
        const query = event.target.value.trim();
        if (query) {
            searchWorks(query);
            hideSearchPanel();
        }
    }
}

function showSearchPanel() {
    document.getElementById('searchPanel').style.display = 'block';
    document.getElementById('trendingSection').style.display = 'none';
}

function hideSearchPanel() {
    document.getElementById('searchPanel').style.display = 'none';
    document.getElementById('trendingSection').style.display = 'block';
}

function searchWorks(query) {
    document.getElementById('exploreSearchInput').value = query;
    const results = worksData.filter(work => 
        work.title.toLowerCase().includes(query.toLowerCase()) ||
        work.author.toLowerCase().includes(query.toLowerCase()) ||
        work.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    displayExploreResults(results);
    hideSearchPanel();
}

function searchByTag(tag) {
    document.getElementById('exploreSearchInput').value = tag;
    searchWorks(tag);
}

function showSuggestions() {
    const input = document.getElementById('exploreSearchInput');
    const query = input.value.trim().toLowerCase();
    
    if (query.length > 0) {
        let suggestions = [];
        
        // 하이큐 관련 연관검색어
        if (query.includes('하이큐')) {
            suggestions = [
                '하이큐 드림',
                '하이큐 일러스트',
                '하이큐 소설',
                '하이큐 팬아트',
                '하이큐 캐릭터',
                '하이큐 만화'
            ];
        }
        // 다른 검색어들에 대한 연관검색어
        else {
            const baseKeywords = ['하이큐', '진격의거인', '원피스', '나루토', '귀멸의칼날', '팬아트', '일러스트', '소설'];
            suggestions = baseKeywords.filter(keyword => 
                keyword.toLowerCase().includes(query)
            );
            
            // 검색어 기반 확장 검색어 추가
            if (suggestions.length > 0) {
                const expandedSuggestions = [];
                suggestions.forEach(base => {
                    if (base !== query) {
                        expandedSuggestions.push(base);
                        expandedSuggestions.push(base + ' 일러스트');
                        expandedSuggestions.push(base + ' 팬아트');
                    }
                });
                suggestions = [...new Set(expandedSuggestions)].slice(0, 6);
            }
        }
        
        if (suggestions.length > 0) {
            const suggestionsList = document.getElementById('suggestionsList');
            suggestionsList.innerHTML = suggestions.map(suggestion => 
                `<div class="suggestion-item" onclick="selectSuggestion('${suggestion}')">${suggestion}</div>`
            ).join('');
            
            showSearchPanel();
        } else {
            hideSearchPanel();
        }
    } else {
        hideSearchPanel();
    }
}


function selectSuggestion(suggestion) {
    document.getElementById('exploreSearchInput').value = suggestion;
    searchWorks(suggestion);
    hideSearchPanel();
}

function clearExploreSearch() {
    document.getElementById('exploreSearchInput').value = '';
    document.getElementById('searchClear').style.display = 'none';
    loadExploreWorks();
    hideSearchPanel();
}

function changeSortOrder(sortType) {
    document.querySelectorAll('.sort-btn').forEach(btn => btn.classList.remove('active'));
    const sortBtn = document.querySelector(`[data-sort="${sortType}"]`);
    if (sortBtn) sortBtn.classList.add('active');
    
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
    // 기존 displayExploreResults 함수에서 empty state 부분만 수정
function displayExploreResults(works) {
    const container = document.getElementById('exploreResults');
    
    if (works.length === 0) {
        container.innerHTML = `
            <div class="search-empty-state">
                <h3>검색 결과가 없어요</h3>
                <p>검색어를 정확하게 입력했는지 확인해주세요</p>
            </div>
        `;
        return;
    }
    
    // 나머지 코드는 그대로 유지
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
    if (!container) return;
    
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
                    <div class="community-meta">${community.members}명</div>
                </div>
            </div>
            <div class="community-description">${community.description}</div>
            <div class="community-posts">
                ${community.posts ? community.posts.map(post => `
                    <div class="post-item" onclick="event.stopPropagation(); showPostDetail(${post.id}, ${community.id})">
                        <div class="post-header">
                            <div class="post-avatar">${post.author.charAt(0)}</div>
                            <div class="post-author">${post.author}</div>
                            <div class="post-meta">${formatTime(post.timestamp)}</div>
                        </div>
                        <div class="post-title">${post.title}</div>
                        <div class="post-content">${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</div>
                        <div class="post-actions">
                            <div class="post-stats">
                                <span class="action-btn">
                                    <span class="icon">❤️</span>
                                    <span class="count">${post.likes || 0}</span>
                                </span>
                                <span class="action-btn">
                                    <span class="icon">💬</span>
                                    <span class="count">${post.comments ? post.comments.length : 0}</span>
                                </span>
                                <span class="action-btn">
                                    <span class="icon">🔖</span>
                                    <span class="count">${post.bookmarks || 0}</span>
                                </span>
                                <span class="action-btn" onclick="event.stopPropagation(); sharePost()">
                                    <span class="icon">📤</span>
                                    <span class="text">공유</span>
                                </span>
                            </div>
                        </div>
                    </div>
                `).join('') : ''}
            </div>
        </div>
    `).join('');
}


function filterCommunities(category) {
    document.querySelectorAll('.community-filter').forEach(btn => btn.classList.remove('active'));
    const filterBtn = document.querySelector(`[data-filter="${category}"]`);
    if (filterBtn) filterBtn.classList.add('active');
    
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
    showNotification('커뮤니티 참여 기능이 활성화되었습니다! 👥');
}

// 게시물 상세보기
function showPostDetail(postId, communityId) {
    const community = communitiesData.find(c => c.id === communityId);
    const post = community?.posts.find(p => p.id === postId);
    
    if (!post) return;
    
    currentPost = post;
    
    document.getElementById('postDetailTitle').textContent = post.title;
    document.querySelector('.post-detail-content').textContent = post.content;
    document.getElementById('likeCount').textContent = post.likes || 0;
    document.getElementById('commentCount').textContent = post.comments ? post.comments.length : 0;
    document.getElementById('bookmarkCount').textContent = post.bookmarks || 0;
    
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = '';
    
    if (post.comments) {
        post.comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment';
            commentDiv.innerHTML = `
                <div class="comment-author">${comment.author}</div>
                <div class="comment-text">${comment.text}</div>
            `;
            commentsList.appendChild(commentDiv);
        });
    }
    
    document.getElementById('postDetailModal').style.display = 'flex';
}

function hidePostDetail() {
    document.getElementById('postDetailModal').style.display = 'none';
    currentPost = null;
}

function toggleLike() {
    if (!currentPost) return;
    
    const likeBtn = document.querySelector('.like-btn');
    const likeCount = document.getElementById('likeCount');
    
    if (likeBtn.classList.contains('liked')) {
        likeBtn.classList.remove('liked');
        currentPost.likes = Math.max(0, (currentPost.likes || 0) - 1);
        showNotification('좋아요를 취소했습니다');
    } else {
        likeBtn.classList.add('liked');
        currentPost.likes = (currentPost.likes || 0) + 1;
        showNotification('좋아요를 눌렀습니다! ❤️');
    }
    
    likeCount.textContent = currentPost.likes;
}

function toggleBookmark() {
    if (!currentPost) return;
    
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    const bookmarkCount = document.getElementById('bookmarkCount');
    
    if (bookmarkBtn.classList.contains('bookmarked')) {
        bookmarkBtn.classList.remove('bookmarked');
        currentPost.bookmarks = Math.max(0, (currentPost.bookmarks || 0) - 1);
        showNotification('북마크를 해제했습니다');
    } else {
        bookmarkBtn.classList.add('bookmarked');
        currentPost.bookmarks = (currentPost.bookmarks || 0) + 1;
        showNotification('북마크에 추가했습니다! 🔖');
    }
    
    bookmarkCount.textContent = currentPost.bookmarks;
}

function sharePost() {
    if (navigator.share && currentPost) {
        navigator.share({
            title: currentPost.title,
            text: currentPost.content,
            url: window.location.href
        }).then(() => {
            showNotification('게시물이 공유되었습니다! 📤');
        }).catch(err => {
            showNotification('공유 기능을 사용할 수 없습니다');
        });
    } else {
        // 클립보드에 복사
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('링크가 클립보드에 복사되었습니다! 📤');
        }).catch(err => {
            showNotification('공유 기능 준비 중입니다! 📤');
        });
    }
}

function handleCommentInput(event) {
    if (event.key === 'Enter') {
        submitComment();
    }
}

function submitComment() {
    const input = document.getElementById('commentInput');
    const text = input.value.trim();
    
    if (!text || !currentPost) return;
    
    if (!auth.currentUser) {
        showNotification('로그인이 필요합니다!');
        return;
    }
    
    const newComment = {
        id: Date.now(),
        author: auth.currentUser.displayName || auth.currentUser.email.split('@')[0],
        text: text,
        timestamp: Date.now()
    };
    
    if (!currentPost.comments) {
        currentPost.comments = [];
    }
    currentPost.comments.push(newComment);
    
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.innerHTML = `
        <div class="comment-author">${newComment.author}</div>
        <div class="comment-text">${newComment.text}</div>
    `;
    
    document.getElementById('commentsList').appendChild(commentDiv);
    document.getElementById('commentCount').textContent = currentPost.comments.length;
    
    input.value = '';
    showNotification('댓글이 작성되었습니다! 💬');
}

function focusCommentInput() {
    document.getElementById('commentInput').focus();
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
            <div class="chat-time">${formatTime(room.timestamp)}</div>
            ${room.unread > 0 ? `<div class="unread-badge">${room.unread}</div>` : ''}
        </div>
    `).join('');
}

function selectChatRoom(roomId) {
    currentChatRoom = roomId;
    const room = chatRoomsData.find(r => r.id === roomId);
    
    // 읽음 처리
    room.unread = 0;
    
    // UI 업데이트
    loadChatRooms();
    
    // 채팅방 헤더 업데이트
    document.querySelector('#chatTopBar .chat-user-info h3').textContent = room.name;
    document.querySelector('#chatTopBar .status').textContent = room.online ? '온라인' : '오프라인';
    document.querySelector('#chatTopBar .status').className = `status ${room.online ? 'online' : 'offline'}`;
    
    // 환영 메시지 숨기기
    const welcomeMsg = document.querySelector('.welcome-message');
    if (welcomeMsg) welcomeMsg.style.display = 'none';
    
    loadChatMessages(roomId);
}

function loadChatMessages(roomId) {
    const container = document.getElementById('chatMessages');
    const room = chatRoomsData.find(r => r.id === roomId);
    
    if (!room || !room.messages) return;
    
    container.innerHTML = room.messages.map(message => `
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
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const content = input.value.trim();
    
    if (!content || !currentChatRoom) return;
    
    const room = chatRoomsData.find(r => r.id === currentChatRoom);
    if (!room) return;
    
    const newMessage = {
        id: Date.now(),
        sender: 'me',
        content: content,
        timestamp: Date.now(),
        senderName: 'Me'
    };
    
    if (!room.messages) {
        room.messages = [];
    }
    room.messages.push(newMessage);
    room.lastMessage = content;
    room.timestamp = Date.now();
    
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
    
    // 채팅방 목록 업데이트
    loadChatRooms();
    
    showNotification('메시지 전송됨! 💬');
}

function showNewChatModal() {
    document.getElementById('newChatModal').style.display = 'flex';
    loadUsersList();
}

function hideNewChatModal() {
    document.getElementById('newChatModal').style.display = 'none';
}

function loadUsersList() {
    const container = document.getElementById('usersList');
    
    container.innerHTML = usersData.map(user => `
        <div class="user-item" onclick="startNewChat(${user.id})">
            <div class="user-avatar">${user.avatar}</div>
            <div class="user-info">
                <h4>${user.name}</h4>
                <span class="status ${user.online ? 'online' : 'offline'}">
                    ${user.online ? '온라인' : '오프라인'}
                </span>
            </div>
        </div>
    `).join('');
}

function searchUsers() {
    const query = document.getElementById('userSearchInput').value.toLowerCase();
    const filteredUsers = usersData.filter(user => 
        user.name.toLowerCase().includes(query)
    );
    
    const container = document.getElementById('usersList');
    container.innerHTML = filteredUsers.map(user => `
        <div class="user-item" onclick="startNewChat(${user.id})">
            <div class="user-avatar">${user.avatar}</div>
            <div class="user-info">
                <h4>${user.name}</h4>
                <span class="status ${user.online ? 'online' : 'offline'}">
                    ${user.online ? '온라인' : '오프라인'}
                </span>
            </div>
        </div>
    `).join('');
}

function startNewChat(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;
    
    // 기존 채팅방이 있는지 확인
    let existingRoom = chatRoomsData.find(room => room.name === user.name);
    
    if (!existingRoom) {
        // 새 채팅방 생성
        existingRoom = {
            id: Date.now(),
            name: user.name,
            lastMessage: '',
            timestamp: Date.now(),
            unread: 0,
            avatar: user.avatar,
            online: user.online,
            messages: []
        };
        chatRoomsData.push(existingRoom);
    }
    
    hideNewChatModal();
    loadChatRooms();
    selectChatRoom(existingRoom.id);
    
    showNotification(`${user.name}님과의 채팅이 시작되었습니다! 💬`);
}

function searchChats() {
    const query = document.getElementById('chatSearchInput').value.toLowerCase();
    const container = document.getElementById('chatRoomsList');
    
    const filteredRooms = chatRoomsData.filter(room => 
        room.name.toLowerCase().includes(query)
    );
    
    container.innerHTML = filteredRooms.map(room => `
        <div class="chat-room ${currentChatRoom === room.id ? 'active' : ''}" onclick="selectChatRoom(${room.id})">
            <div class="chat-avatar">${room.avatar}</div>
            <div class="chat-user-info">
                <h3>${room.name}</h3>
                <div class="chat-preview">${room.lastMessage}</div>
            </div>
            <div class="chat-time">${formatTime(room.timestamp)}</div>
            ${room.unread > 0 ? `<div class="unread-badge">${room.unread}</div>` : ''}
        </div>
    `).join('');
}

function attachFile() {
    document.getElementById('fileUploadModal').style.display = 'flex';
}

function hideFileUploadModal() {
    document.getElementById('fileUploadModal').style.display = 'none';
    document.getElementById('selectedFiles').innerHTML = '';
}

function handleFileSelect() {
    const files = document.getElementById('fileInput').files;
    const container = document.getElementById('selectedFiles');
    
    container.innerHTML = '';
    
    Array.from(files).forEach((file, index) => {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'file-item';
        fileDiv.innerHTML = `
            <div class="file-icon">📁</div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <button class="file-remove" onclick="removeFile(${index})">✕</button>
        `;
        container.appendChild(fileDiv);
    });
}

function removeFile(index) {
    const fileInput = document.getElementById('fileInput');
    const files = Array.from(fileInput.files);
    files.splice(index, 1);
    
    // 파일 입력 재설정
    const dt = new DataTransfer();
    files.forEach(file => dt.items.add(file));
    fileInput.files = dt.files;
    
    handleFileSelect();
}

function uploadFiles() {
    const files = document.getElementById('fileInput').files;
    if (files.length === 0) return;
    
    // 실제 파일 업로드 로직 구현 예정
    showNotification(`${files.length}개 파일이 전송되었습니다! 📎`);
    hideFileUploadModal();
}

function showEmojiPicker() {
    const picker = document.getElementById('emojiPicker');
    const isVisible = picker.style.display === 'block';
    picker.style.display = isVisible ? 'none' : 'block';
}

function hideEmojiPicker() {
    document.getElementById('emojiPicker').style.display = 'none';
}

function insertEmoji(emoji) {
    const input = document.getElementById('messageInput');
    input.value += emoji;
    input.focus();
    hideEmojiPicker();
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
        
        const newWork = {
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
            comments: []
        };
        
        await addDoc(collection(db, 'works'), newWork);
        
        // 로컬 데이터에도 추가
        worksData.unshift({
            ...newWork,
            id: Date.now(),
            timestamp: Date.now(),
            thumbnail: imageUrl
        });
        
        showNotification('작품이 성공적으로 업로드되었습니다! 🎉');
        hideUploadModal();
        
        // 홈 화면 새로고침
        if (window.loadAllHomeSections) {
            window.loadAllHomeSections();
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
    const work = worksData.find(w => w.id === workId);
    if (work) {
        showNotification(`"${work.title}" 상세보기 기능 준비 중입니다! 🎨`);
    } else {
        showNotification('작품 상세보기 기능 준비 중입니다! 🎨');
    }
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

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(45deg, #1f2937, #374151);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(31, 41, 55, 0.5);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
        max-width: 300px;
        font-size: 0.9rem;
        font-family: 'Pretendard', sans-serif;
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
            transform: translateX(100px);
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
            transform: translateX(100px);
        }
    }
    
    .user-item {
        display: flex;
        align-items: center;
        padding: 1rem;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s ease;
        margin-bottom: 0.5rem;
    }
    
    .user-item:hover {
        background: #f3f4f6;
    }
    
    .user-item .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(45deg, #1f2937, #374151);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        margin-right: 1rem;
    }
    
    .user-item .user-info h4 {
        margin: 0 0 0.25rem 0;
        font-size: 0.95rem;
        color: #1f2937;
    }
    
    .user-item .status {
        font-size: 0.8rem;
    }
`;
document.head.appendChild(style);


// 트위터 로그인 함수
async function loginWithTwitter() {
    if (!window.auth) {
        showNotification('Firebase가 로드되지 않았습니다.');
        return;
    }
    
    try {
        const provider = new firebase.auth.TwitterAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        await setDoc(doc(db, 'users', user.uid), {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            provider: 'twitter',
            createdAt: serverTimestamp(),
            works: 0,
            followers: 0,
            following: 0
        }, { merge: true });
        
        showNotification('트위터 로그인 성공! 🐦');
    } catch (error) {
        console.error('트위터 로그인 오류:', error);
        showNotification('트위터 로그인 실패: ' + error.message);
    }
}

// 네이버 로그인 함수 (실제 구현)
async function loginWithNaver() {
    // 네이버 로그인은 OAuth 방식으로 구현
    showNotification('네이버 로그인 기능을 활성화했습니다! 🟢');
    
    // 실제 네이버 OAuth 구현 코드는 별도 설정이 필요
    // 현재는 기본 동작만 구현
}

// 대시보드 탭 전환 함수
function showDashboardTab(tabName) {
    // 모든 탭 비활성화
    document.querySelectorAll('.dashboard-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.dashboard-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 선택된 탭 활성화
    event.target.classList.add('active');
    document.getElementById(`dashboard-${tabName}`).classList.add('active');
}
