// Reusable UI components for TMSITI frontend

class NotificationManager {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }

    init() {
        // Create notification container
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 5000) {
        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);
        this.notifications.push(notification);

        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(() => {
                this.hide(notification);
            }, duration);
        }

        return notification;
    }

    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${this.getBackgroundColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            margin-bottom: 0.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-medium);
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;

        const icon = document.createElement('i');
        icon.className = this.getIcon(type);
        
        const text = document.createElement('span');
        text.textContent = message;

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            margin-left: auto;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        closeButton.onclick = () => this.hide(notification);

        notification.appendChild(icon);
        notification.appendChild(text);
        notification.appendChild(closeButton);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);

        return notification;
    }

    hide(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications = this.notifications.filter(n => n !== notification);
        }, 300);
    }

    getBackgroundColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }

    getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    clear() {
        this.notifications.forEach(notification => this.hide(notification));
    }
}

class LoadingManager {
    constructor() {
        this.activeLoaders = new Set();
        this.overlay = null;
    }

    show(target = null, message = null) {
        if (target) {
            return this.showLocal(target, message);
        } else {
            return this.showGlobal(message);
        }
    }

    showLocal(target, message) {
        const loader = document.createElement('div');
        loader.className = 'local-loading';
        loader.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 1rem;
            z-index: 100;
        `;

        const spinner = document.createElement('i');
        spinner.className = 'fas fa-spinner fa-spin';
        spinner.style.fontSize = '2rem';
        spinner.style.color = 'var(--primary-color)';

        loader.appendChild(spinner);

        if (message) {
            const text = document.createElement('p');
            text.textContent = message;
            text.style.margin = '0';
            text.style.color = 'var(--text-primary)';
            loader.appendChild(text);
        }

        // Make target relative if not already positioned
        const computedStyle = window.getComputedStyle(target);
        if (computedStyle.position === 'static') {
            target.style.position = 'relative';
        }

        target.appendChild(loader);
        this.activeLoaders.add(loader);

        return {
            hide: () => this.hide(loader)
        };
    }

    showGlobal(message) {
        if (!this.overlay) {
            this.overlay = document.getElementById('loadingOverlay');
        }

        if (this.overlay) {
            if (message) {
                const messageElement = this.overlay.querySelector('p');
                if (messageElement) {
                    messageElement.textContent = message;
                }
            }
            this.overlay.classList.add('active');
        }

        return {
            hide: () => this.hideGlobal()
        };
    }

    hide(loader) {
        if (loader && loader.parentNode) {
            loader.parentNode.removeChild(loader);
            this.activeLoaders.delete(loader);
        }
    }

    hideGlobal() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
    }

    hideAll() {
        this.activeLoaders.forEach(loader => this.hide(loader));
        this.hideGlobal();
    }
}

class PaginationComponent {
    constructor(container, options = {}) {
        this.container = container;
        this.currentPage = 1;
        this.totalPages = 1;
        this.pageSize = options.pageSize || CONFIG.DEFAULT_PAGE_SIZE;
        this.onPageChange = options.onPageChange || (() => {});
        this.maxVisiblePages = options.maxVisiblePages || 5;
    }

    render(currentPage, totalPages, totalItems = 0) {
        this.currentPage = currentPage;
        this.totalPages = totalPages;

        if (totalPages <= 1) {
            this.container.innerHTML = '';
            return;
        }

        const pagination = document.createElement('div');
        pagination.className = 'pagination';

        // Previous button
        const prevButton = this.createButton('‹', currentPage - 1, currentPage === 1);
        prevButton.setAttribute('aria-label', t('common.previous'));
        pagination.appendChild(prevButton);

        // Page numbers
        const pageNumbers = this.getVisiblePages();
        pageNumbers.forEach(page => {
            if (page === '...') {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.style.cssText = `
                    padding: 0.5rem 1rem;
                    color: var(--text-secondary);
                `;
                pagination.appendChild(ellipsis);
            } else {
                const button = this.createButton(page, page, false, page === currentPage);
                pagination.appendChild(button);
            }
        });

        // Next button
        const nextButton = this.createButton('›', currentPage + 1, currentPage === totalPages);
        nextButton.setAttribute('aria-label', t('common.next'));
        pagination.appendChild(nextButton);

        // Page info
        if (totalItems > 0) {
            const info = document.createElement('div');
            info.className = 'pagination-info';
            info.style.cssText = `
                margin-top: 1rem;
                text-align: center;
                color: var(--text-secondary);
                font-size: 0.9rem;
            `;
            
            const startItem = (currentPage - 1) * this.pageSize + 1;
            const endItem = Math.min(currentPage * this.pageSize, totalItems);
            
            info.textContent = `${t('common.showing')} ${startItem}-${endItem} ${t('common.of')} ${totalItems}`;
            pagination.appendChild(info);
        }

        this.container.innerHTML = '';
        this.container.appendChild(pagination);
    }

    createButton(text, page, disabled = false, active = false) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = `pagination-button ${active ? 'active' : ''}`;
        button.disabled = disabled;
        
        if (!disabled && !active) {
            button.addEventListener('click', () => {
                this.onPageChange(page);
            });
        }

        return button;
    }

    getVisiblePages() {
        const pages = [];
        const half = Math.floor(this.maxVisiblePages / 2);
        let start = Math.max(1, this.currentPage - half);
        let end = Math.min(this.totalPages, start + this.maxVisiblePages - 1);

        // Adjust start if we're near the end
        if (end - start + 1 < this.maxVisiblePages) {
            start = Math.max(1, end - this.maxVisiblePages + 1);
        }

        // Add first page and ellipsis if needed
        if (start > 1) {
            pages.push(1);
            if (start > 2) {
                pages.push('...');
            }
        }

        // Add visible pages
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Add ellipsis and last page if needed
        if (end < this.totalPages) {
            if (end < this.totalPages - 1) {
                pages.push('...');
            }
            pages.push(this.totalPages);
        }

        return pages;
    }
}

class FormValidator {
    constructor(form, rules = {}) {
        this.form = form;
        this.rules = rules;
        this.errors = {};
    }

    validate() {
        this.errors = {};
        const formData = new FormData(this.form);

        for (const [field, validators] of Object.entries(this.rules)) {
            const value = formData.get(field);
            const fieldErrors = [];

            for (const validator of validators) {
                const result = validator(value);
                if (result !== true) {
                    fieldErrors.push(result);
                }
            }

            if (fieldErrors.length > 0) {
                this.errors[field] = fieldErrors;
            }
        }

        this.displayErrors();
        return Object.keys(this.errors).length === 0;
    }

    displayErrors() {
        // Clear previous errors
        this.form.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
        this.form.querySelectorAll('.field-error').forEach(el => {
            el.remove();
        });

        // Display new errors
        for (const [field, fieldErrors] of Object.entries(this.errors)) {
            const input = this.form.querySelector(`[name="${field}"]`);
            if (input) {
                const formGroup = input.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.add('error');
                    
                    const errorElement = document.createElement('div');
                    errorElement.className = 'field-error error';
                    errorElement.textContent = fieldErrors[0]; // Show first error
                    formGroup.appendChild(errorElement);
                }
            }
        }
    }

    static validators = {
        required: (value) => {
            return value && value.trim() !== '' ? true : t('validation.required_field');
        },
        
        email: (value) => {
            if (!value) return true; // Optional field
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value) ? true : t('validation.invalid_email');
        },
        
        phone: (value) => {
            if (!value) return true; // Optional field
            return CONFIG.FORM_VALIDATION.PHONE_PATTERN.test(value) ? true : t('validation.invalid_phone');
        },
        
        minLength: (min) => (value) => {
            if (!value) return true; // Optional field
            return value.length >= min ? true : t('validation.min_length', { min });
        },
        
        maxLength: (max) => (value) => {
            if (!value) return true; // Optional field
            return value.length <= max ? true : t('validation.max_length', { max });
        }
    };
}

class ModalManager {
    constructor() {
        this.activeModal = null;
        this.overlay = null;
        this.init();
    }

    init() {
        // Create modal overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            padding: 1rem;
        `;

        // Close on overlay click
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hide();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.hide();
            }
        });

        document.body.appendChild(this.overlay);
    }

    show(content, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            background: white;
            border-radius: var(--border-radius);
            max-width: ${options.width || '500px'};
            max-height: 90vh;
            overflow-y: auto;
            transform: scale(0.9);
            transition: transform 0.3s ease;
            box-shadow: var(--shadow-heavy);
        `;

        if (typeof content === 'string') {
            modal.innerHTML = content;
        } else {
            modal.appendChild(content);
        }

        this.overlay.appendChild(modal);
        this.activeModal = modal;

        // Show modal
        this.overlay.style.opacity = '1';
        this.overlay.style.visibility = 'visible';
        
        setTimeout(() => {
            modal.style.transform = 'scale(1)';
        }, 10);

        // Focus management
        const focusableElements = modal.querySelectorAll('button, input, textarea, select, a[href]');
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }

        return {
            hide: () => this.hide(),
            modal
        };
    }

    hide() {
        if (!this.activeModal) return;

        this.activeModal.style.transform = 'scale(0.9)';
        this.overlay.style.opacity = '0';
        this.overlay.style.visibility = 'hidden';

        setTimeout(() => {
            if (this.activeModal && this.activeModal.parentNode) {
                this.activeModal.parentNode.removeChild(this.activeModal);
            }
            this.activeModal = null;
        }, 300);
    }
}

// Global instances
const notificationManager = new NotificationManager();
const loadingManager = new LoadingManager();
const modalManager = new ModalManager();

// Global helper functions
function showNotification(message, type = 'info', duration = 5000) {
    return notificationManager.show(message, type, duration);
}

function showLoading(target = null, message = null) {
    return loadingManager.show(target, message);
}

function hideLoading() {
    loadingManager.hideAll();
}

function showModal(content, options = {}) {
    return modalManager.show(content, options);
}

function hideModal() {
    modalManager.hide();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NotificationManager,
        LoadingManager,
        PaginationComponent,
        FormValidator,
        ModalManager,
        showNotification,
        showLoading,
        hideLoading,
        showModal,
        hideModal
    };
}