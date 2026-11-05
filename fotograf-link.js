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
    return;
  }

  let secilenDosya = null;

  function dosyaSec(dosya) {
    if (!dosya || !dosya.type.startsWith("image/")) {
      el.durum.textContent = "Lütfen bir görsel seç.";
      return;
    }
    if (dosya.size > 32 * 1024 * 1024) {
      el.durum.textContent = "Dosya 32 MB'den büyük olamaz.";
      return;
    }
    secilenDosya = dosya;
    el.onizleme.src = URL.createObjectURL(dosya);
    el.onizleme.style.display = "inline-block";
    el.yukle.disabled = false;
    el.sonuc.style.display = "none";
    el.durum.textContent = dosya.name;
  }

  el.alan.addEventListener("click", () => el.dosya.click());
  el.dosya.addEventListener("change", () => dosyaSec(el.dosya.files[0]));

  el.alan.addEventListener("dragover", (e) => {
    e.preventDefault();
    el.alan.classList.add("uzerinde");
  });
  el.alan.addEventListener("dragleave", () => el.alan.classList.remove("uzerinde"));
  el.alan.addEventListener("drop", (e) => {
    e.preventDefault();
    el.alan.classList.remove("uzerinde");
    dosyaSec(e.dataTransfer.files[0]);
  });

  // Ctrl+V ile yapıştırma
  document.addEventListener("paste", (e) => {
    const dosyalar = e.clipboardData ? e.clipboardData.files : [];
    if (dosyalar && dosyalar[0]) dosyaSec(dosyalar[0]);
  });

  el.yukle.addEventListener("click", async () => {
    if (!secilenDosya) return;

    el.yukle.disabled = true;
    el.durum.textContent = "Yükleniyor...";

    const form = new FormData();
    form.append("image", secilenDosya);

    try {
      const res = await fetch("https://api.imgbb.com/1/upload?key=" + API_KEY, {
        method: "POST",
        body: form,
      });
      const veri = await res.json();

      if (!veri.success) {
        throw new Error((veri.error && veri.error.message) || "Yükleme başarısız");
      }

      el.link.value = veri.data.url;
      el.sonuc.style.display = "block";
      el.durum.textContent = "Hazır! ✅";
    } catch (err) {
      el.durum.textContent = "Hata: " + err.message;
    } finally {
      el.yukle.disabled = false;
    }
  });

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
});
