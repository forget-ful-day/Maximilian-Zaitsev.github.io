// Расширенный редактор с поддержкой GitHub и управлением элементами

class AdvancedPageEditor {
    constructor() {
        this.editMode = false;
        this.selectedElement = null;
        this.currentPage = 'index.html';
        this.pages = ['index.html', 'about.html', 'projects.html', 'achievements.html', 'faq.html', 'blog.html', 'contact.html'];
        this.projects = JSON.parse(localStorage.getItem('projects')) || [];
        this.achievements = JSON.parse(localStorage.getItem('achievements')) || [];
        this.faqs = JSON.parse(localStorage.getItem('faqs')) || [];
        this.init();
    }

    init() {
        this.setupEditor();
        this.loadContentFromStorage();
        this.attachGlobalListeners();
    }

    setupEditor() {
        // Создаём редактор интерфейс
        if (document.getElementById('editor-panel')) return;
        
        const editorPanel = document.createElement('div');
        editorPanel.id = 'editor-panel';
        editorPanel.className = 'editor-panel';
        editorPanel.innerHTML = `
            <div class="editor-header">
                <h3>✏️ Режим редактирования</h3>
                <button class="editor-close" id="closeEditor">✕</button>
            </div>
            
            <div class="editor-tabs">
                <button class="editor-tab active" data-tab="elements">Элементы</button>
                <button class="editor-tab" data-tab="projects">Проекты</button>
                <button class="editor-tab" data-tab="achievements">Достижения</button>
                <button class="editor-tab" data-tab="faq">FAQ</button>
            </div>
            
            <div class="editor-content">
                <div id="elements-tab" class="editor-tab-content active">
                    <div class="elements-menu">
                        <h4>Добавить элемент:</h4>
                        <button class="add-element-btn" data-element="text">📝 Текст</button>
                        <button class="add-element-btn" data-element="heading">📋 Заголовок</button>
                        <button class="add-element-btn" data-element="image">🖼️ Изображение</button>
                        <button class="add-element-btn" data-element="button">🔘 Кнопка</button>
                        <button class="add-element-btn" data-element="card">📦 Карточка</button>
                        <button class="add-element-btn" data-element="section">📦 Раздел</button>
                    </div>
                    
                    <div id="element-properties" class="element-properties" style="display:none;">
                        <h4>Свойства элемента:</h4>
                        <input type="text" id="propName" placeholder="Введите текст" class="prop-input">
                        <input type="text" id="propClass" placeholder="CSS класс" class="prop-input">
                        <button id="propSave" class="prop-btn">💾 Сохранить</button>
                        <button id="propDelete" class="prop-btn delete">🗑️ Удалить</button>
                    </div>
                </div>
                
                <div id="projects-tab" class="editor-tab-content">
                    <h4>Управление проектами</h4>
                    <div id="projects-list" class="items-list"></div>
                    <button id="add-project-btn" class="add-item-btn">➕ Добавить проект</button>
                </div>
                
                <div id="achievements-tab" class="editor-tab-content">
                    <h4>Управление достижениями</h4>
                    <div id="achievements-list" class="items-list"></div>
                    <button id="add-achievement-btn" class="add-item-btn">➕ Добавить достижение</button>
                </div>
                
                <div id="faq-tab" class="editor-tab-content">
                    <h4>Управление FAQ</h4>
                    <div id="faq-list" class="items-list"></div>
                    <button id="add-faq-btn" class="add-item-btn">➕ Добавить вопрос</button>
                </div>
            </div>
            
            <div class="editor-actions">
                <button id="save-to-github" class="editor-action-btn save">💾 Сохранить в GitHub</button>
                <button id="exit-edit" class="editor-action-btn exit">✓ Завершить редактирование</button>
            </div>
        `;
        
        document.body.appendChild(editorPanel);
        this.attachEditorListeners();
    }

