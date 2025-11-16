// Переводы
const translations = {
    ru: {
        // Общие
        "portfolio": "Портфолио",
        "home": "Главная",
        "achievements": "Достижения",
        "projects": "Проекты",
        "contact": "Контакты",
        
        // Герой
        "hero.title": "Алексей Иванов",
        "hero.subtitle": "Веб-разработчик & UI/UX дизайнер",
        "hero.description": "Создаю современные и интуитивно понятные веб-приложения с акцентом на пользовательский опыт. Имею 5-летний опыт работы в сфере веб-разработки и дизайна.",
        
        // Статистика
        "stats.projects": "Завершенных проектов",
        "stats.experience": "Лет опыта",
        "stats.clients": "Довольных клиента",
        
        // Кнопки
        "buttons.projects": "Мои проекты",
        "buttons.contact": "Связаться со мной",
        
        // Навигация
        "nav.achievements": "Достижения",
        "nav.achievementsDesc": "Мои награды и успехи",
        "nav.projects": "Проекты",
        "nav.projectsDesc": "Портфолио работ",
        "nav.contact": "Контакты",
        "nav.contactDesc": "Свяжитесь со мной",
        
        // Футер
        "footer.navigation": "Навигация",
        "footer.contacts": "Контакты",
        "footer.follow": "Соцсети",
        "footer.rights": "Все права защищены",
        
        // Админ
        "admin.panel": "Админ панель",
        "admin.password": "Пароль",
        "admin.passwordHint": "Пароль по умолчанию: admin123",
        "admin.login": "Войти",
        "admin.editor": "Редактор контента",
        "admin.design": "Дизайн",
        "admin.stats": "Статистика",
        "admin.editorHint": "Кликните на любой элемент сайта для редактирования",
        "admin.enableEditor": "Включить редактор",
        "admin.saveAll": "Сохранить всё",
        
        // Редактор
        "editor.title": "Редактор элемента",
        "editor.save": "Сохранить",
        "editor.delete": "Удалить",
        "editor.cancel": "Отмена"
    },
    en: {
        // Common
        "portfolio": "Portfolio",
        "home": "Home",
        "achievements": "Achievements",
        "projects": "Projects",
        "contact": "Contact",
        
        // Hero
        "hero.title": "Alexey Ivanov",
        "hero.subtitle": "Web Developer & UI/UX Designer",
        "hero.description": "I create modern and intuitive web applications with a focus on user experience. Have 5 years of experience in web development and design.",
        
        // Stats
        "stats.projects": "Completed Projects",
        "stats.experience": "Years of Experience",
        "stats.clients": "Happy Clients",
        
        // Buttons
        "buttons.projects": "My Projects",
        "buttons.contact": "Contact Me",
        
        // Navigation
        "nav.achievements": "Achievements",
        "nav.achievementsDesc": "My awards and successes",
        "nav.projects": "Projects",
        "nav.projectsDesc": "Portfolio of works",
        "nav.contact": "Contact",
        "nav.contactDesc": "Get in touch with me",
        
        // Footer
        "footer.navigation": "Navigation",
        "footer.contacts": "Contacts",
        "footer.follow": "Follow Me",
        "footer.rights": "All rights reserved",
        
        // Admin
        "admin.panel": "Admin Panel",
        "admin.password": "Password",
        "admin.passwordHint": "Default password: admin123",
        "admin.login": "Login",
        "admin.editor": "Content Editor",
        "admin.design": "Design",
        "admin.stats": "Statistics",
        "admin.editorHint": "Click on any website element to edit it",
        "admin.enableEditor": "Enable Editor",
        "admin.saveAll": "Save All",
        
        // Editor
        "editor.title": "Element Editor",
        "editor.save": "Save",
        "editor.delete": "Delete",
        "editor.cancel": "Cancel"
    }
};

// Текущий язык
let currentLanguage = 'ru';

// Инициализация языка
function initLanguage() {
    const savedLang = localStorage.getItem('portfolioLanguage');
    if (savedLang) {
        currentLanguage = savedLang;
    }
    updateLanguageButtons();
    applyLanguage();
    
    // Обработчики для переключателя языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
}

// Переключение языка
function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('portfolioLanguage', lang);
    updateLanguageButtons();
    applyLanguage();
}

// Обновление кнопок языка
function updateLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === currentLanguage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Применение языка
function applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[currentLanguage][key];
            } else {
                element.textContent = translations[currentLanguage][key];
            }
        }
    });
}