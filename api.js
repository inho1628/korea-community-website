// API Service Layer
// This file will handle all server API calls when server is ready

const API = {
    // Generic request handler
    async request(url, options = {}) {
        if (!API_CONFIG.useServer) {
            return null; // Use LocalStorage instead
        }
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    },
    
    // GET request
    async get(endpoint) {
        return this.request(getAPIUrl(endpoint), {
            method: 'GET'
        });
    },
    
    // POST request
    async post(endpoint, data) {
        return this.request(getAPIUrl(endpoint), {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    // PUT request
    async put(endpoint, data) {
        return this.request(getAPIUrl(endpoint), {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // DELETE request
    async delete(endpoint) {
        return this.request(getAPIUrl(endpoint), {
            method: 'DELETE'
        });
    },
    
    // Users API
    users: {
        async login(email, name, country) {
            return API.post(API_CONFIG.endpoints.login, { email, name, country });
        },
        
        async getCurrent() {
            return API.get(API_CONFIG.endpoints.users + '/me');
        },
        
        async getAll() {
            return API.get(API_CONFIG.endpoints.users);
        }
    },
    
    // Posts API
    posts: {
        async getAll(category = null, galleryId = null) {
            const params = new URLSearchParams();
            if (category) params.append('category', category);
            if (galleryId) params.append('galleryId', galleryId);
            const query = params.toString();
            return API.get(API_CONFIG.endpoints.posts + (query ? `?${query}` : ''));
        },
        
        async getById(id) {
            return API.get(API_CONFIG.endpoints.post(id));
        },
        
        async create(postData) {
            return API.post(API_CONFIG.endpoints.posts, postData);
        },
        
        async like(id) {
            return API.post(API_CONFIG.endpoints.likePost(id));
        },
        
        async delete(id) {
            return API.delete(API_CONFIG.endpoints.post(id));
        }
    },
    
    // Galleries API
    galleries: {
        async getAll() {
            return API.get(API_CONFIG.endpoints.galleries);
        },
        
        async getById(id) {
            return API.get(API_CONFIG.endpoints.gallery(id));
        },
        
        async getPosts(id) {
            return API.get(API_CONFIG.endpoints.galleryPosts(id));
        },
        
        async applyApplication(country, description) {
            return API.post(API_CONFIG.endpoints.galleryApplications, {
                country,
                description
            });
        }
    },
    
    // Admin API
    admin: {
        async getApplications() {
            return API.get(API_CONFIG.endpoints.admin.applications);
        },
        
        async approveApplication(id, admins = []) {
            return API.post(API_CONFIG.endpoints.admin.approveApplication(id), { admins });
        },
        
        async rejectApplication(id) {
            return API.post(API_CONFIG.endpoints.admin.rejectApplication(id));
        },
        
        async assignAdmins(galleryId, admins) {
            return API.put(API_CONFIG.endpoints.admin.assignAdmins(galleryId), { admins });
        },
        
        async deletePost(id) {
            return API.delete(API_CONFIG.endpoints.admin.deletePost(id));
        }
    }
};

