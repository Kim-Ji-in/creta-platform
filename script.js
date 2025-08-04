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
        
        // 프로필 정보 업데이트
        await updateProfile(user, { displayName: name });
        
        // Firestore에 사용자 정보 저장
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
        
        // 새 사용자인 경우 정보 저장
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
    // 폼 초기화
    document.getElementById('workTitle').value = '';
    document.getElementById('workDescription').value = '';
    document.getElementById('workTags').value = '';
    document.getElementById('workImage').value = '';
    document.getElementById('imagePreview').innerHTML = '';
}

// 이미지 미리보기
document.addEventListener('change', function(e) {
    if (e.target.id === 'workImage') {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('imagePreview').innerHTML = 
                    `<img src="${e.target.result}" style="max-width: 200px; max-height: 200px; border-radius: 8px; margin-top: 1rem;">`;
            };
            reader.readAsDataURL(file);
        }
    }
});

// 작품 업로드
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
        
        // 이미지가 있는 경우 업로드
        if (imageFile) {
            const imageRef = ref(storage, `works/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(imageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }
        
        // Firestore에 작품 정보 저장
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
        
        // 작품 목록 새로고침
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
        max-width: 300px;
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
    console.log('🔥 CRETA 플랫폼이 Firebase와 함께 로드되었습니다!');
});
