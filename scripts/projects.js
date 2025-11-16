class ProjectsManager {
    constructor() {
        this.projects = [];
        this.filteredProjects = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.visibleCount = 6;
        this.init();
    }

    async init() {
        await this.loadProjects();
        this.renderProjects();
        this.setupEventListeners();
    }

    async loadProjects() {
        try {
            // В реальном приложении здесь был бы fetch запрос
            const savedData = localStorage.getItem('siteContent');
            if (savedData) {
                const siteData = JSON.parse(savedData);
                this.projects = siteData.projects || this.getDefaultProjects();
            } else {
                this.projects = this.getDefaultProjects();
            }
        } catch (error) {
            console.error('Ошибка загрузки проектов:', error);
            this.projects = this.getDefaultProjects();
        }
    }

    getDefaultProjects() {
        return [
            {
                id: 1,
                title: "E-commerce Platform",
                description: "Полнофункциональная платформа для онлайн-продаж с системой управления заказами, инвентарем и аналитикой продаж. Реализована корзина, система оплаты и личный кабинет пользователя.",
                fullDescription: "Этот проект представляет собой современную e-commerce платформу с полным циклом онлайн-продаж. Включает в себя каталог товаров с фильтрацией, корзину покупок, систему оформления заказов, интеграцию с платежными системами и панель управления для администратора.",
                technologies: ["React", "Node.js", "MongoDB", "Express", "Stripe", "Redux"],
                image: "assets/images/project1.jpg",
                demoLink: "https://demo-ecommerce.example.com",
                githubLink: "https://github.com/username/ecommerce-platform",
                views: 156,
                category: "fullstack",
                featured: true,
                status: "completed",
                year: 2023,
                client: "Retail Company Inc.",
                challenge: "Создать масштабируемую платформу для растущего бизнеса",
                solution: "Разработана модульная архитектура с микросервисами",
                results: "Увеличена конверсия на 35%, снижено время загрузки на 60%"
            },
            {
                id: 2,
                title: "Task Management App",
                description: "Приложение для управления задачами с реальным временем обновления, командной работой и расширенными возможностями организации workflow.",
                fullDescription: "Интуитивное приложение для управления задачами с поддержкой командной работы. Включает доски задач, временные линии, уведомления в реальном времени и интеграцию с календарем.",
                technologies: ["Vue.js", "Firebase", "Vuex", "SCSS", "Chart.js"],
                image: "assets/images/project2.jpg",
                demoLink: "https://taskmanager.demo.com",
                githubLink: "https://github.com/username/task-manager",
                views: 89,
                category: "frontend",
                featured: true,
                status: "completed",
                year: 2023,
                client: "Startup Team",
                challenge: "Создать удобный инструмент для удаленных команд",
                solution: "Реализована система уведомлений и синхронизации в реальном времени",
                results: "Производительность команд выросла на 25%"
            },
            {
                id: 3,
                title: "Weather Dashboard",
                description: "Информационная панель с прогнозом погоды и красивой визуализацией метеорологических данных с разных источников.",
                fullDescription: "Продвинутая панель управления погодой с визуализацией данных на картах, графиках и диаграммах. Поддерживает несколько источников данных и предоставляет точные прогнозы.",
                technologies: ["React", "Chart.js", "Weather API", "Styled Components", "Leaflet"],
                image: "assets/images/project3.jpg",
                demoLink: "https://weather-dashboard.demo.com",
                githubLink: "https://github.com/username/weather-dashboard",
                views: 67,
                category: "frontend",
                featured: false,
                status: "completed",
                year: 2023
            },
            {
                id: 4,
                title: "Social Network API",
                description: "Мощный backend для социальной сети с поддержкой постов, комментариев, лайков и системой подписок.",
                fullDescription: "Полнофункциональный API для социальной сети с поддержкой всех основных функций: создание постов, комментарии, лайки, подписки, личные сообщения и уведомления.",
                technologies: ["Node.js", "Express", "MongoDB", "Socket.io", "JWT"],
                image: "assets/images/project4.jpg",
                githubLink: "https://github.com/username/social-api",
                views: 45,
                category: "backend",
                featured: false,
                status: "completed",
                year: 2023
            },
            {
                id: 5,
                title: "Mobile Fitness App",
                description: "Кроссплатформенное мобильное приложение для отслеживания тренировок, питания и прогресса в фитнесе.",
                fullDescription: "Комплексное фитнес-приложение с трекингом тренировок, планами питания, отслеживанием прогресса и социальными функциями для мотивации.",
                technologies: ["React Native", "Firebase", "Redux", "Chart.js"],
                image: "assets/images/project5.jpg",
                demoLink: "https://fitness-app.demo.com",
                views: 78,
                category: "mobile",
                featured: true,
                status: "in-progress",
                year: 2024
            },
            {
                id: 6,
                title: "Analytics Platform",
                description: "Платформа для анализа и визуализации бизнес-метрик с дашбордами и автоматическими отчетами.",
                fullDescription: "Мощная аналитическая платформа для бизнеса с поддержкой различных источников данных, автоматической генерацией отчетов и интерактивными дашбордами.",
                technologies: ["React", "D3.js", "Python", "FastAPI", "PostgreSQL"],
                image: "assets/images/project6.jpg",
                views: 34,
                category: "fullstack",
                featured: false,
                status: "completed",
                year: 2023
            }
        ];
    }

    setupEventListeners() {
        // Фильтры
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterClick(e.target);
            });
        });

        // Поиск
        const searchInput = document.getElementById('projectSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        // Кнопка "Показать еще"
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreProjects();
            });
        }

        // Модальное окно
        this.setupModal();
    }

    handleFilterClick(button) {
        // Обновляем активную кнопку
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        this.currentFilter = button.getAttribute('data-filter');
        this.applyFilters();
    }

    applyFilters() {
        this.filteredProjects = this.projects.filter(project => {
            // Применяем фильтр по категории
            const categoryMatch = this.currentFilter === 'all' || project.category === this.currentFilter;
            
            // Применяем поисковый запрос
            const searchMatch = !this.searchQuery || 
                project.title.toLowerCase().includes(this.searchQuery) ||
                project.description.toLowerCase().includes(this.searchQuery) ||
                project.technologies.some(tech => tech.toLowerCase().includes(this.searchQuery));
            
            return categoryMatch && searchMatch;
        });

        this.renderProjects();
    }

    renderProjects() {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;

        const projectsToShow = this.filteredProjects.slice(0, this.visibleCount);
        
        grid.innerHTML = projectsToShow.map(project => this.createProjectCard(project)).join('');

        // Показываем/скрываем кнопку "Показать еще"
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = this.visibleCount < this.filteredProjects.length ? 'block' : 'none';
        }

        // Добавляем обработчики кликов для карточек
        this.addProjectCardListeners();
    }

    createProjectCard(project) {
        const technologies = project.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');

        return `
            <div class="project-card" data-project-id="${project.id}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzY0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzhjOTdhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPiR7cHJvamVjdC50aXRsZX08L3RleHQ+PC9zdmc+'">
                    ${project.featured ? '<span class="featured-badge">⭐ Избранный</span>' : ''}
                    ${project.status === 'in-progress' ? '<span class="status-badge in-progress">🚧 В работе</span>' : ''}
                    <div class="project-overlay">
                        <div class="project-actions">
                            <button class="view-btn" data-action="view" data-project-id="${project.id}">👁 Подробнее</button>
                            ${project.demoLink ? `<a href="${project.demoLink}" target="_blank" class="demo-btn">🌐 Демо</a>` : ''}
                            ${project.githubLink ? `<a href="${project.githubLink}" target="_blank" class="github-btn">💻 Код</a>` : ''}
                        </div>
                    </div>
                </div>
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-technologies">
                        ${technologies}
                    </div>
                    <div class="project-meta">
                        <span class="project-views">👀 ${project.views}</span>
                        <span class="project-year">📅 ${project.year}</span>
                        <span class="project-category">🏷️ ${this.getCategoryName(project.category)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    getCategoryName(category) {
        const names = {
            'frontend': 'Frontend',
            'backend': 'Backend', 
            'fullstack': 'Fullstack',
            'mobile': 'Mobile'
        };
        return names[category] || category;
    }

    addProjectCardListeners() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const projectId = parseInt(btn.getAttribute('data-project-id'));
                this.openProjectModal(projectId);
            });
        });

        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.project-actions')) {
                    const projectId = parseInt(card.getAttribute('data-project-id'));
                    this.openProjectModal(projectId);
                }
            });
        });
    }

    setupModal() {
        const modal = document.getElementById('projectModal');
        const closeBtn = modal.querySelector('.close-modal');

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }

    openProjectModal(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const modal = document.getElementById('projectModal');
        const modalBody = document.getElementById('modalBody');

        // Увеличиваем счетчик просмотров
        project.views = (project.views || 0) + 1;
        this.saveProjectsData();

        modalBody.innerHTML = this.createModalContent(project);
        modal.style.display = 'block';

        // Обновляем отображение счетчика просмотров на карточке
        this.updateProjectViews(projectId, project.views);
    }

    createModalContent(project) {
        const technologies = project.technologies.map(tech => 
            `<span class="modal-tech-tag">${tech}</span>`
        ).join('');

        return `
            <div class="modal-project">
                <div class="modal-header">
                    <h2>${project.title}</h2>
                    <div class="modal-meta">
                        <span class="modal-year">${project.year}</span>
                        <span class="modal-category">${this.getCategoryName(project.category)}</span>
                        <span class="modal-status ${project.status}">${this.getStatusText(project.status)}</span>
                    </div>
                </div>
                
                <div class="modal-image">
                    <img src="${project.image}" alt="${project.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzY0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzhjOTdhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPiR7cHJvamVjdC50aXRsZX08L3RleHQ+PC9zdmc+'">
                </div>
                
                <div class="modal-content">
                    <div class="modal-section">
                        <h3>Описание проекта</h3>
                        <p>${project.fullDescription || project.description}</p>
                    </div>
                    
                    ${project.challenge ? `
                    <div class="modal-section">
                        <h3>Задача</h3>
                        <p>${project.challenge}</p>
                    </div>
                    ` : ''}
                    
                    ${project.solution ? `
                    <div class="modal-section">
                        <h3>Решение</h3>
                        <p>${project.solution}</p>
                    </div>
                    ` : ''}
                    
                    ${project.results ? `
                    <div class="modal-section">
                        <h3>Результаты</h3>
                        <p>${project.results}</p>
                    </div>
                    ` : ''}
                    
                    <div class="modal-section">
                        <h3>Технологии</h3>
                        <div class="modal-technologies">
                            ${technologies}
                        </div>
                    </div>
                    
                    <div class="modal-section">
                        <h3>Статистика</h3>
                        <div class="modal-stats">
                            <div class="modal-stat">
                                <span class="stat-label">Просмотры:</span>
                                <span class="stat-value">${project.views}</span>
                            </div>
                            ${project.client ? `
                            <div class="modal-stat">
                                <span class="stat-label">Клиент:</span>
                                <span class="stat-value">${project.client}</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="modal-actions">
                    ${project.demoLink ? `
                    <a href="${project.demoLink}" target="_blank" class="btn-primary">
                        🌐 Посмотреть демо
                    </a>
                    ` : ''}
                    
                    ${project.githubLink ? `
                    <a href="${project.githubLink}" target="_blank" class="btn-secondary">
                        💻 Исходный код
                    </a>
                    ` : ''}
                    
                    <button class="btn-secondary close-modal-btn">
                        ← Назад к проектам
                    </button>
                </div>
            </div>
        `;
    }

    getStatusText(status) {
        const statuses = {
            'completed': 'Завершен',
            'in-progress': 'В работе',
            'planned': 'Запланирован'
        };
        return statuses[status] || status;
    }

    updateProjectViews(projectId, views) {
        const projectCard = document.querySelector(`[data-project-id="${projectId}"]`);
        if (projectCard) {
            const viewsElement = projectCard.querySelector('.project-views');
            if (viewsElement) {
                viewsElement.textContent = `👀 ${views}`;
            }
        }
    }

    loadMoreProjects() {
        this.visibleCount += 6;
        this.renderProjects();
    }

    async saveProjectsData() {
        try {
            // Сохраняем обновленные данные проектов
            const savedData = localStorage.getItem('siteContent');
            if (savedData) {
                const siteData = JSON.parse(savedData);
                siteData.projects = this.projects;
                localStorage.setItem('siteContent', JSON.stringify(siteData));
            }
        } catch (error) {
            console.error('Ошибка сохранения данных проектов:', error);
        }
    }
}

