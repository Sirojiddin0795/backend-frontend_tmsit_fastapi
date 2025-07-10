// Main application logic for TMSITI frontend

class App {
    constructor() {
        this.currentSection = 'home';
        this.pagination = {};
        this.cache = new Map();
        this.searchDebounce = null;
    }

    async init() {
        try {
            // Initialize components
            await this.setupEventListeners();
            await this.loadInitialData();
            this.setupNavigation();
            this.setupLanguageSelector();
            this.setupMobileMenu();
            this.setupContactForm();
            this.setupSmoothScrolling();
            
            // Load initial section based on URL hash
            this.handleHashChange();
            
            console.log('TMSITI App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            showNotification(CONFIG.ERROR_MESSAGES.GENERIC_ERROR, 'error');
        }
    }

    async setupEventListeners() {
        // Language change listener
        document.addEventListener('languageChanged', (e) => {
            this.handleLanguageChange(e.detail.language);
        });

        // Hash change listener for navigation
        window.addEventListener('hashchange', () => {
            this.handleHashChange();
        });

        // Intersection Observer for animations
        this.setupScrollAnimations();

        // Search functionality
        this.setupSearch();
    }

    setupLanguageSelector() {
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                i18n.setLanguage(e.target.value);
            });
        }
    }

    setupMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on links
            navMenu.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    navMenu.classList.remove('active');
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                }
            });
        }
    }

    setupNavigation() {
        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.navigateToSection(target);
            }
        });
    }

    setupSmoothScrolling() {
        // Add smooth scrolling behavior
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements that should animate
        document.querySelectorAll('.news-card, .management-card, .section-title').forEach(el => {
            observer.observe(el);
        });
    }

    setupSearch() {
        // This would be implemented if there's a search input
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                clearTimeout(this.searchDebounce);
                this.searchDebounce = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, CONFIG.SEARCH_DEBOUNCE);
            });
        }
    }

    async performSearch(query) {
        if (query.length < CONFIG.SEARCH_MIN_LENGTH) {
            return;
        }

        try {
            const results = await api.search(query);
            this.displaySearchResults(results);
        } catch (error) {
            console.error('Search failed:', error);
        }
    }

    displaySearchResults(results) {
        // Implementation for search results display
        console.log('Search results:', results);
    }

    async loadInitialData() {
        const loader = showLoading();
        
        try {
            // Load featured news for home page
            await this.loadNews(1, 3, true);
            
            // Load other initial data
            await Promise.all([
                this.loadAbout(),
                this.loadManagement()
            ]);
            
        } catch (error) {
            console.error('Failed to load initial data:', error);
            showNotification(CONFIG.ERROR_MESSAGES.NETWORK_ERROR, 'error');
        } finally {
            loader.hide();
        }
    }

    async loadNews(page = 1, pageSize = CONFIG.DEFAULT_PAGE_SIZE, featured = null) {
        try {
            const response = await api.getNews(page, pageSize, featured);
            this.displayNews(response.items || response.data || []);
            
            if (response.total && response.page_size) {
                this.setupNewsPagination(response);
            }
            
            return response;
        } catch (error) {
            console.error('Failed to load news:', error);
            this.displayNewsError();
            throw error;
        }
    }

    displayNews(newsItems) {
        const newsGrid = document.getElementById('newsGrid');
        const newsLoading = document.getElementById('newsLoading');
        
        if (newsLoading) {
            newsLoading.style.display = 'none';
        }

        if (!newsGrid) return;

        if (newsItems.length === 0) {
            newsGrid.innerHTML = `
                <div class="no-content">
                    <i class="fas fa-newspaper"></i>
                    <p>${t('common.no_results')}</p>
                </div>
            `;
            return;
        }

        newsGrid.innerHTML = newsItems.map(news => this.createNewsCard(news)).join('');
    }

    createNewsCard(news) {
        const publishedDate = new Date(news.published_date || news.created_at);
        const formattedDate = i18n.formatDate(publishedDate);
        
        // Get localized content based on current language
        const lang = i18n.getCurrentLanguage();
        const title = news[`title_${lang}`] || news.title || 'No title';
        const content = news[`content_${lang}`] || news.content || '';
        const excerpt = content.length > 150 ? content.substring(0, 150) + '...' : content;
        
        return `
            <article class="news-card" data-id="${news.id}">
                <img src="${news.image_path || '/static/default/no-image.svg'}" 
                     alt="${title}" 
                     onerror="this.src='/static/default/no-image.svg'">
                <div class="news-card-content">
                    <h3>${title}</h3>
                    <p>${excerpt}</p>
                    <div class="news-card-meta">
                        <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
                        ${news.is_featured ? `<span class="featured-badge">${t('common.featured')}</span>` : ''}
                    </div>
                </div>
            </article>
        `;
    }

    displayNewsError() {
        const newsGrid = document.getElementById('newsGrid');
        const newsLoading = document.getElementById('newsLoading');
        
        if (newsLoading) {
            newsLoading.style.display = 'none';
        }

        if (newsGrid) {
            newsGrid.innerHTML = `
                <div class="error-content">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${CONFIG.ERROR_MESSAGES.NETWORK_ERROR}</p>
                    <button onclick="app.loadNews()" class="btn btn-primary">${t('common.retry')}</button>
                </div>
            `;
        }
    }

    setupNewsPagination(response) {
        const paginationContainer = document.getElementById('newsPagination');
        if (!paginationContainer) return;

        if (!this.pagination.news) {
            this.pagination.news = new PaginationComponent(paginationContainer, {
                onPageChange: (page) => this.loadNews(page)
            });
        }

        const totalPages = Math.ceil(response.total / response.page_size);
        this.pagination.news.render(response.page, totalPages, response.total);
    }

    async loadAbout() {
        try {
            const about = await api.getAbout();
            this.displayAbout(about);
        } catch (error) {
            console.error('Failed to load about:', error);
            this.displayAboutError();
        }
    }

    displayAbout(about) {
        const aboutContent = document.getElementById('aboutContent');
        if (!aboutContent) return;

        if (!about || about.length === 0) {
            aboutContent.innerHTML = `
                <div class="no-content">
                    <p>${t('common.no_content')}</p>
                </div>
            `;
            return;
        }

        const lang = i18n.getCurrentLanguage();
        const content = about[0]?.[`content_${lang}`] || about[0]?.content || '';

        aboutContent.innerHTML = `
            <div class="about-text">
                <p>${content}</p>
                ${about[0]?.certificate_pdf_path ? `
                    <div class="certificate-link">
                        <a href="${about[0].certificate_pdf_path}" target="_blank" class="btn btn-primary">
                            <i class="fas fa-certificate"></i>
                            ${t('common.view_certificate')}
                        </a>
                    </div>
                ` : ''}
            </div>
        `;
    }

    displayAboutError() {
        const aboutContent = document.getElementById('aboutContent');
        if (aboutContent) {
            aboutContent.innerHTML = `
                <div class="error-content">
                    <p>${CONFIG.ERROR_MESSAGES.NETWORK_ERROR}</p>
                    <button onclick="app.loadAbout()" class="btn btn-primary">${t('common.retry')}</button>
                </div>
            `;
        }
    }

    async loadManagement() {
        try {
            const management = await api.getManagement();
            this.displayManagement(management);
        } catch (error) {
            console.error('Failed to load management:', error);
            this.displayManagementError();
        }
    }

    displayManagement(managementList) {
        const managementGrid = document.getElementById('managementGrid');
        if (!managementGrid) return;

        managementGrid.querySelector('.loading')?.remove();

        if (!managementList || managementList.length === 0) {
            managementGrid.innerHTML = `
                <div class="no-content">
                    <p>${t('common.no_content')}</p>
                </div>
            `;
            return;
        }

        managementGrid.innerHTML = managementList
            .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
            .map(person => this.createManagementCard(person))
            .join('');
    }

    createManagementCard(person) {
        const lang = i18n.getCurrentLanguage();
        const fullName = person[`full_name_${lang}`] || person.full_name || 'Unknown';
        const position = person[`position_${lang}`] || person.position || '';
        const bio = person[`bio_${lang}`] || person.bio || '';

        return `
            <div class="management-card">
                <img src="${person.photo_path || '/static/default/no-image.svg'}" 
                     alt="${fullName}"
                     onerror="this.src='/static/default/no-image.svg'">
                <div class="management-card-content">
                    <h3>${fullName}</h3>
                    <p class="position">${position}</p>
                    ${bio ? `<p class="bio">${bio}</p>` : ''}
                    ${person.phone ? `<p class="contact"><i class="fas fa-phone"></i> ${person.phone}</p>` : ''}
                    ${person.email ? `<p class="contact"><i class="fas fa-envelope"></i> ${person.email}</p>` : ''}
                    ${person[`reception_days_${lang}`] ? `<p class="reception"><i class="fas fa-clock"></i> ${person[`reception_days_${lang}`]}</p>` : ''}
                </div>
            </div>
        `;
    }

    displayManagementError() {
        const managementGrid = document.getElementById('managementGrid');
        if (managementGrid) {
            managementGrid.innerHTML = `
                <div class="error-content">
                    <p>${CONFIG.ERROR_MESSAGES.NETWORK_ERROR}</p>
                    <button onclick="app.loadManagement()" class="btn btn-primary">${t('common.retry')}</button>
                </div>
            `;
        }
    }

    setupContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        const validator = new FormValidator(contactForm, {
            full_name: [
                FormValidator.validators.required,
                FormValidator.validators.minLength(CONFIG.FORM_VALIDATION.NAME_MIN_LENGTH)
            ],
            email: [
                FormValidator.validators.required,
                FormValidator.validators.email
            ],
            phone: [
                FormValidator.validators.phone
            ],
            message: [
                FormValidator.validators.required,
                FormValidator.validators.minLength(CONFIG.FORM_VALIDATION.MESSAGE_MIN_LENGTH)
            ]
        });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!validator.validate()) {
                return;
            }

            const loader = showLoading(contactForm, t('common.submitting'));
            
            try {
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData.entries());
                
                await api.submitContactForm(data);
                
                showNotification(CONFIG.SUCCESS_MESSAGES.FORM_SUBMITTED, 'success');
                contactForm.reset();
                
            } catch (error) {
                console.error('Contact form submission failed:', error);
                handleApiError(error, CONFIG.ERROR_MESSAGES.GENERIC_ERROR);
            } finally {
                loader.hide();
            }
        });
    }

    navigateToSection(sectionId) {
        this.currentSection = sectionId;
        window.location.hash = sectionId;
        
        // Load section-specific data if needed
        this.loadSectionData(sectionId);
    }

    async loadSectionData(sectionId) {
        switch (sectionId) {
            case 'news':
                if (!this.cache.has('news-loaded')) {
                    await this.loadNews();
                    this.cache.set('news-loaded', true);
                }
                break;
            case 'about':
                if (!this.cache.has('about-loaded')) {
                    await this.loadAbout();
                    this.cache.set('about-loaded', true);
                }
                break;
            case 'management':
                if (!this.cache.has('management-loaded')) {
                    await this.loadManagement();
                    this.cache.set('management-loaded', true);
                }
                break;
        }
    }

    handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash && hash !== this.currentSection) {
            this.navigateToSection(hash);
        }
    }

    async handleLanguageChange(newLanguage) {
        // Clear cache to reload data in new language
        this.cache.clear();
        
        // Reload current section data
        await this.loadSectionData(this.currentSection);
        
        // Update any dynamic content
        this.updateDynamicContent();
    }

    updateDynamicContent() {
        // Update dates and numbers to new locale
        document.querySelectorAll('[data-date]').forEach(el => {
            const date = new Date(el.getAttribute('data-date'));
            el.textContent = i18n.formatDate(date);
        });

        document.querySelectorAll('[data-number]').forEach(el => {
            const number = parseFloat(el.getAttribute('data-number'));
            el.textContent = i18n.formatNumber(number);
        });
    }

    // Utility methods
    showError(message) {
        showNotification(message, 'error');
    }

    showSuccess(message) {
        showNotification(message, 'success');
    }

    async refresh() {
        this.cache.clear();
        await this.loadInitialData();
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    window.app = new App();
    await window.app.init();
});

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}