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

        // Sürükle-bırak desteği
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
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Url = e.target.result;
            imagePreview.src = base64Url;
            linkOutput.value = base64Url;
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (!linkOutput.value) return;
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
