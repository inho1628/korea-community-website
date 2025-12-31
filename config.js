// API Configuration
const API_CONFIG = {
    // Domain: www.reppinkr.com
    // Set to your domain when deploying
    baseURL: window.location.origin, // Automatically uses current domain (www.reppinkr.com when deployed)
    apiPath: '/api',
    
    // API Endpoints
    endpoints: {
        // Users
        users: '/users',
        login: '/auth/login',
        logout: '/auth/logout',
        
        // Posts
        posts: '/posts',
        post: (id) => `/posts/${id}`,
        likePost: (id) => `/posts/${id}/like`,
        
        // Galleries
        galleries: '/galleries',
        gallery: (id) => `/galleries/${id}`,
        galleryPosts: (id) => `/galleries/${id}/posts`,
        galleryApplications: '/gallery-applications',
        
        // Admin
        admin: {
            applications: '/admin/applications',
            approveApplication: (id) => `/admin/applications/${id}/approve`,
            rejectApplication: (id) => `/admin/applications/${id}/reject`,
            assignAdmins: (id) => `/admin/galleries/${id}/admins`,
            deletePost: (id) => `/admin/posts/${id}`
        }
    },
    
    // Use server API (set to true when server is ready)
    useServer: false
};

// Get full API URL
function getAPIUrl(endpoint) {
    if (API_CONFIG.useServer) {
        return `${API_CONFIG.baseURL}${API_CONFIG.apiPath}${endpoint}`;
    }
    return null; // Return null to use LocalStorage
}

