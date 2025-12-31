// Data storage (using LocalStorage)
const Storage = {
    get: (key) => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove: (key) => {
        localStorage.removeItem(key);
    }
};

// Pre-defined country galleries (ordered by population in Korea)
const PREDEFINED_COUNTRIES = [
    { flag: '🇨🇳', name: 'China', code: 'China' },
    { flag: '🇻🇳', name: 'Vietnam', code: 'Vietnam' },
    { flag: '🇹🇭', name: 'Thailand', code: 'Thailand' },
    { flag: '🇵🇭', name: 'Philippines', code: 'Philippines' },
    { flag: '🇮🇩', name: 'Indonesia', code: 'Indonesia' },
    { flag: '🇺🇸', name: 'United States', code: 'USA' },
    { flag: '🇯🇵', name: 'Japan', code: 'Japan' },
    { flag: '🇺🇿', name: 'Uzbekistan', code: 'Uzbekistan' },
    { flag: '🇳🇵', name: 'Nepal', code: 'Nepal' },
    { flag: '🇰🇭', name: 'Cambodia', code: 'Cambodia' },
    { flag: '🇲🇳', name: 'Mongolia', code: 'Mongolia' },
    { flag: '🇷🇺', name: 'Russia', code: 'Russia' },
    { flag: '🇮🇳', name: 'India', code: 'India' },
    { flag: '🇧🇩', name: 'Bangladesh', code: 'Bangladesh' },
    { flag: '🇵🇰', name: 'Pakistan', code: 'Pakistan' },
    { flag: '🇱🇰', name: 'Sri Lanka', code: 'SriLanka' },
    { flag: '🇲🇲', name: 'Myanmar', code: 'Myanmar' },
    { flag: '🇬🇧', name: 'United Kingdom', code: 'UK' },
    { flag: '🇨🇦', name: 'Canada', code: 'Canada' },
    { flag: '🇦🇺', name: 'Australia', code: 'Australia' },
    { flag: '🇫🇷', name: 'France', code: 'France' },
    { flag: '🇩🇪', name: 'Germany', code: 'Germany' },
    { flag: '🇧🇷', name: 'Brazil', code: 'Brazil' },
    { flag: '🇲🇽', name: 'Mexico', code: 'Mexico' },
    { flag: '🇿🇦', name: 'South Africa', code: 'SouthAfrica' },
    { flag: '🇪🇸', name: 'Spain', code: 'Spain' },
    { flag: '🇮🇹', name: 'Italy', code: 'Italy' },
    { flag: '🇳🇿', name: 'New Zealand', code: 'NewZealand' },
    { flag: '🇸🇬', name: 'Singapore', code: 'Singapore' },
    { flag: '🇲🇾', name: 'Malaysia', code: 'Malaysia' }
];

// Initialize data
function initData() {
    // Preserve existing data - never overwrite if it exists
    const existingPosts = Storage.get('posts');
    const existingUsers = Storage.get('users');
    const existingGalleries = Storage.get('galleries');
    const existingComments = Storage.get('comments');
    const existingLikes = Storage.get('likes');
    const existingUserIPs = Storage.get('userIPs');
    const existingApplications = Storage.get('galleryApplications');
    
    // Only initialize if data doesn't exist
    if (!existingUsers) {
        Storage.set('users', []);
    }
    if (!existingPosts) {
        Storage.set('posts', []);
    }
    if (!existingGalleries) {
        Storage.set('galleries', []);
    }
    if (!existingApplications) {
        Storage.set('galleryApplications', []);
    }
    if (!existingUserIPs) {
        Storage.set('userIPs', {});
    }
    if (!existingComments) {
        Storage.set('comments', []);
    }
    if (!existingLikes) {
        Storage.set('likes', {
            posts: {},
            comments: {}
        });
    }
    if (!Storage.get('galleryApplications')) {
        Storage.set('galleryApplications', []);
    }
    if (!Storage.get('userIPs')) {
        Storage.set('userIPs', {});
    }
    if (!Storage.get('comments')) {
        Storage.set('comments', []);
    }
    if (!Storage.get('likes')) {
        Storage.set('likes', {
            posts: {},
            comments: {}
        });
    }
    
    // Default admin account (email: admin@admin.com)
    const users = Storage.get('users');
    const adminExists = users.some(u => u.email === 'admin@admin.com');
    if (!adminExists) {
        users.push({
            id: 'admin',
            name: 'Admin',
            email: 'admin@admin.com',
            country: 'Korea',
            role: 'admin',
            createdAt: new Date().toISOString()
        });
        Storage.set('users', users);
    }
    
    // Pre-create country galleries (only if they don't exist)
    const galleries = Storage.get('galleries') || [];
    PREDEFINED_COUNTRIES.forEach(country => {
        const exists = galleries.some(g => g.country === country.name);
        if (!exists) {
            galleries.push({
                id: generateId(),
                country: country.name,
                countryCode: country.code,
                flag: country.flag,
                description: `Community for ${country.name} residents in Korea`,
                status: 'approved',
                admins: [],
                createdAt: new Date().toISOString()
            });
        } else {
            // Update existing gallery with flag if missing
            const existingGallery = galleries.find(g => g.country === country.name);
            if (existingGallery && !existingGallery.flag) {
                existingGallery.flag = country.flag;
                existingGallery.countryCode = country.code;
            }
        }
    });
    Storage.set('galleries', galleries);
    
    // Debug: Log data status
    console.log('Data initialized:', {
        posts: Storage.get('posts')?.length || 0,
        users: Storage.get('users')?.length || 0,
        galleries: Storage.get('galleries')?.length || 0,
        comments: Storage.get('comments')?.length || 0
    });
}

// Current user management
let currentUser = null;

// Debug function to check LocalStorage data (can be called from browser console)
window.checkLocalStorageData = function() {
    const posts = Storage.get('posts') || [];
    const users = Storage.get('users') || [];
    const galleries = Storage.get('galleries') || [];
    const comments = Storage.get('comments') || [];
    
    console.log('=== LocalStorage Data Check ===');
    console.log('Posts:', posts.length, posts);
    console.log('Users:', users.length, users);
    console.log('Galleries:', galleries.length, galleries);
    console.log('Comments:', comments.length, comments);
    console.log('==============================');
    
    return {
        posts: posts.length,
        users: users.length,
        galleries: galleries.length,
        comments: comments.length
    };
};

// Page initialization
document.addEventListener('DOMContentLoaded', () => {
    initData();
    checkLogin();
    setupEventListeners();
    loadHomePage();
});

