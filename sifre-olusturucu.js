document.addEventListener('DOMContentLoaded', () => {
    const passwordOutput = document.getElementById('passwordOutput');
    const copyBtn = document.getElementById('copyPasswordBtn');
    const lengthRange = document.getElementById('lengthRange');
    const lengthValue = document.getElementById('lengthValue');
    const generateBtn = document.getElementById('generatePasswordBtn');
    
    const uppercaseCheck = document.getElementById('includeUppercase');
    const lowercaseCheck = document.getElementById('includeLowercase');
    const numbersCheck = document.getElementById('includeNumbers');
    const symbolsCheck = document.getElementById('includeSymbols');

    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Uzunluk slider değiştiğinde değeri güncelle
    if (lengthRange) {
        lengthRange.addEventListener('input', () => {
            lengthValue.textContent = lengthRange.value;
        });
    }

    function generatePassword() {
        let chars = '';
        if (uppercaseCheck && uppercaseCheck.checked) chars += uppercaseChars;
        if (lowercaseCheck && lowercaseCheck.checked) chars += lowercaseChars;
        if (numbersCheck && numbersCheck.checked) chars += numberChars;
        if (symbolsCheck && symbolsCheck.checked) chars += symbolChars;

        if (chars === '') {
            alert('Lütfen en az bir karakter türü seçin!');
            return;
        }

        let password = '';
        const length = parseInt(lengthRange.value);
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            password += chars[randomIndex];
        }

        if (passwordOutput) {
            passwordOutput.value = password;
        }
    }

    // Sayfa açıldığında ilk şifreyi üret
    generatePassword();

    if (generateBtn) {
        generateBtn.addEventListener('click', generatePassword);
    }

    // Kopyalama Butonu
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (!passwordOutput.value) return;
            navigator.clipboard.writeText(passwordOutput.value).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Kopyalandı!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 1500);
            });
        });
    }
});
