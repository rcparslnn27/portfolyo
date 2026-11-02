document.addEventListener('DOMContentLoaded', () => {
    // 1. Dark Mode (Gece/Gündüz Modu) Mantığı
    const themeToggle = document.getElementById('themeToggle');
    
    // Daha önceden seçilen temayı hafızadan yükle
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        if (themeToggle) themeToggle.textContent = '☀️';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            
            if (document.body.classList.contains('dark')) {
                themeToggle.textContent = '☀️';
                localStorage.setItem('theme', 'dark');
            } else {
                themeToggle.textContent = '🌙';
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // 2. Arama ve Kategori Filtreleme
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const toolCards = document.querySelectorAll('.tool-card');
    const noResults = document.getElementById('noResults');

    if (categoryBtns.length > 0 && toolCards.length > 0) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.getAttribute('data-category');
                filterTools(category, searchInput ? searchInput.value : '');
            });
        });

        function filterTools(category, query) {
            let visibleCount = 0;
            query = query.toLowerCase().trim();

            toolCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                const cardName = card.getAttribute('data-name') || '';
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

            if (noResults) {
                if (visibleCount === 0) {
                    noResults.hidden = false;
                } else {
                    noResults.hidden = true;
                }
            }
        }

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
                filterTools(activeCategory, e.target.value);
            });
        }

        if (searchButton && searchInput) {
            searchButton.addEventListener('click', () => {
                const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
                filterTools(activeCategory, searchInput.value);
            });
        }
    }
});
