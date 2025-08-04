// 전역 변수들
let currentScreen = 'home';
let currentSort = 'popular';
let currentCommunityFilter = 'all';
let currentGenreFilter = 'all';
let currentChatRoom = null;
let searchTimeout = null;

// 샘플 데이터
let worksData = [
  {
    id: 1,
    title: '하이큐!! 최신 팬아트',
    author: '애니메이터 김철수',
    avatar: '김',
    category: 'animation',
    thumbnail: 'https://via.placeholder.com/200x160/1f2937/f3f4f6?text=Haikyuu+Art',
    image: 'https://via.placeholder.com/600x400/1f2937/f3f4f6?text=Haikyuu+Fanart',
    description: '새로운 하이큐!! 팬아트 작업 완료했습니다! 🏐 많은 관심 부탁드려요~',
    tags: ['하이큐', '팬아트', '애니메이션', '스포츠'],
    likes: 1247,
    views: 5832,
    comments: 89,
    bookmarks: 245,
    shares: 67,
    liked: false,
    bookmarked: false,
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    date: '2시간 전'
  },
  {
    id: 2,
    title: '진격의 거인 2차 창작 소설',
    author: '소설가 박영희',
    avatar: '박',
    category: 'novel',
    thumbnail: 'https://via.placeholder.com/200x160/374151/f3f4f6?text=AOT+Novel',
    image: 'https://via.placeholder.com/600x400/374151/f3f4f6?text=Attack+on+Titan',
    description: '진격의 거인 2차 창작 소설 새 챕터 업로드! 리바이와 에렌의 만남을 그린 이야기입니다.',
    tags: ['진격의거인', '소설', '2차창작', 'AOT'],
    likes: 892,
    views: 3241,
    comments: 156,
    bookmarks: 178,
    shares: 34,
    liked: false,
    bookmarked: false,
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
    date: '4시간 전'
  },
  {
    id: 3,
    title: '원피스 루피 기어5 일러스트',
    author: '일러스트레이터 최민수',
    avatar: '최',
    category: 'illustration',
    thumbnail: 'https://via.placeholder.com/200x160/6b7280/f3f4f6?text=One+Piece',
    image: 'https://via.placeholder.com/600x400/6b7280/f3f4f6?text=Luffy+Gear5',
    description: '원피스 루피 새로운 기어5 형태 그려봤어요! 정말 멋있게 나온 것 같아요.',
    tags: ['원피스', '루피', '기어5', '일러스트'],
    likes: 2156,
    views: 8947,
    comments: 234,
    bookmarks: 567,
    shares: 123,
    liked: false,
    bookmarked: false,
    timestamp: Date.now() - 6 * 60 * 60 * 1000,
    date: '6시간 전'
  },
  {
    id: 4,
    title: '나루토 사스케 팬아트',
    author: '디지털 아티스트 이영수',
    avatar: '이',
    category: 'illustration',
    thumbnail: 'https://via.placeholder.com/200x160/4b5563/f3f4f6?text=Naruto+Art',
    image: 'https://via.placeholder.com/600x400/4b5563/f3f4f6?text=Sasuke+Art',
    description: '나루토 사스케의 새로운 모습을 그려보았습니다. 어둠 속에서 빛나는 사스케!',
    tags: ['나루토', '사스케', '팬아트', '닌자'],
    likes: 1456,
    views: 6234,
    comments: 98,
    bookmarks: 312,
    shares: 78,
    liked: false,
    bookmarked: false,
    timestamp: Date.now() - 8 * 60 * 60 * 1000,
    date: '8시간 전'
  },
  {
    id: 5,
    title: '귀멸의 칼날 탄지로 만화',
    author: '만화가 정수현',
    avatar: '정',
    category: 'manga',
    thumbnail: 'https://via.placeholder.com/200x160/9ca3af/f3f4f6?text=Demon+Slayer',
    image: 'https://via.placeholder.com/600x400/9ca3af/f3f4f6?text=Tanjiro+Manga',
    description: '귀멸의 칼날 탄지로의 새로운 모험을 그린 단편 만화입니다.',
    tags: ['귀멸의칼날', '탄지로', '만화', '단편'],
    likes: 3421,
    views: 12567,
    comments: 445,
    bookmarks: 890,
    shares: 234,
    liked: false,
    bookmarked: false,
    timestamp: Date.now() - 12 * 60 * 60 * 1000,
    date: '12시간 전'
  },
  {
    id: 6,
    title: 'My Hero Academia 히어로 일러스트',
    author: '아트디렉터 김민지',
    avatar: '김',
    category: 'illustration',
    thumbnail: 'https://via.placeholder.com/200x160/d1d5db/1f2937?text=MHA+Art',
    image: 'https://via.placeholder.com/600x400/d1d5db/1f2937?text=Hero+Illustration',
    description: '나의 히어로 아카데미아 오리지널 히어로 캐릭터를 그려보았습니다!',
    tags: ['히로아카', '히어로', '일러스트', '오리지널'],
    likes: 987,
    views: 4321,
    comments: 67,
    bookmarks: 234,
    shares: 45,
    liked: false,
    bookmarked: false,
    timestamp: Date.now() - 16 * 60 * 60 * 1000,
    date: '16시간 전'
  }
];