    attachEditorListeners() {
        // Переключение табов
        document.querySelectorAll('.editor-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.editor-tab-content').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
                document.getElementById(e.target.dataset.tab + '-tab').classList.add('active');
            });
        });

        // Добавление элементов
        document.querySelectorAll('.add-element-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.addElementToPage(e.target.dataset.element);
            });
        });

        // Управление проектами
        document.getElementById('add-project-btn')?.addEventListener('click', () => {
            const title = prompt('Название проекта:');
            const url = prompt('URL проекта:');
            const image = prompt('URL изображения:');
            if (title) {
                this.projects.push({ title, url, image, id: Date.now() });
                this.saveContentToStorage();
                this.renderProjects();
            }
        });

        // Управление достижениями
        document.getElementById('add-achievement-btn')?.addEventListener('click', () => {
            const title = prompt('Название достижения:');
            const description = prompt('Описание:');
            if (title) {
                this.achievements.push({ title, description, id: Date.now() });
                this.saveContentToStorage();
                this.renderAchievements();
            }
        });

        // Управление FAQ
        document.getElementById('add-faq-btn')?.addEventListener('click', () => {
            const question = prompt('Вопрос:');
            const answer = prompt('Ответ:');
            if (question) {
                this.faqs.push({ question, answer, id: Date.now() });
                this.saveContentToStorage();
                this.renderFAQs();
            }
        });

        // Сохранение в GitHub
        document.getElementById('save-to-github').addEventListener('click', () => {
            this.saveToGitHub();
        });

        // Выход из редактирования
        document.getElementById('exit-edit').addEventListener('click', () => {
            this.exitEditMode();
        });

        document.getElementById('closeEditor').addEventListener('click', () => {
            this.exitEditMode();
        });
    }

    addElementToPage(elementType) {
        const pageFrame = document.querySelector('[data-editable]') || document.body;
        let element;

        switch(elementType) {
            case 'text':
                element = document.createElement('p');
                element.textContent = 'Новый текст';
                break;
            case 'heading':
                element = document.createElement('h2');
                element.textContent = 'Новый заголовок';
                break;
            case 'image':
                element = document.createElement('img');
                element.src = 'https://via.placeholder.com/300x200';
                element.alt = 'Изображение';
                break;
            case 'button':
                element = document.createElement('button');
                element.textContent = 'Кнопка';
                element.className = 'btn';
                break;
            case 'card':
                element = document.createElement('div');
                element.className = 'card';
                element.innerHTML = '<h3>Карточка</h3><p>Содержание</p>';
                break;
            case 'section':
                element = document.createElement('section');
                element.className = 'section';
                element.innerHTML = '<div class="container"><h2>Раздел</h2><p>Содержание раздела</p></div>';
                break;
        }

        if (element) {
            element.contentEditable = true;
            element.className += ' editable-element';
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectElement(element);
            });
            pageFrame.appendChild(element);
            this.selectElement(element);
        }
    }

    selectElement(element) {
        if (this.selectedElement) {
            this.selectedElement.classList.remove('selected-element');
        }
        this.selectedElement = element;
        element.classList.add('selected-element');
        
        // Показываем свойства
        document.getElementById('element-properties').style.display = 'block';
        document.getElementById('propName').value = element.textContent;
        document.getElementById('propClass').value = element.className;
    }

    attachGlobalListeners() {
        // Кликаем на элементы для редактирования
        document.addEventListener('click', (e) => {
            if (!this.editMode) return;
            if (e.target.closest('#editor-panel')) return;
            
            const element = e.target.closest('[data-editable], h1, h2, h3, p, button, img, section, .card, .project, .achievement');
            if (element) {
                e.preventDefault();
                e.stopPropagation();
                this.selectElement(element);
            }
        });
    }

    renderProjects() {
        const list = document.getElementById('projects-list');
        list.innerHTML = this.projects.map(p => `
            <div class="item-card">
                <strong>${p.title}</strong>
                <small>${p.url}</small>
                <button class="item-delete" onclick="editor.deleteProject('${p.id}')">🗑️</button>
            </div>
        `).join('');
    }

    renderAchievements() {
        const list = document.getElementById('achievements-list');
        list.innerHTML = this.achievements.map(a => `
            <div class="item-card">
                <strong>${a.title}</strong>
                <small>${a.description}</small>
                <button class="item-delete" onclick="editor.deleteAchievement('${a.id}')">🗑️</button>
            </div>
        `).join('');
    }

    renderFAQs() {
        const list = document.getElementById('faq-list');
        list.innerHTML = this.faqs.map(f => `
            <div class="item-card">
                <strong>${f.question}</strong>
                <small>${f.answer}</small>
                <button class="item-delete" onclick="editor.deleteFAQ('${f.id}')">🗑️</button>
            </div>
        `).join('');
    }

    deleteProject(id) {
        this.projects = this.projects.filter(p => p.id != id);
        this.saveContentToStorage();
        this.renderProjects();
    }

    deleteAchievement(id) {
        this.achievements = this.achievements.filter(a => a.id != id);
        this.saveContentToStorage();
        this.renderAchievements();
    }

    deleteFAQ(id) {
        this.faqs = this.faqs.filter(f => f.id != id);
        this.saveContentToStorage();
        this.renderFAQs();
    }

    saveContentToStorage() {
        localStorage.setItem('projects', JSON.stringify(this.projects));
        localStorage.setItem('achievements', JSON.stringify(this.achievements));
        localStorage.setItem('faqs', JSON.stringify(this.faqs));
        localStorage.setItem('pageContent', document.body.innerHTML);
    }

    loadContentFromStorage() {
        const saved = localStorage.getItem('pageContent');
        if (saved) {
            document.body.innerHTML = saved;
        }
        this.projects = JSON.parse(localStorage.getItem('projects')) || [];
        this.achievements = JSON.parse(localStorage.getItem('achievements')) || [];
        this.faqs = JSON.parse(localStorage.getItem('faqs')) || [];
    }

    enterEditMode() {
        this.editMode = true;
        document.body.style.border = '3px solid #6366f1';
        document.querySelectorAll('[data-editable], h1, h2, h3, p, button, img, section, .card, .project, .achievement').forEach(el => {
            el.style.outline = '1px dashed #666';
            el.style.cursor = 'pointer';
        });
        alert('🎨 Режим редактирования активирован!\n\nКликните на любой элемент, чтобы отредактировать его.\nДобавьте новые элементы через панель слева.');
    }

    exitEditMode() {
        this.editMode = false;
        document.body.style.border = 'none';
        document.querySelectorAll('[data-editable], h1, h2, h3, p, button, img, section, .card').forEach(el => {
            el.style.outline = 'none';
            el.style.cursor = 'default';
        });
        document.getElementById('editor-panel').style.display = 'none';
    }

    async saveToGitHub() {
        try {
            const content = document.documentElement.outerHTML;
            const blob = new Blob([content], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.currentPage;
            a.click();
            
            alert('✅ Файл готов к загрузке!\n\n1. Скопируйте содержимое в ' + this.currentPage + '\n2. Используйте команду: git add -A && git commit -m "Update page" && git push');
        } catch(err) {
            console.error('Ошибка:', err);
            alert('❌ Ошибка при сохранении');
        }
    }
}

// Инициализация
const editor = new AdvancedPageEditor();

// Кнопка входа в редактирование из админ-панели
function startEditMode() {
    editor.enterEditMode();
}
