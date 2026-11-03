document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const wordCountEl = document.getElementById('wordCount');
    const charCountEl = document.getElementById('charCount');
    const charNoSpaceCountEl = document.getElementById('charNoSpaceCount');
    const readingTimeEl = document.getElementById('readingTime');
    const clearBtn = document.getElementById('clearTextBtn');

    if (textInput) {
        textInput.addEventListener('input', () => {
            const text = textInput.value;

            // Karakter (boşluk dahil)
            const charCount = text.length;

            // Karakter (boşluksuz)
            const charNoSpaceCount = text.replace(/\s/g, '').length;

            // Kelime sayısı (boşluklara göre ayırıp boşlukları filtrele)
            const words = text.trim() === '' ? [] : text.trim().split(/\s+/);
            const wordCount = words.length;

            // Tahmini okuma süresi (Ortalama dakikada 200 kelime varsayımı)
            const seconds = Math.ceil((wordCount / 200) * 60);
            let readingTimeText = '';
            if (seconds < 60) {
                readingTimeText = `${seconds} sn`;
            } else {
                const minutes = Math.floor(seconds / 60);
                const remainingSecs = seconds % 60;
                readingTimeText = `${minutes} dk ${remainingSecs} sn`;
            }

            // Ekrana yansıt
            wordCountEl.textContent = wordCount.toLocaleString('tr-TR');
            charCountEl.textContent = charCount.toLocaleString('tr-TR');
            charNoSpaceCountEl.textContent = charNoSpaceCount.toLocaleString('tr-TR');
            readingTimeEl.textContent = wordCount === 0 ? '0 sn' : readingTimeText;
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            textInput.value = '';
            // Input eventini tetikleyerek sayaçları sıfırla
            textInput.dispatchEvent(new Event('input'));
        });
    }
});
