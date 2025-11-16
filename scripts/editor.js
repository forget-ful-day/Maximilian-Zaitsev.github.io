// Редактор страниц - Wix-like функционал

class PageEditor {
    constructor() {
        this.currentPage = 'index.html';
        this.selectedElement = null;
        this.zoomLevel = 100;
        this.viewMode = 'desktop';
        this.history = [];
        this.historyIndex = -1;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadPage();
        this.setupDragAndDrop();
        this.setupFileUpload();
    }

    setupEventListeners() {
        // Выбор страницы
        document.getElementById('pageSelector').addEventListener('change', (e) => {
            this.currentPage = e.target.value;
            this.loadPage();
        });

        // Кнопки блоков
        document.querySelectorAll('.block-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const blockType = item.dataset.block;
                this.addBlock(blockType);
            });
        });

        // Сохранение
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.savePage();
        });

        // Превью
        document.getElementById('previewBtn').addEventListener('click', () => {
            window.open(this.currentPage, '_blank');
        });

        // Zoom
        document.getElementById('zoomInBtn').addEventListener('click', () => {
            this.setZoom(this.zoomLevel + 10);
        });

        document.getElementById('zoomOutBtn').addEventListener('click', () => {
            this.setZoom(this.zoomLevel - 10);
        });

        // View modes
        document.getElementById('mobileView').addEventListener('click', () => {
            this.setViewMode('mobile');
        });

        document.getElementById('tabletView').addEventListener('click', () => {
            this.setViewMode('tablet');
        });

        document.getElementById('desktopView').addEventListener('click', () => {
            this.setViewMode('desktop');
        });

        // Undo/Redo
        document.getElementById('undoBtn').addEventListener('click', () => {
            this.undo();
        });

        document.getElementById('redoBtn').addEventListener('click', () => {
            this.redo();
        });

        // Клик на canvas для выбора элемента
        document.getElementById('canvasContent').addEventListener('click', (e) => {
            if (e.target.closest('.editable-element')) {
                this.selectElement(e.target.closest('.editable-element'));
            } else {
                this.deselectElement();
            }
        });

        // Поиск блоков
        document.getElementById('blocksSearch').addEventListener('input', (e) => {
            this.filterBlocks(e.target.value);
        });
    }

    async loadPage() {
        try {
            const response = await fetch(this.currentPage);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Извлекаем body содержимое
            const bodyContent = doc.body.innerHTML;
            const canvasContent = document.getElementById('canvasContent');
            
            // Загружаем контент из JSON если есть
            const savedContent = await this.loadSavedContent();
            if (savedContent) {
                canvasContent.innerHTML = savedContent;
            } else {
                canvasContent.innerHTML = bodyContent;
            }

            // Делаем элементы редактируемыми
            this.makeElementsEditable();
            this.saveToHistory();
        } catch (error) {
            console.error('Ошибка загрузки страницы:', error);
        }
    }

    async loadSavedContent() {
        try {
            const response = await fetch('data/site-content.json');
            const data = await response.json();
            return data.pages?.[this.currentPage]?.htmlContent || null;
        } catch (error) {
            return null;
        }
    }

    makeElementsEditable() {
        const canvas = document.getElementById('canvasContent');
        
        // Добавляем класс editable-element ко всем основным элементам
        canvas.querySelectorAll('section, div, h1, h2, h3, h4, h5, h6, p, img, button, a').forEach(el => {
            if (!el.closest('.editable-element')) {
                el.classList.add('editable-element');
                el.setAttribute('contenteditable', 'true');
            }
        });

        // Обработчики для редактирования
        canvas.querySelectorAll('.editable-element').forEach(el => {
            el.addEventListener('blur', () => {
                this.saveToHistory();
            });
        });
    }

    addBlock(blockType) {
        const canvas = document.getElementById('canvasContent');
        const block = this.createBlock(blockType);
        
        // Добавляем в конец canvas
        canvas.appendChild(block);
        
        // Выбираем новый блок
        this.selectElement(block);
        this.saveToHistory();
    }

    createBlock(blockType) {
        const block = document.createElement('div');
        block.className = `editable-element block-${blockType}`;
        block.setAttribute('contenteditable', 'false');
        block.dataset.blockType = blockType;

        // Создаем контролы
        const controls = document.createElement('div');
        controls.className = 'element-controls';
        controls.innerHTML = `
            <button onclick="editor.deleteElement(this)" title="Удалить">
                <i class="fas fa-trash"></i>
            </button>
            <button onclick="editor.duplicateElement(this)" title="Дублировать">
                <i class="fas fa-copy"></i>
            </button>
            <button onclick="editor.moveUp(this)" title="Вверх">
                <i class="fas fa-arrow-up"></i>
            </button>
            <button onclick="editor.moveDown(this)" title="Вниз">
                <i class="fas fa-arrow-down"></i>
            </button>
        `;
        block.appendChild(controls);

        // Создаем содержимое блока в зависимости от типа
        const content = this.getBlockContent(blockType);
        block.appendChild(content);

        return block;
    }

    getBlockContent(blockType) {
        const content = document.createElement('div');
        content.className = 'block-content';

        switch(blockType) {
            case 'text':
                content.innerHTML = '<p>Текст блока. Нажмите для редактирования.</p>';
                content.setAttribute('contenteditable', 'true');
                break;
            case 'heading':
                content.innerHTML = '<h2>Заголовок</h2>';
                content.setAttribute('contenteditable', 'true');
                break;
            case 'button':
                content.innerHTML = '<button class="block-button">Кнопка</button>';
                break;
            case 'image':
                content.innerHTML = '<div class="block-image"><img src="https://via.placeholder.com/400x300" alt="Изображение"></div>';
                content.querySelector('img').addEventListener('click', () => {
                    this.openImageModal(content.querySelector('img'));
                });
                break;
            case 'video':
                content.innerHTML = '<div class="block-video"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe></div>';
                break;
            case 'divider':
                content.innerHTML = '<div class="block-divider"></div>';
                break;
            case 'section':
                content.innerHTML = '<div class="block-section"><p>Секция</p></div>';
                break;
            case 'container':
                content.innerHTML = '<div class="block-container"><p>Контейнер</p></div>';
                break;
            case 'row':
                content.innerHTML = '<div class="block-row"><div class="block-column">Колонка 1</div><div class="block-column">Колонка 2</div></div>';
                break;
            case 'column':
                content.innerHTML = '<div class="block-column"><p>Колонка</p></div>';
                break;
            case 'grid':
                content.innerHTML = '<div class="block-grid"><div>Элемент 1</div><div>Элемент 2</div><div>Элемент 3</div></div>';
                break;
            case 'card':
                content.innerHTML = '<div class="block-card"><h3>Заголовок карточки</h3><p>Описание карточки</p></div>';
                break;
            case 'gallery':
                content.innerHTML = '<div class="block-gallery"><img src="https://via.placeholder.com/200" alt="1"><img src="https://via.placeholder.com/200" alt="2"><img src="https://via.placeholder.com/200" alt="3"></div>';
                break;
            case 'form':
                content.innerHTML = `
                    <form class="block-form">
                        <input type="text" placeholder="Имя">
                        <input type="email" placeholder="Email">
                        <textarea placeholder="Сообщение"></textarea>
                        <button type="submit">Отправить</button>
                    </form>
                `;
                break;
            case 'slider':
                content.innerHTML = '<div class="block-slider"><div class="slide">Слайд 1</div><div class="slide">Слайд 2</div></div>';
                break;
            case 'social-links':
                content.innerHTML = '<div class="block-social"><a href="#">GitHub</a><a href="#">LinkedIn</a><a href="#">Twitter</a></div>';
                break;
            default:
                content.innerHTML = `<p>Блок ${blockType}</p>`;
        }

        return content;
    }

    selectElement(element) {
        // Убираем выделение с предыдущего
        if (this.selectedElement) {
            this.selectedElement.classList.remove('selected');
        }

        // Выделяем новый
        this.selectedElement = element;
        element.classList.add('selected');

        // Показываем свойства
        this.showProperties(element);
    }

    deselectElement() {
        if (this.selectedElement) {
            this.selectedElement.classList.remove('selected');
            this.selectedElement = null;
        }
        this.hideProperties();
    }

    showProperties(element) {
        const propertiesPanel = document.getElementById('propertiesContent');
        const blockType = element.dataset.blockType || 'element';

        propertiesPanel.innerHTML = this.getPropertiesHTML(element, blockType);
        
        // Настраиваем обработчики свойств
        this.setupPropertyHandlers(element);
    }

    getPropertiesHTML(element, blockType) {
        const styles = window.getComputedStyle(element);
        
        return `
            <div class="property-group">
                <div class="property-group-title">Общие</div>
                <div class="property-item">
                    <label>ID</label>
                    <input type="text" id="prop-id" value="${element.id || ''}" placeholder="id">
                </div>
                <div class="property-item">
                    <label>Класс</label>
                    <input type="text" id="prop-class" value="${element.className || ''}" placeholder="class">
                </div>
            </div>

            <div class="property-group">
                <div class="property-group-title">Отступы</div>
                <div class="property-grid">
                    <div class="property-item">
                        <label>Padding Top</label>
                        <input type="number" id="prop-padding-top" value="${parseInt(styles.paddingTop) || 0}">
                    </div>
                    <div class="property-item">
                        <label>Padding Bottom</label>
                        <input type="number" id="prop-padding-bottom" value="${parseInt(styles.paddingBottom) || 0}">
                    </div>
                    <div class="property-item">
                        <label>Padding Left</label>
                        <input type="number" id="prop-padding-left" value="${parseInt(styles.paddingLeft) || 0}">
                    </div>
                    <div class="property-item">
                        <label>Padding Right</label>
                        <input type="number" id="prop-padding-right" value="${parseInt(styles.paddingRight) || 0}">
                    </div>
                </div>
            </div>

            <div class="property-group">
                <div class="property-group-title">Цвета</div>
                <div class="property-item">
                    <label>Фон</label>
                    <input type="color" id="prop-bg-color" value="${this.rgbToHex(styles.backgroundColor)}">
                </div>
                <div class="property-item">
                    <label>Цвет текста</label>
                    <input type="color" id="prop-text-color" value="${this.rgbToHex(styles.color)}">
                </div>
            </div>

            <div class="property-group">
                <div class="property-group-title">Размеры</div>
                <div class="property-item">
                    <label>Ширина</label>
                    <input type="text" id="prop-width" value="${styles.width || 'auto'}" placeholder="auto">
                </div>
                <div class="property-item">
                    <label>Высота</label>
                    <input type="text" id="prop-height" value="${styles.height || 'auto'}" placeholder="auto">
                </div>
            </div>

            <div class="property-group">
                <div class="property-group-title">Действия</div>
                <button class="btn-secondary" onclick="editor.deleteElement(editor.selectedElement)" style="width: 100%; margin-bottom: 0.5rem;">
                    <i class="fas fa-trash"></i> Удалить
                </button>
                <button class="btn-secondary" onclick="editor.duplicateElement(editor.selectedElement)" style="width: 100%;">
                    <i class="fas fa-copy"></i> Дублировать
                </button>
            </div>
        `;
    }

    setupPropertyHandlers(element) {
        // ID
        document.getElementById('prop-id')?.addEventListener('input', (e) => {
            element.id = e.target.value;
            this.saveToHistory();
        });

        // Class
        document.getElementById('prop-class')?.addEventListener('input', (e) => {
            element.className = e.target.value;
            this.saveToHistory();
        });

        // Padding
        ['top', 'bottom', 'left', 'right'].forEach(side => {
            document.getElementById(`prop-padding-${side}`)?.addEventListener('input', (e) => {
                element.style[`padding${side.charAt(0).toUpperCase() + side.slice(1)}`] = e.target.value + 'px';
                this.saveToHistory();
            });
        });

        // Colors
        document.getElementById('prop-bg-color')?.addEventListener('input', (e) => {
            element.style.backgroundColor = e.target.value;
            this.saveToHistory();
        });

        document.getElementById('prop-text-color')?.addEventListener('input', (e) => {
            element.style.color = e.target.value;
            this.saveToHistory();
        });

        // Sizes
        document.getElementById('prop-width')?.addEventListener('input', (e) => {
            element.style.width = e.target.value;
            this.saveToHistory();
        });

        document.getElementById('prop-height')?.addEventListener('input', (e) => {
            element.style.height = e.target.value;
            this.saveToHistory();
        });
    }

    hideProperties() {
        document.getElementById('propertiesContent').innerHTML = `
            <div class="no-selection">
                <i class="fas fa-mouse-pointer"></i>
                <p>Выберите элемент для редактирования</p>
            </div>
        `;
    }

    deleteElement(element) {
        if (element && element.parentNode) {
            element.remove();
            this.deselectElement();
            this.saveToHistory();
        }
    }

    duplicateElement(element) {
        if (element) {
            const clone = element.cloneNode(true);
            element.parentNode.insertBefore(clone, element.nextSibling);
            this.selectElement(clone);
            this.saveToHistory();
        }
    }

    moveUp(element) {
        const parent = element.parentNode;
        const prev = element.previousElementSibling;
        if (prev) {
            parent.insertBefore(element, prev);
            this.saveToHistory();
        }
    }

    moveDown(element) {
        const parent = element.parentNode;
        const next = element.nextElementSibling;
        if (next) {
            parent.insertBefore(element, next.nextSibling);
            this.saveToHistory();
        }
    }

    setupDragAndDrop() {
        const canvas = document.getElementById('canvasContent');
        
        // Drag блоков из панели
        document.querySelectorAll('.block-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('blockType', item.dataset.block);
            });
        });

        // Drop на canvas
        canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
            canvas.classList.add('drag-over');
        });

        canvas.addEventListener('dragleave', () => {
            canvas.classList.remove('drag-over');
        });

        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            canvas.classList.remove('drag-over');
            const blockType = e.dataTransfer.getData('blockType');
            if (blockType) {
                this.addBlock(blockType);
            }
        });
    }

    setZoom(level) {
        this.zoomLevel = Math.max(50, Math.min(200, level));
        const canvas = document.getElementById('canvasContent');
        canvas.style.transform = `scale(${this.zoomLevel / 100})`;
        canvas.style.transformOrigin = 'top center';
        document.getElementById('zoomLevel').textContent = `${this.zoomLevel}%`;
    }

    setViewMode(mode) {
        this.viewMode = mode;
        const canvas = document.getElementById('canvasContent');
        document.querySelectorAll('.canvas-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        canvas.classList.remove('mobile-view', 'tablet-view');
        
        if (mode === 'mobile') {
            canvas.classList.add('mobile-view');
            document.getElementById('mobileView').classList.add('active');
        } else if (mode === 'tablet') {
            canvas.classList.add('tablet-view');
            document.getElementById('tabletView').classList.add('active');
        } else {
            document.getElementById('desktopView').classList.add('active');
        }
    }

    filterBlocks(search) {
        const searchLower = search.toLowerCase();
        document.querySelectorAll('.block-item').forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchLower) ? 'flex' : 'none';
        });
    }

    saveToHistory() {
        const canvas = document.getElementById('canvasContent');
        const html = canvas.innerHTML;
        
        // Удаляем будущее из истории если есть
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(html);
        this.historyIndex = this.history.length - 1;
        
        // Ограничиваем историю
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            document.getElementById('canvasContent').innerHTML = this.history[this.historyIndex];
            this.makeElementsEditable();
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            document.getElementById('canvasContent').innerHTML = this.history[this.historyIndex];
            this.makeElementsEditable();
        }
    }

    async savePage() {
        const canvas = document.getElementById('canvasContent');
        const htmlContent = canvas.innerHTML;

        try {
            // Загружаем текущий JSON
            const response = await fetch('data/site-content.json');
            const data = await response.json();

            // Сохраняем HTML контент страницы
            if (!data.pages) data.pages = {};
            if (!data.pages[this.currentPage]) data.pages[this.currentPage] = {};
            data.pages[this.currentPage].htmlContent = htmlContent;
            data.pages[this.currentPage].lastModified = new Date().toISOString();

            // Сохраняем в localStorage (для демо)
            localStorage.setItem('siteContent', JSON.stringify(data));

            // В реальном приложении здесь был бы запрос на сервер
            alert('Страница сохранена!');
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            alert('Ошибка сохранения страницы');
        }
    }

    openImageModal(imgElement) {
        document.getElementById('imageModal').classList.add('active');
        this.currentImageElement = imgElement;
    }

    // Загрузка файлов из проводника
    setupFileUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const imageInput = document.getElementById('imageInput');
        
        if (uploadArea && imageInput) {
            // Клик по области загрузки
            uploadArea.addEventListener('click', () => {
                imageInput.click();
            });

            // Drag & Drop
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--primary-color)';
                uploadArea.style.background = 'rgba(99, 102, 241, 0.1)';
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.style.borderColor = 'var(--border-color)';
                uploadArea.style.background = 'transparent';
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.borderColor = 'var(--border-color)';
                uploadArea.style.background = 'transparent';
                
                const files = Array.from(e.dataTransfer.files);
                files.forEach(file => {
                    if (file.type.startsWith('image/')) {
                        this.handleImageUpload(file);
                    } else if (file.type.startsWith('video/')) {
                        this.handleVideoUpload(file);
                    }
                });
            });

            // Выбор файлов
            imageInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                files.forEach(file => {
                    if (file.type.startsWith('image/')) {
                        this.handleImageUpload(file);
                    } else if (file.type.startsWith('video/')) {
                        this.handleVideoUpload(file);
                    }
                });
            });
        }
    }

    handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            
            // Если есть выбранный элемент изображения, обновляем его
            if (this.currentImageElement) {
                this.currentImageElement.src = imageUrl;
                closeModal('imageModal');
            } else {
                // Иначе создаем новый блок изображения
                const imageBlock = this.createBlock('image');
                const img = imageBlock.querySelector('img');
                if (img) {
                    img.src = imageUrl;
                }
                document.getElementById('canvasContent').appendChild(imageBlock);
                this.selectElement(imageBlock);
            }
            
            this.saveToHistory();
        };
        reader.readAsDataURL(file);
    }

    handleVideoUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const videoUrl = e.target.result;
            
            // Создаем блок видео
            const videoBlock = this.createBlock('video');
            const video = document.createElement('video');
            video.src = videoUrl;
            video.controls = true;
            video.style.width = '100%';
            video.style.height = 'auto';
            
            const content = videoBlock.querySelector('.block-content');
            if (content) {
                content.innerHTML = '';
                content.appendChild(video);
            }
            
            document.getElementById('canvasContent').appendChild(videoBlock);
            this.selectElement(videoBlock);
            this.saveToHistory();
        };
        reader.readAsDataURL(file);
    }

    rgbToHex(rgb) {
        if (rgb === 'rgba(0, 0, 0, 0)' || rgb === 'transparent') return '#000000';
        const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!match) return '#000000';
        return '#' + [1, 2, 3].map(i => {
            const hex = parseInt(match[i]).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
}

// Инициализация редактора
let editor;
document.addEventListener('DOMContentLoaded', () => {
    editor = new PageEditor();
});

// Функции для модального окна
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Обработчик загрузки изображения (улучшенный)
document.addEventListener('DOMContentLoaded', () => {
    const imageUrlInput = document.getElementById('imageUrlInput');
    const insertBtn = document.getElementById('insertImageBtn');

    if (insertBtn) {
        insertBtn.addEventListener('click', () => {
            if (editor && editor.currentImageElement) {
                const url = imageUrlInput?.value || document.getElementById('previewImg')?.src;
                if (url) {
                    editor.currentImageElement.src = url;
                    closeModal('imageModal');
                }
            }
        });
    }
});