// Setup event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    console.log('Found nav links:', navLinks.length);
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            console.log('Nav link clicked:', page);
            showPage(page);
        });
    });

    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            showModal('loginModal');
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logout();
        });
    }

    // Admin button
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
    }

    // Modal close
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                hideModal(modal.id);
            }
        });
    });

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Write post buttons
    const writeInfoBtn = document.getElementById('writeInfoBtn');
    if (writeInfoBtn) {
        writeInfoBtn.addEventListener('click', () => {
            openWriteModal('info');
        });
    }
    
    const writeHotplaceBtn = document.getElementById('writeHotplaceBtn');
    if (writeHotplaceBtn) {
        writeHotplaceBtn.addEventListener('click', () => {
            openWriteModal('hotplace');
        });
    }
    
    const writeHumorBtn = document.getElementById('writeHumorBtn');
    if (writeHumorBtn) {
        writeHumorBtn.addEventListener('click', () => {
            openWriteModal('humor');
        });
    }

    // Write post form
    const writeForm = document.getElementById('writeForm');
    if (writeForm) {
        writeForm.addEventListener('submit', handleWritePost);
    }

    // Gallery application button
    const applyGalleryBtn = document.getElementById('applyGalleryBtn');
    if (applyGalleryBtn) {
        applyGalleryBtn.addEventListener('click', () => {
            showModal('galleryApplyModal');
        });
    }

    // Gallery application form
    const galleryApplyForm = document.getElementById('galleryApplyForm');
    if (galleryApplyForm) {
        galleryApplyForm.addEventListener('submit', handleGalleryApplication);
    }

    // Image preview
    const postImages = document.getElementById('postImages');
    if (postImages) {
        postImages.addEventListener('change', handleImagePreview);
    }

    // Gallery page buttons
    const backToCountryBtn = document.getElementById('backToCountryBtn');
    if (backToCountryBtn) {
        backToCountryBtn.addEventListener('click', () => {
            showPage('country');
        });
    }
    
    const writeGalleryPostBtn = document.getElementById('writeGalleryPostBtn');
    if (writeGalleryPostBtn) {
        writeGalleryPostBtn.addEventListener('click', () => {
            if (currentGalleryId) {
                openGalleryWrite(currentGalleryId);
            }
        });
    }
    
    console.log('Event listeners setup complete');
}

