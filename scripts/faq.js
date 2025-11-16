// FAQ аккордеон функционал
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        // Устанавливаем начальное состояние
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.4s ease, padding 0.4s ease';
        answer.style.paddingTop = '0';
        answer.style.paddingBottom = '0';
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Закрываем все остальные
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherToggle = otherItem.querySelector('.faq-toggle');
                    otherAnswer.style.maxHeight = '0';
                    otherAnswer.style.paddingTop = '0';
                    otherAnswer.style.paddingBottom = '0';
                    otherToggle.textContent = '+';
                }
            });
            
            // Переключаем текущий
            if (isOpen) {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
                answer.style.paddingTop = '0';
                answer.style.paddingBottom = '0';
                toggle.textContent = '+';
            } else {
                item.classList.add('active');
                // Используем большую высоту для полного отображения
                const scrollHeight = answer.scrollHeight;
                answer.style.maxHeight = scrollHeight + 100 + 'px'; // Добавляем запас
                answer.style.paddingTop = '1.5rem';
                answer.style.paddingBottom = '1.5rem';
                toggle.textContent = '−';
            }
        });
    });
});

