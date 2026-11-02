document.addEventListener('DOMContentLoaded', () => {
    const sayiInput = document.getElementById('sayi');
    const yuzdeInput = document.getElementById('yuzde');
    const hesaplaBtn = document.getElementById('hesaplaBtn');
    const resultBox = document.getElementById('resultBox');
    const sonucEl = document.getElementById('sonuc');

    hesaplaBtn.addEventListener('click', () => {
        const sayi = parseFloat(sayiInput.value);
        const yuzde = parseFloat(yuzdeInput.value);

        if (isNaN(sayi) || isNaN(yuzde)) {
            alert('Lütfen geçerli sayılar giriniz!');
            return;
        }

        // Yüzde Hesaplama Formülü: (Sayı * Yüzde) / 100
        const hesaplananSonuc = (sayi * yuzde) / 100;

        sonucEl.textContent = hesaplananSonuc.toLocaleString('tr-TR');
        resultBox.style.display = 'block';
    });
});
