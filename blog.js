document.addEventListener('DOMContentLoaded', function () {
    const blogCards = document.querySelectorAll('.blog-card');
    
    // Отметка прочитанного поста
    blogCards.forEach((card, index) => {
        const readMore = card.querySelector('.read-more');
        const title = card.querySelector('h3').textContent;

        // Проверка, был ли прочитан
        const isRead = localStorage.getItem(`postRead_${index}`);
        if (isRead === 'true') {
            card.style.opacity = '0.6';
            readMore.textContent = 'Прочитано ✔';
        }

        // Клик по "Читать далее"
        readMore.addEventListener('click', function () {
            localStorage.setItem(`postRead_${index}`, 'true');
        });
    });

    // Пример поиска по названиям статей
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Поиск по блогу...';
    searchInput.style.cssText = 'margin-bottom: 20px; padding: 10px; width: 100%; max-width: 400px;';
    document.querySelector('.blog-container').insertBefore(searchInput, document.querySelector('.blog-grid'));

    searchInput.addEventListener('input', function () {
        const value = this.value.toLowerCase();
        blogCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            card.style.display = title.includes(value) ? 'block' : 'none';
        });
    });
});