let communities = [
  {
    id: 1,
    name: '하이큐!! 팬클럽',
    category: 'animation',
    members: 1234,
    todayPosts: 15,
    description: '하이큐를 사랑하는 사람들이 모인 커뮤니티입니다. 팬아트, 2차 창작, 토론 모두 환영해요!',
    icon: '🏐',
    tags: ['하이큐', '애니메이션', '배구'],
    gradient: 'linear-gradient(45deg, #ff6b6b, #feca57)'
  },
  {
    id: 2,
    name: '일러스트 갤러리',
    category: 'illustration',
    members: 2567,
    todayPosts: 23,
    description: '다양한 스타일의 일러스트를 공유하고 피드백을 주고받는 공간입니다.',
    icon: '🎨',
    tags: ['일러스트', '드로잉', '아트'],
    gradient: 'linear-gradient(45deg, #a8edea, #fed6e3)'
  },
  {
    id: 3,
    name: '진격의 거인 토론방',
    category: 'animation',
    members: 892,
    todayPosts: 8,
    description: '진격의 거인에 대한 이론, 분석, 2차 창작을 나누는 커뮤니티입니다.',
    icon: '⚔️',
    tags: ['진격의거인', '애니메이션', '토론'],
    gradient: 'linear-gradient(45deg, #667eea, #764ba2)'
  },
  {
    id: 4,
    name: '소설 창작 워크샵',
    category: 'novel',
    members: 445,
    todayPosts: 12,
    description: '2차 창작 소설 작가들이 모여 작품을 공유하고 피드백을 나누는 공간입니다.',
    icon: '📚',
    tags: ['소설', '창작', '피드백'],
    gradient: 'linear-gradient(45deg, #ffecd2, #fcb69f)'
  },
  {
    id: 5,
    name: '만화 스튜디오',
    category: 'manga',
    members: 756,
    todayPosts: 19,
    description: '만화 창작자들이 모여 기술을 공유하고 협업하는 커뮤니티입니다.',
    icon: '📖',
    tags: ['만화', '웹툰', '창작'],
    gradient: 'linear-gradient(45deg, #d299c2, #fef9d7)'
  }
];

let chatRooms = [
  {
    id: 'user1',
    name: '김애니',
    avatar: '김',
    isOnline: true,
    lastMessage: '하이큐 팬아트 정말 멋있어요!',
    lastTime: '오후 2:30',
    unreadCount: 2,
    isGroup: false,
    messages: [
      {
        id: 1,
        sender: 'user1',
        senderName: '김애니',
        content: '안녕하세요! 하이큐 팬아트 정말 멋있어요 👏',
        time: '오후 2:28',
        isMe: false
      },
      {
        id: 2,
        sender: 'me',
        senderName: '김창작',
        content: '감사합니다! 앞으로도 더 좋은 작품으로 찾아뵐게요 😊',
        time: '오후 2:30',
        isMe: true
      }
    ]
  },
  {
    id: 'group1',
    name: '하이큐 팬아트 모임',
    avatar: '👥',
    isGroup: true,
    memberCount: 8,
    lastMessage: '박영희: 다음 작품 주제 투표해요~',
    lastTime: '오후 1:15',
    unreadCount: 0,
    messages: [
      {
        id: 1,
        sender: 'user2',
        senderName: '박영희',
        content: '다음 작품 주제 투표해요~',
        time: '오후 1:15',
        isMe: false
      },
      {
        id: 2,
        sender: 'user3',
        senderName: '이일러스트',
        content: '좋아요! 어떤 주제들이 있나요?',
        time: '오후 1:20',
        isMe: false
      }
    ]
  }
];

