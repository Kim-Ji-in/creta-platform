/* ===== 기본 설정 ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    /* 라이트 모드 색상 */
    --bg-primary: #ffffff;
    --bg-secondary: #f8fafc;
    --bg-tertiary: #f1f5f9;
    --bg-card: #ffffff;
    --text-primary: #1e293b;
    --text-secondary: #64748b;
    --text-muted: #94a3b8;
    --border-color: #e2e8f0;
    --border-light: #f1f5f9;
    --accent-primary: #3b82f6;
    --accent-secondary: #8b5cf6;
    --success: #10b981;
    --warning: #f59e0b;
    --error: #ef4444;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* 다크 모드 색상 */
.dark-mode {
    --bg-primary: #0f172a;
    --bg-secondary: #1e293b;
    --bg-tertiary: #334155;
    --bg-card: #1e293b;
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --text-muted: #64748b;
    --border-color: #334155;
    --border-light: #475569;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
    transition: all 0.3s ease;
}

/* ===== 로딩 화면 ===== */
.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    flex-direction: column;
}

.logo-3d {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 2rem;
    animation: float 3s ease-in-out infinite;
}

.logo-icon {
    font-size: inherit;
    animation: glow 2s ease-in-out infinite alternate;
}

.logo-text {
    background: linear-gradient(45deg, var(--accent-primary), var(--accent-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.progress-bar {
    width: 300px;
    height: 4px;
    background: var(--bg-secondary);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 1rem;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(45deg, var(--accent-primary), var(--accent-secondary));
    width: 0%;
    animation: loadingProgress 2s ease-out infinite;
}

.loading-text {
    color: var(--text-secondary);
}

/* ===== 헤더 ===== */
.app-header {
    background: var(--bg-card);
    border-bottom: 1px solid var(--border-color);
    padding: 1rem 2rem;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: var(--shadow-sm);
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1400px;
    margin: 0 auto;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    font-weight: 700;
    cursor: pointer;
    color: var(--text-primary);
}

.logo-icon {
    font-size: 1.8rem;
}

.logo-text {
    background: linear-gradient(45deg, var(--accent-primary), var(--accent-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* ===== 검색바 ===== */
.search-container {
    position: relative;
    flex: 1;
    max-width: 500px;
}

.search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 1rem;
    color: var(--text-muted);
    z-index: 2;
}

.search-container input {
    width: 100%;
    padding: 0.8rem 3rem 0.8rem 2.5rem;
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    border-radius: 25px;
    color: var(--text-primary);
    font-size: 0.9rem;
    transition: all 0.2s ease;
}

.search-container input:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-clear {
    position: absolute;
    right: 1rem;
    background: var(--text-muted);
    color: var(--bg-primary);
    border: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ===== 검색 제안 패널 ===== */
.search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: var(--shadow-xl);
    z-index: 1000;
    margin-top: 0.5rem;
    max-height: 400px;
    overflow-y: auto;
}

.suggestions-content {
    padding: 1rem;
}

.suggestion-section {
    margin-bottom: 1.5rem;
}

.suggestion-section:last-child {
    margin-bottom: 0;
}

.suggestion-section h4 {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.8rem;
}

.trending-list,
.suggested-list,
.related-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.suggestion-item {
    padding: 0.6rem 1rem;
    background: var(--bg-secondary);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.suggestion-item:hover {
    background: var(--accent-primary);
    color: white;
    transform: translateX(4px);
}

.header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.header-btn {
    background: var(--bg-secondary);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    color: var(--text-primary);
    position: relative;
}

.header-btn:hover {
    background: var(--accent-primary);
    color: white;
    transform: scale(1.05);
}

.badge {
    position: absolute;
    top: -2px;
    right: -2px;
    background: var(--error);
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.user-profile {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(45deg, var(--accent-primary), var(--accent-secondary));
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
}

.user-profile:hover {
    transform: scale(1.1);
}

/* ===== 앱 바디 ===== */
.app-body {
    display: flex;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    min-height: calc(100vh - 80px);
}

/* ===== 사이드바 ===== */
.sidebar {
    width: 280px;
    background: var(--bg-card);
    border-right: 1px solid var(--border-color);
    padding: 2rem 1rem;
    height: calc(100vh - 80px);
    position: sticky;
    top: 80px;
    overflow-y: auto;
}

.nav-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 2rem;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: transparent;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text-secondary);
    font-weight: 500;
    position: relative;
    width: 100%;
    text-align: left;
}

.nav-item:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
    transform: translateX(4px);
}

.nav-item.active {
    background: var(--accent-primary);
    color: white;
}

.nav-icon {
    font-size: 1.2rem;
    width: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-text {
    font-size: 0.95rem;
}

.nav-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: var(--error);
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-divider {
    height: 1px;
    background: var(--border-color);
    margin: 1rem 0;
}

.nav-item.upload {
    background: linear-gradient(45deg, var(--warning), #d97706);
    color: white;
}

.nav-item.upload:hover {
    transform: translateX(0) scale(1.02);
}

/* ===== 메인 콘텐츠 ===== */
.main-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
}

.page {
    display: none;
    animation: fadeIn 0.3s ease;
}

.page.active {
    display: block;
}

/* ===== 홈페이지 ===== */
.home-hero {
    text-align: center;
    padding: 4rem 0;
    margin-bottom: 3rem;
    background: var(--bg-card);
    border-radius: 16px;
    border: 1px solid var(--border-color);
}

.home-hero h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.home-hero p {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
}

.quick-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.quick-btn {
    padding: 1rem 2rem;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 1rem;
}

.quick-btn.primary {
    background: var(--accent-primary);
    color: white;
}

.quick-btn.primary:hover {
    background: #2563eb;
    transform: translateY(-2px);
}

.quick-btn.secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 2px solid var(--border-color);
}

.quick-btn.secondary:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
}

.content-section {
    margin-bottom: 3rem;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.section-header h2 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--text-primary);
}

.see-more-btn {
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    color: var(--text-primary);
    padding: 0.8rem 1.5rem;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
}

.see-more-btn:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
    transform: translateY(-1px);
}

/* ===== 작품 그리드 ===== */
.works-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
}

