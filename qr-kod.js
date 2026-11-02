document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateQrBtn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const textInput = document.getElementById('qrInput').value.trim();
            const qrContainer = document.getElementById('qrcode');
            const resultBox = document.getElementById('qrResultBox');

            if (!textInput) {
                alert('Lütfen dönüştürmek için bir metin veya bağlantı girin.');
                return;
            }

            // Önceki QR kodu temizle
            qrContainer.innerHTML = '';

            // Yeni QR kod oluştur
            new QRCode(qrContainer, {
                text: textInput,
                width: 180,
                height: 180,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            resultBox.style.display = 'flex';

            // Canvas üzerinden indirme bağlantısını ayarla (Kısa bir gecikmeyle canvas oluşmasını bekliyoruz)
            setTimeout(() => {
                const canvas = qrContainer.querySelector('canvas');
                const downloadBtn = document.getElementById('downloadQrBtn');
                if (canvas) {
                    const imageUrl = canvas.toDataURL("image/png");
                    downloadBtn.href = imageUrl;
                }
            }, 100);
        });
    }
});