// 인기 태그들
const trendingTags = [
  '하이큐', '진격의거인', '원피스', '나루토', '귀멸의칼날', 
  '팬아트', '일러스트', '소설', '만화', '2차창작'
];

// 화면 전환 함수
function showScreen(screenName) {
  // 모든 화면 숨기기
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  
  // 모든 네비게이션 아이템 비활성화
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // 선택된 화면 보이기
  document.getElementById(screenName).classList.add('active');
  
  // 해당 네비게이션 아이템 활성화
  document.querySelector(`[data-screen="${screenName}"]`).classList.add('active');
  
  currentScreen = screenName;
  
  // 화면별 초기화 작업
  switch(screenName) {
    case 'home':
      renderHomeContent();
      break;
    case 'explore':
      renderExploreContent();
      break;
    case 'community':
      renderCommunities();
      break;
    case 'messages':
      if (chatRooms.length > 0 && !currentChatRoom) {
        openChatRoom(chatRooms[0].id);
      }
      break;
  }
}

// 홈 화면 콘텐츠 렌더링
function renderHomeContent() {
  // 인기 작품 렌더링
  renderWorksGrid(worksData.slice(0, 8), 'popularWorks');
  
  // 최신 업로드 렌더링
  renderWorksScroll(worksData.slice(0, 6), 'latestWorks');
  
  // 장르별 작품 렌더링
  renderWorksGrid(getWorksByGenre(currentGenreFilter), 'genreWorks');
}