// Check login
function checkLogin() {
    const userData = Storage.get('currentUser');
    if (userData) {
        currentUser = userData;
        updateUserUI();
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    const name = document.getElementById('loginName').value;
    const email = document.getElementById('loginEmail').value;
    const country = document.getElementById('loginCountry').value;

    let users = Storage.get('users');
    let user = users.find(u => u.email === email);

    if (!user) {
        // Create new user
        user = {
            id: generateId(),
            name: name,
            email: email,
            country: country,
            role: 'user',
            createdAt: new Date().toISOString()
        };
        users.push(user);
        Storage.set('users', users);
    } else {
        // Update existing user info
        user.name = name;
        user.country = country;
        Storage.set('users', users);
    }

    currentUser = user;
    Storage.set('currentUser', user);
    updateUserUI();
    hideModal('loginModal');
    document.getElementById('loginForm').reset();
    
    alert('Logged in successfully!');
}

// Logout
function logout() {
    currentUser = null;
    Storage.remove('currentUser');
    updateUserUI();
    alert('Logged out successfully.');
}

// Update user UI
function updateUserUI() {
    const userNameEl = document.getElementById('userName');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminBtn = document.getElementById('adminBtn');

    if (currentUser) {
        userNameEl.textContent = `${currentUser.name} (${getCountryName(currentUser.country)})`;
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        if (currentUser.role === 'admin') {
            adminBtn.style.display = 'block';
        } else {
            adminBtn.style.display = 'none';
        }
    } else {
        userNameEl.textContent = '';
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        adminBtn.style.display = 'none';
    }
}

// Show page
function showPage(pageName) {
    console.log('showPage called with:', pageName);
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const pageMap = {
        'home': 'homePage',
        'hotposts': 'hotpostsPage',
        'info': 'infoPage',
        'hotplace': 'hotplacePage',
        'country': 'countryPage',
        'humor': 'humorPage',
        'gallery': 'galleryPage'
    };

    const pageId = pageMap[pageName];
    if (pageId) {
        const pageElement = document.getElementById(pageId);
        if (pageElement) {
            pageElement.classList.add('active');
            console.log('Page activated:', pageId);
            loadPageContent(pageName);
        } else {
            console.error('Page element not found:', pageId);
        }
    } else {
        console.error('Invalid page name:', pageName);
    }
}

// Load page content
function loadPageContent(pageName) {
    console.log('loadPageContent called with:', pageName);
    try {
        switch(pageName) {
            case 'home':
                loadHomePage();
                break;
            case 'hotposts':
                loadHotPostsPage();
                break;
            case 'info':
                loadPosts('info');
                break;
            case 'hotplace':
                loadPosts('hotplace');
                break;
            case 'country':
                loadGalleries();
                break;
            case 'humor':
                loadPosts('humor');
                break;
            case 'gallery':
                if (currentGalleryId) {
                    loadGalleryPage(currentGalleryId);
                } else {
                    console.warn('No currentGalleryId set, cannot load gallery page');
                }
                break;
            default:
                console.warn('Unknown page name:', pageName);
        }
    } catch (error) {
        console.error('Error loading page content:', error);
        alert('Error loading page: ' + error.message);
    }
}

// Load home page
function loadHomePage() {
    // Load hot posts
    loadHotPosts();
}

// Get hot posts list (sorted by popularity)
function getHotPostsList() {
    const posts = Storage.get('posts') || [];
    const allPosts = posts.filter(p => !p.deleted);
    
    // Calculate popularity score for all posts
    const postsWithScore = allPosts.map(post => ({
        ...post,
        score: calculatePopularityScore(post)
    }));
    
    // Sort by score (popularity order, not time order)
    return postsWithScore.sort((a, b) => b.score - a.score);
}

// Load hot posts for homepage
function loadHotPosts() {
    const hotPosts = getHotPostsList().slice(0, 10);
    
    const container = document.getElementById('hotPosts');
    
    if (!container) {
        console.error('hotPosts container not found!');
        return;
    }
    
    if (hotPosts.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: white; padding: 2rem;">No posts yet.</p>';
        return;
    }
    
    container.innerHTML = hotPosts.map(post => {
        const user = getUserById(post.userId);
        const displayName = post.nickname || 'Anonymous';
        const categoryNames = {
            'info': 'Information',
            'hotplace': 'Hot Places',
            'humor': 'Humor',
            'gallery': 'Gallery'
        };
        
        // Get best comments
        const bestComments = getBestComments(post.id, 2);
        const bestCommentsHtml = bestComments.length > 0 ? `
            <div class="hot-post-best-comments">
                ${bestComments.map(comment => {
                    const commentUser = comment.userId ? getUserById(comment.userId) : null;
                    const commentDisplayName = commentUser ? commentUser.name : (comment.nickname || comment.ipPrefix || 'Anonymous');
                    return `
                        <div class="best-comment-item">
                            <div class="best-comment-author">${escapeHtml(commentDisplayName)}</div>
                            <div class="best-comment-content">${escapeHtml(comment.content.substring(0, 80))}${comment.content.length > 80 ? '...' : ''}</div>
                            <div class="best-comment-likes">👍 ${comment.likes || 0}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        ` : '';
        
        return `
            <div class="post-card featured hot-post-card" onclick="showPostDetail('${post.id}')">
                <div class="hot-post-content">
                    <div class="hot-post-left">
                        <div class="post-header">
                            <div>
                                <div class="post-title">${escapeHtml(post.title)}</div>
                                <div class="post-meta">
                                    <span>${escapeHtml(displayName)}</span>
                                    <span>${categoryNames[post.category] || post.category}</span>
                                    <span>${formatDate(post.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                        <div class="post-content-preview">${escapeHtml(post.content.substring(0, 100))}${post.content.length > 100 ? '...' : ''}</div>
                        <div class="post-footer">
                            <div class="post-stats">
                                <span>👁️ ${post.views || 0}</span>
                                <span>👍 ${post.likes || 0}</span>
                                <span>💬 ${getCommentCount(post.id)}</span>
                            </div>
                        </div>
                        ${bestCommentsHtml}
                    </div>
                    ${post.images && post.images.length > 0 ? `
                        <div class="hot-post-images">
                            <img src="${post.images[0]}" alt="Post image">
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Load hot posts page
function loadHotPostsPage() {
    const hotPosts = getHotPostsList();
    
    const container = document.getElementById('hotpostsPosts');
    
    if (!container) {
        console.error('hotpostsPosts container not found!');
        return;
    }
    
    if (hotPosts.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 3rem; color: #999;">No posts yet.</p>';
        return;
    }
    
    container.innerHTML = hotPosts.map(post => {
        const user = getUserById(post.userId);
        const displayName = post.nickname || 'Anonymous';
        const categoryNames = {
            'info': 'Information',
            'hotplace': 'Hot Places',
            'humor': 'Humor',
            'gallery': 'Gallery'
        };
        
        // Get best comments
        const bestComments = getBestComments(post.id, 2);
        const bestCommentsHtml = bestComments.length > 0 ? `
            <div class="hot-post-best-comments">
                ${bestComments.map(comment => {
                    const commentUser = comment.userId ? getUserById(comment.userId) : null;
                    const commentDisplayName = commentUser ? commentUser.name : (comment.nickname || comment.ipPrefix || 'Anonymous');
                    return `
                        <div class="best-comment-item">
                            <div class="best-comment-author">${escapeHtml(commentDisplayName)}</div>
                            <div class="best-comment-content">${escapeHtml(comment.content.substring(0, 80))}${comment.content.length > 80 ? '...' : ''}</div>
                            <div class="best-comment-likes">👍 ${comment.likes || 0}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        ` : '';
        
        return `
            <div class="post-card featured hot-post-card" onclick="showPostDetail('${post.id}')">
                <div class="hot-post-content">
                    <div class="hot-post-left">
                        <div class="post-header">
                            <div>
                                <div class="post-title">${escapeHtml(post.title)}</div>
                                <div class="post-meta">
                                    <span>${escapeHtml(displayName)}</span>
                                    <span>${categoryNames[post.category] || post.category}</span>
                                    <span>${formatDate(post.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                        <div class="post-content-preview">${escapeHtml(post.content.substring(0, 100))}${post.content.length > 100 ? '...' : ''}</div>
                        <div class="post-footer">
                            <div class="post-stats">
                                <span>👁️ ${post.views || 0}</span>
                                <span>👍 ${post.likes || 0}</span>
                                <span>💬 ${getCommentCount(post.id)}</span>
                            </div>
                        </div>
                        ${bestCommentsHtml}
                    </div>
                    ${post.images && post.images.length > 0 ? `
                        <div class="hot-post-images">
                            <img src="${post.images[0]}" alt="Post image">
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Load posts
function loadPosts(category) {
    console.log('loadPosts called with category:', category);
    const posts = Storage.get('posts') || [];
    console.log('Total posts in storage:', posts.length);
    
    // Debug: Check if posts exist
    if (posts.length === 0) {
        console.log(`No posts found in LocalStorage for category: ${category}`);
    }
    
    const filteredPosts = posts.filter(p => p.category === category && !p.deleted);
    console.log('Filtered posts for category:', filteredPosts.length);
    
    // Humor board: featured posts at top
    if (category === 'humor') {
        filteredPosts.sort((a, b) => {
            const aScore = calculatePopularityScore(a);
            const bScore = calculatePopularityScore(b);
            return bScore - aScore;
        });
    } else {
        filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const containerId = category === 'info' ? 'infoPosts' : 
                       category === 'hotplace' ? 'hotplacePosts' : 'humorPosts';
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error('Container not found:', containerId, 'for category:', category);
        console.error('Available elements:', Array.from(document.querySelectorAll('[id*="Posts"]')).map(el => el.id));
        return;
    }
    
    console.log('Loading posts into container:', containerId, 'Count:', filteredPosts.length);
    
    if (filteredPosts.length === 0) {
        container.innerHTML = '<div class="posts-container"><div style="text-align: center; padding: 3rem; color: #999;">No posts yet.</div></div>';
        return;
    }

    // 디씨인사이드 스타일 헤더
    const locationHeader = category === 'hotplace' ? '<div class="post-location-col">Location</div>' : '';
    
    let html = `
        <div class="posts-container">
            <div class="posts-header">
                <div class="post-title-col">Title</div>
                <div class="post-author-col">Author</div>
                ${locationHeader}
                <div class="post-date-col">Date</div>
                <div class="post-views-col">Views</div>
                <div class="post-likes-col">Likes</div>
                <div class="post-comments-col">Comments</div>
            </div>
    `;
    
    html += filteredPosts.map(post => {
        const isFeatured = category === 'humor' && calculatePopularityScore(post) >= 50;
        const featuredClass = isFeatured ? 'featured' : '';
        const displayName = post.nickname || 'Anonymous';
        const locationCell = category === 'hotplace' ? 
            `<div class="post-location-col">${post.location ? escapeHtml(post.location.address || '') : '-'}</div>` : '';
        const commentCount = getCommentCount(post.id);
        
        return `
            <div class="post-card ${featuredClass}" onclick="showPostDetail('${post.id}')">
                <div class="post-row">
                    <div class="post-title-col">
                        <span class="post-title">${escapeHtml(post.title)}</span>
                    </div>
                    <div class="post-author-col">${escapeHtml(displayName)}</div>
                    ${locationCell}
                    <div class="post-date-col">${formatDate(post.createdAt)}</div>
                    <div class="post-views-col">${post.views || 0}</div>
                    <div class="post-likes-col">${post.likes || 0}</div>
                    <div class="post-comments-col">${commentCount}</div>
                </div>
            </div>
        `;
    }).join('');
    
    html += '</div>';
    
    if (!container) {
        console.error('Container not found for category:', category);
        return;
    }
    
    container.innerHTML = html;
    console.log('Posts loaded into container:', category, filteredPosts.length);
}

// Calculate popularity score (for humor board)
function calculatePopularityScore(post) {
    const views = post.views || 0;
    const likes = post.likes || 0;
    const comments = getCommentCount(post.id);
    const hoursSincePost = (new Date() - new Date(post.createdAt)) / (1000 * 60 * 60);
    
    // Score decreases over time, but recent posts get weight
    const timeDecay = Math.max(0.1, 1 - (hoursSincePost / 168)); // Based on 1 week
    const score = (views * 0.1) + (likes * 5) + (comments * 3) * timeDecay;
    
    return Math.round(score);
}

// Load galleries
function loadGalleries() {
    console.log('loadGalleries called');
    const galleries = Storage.get('galleries') || [];
    console.log('Total galleries in storage:', galleries.length);
    
    const approvedGalleries = galleries.filter(g => g.status === 'approved');
    console.log('Approved galleries:', approvedGalleries.length);
    
    const container = document.getElementById('galleryList');
    if (!container) {
        console.error('galleryList container not found!');
        return;
    }
    
    if (approvedGalleries.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: white; padding: 2rem;">No approved galleries yet.</p>';
        return;
    }

    // Sort galleries by predefined order
    const sortedGalleries = approvedGalleries.sort((a, b) => {
        const indexA = PREDEFINED_COUNTRIES.findIndex(c => c.name === a.country);
        const indexB = PREDEFINED_COUNTRIES.findIndex(c => c.name === b.country);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });
    
    container.innerHTML = sortedGalleries.map(gallery => {
        const posts = (Storage.get('posts') || []).filter(p => p.galleryId === gallery.id && !p.deleted);
        const flag = gallery.flag || '';
        return `
            <div class="gallery-card" onclick="showGallery('${gallery.id}')">
                <h3>${flag} ${escapeHtml(gallery.country)}</h3>
                <p>${escapeHtml(gallery.description)}</p>
                <div style="margin-top: 1rem;">
                    <span style="color: #666;">Posts: ${posts.length}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Kakao Map variables
let kakaoMap = null;
let kakaoMarker = null;
let kakaoGeocoder = null;

// Open write modal
function openWriteModal(category) {
    // No login required - anyone can write posts
    
    document.getElementById('writeModalTitle').textContent = 
        category === 'info' ? 'Write Information Post' :
        category === 'hotplace' ? 'Write Hot Place Post' :
        'Write Humor Post';
    
    document.getElementById('writeForm').setAttribute('data-category', category);
    document.getElementById('writeForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    
    // Show/hide location group for hotplace
    const locationGroup = document.getElementById('locationGroup');
    if (category === 'hotplace') {
        locationGroup.style.display = 'block';
        initKakaoMap();
    } else {
        locationGroup.style.display = 'none';
        if (kakaoMap) {
            kakaoMap = null;
            kakaoMarker = null;
            kakaoGeocoder = null;
        }
    }
    
    showModal('writeModal');
}

// Initialize Kakao Map
function initKakaoMap() {
    const mapDiv = document.getElementById('locationMap');
    if (!mapDiv) return;
    
    mapDiv.innerHTML = ''; // Clear any previous content
    
    if (typeof kakao === 'undefined' || !kakao.maps) {
        // If Kakao Map API is not loaded, show manual input
        mapDiv.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #666; background: #f5f5f5; border-radius: 10px;">
                <p style="margin-bottom: 1rem;">Kakao Map API not configured.</p>
                <p style="font-size: 0.9rem; margin-bottom: 1rem;">Please configure your Kakao API key in index.html</p>
                <p style="font-size: 0.85rem; margin-bottom: 1rem; color: #999;">Or enter location manually:</p>
                <input type="text" id="manualLocation" placeholder="Enter location (e.g., 강남구, 서울)" 
                       style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 5px;">
            </div>
        `;
        
        // Update location when manual input changes
        const manualInput = document.getElementById('manualLocation');
        if (manualInput) {
            manualInput.addEventListener('input', function() {
                document.getElementById('selectedLocation').value = this.value;
                document.getElementById('locationAddress').value = this.value;
            });
        }
        return;
    }
    
    // Default location: Seoul
    const defaultPosition = new kakao.maps.LatLng(37.5665, 126.9780);
    
    // Map options
    const mapOption = {
        center: defaultPosition,
        level: 3 // Zoom level
    };
    
    // Initialize map
    kakaoMap = new kakao.maps.Map(mapDiv, mapOption);
    
    // Add marker
    kakaoMarker = new kakao.maps.Marker({
        position: defaultPosition,
        map: kakaoMap
    });
    
    // Initialize geocoder
    kakaoGeocoder = new kakao.maps.services.Geocoder();
    
    // Map click event
    kakao.maps.event.addListener(kakaoMap, 'click', function(mouseEvent) {
        const latlng = mouseEvent.latLng;
        const lat = latlng.getLat();
        const lng = latlng.getLng();
        
        // Move marker
        kakaoMarker.setPosition(latlng);
        
        // Reverse geocoding (coordinates to address)
        kakaoGeocoder.coord2Address(lng, lat, function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                const address = result[0].address;
                const roadAddress = result[0].road_address;
                const fullAddress = roadAddress ? roadAddress.address_name : address.address_name;
                
                document.getElementById('selectedLocation').value = fullAddress;
                document.getElementById('locationAddress').value = fullAddress;
            } else {
                document.getElementById('selectedLocation').value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                document.getElementById('locationAddress').value = '';
            }
        });
        
        document.getElementById('locationLat').value = lat;
        document.getElementById('locationLng').value = lng;
    });
    
    // Search button event
    const searchBtn = document.getElementById('searchLocationBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', searchLocationKakao);
    }
    
    const searchInput = document.getElementById('locationSearch');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchLocationKakao();
            }
        });
    }
}

// Search location using Kakao Geocoding
function searchLocationKakao() {
    if (!kakaoGeocoder || typeof kakao === 'undefined') return;
    
    const query = document.getElementById('locationSearch').value;
    if (!query) return;
    
    // Address search (geocoding)
    kakaoGeocoder.addressSearch(query, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            
            // Move map center
            kakaoMap.setCenter(coords);
            
            // Move marker
            kakaoMarker.setPosition(coords);
            
            // Get address
            const roadAddress = result[0].road_address;
            const address = result[0].address;
            const fullAddress = roadAddress ? roadAddress.address_name : address.address_name;
            
            document.getElementById('selectedLocation').value = fullAddress;
            document.getElementById('locationAddress').value = fullAddress;
            document.getElementById('locationLat').value = result[0].y;
            document.getElementById('locationLng').value = result[0].x;
        } else {
            alert('Location not found. Please try a different search term.');
        }
    });
}

// Generate IP address (for local storage, generates a consistent IP per user/session)
function generateIP() {
    // Get or create IP for current user or anonymous session
    const userIPs = Storage.get('userIPs') || {};
    const sessionId = currentUser ? currentUser.id : (Storage.get('anonymousSessionId') || generateId());
    
    if (!Storage.get('anonymousSessionId') && !currentUser) {
        Storage.set('anonymousSessionId', sessionId);
    }
    
    if (userIPs[sessionId]) {
        return userIPs[sessionId];
    }
    
    // Generate random IP (for demo purposes)
    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    
    userIPs[sessionId] = ip;
    Storage.set('userIPs', userIPs);
    
    return ip;
}

// Get IP prefix (first 6 characters)
function getIPPrefix(ip) {
    if (!ip) return '******';
    return ip.substring(0, 6) + '**';
}

// Handle write post
function handleWritePost(e) {
    e.preventDefault();
    
    // No login required - anyone can write posts

    const category = e.target.getAttribute('data-category');
    const nickname = document.getElementById('postNickname').value.trim();
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const videoUrl = document.getElementById('postVideo').value;
    const imageFiles = document.getElementById('postImages').files;

    // Process images
    const imagePromises = Array.from(imageFiles).map(file => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    });

    Promise.all(imagePromises).then(images => {
        const galleryId = e.target.getAttribute('data-gallery-id');
        const ip = generateIP();
        
        // Get location info for hotplace
        let location = null;
        if (category === 'hotplace') {
            const locationLat = document.getElementById('locationLat').value;
            const locationLng = document.getElementById('locationLng').value;
            const locationAddress = document.getElementById('locationAddress').value;
            const manualLocation = document.getElementById('manualLocation') ? document.getElementById('manualLocation').value : '';
            
            // Use map coordinates if available, otherwise use manual input
            if (locationLat && locationLng) {
                location = {
                    lat: parseFloat(locationLat),
                    lng: parseFloat(locationLng),
                    address: locationAddress || ''
                };
            } else if (manualLocation) {
                location = {
                    lat: null,
                    lng: null,
                    address: manualLocation
                };
            }
        }
        
        const post = {
            id: generateId(),
            userId: currentUser ? currentUser.id : null, // Optional - can be null for anonymous posts
            category: category,
            galleryId: galleryId || null,
            title: title,
            content: content,
            images: images,
            videoUrl: videoUrl || null,
            nickname: nickname || null, // null means anonymous
            ipPrefix: getIPPrefix(ip),
            location: location, // Location for hotplace
            views: 0,
            likes: 0,
            comments: 0,
            createdAt: new Date().toISOString(),
            deleted: false
        };

        const posts = Storage.get('posts') || [];
        posts.push(post);
        Storage.set('posts', posts);

        hideModal('writeModal');
        document.getElementById('writeForm').reset();
        document.getElementById('imagePreview').innerHTML = '';
        e.target.removeAttribute('data-gallery-id');
        
        alert('Post created successfully!');
        
        if (galleryId) {
            hideModal('writeModal');
            showGallery(galleryId);
        } else {
            loadPosts(category);
        }
        
        // Reload home page to show hot posts
        if (document.getElementById('homePage').classList.contains('active')) {
            loadHomePage();
        }
    });
}

// Image preview
function handleImagePreview(e) {
    const files = e.target.files;
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
}

// Handle gallery application
function handleGalleryApplication(e) {
    e.preventDefault();
    
    if (!currentUser) {
        alert('Login required.');
        return;
    }

    const country = document.getElementById('galleryCountry').value;
    const description = document.getElementById('galleryDescription').value;

    // Check if gallery already exists
    const galleries = Storage.get('galleries') || [];
    const existing = galleries.find(g => 
        g.country.toLowerCase() === country.toLowerCase() && g.status === 'approved'
    );

    if (existing) {
        alert('Gallery already exists.');
        return;
    }

    const application = {
        id: generateId(),
        userId: currentUser.id,
        country: country,
        description: description,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    const applications = Storage.get('galleryApplications') || [];
    applications.push(application);
    Storage.set('galleryApplications', applications);

    hideModal('galleryApplyModal');
    document.getElementById('galleryApplyForm').reset();
    
    alert('Gallery application submitted. Please wait for admin approval.');
}

// Show post detail
function showPostDetail(postId) {
    const posts = Storage.get('posts') || [];
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        alert('Post not found.');
        return;
    }

    // Increase views
    post.views = (post.views || 0) + 1;
    Storage.set('posts', posts);

    const user = getUserById(post.userId);
    const modal = document.getElementById('postDetailModal');
    const detail = document.getElementById('postDetail');
    const displayName = post.nickname || 'Anonymous';

    // Store current post ID for navigation
    window.currentPostId = postId;
    
    // Check if this post is in hot posts list (by checking if it's in the hot posts page)
    const hotPostsList = getHotPostsList();
    const hotPostIndex = hotPostsList.findIndex(p => p.id === postId);
    
    if (hotPostIndex !== -1) {
        // This post is in hot posts - use hot posts order for navigation
        window.currentPostIndex = hotPostIndex;
        window.allPostsList = hotPostsList;
        window.isHotPostNavigation = true;
    } else {
        // Use category-based navigation
        const categoryPosts = posts.filter(p => !p.deleted && p.category === post.category)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        const currentIndex = categoryPosts.findIndex(p => p.id === postId);
        window.currentPostIndex = currentIndex;
        window.allPostsList = categoryPosts;
        window.isHotPostNavigation = false;
    }

    detail.innerHTML = `
        <div class="post-detail-wrapper">
            <div class="post-detail-main">
                <div class="post-detail-header">
                    <h2 class="post-detail-title">${escapeHtml(post.title)}</h2>
                    <div class="post-detail-meta">
                        <span>${escapeHtml(displayName)}</span>
                        ${post.ipPrefix ? `<span>IP: ${post.ipPrefix}</span>` : ''}
                        ${post.location && post.location.address ? `<span>📍 ${escapeHtml(post.location.address)}</span>` : ''}
                        <span>Date: ${formatDate(post.createdAt)}</span>
                        <span>Views: ${post.views || 0}</span>
                    </div>
                </div>
                ${post.images && post.images.length > 0 ? `
                    <div class="post-detail-images-inline">
                        ${post.images.map(img => `<img src="${img}" alt="Post image">`).join('')}
                    </div>
                ` : ''}
                <div class="post-detail-content">${escapeHtml(post.content).replace(/\n/g, '<br>')}</div>
                ${post.videoUrl ? `
                    <div class="post-detail-video">
                        ${embedVideo(post.videoUrl)}
                    </div>
                ` : ''}
                ${post.videoUrl ? `
                    <div style="margin-top: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 8px; font-size: 0.9rem; color: #666;">
                        <strong>Video URL:</strong> <a href="${escapeHtml(post.videoUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(post.videoUrl)}</a>
                    </div>
                ` : ''}
                <div class="post-actions">
                    ${hasLiked(post.id, 'post') ? `
                        <button class="btn btn-primary" disabled style="opacity: 0.6; cursor: not-allowed;">
                            👍 Liked (${post.likes || 0})
                        </button>
                    ` : `
                        <button class="btn btn-primary" onclick="likePost('${post.id}')">👍 Like (${post.likes || 0})</button>
                    `}
                </div>
                
                <!-- Post Navigation -->
                <div class="post-navigation">
                    ${(window.currentPostIndex !== undefined && window.currentPostIndex > 0) ? `
                        <button class="post-nav-btn post-nav-prev" onclick="scrollToPreviousPost()">
                            <span class="post-nav-arrow">←</span>
                            <span class="post-nav-text">Prev</span>
                        </button>
                    ` : `
                        <button class="post-nav-btn post-nav-prev" disabled style="opacity: 0.3; cursor: not-allowed;">
                            <span class="post-nav-arrow">←</span>
                            <span class="post-nav-text">Prev</span>
                        </button>
                    `}
                    ${(window.currentPostIndex !== undefined && window.allPostsList && window.currentPostIndex < window.allPostsList.length - 1) ? `
                        <button class="post-nav-btn post-nav-next" onclick="scrollToNextPost()">
                            <span class="post-nav-text">Next</span>
                            <span class="post-nav-arrow">→</span>
                        </button>
                    ` : `
                        <button class="post-nav-btn post-nav-next" disabled style="opacity: 0.3; cursor: not-allowed;">
                            <span class="post-nav-text">Next</span>
                            <span class="post-nav-arrow">→</span>
                        </button>
                    `}
                </div>
                
                <!-- Comments Section -->
                <div class="comments-section">
                    <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: #4a4a4a;">Comments (${getCommentCount(post.id)})</h3>
                    
                    <!-- Comment Form -->
                    <div class="comment-form">
                        <div class="form-group" style="margin-bottom: 1rem;">
                            ${currentUser ? `
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <span style="font-size: 0.9rem; color: #666;">Commenting as:</span>
                                    <strong style="color: #ff9800;">${escapeHtml(currentUser.name)}</strong>
                                </div>
                            ` : `
                                <input type="text" id="commentNickname" placeholder="Nickname (optional)" maxlength="20"
                                       style="padding: 0.6rem; border: 1px solid #ddd; border-radius: 5px; width: 200px;">
                                <small style="display: block; color: #999; margin-top: 0.3rem;">Leave blank to use IP prefix</small>
                            `}
                        </div>
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <textarea id="commentContent" rows="3" placeholder="Write a comment..." 
                                      style="width: 100%; padding: 0.8rem; border: 1px solid #ddd; border-radius: 5px; resize: vertical; font-family: inherit;"></textarea>
                        </div>
                        <button class="btn btn-primary" onclick="submitComment('${post.id}')" style="margin-bottom: 1.5rem;">Post Comment</button>
                    </div>
                    
                    <!-- Comments List -->
                    <div id="commentsList-${post.id}" class="comments-list">
                        ${loadComments(post.id)}
                    </div>
                </div>
            </div>
        </div>
    `;

    showModal('postDetailModal');
}

// Submit comment
function submitComment(postId) {
    const commentContent = document.getElementById('commentContent').value.trim();
    if (!commentContent) {
        alert('Please enter a comment.');
        return;
    }
    
    const commentNickname = document.getElementById('commentNickname') ? document.getElementById('commentNickname').value.trim() : '';
    const ip = generateIP();
    
    // If logged in, use user's name; otherwise use nickname or IP
    let displayName;
    let commentUserId = null;
    
    if (currentUser) {
        displayName = currentUser.name;
        commentUserId = currentUser.id;
    } else {
        displayName = commentNickname || getIPPrefix(ip);
    }
    
    const comment = {
        id: generateId(),
        postId: postId,
        userId: commentUserId,
        nickname: currentUser ? null : (commentNickname || null),
        ipPrefix: currentUser ? null : getIPPrefix(ip),
        content: commentContent,
        createdAt: new Date().toISOString(),
        deleted: false
    };
    
    const comments = Storage.get('comments') || [];
    comments.push(comment);
    Storage.set('comments', comments);
    
    // Update post comment count
    const posts = Storage.get('posts') || [];
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.comments = (post.comments || 0) + 1;
        Storage.set('posts', posts);
    }
    
    // Clear form
    document.getElementById('commentContent').value = '';
    if (!currentUser) {
        document.getElementById('commentNickname').value = '';
    }
    
    // Reload comments
    const commentsList = document.getElementById(`commentsList-${postId}`);
    if (commentsList) {
        commentsList.innerHTML = loadComments(postId);
    }
    
    // Update comment count in header
    const commentsSection = document.querySelector('.comments-section h3');
    if (commentsSection) {
        const count = getCommentCount(postId);
        commentsSection.textContent = `Comments (${count})`;
    }
}