.work-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: var(--shadow-sm);
}

.work-card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);
    border-color: var(--accent-primary);
}

.work-thumbnail {
    width: 100%;
    height: 200px;
    background: linear-gradient(45deg, var(--bg-secondary), var(--bg-tertiary));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    position: relative;
    overflow: hidden;
}

.work-content {
    padding: 1.5rem;
}

.work-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    line-height: 1.4;
}

.work-author {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.work-stats {
    display: flex;
    gap: 1rem;
    font-size: 0.85rem;
    color: var(--text-muted);
}

.work-tags {
    margin-top: 0.8rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.work-tag {
    background: var(--bg-secondary);
    color: var(--text-secondary);
    padding: 0.25rem 0.8rem;
    border-radius: 12px;
    font-size: 0.75rem;
    border: 1px solid var(--border-color);
}

/* ===== 페이지 헤더 ===== */
.page-header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem 0;
    background: var(--bg-card);
    border-radius: 16px;
    border: 1px solid var(--border-color);
}

.page-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.page-header p {
    font-size: 1.1rem;
    color: var(--text-secondary);
}

.create-btn {
    background: var(--accent-primary);
    color: white;
    border: none;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
    position: absolute;
    top: 2rem;
    right: 2rem;
}

.create-btn:hover {
    background: #2563eb;
    transform: translateY(-1px);
}

/* ===== 탐색 페이지 ===== */
.explore-filters {
    background: var(--bg-card);
    padding: 2rem;
    border-radius: 16px;
    margin-bottom: 2rem;
    border: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 2rem;
}

.filter-tabs {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
}

.filter-tab {
    padding: 0.8rem 1.5rem;
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    border-radius: 25px;
    cursor: pointer;
    font-weight: 500;
    color: var(--text-secondary);
    transition: all 0.2s ease;
}

.filter-tab:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
}

.filter-tab.active {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    color: white;
}

.sort-select {
    padding: 0.8rem 1rem;
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    border-radius: 12px;
    color: var(--text-primary);
    cursor: pointer;
    font-weight: 500;
}

/* ===== 커뮤니티 페이지 ===== */
.community-filters {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.community-filter {
    padding: 0.8rem 1.5rem;
    background: var(--bg-card);
    border: 2px solid var(--border-color);
    border-radius: 25px;
    cursor: pointer;
    font-weight: 500;
    color: var(--text-secondary);
    transition: all 0.2s ease;
}

.community-filter:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
}

.community-filter.active {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    color: white;
}

.communities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
}

.community-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.community-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-primary);
}

.community-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
}

.community-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    background: linear-gradient(45deg, var(--accent-primary), var(--accent-secondary));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
    margin-right: 1rem;
}

.community-info h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
}

.community-meta {
    font-size: 0.85rem;
    color: var(--text-secondary);
}

.community-description {
    color: var(--text-secondary);
    line-height: 1.5;
}

/* ===== 메시지 페이지 ===== */
.messages-layout {
    display: flex;
    height: calc(100vh - 140px);
    background: var(--bg-card);
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--border-color);
}

