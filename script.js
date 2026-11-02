document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const toolCards = document.querySelectorAll('.tool-card');
    const noResults = document.getElementById('noResults');

    // 1. Kategori Filtreleme Mantığı
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-category');
            filterTools(category, searchInput.value);
        });
    });

    // 2. Filtreleme ve Arama Motoru Fonksiyonu
    function filterTools(category, query) {
        let visibleCount = 0;
        query = query.toLowerCase().trim();

        toolCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardName = card.getAttribute('data-name');
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            const cardDesc = card.querySelector('p').textContent.toLowerCase();

            const matchesCategory = category === 'all' || cardCategory === category;
            const matchesQuery = cardName.includes(query) || cardTitle.includes(query) || cardDesc.includes(query);

            if (matchesCategory && matchesQuery) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Eğer eşleşen araç yoksa "bulunamadı" mesajını göster
        if (visibleCount === 0) {
            noResults.hidden = false;
        } else {
            noResults.hidden = true;
        }
    }

    // Arama kutusuna yazıldıkça anlık filtreleme
    searchInput.addEventListener('input', (e) => {
        const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
        filterTools(activeCategory, e.target.value);
    });

    // Ara butonuna tıklandığında filtreleme
    searchButton.addEventListener('click', () => {
        const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
        filterTools(activeCategory, searchInput.value);
    });
});
