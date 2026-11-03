document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const previewContainer = document.getElementById('previewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const linkOutput = document.getElementById('linkOutput');
    const copyBtn = document.getElementById('copyLinkBtn');

    if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                processImage(file);
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
                processImage(file);
            } else {
                alert('Lütfen geçerli bir görsel dosyası yükleyin.');
            }
        });
    }

    function processImage(file) {
        linkOutput.value = "İşleniyor...";
        previewContainer.style.display = 'block';

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                // Görseli optimize etmek için canvas kullanıyoruz (boyutu küçültür)
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Temiz ve sıkıştırılmış veri bağlantısı oluşturur
                const optimizedUrl = canvas.toDataURL('image/jpeg', 0.8);
                imagePreview.src = optimizedUrl;
                linkOutput.value = optimizedUrl;
            }
        };
        reader.readAsDataURL(file);
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (!linkOutput.value || linkOutput.value.includes('İşleniyor')) return;
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
