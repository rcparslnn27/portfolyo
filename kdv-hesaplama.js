document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateVatBtn');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            const amountInput = parseFloat(document.getElementById('amountInput').value);
            const vatRate = parseFloat(document.getElementById('vatRate').value);
            const calcType = document.getElementById('calcType').value;
            const resultBox = document.getElementById('vatResultBox');

            if (isNaN(amountInput) || amountInput <= 0) {
                alert('Lütfen geçerli bir tutar girin.');
                return;
            }

            let exclVat = 0;
            let vatAmount = 0;
            let inclVat = 0;

            if (calcType === 'haric') {
                // KDV Hariçten Dahile
                exclVat = amountInput;
                vatAmount = exclVat * (vatRate / 100);
                inclVat = exclVat + vatAmount;
            } else {
                // KDV Dahilden Hariçe
                inclVat = amountInput;
                exclVat = inclVat / (1 + vatRate / 100);
                vatAmount = inclVat - exclVat;
            }

            // Sonuçları ekrana yazdır (Virgülden sonra 2 basamak)
            document.getElementById('resExclVat').textContent = exclVat.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';
            document.getElementById('resVatAmount').textContent = vatAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';
            document.getElementById('resInclVat').textContent = inclVat.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';

            resultBox.style.display = 'block';
        });
    }
});
