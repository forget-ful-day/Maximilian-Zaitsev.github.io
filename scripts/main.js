// Основной JavaScript файл
class PortfolioApp {
    constructor() {
        this.currentPage = 'index';
        this.siteData = null;
        this.init();
    }

    async init() {
        await this.loadSiteData();
        this.setupEventListeners();
        this.trackAnalytics();
        
        // ВАЖНО: Отключаем редактирование на обычных страницах
        // Редактирование включается только в editor.html
        this.disableEditing();
        console.log('Портфолио загружено. Режим просмотра.');
    }

    // Отключаем редактирование на обычных страницах
    disableEditing() {
        // Убираем contenteditable со всех элементов
        document.querySelectorAll('[data-editable="true"]').forEach(element => {
            element.removeAttribute('contenteditable');
            element.style.outline = 'none';
            element.style.cursor = 'default';
        });
        
        // Убираем класс edit-mode если есть
        document.body.classList.remove('edit-mode');
    }

    // Загрузка данных сайта из JSON
    async loadSiteData() {
        try {
            const response = await fetch('./data/site-content.json');
            this.siteData = await response.json();
            this.applySiteData();
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            // Создаем базовую структуру если файла нет
            this.siteData = this.getDefaultData();
        }
    }

    getDefaultData() {
        return {
            site: {
                title: "Иван Петров - Портфолио",
                theme: "dark",
                language: "ru"
            },
            pages: {
                index: {
                    heroTitle: "Привет, я <span class='highlight'>Иван Петров</span>",
                    heroSubtitle: "Fullstack разработчик & Дизайнер",
                    heroDescription: "Создаю современные веб-приложения с фокусом на пользовательский опыт и производительность",
                    projectsCount: "12",
                    experienceYears: "3+",
                    happyClients: "24"
                }
            },
            analytics: {
                totalVisitors: 0,
                pageViews: {}
            }
        };
    }

    // Применение загруженных данных
    applySiteData() {
        // Применяем тему
        if (this.siteData.site.theme) {
            document.documentElement.setAttribute('data-theme', this.siteData.site.theme);
        }
        
        // Заполняем контент данными
        this.fillContent();
    }

    // Заполнение контента данными
    fillContent() {
        // Заполняем элементы данными из siteData
        this.fillEditableElements();
    }

    // Заполнение редактируемых элементов
    fillEditableElements() {
        document.querySelectorAll('[data-editable="true"]').forEach(element => {
            const contentId = element.getAttribute('data-content-id');
            const contentType = element.getAttribute('data-content-type') || 'text';
            
            if (contentType === 'image') {
                const img = element.querySelector('img');
                if (img && this.siteData.pages[this.currentPage]?.[contentId]) {
                    img.src = this.siteData.pages[this.currentPage][contentId];
                }
            } else {
                const content = this.getContentById(contentId);
                if (content && element.innerHTML !== content) {
                    element.innerHTML = content;
                }
            }
        });
    }

    // Получение контента по ID
    getContentById(contentId) {
        // Ищем в текущей странице
        if (this.siteData.pages[this.currentPage]?.[contentId]) {
            return this.siteData.pages[this.currentPage][contentId];
        }
        
        // Ищем в общих настройках
        if (this.siteData.site[contentId]) {
            return this.siteData.site[contentId];
        }
        
        return null;
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Мобильное меню
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        if (mobileBtn) {
            mobileBtn.addEventListener('click', this.toggleMobileMenu);
        }

        // Плавная прокрутка
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.smoothScroll);
        });

        // Анимации при скролле
        this.setupScrollAnimations();

        // Анимация прогресс-баров навыков
        this.animateSkillBars();

        // Кнопки навигации
        const navButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
        navButtons.forEach(button => {
            if (button.onclick) return; // Если уже есть обработчик
            if (button.textContent.includes('проект') || button.textContent.includes('Проект')) {
                button.addEventListener('click', () => {
                    window.location.href = 'projects.html';
                });
            } else if (button.textContent.includes('связаться') || button.textContent.includes('Связаться')) {
                button.addEventListener('click', () => {
                    window.location.href = 'contact.html';
                });
            }
        });

        // Карточки секций
        const sectionCards = document.querySelectorAll('.section-card');
        sectionCards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.querySelector('h3').textContent;
                if (title.includes('проект') || title.includes('Проект')) {
                    window.location.href = 'projects.html';
                } else if (title.includes('достиж') || title.includes('Достиж')) {
                    window.location.href = 'achievements.html';
                } else if (title.includes('обо мне') || title.includes('Обо мне')) {
                    window.location.href = 'about.html';
                }
            });
        });

        // Отслеживание изменений темы
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    this.onThemeChange();
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }

    toggleMobileMenu() {
        const navLinks = document.querySelector('.nav-links');
        const isVisible = navLinks.style.display === 'flex';
        navLinks.style.display = isVisible ? 'none' : 'flex';
    }

    smoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    onThemeChange() {
        // Сохраняем выбранную тему
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (this.siteData) {
            this.siteData.site.theme = currentTheme;
            this.saveSiteData();
        }
    }

    // Аналитика
    trackAnalytics() {
        const page = window.location.pathname.split('/').pop() || 'index.html';
        
        // Увеличиваем счетчик просмотров
        if (!this.siteData.analytics.pageViews[page]) {
            this.siteData.analytics.pageViews[page] = 0;
        }
        this.siteData.analytics.pageViews[page]++;
        this.siteData.analytics.totalVisitors++;
        
        this.saveSiteData();
    }

    updateAnalytics() {
        // Можно обновлять отображение аналитики в реальном времени
    }

    async saveSiteData() {
        try {
            // Сохраняем в localStorage для демонстрации
            localStorage.setItem('siteContent', JSON.stringify(this.siteData));
            
            // В реальном приложении здесь был бы fetch запрос к серверу
            console.log('Данные сохранены:', this.siteData);
            return true;
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            return false;
        }
    }

    // Уведомления
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            animation: 'fadeInUp 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'fadeInUp 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }

    // Анимации при скролле
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Наблюдаем за элементами для анимации
        document.querySelectorAll('.feature-card, .section-card, .timeline-item, .stat').forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }

    // Анимация прогресс-баров навыков
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-level');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.width || window.getComputedStyle(bar).width;
                    bar.style.width = '0%';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => observer.observe(bar));
    }
}

// Вспомогательные функции
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Инициализация приложения когда DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});