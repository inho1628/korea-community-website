// 데이터 저장소 (script.js와 동일)
const Storage = {
    get: (key) => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    },
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

let currentUser = null;

// 페이지 초기화
document.addEventListener('DOMContentLoaded', () => {
    checkAdminAccess();
    setupEventListeners();
    loadStats();
    loadApplications();
});

// 관리자 권한 확인
function checkAdminAccess() {
    currentUser = Storage.get('currentUser');
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Admin access only.');
        window.location.href = 'index.html';
        return;
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 탭 전환
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // 관리자 지정 폼
    document.getElementById('adminForm').addEventListener('submit', handleAdminAssign);

    // 모달 닫기
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            hideModal(modal.id);
        });
    });
}

// 탭 전환
function switchTab(tabName) {
    // 탭 활성화
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // 섹션 활성화
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${tabName}Section`).classList.add('active');

    // 컨텐츠 로드
    switch(tabName) {
        case 'applications':
            loadApplications();
            break;
        case 'galleries':
            loadGalleries();
            break;
        case 'posts':
            loadPosts();
            break;
        case 'users':
            loadUsers();
            break;
    }
}

// 통계 로드
function loadStats() {
    const applications = Storage.get('galleryApplications') || [];
    const galleries = Storage.get('galleries') || [];
    const posts = Storage.get('posts') || [];
    const users = Storage.get('users') || [];

    document.getElementById('statApplications').textContent = 
        applications.filter(a => a.status === 'pending').length;
    document.getElementById('statGalleries').textContent = 
        galleries.filter(g => g.status === 'approved').length;
    document.getElementById('statPosts').textContent = posts.length;
    document.getElementById('statUsers').textContent = users.length;
}

// 갤러리 신청 목록 로드
function loadApplications() {
    const applications = Storage.get('galleryApplications') || [];
    const pendingApplications = applications.filter(a => a.status === 'pending');
    const users = Storage.get('users') || [];

    const container = document.getElementById('applicationsList');

    if (pendingApplications.length === 0) {
        container.innerHTML = '<p>No pending applications.</p>';
        return;
    }

    container.innerHTML = pendingApplications.map(app => {
        const user = users.find(u => u.id === app.userId);
        return `
            <div class="application-card">
                <h3>${escapeHtml(app.country)}</h3>
                <p><strong>Applicant:</strong> ${user ? user.name : 'Unknown'} (${getCountryName(user ? user.country : '')})</p>
                <p><strong>Description:</strong> ${escapeHtml(app.description)}</p>
                <p><strong>Applied:</strong> ${formatDate(app.createdAt)}</p>
                <div class="application-actions">
                    <button class="btn btn-primary" onclick="approveApplication('${app.id}')">Approve</button>
                    <button class="btn btn-secondary" onclick="rejectApplication('${app.id}')">Reject</button>
                </div>
            </div>
        `;
    }).join('');
}

// 갤러리 신청 승인
function approveApplication(applicationId) {
    const applications = Storage.get('galleryApplications') || [];
    const application = applications.find(a => a.id === applicationId);
    
    if (!application) return;

    // 갤러리 생성
    const gallery = {
        id: generateId(),
        country: application.country,
        description: application.description,
        status: 'approved',
        admins: [], // Administrators will be assigned later
        createdAt: new Date().toISOString()
    };

    const galleries = Storage.get('galleries') || [];
    galleries.push(gallery);
    Storage.set('galleries', galleries);

    // 신청 상태 업데이트
    application.status = 'approved';
    application.approvedAt = new Date().toISOString();
    Storage.set('galleryApplications', applications);

    alert('Gallery approved. Please assign administrators.');
    loadApplications();
    loadStats();
    loadGalleries();
}

// 갤러리 신청 거부
function rejectApplication(applicationId) {
    if (!confirm('Are you sure you want to reject this application?')) return;

    const applications = Storage.get('galleryApplications') || [];
    const application = applications.find(a => a.id === applicationId);
    
    if (application) {
        application.status = 'rejected';
        application.rejectedAt = new Date().toISOString();
        Storage.set('galleryApplications', applications);
        
        alert('Application rejected.');
        loadApplications();
        loadStats();
    }
}

// 갤러리 목록 로드
function loadGalleries() {
    const galleries = Storage.get('galleries') || [];
    const approvedGalleries = galleries.filter(g => g.status === 'approved');
    const users = Storage.get('users') || [];

    const container = document.getElementById('galleriesList');

    if (approvedGalleries.length === 0) {
        container.innerHTML = '<p>No approved galleries.</p>';
        return;
    }

    container.innerHTML = approvedGalleries.map(gallery => {
        const admin1 = gallery.admins && gallery.admins[0] ? 
            users.find(u => u.id === gallery.admins[0]) : null;
        const admin2 = gallery.admins && gallery.admins[1] ? 
            users.find(u => u.id === gallery.admins[1]) : null;
        const posts = (Storage.get('posts') || []).filter(p => p.galleryId === gallery.id && !p.deleted);

        return `
            <div class="gallery-card-admin">
                <h3>${gallery.flag || ''} ${escapeHtml(gallery.country)}</h3>
                <p>${escapeHtml(gallery.description)}</p>
                <p><strong>Posts:</strong> ${posts.length}</p>
                <p><strong>Administrator 1:</strong> ${admin1 ? admin1.name : 'Not assigned'}</p>
                <p><strong>Administrator 2:</strong> ${admin2 ? admin2.name : 'Not assigned'}</p>
                <div class="gallery-actions">
                    <button class="btn btn-primary" onclick="openAdminModal('${gallery.id}')">Assign Administrators</button>
                </div>
            </div>
        `;
    }).join('');
}

// 관리자 지정 모달 열기
function openAdminModal(galleryId) {
    const galleries = Storage.get('galleries') || [];
    const gallery = galleries.find(g => g.id === galleryId);
    const users = Storage.get('users') || [];
    const regularUsers = users.filter(u => u.role !== 'admin');

    document.getElementById('adminGalleryId').value = galleryId;
    
    // 관리자 선택 옵션 생성
    const admin1Select = document.getElementById('admin1');
    const admin2Select = document.getElementById('admin2');
    
    admin1Select.innerHTML = '<option value="">Select</option>';
    admin2Select.innerHTML = '<option value="">Select</option>';

    regularUsers.forEach(user => {
        const option1 = document.createElement('option');
        option1.value = user.id;
        option1.textContent = `${user.name} (${getCountryName(user.country)})`;
        if (gallery.admins && gallery.admins[0] === user.id) {
            option1.selected = true;
        }
        admin1Select.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = user.id;
        option2.textContent = `${user.name} (${getCountryName(user.country)})`;
        if (gallery.admins && gallery.admins[1] === user.id) {
            option2.selected = true;
        }
        admin2Select.appendChild(option2);
    });

    showModal('adminModal');
}

// 관리자 지정 처리
function handleAdminAssign(e) {
    e.preventDefault();
    
    const galleryId = document.getElementById('adminGalleryId').value;
    const admin1Id = document.getElementById('admin1').value;
    const admin2Id = document.getElementById('admin2').value;

    if (admin1Id === admin2Id && admin1Id !== '') {
        alert('Cannot assign the same user as both administrators.');
        return;
    }

    const galleries = Storage.get('galleries') || [];
    const gallery = galleries.find(g => g.id === galleryId);
    
    if (gallery) {
        gallery.admins = [];
        if (admin1Id) gallery.admins.push(admin1Id);
        if (admin2Id) gallery.admins.push(admin2Id);
        
        Storage.set('galleries', galleries);
        
        alert('Administrators assigned successfully.');
        hideModal('adminModal');
        loadGalleries();
    }
}

// 게시글 목록 로드
function loadPosts() {
    const posts = Storage.get('posts') || [];
    const users = Storage.get('users') || [];
    const allPosts = posts.filter(p => !p.deleted).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    const container = document.getElementById('postsList');

    if (allPosts.length === 0) {
        container.innerHTML = '<p>No posts.</p>';
        return;
    }

    container.innerHTML = allPosts.map(post => {
        const user = users.find(u => u.id === post.userId);
        const categoryNames = {
            'info': 'Information',
            'hotplace': 'Hot Places',
            'humor': 'Humor Board',
            'gallery': 'Country Gallery'
        };
        
        return `
            <div class="post-card-admin">
                <h3>${escapeHtml(post.title)}</h3>
                <p><strong>Category:</strong> ${categoryNames[post.category] || post.category}</p>
                <p><strong>Author:</strong> ${user ? user.name : 'Unknown'}</p>
                <p><strong>Date:</strong> ${formatDate(post.createdAt)}</p>
                <p><strong>Views:</strong> ${post.views || 0} | <strong>Likes:</strong> ${post.likes || 0}</p>
                <div class="gallery-actions">
                    <button class="btn btn-secondary" onclick="deletePost('${post.id}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// 게시글 삭제
function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const posts = Storage.get('posts') || [];
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        post.deleted = true;
        Storage.set('posts', posts);
        
        alert('Post deleted successfully.');
        loadPosts();
        loadStats();
    }
}

// 사용자 목록 로드
function loadUsers() {
    const users = Storage.get('users') || [];
    const allUsers = users.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    const container = document.getElementById('usersList');

    if (allUsers.length === 0) {
        container.innerHTML = '<p>No users.</p>';
        return;
    }

    container.innerHTML = allUsers.map(user => {
        const posts = (Storage.get('posts') || []).filter(p => p.userId === user.id && !p.deleted);
        return `
            <div class="user-card">
                <h3>${escapeHtml(user.name)}</h3>
                <p><strong>Email:</strong> ${escapeHtml(user.email)}</p>
                <p><strong>Country:</strong> ${getCountryName(user.country)}</p>
                <p><strong>Role:</strong> ${user.role === 'admin' ? 'Admin' : 'User'}</p>
                <p><strong>Joined:</strong> ${formatDate(user.createdAt)}</p>
                <p><strong>Posts:</strong> ${posts.length}</p>
            </div>
        `;
    }).join('');
}

// 유틸리티 함수들
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US') + ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
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

// 모달 외부 클릭 시 닫기
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

