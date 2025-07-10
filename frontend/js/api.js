// API communication layer for TMSITI frontend

class ApiClient {
    constructor() {
        this.baseURL = CONFIG.API_BASE_URL;
        this.cache = new Map();
        this.retryCount = 0;
    }

    // Generic HTTP request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        // Add language header if available
        const currentLanguage = getCurrentLanguage();
        if (currentLanguage) {
            defaultOptions.headers['Accept-Language'] = currentLanguage;
        }

        const finalOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, finalOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            this.retryCount = 0; // Reset retry count on success
            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            
            // Retry logic for network errors
            if (this.retryCount < CONFIG.MAX_RETRIES && this.shouldRetry(error)) {
                this.retryCount++;
                await this.delay(CONFIG.RETRY_DELAY * this.retryCount);
                return this.request(endpoint, options);
            }
            
            throw error;
        }
    }

    // GET request with caching
    async get(endpoint, useCache = true) {
        const cacheKey = `GET:${endpoint}`;
        
        if (useCache && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < CONFIG.CACHE_DURATION) {
                return cached.data;
            }
        }

        const data = await this.request(endpoint, { method: 'GET' });
        
        if (useCache) {
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });
        }
        
        return data;
    }

    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // File upload
    async uploadFile(endpoint, formData) {
        return this.request(endpoint, {
            method: 'POST',
            body: formData,
            headers: {} // Let browser set Content-Type for FormData
        });
    }

    // Helper methods
    shouldRetry(error) {
        return error.name === 'TypeError' || // Network error
               error.message.includes('fetch');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    clearCache() {
        this.cache.clear();
    }

    invalidateCache(pattern) {
        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        }
    }
}

// API service class with specific endpoints
class ApiService {
    constructor() {
        this.client = new ApiClient();
    }

    // News endpoints
    async getNews(page = 1, pageSize = CONFIG.DEFAULT_PAGE_SIZE, featured = null) {
        let endpoint = `/news?page=${page}&page_size=${pageSize}`;
        if (featured !== null) {
            endpoint += `&is_featured=${featured}`;
        }
        return this.client.get(endpoint);
    }

    async getNewsById(id) {
        return this.client.get(`/news/${id}`);
    }

    // Announcements endpoints
    async getAnnouncements(page = 1, pageSize = CONFIG.DEFAULT_PAGE_SIZE) {
        return this.client.get(`/announcements?page=${page}&page_size=${pageSize}`);
    }

    async getAnnouncementById(id) {
        return this.client.get(`/announcements/${id}`);
    }

    // Institute endpoints
    async getAbout() {
        return this.client.get('/institute/about');
    }

    async getManagement() {
        return this.client.get('/institute/management');
    }

    async getStructure() {
        return this.client.get('/institute/structure');
    }

    async getStructuralDivisions() {
        return this.client.get('/institute/structural-divisions');
    }

    async getVacancies() {
        return this.client.get('/institute/vacancies');
    }

    // Regulations endpoints
    async getLaws(page = 1, pageSize = CONFIG.DEFAULT_PAGE_SIZE) {
        return this.client.get(`/regulations/laws?page=${page}&page_size=${pageSize}`);
    }

    async getStandards(page = 1, pageSize = CONFIG.DEFAULT_PAGE_SIZE) {
        return this.client.get(`/regulations/standards?page=${page}&page_size=${pageSize}`);
    }

    async getBuildingRegulations(page = 1, pageSize = CONFIG.DEFAULT_PAGE_SIZE) {
        return this.client.get(`/regulations/building?page=${page}&page_size=${pageSize}`);
    }

    async getUrbanNorms(page = 1, pageSize = CONFIG.DEFAULT_PAGE_SIZE) {
        return this.client.get(`/regulations/urban-norms?page=${page}&page_size=${pageSize}`);
    }

    async getReferences(page = 1, pageSize = CONFIG.DEFAULT_PAGE_SIZE) {
        return this.client.get(`/regulations/references?page=${page}&page_size=${pageSize}`);
    }

    // Activities endpoints
    async getManagementSystem() {
        return this.client.get('/activities/management-system');
    }

    async getLaboratory() {
        return this.client.get('/activities/laboratory');
    }

    // Contact endpoints
    async submitContactForm(data) {
        return this.client.post('/contact/inquiry', data);
    }

    async getAntiCorruption() {
        return this.client.get('/contact/anti-corruption');
    }

    // Search endpoint
    async search(query, category = null, page = 1, pageSize = CONFIG.DEFAULT_PAGE_SIZE) {
        let endpoint = `/search?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`;
        if (category) {
            endpoint += `&category=${category}`;
        }
        return this.client.get(endpoint, false); // Don't cache search results
    }

    // Health check
    async healthCheck() {
        return this.client.get('/health', false);
    }
}

// Global API service instance
const api = new ApiService();

// Helper functions
function getCurrentLanguage() {
    return localStorage.getItem(CONFIG.LANGUAGE_STORAGE_KEY) || CONFIG.DEFAULT_LANGUAGE;
}

function handleApiError(error, fallbackMessage = CONFIG.ERROR_MESSAGES.GENERIC_ERROR) {
    console.error('API Error:', error);
    
    let message = fallbackMessage;
    
    if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
        message = CONFIG.ERROR_MESSAGES.NETWORK_ERROR;
    } else if (error.message.includes('500')) {
        message = CONFIG.ERROR_MESSAGES.SERVER_ERROR;
    } else if (error.message.includes('404')) {
        message = CONFIG.ERROR_MESSAGES.NOT_FOUND;
    } else if (error.message.includes('400')) {
        message = CONFIG.ERROR_MESSAGES.VALIDATION_ERROR;
    }
    
    showNotification(message, 'error');
    return message;
}

// Notification helper (will be implemented in components.js)
function showNotification(message, type = 'info') {
    // This will be implemented in components.js
    console.log(`${type.toUpperCase()}: ${message}`);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ApiClient, ApiService, api, handleApiError };
}