// Добавляем CSS для проектов
const projectsStyles = `
    .page-hero {
        padding: 120px 0 60px;
        text-align: center;
    }
    
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }
    
    .projects-filters {
        background: var(--surface-color);
        padding: 2rem 0;
        border-bottom: 1px solid var(--border-color);
    }
    
    .projects-filters .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .filter-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    .filter-btn {
        background: var(--background-color);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .filter-btn:hover {
        border-color: var(--primary-color);
        color: var(--text-primary);
    }
    
    .filter-btn.active {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
    }
    
    .search-box {
        position: relative;
        min-width: 250px;
    }
    
    .search-box input {
        width: 100%;
        padding: 0.5rem 2.5rem 0.5rem 1rem;
        border: 1px solid var(--border-color);
        border-radius: 20px;
        background: var(--background-color);
        color: var(--text-primary);
    }
    
    .search-icon {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: var(--text-secondary);
    }
    
    .projects-grid-section {
        padding: 4rem 0;
    }
    
    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
        margin-bottom: 3rem;
    }
    
    .project-card {
        background: var(--surface-color);
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .project-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow);
        border-color: var(--primary-color);
    }
    
    .project-image {
        position: relative;
        height: 200px;
        overflow: hidden;
    }
    
    .project-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
    
    .project-card:hover .project-image img {
        transform: scale(1.05);
    }
    
    .featured-badge, .status-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .featured-badge {
        background: gold;
        color: #000;
    }
    
    .status-badge.in-progress {
        background: var(--primary-color);
        color: white;
    }
    
    .project-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .project-card:hover .project-overlay {
        opacity: 1;
    }
    
    .project-actions {
        display: flex;
        gap: 0.5rem;
    }
    
    .view-btn, .demo-btn, .github-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 6px;
        color: white;
        text-decoration: none;
        font-size: 0.9rem;
        transition: all 0.3s ease;
    }
    
    .view-btn {
        background: var(--primary-color);
    }
    
    .demo-btn {
        background: var(--secondary-color);
    }
    
    .github-btn {
        background: #333;
    }
    
    .project-info {
        padding: 1.5rem;
    }
    
    .project-title {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }
    
    .project-description {
        color: var(--text-secondary);
        margin-bottom: 1rem;
        line-height: 1.5;
    }
    
    .project-technologies {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .tech-tag {
        background: var(--background-color);
        color: var(--text-secondary);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        border: 1px solid var(--border-color);
    }
    
    .project-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.8rem;
        color: var(--text-secondary);
    }
    
    .load-more {
        text-align: center;
    }
    
    /* Модальное окно */
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
    }
    
    .modal-content {
        background: var(--surface-color);
        margin: 2% auto;
        width: 90%;
        max-width: 800px;
        border-radius: 12px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
    }
    
    .close-modal {
        position: absolute;
        right: 1rem;
        top: 1rem;
        font-size: 2rem;
        cursor: pointer;
        color: var(--text-secondary);
        z-index: 1001;
    }
    
    .close-modal:hover {
        color: var(--text-primary);
    }
    
    .modal-body {
        padding: 2rem;
    }
    
    .modal-project .modal-header {
        margin-bottom: 2rem;
    }
    
    .modal-project .modal-header h2 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }
    
    .modal-meta {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    .modal-year, .modal-category, .modal-status {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .modal-year {
        background: var(--primary-color);
        color: white;
    }
    
    .modal-category {
        background: var(--background-color);
        color: var(--text-primary);
        border: 1px solid var(--border-color);
    }
    
    .modal-status.completed {
        background: #10b981;
        color: white;
    }
    
    .modal-status.in-progress {
        background: #f59e0b;
        color: white;
    }
    
    .modal-image {
        margin-bottom: 2rem;
    }
    
    .modal-image img {
        width: 100%;
        border-radius: 8px;
    }
    
    .modal-section {
        margin-bottom: 2rem;
    }
    
    .modal-section h3 {
        font-size: 1.25rem;
        margin-bottom: 1rem;
        color: var(--text-primary);
    }
    
    .modal-technologies {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .modal-tech-tag {
        background: var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
    }
    
    .modal-stats {
        display: flex;
        gap: 2rem;
    }
    
    .modal-stat {
        display: flex;
        flex-direction: column;
    }
    
    .stat-label {
        font-size: 0.9rem;
        color: var(--text-secondary);
    }
    
    .stat-value {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--text-primary);
    }
    
    .modal-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid var(--border-color);
    }
    
    .close-modal-btn {
        margin-left: auto;
    }
    
    /* Статистика проектов */
    .projects-stats {
        background: var(--surface-color);
        padding: 4rem 0;
        border-top: 1px solid var(--border-color);
    }
    
    .stats-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
    }
    
    .stats-cards .stat-card {
        background: var(--background-color);
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        border: 1px solid var(--border-color);
    }
    
    .stats-cards .stat-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .stats-cards .stat-info h3 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        background: var(--gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    /* Адаптивность */
    @media (max-width: 768px) {
        .projects-filters .container {
            flex-direction: column;
            align-items: stretch;
        }
        
        .filter-buttons {
            justify-content: center;
        }
        
        .search-box {
            min-width: auto;
        }
        
        .projects-grid {
            grid-template-columns: 1fr;
        }
        
        .modal-content {
            width: 95%;
            margin: 5% auto;
        }
        
        .modal-actions {
            flex-direction: column;
        }
        
        .close-modal-btn {
            margin-left: 0;
        }
    }
`;

// Добавляем стили в документ
const styleSheet = document.createElement('style');
styleSheet.textContent = projectsStyles;
document.head.appendChild(styleSheet);

// Инициализация менеджера проектов
document.addEventListener('DOMContentLoaded', () => {
    window.projectsManager = new ProjectsManager();
});