.chat-sidebar {
    width: 320px;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
}

.chat-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat-header h2 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-primary);
}

.chat-actions {
    display: flex;
    gap: 0.5rem;
}

.chat-action-btn {
    background: var(--bg-tertiary);
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    transition: all 0.2s ease;
}

.chat-action-btn:hover {
    background: var(--accent-primary);
    color: white;
}

.chat-search {
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
}

.chat-search input {
    width: 100%;
    padding: 0.8rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-primary);
}

.chat-list {
    flex: 1;
    overflow-y: auto;
}

.chat-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    cursor: pointer;
    border-bottom: 1px solid var(--border-light);
    transition: all 0.2s ease;
}

.chat-item:hover {
    background: var(--bg-tertiary);
}

.chat-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(45deg, var(--accent-primary), var(--accent-secondary));
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    margin-right: 1rem;
}

.chat-info {
    flex: 1;
}

.chat-name {
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
}

.chat-preview {
    font-size: 0.85rem;
    color: var(--text-secondary);
}

.chat-main {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-primary);
}

.chat-welcome {
    text-align: center;
    color: var(--text-secondary);
}

.welcome-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
}

.chat-welcome h3 {
    font-size: 1.5rem;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

/* ===== 프로필 페이지 ===== */
.profile-header {
    background: var(--bg-card);
    border-radius: 20px;
    overflow: hidden;
    margin-bottom: 2rem;
    border: 1px solid var(--border-color);
    position: relative;
}

.profile-cover {
    height: 150px;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
}

.profile-info {
    padding: 2rem;
    position: relative;
}

.profile-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(45deg, var(--accent-primary), var(--accent-secondary));
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 2.5rem;
    font-weight: 700;
    position: absolute;
    top: -50px;
    left: 2rem;
    border: 4px solid var(--bg-primary);
}

.profile-details {
    margin-left: 120px;
}

.profile-details h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.profile-handle {
    color: var(--text-secondary);
    margin-bottom: 1rem;
}

.profile-bio {
    color: var(--text-secondary);
    margin-bottom: 2rem;
    line-height: 1.6;
}

.profile-stats {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
}

.stat {
    text-align: center;
}

.stat-number {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
}

.stat-label {
    font-size: 0.85rem;
    color: var(--text-secondary);
}

.profile-actions {
    display: flex;
    gap: 1rem;
}

.profile-btn {
    padding: 0.8rem 1.5rem;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
}

.profile-btn.primary {
    background: var(--accent-primary);
    color: white;
    border: none;
}

.profile-btn.primary:hover {
    background: #2563eb;
}

.profile-btn.secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 2px solid var(--border-color);
}

.profile-btn.secondary:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
}

.profile-tabs {
    display: flex;
    background: var(--bg-card);
    border-radius: 12px;
    margin-bottom: 2rem;
    overflow: hidden;
    border: 1px solid var(--border-color);
}

.profile-tab {
    flex: 1;
    padding: 1rem;
    background: transparent;
    border: none;
    cursor: pointer;
    font-weight: 500;
    color: var(--text-secondary);
    transition: all 0.2s ease;
}

.profile-tab:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
}

.profile-tab.active {
    background: var(--accent-primary);
    color: white;
}

.profile-content {
    background: var(--bg-card);
    border-radius: 16px;
    padding: 2rem;
    border: 1px solid var(--border-color);
}

.profile-tab-content {
    display: none;
}

.profile-tab-content.active {
    display: block;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
}

.dashboard-card {
    background: var(--bg-secondary);
    padding: 2rem;
    border-radius: 12px;
    border: 1px solid var(--border-color);
}

.dashboard-card h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
}

.analytics-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
}

.analytics-card {
    background: var(--bg-secondary);
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    text-align: center;
}

.analytics-card h4 {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
}

.analytics-number {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.analytics-change {
    font-size: 0.85rem;
    font-weight: 500;
}

.analytics-change.positive {
    color: var(--success);
}

/* ===== 업로드 페이지 ===== */
.upload-container {
    height: calc(100vh - 140px);
    display: flex;
    flex-direction: column;
    background: var(--bg-card);
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid var(--border-color);
}

.upload-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border-color);
}

.toolbar-left,
.toolbar-right {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.toolbar-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.8rem 1.2rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    color: var(--text-primary);
    transition: all 0.2s ease;
}

.toolbar-btn:hover {
    background: var(--bg-tertiary);
}

.toolbar-btn.primary {
    background: var(--accent-primary);
    color: white;
    border-color: var(--accent-primary);
}

.toolbar-btn.primary:hover {
    background: #2563eb;
}