// Load comments
function loadComments(postId) {
    const comments = Storage.get('comments') || [];
    const postComments = comments
        .filter(c => c.postId === postId && !c.deleted)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    if (postComments.length === 0) {
        return '<p style="color: #999; padding: 1rem; text-align: center;">No comments yet. Be the first to comment!</p>';
    }
    
    return postComments.map(comment => {
        const user = comment.userId ? getUserById(comment.userId) : null;
        const displayName = user ? user.name : (comment.nickname || comment.ipPrefix || 'Anonymous');
        const isLiked = hasLiked(comment.id, 'comment');
        const likeBtnClass = isLiked ? 'comment-like-btn liked' : 'comment-like-btn';
        const likeBtnDisabled = isLiked ? 'disabled' : '';
        
        return `
            <div class="comment-item">
                <div class="comment-header">
                    <span class="comment-author">${escapeHtml(displayName)}</span>
                    ${comment.ipPrefix && !user ? `<span class="comment-ip">IP: ${comment.ipPrefix}</span>` : ''}
                    <span class="comment-date">${formatDate(comment.createdAt)}</span>
                </div>
                <div class="comment-content">${escapeHtml(comment.content).replace(/\n/g, '<br>')}</div>
                <div class="comment-actions">
                    <button class="${likeBtnClass}" onclick="likeComment('${comment.id}')" ${likeBtnDisabled}>
                        👍 ${comment.likes || 0}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Get comment count
function getCommentCount(postId) {
    const comments = Storage.get('comments') || [];
    return comments.filter(c => c.postId === postId && !c.deleted).length;
}

// Get best comments (top 2 by likes, or most recent if no likes)
function getBestComments(postId, limit = 2) {
    const comments = Storage.get('comments') || [];
    const postComments = comments.filter(c => c.postId === postId && !c.deleted);
    
    if (postComments.length === 0) return [];
    
    // Sort by likes (descending), then by date (descending) if likes are equal
    const sorted = postComments.sort((a, b) => {
        const likesDiff = (b.likes || 0) - (a.likes || 0);
        if (likesDiff !== 0) return likesDiff;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    return sorted.slice(0, limit);
}

// Write gallery post
function openGalleryWrite(galleryId) {
    const galleries = Storage.get('galleries') || [];
    const gallery = galleries.find(g => g.id === galleryId);
    
    if (!gallery) return;
    
    // No login required - anyone can write posts in galleries
    const flag = gallery.flag || '';
    document.getElementById('writeModalTitle').textContent = `${flag} ${gallery.country} Gallery - Write Post`;
    document.getElementById('writeForm').setAttribute('data-gallery-id', galleryId);
    document.getElementById('writeForm').setAttribute('data-category', 'gallery');
    document.getElementById('writeForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    showModal('writeModal');
}

// Current gallery ID for page navigation
let currentGalleryId = null;

// Show gallery page
function showGallery(galleryId) {
    currentGalleryId = galleryId;
    const galleries = Storage.get('galleries') || [];
    const gallery = galleries.find(g => g.id === galleryId);
    
    if (!gallery) {
        alert('Gallery not found.');
        return;
    }

    // Switch to gallery page
    showPage('gallery');
    loadGalleryPage(galleryId);
}

// Load gallery page content
function loadGalleryPage(galleryId) {
    const galleries = Storage.get('galleries') || [];
    const gallery = galleries.find(g => g.id === galleryId);
    
    if (!gallery) return;

    // Display gallery posts
    const posts = Storage.get('posts') || [];
    const galleryPosts = posts.filter(p => p.galleryId === galleryId && !p.deleted)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const flag = gallery.flag || '';
    const title = document.getElementById('galleryPageTitle');
    const content = document.getElementById('galleryPageContent');
    
    title.innerHTML = `${flag} ${escapeHtml(gallery.country)} Gallery`;
    
    content.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 25px; margin-bottom: 2rem; box-shadow: 0 4px 20px rgba(255, 183, 77, 0.15); border: 2px solid rgba(255, 183, 77, 0.2);">
            <p style="color: #6b7280; font-size: 1.1rem; line-height: 1.6;">${escapeHtml(gallery.description)}</p>
        </div>
        <div class="posts-container">
            ${galleryPosts.length === 0 ? '<p style="text-align: center; padding: 3rem; color: #6b7280; background: white; border-radius: 25px;">No posts yet. Be the first to post!</p>' : 
            galleryPosts.map(post => {
                const displayName = post.nickname || 'Anonymous';
                return `
                    <div class="post-card" onclick="showPostDetail('${post.id}')">
                        <div class="post-title">${escapeHtml(post.title)}</div>
                        <div class="post-meta">
                            <span>${escapeHtml(displayName)}</span>
                            ${post.ipPrefix ? `<span>IP: ${post.ipPrefix}</span>` : ''}
                            <span>${formatDate(post.createdAt)}</span>
                        </div>
                        <div class="post-content">${escapeHtml(post.content.substring(0, 200))}${post.content.length > 200 ? '...' : ''}</div>
                        ${post.images && post.images.length > 0 ? `
                            <div class="post-images">
                                ${post.images.slice(0, 3).map(img => `<img src="${img}" alt="Post image">`).join('')}
                            </div>
                        ` : ''}
                        <div class="post-footer">
                            <div class="post-stats">
                                <span>👁️ ${post.views || 0}</span>
                                <span>👍 ${post.likes || 0}</span>
                                <span>💬 ${post.comments || 0}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Check if user/IP already liked
function hasLiked(itemId, type) {
    const likes = Storage.get('likes') || { posts: {}, comments: {} };
    const likeKey = type === 'post' ? 'posts' : 'comments';
    const likeRecords = likes[likeKey][itemId] || [];
    
    // Get identifier (userId or IP)
    const identifier = currentUser ? currentUser.id : generateIP();
    const ipPrefix = currentUser ? null : getIPPrefix(identifier);
    
    // Check if already liked
    if (currentUser) {
        return likeRecords.some(record => record.userId === currentUser.id);
    } else {
        // For anonymous users, check by IP prefix
        return likeRecords.some(record => record.ipPrefix === ipPrefix);
    }
}

// Like post
function likePost(postId) {
    // Check if already liked
    if (hasLiked(postId, 'post')) {
        alert('You have already liked this post.');
        return;
    }
    
    const posts = Storage.get('posts') || [];
    const post = posts.find(p => p.id === postId);
    
    if (!post) return;
    
    // Increase likes
    post.likes = (post.likes || 0) + 1;
    Storage.set('posts', posts);
    
    // Save like record
    const likes = Storage.get('likes') || { posts: {}, comments: {} };
    if (!likes.posts[postId]) {
        likes.posts[postId] = [];
    }
    
    const identifier = currentUser ? currentUser.id : generateIP();
    const ipPrefix = currentUser ? null : getIPPrefix(identifier);
    
    likes.posts[postId].push({
        userId: currentUser ? currentUser.id : null,
        ipPrefix: ipPrefix,
        createdAt: new Date().toISOString()
    });
    
    Storage.set('likes', likes);
    
    // Update UI - reload post detail to show updated like count
    showPostDetail(postId);
}

// Like comment
function likeComment(commentId) {
    // Check if already liked
    if (hasLiked(commentId, 'comment')) {
        alert('You have already liked this comment.');
        return;
    }
    
    const comments = Storage.get('comments') || [];
    const comment = comments.find(c => c.id === commentId);
    
    if (!comment) return;
    
    // Initialize likes if not exists
    if (!comment.likes) {
        comment.likes = 0;
    }
    
    // Increase likes
    comment.likes = (comment.likes || 0) + 1;
    Storage.set('comments', comments);
    
    // Save like record
    const likes = Storage.get('likes') || { posts: {}, comments: {} };
    if (!likes.comments[commentId]) {
        likes.comments[commentId] = [];
    }
    
    const identifier = currentUser ? currentUser.id : generateIP();
    const ipPrefix = currentUser ? null : getIPPrefix(identifier);
    
    likes.comments[commentId].push({
        userId: currentUser ? currentUser.id : null,
        ipPrefix: ipPrefix,
        createdAt: new Date().toISOString()
    });
    
    Storage.set('likes', likes);
    
    // Reload comments to update UI
    const postId = comment.postId;
    const commentsList = document.getElementById(`commentsList-${postId}`);
    if (commentsList) {
        commentsList.innerHTML = loadComments(postId);
    }
}

// Utility functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getUserById(userId) {
    const users = Storage.get('users') || [];
    return users.find(u => u.id === userId);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getCountryName(code) {
    const countries = {
        'USA': 'United States',
        'UK': 'United Kingdom',
        'China': 'China',
        'Japan': 'Japan',
        'Vietnam': 'Vietnam',
        'Thailand': 'Thailand',
        'Philippines': 'Philippines',
        'Indonesia': 'Indonesia',
        'India': 'India',
        'Korea': 'Korea',
        'Other': 'Other',
        'Uzbekistan': 'Uzbekistan',
        'Nepal': 'Nepal',
        'Cambodia': 'Cambodia',
        'Mongolia': 'Mongolia',
        'Russia': 'Russia',
        'Bangladesh': 'Bangladesh',
        'Pakistan': 'Pakistan',
        'SriLanka': 'Sri Lanka',
        'Myanmar': 'Myanmar',
        'Canada': 'Canada',
        'Australia': 'Australia',
        'France': 'France',
        'Germany': 'Germany',
        'Brazil': 'Brazil',
        'Mexico': 'Mexico',
        'SouthAfrica': 'South Africa',
        'Spain': 'Spain',
        'Italy': 'Italy',
        'NewZealand': 'New Zealand',
        'Singapore': 'Singapore',
        'Malaysia': 'Malaysia'
    };
    return countries[code] || code || 'Unknown';
}

function embedVideo(url) {
    if (!url) {
        console.warn('embedVideo: No URL provided');
        return '';
    }
    
    // Clean URL - remove whitespace
    url = String(url).trim().replace(/\s/g, '');
    console.log('embedVideo: Processing URL:', url);
    
    // Handle YouTube links
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        
        try {
            // Add http:// if missing
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            
            // Try using URL API first (most reliable)
            try {
                const urlObj = new URL(url);
                
                if (urlObj.hostname.includes('youtube.com')) {
                    // Try searchParams first
                    videoId = urlObj.searchParams.get('v');
                    
                    // If not found, try pathname
                    if (!videoId) {
                        const pathParts = urlObj.pathname.split('/').filter(p => p);
                        if (pathParts.includes('embed')) {
                            const embedIndex = pathParts.indexOf('embed');
                            videoId = pathParts[embedIndex + 1];
                        } else if (pathParts.includes('shorts')) {
                            const shortsIndex = pathParts.indexOf('shorts');
                            videoId = pathParts[shortsIndex + 1];
                        } else if (pathParts.includes('v')) {
                            const vIndex = pathParts.indexOf('v');
                            videoId = pathParts[vIndex + 1];
                        }
                    }
                } else if (urlObj.hostname.includes('youtu.be')) {
                    videoId = urlObj.pathname.replace(/^\//, '').split('?')[0].split('#')[0];
                }
                
                // Clean video ID
                if (videoId) {
                    videoId = videoId.split('?')[0].split('#')[0].split('&')[0].trim();
                    videoId = videoId.replace(/[^a-zA-Z0-9_-]/g, '');
                }
                
                console.log('embedVideo: Extracted with URL API:', videoId);
            } catch (urlError) {
                console.log('embedVideo: URL API failed, trying regex:', urlError);
            }
            
            // Fallback: regex patterns if URL API didn't work
            if (!videoId || videoId.length !== 11) {
                const patterns = [
                    /(?:youtube\.com\/watch\?.*v=|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
                    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
                    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
                    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
                    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
                    /[?&]v=([a-zA-Z0-9_-]{11})/
                ];
                
                for (const pattern of patterns) {
                    const match = url.match(pattern);
                    if (match && match[1] && match[1].length === 11) {
                        videoId = match[1];
                        console.log('embedVideo: Found video ID with regex pattern:', videoId);
                        break;
                    }
                }
            }
            
            // Final cleanup
            if (videoId) {
                videoId = videoId.replace(/[^a-zA-Z0-9_-]/g, '');
                if (videoId.length > 11) {
                    videoId = videoId.substring(0, 11);
                } else if (videoId.length < 11) {
                    videoId = '';
                }
            }
            
            console.log('embedVideo: Final video ID:', videoId, 'Length:', videoId ? videoId.length : 0);
            
            if (videoId && videoId.length === 11) {
                // YouTube video IDs are exactly 11 characters
                // Use proper embed URL with no-cookie domain for better compatibility
                const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;
                console.log('embedVideo: Embedding video with URL:', embedUrl);
                return `<div class="video-wrapper">
                    <iframe 
                        width="100%" 
                        height="400" 
                        src="${embedUrl}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen
                        loading="lazy"
                        style="max-width: 100%; border-radius: 12px; border: none; display: block;">
                    </iframe>
                </div>`;
            } else {
                console.error('embedVideo: Invalid video ID:', videoId, 'from URL:', url);
                // Try to extract video ID one more time with a simpler approach
                let simpleVideoId = '';
                const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
                
                if (urlObj.hostname.includes('youtube.com')) {
                    simpleVideoId = urlObj.searchParams.get('v') || 
                                   urlObj.pathname.split('/').pop() || 
                                   urlObj.pathname.split('/').filter(p => p && p !== 'embed' && p !== 'watch' && p !== 'shorts' && p !== 'v').pop();
                } else if (urlObj.hostname.includes('youtu.be')) {
                    simpleVideoId = urlObj.pathname.replace('/', '').split('?')[0].split('#')[0];
                }
                
                if (simpleVideoId && simpleVideoId.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(simpleVideoId)) {
                    console.log('embedVideo: Found video ID with URL parsing:', simpleVideoId);
                    const embedUrl = `https://www.youtube.com/embed/${simpleVideoId}?rel=0&modestbranding=1&playsinline=1`;
                    return `<div class="video-wrapper">
                        <iframe 
                            width="100%" 
                            height="400" 
                            src="${embedUrl}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowfullscreen
                            loading="lazy"
                            style="max-width: 100%; border-radius: 12px; border: none; display: block;">
                        </iframe>
                    </div>`;
                }
                
                return `<div class="video-link">
                    <p style="color: #f44336; margin-bottom: 0.5rem;">⚠️ Could not parse YouTube URL</p>
                    <p>URL: <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" style="color: #ff9800; word-break: break-all;">${escapeHtml(url)}</a></p>
                    <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #666;">Please check the URL format. Supported formats: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...</p>
                </div>`;
            }
        } catch (error) {
            console.error('embedVideo: Exception parsing YouTube URL:', error, url);
            return `<div class="video-link">
                <p style="color: #f44336;">Error parsing video URL</p>
                <p><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" style="color: #ff9800; word-break: break-all;">${escapeHtml(url)}</a></p>
            </div>`;
        }
    }
    
    // Handle Vimeo links
    if (url.includes('vimeo.com')) {
        let videoId = '';
        if (url.includes('vimeo.com/')) {
            videoId = url.split('vimeo.com/')[1].split('?')[0].split('#')[0];
        }
        if (videoId) {
            return `<div class="video-wrapper">
                <iframe 
                    src="https://player.vimeo.com/video/${videoId}" 
                    width="100%" 
                    height="400" 
                    frameborder="0" 
                    allow="autoplay; fullscreen; picture-in-picture" 
                    allowfullscreen
                    style="max-width: 100%; border-radius: 12px;">
                </iframe>
            </div>`;
        }
    }
    
    // Display other links as clickable link
    return `<div class="video-link"><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a></div>`;
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Scroll Navigation Functions
function scrollToNext(wrapperId) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    
    const cards = wrapper.querySelectorAll('.post-card');
    if (cards.length === 0) return;
    
    const scrollPosition = wrapper.scrollTop;
    const wrapperHeight = wrapper.clientHeight;
    let targetCard = null;
    
    // Find the next card that is not fully visible
    for (let i = 0; i < cards.length; i++) {
        const cardTop = cards[i].offsetTop;
        const cardBottom = cardTop + cards[i].offsetHeight;
        const visibleTop = scrollPosition;
        const visibleBottom = scrollPosition + wrapperHeight;
        
        // If card is partially or fully below visible area
        if (cardTop > visibleBottom || (cardTop > visibleTop && cardBottom > visibleBottom)) {
            targetCard = cards[i];
            break;
        }
    }
    
    if (targetCard) {
        wrapper.scrollTo({
            top: targetCard.offsetTop - 10,
            behavior: 'smooth'
        });
    } else {
        // Scroll to bottom if at last card
        wrapper.scrollTo({
            top: wrapper.scrollHeight,
            behavior: 'smooth'
        });
    }
}

function scrollToPrevious(wrapperId) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    
    const cards = wrapper.querySelectorAll('.post-card');
    if (cards.length === 0) return;
    
    const scrollPosition = wrapper.scrollTop;
    const wrapperHeight = wrapper.clientHeight;
    let targetCard = null;
    
    // Find the previous card that is not fully visible
    for (let i = cards.length - 1; i >= 0; i--) {
        const cardTop = cards[i].offsetTop;
        const cardBottom = cardTop + cards[i].offsetHeight;
        const visibleTop = scrollPosition;
        const visibleBottom = scrollPosition + wrapperHeight;
        
        // If card is partially or fully above visible area
        if (cardBottom < visibleTop || (cardTop < visibleTop && cardBottom < visibleBottom)) {
            targetCard = cards[i];
            break;
        }
    }
    
    if (targetCard) {
        wrapper.scrollTo({
            top: targetCard.offsetTop - 10,
            behavior: 'smooth'
        });
    } else {
        // Scroll to top if at first card
        wrapper.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Setup mouse wheel scroll navigation
function setupScrollNavigation(wrapperId) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    
    let isScrolling = false;
    let scrollTimeout = null;
    
    wrapper.addEventListener('wheel', (e) => {
        if (isScrolling) {
            e.preventDefault();
            return;
        }
        
        // Clear existing timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // Prevent default scroll
        e.preventDefault();
        
        // Set scrolling flag
        isScrolling = true;
        
        const delta = e.deltaY;
        const scrollAmount = 300; // Adjust scroll distance
        
        if (delta > 0) {
            // Scroll down - next post
            scrollToNext(wrapperId);
        } else {
            // Scroll up - previous post
            scrollToPrevious(wrapperId);
        }
        
        // Reset scrolling flag after animation
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 500);
    }, { passive: false });
}

// Navigate to previous post in modal
function scrollToPreviousPost() {
    if (window.currentPostIndex === undefined || !window.allPostsList) {
        console.warn('Cannot navigate: missing post index or list');
        return;
    }
    
    const prevIndex = window.currentPostIndex - 1;
    
    if (prevIndex >= 0 && prevIndex < window.allPostsList.length) {
        const prevPost = window.allPostsList[prevIndex];
        if (prevPost && prevPost.id) {
            showPostDetail(prevPost.id);
        }
    }
}

// Navigate to next post in modal
function scrollToNextPost() {
    if (window.currentPostIndex === undefined || !window.allPostsList) {
        console.warn('Cannot navigate: missing post index or list');
        return;
    }
    
    const nextIndex = window.currentPostIndex + 1;
    
    if (nextIndex >= 0 && nextIndex < window.allPostsList.length) {
        const nextPost = window.allPostsList[nextIndex];
        if (nextPost && nextPost.id) {
            showPostDetail(nextPost.id);
        }
    }
}

