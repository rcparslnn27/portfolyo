document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const wordCountEl = document.getElementById('wordCount');
    const charCountEl = document.getElementById('charCount');
    const charNoSpaceCountEl = document.getElementById('charNoSpaceCount');
    const readingTimeEl = document.getElementById('readingTime');
    const clearBtn = document.getElementById('clearTextBtn');

    if (!textInput) {
        console.error('textInput bulunamadı, HTML ID\'sini kontrol et.');
        return;
    }

    const WORDS_PER_MINUTE = 200;
    const sayiFormat = (n) => n.toLocaleString('tr-TR');

    // Emoji vb. karakterleri doğru saymak için
    const karakterSay = (metin) => Array.from(metin).length;

    function setText(el, value) {
        if (el) el.textContent = value;
    }

    function formatReadingTime(wordCount) {
        if (wordCount === 0) return '0 sn';

        const seconds = Math.ceil((wordCount / WORDS_PER_MINUTE) * 60);
        if (seconds < 60) return `${seconds} sn`;

        const minutes = Math.floor(seconds / 60);
        const remaining = seconds % 60;
        return remaining === 0 ? `${minutes} dk` : `${minutes} dk ${remaining} sn`;
    }

    function guncelle() {
        const text = textInput.value;
        const trimmed = text.trim();

        const charCount = karakterSay(text);
        const charNoSpaceCount = karakterSay(text.replace(/\s/g, ''));
        const wordCount = trimmed === '' ? 0 : trimmed.split(/\s+/).length;

        setText(wordCountEl, sayiFormat(wordCount));
        setText(charCountEl, sayiFormat(charCount));
        setText(charNoSpaceCountEl, sayiFormat(charNoSpaceCount));
        setText(readingTimeEl, formatReadingTime(wordCount));
    }

    textInput.addEventListener('input', guncelle);

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            textInput.value = '';
            guncelle();
            textInput.focus();
        });
    }

    // Sayfa açıldığında kutuda metin varsa (tarayıcı geri yüklediyse) sayaçları güncelle
    guncelle();
});
