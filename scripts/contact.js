class ContactManager {
    constructor() {
        this.form = null;
        this.isSubmitting = false;
        this.init();
    }

    init() {
        this.form = document.getElementById('contactForm');
        if (this.form) {
            this.setupEventListeners();
            this.setupFormValidation();
        }
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Реальное время валидации
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    setupFormValidation() {
        // Добавляем кастомную валидацию
        this.setupCustomValidation();
    }

    setupCustomValidation() {
        const emailField = document.getElementById('email');
        if (emailField) {
            emailField.addEventListener('input', () => {
                if (emailField.validity.typeMismatch) {
                    emailField.setCustomValidity('Пожалуйста, введите корректный email адрес');
                } else {
                    emailField.setCustomValidity('');
                }
            });
        }

        const messageField = document.getElementById('message');
        if (messageField) {
            messageField.addEventListener('input', () => {
                if (messageField.value.length < 10) {
                    messageField.setCustomValidity('Сообщение должно содержать минимум 10 символов');
                } else {
                    messageField.setCustomValidity('');
                }
            });
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        if (this.isSubmitting) return;
        
        // Валидация формы
        if (!this.validateForm()) {
            return;
        }

        this.isSubmitting = true;
        this.showLoadingState();

        try {
            // Имитация отправки формы
            await this.submitForm();
            this.showSuccessMessage();
            this.resetForm();
        } catch (error) {
            this.showErrorMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
        } finally {
            this.isSubmitting = false;
            this.hideLoadingState();
        }
    }

    validateForm() {
        let isValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        this.clearFieldError(field);

        let isValid = true;
        let errorMessage = '';

        // Проверка обязательных полей
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'Это поле обязательно для заполнения';
        }

        // Проверка email
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Пожалуйста, введите корректный email адрес';
            }
        }

        // Проверка длины сообщения
        if (field.name === 'message' && field.value.trim().length < 10) {
            isValid = false;
            errorMessage = 'Сообщение должно содержать минимум 10 символов';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        
        field.classList.add('error');
    }

    clearFieldError(field) {
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        
        field.classList.remove('error');
    }

    async submitForm() {
        // Собираем данные формы
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            company: formData.get('company'),
            subject: formData.get('subject'),
            budget: formData.get('budget'),
            message: formData.get('message'),
            newsletter: formData.get('newsletter') === 'on',
            timestamp: new Date().toISOString(),
            ip: await this.getClientIP()
        };

        // Имитация задержки сети
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Сохраняем сообщение в localStorage (в реальном приложении отправляем на сервер)
        this.saveMessage(data);

        return data;
    }

    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }

    saveMessage(messageData) {
        try {
            // Загружаем существующие сообщения
            const savedData = localStorage.getItem('siteContent');
            let siteData = savedData ? JSON.parse(savedData) : { messages: [] };
            
            if (!siteData.messages) {
                siteData.messages = [];
            }

            // Добавляем новое сообщение
            const newMessage = {
                id: Date.now(),
                ...messageData,
                read: false,
                date: new Date().toISOString()
            };

            siteData.messages.unshift(newMessage);
            
            // Сохраняем обновленные данные
            localStorage.setItem('siteContent', JSON.stringify(siteData));

            // Обновляем аналитику
            this.updateAnalytics();

        } catch (error) {
            console.error('Ошибка сохранения сообщения:', error);
        }
    }

    updateAnalytics() {
        try {
            const savedData = localStorage.getItem('siteContent');
            if (savedData) {
                const siteData = JSON.parse(savedData);
                
                if (!siteData.analytics) {
                    siteData.analytics = {};
                }
                
                if (!siteData.analytics.contactSubmissions) {
                    siteData.analytics.contactSubmissions = 0;
                }
                
                siteData.analytics.contactSubmissions++;
                
                // Добавляем активность
                if (!siteData.analytics.activities) {
                    siteData.analytics.activities = [];
                }
                
                siteData.analytics.activities.unshift({
                    id: Date.now(),
                    type: 'contact',
                    description: 'Новая заявка с формы обратной связи',
                    time: new Date().toISOString(),
                    icon: '📞'
                });

                localStorage.setItem('siteContent', JSON.stringify(siteData));
            }
        } catch (error) {
            console.error('Ошибка обновления аналитики:', error);
        }
    }

    showLoadingState() {
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');

        btnText.style.display = 'none';
        btnLoader.style.display = 'block';
        submitBtn.disabled = true;
    }

    hideLoadingState() {
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');

        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }

    showSuccessMessage() {
        const messageElement = document.getElementById('formMessage');
        messageElement.textContent = 'Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.';
        messageElement.className = 'form-message success';
        messageElement.style.display = 'block';

        // Автоматически скрываем сообщение через 5 секунд
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }

    showErrorMessage(message) {
        const messageElement = document.getElementById('formMessage');
        messageElement.textContent = message;
        messageElement.className = 'form-message error';
        messageElement.style.display = 'block';
    }

    resetForm() {
        this.form.reset();
        
        // Очищаем ошибки
        const errorMessages = this.form.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });
        
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
        });
    }
}

