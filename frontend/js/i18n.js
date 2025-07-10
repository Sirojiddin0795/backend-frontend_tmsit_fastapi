// Internationalization (i18n) for TMSITI frontend

class I18n {
    constructor() {
        this.currentLanguage = CONFIG.DEFAULT_LANGUAGE;
        this.translations = {};
        this.fallbackLanguage = 'uz';
        this.loadedLanguages = new Set();
    }

    async init() {
        // Load saved language from localStorage
        const savedLanguage = localStorage.getItem(CONFIG.LANGUAGE_STORAGE_KEY);
        if (savedLanguage && CONFIG.SUPPORTED_LANGUAGES.includes(savedLanguage)) {
            this.currentLanguage = savedLanguage;
        }

        // Load translation files
        await this.loadLanguage(this.currentLanguage);
        
        // Set initial UI language
        this.updateUI();
        this.updateLanguageSelector();
    }

    async loadLanguage(lang) {
        if (this.loadedLanguages.has(lang)) {
            return;
        }

        try {
            // In a real implementation, you would load from the backend API
            // For now, we'll define translations inline
            const translations = await this.getTranslations(lang);
            this.translations[lang] = translations;
            this.loadedLanguages.add(lang);
        } catch (error) {
            console.error(`Failed to load language ${lang}:`, error);
            
            // Fallback to default language if not already trying it
            if (lang !== this.fallbackLanguage) {
                await this.loadLanguage(this.fallbackLanguage);
            }
        }
    }

    async getTranslations(lang) {
        // This would typically fetch from /api/v1/localization/{lang}
        // For demo purposes, we'll define inline translations
        const translations = {
            uz: {
                site: {
                    title: "TMSITI",
                    subtitle: "Texnik me'yorlashtirish va standartlashtirish ilmiy tadqiqot instituti"
                },
                menu: {
                    home: "Bosh sahifa",
                    institute: "Institut",
                    about: "Institut haqida",
                    management: "Rahbariyat",
                    structure: "Tuzilma",
                    vacancies: "Vakansiyalar",
                    normative_documents: "Normativ hujjatlar",
                    laws: "Qonunlar va qarorlar",
                    standards: "Standartlar",
                    building_regulations: "Qurilish me'yorlari",
                    activity: "Faoliyat",
                    management_system: "Sertifikatlash",
                    laboratory: "Laboratoriya",
                    news: "Yangiliklar",
                    contact: "Aloqa"
                },
                hero: {
                    title: "Texnik me'yorlashtirish va standartlashtirish ilmiy tadqiqot instituti",
                    subtitle: "Sifat va xavfsizlik standartlari bo'yicha etakchi ilmiy markaz",
                    learn_more: "Batafsil",
                    contact: "Bog'lanish"
                },
                sections: {
                    news: "Yangiliklar",
                    about: "Institut haqida",
                    management: "Rahbariyat",
                    contact: "Aloqa"
                },
                contact: {
                    full_name: "To'liq ism",
                    email: "Email",
                    phone: "Telefon",
                    subject: "Mavzu",
                    message: "Xabar",
                    send: "Yuborish",
                    address: "Manzil"
                },
                footer: {
                    about: "Institut haqida",
                    description: "Texnik me'yorlashtirish va standartlashtirish sohasida ilmiy tadqiqotlar olib boruvchi yetakchi institut.",
                    quick_links: "Tezkor havolalar",
                    contact: "Aloqa",
                    rights: "Barcha huquqlar himoyalangan."
                },
                common: {
                    loading: "Yuklanmoqda...",
                    read_more: "Batafsil",
                    view_all: "Barchasini ko'rish",
                    back: "Orqaga",
                    next: "Keyingi",
                    previous: "Oldingi",
                    page: "Sahifa",
                    search: "Qidirish",
                    filter: "Filtr",
                    sort: "Tartiblash",
                    date: "Sana",
                    published: "Nashr etilgan",
                    updated: "Yangilangan"
                }
            },
            ru: {
                site: {
                    title: "TMSITI",
                    subtitle: "Научно-исследовательский институт технического нормирования и стандартизации"
                },
                menu: {
                    home: "Главная",
                    institute: "Институт",
                    about: "Об институте",
                    management: "Руководство",
                    structure: "Структура",
                    vacancies: "Вакансии",
                    normative_documents: "Нормативные документы",
                    laws: "Законы и постановления",
                    standards: "Стандарты",
                    building_regulations: "Строительные нормы",
                    activity: "Деятельность",
                    management_system: "Сертификация",
                    laboratory: "Лаборатория",
                    news: "Новости",
                    contact: "Контакты"
                },
                hero: {
                    title: "Научно-исследовательский институт технического нормирования и стандартизации",
                    subtitle: "Ведущий научный центр по стандартам качества и безопасности",
                    learn_more: "Подробнее",
                    contact: "Связаться"
                },
                sections: {
                    news: "Новости",
                    about: "Об институте",
                    management: "Руководство",
                    contact: "Контакты"
                },
                contact: {
                    full_name: "Полное имя",
                    email: "Email",
                    phone: "Телефон",
                    subject: "Тема",
                    message: "Сообщение",
                    send: "Отправить",
                    address: "Адрес"
                },
                footer: {
                    about: "Об институте",
                    description: "Ведущий институт, проводящий научные исследования в области технического нормирования и стандартизации.",
                    quick_links: "Быстрые ссылки",
                    contact: "Контакты",
                    rights: "Все права защищены."
                },
                common: {
                    loading: "Загрузка...",
                    read_more: "Подробнее",
                    view_all: "Посмотреть все",
                    back: "Назад",
                    next: "Следующий",
                    previous: "Предыдущий",
                    page: "Страница",
                    search: "Поиск",
                    filter: "Фильтр",
                    sort: "Сортировка",
                    date: "Дата",
                    published: "Опубликовано",
                    updated: "Обновлено"
                }
            },
            en: {
                site: {
                    title: "TMSITI",
                    subtitle: "Technical Standardization and Research Institute"
                },
                menu: {
                    home: "Home",
                    institute: "Institute",
                    about: "About Institute",
                    management: "Management",
                    structure: "Structure",
                    vacancies: "Vacancies",
                    normative_documents: "Normative Documents",
                    laws: "Laws and Regulations",
                    standards: "Standards",
                    building_regulations: "Building Regulations",
                    activity: "Activity",
                    management_system: "Certification",
                    laboratory: "Laboratory",
                    news: "News",
                    contact: "Contact"
                },
                hero: {
                    title: "Technical Standardization and Research Institute",
                    subtitle: "Leading scientific center for quality and safety standards",
                    learn_more: "Learn More",
                    contact: "Contact Us"
                },
                sections: {
                    news: "News",
                    about: "About Institute",
                    management: "Management",
                    contact: "Contact"
                },
                contact: {
                    full_name: "Full Name",
                    email: "Email",
                    phone: "Phone",
                    subject: "Subject",
                    message: "Message",
                    send: "Send",
                    address: "Address"
                },
                footer: {
                    about: "About Institute",
                    description: "Leading institute conducting scientific research in the field of technical standardization.",
                    quick_links: "Quick Links",
                    contact: "Contact",
                    rights: "All rights reserved."
                },
                common: {
                    loading: "Loading...",
                    read_more: "Read More",
                    view_all: "View All",
                    back: "Back",
                    next: "Next",
                    previous: "Previous",
                    page: "Page",
                    search: "Search",
                    filter: "Filter",
                    sort: "Sort",
                    date: "Date",
                    published: "Published",
                    updated: "Updated"
                }
            }
        };

        return translations[lang] || translations[this.fallbackLanguage];
    }

