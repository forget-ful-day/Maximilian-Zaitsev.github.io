class ThemeManager {
    constructor() {
        this.themes = ['dark', 'light', 'blue', 'green', 'purple', 'orange'];
        this.currentTheme = localStorage.getItem('siteTheme') || 'dark';
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupThemeToggle();
        this.setupThemeSelector();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('siteTheme', theme);
        this.currentTheme = theme;
        this.updateThemeButtons(theme);
        
        // Сохраняем в данные сайта если приложение загружено
        if (window.portfolioApp && window.portfolioApp.siteData) {
            window.portfolioApp.siteData.site.theme = theme;
            window.portfolioApp.saveSiteData();
        }
    }

    setupThemeToggle() {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.nextTheme());
        }
    }

    setupThemeSelector() {
        // Создаем селектор тем для админки если его нет
        if (document.getElementById('themeSelector')) {
            const selector = document.getElementById('themeSelector');
            selector.innerHTML = this.themes.map(theme => 
                `<option value="${theme}">${this.getThemeName(theme)}</option>`
            ).join('');
            selector.value = this.currentTheme;
            selector.addEventListener('change', (e) => this.applyTheme(e.target.value));
        }
    }

    nextTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.applyTheme(this.themes[nextIndex]);
    }

    updateThemeButtons(theme) {
        const toggleBtn = document.getElementById('themeToggle');
        if (toggleBtn) {
            const icons = {
                dark: '🌙', 
                light: '☀️', 
                blue: '🔵', 
                green: '🟢', 
                purple: '🟣',
                orange: '🟠'
            };
            toggleBtn.textContent = icons[theme] || '🎨';
        }

        const selector = document.getElementById('themeSelector');
        if (selector) {
            selector.value = theme;
        }
    }

    getThemeName(theme) {
        const names = {
            dark: 'Тёмная',
            light: 'Светлая', 
            blue: 'Синяя',
            green: 'Зелёная',
            purple: 'Фиолетовая',
            orange: 'Оранжевая'
        };
        return names[theme] || theme;
    }

    getAvailableThemes() {
        return this.themes.map(theme => ({
            id: theme,
            name: this.getThemeName(theme),
            colors: this.getThemeColors(theme)
        }));
    }

    getThemeColors(theme) {
        const tempDiv = document.createElement('div');
        tempDiv.style.display = 'none';
        document.body.appendChild(tempDiv);
        
        // Временное применение темы для получения цветов
        const originalTheme = this.currentTheme;
        this.applyTheme(theme);
        
        const styles = getComputedStyle(document.documentElement);
        const colors = {
            primary: styles.getPropertyValue('--primary-color').trim(),
            background: styles.getPropertyValue('--background-color').trim(),
            surface: styles.getPropertyValue('--surface-color').trim()
        };
        
        // Возвращаем оригинальную тему
        this.applyTheme(originalTheme);
        tempDiv.remove();
        
        return colors;
    }
}

// Инициализация менеджера тем
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});