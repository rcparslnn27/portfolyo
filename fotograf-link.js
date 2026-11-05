document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "66084a2ed26206677c6eb72f52220236";

  const ids = ["alan", "dosya", "onizleme", "yukle", "durum", "sonuc", "link", "kopyala"];
  const el = {};
  const eksik = [];

  ids.forEach((id) => {
    el[id] = document.getElementById(id);
    if (!el[id]) eksik.push(id);
  });

  if (eksik.length) {
    console.error("HTML'de bu ID'ler eksik:", eksik.join(", "));
    alert("HTML'de bu ID'ler eksik: " + eksik.join(", "));
    return;
  }

  let secilenDosya = null;
  let yukleniyor = false;

  async function yukle() {
    if (!secilenDosya || yukleniyor) return;

    yukleniyor = true;
    el.yukle.disabled = true;
    el.sonuc.style.display = "none";
    el.durum.textContent = "Yükleniyor...";

    const form = new FormData();
    form.append("image", secilenDosya);

    try {
      const res = await fetch("https://api.imgbb.com/1/upload?key=" + API_KEY, {
        method: "POST",
        body: form,
      });

      let veri;
      try {
        veri = await res.json();
      } catch (e) {
        throw new Error("Sunucudan geçersiz cevap geldi (HTTP " + res.status + ")");
      }

      if (!res.ok || !veri.success) {
        const mesaj = (veri.error && veri.error.message) || "HTTP " + res.status;
        throw new Error(mesaj);
      }

      el.link.value = veri.data.url;
      el.sonuc.style.display = "block";
      el.durum.textContent = "Hazır! ✅";
    } catch (err) {
      console.error("Yükleme hatası:", err);
      el.durum.textContent = "Hata: " + err.message;
    } finally {
      yukleniyor = false;
      el.yukle.disabled = false;
    }
  }

  function dosyaSec(dosya) {
    if (!dosya || !dosya.type.startsWith("image/")) {
      el.durum.textContent = "Lütfen geçerli bir görsel seç.";
      return;
    }
    if (dosya.size > 32 * 1024 * 1024) {
      el.durum.textContent = "Dosya 32 MB'den büyük olamaz.";
      return;
    }

    secilenDosya = dosya;
    
    // Önizleme görselini göster
    el.onizleme.src = URL.createObjectURL(dosya);
    el.onizleme.style.display = "block"; // 'inline-block' yerine 'block' veya esnek yapı
    
    el.sonuc.style.display = "none";
    el.yukle.disabled = false; // Yükle butonunu aktif et
    el.durum.textContent = dosya.name;

    // Fotoğraf seçilir seçilmez otomatik yükleme başlatılır:
    yukle();
  }

  // Alan <label> değilse tıklama olayını ekle
  if (el.alan && el.alan.tagName !== "LABEL") {
    el.alan.addEventListener("click", () => el.dosya.click());
  }

  if (el.dosya) {
    el.dosya.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        dosyaSec(e.target.files[0]);
        el.dosya.value = ""; // Aynı dosyanın tekrar seçilebilmesi için
      }
    });
  }

  if (el.alan) {
    el.alan.addEventListener("dragover", (e) => {
      e.preventDefault();
      el.alan.classList.add("uzerinde");
    });
    el.alan.addEventListener("dragleave", () => el.alan.classList.remove("uzerinde"));
    el.alan.addEventListener("drop", (e) => {
      e.preventDefault();
      el.alan.classList.remove("uzerinde");
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        dosyaSec(e.dataTransfer.files[0]);
      }
    });
  }

  // Ctrl+V ile yapıştırma
  document.addEventListener("paste", (e) => {
    const dosyalar = e.clipboardData ? e.clipboardData.files : [];
    if (dosyalar && dosyalar[0]) dosyaSec(dosyalar[0]);
  });

  if (el.yukle) {
    el.yukle.addEventListener("click", yukle);
  }

  if (el.kopyala) {
    el.kopyala.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(el.link.value);
      } catch (e) {
        el.link.select();
        document.execCommand("copy");
      }
      el.kopyala.textContent = "Kopyalandı ✓";
      setTimeout(() => (el.kopyala.textContent = "Kopyala"), 1500);
    });
  }
});