// 작품 그리드 렌더링
function renderWorksGrid(works, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = works.map(work => `
    <div class="work-item" onclick="openWork(${work.id})">
      <img src="${work.thumbnail}" alt="${work.title}" class="work-thumbnail">
      <div class="work-content">
        <h3>${work.title}</h3>
        <div class="work-author">${work.author}</div>
        <div class="work-stats">
          <span>❤️ ${formatNumber(work.likes)}</span>
          <span>👀 ${formatNumber(work.views)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// 작품 가로 스크롤 렌더링
function renderWorksScroll(works, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = works.map(work => `
    <div class="work-item" onclick="openWork(${work.id})">
      <img src="${work.thumbnail}" alt="${work.title}" class="work-thumbnail">
      <div class="work-content">
        <h3>${work.title}</h3>
        <div class="work-author">${work.author}</div>
        <div class="work-stats">
          <span>❤️ ${formatNumber(work.likes)}</span>
          <span>👀 ${formatNumber(work.views)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// 숫자 포맷팅
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// 장르별 작품 필터링
function filterByGenre(genre) {
  // 모든 장르 탭 비활성화
  document.querySelectorAll('.genre-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // 클릭된 탭 활성화
  event.target.classList.add('active');
  
  currentGenreFilter = genre;
  
  // 장르별 작품 렌더링
  const filteredWorks = getWorksByGenre(genre);
  renderWorksGrid(filteredWorks, 'genreWorks');
}

// 장르별 작품 가져오기
function getWorksByGenre(genre) {
  if (genre === 'all') {
    return worksData;
  }
  return worksData.filter(work => work.category === genre);
}

// 작품 상세 모달 열기
function openWork(workId) {
  const work = worksData.find(w => w.id === workId);
  if (!work) return;
  
  // 모달 요소들 업데이트
  document.getElementById('workImage').src = work.image;
  document.getElementById('workAuthor').textContent = work.author;
  document.getElementById('workDate').textContent = work.date;
  document.getElementById('workTitle').textContent = work.title;
  document.getElementById('workDescription').textContent = work.description;
  
  // 태그 렌더링
  const tagsContainer = document.getElementById('workTags');
  tagsContainer.innerHTML = work.tags.map(tag => 
    `<span class="tag" onclick="searchByTag('${tag}')">#${tag}</span>`
  ).join('');
  
  // 작품 액션 버튼 업데이트
  updateWorkActions(work);
  
  // 댓글 렌더링 (샘플 댓글)
  renderWorkComments(work.id);
  
  // 모달 표시
  document.getElementById('workModal').style.display = 'flex';
  
  // 조회수 증가
  work.views++;
}

// 작품 액션 버튼 업데이트
function updateWorkActions(work) {
  const likeBtn = document.querySelector('.work-modal .like-btn');
  const commentBtn = document.querySelector('.work-modal .comment-btn');
  const bookmarkBtn = document.querySelector('.work-modal .bookmark-btn');
  
  // 좋아요 버튼
  likeBtn.querySelector('.count').textContent = formatNumber(work.likes);
  if (work.liked) {
    likeBtn.classList.add('active');
  } else {
    likeBtn.classList.remove('active');
  }
  
  // 댓글 버튼
  commentBtn.querySelector('.count').textContent = work.comments;
  
  // 북마크 버튼
  bookmarkBtn.querySelector('.text').textContent = work.bookmarked ? '스크랩됨' : '스크랩';
  if (work.bookmarked) {
    bookmarkBtn.classList.add('active');
  } else {
    bookmarkBtn.classList.remove('active');
  }
}

// 작품 댓글 렌더링 (샘플)
function renderWorkComments(workId) {
  const commentsContainer = document.getElementById('workComments');
  const sampleComments = [
    { author: '팬아트러버', avatar: '팬', content: '정말 멋진 작품이네요! 👏', time: '1시간 전' },
    { author: '일러스트매니아', avatar: '일', content: '색감이 정말 예쁘네요~', time: '2시간 전' },
    { author: '애니덕후', avatar: '애', content: '이런 스타일 너무 좋아해요!', time: '3시간 전' }
  ];
  
  commentsContainer.innerHTML = `
    <div class="comment-input" style="margin-bottom: 1rem;">
      <input type="text" placeholder="댓글을 입력하세요..." style="flex: 1; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 20px; margin-right: 0.5rem;">
      <button onclick="addWorkComment(${workId})" style="padding: 0.5rem 1rem; background: linear-gradient(45deg, #1f2937, #374151); color: white; border: none; border-radius: 20px; cursor: pointer;">등록</button>
    </div>
    <div class="comments-list">
      ${sampleComments.map(comment => `
        <div class="comment" style="display: flex; gap: 0.75rem; margin-bottom: 1rem;">
          <div class="comment-avatar" style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(45deg, #1f2937, #374151); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 0.8rem;">${comment.avatar}</div>
          <div class="comment-content">
            <strong style="color: #1f2937;">${comment.author}</strong>
            <p style="margin: 0.25rem 0; color: #374151;">${comment.content}</p>
            <span style="color: #9ca3af; font-size: 0.75rem;">${comment.time}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// 작품 모달 닫기
function closeWorkModal() {
  document.getElementById('workModal').style.display = 'none';
}

// 작품 좋아요 토글
function toggleWorkLike() {
  const currentWorkId = getCurrentWorkId();
  if (!currentWorkId) return;
  
  const work = worksData.find(w => w.id === currentWorkId);
  if (!work) return;
  
  work.liked = !work.liked;
  work.likes += work.liked ? 1 : -1;
  
  updateWorkActions(work);
  showNotification(work.liked ? '좋아요를 눌렀습니다!' : '좋아요를 취소했습니다.');
}

// 작품 북마크 토글
function toggleWorkBookmark() {
  const currentWorkId = getCurrentWorkId();
  if (!currentWorkId) return;
  
  const work = worksData.find(w => w.id === currentWorkId);
  if (!work) return;
  
  work.bookmarked = !work.bookmarked;
  work.bookmarks += work.bookmarked ? 1 : -1;
  
  updateWorkActions(work);
  showNotification(work.bookmarked ? '작품을 스크랩했습니다!' : '스크랩을 취소했습니다.');
}

// 작품 공유
function shareWork() {
  const currentWorkId = getCurrentWorkId();
  if (!currentWorkId) return;
  
  const work = worksData.find(w => w.id === currentWorkId);
  if (!work) return;
  
  if (navigator.share) {
    navigator.share({
      title: work.title,
      text: work.description,
      url: `https://creta.com/work/${currentWorkId}`
    });
  } else {
    const url = `https://creta.com/work/${currentWorkId}`;
    navigator.clipboard.writeText(url).then(() => {
      showNotification('링크가 클립보드에 복사되었습니다!');
    });
  }
  
  work.shares++;
}

// 현재 작품 ID 가져오기 (모달에서)
function getCurrentWorkId() {
  const modal = document.getElementById('workModal');
  if (modal.style.display === 'flex') {
    const title = document.getElementById('workTitle').textContent;
    const work = worksData.find(w => w.title === title);
    return work ? work.id : null;
  }
  return null;
}

// 탐색 화면 렌더링
function renderExploreContent() {
  const sortedWorks = getSortedWorks(currentSort);
  renderWorksGrid(sortedWorks, 'exploreResults');
}

// 정렬된 작품 가져오기
function getSortedWorks(sortType) {
  let sortedWorks = [...worksData];
  
  switch(sortType) {
    case 'popular':
      sortedWorks.sort((a, b) => b.likes - a.likes);
      break;
    case 'latest':
      sortedWorks.sort((a, b) => b.timestamp - a.timestamp);
      break;
    case 'trending':
      sortedWorks.sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares));
      break;
  }
  
  return sortedWorks;
}

// 정렬 변경
function changeSort(sortType) {
  // 모든 정렬 버튼 비활성화
  document.querySelectorAll('.sort-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // 클릭된 버튼 활성화
  document.querySelector(`[data-sort="${sortType}"]`).classList.add('active');
  
  currentSort = sortType;
  renderExploreContent();
}

// 검색 처리
function handleSearch() {
  const input = document.getElementById('exploreSearch');
  const query = input.value.trim().toLowerCase();
  
  const trendingSection = document.getElementById('trendingTags');
  const suggestedSection = document.getElementById('suggestedTags');
  const clearButton = input.nextElementSibling;
  
  if (query.length > 0) {
    clearButton.style.display = 'block';
    trendingSection.style.display = 'none';
    suggestedSection.style.display = 'block';
    
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      showSuggestedTags(query);
      performSearch(query);
    }, 300);
  } else {
    clearButton.style.display = 'none';
    trendingSection.style.display = 'block';
    suggestedSection.style.display = 'none';
    renderExploreContent();
  }
}

// 연관 태그 표시
function showSuggestedTags(query) {
  const suggestedList = document.getElementById('suggestedList');
  
  const suggestions = trendingTags.filter(tag => 
    tag.toLowerCase().includes(query)
  );
  
  const additionalSuggestions = [
    '2차창작', '동인지', '오리지널', '콜라보', '이벤트', '컨테스트',
    '튜토리얼', '과정샷', '라이브드로잉', '크로키'
  ].filter(tag => tag.toLowerCase().includes(query));
  
  const allSuggestions = [...suggestions, ...additionalSuggestions];
  
  suggestedList.innerHTML = allSuggestions.slice(0, 8).map(tag => 
    `<span class="tag" onclick="searchByTag('${tag}')">#${tag}</span>`
  ).join('');
}

// 실제 검색 수행
function performSearch(query) {
  const filteredWorks = worksData.filter(work => 
    work.title.toLowerCase().includes(query) ||
    work.description.toLowerCase().includes(query) ||
    work.author.toLowerCase().includes(query) ||
    work.tags.some(tag => tag.toLowerCase().includes(query))
  );
  
  renderWorksGrid(filteredWorks, 'exploreResults');
}

// 태그로 검색
function searchByTag(tag) {
  const input = document.getElementById('exploreSearch');
  if (input) {
    input.value = tag;
    handleSearch();
  }
}

// 검색 초기화
function clearSearch() {
  const input = document.getElementById('exploreSearch');
  input.value = '';
  handleSearch();
}

// 커뮤니티 렌더링
function renderCommunities() {
  const filteredCommunities = currentCommunityFilter === 'all' 
    ? communities 
    : communities.filter(community => community.category === currentCommunityFilter);
  
  const container = document.getElementById('communitiesList');
  if (!container) return;
  
  container.innerHTML = filteredCommunities.map(community => `
    <div class="community-card" onclick="openCommunity(${community.id})">
      <div class="community-header-info">
        <div class="community-icon" style="background: ${community.gradient};">
          ${community.icon}
        </div>
        <div class="community-info">
          <h3>${community.name}</h3>
          <div class="community-meta">
            멤버 ${community.members.toLocaleString()}명 • 오늘 새 글 ${community.todayPosts}개
          </div>
        </div>
      </div>
      <div class="community-description">
        ${community.description}
      </div>
      <div class="work-tags">
        ${community.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// 커뮤니티 필터링
function filterCommunities(filter) {
  // 모든 필터 버튼 비활성화
  document.querySelectorAll('.community-filter').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // 클릭된 버튼 활성화
  document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
  
  currentCommunityFilter = filter;
  renderCommunities();
}

// 커뮤니티 열기
function openCommunity(communityId) {
  showNotification('커뮤니티 상세 화면이 곧 업데이트될 예정입니다!');
}

// 커뮤니티 생성 모달 표시
function showCreateCommunityModal() {
  document.getElementById('createCommunityModal').style.display = 'flex';
}

// 커뮤니티 생성 모달 숨기기
function hideCreateCommunityModal() {
  const modal = document.getElementById('createCommunityModal');
  modal.style.display = 'none';
  
  // 폼 초기화
  document.getElementById('communityName').value = '';
  document.getElementById('communityDescription').value = '';
  document.getElementById('communityTags').value = '';
}

// 커뮤니티 생성
function createCommunity() {
  const name = document.getElementById('communityName').value.trim();
  const category = document.getElementById('communityCategory').value;
  const description = document.getElementById('communityDescription').value.trim();
  const tags = document.getElementById('communityTags').value.trim();
  
  if (!name || !description) {
    showNotification('커뮤니티 이름과 소개를 입력해주세요.');
    return;
  }
  
  // 새 커뮤니티 생성
  const newCommunity = {
    id: communities.length + 1,
    name: name,
    category: category,
    members: 1,
    todayPosts: 0,
    description: description,
    icon: '🆕',
    tags: tags ? tags.split(',').map(tag => tag.trim()) : [name],
    gradient: 'linear-gradient(45deg, #1f2937, #374151)'
  };
  
  communities.unshift(newCommunity);
  
  hideCreateCommunityModal();
  renderCommunities();
  
  showNotification('새 커뮤니티가 성공적으로 생성되었습니다!');
}

// 채팅방 목록 렌더링
function renderChatRooms() {
  const container = document.getElementById('chatRoomsList');
  if (!container) return;
  
  container.innerHTML = chatRooms.map(room => `
    <div class="chat-room ${currentChatRoom === room.id ? 'active' : ''}" onclick="openChatRoom('${room.id}')">
      <div class="chat-avatar">
        ${room.avatar}
      </div>
      <div class="chat-user-info">
        <h3>${room.name}</h3>
        <div class="chat-preview">${room.lastMessage}</div>
      </div>
      <div style="text-align: right;">
        <div style="color: #9ca3af; font-size: 0.75rem; margin-bottom: 0.25rem;">${room.lastTime}</div>
        ${room.unreadCount > 0 ? `<div style="background: #ef4444; color: white; border-radius: 50%; width: 18px; height: 18px; font-size: 0.7rem; display: flex; align-items: center; justify-content: center;">${room.unreadCount}</div>` : ''}
        ${room.isGroup ? `<div style="color: #9ca3af; font-size: 0.75rem;">${room.memberCount}명</div>` : ''}
      </div>
    </div>
  `).join('');
}

// 채팅방 열기
function openChatRoom(roomId) {
  const room = chatRooms.find(r => r.id === roomId);
  if (!room) return;
  
  currentChatRoom = roomId;
  
  // 채팅방 목록 업데이트
  renderChatRooms();
  
  // 채팅 헤더 업데이트
  const chatTopBar = document.getElementById('chatTopBar');
  chatTopBar.innerHTML = `
    <div class="chat-user">
      <div class="chat-avatar">${room.avatar}</div>
      <div class="chat-user-info">
        <h3>${room.name}</h3>
        <span class="status ${room.isOnline ? 'online' : 'offline'}">
          ${room.isGroup ? `${room.memberCount}명` : (room.isOnline ? '온라인' : '오프라인')}
        </span>
      </div>
    </div>
    <div class="chat-actions">
      <button class="chat-action">📞</button>
      <button class="chat-action">📹</button>
      <button class="chat-action">ℹ️</button>
    </div>
  `;
  
  // 메시지 렌더링
  renderMessages(room.messages);
  
  // 읽지 않은 메시지 수 초기화
  room.unreadCount = 0;
}

// 메시지 렌더링
function renderMessages(messages) {
  const container = document.getElementById('chatMessages');
  if (!container) return;
  
  container.innerHTML = messages.map(message => `
    <div class="message ${message.isMe ? 'sent' : 'received'}">
      ${!message.isMe ? `<div class="message-avatar">${message.senderName[0]}</div>` : ''}
      <div class="message-content">
        <div class="message-bubble">
          ${message.content}
        </div>
        <div class="message-time">${message.time}</div>
      </div>
    </div>
  `).join('');
  
  // 스크롤을 맨 아래로
  container.scrollTop = container.scrollHeight;
}

// 메시지 입력 처리
function handleMessageInput(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

// 메시지 전송
function sendMessage() {
  const input = document.getElementById('messageInput');
  const content = input.value.trim();
  
  if (!content || !currentChatRoom) return;
  
  const room = chatRooms.find(r => r.id === currentChatRoom);
  if (!room) return;
  
  const now = new Date();
  const time = now.toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const newMessage = {
    id: room.messages.length + 1,
    sender: 'me',
    senderName: '김창작',
    content: content,
    time: time,
    isMe: true
  };
  
  room.messages.push(newMessage);
  room.lastMessage = content;
  room.lastTime = time;
  
  // UI 업데이트
  renderMessages(room.messages);
  renderChatRooms();
  
  // 입력 필드 초기화
  input.value = '';
  
  // 자동 응답 시뮬레이션
  setTimeout(() => {
    simulateResponse(room);
  }, 1000 + Math.random() * 2000);
}

// 자동 응답 시뮬레이션
function simulateResponse(room) {
  const responses = [
    '네, 좋은 아이디어네요!',
    '정말 그렇게 생각해요 👍',
    '다음에 더 자세히 얘기해봐요',
    '오늘도 좋은 하루 되세요!',
    '감사합니다 😊',
    '정말 멋진 작품이었어요!'
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  const now = new Date();
  const time = now.toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const responseMessage = {
    id: room.messages.length + 1,
    sender: room.id,
    senderName: room.name,
    content: randomResponse,
    time: time,
    isMe: false
  };
  
  room.messages.push(responseMessage);
  room.lastMessage = room.isGroup ? `${room.name.split(' ')[0]}: ${randomResponse}` : randomResponse;
  room.lastTime = time;
  
  // 현재 채팅방이면 메시지 업데이트
  if (currentChatRoom === room.id) {
    renderMessages(room.messages);
  } else {
    room.unreadCount++;
  }
  
  renderChatRooms();
}

// 채팅 검색
function searchChats() {
  const query = event.target.value.toLowerCase();
  const filteredRooms = chatRooms.filter(room => 
    room.name.toLowerCase().includes(query) || 
    room.lastMessage.toLowerCase().includes(query)
  );
  
  // 검색 결과로 채팅방 목록 업데이트
  const container = document.getElementById('chatRoomsList');
  container.innerHTML = filteredRooms.map(room => `
    <div class="chat-room ${currentChatRoom === room.id ? 'active' : ''}" onclick="openChatRoom('${room.id}')">
      <div class="chat-avatar">${room.avatar}</div>
      <div class="chat-user-info">
        <h3>${room.name}</h3>
        <div class="chat-preview">${room.lastMessage}</div>
      </div>
      <div style="text-align: right;">
        <div style="color: #9ca3af; font-size: 0.75rem;">${room.lastTime}</div>
        ${room.unreadCount > 0 ? `<div style="background: #ef4444; color: white; border-radius: 50%; width: 18px; height: 18px; font-size: 0.7rem; display: flex; align-items: center; justify-content: center;">${room.unreadCount}</div>` : ''}
      </div>
    </div>
  `).join('');
}

// 새 채팅 모달
function showNewChatModal() {
  showNotification('새 채팅 기능이 곧 업데이트될 예정입니다!');
}

// 작품 업로드 모달
function showCreateModal() {
  showNotification('작품 업로드 기능이 곧 업데이트될 예정입니다!');
}

// 프로필 표시
function showProfile() {
  showScreen('profile');
}

// 알림 표시
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
`;
document.head.appendChild(style);

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
  // 초기 화면 렌더링
  renderHomeContent();
  renderChatRooms();
  
  // 첫 번째 채팅방 자동 선택
  if (chatRooms.length > 0) {
    setTimeout(() => {
      openChatRoom(chatRooms[0].id);
    }, 100);
  }
  
  // 키보드 단축키
  document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + K: 검색 포커스
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      const searchInput = document.querySelector('.header-search, #exploreSearch');
      if (searchInput) {
        searchInput.focus();
      }
    }
    
    // ESC: 모달 닫기
    if (event.key === 'Escape') {
      const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => {
        if (modal.style.display === 'flex') {
          modal.style.display = 'none';
        }
      });
    }
  });
  
  console.log('🖤 CRETA 갤러리 플랫폼이 성공적으로 로드되었습니다!');
});