.toolbar-divider {
    width: 1px;
    height: 24px;
    background: var(--border-color);
}

.upload-steps {
    display: flex;
    gap: 2rem;
}

.step {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 25px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
}

.step.active {
    background: var(--accent-primary);
    color: white;
    border-color: var(--accent-primary);
}

.step-number {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 700;
}

.step-label {
    font-size: 0.85rem;
    font-weight: 500;
}

.upload-content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
}

.upload-step {
    display: none;
}

.upload-step.active {
    display: block;
}

.file-upload-area {
    max-width: 800px;
    margin: 0 auto;
}

.file-drop-zone {
    border: 3px dashed var(--border-color);
    border-radius: 16px;
    padding: 4rem 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: var(--bg-secondary);
}

.file-drop-zone:hover {
    border-color: var(--accent-primary);
    background: rgba(59, 130, 246, 0.05);
}

.drop-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.6;
}

.drop-content h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
}

.drop-content p {
    color: var(--text-secondary);
    margin-bottom: 2rem;
}

.select-file-btn {
    background: var(--accent-primary);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
}

.select-file-btn:hover {
    background: #2563eb;
}

.upload-form {
    max-width: 800px;
    margin: 0 auto;
}

.form-section {
    margin-bottom: 3rem;
}

.form-section h3 {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--border-color);
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-primary);
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.8rem;
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-primary);
    transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.tag-input {
    position: relative;
}

.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.8rem;
}

.tag-item {
    background: var(--accent-primary);
    color: white;
    padding: 0.25rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.tag-remove {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload-summary {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

.upload-summary h3 {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 2rem;
}

.publish-options {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    gap: 2rem;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    color: var(--text-secondary);
}

.upload-navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 2rem;
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-color);
}

.nav-btn {
    padding: 1rem 2rem;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
}

.nav-btn.primary {
    background: var(--accent-primary);
    color: white;
}

.nav-btn.primary:hover {
    background: #2563eb;
}

.nav-btn.secondary {
    background: var(--bg-primary);
    color: var(--text-primary);
    border: 2px solid var(--border-color);
}

.nav-btn.secondary:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
}

.step-indicator {
    font-weight: 600;
    color: var(--text-primary);
}

/* ===== 알림 패널 ===== */
.notification-panel {
    position: absolute;
    top: 100%;
    right: 0;
    width: 350px;
    max-height: 500px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: var(--shadow-xl);
    z-index: 1000;
    margin-top: 0.5rem;
}

.notification-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.notification-header h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
}

.mark-all-read {
    background: none;
    border: none;
    color: var(--accent-primary);
    cursor: pointer;
    font-weight: 500;
    font-size: 0.9rem;
}

/* ===== 애니메이션 ===== */
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

@keyframes glow {
    0%, 100% { filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5)); }
    50% { filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.8)); }
}

@keyframes loadingProgress {
    0% { width: 0%; }
    50% { width: 70%; }
    100% { width: 100%; }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

/* ===== 반응형 디자인 ===== */
@media (max-width: 1024px) {
    .dashboard-grid {
        grid-template-columns: 1fr;
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .app-body {
        flex-direction: column;
    }
    
    .sidebar {
        width: 100%;
        height: auto;
        position: static;
        padding: 1rem;
        border-right: none;
        border-bottom: 1px solid var(--border-color);
    }
    
    .nav-items {
        flex-direction: row;
        overflow-x: auto;
        gap: 1rem;
    }
    
    .nav-item {
        flex-direction: column;
        min-width: 80px;
        text-align: center;
        padding: 1rem 0.5rem;
    }
    
    .nav-text {
        font-size: 0.8rem;
        margin-top: 0.25rem;
    }
    
    .main-content {
        padding: 1rem;
    }
    
    .works-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .messages-layout {
        flex-direction: column;
        height: auto;
    }
    
    .chat-sidebar {
        width: 100%;
        max-height: 300px;
    }
    
    .header-left {
        flex-direction: column;
        gap: 1rem;
    }
    
    .search-container {
        width: 100%;
        max-width: none;
    }
    
    .quick-actions {
        flex-direction: column;
        align-items: stretch;
    }
    
    .profile-details {
        margin-left: 0;
        text-align: center;
        margin-top: 3rem;
    }
    
    .profile-avatar {
        position: static;
        margin: 0 auto 1rem;
    }
    
    .profile-stats {
        justify-content: center;
    }
    
    .upload-steps {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .toolbar-left,
    .toolbar-right {
        flex-wrap: wrap;
        gap: 0.5rem;
    }
}

/* ===== 스크롤바 스타일 ===== */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--text-muted);
}
