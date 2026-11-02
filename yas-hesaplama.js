document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateAgeBtn');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const birthInput = document.getElementById('birthdate').value;
            if (!birthInput) {
                alert('Lütfen geçerli bir doğum tarihi seçin.');
                return;
            }

            const birthDate = new Date(birthInput);
            const today = new Date();

            if (birthDate > today) {
                alert('Doğum tarihi bugünden ileride bir tarih olamaz.');
                return;
            }

            // Yaş Hesaplama (Yıl, Ay, Gün)
            let years = today.getFullYear() - birthDate.getFullYear();
            let months = today.getMonth() - birthDate.getMonth();
            let days = today.getDate() - birthDate.getDate();

            if (days < 0) {
                months--;
                const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                days += prevMonth.getDate();
            }

            if (months < 0) {
                years--;
                months += 12;
            }

            // Toplam Gün Hesaplama
            const diffTime = Math.abs(today - birthDate);
            const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            // Sonraki Doğum Günü Hesaplama
            let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
            if (today > nextBirthday) {
                nextBirthday.setFullYear(today.getFullYear() + 1);
            }
            const diffNext = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

            // Ekrana Yazdırma
            document.getElementById('resAge').textContent = `${years} Yıl, ${months} Ay, ${days} Gün`;
            document.getElementById('resTotalDays').textContent = `${totalDays.toLocaleString('tr-TR')} Gün`;
            document.getElementById('resNextBirthday').textContent = `${diffNext} Gün kaldı`;

            document.getElementById('ageResultBox').style.display = 'block';
        });
    }
});