// Добавляем CSS для контактов
const contactStyles = `
    .contact-info {
        padding: 4rem 0;
        background: var(--surface-color);
    }
    
    .contact-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
    }
    
    .contact-card {
        background: var(--background-color);
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        border: 1px solid var(--border-color);
        transition: all 0.3s ease;
    }
    
    .contact-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow);
        border-color: var(--primary-color);
    }
    
    .contact-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .contact-card h3 {
        font-size: 1.25rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }
    
    .contact-card p {
        color: var(--text-secondary);
        margin-bottom: 1rem;
    }
    
    .contact-link {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s ease;
    }
    
    .contact-link:hover {
        color: var(--secondary-color);
    }
    
    .contact-form-section {
        padding: 4rem 0;
    }
    
    .form-container {
        max-width: 600px;
        margin: 0 auto;
        background: var(--surface-color);
        padding: 3rem;
        border-radius: 12px;
        border: 1px solid var(--border-color);
    }
    
    .form-header {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .form-header h2 {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: var(--text-primary);
    }
    
    .form-header p {
        color: var(--text-secondary);
        line-height: 1.5;
    }
    
    .contact-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    
    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .form-group label {
        font-weight: 500;
        color: var(--text-primary);
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        padding: 0.75rem;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: var(--background-color);
        color: var(--text-primary);
        font-size: 1rem;
        transition: border-color 0.3s ease;
        font-family: inherit;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--primary-color);
    }
    
    .form-group textarea {
        resize: vertical;
        min-height: 120px;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444;
    }
    
    .error-message {
        color: #ef4444;
        font-size: 0.8rem;
        display: none;
    }
    
    .form-options {
        margin: 1rem 0;
    }
    
    .checkbox-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .checkmark {
        width: 18px;
        height: 18px;
        border: 2px solid var(--border-color);
        border-radius: 3px;
        position: relative;
        transition: all 0.3s ease;
    }
    
    .checkbox-label input:checked + .checkmark {
        background: var(--primary-color);
        border-color: var(--primary-color);
    }
    
    .checkbox-label input:checked + .checkmark::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
        font-weight: bold;
    }
    
    .submit-btn {
        background: var(--gradient);
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
    }
    
    .submit-btn:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: var(--shadow);
    }
    
    .submit-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
    }
    
    .btn-loader {
        display: none;
    }
    
    .spinner {
        width: 20px;
        height: 20px;
        border: 2px solid transparent;
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto;
    }
    
    .form-message {
        padding: 1rem;
        border-radius: 8px;
        margin-top: 1rem;
        display: none;
    }
    
    .form-message.success {
        background: #10b981;
        color: white;
    }
    
    .form-message.error {
        background: #ef4444;
        color: white;
    }
    
    .form-message.hidden {
        display: none;
    }
    
    /* FAQ секция */
    .faq-section {
        padding: 4rem 0;
        background: var(--surface-color);
    }
    
    .faq-section h2 {
        text-align: center;
        margin-bottom: 3rem;
        font-size: 2.5rem;
    }
    
    .faq-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        max-width: 1000px;
        margin: 0 auto;
    }
    
    .faq-item {
        background: var(--background-color);
        padding: 2rem;
        border-radius: 12px;
        border: 1px solid var(--border-color);
    }
    
    .faq-item h3 {
        font-size: 1.25rem;
        margin-bottom: 1rem;
        color: var(--text-primary);
    }
    
    .faq-item p {
        color: var(--text-secondary);
        line-height: 1.5;
    }
    
    /* Адаптивность */
    @media (max-width: 768px) {
        .form-container {
            padding: 2rem;
            margin: 0 1rem;
        }
        
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .contact-grid {
            grid-template-columns: 1fr;
        }
        
        .faq-grid {
            grid-template-columns: 1fr;
        }
    }
`;

// Добавляем стили в документ
const styleSheet = document.createElement('style');
styleSheet.textContent = contactStyles;
document.head.appendChild(styleSheet);

// Инициализация менеджера контактов
document.addEventListener('DOMContentLoaded', () => {
    window.contactManager = new ContactManager();
});