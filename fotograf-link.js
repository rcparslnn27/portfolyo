document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const previewContainer = document.getElementById('previewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const linkOutput = document.getElementById('linkOutput');
    const copyBtn = document.getElementById('copyLinkBtn');

    const IMGBB_API_KEY = 'd17208d2940608fa8fa4408df51cc4b6'; 

    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                uploadToCloud(file);
            }
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = 'var(--primary)';
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.style.borderColor = 'var(--border)';
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.style.borderColor = 'var(--border)';
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                uploadToCloud(file);
            } else {
                alert('Lütfen geçerli bir görsel dosyası yükleyin.');
            }
        });
    }

    function uploadToCloud(file) {
        linkOutput.value = "Yükleniyor, lütfen bekleyin...";
        previewContainer.style.display = 'block';

        const formData = new FormData();
        formData.append('image', file);

        fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('API Yanıtı:', data); // Konsoldan yanıtı görebilmek için
            if (data && data.success) {
                const shortUrl = data.data.url;
                imagePreview.src = shortUrl;
                linkOutput.value = shortUrl;
            } else {
                const errorMsg = data.error ? data.error.message : 'Bilinmeyen hata';
                alert('Yükleme hatası: ' + errorMsg);
                linkOutput.value = "Yükleme başarısız: "  + errorMsg;
            }
        })
        .catch(error => {
            console.error('Fetch Hatası:', error);
            alert('Bağlantı hatası oluştu. Konsolu kontrol edin.');
            linkOutput.value = "Ağ hatası oluştu.";
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (!linkOutput.value || linkOutput.value.includes('Yükleniyor')) return;
            navigator.clipboard.writeText(linkOutput.value).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Kopyalandı!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1500);
            });
        });
    }
});
