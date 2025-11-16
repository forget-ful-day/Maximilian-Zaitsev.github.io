class AchievementsManager {
    constructor() {
        this.achievements = [];
        this.filteredAchievements = [];
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        await this.loadAchievements();
        this.renderAchievements();
        this.renderTimeline();
        this.setupEventListeners();
    }

    async loadAchievements() {
        try {
            const savedData = localStorage.getItem('siteContent');
            if (savedData) {
                const siteData = JSON.parse(savedData);
                this.achievements = siteData.achievements || this.getDefaultAchievements();
            } else {
                this.achievements = this.getDefaultAchievements();
            }
        } catch (error) {
            console.error('Ошибка загрузки достижений:', error);
            this.achievements = this.getDefaultAchievements();
        }
    }

    getDefaultAchievements() {
        return [
            {
                id: 1,
                title: "Лучший молодой разработчик 2023",
                organization: "IT Community Awards",
                date: "2023-12-01",
                description: "Награда за инновационные решения в веб-разработке и contribution в open-source сообщество",
                fullDescription: "Престижная награда вручается ежегодно за выдающиеся достижения в области веб-разработки. Получена за создание инновационных решений и активный вклад в развитие open-source сообщества.",
                image: "assets/achievements/award1.jpg",
                category: "award",
                type: "award",
                importance: "high",
                skills: ["JavaScript", "React", "Open Source"],
                link: "https://example.com/award-details"
            },
            {
                id: 2,
                title: "React Professional Certificate",
                organization: "Meta",
                date: "2023-08-15",
                description: "Сертификат о прохождении профессионального курса по React и современным практикам разработки",
                fullDescription: "Профессиональный сертификат подтверждает глубокое понимание React, включая хуки, контекст, производительность и лучшие практики разработки.",
                image: "assets/achievements/certificate1.jpg",
                category: "certificate",
                type: "certificate",
                importance: "medium",
                skills: ["React", "JavaScript", "Frontend"],
                link: "https://coursera.org/verify/REACT123"
            },
            {
                id: 3,
                title: "Hackathon Winner - Digital Innovation",
                organization: "TechCrunch",
                date: "2023-05-20",
                description: "Первое место на международном хакатоне по созданию инновационных веб-решений для цифровой трансформации",
                fullDescription: "Командная победа на международном хакатоне с проектом по оптимизации бизнес-процессов через веб-технологии. Проект получил высшие оценки за инновационность и практическую применимость.",
                image: "assets/achievements/hackathon1.jpg",
                category: "competition",
                type: "competition",
                importance: "high",
                skills: ["Teamwork", "Innovation", "Problem Solving"],
                prize: "1st Place"
            },
            {
                id: 4,
                title: "AWS Cloud Practitioner",
                organization: "Amazon Web Services",
                date: "2023-03-10",
                description: "Сертификат подтверждающий знания облачных технологий и сервисов AWS",
                fullDescription: "Сертификат демонстрирует понимание облачных концепций, сервисов AWS, архитектуры, безопасности и ценовых моделей.",
                image: "assets/achievements/certificate2.jpg",
                category: "certificate",
                type: "certificate",
                importance: "medium",
                skills: ["AWS", "Cloud Computing", "DevOps"]
            },
            {
                id: 5,
                title: "JavaScript Advanced Course",
                organization: "Stepik",
                date: "2023-01-15",
                description: "Сертификат о прохождении продвинутого курса по JavaScript с фокусом на современных возможностях ES6+",
                fullDescription: "Углубленный курс охватывает современные возможности JavaScript, включая асинхронное программирование, модули, классы и продвинутые паттерны.",
                image: "assets/achievements/course1.jpg",
                category: "course",
                type: "course",
                importance: "medium",
                skills: ["JavaScript", "ES6+", "Async Programming"]
            },
            {
                id: 6,
                title: "UI/UX Design Specialization",
                organization: "Google",
                date: "2022-11-20",
                description: "Специализация по дизайну пользовательских интерфейсов и опыта взаимодействия",
                fullDescription: "Комплексная программа обучения принципам дизайна, исследованию пользователей, прототипированию и тестированию интерфейсов.",
                image: "assets/achievements/course2.jpg",
                category: "course",
                type: "course",
                importance: "medium",
                skills: ["UI/UX Design", "Figma", "User Research"]
            },
            {
                id: 7,
                title: "Open Source Contributor",
                organization: "GitHub",
                date: "2022-09-05",
                description: "Активный contributor в популярных open-source проектах с значительным вкладом в сообщество",
                fullDescription: "Регулярный вклад в open-source проекты включая исправление багов, добавление новых функций и улучшение документации.",
                image: "assets/achievements/opensource.jpg",
                category: "contribution",
                type: "contribution",
                importance: "low",
                skills: ["Open Source", "Git", "Collaboration"]
            },
            {
                id: 8,
                title: "Tech Conference Speaker",
                organization: "DevConf 2022",
                date: "2022-06-15",
                description: "Выступление с докладом о современных тенденциях в веб-разработке на международной конференции",
                fullDescription: "Приглашенный спикер на международной конференции с докладом о современных подходах к разработке и оптимизации веб-приложений.",
                image: "assets/achievements/speaker.jpg",
                category: "speaking",
                type: "speaking",
                importance: "medium",
                skills: ["Public Speaking", "Knowledge Sharing", "Networking"]
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

        // Модальное окно
        this.setupModal();
    }

    handleFilterClick(button) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        this.currentFilter = button.getAttribute('data-filter');
        this.applyFilters();
    }

    applyFilters() {
        if (this.currentFilter === 'all') {
            this.filteredAchievements = this.achievements;
        } else {
            this.filteredAchievements = this.achievements.filter(achievement => 
                achievement.type === this.currentFilter
            );
        }
        this.renderAchievements();
    }

    renderAchievements() {
        const grid = document.getElementById('achievementsGrid');
        if (!grid) return;

        grid.innerHTML = this.filteredAchievements.map(achievement => 
            this.createAchievementCard(achievement)
        ).join('');

        this.addAchievementCardListeners();
    }

    createAchievementCard(achievement) {
        const importanceClass = this.getImportanceClass(achievement.importance);
        const categoryIcon = this.getCategoryIcon(achievement.type);

        return `
            <div class="achievement-card ${importanceClass}" data-achievement-id="${achievement.id}">
                <div class="achievement-image">
                    <img src="${achievement.image}" alt="${achievement.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzY0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzhjOTdhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPiR7YWNoaWV2ZW1lbnQudGl0bGV9PC90ZXh0Pjwvc3ZnPg=='>
                    <div class="achievement-overlay">
                        <button class="view-achievement-btn" data-action="view" data-achievement-id="${achievement.id}">
                            👁 Подробнее
                        </button>
                    </div>
                </div>
                <div class="achievement-content">
                    <div class="achievement-header">
                        <span class="achievement-category">${categoryIcon} ${this.getCategoryName(achievement.type)}</span>
                        <span class="achievement-date">${this.formatDate(achievement.date)}</span>
                    </div>
                    <h3 class="achievement-title">${achievement.title}</h3>
                    <p class="achievement-description">${achievement.description}</p>
                    <div class="achievement-organization">
                        <span class="organization-name">${achievement.organization}</span>
                    </div>
                    ${achievement.skills ? `
                    <div class="achievement-skills">
                        ${achievement.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    getImportanceClass(importance) {
        const classes = {
            'high': 'achievement-high',
            'medium': 'achievement-medium', 
            'low': 'achievement-low'
        };
        return classes[importance] || '';
    }

    getCategoryIcon(category) {
        const icons = {
            'award': '🏆',
            'certificate': '📜',
            'competition': '🥇',
            'course': '📚',
            'contribution': '🤝',
            'speaking': '🎤'
        };
        return icons[category] || '📌';
    }

    getCategoryName(category) {
        const names = {
            'award': 'Награда',
            'certificate': 'Сертификат',
            'competition': 'Соревнование',
            'course': 'Курс',
            'contribution': 'Вклад',
            'speaking': 'Выступление'
        };
        return names[category] || category;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long'
        });
    }

    addAchievementCardListeners() {
        document.querySelectorAll('.view-achievement-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const achievementId = parseInt(btn.getAttribute('data-achievement-id'));
                this.openAchievementModal(achievementId);
            });
        });

        document.querySelectorAll('.achievement-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.view-achievement-btn')) {
                    const achievementId = parseInt(card.getAttribute('data-achievement-id'));
                    this.openAchievementModal(achievementId);
                }
            });
        });
    }

    setupModal() {
        const modal = document.getElementById('achievementModal');
        const closeBtn = modal.querySelector('.close-modal');

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }

    openAchievementModal(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement) return;

        const modal = document.getElementById('achievementModal');
        const modalBody = document.getElementById('achievementModalBody');

        modalBody.innerHTML = this.createModalContent(achievement);
        modal.style.display = 'block';
    }

    createModalContent(achievement) {
        const skills = achievement.skills ? achievement.skills.map(skill => 
            `<span class="modal-skill-tag">${skill}</span>`
        ).join('') : '';

        return `
            <div class="modal-achievement">
                <div class="modal-header">
                    <h2>${achievement.title}</h2>
                    <div class="modal-meta">
                        <span class="modal-organization">${achievement.organization}</span>
                        <span class="modal-date">${this.formatDate(achievement.date)}</span>
                        <span class="modal-category ${achievement.type}">${this.getCategoryName(achievement.type)}</span>
                    </div>
                </div>
                
                <div class="modal-image">
                    <img src="${achievement.image}" alt="${achievement.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzY0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzhjOTdhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPiR7YWNoaWV2ZW1lbnQudGl0bGV9PC90ZXh0Pjwvc3ZnPg=='>
                </div>
                
                <div class="modal-content">
                    <div class="modal-section">
                        <h3>Описание</h3>
                        <p>${achievement.fullDescription || achievement.description}</p>
                    </div>
                    
                    ${achievement.prize ? `
                    <div class="modal-section">
                        <h3>Результат</h3>
                        <p class="modal-prize">${achievement.prize}</p>
                    </div>
                    ` : ''}
                    
                    ${skills ? `
                    <div class="modal-section">
                        <h3>Навыки и технологии</h3>
                        <div class="modal-skills">
                            ${skills}
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="modal-section">
                        <h3>Детали</h3>
                        <div class="modal-details">
                            <div class="detail-item">
                                <span class="detail-label">Организация:</span>
                                <span class="detail-value">${achievement.organization}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Дата получения:</span>
                                <span class="detail-value">${this.formatDate(achievement.date)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Категория:</span>
                                <span class="detail-value">${this.getCategoryName(achievement.type)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-actions">
                    ${achievement.link ? `
                    <a href="${achievement.link}" target="_blank" class="btn-primary">
                        🔗 Подробнее на сайте
                    </a>
                    ` : ''}
                    <button class="btn-secondary close-modal-btn">
                        ← Назад к достижениям
                    </button>
                </div>
            </div>
        `;
    }

    renderTimeline() {
        const timeline = document.getElementById('achievementsTimeline');
        if (!timeline) return;

        // Сортируем достижения по дате
        const sortedAchievements = [...this.achievements].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );

        timeline.innerHTML = sortedAchievements.map(achievement => 
            this.createTimelineItem(achievement)
        ).join('');
    }

    createTimelineItem(achievement) {
        return `
            <div class="timeline-item" data-achievement-id="${achievement.id}">
                <div class="timeline-marker">
                    <div class="marker-icon">${this.getCategoryIcon(achievement.type)}</div>
                </div>
                <div class="timeline-content">
                    <div class="timeline-date">${this.formatDate(achievement.date)}</div>
                    <h3 class="timeline-title">${achievement.title}</h3>
                    <p class="timeline-description">${achievement.description}</p>
                    <span class="timeline-organization">${achievement.organization}</span>
                </div>
            </div>
        `;
    }
}

// Добавляем CSS для достижений
const achievementsStyles = `
    .achievements-stats {
        background: var(--surface-color);
        padding: 3rem 0;
        border-bottom: 1px solid var(--border-color);
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 2rem;
        text-align: center;
    }
    
    .stat-item {
        padding: 2rem 1rem;
    }
    
    .stat-number {
        font-size: 3rem;
        font-weight: 700;
        background: var(--gradient);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 0.5rem;
    }
    
    .stat-label {
        color: var(--text-secondary);
        font-size: 1.1rem;
    }
    
    .achievements-filters {
        padding: 2rem 0;
        background: var(--background-color);
    }
    
    .achievements-filters .filter-buttons {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    .achievements-grid-section {
        padding: 4rem 0;
    }
    
    .achievements-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 2rem;
    }
    
    .achievement-card {
        background: var(--surface-color);
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .achievement-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow);
    }
    
    .achievement-card.achievement-high {
        border-left: 4px solid #f59e0b;
    }
    
    .achievement-card.achievement-medium {
        border-left: 4px solid #10b981;
    }
    
    .achievement-card.achievement-low {
        border-left: 4px solid #6366f1;
    }
    
    .achievement-image {
        position: relative;
        height: 200px;
        overflow: hidden;
    }
    
    .achievement-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .achievement-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .achievement-card:hover .achievement-overlay {
        opacity: 1;
    }
    
    .view-achievement-btn {
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .view-achievement-btn:hover {
        background: var(--secondary-color);
        transform: scale(1.05);
    }
    
    .achievement-content {
        padding: 1.5rem;
    }
    
    .achievement-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .achievement-category {
        background: var(--background-color);
        color: var(--text-secondary);
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .achievement-date {
        color: var(--text-secondary);
        font-size: 0.8rem;
    }
    
    .achievement-title {
        font-size: 1.25rem;
        margin-bottom: 0.75rem;
        color: var(--text-primary);
        line-height: 1.3;
    }
    
    .achievement-description {
        color: var(--text-secondary);
        margin-bottom: 1rem;
        line-height: 1.5;
    }
    
    .achievement-organization {
        margin-bottom: 1rem;
    }
    
    .organization-name {
        color: var(--primary-color);
        font-weight: 500;
    }
    
    .achievement-skills {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .skill-tag {
        background: var(--background-color);
        color: var(--text-secondary);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        border: 1px solid var(--border-color);
    }
    
    /* Таймлайн */
    .achievements-timeline {
        padding: 4rem 0;
        background: var(--surface-color);
    }
    
    .achievements-timeline h2 {
        text-align: center;
        margin-bottom: 3rem;
        font-size: 2.5rem;
    }
    
    .timeline {
        position: relative;
        max-width: 800px;
        margin: 0 auto;
    }
    
    .timeline::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 0;
        bottom: 0;
        width: 2px;
        background: var(--border-color);
        transform: translateX(-50%);
    }
    
    .timeline-item {
        display: flex;
        align-items: flex-start;
        margin-bottom: 3rem;
        position: relative;
    }
    
    .timeline-item:nth-child(odd) {
        flex-direction: row-reverse;
    }
    
    .timeline-item:nth-child(odd) .timeline-content {
        margin-left: 0;
        margin-right: 2rem;
        text-align: right;
    }
    
    .timeline-marker {
        position: relative;
        z-index: 2;
        background: var(--background-color);
        border: 2px solid var(--primary-color);
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    
    .marker-icon {
        font-size: 1.2rem;
    }
    
    .timeline-content {
        background: var(--background-color);
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        margin-left: 2rem;
        flex: 1;
        box-shadow: var(--shadow);
    }
    
    .timeline-date {
        color: var(--primary-color);
        font-weight: 600;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
    }
    
    .timeline-title {
        font-size: 1.25rem;
        margin-bottom: 0.75rem;
        color: var(--text-primary);
    }
    
    .timeline-description {
        color: var(--text-secondary);
        margin-bottom: 0.5rem;
        line-height: 1.5;
    }
    
    .timeline-organization {
        color: var(--text-secondary);
        font-size: 0.9rem;
        font-style: italic;
    }
    
    /* Модальное окно достижений */
    .modal-achievement .modal-header {
        margin-bottom: 2rem;
    }
    
    .modal-achievement .modal-header h2 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }
    
    .modal-meta {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    .modal-organization {
        background: var(--primary-color);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.9rem;
    }
    
    .modal-date {
        background: var(--background-color);
        color: var(--text-primary);
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.9rem;
        border: 1px solid var(--border-color);
    }
    
    .modal-category {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.9rem;
        font-weight: 500;
    }
    
    .modal-category.award {
        background: #f59e0b;
        color: white;
    }
    
    .modal-category.certificate {
        background: #10b981;
        color: white;
    }
    
    .modal-category.competition {
        background: #ef4444;
        color: white;
    }
    
    .modal-prize {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--primary-color);
    }
    
    .modal-skills {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .modal-skill-tag {
        background: var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.9rem;
    }
    
    .modal-details {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-color);
    }
    
    .detail-label {
        color: var(--text-secondary);
        font-weight: 500;
    }
    
    .detail-value {
        color: var(--text-primary);
    }
    
    /* Адаптивность */
    @media (max-width: 768px) {
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }
        
        .achievements-grid {
            grid-template-columns: 1fr;
        }
        
        .timeline::before {
            left: 30px;
        }
        
        .timeline-item {
            flex-direction: row !important;
        }
        
        .timeline-item .timeline-content {
            margin-left: 2rem;
            margin-right: 0;
            text-align: left;
        }
        
        .modal-meta {
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .detail-item {
            flex-direction: column;
            gap: 0.25rem;
        }
    }
`;

// Добавляем стили в документ
const styleSheet = document.createElement('style');
styleSheet.textContent = achievementsStyles;
document.head.appendChild(styleSheet);

// Инициализация менеджера достижений
document.addEventListener('DOMContentLoaded', () => {
    window.achievementsManager = new AchievementsManager();
});