    async setLanguage(lang) {
        if (!CONFIG.SUPPORTED_LANGUAGES.includes(lang)) {
            console.warn(`Language ${lang} is not supported`);
            return;
        }

        this.currentLanguage = lang;
        localStorage.setItem(CONFIG.LANGUAGE_STORAGE_KEY, lang);

        // Load language if not already loaded
        await this.loadLanguage(lang);

        // Update UI
        this.updateUI();
        this.updateLanguageSelector();

        // Clear API cache to refetch data in new language
        if (typeof api !== 'undefined') {
            api.client.clearCache();
        }

        // Trigger language change event
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
    }

    t(key, variables = {}) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];

        // Navigate through the nested object
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                // Fallback to default language
                value = this.translations[this.fallbackLanguage];
                for (const fallbackKey of keys) {
                    if (value && typeof value === 'object' && fallbackKey in value) {
                        value = value[fallbackKey];
                    } else {
                        return key; // Return key if translation not found
                    }
                }
                break;
            }
        }

        if (typeof value !== 'string') {
            return key;
        }

        // Replace variables in translation
        return this.replaceVariables(value, variables);
    }

    replaceVariables(text, variables) {
        return text.replace(/\{([^}]+)\}/g, (match, key) => {
            return variables[key] !== undefined ? variables[key] : match;
        });
    }

    updateUI() {
        // Update all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
    }

    updateLanguageSelector() {
        const selector = document.getElementById('languageSelect');
        if (selector) {
            selector.value = this.currentLanguage;
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getSupportedLanguages() {
        return CONFIG.SUPPORTED_LANGUAGES;
    }

    // Format date according to current language
    formatDate(date, options = {}) {
        const locale = this.getLocale();
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(date);
    }

    // Format number according to current language
    formatNumber(number, options = {}) {
        const locale = this.getLocale();
        return new Intl.NumberFormat(locale, options).format(number);
    }

    getLocale() {
        const localeMap = {
            uz: 'uz-UZ',
            ru: 'ru-RU',
            en: 'en-US'
        };
        return localeMap[this.currentLanguage] || 'uz-UZ';
    }

    // Get text direction for current language
    getDirection() {
        // All supported languages are LTR
        return 'ltr';
    }
}

// Global i18n instance
const i18n = new I18n();

// Convenience function for translations
function t(key, variables) {
    return i18n.t(key, variables);
}

// Initialize i18n when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { I18n, i18n, t };
}