
// KARANLIK MOD
const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("pratikcep-theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    themeToggle.textContent = isDark ? "☀" : "☾";

    localStorage.setItem(
        "pratikcep-theme",
        isDark ? "dark" : "light"
    );
});


// ARAÇ ARAMA
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const toolCards = document.querySelectorAll(".tool-card");
const noResults = document.getElementById("noResults");

function filterTools() {
    const searchText = searchInput.value
        .toLocaleLowerCase("tr-TR")
        .trim();

    let visibleCount = 0;

    toolCards.forEach(card => {
        const name = card.dataset.name
            .toLocaleLowerCase("tr-TR");

        const description = card.querySelector("p").textContent
            .toLocaleLowerCase("tr-TR");

        const matches =
            name.includes(searchText) ||
            description.includes(searchText);

        card.style.display = matches ? "block" : "none";

        if (matches) visibleCount++;
    });

    noResults.hidden = visibleCount !== 0;
}

searchButton.addEventListener("click", filterTools);

searchInput.addEventListener("input", filterTools);

searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        filterTools();
        document.getElementById("araclar").scrollIntoView({
            behavior: "smooth"
        });
    }
});


// KATEGORİ FİLTRESİ
const categoryButtons = document.querySelectorAll(".category-btn");

categoryButtons.forEach(button => {
    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const selectedCategory = button.dataset.category;
        let visibleCount = 0;

        toolCards.forEach(card => {
            const matches =
                selectedCategory === "all" ||
                card.dataset.category === selectedCategory;

            card.style.display = matches ? "block" : "none";

            if (matches) visibleCount++;
        });

        searchInput.value = "";
        noResults.hidden = visibleCount !== 0;
    });
});
