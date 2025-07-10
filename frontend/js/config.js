// Configuration settings for the TMSITI frontend application

const CONFIG = {
    // API Configuration
    API_BASE_URL: window.location.protocol + '//' + window.location.hostname + ':5000/api/v1',
    
    // Default language
    DEFAULT_LANGUAGE: 'uz',
    
    // Supported languages
    SUPPORTED_LANGUAGES: ['uz', 'ru', 'en'],
    
    // Pagination settings
    DEFAULT_PAGE_SIZE: 6,
    MAX_PAGE_SIZE: 20,
    
    // File upload settings
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    
    // Animation settings
    SCROLL_OFFSET: 80,
    ANIMATION_DURATION: 300,
    
    // Error retry settings
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    
    // Cache settings
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    
    // UI settings
    MOBILE_BREAKPOINT: 768,
    TABLET_BREAKPOINT: 992,
    
    // Contact form settings
    FORM_VALIDATION: {
        NAME_MIN_LENGTH: 2,
        MESSAGE_MIN_LENGTH: 10,
        PHONE_PATTERN: /^[\+]?[0-9\s\-\(\)]{7,15}$/
    },
    
    // Search settings
    SEARCH_MIN_LENGTH: 3,
    SEARCH_DEBOUNCE: 500,
    
    // Theme settings
    THEME_STORAGE_KEY: 'tmsiti_theme',
    LANGUAGE_STORAGE_KEY: 'tmsiti_language',
    
    // Social media links (if needed)
    SOCIAL_LINKS: {
        facebook: '',
        telegram: '',
        instagram: '',
        youtube: ''
    },
    
    // Feature flags
    FEATURES: {
        DARK_MODE: false,
        SEARCH: true,
        COMMENTS: false,
        SHARING: false,
        ANALYTICS: false
    },
    
    // Error messages
    ERROR_MESSAGES: {
        NETWORK_ERROR: 'Tarmoq xatosi. Qaytadan urinib ko\'ring.',
        SERVER_ERROR: 'Server xatosi. Keyinroq urinib ko\'ring.',
        NOT_FOUND: 'Ma\'lumot topilmadi.',
        VALIDATION_ERROR: 'Ma\'lumotlarni to\'g\'ri kiriting.',
        GENERIC_ERROR: 'Xato yuz berdi. Qaytadan urinib ko\'ring.'
    },
    
    // Success messages
    SUCCESS_MESSAGES: {
        FORM_SUBMITTED: 'Xabaringiz muvaffaqiyatli yuborildi.',
        DATA_SAVED: 'Ma\'lumotlar saqlandi.',
        ACTION_COMPLETED: 'Amal bajarildi.'
    },
    
    // Loading messages
    LOADING_MESSAGES: {
        DEFAULT: 'Yuklanmoqda...',
        SUBMITTING: 'Yuborilmoqda...',
        PROCESSING: 'Qayta ishlanmoqda...'
    }
};

// Environment-specific configurations
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    CONFIG.API_BASE_URL = 'http://localhost:5000/api/v1';
    CONFIG.FEATURES.ANALYTICS = false;
} else {
    // Production settings
    CONFIG.FEATURES.ANALYTICS = true;
}

// Freeze the configuration to prevent modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.FORM_VALIDATION);
Object.freeze(CONFIG.SOCIAL_LINKS);
Object.freeze(CONFIG.FEATURES);
Object.freeze(CONFIG.ERROR_MESSAGES);
Object.freeze(CONFIG.SUCCESS_MESSAGES);
Object.freeze(CONFIG.LOADING_MESSAGES);

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}